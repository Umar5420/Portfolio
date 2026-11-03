# Phase 20 — Contact routing, night default, glass flip card and lamp

## Contact
- WhatsApp **+92 343 0329837** and email **umarsadiq899@gmail.com** are set in `src/siteConfig.js` (the one place to edit them).
- The contact form has **"Send this straight to me: WhatsApp / Email"** buttons. They open WhatsApp or the visitor's mail app with name, service, budget, message and contact details already written. They ask for a name and a short message first.
- The old `info@adsondigitals.com` default was replaced in the app, the Admin defaults and the Worker default.
- If your saved CMS profile still has an old email, the contact section and structured data now prefer `SITE.email` anyway.
- Alerts to your phone/inbox on every form submit still need the Worker secrets in `docs/ALERTS-SETUP.md`.

## Night mode by default
- New visitors see **Dark** (`index.html`, `preferences.js`, and the Theme Studio Reset). Visitors who already chose a mood keep their choice.

## New animations (from your reference videos)
- **Desk lamp**: press it to change the colour of the whole contact section (amber, cyan, pink, green, violet, white).
- **Liquid-glass card** with a light that follows the pointer.
- **3D flip card**: "Send a message" flips to "Talk directly" (WhatsApp, email, call).
- The contact section is now a dark "night studio" in every mood.
- Respects reduced motion; the lamp is hidden under 900px wide.

## Files
New: `src/components/ContactStudio.jsx`, `src/phase20.css`
Edited: `src/App.jsx`, `src/siteConfig.js`, `src/main.jsx`, `src/lib/preferences.js`, `src/Admin.jsx`, `index.html`, `worker/index.js`, `docs/ALERTS-SETUP.md`

## Local admin login fix
- `vite.config.js`: the dev proxy now sends the Worker's own origin so the CSRF check no longer returns 403 on /api/auth/login when running `npm run dev` + `npm run api:dev`.
