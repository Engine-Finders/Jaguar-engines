# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# routing
- Flatten routes — use root-level catch-all `[...slug]` consolidating models, generations, and variants instead of prefixed route groups like `/models/`, `/generation/`, `/variant/`. Confidence: 0.75

# content
- Generation page FAQs use a consistent 10-question template: engine replacement cost, most reliable engine, common problems, overall reliability, engine to avoid, failure signs, replacement vs scrap decision, engine longevity, model/variant differences, and how to find engine code. Confidence: 0.80
- Prefers hardcoding static content (H1/H2 headings) directly in components when it's identical across dynamic pages, rather than keeping it data-driven in JSON. Confidence: 0.75
- Prefers strict brand consistency — when a site is re-branded (e.g., BMW → Jaguar), all user-visible brand references (navbar, footer, headings, data) must match the new brand with no leftover old-brand text. Confidence: 0.75
- When rebranding, change only user-visible brand text (logo text, headings, copyright/disclaimer); leave URLs, route slugs, and link labels untouched. Confidence: 0.70

# ui
- Prefers proper dark theme support across the UI — chrome elements (table headers, step/number badges, icon circles, selected tab/filter button states) and interactive elements (CTA/sticky buttons, form buttons, spinners) must stay readable in dark mode rather than rendering white-on-white or keeping hardcoded light-only backgrounds/text. Confidence: 0.90
- Prefers CTA/button colors to match the main theme (near-black `--color-primary`), replacing hardcoded off-brand colors like blue gradients. Confidence: 0.75
- Primary CTA buttons should link to the conversion/quote page (`/quote`) rather than placeholder `#` or stale data-driven hrefs. Confidence: 0.70

# workflow
See [workflow/taste.md](workflow/taste.md)
