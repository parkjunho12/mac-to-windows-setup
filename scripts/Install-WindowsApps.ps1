#Requires -Version 5.1
<#
.SYNOPSIS
  Preview or explicitly install reviewed WinGet packages for a Mac-to-Windows setup.
.DESCRIPTION
  Default: preview only. No credential export, WSL install, system policy change,
  app removal, forced reboot, firewall change, or automatic account login.
  Automatic installation is limited to Windows 11 x64.
.EXAMPLE
  .\Install-WindowsApps.ps1 -Profile Core
.EXAMPLE
  .\Install-WindowsApps.ps1 -Profile Dev -Install
#>
[CmdletBinding()]
param(
    [ValidateSet('Core', 'Dev', 'Media')]
    [string]$Profile = 'Core',
    [switch]$Install
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$packages = @{
    Core = @('Google.Chrome', 'Microsoft.PowerToys', 'Tailscale.Tailscale', '7zip.7zip')
    Dev = @('Microsoft.WindowsTerminal', 'Microsoft.PowerShell', 'Anysphere.Cursor',
            'Git.Git', 'GitHub.cli', 'Docker.DockerDesktop')
    Media = @('VideoLAN.VLC', 'Gyan.FFmpeg')
}
$selected = @($packages[$Profile])
Write-Host "Profile: $Profile"
Write-Host 'Aside, Office, Hancom, KakaoTalk and account sign-in are manual steps.'
Write-Host 'Dev is an add-on profile; it does not include Core.'
foreach ($id in $selected) {
    Write-Host "winget install --id $id --exact --source winget --interactive"
}
if (-not $Install) {
    Write-Host 'PREVIEW ONLY. No packages installed. Add -Install to install this profile.'
    return
}

if ([Environment]::OSVersion.Platform -ne [PlatformID]::Win32NT) {
    throw 'Installation is only supported on Windows 11 x64. No changes made.'
}
if ([Environment]::OSVersion.Version.Build -lt 22000) {
    throw 'Windows 11 is required by this setup baseline. No changes made.'
}
$arch = $env:PROCESSOR_ARCHITEW6432
if ([string]::IsNullOrWhiteSpace($arch)) { $arch = $env:PROCESSOR_ARCHITECTURE }
if ($arch -ne 'AMD64') {
    throw 'Automatic install is x64-only. Review ARM64 compatibility manually. No changes made.'
}
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    throw 'WinGet is missing. Update Microsoft App Installer from Microsoft Store, then retry.'
}

# Check every ID before starting installs. No source reset or hash bypass.
foreach ($id in $selected) {
    $details = & winget show --id $id --exact --source winget 2>&1
    $showCode = $LASTEXITCODE
    if ($showCode -ne 0) {
        $details | Out-Host
        throw "Package preflight failed: $id (exit $showCode). No installation started."
    }
}

$results = @()
foreach ($id in $selected) {
    Write-Host "Installing $id. Review installer, license and UAC prompts on screen."
    & winget install --id $id --exact --source winget --interactive
    $code = $LASTEXITCODE
    $state = 'REVIEW_REQUIRED'
    if ($code -eq 0) { $state = 'COMMAND_OK' }
    elseif ($code -eq 3010 -or $code -eq 1641) { $state = 'REBOOT_REPORTED' }
    $results += [pscustomobject]@{ Package = $id; State = $state; ExitCode = $code }
}
$results | Format-Table -AutoSize | Out-Host
Write-Host 'COMMAND_OK is the installer exit status, not an application or login test.'
Write-Host 'Open a new terminal. Verify installed apps, WSL integration and account sign-in.'
Write-Host 'A nonzero result may also mean an existing app needs no upgrade; inspect WinGet output.'
if (@($results | Where-Object { $_.State -eq 'REVIEW_REQUIRED' }).Count -gt 0) {
    throw 'One or more package results require review. Do not treat this profile as fully verified.'
}
