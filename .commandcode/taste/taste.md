# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# routing
- Flatten routes - use root-level catch-all `[...slug]` consolidating models, generations, and variants instead of prefixed route groups like `/models/`, `/generation/`, `/variant/`. Confidence: 0.75

# content
- Generation page FAQs use a consistent 10-question template: engine replacement cost, most reliable engine, common problems, overall reliability, engine to avoid, failure signs, replacement vs scrap decision, engine longevity, model/variant differences, and how to find engine code. Confidence: 0.80
- Prefers hardcoding static content (H1/H2 headings) directly in components when it's identical across dynamic pages, rather than keeping it data-driven in JSON. Confidence: 0.75
- Prefers strict brand consistency - when a site is re-branded (e.g., BMW → Jaguar), all user-visible brand references (navbar, footer, headings, data) must match the new brand with no leftover old-brand text. Confidence: 0.75
- When rebranding, change only user-visible brand text (logo text, headings, copyright/disclaimer); leave URLs, route slugs, and link labels untouched. Confidence: 0.80

# ui
See [ui/taste.md](ui/taste.md)
# seo
- Prefers SEO correctness - canonical tags, sitemap generation, and exact route/URL paths (domain spelling, singular vs plural segments like `/engine/` vs `/engines/`) must be precise and verified, not just plausible. Confidence: 0.80
- URLs and canonical tags must not have a trailing slash — the user's SEO tool flags trailing-slash URLs as "Canonicalised", and the user explicitly wants no URL to end in `/`. Confidence: 0.90
- When data files hold hardcoded values that contradict the correct dynamic pattern (e.g., stale canonical domains/paths), prefer deleting those values so auto-generated logic produces the correct output, rather than hand-correcting each record. Confidence: 0.70
- When auditing/fixing canonical tags, treat `src/data/registery` (dynamic pages) and the navbar (navigation links) as the authoritative source of truth for the site's page URLs — cross-check each canonical against these rather than guessing or trusting existing values. Confidence: 0.65

# workflow
See [workflow/taste.md](workflow/taste.md)
