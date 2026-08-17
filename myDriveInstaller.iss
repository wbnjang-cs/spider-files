[Setup]
AppId={{FFBECB02-98EE-4060-86A6-ADACBA93D357}}
AppName=myDrive
AppVersion=1.0
DefaultDirName={autopf}\myDrive
DefaultGroupName=myDrive
OutputBaseFilename=myDrive-Setup
Compression=lzma
SolidCompression=yes
[Files]
Source: "backend\dist\myDrive\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
[Icons]
Name: "{group}\myDrive"; Filename: "{app}\myDrive.exe"
Name: "{autodesktop}\myDrive"; Filename: "{app}\myDrive.exe"; Tasks: desktopicon
Name: "{userstartup}\myDrive"; Filename: "{app}\myDrive.exe"; Tasks: startupicon
[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional icons:"
Name: "startupicon"; Description: "Run myDrive when Windows starts"; GroupDescription: "Additional icons:"; Flags: unchecked