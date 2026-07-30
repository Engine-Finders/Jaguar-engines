# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# routing
- Flatten routes — use root-level catch-all `[...slug]` consolidating models, generations, and variants instead of prefixed route groups like `/models/`, `/generation/`, `/variant/`. Confidence: 0.75

# content
- Generation page FAQs use a consistent 10-question template: engine replacement cost, most reliable engine, common problems, overall reliability, engine to avoid, failure signs, replacement vs scrap decision, engine longevity, model/variant differences, and how to find engine code. Confidence: 0.80

# workflow
- Provide reusable prompts/templates for clone sites when asked, so patterns can be replicated quickly across similar projects. Confidence: 0.65
- Prefers scoped, minimal changes — do not modify or refactor code that already works correctly; only touch what's needed for the task at hand. Confidence: 0.80
- Prefers thorough validation — proactively check for related small details beyond the immediate task and verify changes with a build before declaring work done. Confidence: 0.65

