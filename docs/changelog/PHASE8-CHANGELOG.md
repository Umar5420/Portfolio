# Phase 8 — SEO & Performance

This phase builds on the Phase 7 portfolio package.

## SEO
- Expanded HTML title, description, author, robots, Open Graph and Twitter card metadata.
- Runtime canonical URL and metadata updates for the homepage and individual project case studies.
- JSON-LD structured data for the portfolio owner (`Person`), website (`WebSite`) and project case studies (`CreativeWork`).
- Admin route receives `noindex,nofollow,noarchive` metadata.
- `robots.txt` allows public pages and disallows `/admin` and `/api/`.
- Sitemap generation is controlled by `SITE_URL` (or `VITE_SITE_URL`) at build time. Only the homepage is included automatically; project URLs need a later dynamic sitemap integration or a supplied URL list.
- Favicon and web app manifest added.

## Performance and accessibility
- Supplied portrait photographs converted to WebP while original JPEGs are retained as fallback/source assets.
- Hero portrait is preloaded and prioritized; secondary portrait and project imagery use lazy loading and async decoding.
- Intrinsic dimensions added to supplied portrait images to reduce layout shift.
- Static assets receive long-lived cache headers; HTML is not cached.
- Existing responsive layout and reduced-motion behavior are retained.

## Build configuration
The build command now runs `node scripts/generate-seo.mjs && vite build`.
Set `SITE_URL` to the final HTTPS production origin in the Cloudflare Pages build environment, for example `https://your-real-pages-domain.pages.dev`. Do not use the example literally. Without a valid HTTPS `SITE_URL`, the build continues but skips sitemap generation and warns.

## Verification notes
- SEO metadata is updated client-side after React loads; this is not server-side rendering. Some social crawlers may not execute JavaScript, so a later prerender/SSR step can improve previews.
- The generated sitemap currently includes the homepage only. Dynamic project case-study sitemap entries are not yet generated from D1.
- No analytics or tracking scripts were added.
