@echo off
title NEXUS - Academic Management System

echo.
echo ======================================
echo   NEXUS SETUP SCRIPT FOR WINDOWS
echo ======================================
echo.

if not exist .env (
    echo NEXUS SETUP: .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo WARNING: .env file created with placeholder values.
    echo IMPORTANT: Edit .env and add your Supabase credentials:
    echo   - VITE_SUPABASE_URL
    echo   - VITE_SUPABASE_ANON_KEY
    echo.
    pause
) else (
    echo NEXUS SETUP: .env file found. Proceeding...
    echo.
)

echo Installing dependencies (this may take 1-2 minutes)...
call npm install

if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo ======================================
echo   STARTING NEXUS SERVER
echo ======================================
echo.
echo Server will be available at:
echo   http://localhost:5000
echo.
echo Opening browser in 3 seconds...
echo.

timeout /t 3 /nobreak

start http://localhost:5000

echo Starting development server...
call npm run dev

pause
