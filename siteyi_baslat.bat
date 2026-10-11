@echo off
echo Yerel sunucu baslatiliyor... Lutfen siteyi incelerken bu siyah pencereyi KAPATMAYIN.
echo.
echo Tarayicida http://localhost:8000 adresi aciliyor...
timeout /t 2 /nobreak > nul
start http://localhost:8000
node server.js
pause
