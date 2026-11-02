# Phase 14 — More alive

## New animation
- **Particle network** behind the page: dots drift, link up when close, and are pulled toward the mouse. Uses your accent colour (follows the theme). Pauses when the tab is hidden.
- **Gradient progress bar** across the top of the page.
- **Typing role line** under the headline: full-stack developer / mobile app builder / business-systems engineer / visual designer / problem solver.
- **Floating tech chips** (React, Laravel, Flutter, Next.js, MySQL) drifting around your portrait.
- **Shimmering gradient** on the word "reality".
- **Buttons**: moving shine, glow on hover, and a burst of sparks when clicked (mouse devices).
- **Section headings** rise in with a slight tilt; section divider lines draw across in the accent colour; the kicker dots pulse.
- **Service cards**: pop in one after another, 3D tilt, a spotlight that follows the mouse, icon spin on hover.
- **Project cards**: a light sweep across the cover on hover.
- **BUILD • DESIGN • SHIP • REPEAT**: two huge text rows that slide in opposite directions as you scroll (between Work and Gallery).
- **Contact orbs** drift with scroll parallax.
- **Footer**: giant outlined "UMAR SADIQ" whose letters slide up, and jump and colour on hover.

## Changed
- Site now presents you as an individual: removed "Adson Digitals" studio wording from the workspace band and gallery captions (the email and journey entry are unchanged).
- Journey cards no longer show the "DATE TO BE ADDED" text. Add real dates when you have them.

## Safety
- All new effects are off for `prefers-reduced-motion`. Pointer effects (tilt, sparks) run on mouse devices only. Particle count is lower on phones.

## Files
- New: `src/components/Motion3.jsx`, `src/phase14.css`
- Edited: `src/App.jsx`, `src/main.jsx`, `src/components/Motion.jsx`, `src/components/Motion2.jsx`, `package.json`

## Run
    npm install
    npm run dev

## 14b — Trust, clarity and conversion
**Content**
- Hero now leads with one identity ("Full-Stack Developer & Software Engineer") and two clear actions: **Hire me for a project** and **Explore my work** (plus **Download CV** once you set it up).
- Services: the first three (development) are the main grid; the rest appear in a smaller **Also offered** row.
- New **How I work** section (Discuss, Plan, Build, Support) and a short **FAQ** with animated accordion.
- Skills are now grouped (Frontend, Backend, Mobile, Data, Tools & Growth) instead of a moving marquee.
- Gallery trimmed from 14 to 6 photos by default.
- Project case-study pages hide any section that has no content, instead of showing "not added yet".
- Stickers and contact line now say "available / open to new projects" consistently.

**Easy settings** — edit `src/siteConfig.js`: WhatsApp number, CV file, booking link, and the one-line reply promise. Empty values hide the button.

**Security / SEO**
- Worker: wildcard CORS removed (same-origin by default; set `ALLOWED_ORIGIN` only if needed); login limited to 6 attempts per 10 minutes per IP; analytics endpoint limited per IP. These limits are best-effort (in memory); the inquiry form already had a stronger database-backed limit.
- `public/_headers`: added Content-Security-Policy and HSTS. If you ever add a third-party script (analytics, chat widget), add its host to `script-src`.
- Build: when `SITE_URL` is set, `og:image`, `twitter:image`, `og:url` and canonical become absolute URLs so WhatsApp/LinkedIn previews work.
- Removed two unused JPEGs and moved old changelogs into `docs/changelog/`.

## Still needs you
- Real project screenshots/outcomes (Admin → Projects) and 2–3 real client messages (Admin → Conversations).
- Real journey dates.
- Cloudflare dashboard: put `/admin` behind Cloudflare Access; set `SITE_URL`.
- A 1200×630 share image (`og:image`) if you want a perfect link preview.
- Not done: Turnstile on the form, email/WhatsApp alert for new inquiries, self-hosted fonts.

## 14c — Digital animated background
- Layered live background behind the whole page: drifting aurora glow, a moving digital grid, a scan line that sweeps down, falling code rain (0 1 { } < / > ; ...), glowing network nodes with data packets that travel along the links, and a glow that follows the mouse.
- Code rain is faint in the middle and stronger at the screen edges so text stays readable; it speeds up when you scroll fast.
- Colours follow the active theme/mood (accent colour) and light/dark mode.
- Services, FAQ, skills, contact and footer now let the background show through slightly.
- Phones get fewer nodes and a lighter version. Everything is off for reduced-motion.
- To tone it down: lower `.fx-aurora i` opacity or `.fx-grid` in `src/phase14.css`; to remove the code rain only, set `on: false` for all columns in `AmbientFX` (`Motion3.jsx`).
