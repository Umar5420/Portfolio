# Phase 5 changelog

- Added dynamic project search, category filters and featured/name sorting.
- Added project cards with optional cover image previews.
- Added dedicated project case-study routes at `/projects/<slug>`.
- Added detailed project fields to the existing Admin editor.
- Added technology lists, image gallery URLs, featured state and live project links.
- Preserved the existing D1 JSON content contract; no migration is required.
- Corrected Worker login/logout JSON response helper usage in the bundled Worker and made the session cookie Secure only on HTTPS requests so local HTTP development can use the session cookie.

## Verification
- JSX/JS syntax transpilation check passed for `src/App.jsx`, `src/Admin.jsx` and `src/main.jsx`.
- `node --check worker/index.js` passed.
- A full Vite production build was not run in this environment because dependencies were not installed successfully. Run `npm install` and `npm run build` locally before deployment.
