@echo off
REM AI Student Toolkit - Development Start Script for Windows

echo.
echo 🚀 AI Student Toolkit - Starting Development Server
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        exit /b 1
    )
    echo ✅ Dependencies installed
    echo.
)

REM Start the development server
echo 🔥 Starting Next.js development server...
echo.
echo 📍 Visit: http://localhost:3000
echo 📍 Press Ctrl+C to stop
echo.

call npm run dev

pause
