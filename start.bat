@echo off
REM BrickReel Backend Startup Script for Windows
REM This script installs dependencies and starts the development server

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         BrickReel Backend - Development Server               ║
echo ║              Starting on http://localhost:3000                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo Dependencies installed successfully!
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  Please update .env with your configuration:
    echo    - PORT=3000
    echo    - CORS_ORIGIN=http://localhost:3001
    echo    - Add Supabase credentials (optional for MVP)
    echo.
)

echo Starting development server...
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
