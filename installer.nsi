; NSIS Installer Script for AEGS
Name "AEGS Application"
Outfile "AEGSInstaller.exe"
InstallDir "$PROGRAMFILES\AEGS"
RequestExecutionLevel admin

; Modern UI
!include "MUI2.nsh"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"

; Main installation section
Section "Install" SecInstall
  SetOutPath $INSTDIR

  ; Create and populate flask-server directory
  CreateDirectory "$INSTDIR\flask-server"
  SetOutPath "$INSTDIR\flask-server"
  File /r "flask-server\*"

  ; Create and populate client/build directory  
  CreateDirectory "$INSTDIR\client"
  CreateDirectory "$INSTDIR\client\build"
  SetOutPath "$INSTDIR\client\build"
  File /r "client\build\*"

  ; Copy run.bat to root
  SetOutPath $INSTDIR
  File "run.bat"

  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  ; Create desktop shortcut
  CreateShortCut "$DESKTOP\AEGS.lnk" "$INSTDIR\run.bat" "" "$INSTDIR\run.bat" 0

  ; Create start menu entries
  CreateDirectory "$SMPROGRAMS\AEGS"
  CreateShortCut "$SMPROGRAMS\AEGS\AEGS.lnk" "$INSTDIR\run.bat"
  CreateShortCut "$SMPROGRAMS\AEGS\Uninstall.lnk" "$INSTDIR\Uninstall.exe"

  ; Registry entries for Add/Remove Programs
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGS" "DisplayName" "AEGS Application"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGS" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGS" "InstallLocation" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGS" "DisplayVersion" "1.0"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGS" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGS" "NoRepair" 1
SectionEnd