namespace BookmarkSyncHost;

public enum ClientStatus { Allowed, Pending, NotAllowed }

public class ConnectedClient
{
    public string InstanceId  { get; set; } = "";
    public string BrowserName { get; set; } = "";
    public string DisplayName { get; set; } = ""; // nazwa nadana przez użytkownika
    public string ProfileId   { get; set; } = ""; // ID profilu synchronizacji
    public DateTime LastSeen  { get; set; } = DateTime.Now;
}

public class ClientRegistry
{
    private readonly AppConfig _config;
    private readonly Dictionary<string, ConnectedClient> _clients = [];
    private readonly Lock _lock = new();

    public Func<ConnectedClient, (bool allowed, string displayName, string profileId)>? OnNewClientRequest;

    public ClientRegistry(AppConfig config)
    {
        _config = config;
        // Załaduj znanych klientów z config
        foreach (var id in config.AllowedClients)
        {
            _clients[id] = new ConnectedClient { InstanceId = id };
        }
    }

    public ClientStatus RegisterClient(string instanceId, string browserName)
    {
        lock (_lock)
        {
            if (_clients.TryGetValue(instanceId, out var existing))
            {
                if (_config.AllowedClients.Contains(instanceId))
                {
                    existing.LastSeen    = DateTime.Now;
                    existing.BrowserName = browserName;
                    return ClientStatus.Allowed;
                }
                return ClientStatus.NotAllowed;
            }

            // Nowy klient — zapytaj użytkownika
            var newClient = new ConnectedClient
            {
                InstanceId  = instanceId,
                BrowserName = browserName,
                DisplayName = browserName,
                ProfileId   = _config.DefaultProfile?.Id ?? "",
                LastSeen    = DateTime.Now,
            };
            _clients[instanceId] = newClient;

            if (OnNewClientRequest == null) return ClientStatus.Pending;

            var (allowed, displayName, profileId) = OnNewClientRequest(newClient);
            if (allowed)
            {
                newClient.DisplayName = displayName;
                newClient.ProfileId   = profileId;
                _config.AllowedClients.Add(instanceId);
                _config.Save();
                return ClientStatus.Allowed;
            }
            else
            {
                _clients.Remove(instanceId);
                return ClientStatus.NotAllowed;
            }
        }
    }

    public bool IsAllowed(string instanceId)
    {
        lock (_lock)
        {
            return _config.AllowedClients.Contains(instanceId);
        }
    }

    public string GetProfileId(string instanceId)
    {
        lock (_lock)
        {
            if (_clients.TryGetValue(instanceId, out var client))
                return client.ProfileId;
            return _config.DefaultProfile?.Id ?? "";
        }
    }

    public void RevokeClient(string instanceId)
    {
        lock (_lock)
        {
            _clients.Remove(instanceId);
            _config.AllowedClients.Remove(instanceId);
            _config.Save();
        }
    }

    public List<ConnectedClient> GetAllowed()
    {
        lock (_lock)
        {
            return _clients.Values
                .Where(c => _config.AllowedClients.Contains(c.InstanceId))
                .ToList();
        }
    }
}
