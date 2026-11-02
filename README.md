# Umar Sadiq — Portfolio (Phase 1)

A responsive, animated personal portfolio foundation built with React, Vite, Tailwind CSS v4, Framer Motion and GSAP.

## Included in Phase 1
- Creative Experimental visual direction
- Light / dark theme switcher (saved in local storage)
- Responsive navigation and mobile menu
- Hero, profile, services, selected work, skills, journey and contact sections
- Cursor-reactive portrait tilt / gaze illusion
- Scroll-triggered section reveals and a guided progress rail
- Reduced-motion support
- Cloudflare Pages deployment configuration
- Local portrait assets in `public/images`

## Requirements
- Node.js 22.5+ recommended
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Production build
```bash
npm run build
npm run preview
```

## Deploy free on Cloudflare Pages
1. Push this folder to a GitHub repository.
2. In Cloudflare Dashboard, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Deploy. Cloudflare will provide a free `*.pages.dev` subdomain.

You can also deploy with Wrangler after authenticating:
```bash
npx wrangler pages deploy dist
```

## Editing content in this phase
The content arrays and profile text currently live in `src/App.jsx`. Phase 2 will move editable content into the CMS data layer and add a protected admin dashboard.

## Portrait animation note
The current portrait interaction uses pointer-driven perspective and layered motion on the supplied photographs. It is an intentionally honest first step: true walking / full-body character animation requires a separately prepared rig or multi-pose sequence. That system can be added after the base experience is approved.

## Important content notes
- Experience dates and exact job titles are intentionally not fabricated.
- Testimonials and numerical performance claims are omitted until verified.
- The site is positioned as Umar Sadiq's individual professional portfolio.


## Phase 2 — Scroll-aware character guide
- A persistent guide appears after the visitor begins scrolling.
- The guide changes its message as visitors move through the page.
- Pointer movement creates subtle perspective/gaze response.
- Section dots let visitors jump directly to each chapter.
- The guide is responsive and respects reduced-motion preferences.

This is a portrait-based guide animation, not a fully rigged walking 3D character. Real walking poses require a purpose-built rig or an approved sequence of pose assets. The current two supplied photos are preserved as authentic source imagery.

## Phase 3 — Admin Dashboard / CMS

The Phase 3 dashboard is available at `/admin`.

### Included
- Admin overview with project, service, skill and content counts.
- Project management: add, edit, search and delete entries.
- Service management: add, edit, search and delete entries.
- Skills management: add and remove technologies.
- Profile editor for name, role, email, location and introduction.
- Browser-local persistence using `localStorage`.
- JSON content backup export and import.
- Responsive sidebar and dashboard layout.
- Cloudflare Pages SPA rewrite for the `/admin` route.

### Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173/admin` for the dashboard and `http://localhost:5173/` for the public portfolio.

### Important Phase 3 limitation

This is the frontend CMS prototype. Content is saved in the current browser only; it is not yet synchronized with the public portfolio, another device, or a cloud database. There is no secure login in this phase, so do not publish `/admin` as a protected production dashboard. Phase 4 must add server-side authentication, authorization, a Cloudflare Worker API and D1 persistence before using this to manage live production content.

## Phase 5 — Dynamic project showcase and case studies

Phase 5 builds on the Phase 4 API/D1 content model. It does not require a new D1 migration because project case-study fields are stored as additional properties inside the existing `projects` JSON array.

### Public portfolio features
- Search projects by name, category, description or technology.
- Filter by the project categories already stored in the CMS.
- Sort featured projects first, or alphabetically.
- Open a dedicated `/projects/<slug>` case-study page.
- Case-study sections for overview, challenge, approach, outcome, role, year, technologies, cover image, gallery and live project link.
- Draft and Hidden projects remain excluded from the public showcase.
- Responsive layout and reduced-motion behavior retain the existing design system.

### Admin project editor
Open `/admin` → Projects → Add project or Edit. Project fields include:
- Name, category, short description, year and role/contribution.
- Cover image URL and optional live project URL.
- Technologies (comma-separated).
- Gallery image URLs (one URL per line).
- Overview, challenge, approach/solution and outcome/results.
- Featured toggle and Published / Draft / Hidden status.

Images are currently managed by URL (including paths such as `/images/project-shot.webp`). This phase does not yet upload binary files to Cloudflare R2; R2 media uploads are a later storage integration. Use image URLs you control and verify they load publicly before publishing.

### Test Phase 5 locally
1. Start the API: `npm run api:dev`.
2. Start the website in another terminal: `npm run dev`.
3. Open `http://localhost:5173/admin` and sign in.
4. Open Projects and edit one existing project. Add a category, technologies and a cover image URL if available; mark it Featured and save.
5. Open `http://localhost:5173/` and verify search, category filters and featured sorting.
6. Open the project card and verify `/projects/<slug>` shows its case study.
7. Refresh the detail URL directly to verify the SPA fallback serves the application.
8. Return to Admin and set the project to Draft. Refresh the public site and verify it disappears. Set it back to Published when finished.

### Data compatibility
Existing Phase 4 project records remain valid. Missing case-study fields are optional and display neutral placeholders rather than fabricated claims. No project statistics, client results or testimonials are generated automatically.
\n\n## Phase 7 — Client inquiries\nSee `docs/changelog/PHASE7-CHANGELOG.md`. Apply D1 migration `0002_inquiries.sql` locally before testing the contact form. Admin > Inquiries lets you track and export submissions.\n
## Phase 8 — SEO and performance

See `docs/changelog/PHASE8-CHANGELOG.md` for the complete list and known limits.

### Production site URL and sitemap
Set the Cloudflare Pages build environment variable `SITE_URL` to the final HTTPS website origin (without a trailing slash), for example your actual `https://<your-site>.pages.dev` address. The build script generates `public/sitemap.xml` and adds its URL to `robots.txt`. If `SITE_URL` is absent, the build still completes but skips sitemap generation. Do not leave a placeholder domain in production.

### SEO verification
After deployment, verify `/robots.txt`, `/sitemap.xml`, the page title and description, Open Graph/Twitter preview, and canonical URL. The homepage and project detail metadata are updated client-side; this phase does not add server-side rendering. The sitemap currently lists the homepage only; project detail URLs require a future dynamic sitemap enhancement.

### Image performance
The supplied portraits are available as optimized WebP files in `public/images`; the original JPEGs remain in the project. The hero portrait is prioritized and supporting images are lazy-loaded. Project cover/gallery URLs are still supplied through the CMS and should point to optimized images where possible.

## Phase 9 — Production deployment preparation

See `docs/PHASE9-PRODUCTION-DEPLOYMENT.md` for the Cloudflare Pages + Pages Functions + Worker + D1 deployment sequence, secret setup, migrations, smoke tests and rollback guidance. Run `npm run preflight` before deployment. Do not overwrite your real `wrangler.api.toml` D1 database ID or `.dev.vars` with archive placeholders.


## Phase 10 — Advanced features

Phase 10 adds Design Studio preferences, a lightweight blog and approved testimonials, plus privacy-minimal first-party analytics. See `docs/changelog/PHASE10-CHANGELOG.md` for migration and rollout steps. Keep your real `.dev.vars` and database ID; never use archive placeholders as production secrets.


## Phase 11 — Theme Studio, Greeting, Gallery & Client Conversations

See `docs/changelog/PHASE11-CHANGELOG.md`. Visitors can switch colour moods (Light, Dark, Morning, Evening, Ocean, Rose, Violet, Aurora, Auto) and styles (Classic, Glassy, Soft, Neon). Manage the gallery and client conversations from `/admin`. No new database migration is required.

## Phase 19 interactive portfolio additions

The portfolio now includes a scroll-activated student roadmap, exploration XP, magnetic hover treatment, contextual cursor labels, keyboard shortcuts and Konami easter egg, Matrix terminal mode, a playful 404 bug-catching page, GitHub profile/repository card, Urdu/English direction toggle, daily coding tip, coaching package shortcuts, lightweight portrait particle trails and a generated ASCII portrait reveal, section colour mood shift, real screenshot-backed project previews, an interactive same-product screen comparison, animated workspace and Selected Work presentation, and an installable/offline PWA shell.

### GitHub card setup

Set `GITHUB_USERNAME` as a secret/variable on the Cloudflare Worker to the exact public GitHub username. For the contribution heatmap, also set `GITHUB_TOKEN` to a fine-grained/read-only token with public profile access; the Worker requests only the public contribution calendar and caches the response. Without these settings the portfolio safely displays a setup hint rather than fabricated activity. Deploy the API Worker after changing its code (`npm run api:deploy`).

### PWA

The service worker is registered automatically in production. Serve the site over HTTPS for installation and offline caching. API requests are intentionally never cached.

### Assets

The supplied screenshots are mapped to named project assets in `public/images/`: DailyCarlift (homepage and service page), Adson Client Hunter (dashboard and approvals), J.A.R.V.I.S. (interface), Royal Landmark Property Management (launch screen), and SellCarsOnCars (marketplace). The Selected Work cards, case studies and Closer Look gallery use these matching originals. They are still screenshots, not looping screen recordings; add project-specific video/GIF captures when available.
