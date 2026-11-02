# Phase 10 verification checklist

## Before local testing
- Keep your existing `.dev.vars` file private and unchanged.
- Keep your real D1 database ID in `wrangler.api.toml`.
- Install dependencies: `npm install`.
- Apply the analytics migration to the local D1 database: `npx wrangler d1 migrations apply umar-portfolio-db --local --config wrangler.api.toml`.
- Start the API and Vite in separate terminals.

## Verify
1. Open `/` and confirm the public portfolio loads.
2. Open `/admin`, sign in, and confirm existing projects/services/skills remain present.
3. Open Design Studio, choose an accent and card radius, save, then refresh the public page.
4. Open Blog, create a Draft article; verify it is not public. Change it to Published and verify the journal card appears.
5. Add a testimonial with approval unchecked; verify it is not public. Approve it and verify the public feedback card appears. Only use real feedback with permission.
6. Open Analytics; confirm the dashboard loads. Visit the homepage and refresh Analytics to see page-view events.
7. Run `npm run build` and `npm run preflight`.

## Analytics notes
- The basic analytics table stores event type, URL path and timestamp only; no raw IP address or personal inquiry data is stored.
- Analytics counts can be affected by bots, refreshes, and repeat visits. They are not unique-human visitor counts.
- Apply migration `0003_analytics.sql` to production only after verifying the target database and following the Phase 9 deployment guide.
