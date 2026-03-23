$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$runtimeDir = Join-Path $repoRoot '.runtime'
$statePath = Join-Path $runtimeDir 'host-state.json'
$urlPath = Join-Path $runtimeDir 'auth-url.txt'
$tunnelLog = Join-Path $runtimeDir 'cloudflared.log'

if (-not (Test-Path $statePath)) {
  Write-Host 'No host state file found. Run scripts/start-auth-host.ps1 first.'
  exit 0
}

$state = Get-Content $statePath -Raw | ConvertFrom-Json

function Test-PidAlive([int]$processId) {
  if (-not $processId) { return $false }
  try {
    Get-Process -Id $processId -ErrorAction Stop | Out-Null
    return $true
  } catch {
    return $false
  }
}

$serverAlive = Test-PidAlive -processId $state.serverPid
$tunnelAlive = Test-PidAlive -processId $state.tunnelPid

$url = ''
if (Test-Path $urlPath) {
  $url = (Get-Content $urlPath -Raw).Trim()
}
if (-not $url -and (Test-Path $tunnelLog)) {
  $content = Get-Content $tunnelLog -Raw -ErrorAction SilentlyContinue
  if ($content) {
    $m = [regex]::Match($content, 'https://[a-z0-9-]+\.trycloudflare\.com')
    if ($m.Success) { $url = $m.Value }
  }
}

Write-Host "Server PID: $($state.serverPid) (alive: $serverAlive)"
Write-Host "Tunnel PID: $($state.tunnelPid) (alive: $tunnelAlive)"
if ($url) {
  Write-Host "Auth URL: $url"
} else {
  Write-Host 'Auth URL: not found yet (check cloudflared logs)'
}
Write-Host "Started: $($state.startedAt)"
