# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# routing
- Flatten routes — use root-level catch-all `[...slug]` consolidating models, generations, and variants instead of prefixed route groups like `/models/`, `/generation/`, `/variant/`. Confidence: 0.75

# content
- Generation page FAQs use a consistent 10-question template: engine replacement cost, most reliable engine, common problems, overall reliability, engine to avoid, failure signs, replacement vs scrap decision, engine longevity, model/variant differences, and how to find engine code. Confidence: 0.80
- Prefers hardcoding static content (H1/H2 headings) directly in components when it's identical across dynamic pages, rather than keeping it data-driven in JSON. Confidence: 0.55

# workflow
- Provide reusable prompts/templates for clone sites when asked, so patterns can be replicated quickly across similar projects. Confidence: 0.65
- Prefers scoped, minimal changes — do not modify or refactor code that already works correctly; only touch what's needed for the task at hand. Confidence: 0.85
- Prefers thorough validation — proactively check for related small details beyond the immediate task and verify changes with a build before declaring work done. Confidence: 0.75
- When changing URL routing or naming conventions, grep data files (JSON, etc.) for hardcoded values that may contradict the new pattern — don't rely on code fixes alone; stale hardcoded data is a recurring failure mode. Confidence: 0.70

 Keep companion documentation/reference files (e.g., `canonicals.md`, `all-headings.txt`) updated in sync with code changes when implementing features. Confidence: 0.75
- Prefers fast execution on simple, well-defined tasks (explicitly requests "do it fast"). Confidence: 0.60

