[Setup]
AppId={{5FAC8F2D-2A8D-4904-B882-E770C8B05E7D}}
AppName=Spider File
AppVersion=1.0
DefaultDirName={autopf}\SpiderFile
DefaultGroupName=Spider File
OutputBaseFilename=SpiderFile-Setup
Compression=lzma
SolidCompression=yes
SetupIconFile=backend\spider_file_icon_web.ico
[Files]
Source: "backend\dist\SpiderFile\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
[Icons]
Name: "{group}\Spider File"; Filename: "{app}\SpiderFile.exe"
Name: "{autodesktop}\Spider File"; Filename: "{app}\SpiderFile.exe"; Tasks: desktopicon
Name: "{userstartup}\Spider File"; Filename: "{app}\SpiderFile.exe"; Tasks: startupicon
[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional icons:"
Name: "startupicon"; Description: "Run Spider File when Windows starts"; GroupDescription: "Additional icons:"; Flags: unchecked