# Phase 16 — Engineer + Instructor

## New
- **Teaching section** (`#teach`, between About and Services): "I build it. I teach it." with your three teaching methods, what you teach, your current role at Info Tech Institute, and an **Ask about coaching** button that pre-fills the contact form.
- **/cv page**: a clean, print-ready CV (always light paper, even in dark mode). **Save as PDF / Print** button. Content lives in `src/cvData.js`, so one edit updates both the CV and the Teaching section.
- Hero now reads **Software Engineer & CS Instructor**, adds a **Learn with me** link, and the typing line includes "CS instructor" and "mentor for new coders".
- Terminal: new `teach` (also `courses`) and `cv` (also `resume`) commands.
- Header: **Teach** replaces **Journey** in the top menu (Journey is still on the page).
- SEO: page title, descriptions, share text and manifest now describe you as engineer + instructor; `/cv` added to the sitemap.
- About facts now say **BS CS** (was BS IT) to match your resume.

## Edit these
- `src/cvData.js`: add Aglow Graphics dates, education institutions and years, and confirm the project list.
- If Admin → Profile has its own role/intro text saved, it overrides the new hero text. Update it there too.
- Phone number is intentionally not on the public CV page (spam). Add it in `cvData.js` if you want it.
- To offer a PDF download instead of the /cv page: export the resume, put it in `/public`, and set `cvUrl` in `src/siteConfig.js`.

## Run
    npm install
    npm run dev
