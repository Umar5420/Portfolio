# Phase 15 — Favicon + "awesome package"
- **Favicon set**: new "u." icon (SVG, 16/32/48 PNG, .ico, Apple touch icon, 192/512 and maskable app icons) wired into `index.html` and `site.webmanifest`.
- **Share image**: `public/images/og-share.png` (1200×630) is now the default link preview image for WhatsApp/LinkedIn/X. The build makes its URL absolute when `SITE_URL` is set.
- **3D hero depth**: the portrait, arch, orbits, stickers and tech chips now move at different depths with the mouse, plus a moving light glare.
- **Interactive terminal** in the hero: types `whoami`, `skills`, `status` by itself, then visitors can type `help`, `projects`, `contact`, `hire`, `about`, `work`, `clear` (or the `sudo hire umar` easter egg).
- **Project estimator** (new "Start here" section): 4 quick questions that build a brief and pre-fill the contact form. It does not show prices; you send the estimate yourself.
- **Horizontal-scroll showcase**: on desktop with a mouse, the Work section pins and slides sideways through up to 6 projects (featured first). The full searchable grid is still below it. Phones and reduced-motion users just see the grid.
- **Text scramble**: section headings and labels "decode" from random code characters into the real text when they scroll into view.
- Header has a new "Estimate" link.

## Mouse-only and safety notes
- 3D hero depth, terminal auto-demo, scramble and the horizontal showcase are all skipped for `prefers-reduced-motion`. The depth effect and the pinned showcase run on mouse devices wider than 900px only; phones and tablets get the normal portrait and the project grid.
- The estimator never shows prices. It only builds the brief text and fills the contact form (service, budget, message); the visitor can edit everything before sending.

## Still needs you
- Real project screenshots/outcomes (Admin → Projects) and 2–3 real client messages (Admin → Conversations).
- Real journey dates; WhatsApp number / CV file in `src/siteConfig.js`.
- Cloudflare: `/admin` behind Cloudflare Access; set `SITE_URL`.
- Not done yet: Turnstile on the form, instant email/WhatsApp alert for new inquiries, self-hosted fonts, Urdu/Arabic toggle, `/cv` print page, page-transition curtain.

## Run
    npm install
    npm run dev
