@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul 2>&1
title Elifsu Genc Portfolio — YENI LAYOUT 01 (Local Server)
color 0B

:: Ensure working directory is the directory containing this script
cd /d "%~dp0"

echo ===============================================================================
echo   ELIFSU GENC — PORTFOLIO [BRANCH: yeni-layout01]
echo   Project-Focused Editorial Layout (Local Preview Launcher)
echo ===============================================================================
echo.

if not exist "index.html" (
    color 0C
    echo [ERROR / HATA] Could not find index.html in:
    echo   %CD%
    echo.
    pause
    exit /b 1
)

:: Default to 8001 so it can run simultaneously with main (port 8000)
set "PORT=8001"
for %%P in (8001 8080 3000 5500 8000) do (
    netstat -ano 2>nul | findstr /R /C:":%%P .*LISTENING" >nul 2>&1
    if !errorlevel! neq 0 (
        set "PORT=%%P"
        goto :port_found
    )
)

:port_found
set "URL=http://localhost:%PORT%/"

:: ---------------------------------------------------------------------------
:: 1. Try Python (python)
:: ---------------------------------------------------------------------------
where python >nul 2>&1
if %errorlevel% equ 0 (
    python --version >nul 2>&1
    if !errorlevel! equ 0 (
        echo [OK] Python detected. Starting local server on %URL%
        echo [INFO] Can run side-by-side with main branch ^(port 8000^).
        echo [INFO] Opening your default browser automatically...
        echo.
        start "" "%URL%"
        python -m http.server %PORT% --bind 127.0.0.1
        goto :eof
    )
)

:: ---------------------------------------------------------------------------
:: 2. Try Windows Python Launcher (py)
:: ---------------------------------------------------------------------------
where py >nul 2>&1
if %errorlevel% equ 0 (
    py -3 --version >nul 2>&1
    if !errorlevel! equ 0 (
        echo [OK] Python Launcher ^(py^) detected. Starting local server on %URL%
        echo [INFO] Can run side-by-side with main branch ^(port 8000^).
        echo [INFO] Opening your default browser automatically...
        echo.
        start "" "%URL%"
        py -3 -m http.server %PORT% --bind 127.0.0.1
        goto :eof
    )
)

:: ---------------------------------------------------------------------------
:: 3. Try Node.js (npx serve)
:: ---------------------------------------------------------------------------
where npx >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js ^(npx^) detected. Starting local server on %URL%
    echo [INFO] Can run side-by-side with main branch ^(port 8000^).
    echo [INFO] Opening your default browser automatically...
    echo.
    start "" "%URL%"
    call npx --yes serve -l %PORT% .
    goto :eof
)

color 0C
echo ===============================================================================
echo   [ERROR / HATA] Missing Local Server Runtime
echo ===============================================================================
echo.
echo   Neither Python nor Node.js ^(npx^) was found on your system PATH.
echo   Please install Python 3 ^(https://www.python.org/downloads/^) or Node.js.
echo.
pause
exit /b 1
