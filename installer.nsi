Outfile "AEGSInstaller.exe"
InstallDir "$PROGRAMFILES\AEGS"
RequestExecutionLevel admin

Section "Install"
  SetOutPath $INSTDIR

  ; Copy files
  File /r "client\build\*.*"
  File /r "flask-server\*.*"
  File "run.bat"

  ; Create a desktop shortcut
  CreateShortCut "$DESKTOP\AEGS.lnk" "$INSTDIR\run.bat"
SectionEnd
