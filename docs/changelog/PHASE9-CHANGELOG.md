# Phase 9 changelog — Production deployment preparation

- Added Cloudflare Pages Functions same-origin `/api/*` proxy using the `PORTFOLIO_API` service binding.
- Added the matching Pages service binding declaration to `wrangler.toml`.
- Added a production deployment, secret management, migration, smoke-test and rollback guide.
- Added a local preflight script to check key files/configuration and run the production build.
- No live Cloudflare deployment was performed; credentials, account ownership, D1 ID and production hostname must be supplied/configured by the site owner.
