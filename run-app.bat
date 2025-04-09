@echo off

echo Starting Next.js server...
start /B npm run start

REM Wait for a few seconds to let the server start properly.
timeout /t 5 /nobreak >nul

echo Starting Electron app...
start /B npm run electron
