@echo off
echo Starting AEGS Application...
cd /d %~dp0

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH!
    echo Please install Python and try again.
    pause
    exit /b 1
)

REM Debug: Show current directory
echo Current directory: %CD%
dir

REM Check if flask-server directory exists
if not exist "flask-server" (
    echo ERROR: flask-server directory not found!
    echo Current directory contents:
    dir
    pause
    exit /b 1
)

REM Change to flask-server directory
echo Changing to flask-server directory...
cd flask-server

REM Debug: Show flask-server directory contents
echo Flask-server directory contents:
dir

REM Check if app.py exists
if not exist "app.py" (
    echo ERROR: app.py not found in flask-server directory!
    pause
    exit /b 1
)

REM Start Flask server in background
echo Starting Flask server...
start "AEGS Flask Server" python app.py

REM Wait for server to start
echo Waiting for server to start...
timeout /t 5 >nul

REM Open the application in default browser
echo Opening AEGS in browser...
start "" "http://localhost:5000/aegs/home"

echo AEGS is now running!
echo Close this window to stop the application.
pausea