# Phase 13 — Premium motion pass

## New
- **Preloader**: the "u." mark draws in and a curtain lifts (about 1.4s, once per browser session).
- **Hero headline reveal**: each line slides up from behind a mask; the outlined word "digital" fills with colour.
- **Smooth scrolling** (Lenis) on mouse/trackpad devices, synced with GSAP ScrollTrigger.
- **Custom cursor**: dot + trailing ring, grows over links, shows "View" over projects, becomes a text bar over inputs.
- **Magnetic buttons**: primary buttons, header actions and "Back to top" pull toward the pointer.
- **Project cards**: spotlight glow that follows the mouse, plus 3D tilt of the cover.
- **Skills**: two-row marquee moving in opposite directions, pauses on hover.
- **Journey timeline**: the vertical line draws as you scroll and each marker pops when reached.
- Removed the leftover "US®" mark from the hero.

## Safety
- Smooth scroll, cursor, magnetic and spotlight effects run only on mouse devices; everything is off for `prefers-reduced-motion`.
- Only transform/opacity are animated (plus one background-size fill on the hero word).

## Still needs your input
- Journey dates ("DATE TO BE ADDED" x4) and one real achievement per role.
- Project cover images (add in Admin) so cards show screenshots instead of monograms.
- Counters (projects, years...) only once you give me numbers you can verify.

## Files
- New: `src/components/Motion2.jsx`, `src/phase13.css`
- Edited: `src/App.jsx`, `src/main.jsx`, `package.json` (adds `lenis`)

## Run
    npm install
    npm run dev

## 13b — Your photos
- **Hero**: you are now cut out of the background and pop out of a coloured arch. Three photos rotate (glasses, hand on glasses, grey waistcoat) with a soft fade, breathing and mouse tilt.
- **Walking mini-me**: now your real photo (white shalwar kameez, cut out) on animated legs. It sways while walking and hops when it reaches the contact section.
- **About**: new seated photo (armchair at the studio).
- **Studio section** (new, between Services and Work): two photo cards that float and tilt as you scroll, with the "Adson Digitals" studio shots.
- **Gallery**: 14 of your photos by default (At the studio, Outdoors, Style, Behind the scenes). Anything you add in Admin → Gallery replaces them.
- **Contact**: a cut-out figure beside the form on wide screens.
- Photos are resized to WebP (total about 1.8 MB for all new images).
- Cut-outs were made with an AI background remover; edges are good but check them at full size.
