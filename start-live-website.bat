@echo off
title LEMON - Live Server & Tunnel
echo ========================================================
echo  LEMON - Starting Local Server & Public Tunnel
echo ========================================================
echo.
echo Starting local Vite server on port 5173...
start /B npm run dev
timeout /t 3 /nobreak >nul

echo Starting public tunnel with fixed subdomain 'lemon-market'...
echo.
echo ========================================================
echo  PUBLIC WEBSITE LINK: https://lemon-market.loca.lt
echo ========================================================
echo.
echo NOTE for visitors:
echo If a verification screen appears on the first visit,
echo enter your public IP: 1.38.43.126 (or click 'Click to Continue').
echo.
echo Keep this window open while sharing your site!
echo Press Ctrl+C to stop.
echo.
npm run tunnel
