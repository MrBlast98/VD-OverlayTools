$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$statePath = Join-Path (Join-Path $repoRoot '.runtime') 'host-state.json'

if (-not (Test-Path $statePath)) {
  Write-Host 'No host state file found. Nothing to stop.'
  exit 0
}

$state = Get-Content $statePath -Raw | ConvertFrom-Json
$pids = @($state.serverPid, $state.tunnelPid) | Where-Object { $_ -and $_ -gt 0 }

foreach ($procId in $pids) {
  try {
    $proc = Get-Process -Id $procId -ErrorAction Stop
    Stop-Process -Id $proc.Id -Force
    Write-Host "Stopped PID $($proc.Id) ($($proc.ProcessName))."
  } catch {
    Write-Host "PID $procId is already stopped."
  }
}

Write-Host 'Auth host stopped.'
