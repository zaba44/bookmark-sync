# Bookmark Sync

Lokalna synchronizacja zakładek między przeglądarkami (Chrome, Firefox i forki) przez lokalny serwer HTTP.

## Jak to działa

```
Przeglądarka A ──→ Rozszerzenie ──→ BookmarkSyncHost.exe ──→ Katalog sync (OneDrive/dysk)
Przeglądarka B ──→ Rozszerzenie ──→ BookmarkSyncHost.exe ──→ Katalog sync (OneDrive/dysk)
```

Host działa jako aplikacja w zasobniku systemowym. Rozszerzenie komunikuje się z hostem przez `localhost`.

## Wymagania

- Windows 10/11 x64
- .NET 9 Desktop Runtime (dla wersji "małej") — [pobierz tutaj](https://dotnet.microsoft.com/download/dotnet/9.0)
- Konto w serwisie chmurowym (OneDrive, Google Drive, Dropbox) — opcjonalne, ale zalecane do sync między komputerami

## Instalacja

### 1. Host (BookmarkSyncHost.exe)

1. Pobierz najnowszy release z zakładki [Releases](../../releases)
2. Wypakuj do wybranego folderu (np. `C:\Program Files\BookmarkSync\`)
3. Uruchom `BookmarkSyncHost.exe`
4. Ikona pojawi się w zasobniku systemowym (prawy dolny róg)
5. Kliknij prawym → **Profile sync** → **+ Dodaj profil...** → wskaż katalog synchronizacji

### 2. Rozszerzenie Chrome / Opera / Edge / Brave

1. Pobierz `chrome-extension.zip` z zakładki [Releases](../../releases)
2. Rozpakuj do wybranego folderu
3. Otwórz `chrome://extensions` (lub odpowiednik w innej przeglądarce)
4. Włącz **Tryb dewelopera** (prawy górny róg)
5. Kliknij **Wczytaj rozpakowane** → wskaż folder z rozpakowanym rozszerzeniem
6. Przy pierwszym połączeniu host wyświetli okno akceptacji — nadaj nazwę i wybierz profil

### 2. Rozszerzenie Firefox / Waterfox / LibreWolf

1. Pobierz `firefox-extension.xpi` z zakładki [Releases](../../releases)
2. Otwórz `about:addons`
3. Kliknij ikonę koła zębatego → **Zainstaluj z pliku...**
4. Wskaż pobrany plik `.xpi`

## Funkcje

- ✅ Automatyczna synchronizacja przy każdej zmianie zakładki (debounce 5s)
- ✅ Harmonogram sprawdzania chmury (co 1-60 minut)
- ✅ Historia kopii zapasowych (do 50 wersji)
- ✅ Przywracanie z historii — podgląd bez zastępowania lub jako aktualny stan
- ✅ Filtry wykluczeń — foldery systemowe przeglądarek, własne wykluczenia
- ✅ Wiele profili synchronizacji (różne katalogi dla różnych zestawów zakładek)
- ✅ Eksport/Import HTML (Chrome) i JSON (Firefox)
- ✅ Odświeżanie favicon
- ✅ Dynamiczna ikona rozszerzenia (🟢 zsync / 🟡 chmura nowsza / 🔴 brak hosta)

## Struktura projektu

```
bookmark-sync/
├── host/                    ← C# .NET 9, aplikacja tray
│   ├── BookmarkSyncHost.csproj
│   ├── Program.cs
│   ├── Models.cs
│   ├── HttpServer.cs
│   ├── SyncEngine.cs
│   ├── ClientRegistry.cs
│   ├── TokenManager.cs
│   ├── TrayApp.cs
│   └── bookmark_sync.ico
├── extension/               ← TypeScript / WebExtension MV3
│   ├── src/
│   │   ├── background.ts
│   │   ├── popup.ts
│   │   ├── options.ts
│   │   ├── filters.ts
│   │   └── types.ts
│   ├── chrome/              ← gotowe rozszerzenie Chrome
│   ├── firefox/             ← gotowe rozszerzenie Firefox
│   ├── popup.html
│   ├── options.html
│   └── package.json
├── BUDUJ.bat                ← kompilacja hosta (4 warianty)
├── BUDUJ_ROZSZ.bat          ← budowanie rozszerzeń (ZIP + XPI)
└── README.md
```

## Kompilacja ze źródeł

### Host
```cmd
cd host
dotnet publish -c Release
# lub wszystkie 4 warianty:
BUDUJ.bat
```

### Rozszerzenia
```cmd
cd extension
npm install
npm run build
# lub gotowe paczki:
cd ..
BUDUJ_ROZSZ.bat
```

## Licencja

© 2026 Dominik Żabiński. Wszelkie prawa zastrzeżone.
