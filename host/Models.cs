using System.Text.Json;
using System.Text.Json.Serialization;

namespace BookmarkSyncHost;

public class BookmarkNode
{
    [JsonPropertyName("id")]            public string Id             { get; set; } = "";
    [JsonPropertyName("title")]         public string Title          { get; set; } = "";
    [JsonPropertyName("url")]           public string? Url           { get; set; }
    [JsonPropertyName("dateAdded")]     public long?   DateAdded     { get; set; }
    [JsonPropertyName("dateModified")]  public long?   DateModified  { get; set; }
    [JsonPropertyName("children")]      public List<BookmarkNode>? Children { get; set; }
    [JsonPropertyName("specialFolder")] public string? SpecialFolder { get; set; }
}

public class SaveRequest
{
    [JsonPropertyName("bookmarks")]  public BookmarkNode? Bookmarks  { get; set; }
    [JsonPropertyName("timestamp")]  public string?       Timestamp  { get; set; }
    [JsonPropertyName("browser")]    public string?       Browser    { get; set; }
    [JsonPropertyName("instanceId")] public string?       InstanceId { get; set; }
}

public class ApiResponse
{
    [JsonPropertyName("success")] public bool    Success { get; set; }
    [JsonPropertyName("path")]    public string? Path    { get; set; }
    [JsonPropertyName("error")]   public string? Error   { get; set; }
}

// ---- Profile ----

public class SyncProfile
{
    [JsonPropertyName("id")]        public string Id        { get; set; } = Guid.NewGuid().ToString();
    [JsonPropertyName("name")]      public string Name      { get; set; } = "";
    [JsonPropertyName("path")]      public string Path      { get; set; } = "";
    [JsonPropertyName("isDefault")] public bool   IsDefault { get; set; } = false;
}

// ---- Config ----

public class AppConfig
{
    [JsonPropertyName("profiles")]        public List<SyncProfile> Profiles       { get; set; } = [];
    [JsonPropertyName("port")]            public int               Port           { get; set; } = 51062;
    [JsonPropertyName("autostart")]       public bool              Autostart      { get; set; } = false;
    [JsonPropertyName("allowedClients")]  public List<string>      AllowedClients { get; set; } = [];
    [JsonPropertyName("historyMaxFiles")] public int               HistoryMaxFiles{ get; set; } = 50;

    // Kompatybilność wsteczna — stary syncDirectory
    [JsonPropertyName("syncDirectory")]   public string? LegacySyncDirectory { get; set; }

    private static readonly string ConfigPath = Path.Combine(
        AppContext.BaseDirectory, "config.json");

    public SyncProfile? DefaultProfile =>
        Profiles.FirstOrDefault(p => p.IsDefault) ?? Profiles.FirstOrDefault();

    public SyncProfile? GetProfile(string? profileId) =>
        Profiles.FirstOrDefault(p => p.Id == profileId) ?? DefaultProfile;

    public static AppConfig Load()
    {
        try
        {
            if (File.Exists(ConfigPath))
            {
                var json   = File.ReadAllText(ConfigPath);
                var config = JsonSerializer.Deserialize<AppConfig>(json) ?? new AppConfig();

                // Migracja ze starego syncDirectory
                if (!string.IsNullOrWhiteSpace(config.LegacySyncDirectory) && config.Profiles.Count == 0)
                {
                    config.Profiles.Add(new SyncProfile
                    {
                        Id        = Guid.NewGuid().ToString(),
                        Name      = "Glowny",
                        Path      = config.LegacySyncDirectory,
                        IsDefault = true,
                    });
                    config.LegacySyncDirectory = null;
                    config.Save();
                }

                // Ustaw domyślny jeśli żaden nie jest
                if (config.Profiles.Count > 0 && !config.Profiles.Any(p => p.IsDefault))
                    config.Profiles[0].IsDefault = true;

                return config;
            }
        }
        catch { }
        return new AppConfig();
    }

    public void Save()
    {
        var json = JsonSerializer.Serialize(this, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(ConfigPath, json);
    }
}
