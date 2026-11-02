# Phase 6 — Advanced Character & Animation

## Included
- Reworked the persistent guide into an interactive 2.5D portrait character.
- Cursor-reactive perspective movement with bounded rotation.
- Two supplied portrait photographs can be switched within the character frame.
- Section-aware character states: introduction, curious, presenting, focused, reflective and welcoming.
- Animated glow, orbit accents, shine and spark details.
- Contextual action link and six section navigation dots.
- Compact/expanded character mode.
- Responsive sizing and reduced-motion support.
- Preserves the existing portfolio theme and section navigation.

## Honest animation limitation
This phase uses the user's two supplied photographs with layered CSS motion. It does not create a true rigged 3D human, full-body walking cycle, independently animated limbs or generated facial expressions. Those require a prepared character model/rig or a designed multi-pose image sequence. The current guide is a lightweight 2.5D portrait experience designed to work with the existing assets.

## Verification
- Source changes are limited to `src/App.jsx` and `src/styles.css`, plus this changelog.
- The full Vite build was not verified in this environment because project dependencies are not installed here. Run `npm install` followed by `npm run build` locally before deployment.
- No D1 schema or content migration is required.
