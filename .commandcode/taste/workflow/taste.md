# workflow
- Provide reusable prompts/templates for clone sites when asked, so patterns can be replicated quickly across similar projects. Confidence: 0.65
- Prefers scoped, minimal changes — do not modify or refactor code that already works correctly; only touch what's needed for the task at hand. Confidence: 0.95
- Prefers thorough validation — proactively check for related small details beyond the immediate task and verify changes with a build before declaring work done. Confidence: 0.75
- When changing URL routing or naming conventions, grep data files (JSON, etc.) for hardcoded values that may contradict the new pattern — don't rely on code fixes alone; stale hardcoded data is a recurring failure mode. Confidence: 0.80
- Prefers fast execution on simple, well-defined tasks (explicitly requests "do it fast"). Confidence: 0.65
- When updating navigation/footer links, ground the list in the source of truth on disk — the `public/` directory for static pages and `src/data/registery` for dynamic pages (models, generations, variants, engines) — sync URLs to entries that actually exist and delete entries not present in that source. Confidence: 0.85
- For simple data/nav updates, prefer writing the data files directly by hand over writing and running a one-off generation script (user explicitly said "don't run the script... manually... fast"). Confidence: 0.70
