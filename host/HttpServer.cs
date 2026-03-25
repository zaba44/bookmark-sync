using System.Net;
using System.Text;
using System.Text.Json;

namespace BookmarkSyncHost;

public class HttpServer
{
    private readonly AppConfig      _config;
    private readonly ClientRegistry _registry;
    private HttpListener?            _listener;
    private CancellationTokenSource? _cts;

    public event Action<string>? OnLog;

    public HttpServer(AppConfig config, ClientRegistry registry)
    {
        _config   = config;
        _registry = registry;
    }

    public void Start()
    {
        _cts      = new CancellationTokenSource();
        _listener = new HttpListener();
        _listener.Prefixes.Add($"http://localhost:{_config.Port}/");
        try { _listener.Start(); OnLog?.Invoke($"Serwer na porcie {_config.Port}"); }
        catch (HttpListenerException ex) { OnLog?.Invoke($"Blad: {ex.Message}"); return; }
        Task.Run(() => ListenLoop(_cts.Token));
    }

    public void Stop() { _cts?.Cancel(); _listener?.Stop(); }
    public void Restart() { Stop(); Thread.Sleep(300); Start(); }

    private async Task ListenLoop(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested && _listener?.IsListening == true)
        {
            try { var ctx = await _listener.GetContextAsync().WaitAsync(ct); _ = Task.Run(() => HandleRequest(ctx), ct); }
            catch (OperationCanceledException) { break; }
            catch (Exception ex) { OnLog?.Invoke($"Blad petli: {ex.Message}"); }
        }
    }

    private async Task HandleRequest(HttpListenerContext context)
    {
        var req  = context.Request;
        var resp = context.Response;

        resp.Headers.Add("Access-Control-Allow-Origin",  "*");
        resp.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        resp.Headers.Add("Access-Control-Allow-Headers", "Content-Type, X-Instance-Id, X-Browser");

        if (req.HttpMethod == "OPTIONS") { resp.StatusCode = 204; resp.Close(); return; }

        var path = req.Url?.AbsolutePath ?? "/";
        OnLog?.Invoke($"{req.HttpMethod} {path} [{req.Headers["X-Browser"] ?? "?"}]");

        try
        {
            object result = path switch
            {
                "/ping"            => HandlePing(req),
                "/save"            => await HandleSave(req),
                "/import"          => HandleImport(req),
                "/status"          => HandleStatus(req),
                "/history/list"    => HandleHistoryList(req),
                "/history/get"     => HandleHistoryGet(req),
                "/history/restore" => await HandleHistoryRestore(req),
                _                  => new ApiResponse { Success = false, Error = "Unknown endpoint" }
            };
            await WriteJson(resp, result);
        }
        catch (Exception ex)
        {
            OnLog?.Invoke($"Blad {path}: {ex.Message}");
            await WriteJson(resp, new ApiResponse { Success = false, Error = ex.Message }, 500);
        }
    }

    // ---- Pomocnik — pobierz katalog sync dla danego klienta ----
    private string? GetSyncDir(string instanceId)
    {
        var profileId = _registry.GetProfileId(instanceId);
        return _config.GetProfile(profileId)?.Path;
    }

    // ---- /ping ----
    private ApiResponse HandlePing(HttpListenerRequest req)
    {
        if (_config.Profiles.Count == 0)
            return new ApiResponse { Success = false, Error = "NO_PROFILES" };

        var status = _registry.RegisterClient(
            req.Headers["X-Instance-Id"] ?? "unknown",
            req.Headers["X-Browser"]     ?? "Unknown");
        return status switch
        {
            ClientStatus.Allowed => new ApiResponse { Success = true },
            ClientStatus.Pending => new ApiResponse { Success = false, Error = "PENDING_APPROVAL" },
            _                    => new ApiResponse { Success = false, Error = "CLIENT_NOT_ALLOWED" }
        };
    }

    // ---- /save ----
    private async Task<ApiResponse> HandleSave(HttpListenerRequest req)
    {
        var instanceId = req.Headers["X-Instance-Id"] ?? "unknown";
        var browser    = req.Headers["X-Browser"]     ?? "Unknown";
        if (!_registry.IsAllowed(instanceId))   return new ApiResponse { Success = false, Error = "CLIENT_NOT_ALLOWED" };

        var syncDir = GetSyncDir(instanceId);
        if (string.IsNullOrWhiteSpace(syncDir)) return new ApiResponse { Success = false, Error = "NO_SYNC_DIRECTORY" };

        using var reader = new StreamReader(req.InputStream, req.ContentEncoding);
        var body = await reader.ReadToEndAsync();
        SaveRequest? saveReq;
        try { saveReq = JsonSerializer.Deserialize<SaveRequest>(body); }
        catch { return new ApiResponse { Success = false, Error = "INVALID_JSON" }; }
        if (saveReq?.Bookmarks == null) return new ApiResponse { Success = false, Error = "NO_BOOKMARKS" };

        return SaveWithDiff(saveReq, instanceId, browser, syncDir);
    }

    private ApiResponse SaveWithDiff(SaveRequest req, string instanceId, string browser, string syncDir)
    {
        try
        {
            Directory.CreateDirectory(syncDir);
            var mainFile  = Path.Combine(syncDir, "bookmarks.json");
            var timestamp = req.Timestamp ?? DateTime.UtcNow.ToString("O");

            var oldIndex = LoadOldIndex(mainFile);
            var newFlat  = SyncEngine.FlattenTree(req.Bookmarks!);
            var changes  = SyncEngine.ComputeDiff(oldIndex, newFlat, browser, timestamp);
            var newIndex = SyncEngine.BuildIndex(newFlat, oldIndex, browser, timestamp);

            var output = new { version = 2, timestamp, browser, generator = "BookmarkSyncHost/2.0", bookmarks = req.Bookmarks, index = newIndex };
            var json   = JsonSerializer.Serialize(output, new JsonSerializerOptions { WriteIndented = true });
            var tmp    = mainFile + ".tmp";
            File.WriteAllText(tmp, json, Encoding.UTF8);
            File.Move(tmp, mainFile, overwrite: true);

            if (changes.Count > 0)
            {
                var log = ChangesLog.Load(syncDir);
                log.Changes.AddRange(changes);
                log.Save(syncDir);
                OnLog?.Invoke($"Diff: +{changes.Count(c => c.Type == "added")} ~{changes.Count(c => c.Type == "modified")} -{changes.Count(c => c.Type == "deleted")}");
            }

            var state = SyncState.Load(syncDir);
            state.Browsers[instanceId] = new BrowserSyncInfo { Browser = browser, InstanceId = instanceId, LastSync = timestamp, Count = newFlat.Count };
            state.Save(syncDir);

            SaveHistory(json, syncDir);
            OnLog?.Invoke($"Zapisano {newFlat.Count} zakladek [{_config.GetProfile(_registry.GetProfileId(instanceId))?.Name ?? "?"}]");
            return new ApiResponse { Success = true, Path = mainFile };
        }
        catch (Exception ex) { return new ApiResponse { Success = false, Error = ex.Message }; }
    }

    // ---- /import ----
    private ApiResponse HandleImport(HttpListenerRequest req)
    {
        var instanceId = req.Headers["X-Instance-Id"] ?? "unknown";
        if (!_registry.IsAllowed(instanceId)) return new ApiResponse { Success = false, Error = "CLIENT_NOT_ALLOWED" };

        var syncDir = GetSyncDir(instanceId);
        if (string.IsNullOrWhiteSpace(syncDir)) return new ApiResponse { Success = false, Error = "NO_SYNC_DIRECTORY" };

        var mainFile = Path.Combine(syncDir, "bookmarks.json");
        if (!File.Exists(mainFile)) return new ApiResponse { Success = false, Error = "NO_BOOKMARKS_FILE" };

        try { return new ApiResponse { Success = true, Path = File.ReadAllText(mainFile) }; }
        catch (Exception ex) { return new ApiResponse { Success = false, Error = ex.Message }; }
    }

    // ---- /status ----
    private ApiResponse HandleStatus(HttpListenerRequest req)
    {
        var instanceId = req.Headers["X-Instance-Id"] ?? "unknown";
        var profileId  = _registry.GetProfileId(instanceId);
        var profile    = _config.GetProfile(profileId);
        var syncDir    = profile?.Path ?? "";
        var lastMod    = "";

        try
        {
            var mainFile = Path.Combine(syncDir, "bookmarks.json");
            if (File.Exists(mainFile))
                lastMod = File.GetLastWriteTimeUtc(mainFile).ToString("O");
        }
        catch { }

        var result = new
        {
            success      = true,
            directory    = syncDir,
            profileId    = profile?.Id ?? "",
            profileName  = profile?.Name ?? "",
            lastModified = lastMod,
        };
        return new ApiResponse { Success = true, Path = JsonSerializer.Serialize(result) };
    }

    // ---- /history/list ----
    private ApiResponse HandleHistoryList(HttpListenerRequest req)
    {
        var instanceId = req.Headers["X-Instance-Id"] ?? "unknown";
        if (!_registry.IsAllowed(instanceId)) return new ApiResponse { Success = false, Error = "CLIENT_NOT_ALLOWED" };

        var syncDir = GetSyncDir(instanceId);
        if (string.IsNullOrWhiteSpace(syncDir)) return new ApiResponse { Success = false, Error = "NO_SYNC_DIRECTORY" };

        try
        {
            var historyDir = Path.Combine(syncDir, "history");
            if (!Directory.Exists(historyDir)) return new ApiResponse { Success = true, Path = "[]" };

            var entries = Directory.GetFiles(historyDir, "*.json")
                .OrderByDescending(f => f)
                .Take(100)
                .Select(f =>
                {
                    var fi  = new FileInfo(f);
                    var count = 0; var ts = fi.LastWriteTimeUtc.ToString("O"); var br = "-";
                    try
                    {
                        var doc = JsonDocument.Parse(File.ReadAllText(f));
                        if (doc.RootElement.TryGetProperty("timestamp", out var tsProp)) ts = tsProp.GetString() ?? ts;
                        if (doc.RootElement.TryGetProperty("browser",   out var brProp)) br = brProp.GetString() ?? br;
                        if (doc.RootElement.TryGetProperty("index",     out var idx))    count = idx.EnumerateObject().Count();
                    }
                    catch { }
                    return new { filename = fi.Name, timestamp = ts, browser = br, count, sizeKb = (int)(fi.Length / 1024) };
                }).ToList();

            return new ApiResponse { Success = true, Path = JsonSerializer.Serialize(entries) };
        }
        catch (Exception ex) { return new ApiResponse { Success = false, Error = ex.Message }; }
    }

    // ---- /history/get ----
    private ApiResponse HandleHistoryGet(HttpListenerRequest req)
    {
        var instanceId = req.Headers["X-Instance-Id"] ?? "unknown";
        if (!_registry.IsAllowed(instanceId)) return new ApiResponse { Success = false, Error = "CLIENT_NOT_ALLOWED" };

        var syncDir = GetSyncDir(instanceId);
        var file    = req.QueryString["file"] ?? "";
        if (string.IsNullOrWhiteSpace(file) || file.Contains("..") || file.Contains('/') || file.Contains('\\'))
            return new ApiResponse { Success = false, Error = "INVALID_FILENAME" };

        var filePath = Path.Combine(syncDir ?? "", "history", file);
        if (!File.Exists(filePath)) return new ApiResponse { Success = false, Error = "FILE_NOT_FOUND" };

        try { return new ApiResponse { Success = true, Path = File.ReadAllText(filePath) }; }
        catch (Exception ex) { return new ApiResponse { Success = false, Error = ex.Message }; }
    }

    // ---- /history/restore ----
    private async Task<ApiResponse> HandleHistoryRestore(HttpListenerRequest req)
    {
        var instanceId = req.Headers["X-Instance-Id"] ?? "unknown";
        if (!_registry.IsAllowed(instanceId)) return new ApiResponse { Success = false, Error = "CLIENT_NOT_ALLOWED" };

        var syncDir = GetSyncDir(instanceId);
        if (string.IsNullOrWhiteSpace(syncDir)) return new ApiResponse { Success = false, Error = "NO_SYNC_DIRECTORY" };

        using var reader = new StreamReader(req.InputStream, req.ContentEncoding);
        var body = await reader.ReadToEndAsync();
        string filename;
        try { filename = JsonDocument.Parse(body).RootElement.GetProperty("filename").GetString() ?? ""; }
        catch { return new ApiResponse { Success = false, Error = "INVALID_JSON" }; }

        if (string.IsNullOrWhiteSpace(filename) || filename.Contains("..") || filename.Contains('/') || filename.Contains('\\'))
            return new ApiResponse { Success = false, Error = "INVALID_FILENAME" };

        var mainFile    = Path.Combine(syncDir, "bookmarks.json");
        var historyFile = Path.Combine(syncDir, "history", filename);
        if (!File.Exists(historyFile)) return new ApiResponse { Success = false, Error = "FILE_NOT_FOUND" };

        try
        {
            if (File.Exists(mainFile))
            {
                var backupName = $"{DateTime.Now:yyyy-MM-dd_HH-mm-ss}_before_restore.json";
                File.Copy(mainFile, Path.Combine(syncDir, "history", backupName));
            }
            File.Copy(historyFile, mainFile, overwrite: true);
            OnLog?.Invoke($"Przywrocono: {filename}");
            return new ApiResponse { Success = true };
        }
        catch (Exception ex) { return new ApiResponse { Success = false, Error = ex.Message }; }
    }

    // ---- Pomocniki ----
    private static Dictionary<string, BookmarkIndexEntry> LoadOldIndex(string mainFile)
    {
        try
        {
            if (!File.Exists(mainFile)) return [];
            var doc = JsonDocument.Parse(File.ReadAllText(mainFile));
            if (doc.RootElement.TryGetProperty("index", out var idx))
                return JsonSerializer.Deserialize<Dictionary<string, BookmarkIndexEntry>>(idx.GetRawText()) ?? [];
        }
        catch { }
        return [];
    }

    private void SaveHistory(string json, string syncDir)
    {
        try
        {
            var dir = Path.Combine(syncDir, "history");
            Directory.CreateDirectory(dir);
            File.WriteAllText(Path.Combine(dir, $"{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.json"), json, Encoding.UTF8);
            var files = Directory.GetFiles(dir, "*.json").OrderBy(f => f).ToArray();
            foreach (var old in files.Take(Math.Max(0, files.Length - _config.HistoryMaxFiles)))
                File.Delete(old);
        }
        catch { }
    }

    private static async Task WriteJson(HttpListenerResponse resp, object data, int status = 200)
    {
        var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(data));
        resp.StatusCode      = status;
        resp.ContentType     = "application/json; charset=utf-8";
        resp.ContentLength64 = bytes.Length;
        await resp.OutputStream.WriteAsync(bytes);
        resp.Close();
    }
}
