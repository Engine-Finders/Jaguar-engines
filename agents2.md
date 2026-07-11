# Agents2 — Multi-Page Architecture

## Scope
- **Home** stays as-is (`src/app/page.js` + home JSON/components). Do not touch unless asked.
- Other pages: one JSON per page, section components, no UI (plain data dump OK). Never miss content.

## Models
- JSON: `src/data/models/<slug>.json`
- Registry: `src/data/registery/models/pages.json`
- Components: `src/components/models/`
- Route: `/models/[slug]` → `src/app/models/[slug]/page.js`
- Add JSON **and** registry entry or URL 404s.

## Generations
- JSON: `src/data/generations/<slug>.json`
- Registry: `src/data/registery/generations/pages.json`
- Components: `src/components/generation/`
- Route: `/generation/[slug]` → `src/app/generation/[slug]/page.js`
- Same rules: one JSON (meta + sections), one component per section, update registry when adding a page.

## Variants
- JSON: `src/data/variants/<slug>.json`
- Registry: `src/data/registery/variants/pages.json`
- Components: `src/components/variant/`
- Route: `/variant/[slug]` → `src/app/variant/[slug]/page.js`
- Same rules as models/generations.

## Page JSON shape
```json
{
  "meta": { "title": "...", "description": "...", "openGraph": {}, "twitter": {}, "jsonLd": {} },
  "slug": "example-slug",
  "hero": {},
  "sectionKey": {}
}
```

## Workflow
1. User sends content (+ slug).
2. Create page JSON with **all** content.
3. Add slug to the correct `pages.json`.
4. Create/reuse section components.
5. Confirm URL renders.
