# Phase 17 — Command menu, skill orbit, live code, Python

## New
- **Python is now offered on the site.** A "Python, Automation & AI" service appears in the *Also offered* row (always added, even if Admin → Services does not list it), Python is added to the skills (Backend group, skill orbit, terminal `skills`), and the estimator and contact form have a "Python / Automation / AI" option. No team or teammate wording anywhere.
- **Command menu (Ctrl/⌘ + K)**: type to jump to any section, open the CV, LinkedIn, toggle the theme. Also opened by the new ⌘ button in the header. Keyboard: ↑ ↓ Enter Esc.
- **Skill orbit**: a slowly turning 3D ring of your skills around a glowing "u." in the Skills section. Hover pauses it. Hidden for reduced-motion (the grouped list is still there).
- **Live code card** in the Teaching section: types a short lesson in JavaScript, Python or SQL, then "runs" it. Output is pre-written, nothing is executed.
- Fixed: when the API is offline (local dev), the built-in services showed blank titles. They now read both field styles.

## Notes
- The CV page (`/cv`) skills are unchanged. Add Python in `src/cvData.js` only if you are comfortable being asked about it in an interview.
- If Admin → Skills has its own list, Python is still inserted automatically after PHP.
- Self-drawing timeline and dark/light circular reveal already existed from earlier phases.

## Files
New: `src/components/CommandPalette.jsx`, `SkillOrbit.jsx`, `CodeCard.jsx`, `src/phase17.css`
Edited: `src/App.jsx`, `src/main.jsx`, `src/components/Teach.jsx`, `src/components/Features.jsx`, `package.json`

## Run
    npm install
    npm run dev
