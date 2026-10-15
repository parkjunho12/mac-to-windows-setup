#Requires -Version 5.1
<#
.SYNOPSIS
  Read-only host and command-presence checks. Does not inspect secrets or logins.
.DESCRIPTION
  Does not initialize a WSL distribution or run Linux commands. Does not save a report.
  Command presence does not establish application health or authentication.
#>
[CmdletBinding()]
param()
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if ([Environment]::OSVersion.Platform -ne [PlatformID]::Win32NT) {
    throw 'Run this read-only check in Windows PowerShell, not macOS or WSL.'
}
Write-Host '=== Windows host ==='
$os = Get-CimInstance Win32_OperatingSystem
$system = Get-CimInstance Win32_ComputerSystem
[pscustomobject]@{
    Windows = $os.Caption
    Build = $os.BuildNumber
    SystemType = $system.SystemType
    RAM_GiB = [math]::Round($system.TotalPhysicalMemory / 1GB, 1)
} | Format-List | Out-Host

Write-Host '=== Windows command presence only ==='
$rows = foreach ($name in @('winget', 'wt', 'pwsh', 'git', 'gh', 'wsl', 'docker', 'cursor', 'tailscale')) {
    $commands = @(Get-Command $name -ErrorAction SilentlyContinue)
    [pscustomobject]@{
        Command = $name
        FoundInPath = ($commands.Count -gt 0)
    }
}
$rows | Format-Table -AutoSize | Out-Host

if (Get-Command wsl -ErrorAction SilentlyContinue) {
    Write-Host '=== WSL status ==='
    & wsl --status
    $statusCode = $LASTEXITCODE
    & wsl --list --verbose
    $listCode = $LASTEXITCODE
    Write-Host "WSL command exit codes: status=$statusCode list=$listCode"
    if ($statusCode -ne 0 -or $listCode -ne 0) {
        Write-Warning 'WSL is not ready or status retrieval failed. See the WSL setup guide.'
    }
}
Write-Host 'Run the separate Linux checks in Ubuntu after setup.'
Write-Host 'Missing PATH entries may require a new terminal; GUI apps can exist without a CLI.'
Write-Host 'This does not verify account access, app functionality, backups or migration completion.'
