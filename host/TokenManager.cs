namespace BookmarkSyncHost;

// ============================================================
// Zarządzanie tokenem bezpieczeństwa
// Token jest generowany raz i zapisywany w katalogu sync
// jako token.txt — wtyczka czyta go stamtąd
// ============================================================

public static class TokenManager
{
    /// <summary>
    /// Zwraca token z pliku. Jeśli nie istnieje — generuje nowy.
    /// </summary>
    public static string EnsureToken(string syncDirectory)
    {
        if (string.IsNullOrWhiteSpace(syncDirectory))
            throw new InvalidOperationException("Katalog sync nie jest ustawiony");

        Directory.CreateDirectory(syncDirectory);
        var tokenFile = Path.Combine(syncDirectory, "token.txt");

        if (File.Exists(tokenFile))
        {
            var existing = File.ReadAllText(tokenFile).Trim();
            if (!string.IsNullOrWhiteSpace(existing))
                return existing;
        }

        // Generuj nowy token: 32 losowe bajty → hex string
        var tokenBytes = new byte[32];
        System.Security.Cryptography.RandomNumberGenerator.Fill(tokenBytes);
        var token = Convert.ToHexString(tokenBytes).ToLowerInvariant();

        File.WriteAllText(tokenFile, token);
        return token;
    }

    /// <summary>
    /// Regeneruj token (np. gdy użytkownik chce odwołać dostęp wszystkim wtyczkom)
    /// </summary>
    public static string RegenerateToken(string syncDirectory)
    {
        var tokenFile = Path.Combine(syncDirectory, "token.txt");
        if (File.Exists(tokenFile)) File.Delete(tokenFile);
        return EnsureToken(syncDirectory);
    }
}
