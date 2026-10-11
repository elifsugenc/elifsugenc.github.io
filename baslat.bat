@echo off
title Portfolio Yerel Sunucu
color 0B
echo ===================================================
echo     ELIFSU GENC - PORTFOLIO YEREL SUNUCUSU
echo ===================================================
echo.
echo Sunucu baslatiliyor... Lutfen bekleyin.
echo Tarayiciniz otomatik olarak acilacaktir.
echo.
echo (Kapatmak icin bu pencereyi kapatabilir veya CTRL+C yapabilirsiniz)
echo.

:: Biraz bekle ve tarayiciyi ac (sunucunun baslamasi icin 2 saniye gecikme)
ping 127.0.0.1 -n 3 > nul
start http://localhost:8000

:: Oncelikle npx (Node.js) ile baslatmayi dene
call npx serve -p 8000

:: Eger npx yoksa veya hata verdiyse Python ile baslatmayi dene
if %errorlevel% neq 0 (
    echo.
    echo Node.js (npx) bulunamadi veya calismadi. Python deneniyor...
    echo.
    python -m http.server 8000
)

:: Ikisi de calismazsa kullaniciya bilgi ver
if %errorlevel% neq 0 (
    echo.
    echo HATA: Ne Node.js (npx) ne de Python bilgisayarinizda yuklu gorunmuyor!
    echo Lutfen dogrudan index.html dosyasina cift tiklayarak acin.
    echo.
)

pause
