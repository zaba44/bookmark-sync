@echo off
chcp 65001 >nul
echo ============================================
echo  Bookmark Sync - Budowanie rozszerzen v1.0.0
echo ============================================
echo.

cd /d %~dp0

REM Czyszczenie poprzednich paczek
echo Czyszcze poprzednie paczki...
if exist dist\chrome-extension.zip del dist\chrome-extension.zip
if exist dist\firefox-extension.xpi del dist\firefox-extension.xpi

REM Upewnij sie ze folder dist istnieje
if not exist dist mkdir dist

REM Przejdz do folderu rozszerzenia
cd extension

REM Czyszczenie poprzednich kompilacji JS
echo Czyszcze poprzednie kompilacje JS...
if exist dist rmdir /s /q dist
if exist chrome\dist rmdir /s /q chrome\dist
if exist firefox\dist rmdir /s /q firefox\dist

REM Kompiluj TypeScript
echo.
echo Kompiluje TypeScript...
call npm run build
if errorlevel 1 (
    echo BLAD kompilacji TypeScript!
    pause
    exit /b 1
)

echo.
echo Tworze paczki...
cd ..

REM Chrome ZIP
powershell -NoProfile -Command "Compress-Archive -Path 'extension\chrome\*' -DestinationPath 'dist\chrome-extension.zip' -Force"
if exist dist\chrome-extension.zip (echo OK chrome-extension.zip) else (echo BLAD chrome-extension.zip)

REM Firefox XPI - najpierw zip, potem zmien nazwe na xpi
powershell -NoProfile -Command "Compress-Archive -Path 'extension\firefox\*' -DestinationPath 'dist\firefox-extension-tmp.zip' -Force"
if exist dist\firefox-extension-tmp.zip (
    rename dist\firefox-extension-tmp.zip firefox-extension.xpi
    echo OK firefox-extension.xpi
) else (
    echo BLAD firefox-extension.xpi
)

echo.
echo ============================================
echo  Gotowe! Pliki w katalogu: dist\
echo ============================================
echo.
echo  chrome-extension.zip  - Chrome, Opera, Edge, Brave, Vivaldi
echo    Instalacja: Rozpakuj, potem chrome://extensions ^> Wczytaj rozpakowane
echo.
echo  firefox-extension.xpi - Firefox, Waterfox, LibreWolf i inne forki
echo    Instalacja: about:addons ^> ikona zebatki ^> Zainstaluj z pliku
echo.
pause
