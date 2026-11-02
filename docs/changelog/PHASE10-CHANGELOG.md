# Phase 10 — Advanced Features

- Added a Design Studio for a limited set of safe visual tokens (accent and card radius), persisted in the existing portfolio content JSON.
- Added blog article creation and public display for Published posts.
- Added testimonial entry management; only approved testimonials render publicly. Publish only genuine feedback with permission.
- Added lightweight first-party analytics event collection and authenticated 30-day summary endpoint.
- Added D1 migration `0003_analytics.sql`.

## Setup
1. Preserve `.dev.vars`, `wrangler.api.toml`, and the existing D1 database ID.
2. Apply migration locally: `npx wrangler d1 migrations apply umar-portfolio-db --local --config wrangler.api.toml`.
3. For production, apply the same migration remotely only after confirming the target database: `npx wrangler d1 migrations apply umar-portfolio-db --remote --config wrangler.api.toml`.
4. Deploy the API Worker and Pages project using the Phase 9 deployment guide.
5. Build locally with `npm install` then `npm run build`.

Analytics records only event type, path and timestamp; it does not store visitor IP addresses or personal form data. It is a basic counter, not a replacement for a full analytics platform.
