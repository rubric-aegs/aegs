@echo off
cd /d %~dp0
cd flask-server

start "" python app.py

timeout /t 3 >nul  :: Wait 3 seconds for server to start
start http://localhost:5000/aegs/home

exit
