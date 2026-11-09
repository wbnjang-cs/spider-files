[Setup]
; Keep this AppId the same forever so new versions upgrade the old install.
AppId={{5FAC8F2D-2A8D-4904-B882-E770C8B05E7D}}
AppName=Spider File
AppVersion=1.2
DefaultDirName={autopf}\SpiderFile
DefaultGroupName=Spider File
OutputBaseFilename=SpiderFile-Setup
Compression=lzma
SolidCompression=yes
SetupIconFile=backend\spider_file_icon_web.ico
UninstallDisplayIcon={app}\SpiderFile.exe
; Admin is needed to add the firewall rule below.
PrivilegesRequired=admin

[Files]
Source: "backend\dist\SpiderFile\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Spider File"; Filename: "{app}\SpiderFile.exe"
Name: "{autodesktop}\Spider File"; Filename: "{app}\SpiderFile.exe"; Tasks: desktopicon
Name: "{userstartup}\Spider File"; Filename: "{app}\SpiderFile.exe"; Tasks: startupicon

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional icons:"
Name: "startupicon"; Description: "Run Spider File when Windows starts"; GroupDescription: "Additional icons:"; Flags: unchecked

[Run]
; Remove any old copy of our rule first so upgrades don't pile up duplicates, then add it fresh.
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall delete rule name=""Spider File"""; Flags: runhidden
; Private networks only (home Wi-Fi). Change profile=private to profile=private,public to also allow Public networks.
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall add rule name=""Spider File"" dir=in action=allow program=""{app}\SpiderFile.exe"" enable=yes profile=private"; Flags: runhidden
; Offer to launch after install, as the normal user (so %APPDATA% is the user's, not the admin's).
Filename: "{app}\SpiderFile.exe"; Description: "Launch Spider File"; Flags: nowait postinstall skipifsilent runasoriginaluser

[UninstallRun]
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall delete rule name=""Spider File"""; Flags: runhidden; RunOnceId: "RemoveFirewallRule"

[Code]
// The tray app has no window, so the installer can't close it normally.
// Kill it first so files aren't locked during an upgrade or uninstall.
procedure KillRunningApp();
var
  ResultCode: Integer;
begin
  Exec(ExpandConstant('{sys}\taskkill.exe'), '/F /IM SpiderFile.exe', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
end;

function PrepareToInstall(var NeedsRestart: Boolean): String;
begin
  KillRunningApp();
  Result := '';
end;

function InitializeUninstall(): Boolean;
begin
  KillRunningApp();
  Result := True;
end;
