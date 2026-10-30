@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul 2>&1
title Elifsu Genc Portfolio — YENI LAYOUT 01 (Yerel Sunucu)
color 0B

:: Always run inside the folder where this .bat file is located
cd /d "%~dp0"

echo ===============================================================================
echo   ELIFSU GENC — PORTFOLIO [BRANCH: yeni-layout01]
echo   Project-Focused Editorial Layout (Yerel Onizleme Sunucusu)
echo ===============================================================================
echo.

if not exist "index.html" (
    color 0C
    echo [HATA / ERROR] Bu klasorde index.html bulunamadi:
    echo   %CD%
    echo.
    pause
    exit /b 1
)

:: Use port 8001 by default so it can run side-by-side with main (port 8000)
set "PORT=8001"
for %%P in (8001 8080 3000 5500) do (
    netstat -ano 2>nul | findstr /R /C:":%%P .*LISTENING" >nul 2>&1
    if !errorlevel! neq 0 (
        set "PORT=%%P"
        goto :port_ready
    )
)

:port_ready
set "URL=http://localhost:%PORT%/"

:: 1) Check Python (python)
where python >nul 2>&1
if %errorlevel% equ 0 (
    python --version >nul 2>&1
    if !errorlevel! equ 0 (
        echo [OK] Python bulundu. Yeni tasarim sunucusu baslatiliyor: %URL%
        echo [BILGI] Main branch ^(port 8000^) ile ayni anda yan yana calisabilir.
        echo [BILGI] Tarayiciniz otomatik olarak aciliyor...
        echo [BILGI] Durdurmak icin bu pencereyi kapatabilir veya CTRL+C yapabilirsiniz.
        echo.
        start "" "%URL%"
        python -m http.server %PORT% --bind 127.0.0.1
        goto :eof
    )
)

:: 2) Check Python Launcher (py)
where py >nul 2>&1
if %errorlevel% equ 0 (
    py -3 --version >nul 2>&1
    if !errorlevel! equ 0 (
        echo [OK] Python Launcher ^(py^) bulundu. Yeni tasarim sunucusu baslatiliyor: %URL%
        echo [BILGI] Main branch ^(port 8000^) ile ayni anda yan yana calisabilir.
        echo [BILGI] Tarayiciniz otomatik olarak aciliyor...
        echo.
        start "" "%URL%"
        py -3 -m http.server %PORT% --bind 127.0.0.1
        goto :eof
    )
)

:: 3) Check Node.js (npx)
where npx >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js ^(npx^) bulundu. Yeni tasarim sunucusu baslatiliyor: %URL%
    echo [BILGI] Main branch ^(port 8000^) ile ayni anda yan yana calisabilir.
    echo [BILGI] Tarayiciniz otomatik olarak aciliyor...
    echo.
    start "" "%URL%"
    call npx --yes serve -l %PORT% .
    goto :eof
)

color 0C
echo ===============================================================================
echo   [HATA / MISSING DEPENDENCY] Yerel sunucu baslatilamadi
echo ===============================================================================
echo.
echo   Bilgisayarinizda Python veya Node.js bulunamadi.
echo   Lutfen asagidakilerden birini yukleyin:
echo     - Python 3: https://www.python.org/downloads/
echo     - Node.js : https://nodejs.org/
echo.
pause
exit /b 1
