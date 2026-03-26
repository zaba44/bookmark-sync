using System.Text.Json;
using System.Text.Json.Serialization;
using System.Security.Cryptography;
using System.Text;

namespace BookmarkSyncHost;

// ============================================================
// Silnik synchronizacji różnicowej
// Odpowiada za: diff, merge, import, sync-state
// ============================================================

// ---- Modele sync ----

public class SyncState
{
    [JsonPropertyName("browsers")]
    public Dictionary<string, BrowserSyncInfo> Browsers { get; set; } = [];

    private static string GetPath(string syncDir) =>
        Path.Combine(syncDir, "sync-state.json");

    public static SyncState Load(string syncDir)
    {
        try
        {
            var path = GetPath(syncDir);
            if (File.Exists(path))
            {
                var json = File.ReadAllText(path);
                return JsonSerializer.Deserialize<SyncState>(json) ?? new SyncState();
            }
        }
        catch { }
        return new SyncState();
    }

    public void Save(string syncDir)
    {
        var json = JsonSerializer.Serialize(this, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(GetPath(syncDir), json);
    }
}

public class BrowserSyncInfo
{
    [JsonPropertyName("browser")]    public string Browser      { get; set; } = "";
    [JsonPropertyName("instanceId")] public string InstanceId   { get; set; } = "";
    [JsonPropertyName("lastSync")]   public string LastSync     { get; set; } = "";
    [JsonPropertyName("count")]      public int    Count        { get; set; }
}

public class BookmarkChange
{
    [JsonPropertyName("type")]      public string Type      { get; set; } = ""; // added/deleted/modified
    [JsonPropertyName("url")]       public string Url       { get; set; } = "";
    [JsonPropertyName("title")]     public string Title     { get; set; } = "";
    [JsonPropertyName("oldTitle")]  public string? OldTitle { get; set; }
    [JsonPropertyName("folder")]    public string Folder    { get; set; } = "";
    [JsonPropertyName("timestamp")] public string Timestamp { get; set; } = "";
    [JsonPropertyName("browser")]   public string Browser   { get; set; } = "";
}

public class ChangesLog
{
    [JsonPropertyName("lastUpdated")] public string LastUpdated { get; set; } = "";
    [JsonPropertyName("changes")]     public List<BookmarkChange> Changes { get; set; } = [];

    private static string GetPath(string syncDir) =>
        Path.Combine(syncDir, "changes.json");

    public static ChangesLog Load(string syncDir)
    {
        try
        {
            var path = GetPath(syncDir);
            if (File.Exists(path))
            {
                var json = File.ReadAllText(path);
                return JsonSerializer.Deserialize<ChangesLog>(json) ?? new ChangesLog();
            }
        }
        catch { }
        return new ChangesLog();
    }

    public void Save(string syncDir)
    {
        LastUpdated = DateTime.UtcNow.ToString("O");
        // Zachowaj max 500 ostatnich zmian
        if (Changes.Count > 500)
            Changes = Changes.TakeLast(500).ToList();
        var json = JsonSerializer.Serialize(this, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(GetPath(syncDir), json);
    }
}

// ---- Płaska mapa zakładek (url hash → dane) ----

public class BookmarkIndexEntry
{
    [JsonPropertyName("url")]          public string Url          { get; set; } = "";
    [JsonPropertyName("title")]        public string Title        { get; set; } = "";
    [JsonPropertyName("folder")]       public string Folder       { get; set; } = "";
    [JsonPropertyName("dateAdded")]    public long?  DateAdded    { get; set; }
    [JsonPropertyName("dateModified")] public long?  DateModified { get; set; }
    [JsonPropertyName("lastSeen")]     public string LastSeen     { get; set; } = "";
    [JsonPropertyName("seenBy")]       public List<string> SeenBy { get; set; } = [];
}

// ---- Silnik ----

public static class SyncEngine
{
    // Hash URL-a jako klucz indeksu
    public static string HashUrl(string url)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(url.Trim().ToLowerInvariant()));
        return Convert.ToHexString(bytes)[..16].ToLowerInvariant();
    }

    // Spłaszcz drzewo zakładek do listy (url → folder path)
    public static Dictionary<string, (BookmarkNode Node, string Folder)> FlattenTree(
        BookmarkNode root, string path = "")
    {
        var result = new Dictionary<string, (BookmarkNode, string)>();
        FlattenRecursive(root, path, result);
        return result;
    }

    private static void FlattenRecursive(
        BookmarkNode node, string path,
        Dictionary<string, (BookmarkNode, string)> result)
    {
        if (!string.IsNullOrEmpty(node.Url))
        {
            var key = HashUrl(node.Url);
            result[key] = (node, path);
        }
        if (node.Children == null) return;
        var folderName = string.IsNullOrEmpty(node.Title) ? path
            : (string.IsNullOrEmpty(path) ? node.Title : $"{path} > {node.Title}");
        foreach (var child in node.Children)
            FlattenRecursive(child, folderName, result);
    }

    // ---- Oblicz diff między poprzednim a nowym stanem ----

    public static List<BookmarkChange> ComputeDiff(
        Dictionary<string, BookmarkIndexEntry> oldIndex,
        Dictionary<string, (BookmarkNode Node, string Folder)> newFlat,
        string browser,
        string timestamp)
    {
        var changes = new List<BookmarkChange>();

        // Nowe lub zmodyfikowane
        foreach (var (hash, (node, folder)) in newFlat)
        {
            if (!oldIndex.TryGetValue(hash, out var old))
            {
                changes.Add(new BookmarkChange
                {
                    Type      = "added",
                    Url       = node.Url!,
                    Title     = node.Title,
                    Folder    = folder,
                    Timestamp = timestamp,
                    Browser   = browser
                });
            }
            else if (old.Title != node.Title)
            {
                // Wygrywa nowszy dateModified (jeśli dostępny)
                var nodeModified = node.DateModified ?? node.DateAdded ?? 0;
                var oldModified  = old.DateModified  ?? old.DateAdded  ?? 0;
                var winnerTitle  = nodeModified >= oldModified ? node.Title : old.Title;

                changes.Add(new BookmarkChange
                {
                    Type      = "modified",
                    Url       = node.Url!,
                    Title     = winnerTitle,
                    OldTitle  = old.Title,
                    Folder    = folder,
                    Timestamp = timestamp,
                    Browser   = browser
                });
            }
        }

        // Usunięte
        foreach (var (hash, old) in oldIndex)
        {
            if (!newFlat.ContainsKey(hash))
            {
                changes.Add(new BookmarkChange
                {
                    Type      = "deleted",
                    Url       = old.Url,
                    Title     = old.Title,
                    Folder    = old.Folder,
                    Timestamp = timestamp,
                    Browser   = browser
                });
            }
        }

        return changes;
    }

    // ---- Zbuduj nowy indeks z drzewa ----

    public static Dictionary<string, BookmarkIndexEntry> BuildIndex(
        Dictionary<string, (BookmarkNode Node, string Folder)> flat,
        Dictionary<string, BookmarkIndexEntry> oldIndex,
        string browser,
        string timestamp)
    {
        var index = new Dictionary<string, BookmarkIndexEntry>();

        foreach (var (hash, (node, folder)) in flat)
        {
            var seenBy = oldIndex.TryGetValue(hash, out var old)
                ? old.SeenBy.Union([browser]).ToList()
                : [browser];

            index[hash] = new BookmarkIndexEntry
            {
                Url          = node.Url!,
                Title        = node.Title,
                Folder       = folder,
                DateAdded    = node.DateAdded,
                DateModified = node.DateModified,
                LastSeen     = timestamp,
                SeenBy       = seenBy
            };
        }

        return index;
    }

    // ---- Scal dwa drzewa zakładek (merge przy imporcie) ----
    // Strategia: wygrywa nowszy timestamp (lastSeen z index)

    public static List<BookmarkChange> GetPendingChanges(
        Dictionary<string, BookmarkIndexEntry> cloudIndex,
        Dictionary<string, (BookmarkNode Node, string Folder)> localFlat,
        string lastSyncTime)
    {
        var pending = new List<BookmarkChange>();
        var lastSync = DateTime.TryParse(lastSyncTime, out var dt) ? dt : DateTime.MinValue;

        // Zakładki w chmurze których nie ma lokalnie
        foreach (var (hash, entry) in cloudIndex)
        {
            if (!localFlat.ContainsKey(hash))
            {
                var lastSeen = DateTime.TryParse(entry.LastSeen, out var ls) ? ls : DateTime.MinValue;
                if (lastSeen > lastSync)
                {
                    // Dodana po ostatnim sync → trzeba dodać lokalnie
                    pending.Add(new BookmarkChange
                    {
                        Type   = "added",
                        Url    = entry.Url,
                        Title  = entry.Title,
                        Folder = entry.Folder,
                    });
                }
                // else: była przed ostatnim sync → lokalnie usunięta świadomie, ignoruj
            }
        }

        // Zakładki lokalne których nie ma w chmurze → nowe, trzeba wyeksportować
        // (to obsługuje eksport, nie import)

        return pending;
    }
}
