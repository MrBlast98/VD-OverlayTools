# VD OverlayTools (Electron)

Simple Electron app that shows map previews and can create a transparent always-on-top overlay window.

Setup

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm start
```

Usage notes

- Place your map images in the `images/` folder at the workspace root. Filenames must match: `BayHarbor.png`, `BloodBath.png`, `Firelink.png`, `Mercy.png`, `Village.png`, `Woodview.png`.
- Use the `Show Overlay` button to open the overlay window. Adjust opacity with the slider.
- Enable `Click-through` to allow clicks to pass to the game (it will forward mouse events).

Windows specifics

- For games running as administrator, you may need to run this app as administrator as well for the overlay to appear above the game window.

Auth hosting for users (Cloudflare quick tunnel)

1. Start auth server + tunnel:

```bash
npm run host:start
```

2. Check status and copy the public auth URL:

```bash
npm run host:status
```

3. Stop both processes:

```bash
npm run host:stop
```

Notes:

- Set the auth host through `AUTH_SERVER_URL` (or `.runtime/auth-url.txt`) on the app machine; the renderer field is read-only in secure mode.
- Keep both processes running. If either stops, users will see login/fetch errors.
- Quick tunnel URLs can change after restart.

Security hardening and secure release

- Production auth host is pinned in the main process. Renderer-provided host overrides are ignored.
- The web portal requires `SESSION_SECRET` and `APP_INVITE_CODE` environment variables.
- Release builds enforce code signing (`forceCodeSigning: true`).
- Electron fuses are flipped in `scripts/after-pack-fuses.js` during packaging.

Required environment variables for signed Windows release

```powershell
$env:CSC_LINK = "file:///C:/path/to/codesign.pfx"
$env:CSC_KEY_PASSWORD = "your-cert-password"
$env:GH_TOKEN = "github_pat_for_release_publish"
```

Secure release command

```bash
npm run release:secure
```

macOS release and notarization

- macOS artifacts are produced as `dmg` and `zip`.
- Hardened runtime and notarization are enabled in electron-builder config.
- Ensure Apple signing/notarization env vars are present before secure mac release.

Quick path (no signing, works for testing)

- You can build unsigned macOS artifacts without any certificates or Apple account:

```bash
npm run release:mac
```

- This command disables signing/notarization for that build only.
- Use this for personal testing or non-public distribution.

Required environment variables for signed + notarized macOS release

```bash
export APPLE_ID="your-apple-id@example.com"
export APPLE_APP_SPECIFIC_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="YOURTEAMID"
export CSC_LINK="file:///Users/you/certs/DeveloperID.p12"
export CSC_KEY_PASSWORD="your-cert-password"
export GH_TOKEN="github_pat_for_release_publish"
```

macOS release commands

```bash
npm run release:mac
npm run release:mac:unsigned
npm run release:mac:secure
```

Note: A dedicated `.icns` app icon is recommended for final mac distribution.

GitHub Actions one-time setup (fully automated releases)

Add these repository secrets in GitHub: Settings -> Secrets and variables -> Actions.

- WINDOWS_CERT_PFX_BASE64: Base64 content of your Windows code-signing .pfx file
- WINDOWS_CERT_PASSWORD: Password for the Windows .pfx
- MAC_CERT_P12_BASE64: Base64 content of your Apple Developer ID .p12 certificate
- MAC_CERT_PASSWORD: Password for the macOS .p12
- APPLE_ID: Apple account email for notarization
- APPLE_APP_SPECIFIC_PASSWORD: Apple app-specific password
- APPLE_TEAM_ID: Your Apple Team ID

Beginner step-by-step

1. Open this page:
	https://github.com/MrBlast98/VD-OverlayTools/settings/secrets/actions

2. Click New repository secret.

3. For each secret below, enter:
	- Name: the secret name exactly as shown
	- Secret: only that secret's value
	- Click Add secret

4. Create these secrets one at a time:
	- WINDOWS_CERT_PFX_BASE64
	- WINDOWS_CERT_PASSWORD
	- MAC_CERT_P12_BASE64
	- MAC_CERT_PASSWORD
	- APPLE_ID
	- APPLE_APP_SPECIFIC_PASSWORD
	- APPLE_TEAM_ID

How to get base64 values on Windows (copy to clipboard)

Windows .pfx file:

PowerShell command:
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\codesign.pfx")) | Set-Clipboard

macOS .p12 file (if you have the file on Windows):

PowerShell command:
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\DeveloperID.p12")) | Set-Clipboard

How to get Apple values

- APPLE_ID: your Apple account email
- APPLE_APP_SPECIFIC_PASSWORD: generate at https://appleid.apple.com under Sign-In and Security -> App-Specific Passwords
- APPLE_TEAM_ID: from Apple Developer account Membership page

After secrets are set:

- Push a git tag like v2.0.1 to trigger signed Windows + notarized macOS release automatically.
- Or run the workflow manually from GitHub Actions.
