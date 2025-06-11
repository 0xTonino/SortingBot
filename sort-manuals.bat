@echo off
REM Manual Sorter Bot - Windows Batch Script
REM This script provides an easy way to run the manual sorter bot on Windows

echo.
echo ================================================================
echo                   📚 Manual Sorter Bot
echo ================================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed or not found in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if manual-sorter-bot.js exists
if not exist "manual-sorter-bot.js" (
    echo ❌ Error: manual-sorter-bot.js not found in current directory
    echo Please ensure you're running this from the correct folder
    pause
    exit /b 1
)

echo Welcome to the Manual Sorter Bot!
echo This tool will organize your PDF manuals based on their JSON metadata.
echo.

REM Get source directory
set /p "SOURCE_DIR=📁 Enter the path to your manuals folder: "

REM Validate source directory
if not exist "%SOURCE_DIR%" (
    echo ❌ Error: Directory "%SOURCE_DIR%" does not exist
    pause
    exit /b 1
)

echo.
echo Choose sorting mode:
echo 1. Dry run (preview what would be moved)
echo 2. Sort in place (organize within the source folder)
echo 3. Sort to new location (specify a different target folder)
echo.

set /p "CHOICE=Enter your choice (1, 2, or 3): "

if "%CHOICE%"=="1" (
    echo.
    echo 🧪 Running dry run preview...
    node manual-sorter-bot.js --dry-run "%SOURCE_DIR%"
    goto :end
)

if "%CHOICE%"=="2" (
    echo.
    echo ⚠️  This will move files within "%SOURCE_DIR%"
    echo.
    choice /M "Are you sure you want to proceed"
    if errorlevel 2 (
        echo Operation cancelled.
        goto :end
    )
    echo.
    echo 🚀 Starting sort in place...
    node manual-sorter-bot.js "%SOURCE_DIR%"
    goto :end
)

if "%CHOICE%"=="3" (
    set /p "TARGET_DIR=📁 Enter target directory path: "
    echo.
    echo 🚀 Starting sort to new location...
    node manual-sorter-bot.js "%SOURCE_DIR%" "%TARGET_DIR%"
    goto :end
)

echo ❌ Invalid choice. Please run the script again.

:end

echo.
echo Press any key to exit...
pause >nul 