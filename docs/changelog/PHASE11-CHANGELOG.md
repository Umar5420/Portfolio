# Phase 11 — Theme Studio, Greeting, Gallery & Client Conversations

## What's new
- **Theme Studio** (floating "Themes" button + palette icon in the header). Visitors pick:
  - **Mood**: Auto (follows their clock), Light, Dark, Morning, Evening, Ocean (blue), Rose (pink), Violet (purple), Aurora.
  - **Style**: Classic (the original look), Glassy, Soft, Neon.
  - **Ambient glow** on/off. Choices are saved on the visitor's device. Changes play a circular colour reveal (where the browser supports it).
  - The header moon/sun button still flips between a light and a dark mood.
- **Greeting** in the hero: good morning / afternoon / evening / night, a rotating "hello" in several languages, and an optional visitor name.
- **Gallery** section: filterable masonry grid and a full-screen lightbox (arrow keys, swipe, Esc). It uses images added in Admin → Gallery plus every project's cover/gallery images.
- **Client conversations** section: an animated chat window (typing indicator, replay). Shown only for conversations you tick "Publish" on.
- **Admin → Gallery** and **Admin → Conversations** (paste a whole chat and it converts to messages). Stored in the existing content JSON — **no new D1 migration**.
- Section numbers now adapt automatically; the floating guide knows about the new sections.

## Fixes made along the way
- Contact form text was white on a beige band (unreadable) — it now follows the active mood.
- Skills tags were unreadable in dark mood (light text on a light band).
- Admin → Design Studio's accent now actually applies (it previously set a variable nothing read). It is the *default* accent for Light/Dark; visitors can still choose any mood.
- React warning for `fetchPriority` on the hero image.
- `package.json` was missing from the archive; it is included again.

## Important notes
- **Conversations are never fabricated.** In local development (`npm run dev`) two clearly labelled SAMPLE conversations appear so you can see the layout. They are not included in production builds. The public section stays hidden until you publish a real one with the client's permission.
- Gallery images are URL-based (`https://…` or `/images/photo.webp`); file uploads to R2 are still a future step. Put files in `public/images/` and reference them as `/images/name.webp`.
- If you have not added project cover images, the gallery shows the project monogram tiles for those projects.

## Run
```bash
npm install
npm run api:dev      # terminal 1 (needs your own .dev.vars with ADMIN_PASSWORD)
npm run dev          # terminal 2
```
