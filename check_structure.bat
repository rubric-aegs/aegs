@echo off
echo === AEGS Directory Structure Check ===
echo.
echo Current directory: %CD%
echo.
echo Contents of current directory:
dir /b
echo.

echo Checking for required directories:
if exist "flask-server" (
    echo ✓ flask-server directory found
    echo Contents of flask-server:
    dir flask-server /b
) else (
    echo ✗ flask-server directory NOT found
)

echo.
if exist "client" (
    echo ✓ client directory found
    if exist "client\build" (
        echo ✓ client\build directory found
        echo Contents of client\build:
        dir client\build /b
    ) else (
        echo ✗ client\build directory NOT found
    )
) else (
    echo ✗ client directory NOT found
)

echo.
if exist "data" (
    echo ✓ data directory found
) else (
    echo ✗ data directory NOT found
)

echo.
echo Checking for required files:
if exist "flask-server\app.py" (
    echo ✓ flask-server\app.py found
) else (
    echo ✗ flask-server\app.py NOT found
)

if exist "client\build\index.html" (
    echo ✓ client\build\index.html found
) else (
    echo ✗ client\build\index.html NOT found
)

echo.
pause