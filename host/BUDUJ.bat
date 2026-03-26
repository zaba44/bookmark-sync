@echo off
chcp 65001 >nul
echo ============================================
echo  Bookmark Sync Host - Kompilacja v1.0.0
echo ============================================
echo.

cd /d %~dp0

REM Czyszczenie poprzednich kompilacji
echo Czyszcze poprzednie kompilacje...
if exist bin rmdir /s /q bin
if exist obj rmdir /s /q obj
if exist dist rmdir /s /q dist
mkdir dist

echo.
echo [1/4] Maly folder (wymaga .NET 9)...
dotnet publish -c Release /p:PublishProfile=small-folder -o dist\small-folder
if errorlevel 1 goto error
echo OK

echo.
echo [2/4] Maly EXE (wymaga .NET 9)...
dotnet publish -c Release /p:PublishProfile=small-exe -o dist\small-exe
REM Usun plik PDB - niepotrzebny dla uzytkownikow
if exist dist\small-exe\BookmarkSyncHost.pdb del dist\small-exe\BookmarkSyncHost.pdb
if errorlevel 1 goto error
echo OK

echo.
echo [3/4] Duzy folder (standalone, bez .NET)...
dotnet publish -c Release /p:PublishProfile=full-folder -o dist\full-folder
if errorlevel 1 goto error
echo OK

echo.
echo [4/4] Duzy EXE (standalone, bez .NET)...
dotnet publish -c Release /p:PublishProfile=full-exe -o dist\full-exe
if exist dist\full-exe\BookmarkSyncHost.pdb del dist\full-exe\BookmarkSyncHost.pdb
if errorlevel 1 goto error
echo OK

echo.
echo ============================================
echo  Gotowe! Pliki w katalogu: dist\
echo ============================================
echo.
echo  small-folder\  - maly folder (~500KB), wymaga .NET 9 Desktop Runtime
echo  small-exe\     - maly EXE  (~500KB), wymaga .NET 9 Desktop Runtime
echo  full-folder\   - duzy folder (~150MB), standalone - bez .NET
echo  full-exe\      - duzy EXE  (~150MB), standalone - bez .NET
echo.
pause
goto end

:error
echo.
echo *** BLAD KOMPILACJI! ***
pause

:end
