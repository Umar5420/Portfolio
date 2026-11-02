# Phase 4 — Backend foundation (Cloudflare Workers + D1)

This phase adds a separate Cloudflare Worker API, a D1 schema, cookie-based sessions, and a small frontend API client. The existing Phase 3 dashboard is preserved.

## API routes

- `GET /api/health` — service health check
- `POST /api/auth/login` — checks the `ADMIN_PASSWORD` Worker secret and creates a 7-day HttpOnly session
- `GET /api/auth/me` — reports whether the session is valid
- `POST /api/auth/logout` — deletes the current session
- `GET /api/content` — reads public portfolio content
- `PUT /api/content` — saves content; requires a valid session

Sessions store only a SHA-256 hash of a randomly generated token. Passwords and session tokens are not stored in browser local storage.

## Deploy the API

1. Install Node.js 22+ and dependencies: `npm install`.
2. Install Wrangler if needed: `npm install -D wrangler`.
3. Create a D1 database: `npx wrangler d1 create umar-portfolio-db`.
4. Copy the returned database ID into `wrangler.api.toml`.
5. Apply the schema: `npx wrangler d1 migrations apply umar-portfolio-db --remote --config wrangler.api.toml`.
6. Set your admin password as a Worker secret: `npx wrangler secret put ADMIN_PASSWORD --config wrangler.api.toml`.
7. Deploy: `npx wrangler deploy --config wrangler.api.toml`.

Keep the API on the same site origin (for example, route it under `/api/*`) for the simplest secure cookie setup. If you deploy it on a separate hostname, configure a strict allowlist for CORS and cookie credentials before production use. Do not use `Access-Control-Allow-Origin: *` with credentialed cross-origin requests.

## Frontend integration status

`src/lib/api.js` provides the typed-by-convention API helper functions. The existing Phase 3 Admin.jsx still uses localStorage and has not yet been switched to login + API-backed persistence. This is intentional: connect and test the Worker and D1 deployment first, then integrate the dashboard UI as the next implementation step. Until that integration is complete, dashboard changes remain browser-local.

## Security notes before production

- Use a strong, unique admin password and keep it only in Cloudflare Worker secrets.
- The sample API uses a single shared admin password. Add per-user accounts, password hashing, login throttling, audit logs and CSRF protections before multi-admin or high-risk use.
- Restrict CORS to your exact frontend origin if the API is hosted separately. Prefer same-origin routing.
- Add scheduled cleanup for expired sessions.
- Never commit secrets or your real D1 database ID to a public repository.
- The API validates the expected content shape and caps payloads at 500 KB.

## Local development

The API requires a Cloudflare Worker runtime and a D1 binding; `npm run dev` alone only starts the existing Vite frontend. Use Wrangler local dev after configuring the D1 binding and secret:

`npx wrangler dev --config wrangler.api.toml`

The public portfolio and Phase 3 admin dashboard remain otherwise unchanged.
