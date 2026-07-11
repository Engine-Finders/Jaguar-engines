# BMW Web — Agent Notes

## Goal
Build a multi-page site (3–4 pages). Start with the **home page**. Priority is **data flow**, not UI polish. UI is a basic white-theme skeleton only (minimal padding/spacing). Later: swap JSON → DB with minimal changes.

## Architecture (current)

### Folders
- Home components: `src/components/home/`
- Home JSON data: `src/data/home/`
- Shared UI: `src/components/shared/` (Navbar, Footer)
- Shared JSON: `src/data/shared/` (navbar, footer)

### Naming
- Section component + JSON share the same name: `homeSec1`, `homeSec2`, …
- Files: `src/components/home/HomeSec1.js` + `src/data/home/homeSec1.json`

### Data flow
- Content is **dynamic** from JSON (one file per section).
- `src/app/page.js` imports JSON and **passes data as props** to section components.
- Later JSON → DB/API; keep the same shape so components stay unchanged.
- **Do not miss any content** when converting provided copy/data into JSON.
- **H1 / H2**: hardcode in the component (same pattern across pages). All other section content comes from JSON.

### Pages
- Home entry: `src/app/page.js`
- Other pages (later): same pattern — page + section JSONs + section components.
- Shared Navbar + Footer on all pages (simple skeleton for now).

### Images
- For now: full `https://` URLs (car images from the web) for testing.
- Replace with real assets later.
- `next.config.mjs` must allow remote image hosts when using `next/image`.

### UI rules (strict)
- **No UI focus** — skeleton only: white theme, basic layout, tight spacing.
- Section reference images (when provided) are only for **structure** (e.g. image left / text right), not visual polish.
- Do not spend tokens on styling, animations, or design systems.
- Do **not** render "/ SECTION N" labels on sections.

## Workflow
1. User provides section content (and optional layout ref image).
2. Create `src/data/home/homeSecN.json` with **all** content except H1/H2 (nothing omitted).
3. Create matching `src/components/home/HomeSecN.js` — hardcode H1/H2; rest from `data` props.
4. Wire in `src/app/page.js`: import JSON → pass props → render component.
5. Repeat section by section.

## Status
- [x] Folder structure + shared Navbar/Footer
- [x] homeSec1 — Hero (desktop: text left / image right; mobile: image first)
- [x] homeSec2 — Find Your Vehicle (desktop: 2-col tables; mobile: stacked list + filters/CTA)
- [x] homeSec3 — Diagnostic Calculator (desktop: 3-col how/calc/trust; mobile: stacked + example/CTA)
- [ ] Home sections 4+ (awaiting content)
- [ ] Other pages (later)

### Layout width
- Desktop content width: `max-w-8xl` (`--container-8xl: 88rem` in `globals.css`)
