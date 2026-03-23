$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$portalDir = Join-Path $repoRoot 'web-portal'
$runtimeDir = Join-Path $repoRoot '.runtime'
$serverLog = Join-Path $runtimeDir 'auth-server.log'
$serverErrLog = Join-Path $runtimeDir 'auth-server.err.log'
$tunnelLog = Join-Path $runtimeDir 'cloudflared.log'
$statePath = Join-Path $runtimeDir 'host-state.json'
$urlPath = Join-Path $runtimeDir 'auth-url.txt'

if (-not (Test-Path $portalDir)) {
  throw "web-portal folder not found at $portalDir"
}

if (-not (Test-Path $runtimeDir)) {
  New-Item -ItemType Directory -Path $runtimeDir | Out-Null
}

function Get-CloudflaredPath {
  $cmd = Get-Command cloudflared.exe -ErrorAction SilentlyContinue
  if ($cmd -and $cmd.Source) {
    return $cmd.Source
  }

  $candidates = @(
    'C:\Program Files\cloudflared\cloudflared.exe',
    'C:\Program Files (x86)\cloudflared\cloudflared.exe',
    'C:\Program Files\Cloudflare\Cloudflared\cloudflared.exe',
    "$env:LOCALAPPDATA\Programs\cloudflared\cloudflared.exe"
  )

  foreach ($p in $candidates) {
    if (Test-Path $p) {
      return $p
    }
  }

  return $null
}

function Wait-ForTunnelUrl([string]$logFile, [int]$timeoutSeconds = 45) {
  $start = Get-Date
  while (((Get-Date) - $start).TotalSeconds -lt $timeoutSeconds) {
    if (Test-Path $logFile) {
      $content = Get-Content $logFile -Raw -ErrorAction SilentlyContinue
      if ($content) {
        $matches = [regex]::Matches($content, 'https://[a-z0-9-]+\.trycloudflare\.com')
        if ($matches.Count -gt 0) {
          return $matches[$matches.Count - 1].Value
        }
      }
    }
    Start-Sleep -Milliseconds 700
  }
  return ''
}

$cloudflaredPath = Get-CloudflaredPath
if (-not $cloudflaredPath) {
  throw 'cloudflared.exe was not found. Install it with: winget install Cloudflare.cloudflared -e'
}

if (-not (Test-Path (Join-Path $portalDir 'node_modules'))) {
  Write-Host 'Installing web-portal dependencies...'
  Push-Location $portalDir
  try {
    npm install | Out-Host
  } finally {
    Pop-Location
  }
}

Write-Host 'Starting auth server...'
# Reset logs so we always detect the current tunnel URL.
foreach ($f in @($serverLog, $serverErrLog, $tunnelLog)) {
  if (Test-Path $f) {
    Clear-Content -Path $f -ErrorAction SilentlyContinue
  }
}

$serverProc = $null
try {
  $existingListener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction Stop | Select-Object -First 1
  if ($existingListener -and $existingListener.OwningProcess) {
    $existingProc = Get-Process -Id $existingListener.OwningProcess -ErrorAction SilentlyContinue
    if ($existingProc -and $existingProc.ProcessName -match 'node') {
      Write-Host "Auth server already running on port 3000 (PID: $($existingProc.Id))."
      $serverProc = $existingProc
    }
  }
} catch {
  # If probing fails, we'll start a dedicated server process below.
}

if (-not $serverProc) {
  $serverProc = Start-Process -FilePath 'node.exe' -ArgumentList 'server.js' -WorkingDirectory $portalDir -RedirectStandardOutput $serverLog -RedirectStandardError $serverErrLog -PassThru
}
Start-Sleep -Seconds 2

Write-Host 'Starting Cloudflare tunnel...'
$tunnelArgs = @('tunnel', '--url', 'http://localhost:3000', '--no-autoupdate', '--loglevel', 'info', '--logfile', $tunnelLog)
$tunnelProc = Start-Process -FilePath $cloudflaredPath -ArgumentList $tunnelArgs -WorkingDirectory $repoRoot -PassThru

$url = Wait-ForTunnelUrl -logFile $tunnelLog -timeoutSeconds 45

$state = [ordered]@{
  serverPid = $serverProc.Id
  tunnelPid = $tunnelProc.Id
  tunnelUrl = $url
  startedAt = (Get-Date).ToString('o')
  serverLog = $serverLog
  serverErrLog = $serverErrLog
  tunnelLog = $tunnelLog
}

$state | ConvertTo-Json | Set-Content -Path $statePath -Encoding utf8
if ($url) {
  Set-Content -Path $urlPath -Value $url -Encoding utf8
}

Write-Host ''
Write-Host 'Auth host started.'
Write-Host "Server PID: $($serverProc.Id)"
Write-Host "Tunnel PID: $($tunnelProc.Id)"
if ($url) {
  Write-Host "Auth URL: $url"
  Write-Host 'Give this URL to users in the app Auth Server URL field.'
} else {
  Write-Host 'Tunnel URL was not detected yet. Run scripts/status-auth-host.ps1 in a few seconds.'
}
