# Phase 9 — Production deployment and launch checklist

This phase prepares the portfolio for Cloudflare Pages + Pages Functions + a separate Cloudflare Worker + D1. It does **not** deploy anything automatically. You must own the Cloudflare account and perform the commands after reviewing the configuration.

## Architecture

- **Cloudflare Pages** serves the Vite build from `dist/`.
- **Pages Functions** routes `/api/*` through the `PORTFOLIO_API` service binding.
- **Cloudflare Worker** (`umar-sadiq-portfolio-api`) runs `worker/index.js`.
- **D1** stores portfolio content, sessions and client inquiries.
- The browser calls `/api/...` on the same origin. This avoids cross-origin credentialed cookie problems.

## Before deployment — protect your existing setup

1. Back up your working project and export your D1 data.
2. Keep your existing `.dev.vars` private and out of Git.
3. This working copy contains a configured D1 `database_id` in `wrangler.api.toml`. Confirm that it belongs to the Cloudflare account and database you intend to deploy before running remote commands; preserve your own known-good ID if it differs.
4. Do not commit passwords, API tokens, session secrets, or `.dev.vars`.
5. Verify your Cloudflare account, Pages project and Worker names before running deploy commands.

## 1. Local preflight

```powershell
npm install
npm run build
```

Then run both local servers in separate terminals:

```powershell
npm run api:dev
```

```powershell
npm run dev
```

Verify:

- `http://localhost:5173/` shows the public portfolio.
- `http://localhost:5173/admin` shows Admin login.
- `http://localhost:5173/api/health` returns `{"ok":true,...}` through the Vite proxy.
- Admin login works and `/api/auth/me` reports authenticated.
- Public projects/services/skills load from D1.
- A test inquiry can be submitted and appears in Admin.
- An Admin edit persists after refresh.

## 2. Configure the API Worker

The API Worker needs the correct D1 binding and database ID in `wrangler.api.toml`.

The current file declares database `umar-portfolio-db` with a concrete D1 ID. Verify both values in your Cloudflare dashboard before applying migrations. Do not replace a known-good production ID with a different value.

Set the production admin password as a Worker secret (never put it in source code):

```powershell
npx wrangler secret put ADMIN_PASSWORD --config wrangler.api.toml
```

Use a unique, long password. Optionally set a random `RATE_LIMIT_SALT` secret:

```powershell
npx wrangler secret put RATE_LIMIT_SALT --config wrangler.api.toml
```

Apply migrations to the **remote** D1 database only after confirming the database ID and taking a backup:

```powershell
npx wrangler d1 migrations apply umar-portfolio-db --remote --config wrangler.api.toml
```

Deploy the API Worker:

```powershell
npm run api:deploy
```

Verify its health endpoint using the deployed Worker URL:

```text
https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/api/health
```

## 3. Configure Cloudflare Pages

Create/connect a Pages project using the existing Git repository.

- Framework preset: **Vite** (or React/Vite)
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root (the folder containing `package.json`)
- Production branch: your chosen stable branch

The `wrangler.toml` in this archive declares a Pages service binding:

- Binding name: `PORTFOLIO_API`
- Service: `umar-sadiq-portfolio-api`

If the Pages dashboard does not pick up the binding from Wrangler configuration, add it in Pages project settings → Functions → Service bindings, binding name `PORTFOLIO_API`, service `umar-sadiq-portfolio-api`, environment Production. Add the matching Preview binding separately if you want preview deployments to use a non-production API.

The `functions/api/[[path]].js` route forwards `/api/*` requests to that Worker. Keep the frontend API base empty / same-origin; do not set a workers.dev URL as `VITE_API_BASE` when using this proxy.

## 4. Production smoke tests

After Pages deployment and service binding activation:

1. Visit `https://YOUR-SITE.pages.dev/api/health` — expect HTTP 200 JSON.
2. Visit `https://YOUR-SITE.pages.dev/` — public portfolio loads.
3. Visit `/admin` — login appears.
4. Log in; refresh; verify session persists.
5. Change a harmless project description and save; refresh public site and confirm the update.
6. Submit a test inquiry; verify it appears in Admin.
7. Update its status and notes; refresh and verify persistence.
8. Log out; `/admin` must require login again.
9. Test on mobile and a second browser/device.

## 5. Rollback

- Keep the previous successful Git commit and Pages deployment available.
- If the frontend breaks, roll Pages back to the previous deployment.
- Do not roll back D1 migrations by deleting tables or dropping data. Restore from a verified D1 backup only if necessary.
- Keep a copy of the previous Worker deployment/configuration.

## Launch blockers / honest limitations

- The configured D1 ID and database name must be verified against the target Cloudflare account before any remote migration or deployment.
- The Worker now checks same-origin state-changing requests, validates JSON content types and payload sizes, cleans expired sessions at login, and verifies D1 connectivity in its health endpoint. Login and analytics rate limits remain best-effort per Worker isolate; review stronger distributed limits before high-traffic launch.
- Public `/api/content` responses use a field allowlist and omit draft/hidden content; authenticated Admin requests retain the full CMS payload.
- Production must be tested on the actual Pages hostname with the service binding. Local success does not prove production success.
- No live deployment, DNS/domain ownership, Lighthouse score, uptime, or production security audit is claimed by this package.
- Free-tier usage is subject to Cloudflare plan quotas and terms; it is not unlimited.
