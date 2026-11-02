# Phase 18 — Alerts, availability, curtain, device frames

## 1. Instant inquiry alerts
- New inquiries now trigger an alert by **email (Resend)**, **Telegram** and/or **WhatsApp (CallMeBot)**. All optional; set up any you like. Steps: `docs/ALERTS-SETUP.md`.
- Failures never block the form: the inquiry is always saved first, the alert is sent in the background.
- Nothing is sent until you add the secrets and redeploy the API Worker.

## 2. Page-transition curtain
- A dark five-panel wipe with the "u." mark covers the screen when you move between home, a case study and the CV, then lifts on the new page. Skipped for new-tab clicks, modifier keys, the admin and reduced-motion.

## 3. Phone and laptop mockup frames
- Case-study cover now sits in a **laptop frame**; the gallery uses a **phone frame** for portrait screenshots and a **browser frame** for wide ones (detected automatically).
- The horizontal Work showcase uses laptop frames too. Frames tilt toward the mouse with a moving glare (mouse devices only).

## 4. Live availability badge
- Hero badge with a pulsing dot: **Taking new projects / Limited availability / Fully booked right now**, plus an optional note (e.g. "Next slot: December").
- Edit it in **Admin → Profile** (Availability badge + note), including "Hide the badge".
- The terminal `status` command and the contact heading follow it. Default is "Taking new projects".

## Files
New: `Availability.jsx`, `PageCurtain.jsx`, `DeviceFrame.jsx`, `src/phase18.css`, `docs/ALERTS-SETUP.md`
Edited: `worker/index.js`, `src/App.jsx`, `src/Admin.jsx`, `src/main.jsx`, `src/components/Features.jsx`, `package.json`

## Deploy notes
1. Deploy the **API Worker** again (`npm run api:deploy`) so alerts and the new profile fields work.
2. Open Admin → Profile, pick your availability and save.
3. Add alert secrets (see the guide), then test by sending yourself an inquiry.

## Run
    npm install
    npm run dev
