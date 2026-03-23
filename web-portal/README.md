# VD Web Portal

Website with:
- User login/register
- Role system: user, premium, tester, dev
- Developer dashboard for active-user tracking
- Live heartbeat-based presence monitoring

## Setup

1. Install dependencies:
   npm install

2. Optional: set environment variables from `.env.example`.

3. Run:
   npm start

4. Open:
   http://localhost:3000

## Notes

- First registered account is automatically assigned `dev`.
- Active users are users with heartbeat in the last 2 minutes.
- Dev users can change user roles from the dashboard.
