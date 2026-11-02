# Phase 7 — Client Conversion & Communication

## Added
- Public project inquiry form in the contact section (name, email, optional phone, service, budget, message).
- Worker endpoint `POST /api/inquiries` with input validation, a honeypot field, and a basic per-IP hourly limit (5 submissions/hour; IP is stored only as a salted SHA-256 hash).
- D1 inquiries table migration `0002_inquiries.sql`.
- Authenticated admin inquiry list, status tracking (New, Contacted, In Progress, Won, Closed), internal notes, refresh, and CSV export.
- New API helper methods for submission and inquiry administration.

## Required database step
Apply the new migration before using inquiries:
`npx wrangler d1 migrations apply umar-portfolio-db --local --config wrangler.api.toml`
For production later, apply with `--remote`. Do not run remote until you are intentionally deploying.

## Notes / limitations
- This phase stores inquiries in D1; it does not send email or WhatsApp notifications. The admin can respond using the visitor's email address.
- No third-party email provider or paid service is required.
- The existing wildcard CORS policy and general auth hardening remain production-review items. Use same-origin routing as already configured; do not expose the API with credentialed wildcard CORS.
- Public submission is limited to 5 per IP hash per rolling hour. Add Cloudflare Turnstile before public launch if spam becomes an issue.

## Preserve your existing Cloudflare configuration
When copying this cumulative ZIP into your working folder, do not overwrite your existing `wrangler.api.toml` or `.dev.vars`. Keep the real D1 database ID already configured in your local file. The ZIP's config may contain a placeholder ID for safety.
