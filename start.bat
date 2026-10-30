@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title Elifsu Genc Portfolio — Local Server

echo =====================================================================
echo   ELIFSU GENC — PORTFOLIO LOCAL DEVELOPMENT SERVER
echo =====================================================================
echo.

:: Verify that index.html exists in the project directory
if not exist "index.html" (
    color 0C
    echo [ERROR] Could not find "index.html" in:
    echo         %CD%
    echo.
    echo Please make sure "start.bat" is inside the main portfolio folder.
    echo.
    pause
    exit /b 1
)

:: Choose an available localhost port (default 8000, fallback 8080, 3000, 5500)
set "PORT=8000"
netstat -ano | findstr /R /C:":8000 .*LISTENING" >nul 2>&1
if !errorlevel! equ 0 (
    set "PORT=8080"
    netstat -ano | findstr /R /C:":8080 .*LISTENING" >nul 2>&1
    if !errorlevel! equ 0 (
        set "PORT=3000"
        netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul 2>&1
        if !errorlevel! equ 0 (
            set "PORT=5500"
        )
    )
)

set "URL=http://localhost:!PORT!"

:: Detect available runtime: 1) python, 2) py (Windows Python Launcher), 3) npx (Node.js)
where python >nul 2>&1
if !errorlevel! equ 0 (
    python -c "import http.server" >nul 2>&1
    if !errorlevel! equ 0 (
        echo [OK] Python detected.
        echo [OK] Starting local server at: !URL!
        echo [OK] Your default browser will open automatically...
        echo.
        echo Press CTRL+C or close this window at any time to stop the server.
        echo ---------------------------------------------------------------------
        start "" cmd /c "ping 127.0.0.1 -n 2 >nul & start !URL!"
        python -m http.server !PORT! --bind 127.0.0.1
        goto :server_stopped
    )
)

where py >nul 2>&1
if !errorlevel! equ 0 (
    py -c "import http.server" >nul 2>&1
    if !errorlevel! equ 0 (
        echo [OK] Python Launcher ^(py^) detected.
        echo [OK] Starting local server at: !URL!
        echo [OK] Your default browser will open automatically...
        echo.
        echo Press CTRL+C or close this window at any time to stop the server.
        echo ---------------------------------------------------------------------
        start "" cmd /c "ping 127.0.0.1 -n 2 >nul & start !URL!"
        py -m http.server !PORT! --bind 127.0.0.1
        goto :server_stopped
    )
)

where npx >nul 2>&1
if !errorlevel! equ 0 (
    echo [OK] Node.js ^(npx^) detected.
    echo [OK] Starting local server at: !URL!
    echo [OK] Your default browser will open automatically...
    echo.
    echo Press CTRL+C or close this window at any time to stop the server.
    echo ---------------------------------------------------------------------
    start "" cmd /c "ping 127.0.0.1 -n 3 >nul & start !URL!"
    call npx --yes serve -l !PORT!
    goto :server_stopped
)

:: If neither Python nor Node.js is available, show a clear error message
color 0C
echo =====================================================================
echo   [ERROR] MISSING REQUIRED DEPENDENCIES FOR LOCAL SERVER
echo =====================================================================
echo.
echo Neither Python nor Node.js ^(npx^) was found on this computer.
echo To run the local development server, please install ONE of the following:
echo.
echo   1. Python 3 ^(Recommended^): https://www.python.org/downloads/
echo      ^(Make sure to check "Add Python to PATH" during installation^)
echo.
echo   2. Node.js ^(LTS^):          https://nodejs.org/
echo.
echo =====================================================================
echo   HATA: YEREL SUNUCU ICIN GEREKLI BAGIMLILIKLAR BULUNAMADI
echo =====================================================================
echo Bilgisayarinizda Python veya Node.js yuklu gorunmuyor.
echo Yerel sunucuyu calistirmak icin yukaridaki baglantilardan Python 3
echo veya Node.js kurup bu dosyaya tekrar cift tiklayabilirsiniz.
echo.
pause
exit /b 1

:server_stopped
echo.
echo Server stopped.
pause
