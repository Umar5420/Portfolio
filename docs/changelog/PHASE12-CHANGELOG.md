# Phase 12 — Living portrait, walking guide, about photo

## What's new
- **Hero portrait is alive**: it rises into its arch on load, breathes slowly, cross-fades between your two photos (portrait and seated), tilts with the mouse, and drifts with scroll (parallax). Orbits spin and the stickers float.
- **Walking mini-me** (`src/components/Motion.jsx`, `WalkingMe`): your real face on a small illustrated body walks along the bottom of the page as you scroll. It walks while the page is catching up, stands and breathes when you stop, and waves when you reach the contact section. Hidden when the visitor's device asks for reduced motion.
- **About photo**: the seated photo sits in an arch frame, reveals on scroll, moves slowly inside the frame (parallax) and tilts on hover.
- **Ribbon**: a slowly sliding strip of your services between the hero and About.
- The floating guide card moved up a little so it never covers the walker.

## Files
- New: `src/components/Motion.jsx`, `src/phase12.css`
- Edited: `src/App.jsx` (Portrait, About, WalkingMe/Ribbon hooks), `src/main.jsx` (imports the new CSS)

## Notes
- A true walking video of a real person needs a full-body photo or video; the walker is an illustrated body with your real face.
- `prefers-reduced-motion` turns off all of the above.

## Run
    npm install
    npm run dev
