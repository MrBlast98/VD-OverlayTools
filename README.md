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

- Share the printed `Auth URL` with users and have them paste it into the app's `Auth Server URL` field.
- Keep both processes running. If either stops, users will see login/fetch errors.
- Quick tunnel URLs can change after restart.
