#!/usr/bin/env python3
"""
Convert engine-page TXT content into JSON files matching the shape used by
src/data/engines/aj133.json.

Usage:
  python engine-script/engine_txt_to_json.py
  python engine-script/engine_txt_to_json.py "engine-txts/engine.txt"
  python engine-script/engine_txt_to_json.py path/to/input.txt --out engine-outputs

IGNORE RULES (apply to this script and future TXT→JSON converters):
  1. Step 0 / Cross-Brand Fitment Check — never put in JSON.
  2. "Data Note (internal):" / "Data-integrity note (internal):" /
     "Production Note (internal):" / "PRODUCTION NOTE (internal)" /
     "Correction applied (internal):" — never put in JSON.
  3. Part 1 / Part 2 chat fluff ("End of Part 1", "Part 2 — Meta" preamble
     thinking, "Proceed to Part 2", "This completes the metadata",
     LLM thinking like "Let's generate.", "We need to produce...") — strip;
     never put in JSON (except the actual Part 2 meta/schema values).
  4. PRE-PUBLISH VALIDATION CHECKLIST blocks — ignore entirely.
  5. Meta "Reasoning:" / "Length:" / "Construction:" prose — ignore (only take
     Meta Title / Meta Description values and OG/Twitter/schema).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = ROOT / "engine-txts" / "engine.txt"
DEFAULT_OUT = ROOT / "engine-outputs"

# Allow leading spaces/tabs on headers
PAGE_START_RE = re.compile(
    r"^[ \t]*SECTION\s+1\s*[—\-:]+\s*HERO\b",
    re.MULTILINE | re.IGNORECASE,
)
SECTION_RE = re.compile(
    r"^[ \t]*SECTION\s+(?P<num>\d+)\s*[—\-:]+\s*(?P<label>.+?)\s*$",
    re.MULTILINE | re.IGNORECASE,
)
# Meta Part 2 only — not "PART 2 — SECTIONS 4–7"
PART2_META_RE = re.compile(
    r"^Part\s*2\s*[—\-]?\s*(?:Meta(?:data)?|METADATA)\b.*$",
    re.MULTILINE | re.IGNORECASE,
)
# Back-compat alias used elsewhere in file
PART2_RE = PART2_META_RE
META_TITLE_LINE_RE = re.compile(
    r"^[ \t]*META\s+TITLE\b.*$",
    re.MULTILINE | re.IGNORECASE,
)

FIELD_RE = re.compile(
    r"^(Tag Pill|H1|Sub-headline|Sub-Headline|Trust Strip|Primary CTA|H2|"
    r"Star rating|Confidence|One-line verdict|Labour estimate|"
    r"Shared-cost note|Shared‑cost note|CTA line|Final CTA|CTA Button)\s*:\s*(.*)$",
    re.IGNORECASE,
)

SECTION_KEY_BY_NUM = {
    "1": "hero",
    "2": "atAGlance",
    "3": "verdictRating",
    "4": "compatibility",
    "5": "costGuide",
    "6": "faq",
    "7": "trustCta",
}

KNOWN_HEADER_CELLS = {
    "metric",
    "value",
    "dimension",
    "score (of 20)",
    "how it's determined",
    "model",
    "generation",
    "variant/badge",
    "years",
    "condition",
    "supply only",
    "fitted (indie)",
    "warranty",
}

META_SKIP_PREFIXES = (
    "reasoning:",
    "length:",
    "construction:",
    "text",
    "html",
    "json",
)


def clean(text: str) -> str:
    return re.sub(r"[ \t]+", " ", text.replace("\u00a0", " ").replace("\ufeff", "")).strip()


def non_empty_lines(block: str) -> list[str]:
    return [clean(ln) for ln in block.splitlines() if clean(ln)]


def strip_section_noise(lines: list[str]) -> list[str]:
    out: list[str] = []
    for ln in lines:
        if ln == "________________" or re.fullmatch(r"_+", ln):
            continue
        if ln.lower() in {"text", "json", "html"}:
            continue
        out.append(ln)
    return out


def field_map(lines: list[str]) -> dict[str, str]:
    found: dict[str, str] = {}
    for ln in lines:
        m = FIELD_RE.match(ln)
        if m:
            key = m.group(1).lower().replace("-", " ").replace("‑", "-")
            found[key] = clean(m.group(2))
    return found


def parse_href_and_label(text: str) -> tuple[str, str]:
    text = clean(text)
    m = re.search(r"^(.*?)\s*(?:→|->)\s*(\S+)\s*$", text)
    if m:
        return clean(m.group(1)), m.group(2)
    m = re.search(r"^(.*?)\s+[—\-]\s+(\/\S+)\s*$", text)
    if m:
        return clean(m.group(1)), m.group(2)
    if text.startswith("/"):
        return "", text
    return text, "#"


def take_until_markers(lines: list[str], markers: list[str]) -> tuple[list[str], list[str]]:
    lowered = [m.lower() for m in markers]
    for i, ln in enumerate(lines):
        low = ln.lower()
        for m in lowered:
            if low.startswith(m):
                return lines[:i], lines[i:]
    return lines, []


def cells_from_line(line: str) -> list[str]:
    if "\t" in line:
        parts = [clean(c) for c in line.split("\t")]
        parts = [p for p in parts if p]
        if parts:
            return parts
        return []
    return [clean(line)] if clean(line) else []


def is_real_tab_row(line: str, min_cols: int) -> bool:
    if "\t" not in line:
        return False
    parts = [clean(c) for c in line.split("\t") if clean(c)]
    return len(parts) >= min_cols


def looks_like_header_cell(cell: str) -> bool:
    cell = clean(cell)
    if not cell:
        return False
    low = cell.lower().rstrip(":").strip("*")
    if low in KNOWN_HEADER_CELLS:
        return True
    return False


def parse_table(lines: list[str], min_cols: int = 2) -> tuple[list[str], list[list[str]]]:
    lines = strip_section_noise(lines)
    flat: list[str] = []
    for ln in lines:
        flat.extend(cells_from_line(ln))

    flat = [c for c in flat if c and c != "________________"]
    if not flat:
        return [], []

    tab_widths: list[int] = []
    for ln in lines:
        if is_real_tab_row(ln, min_cols):
            parts = [clean(c) for c in ln.split("\t") if clean(c)]
            tab_widths.append(len(parts))
    if tab_widths:
        ncols = max(set(tab_widths), key=tab_widths.count)
        header: list[str] = []
        rows: list[list[str]] = []
        for ln in lines:
            if not is_real_tab_row(ln, ncols):
                continue
            parts = [clean(c) for c in ln.split("\t") if clean(c)][:ncols]
            if not header:
                header = parts
            elif parts != header:
                rows.append(parts)
        return header, rows

    ncols = 0
    while ncols < len(flat) and looks_like_header_cell(flat[ncols]):
        ncols += 1
    if ncols < min_cols:
        return [], []

    body = flat[ncols:]
    if body and len(body) % ncols != 0:
        body = body[: len(body) - (len(body) % ncols)]
    rows = [body[i : i + ncols] for i in range(0, len(body), ncols)] if body else []
    return flat[:ncols], rows


def row_dict(header: list[str], row: list[str]) -> dict[str, str]:
    while len(row) < len(header):
        row.append("")
    return {clean(h).lower(): clean(v) for h, v in zip(header, row)}


def get_col(mapping: dict[str, str], *names: str) -> str:
    for n in names:
        for k, v in mapping.items():
            if k == n.lower() or n.lower() in k:
                return v
    return ""


def slug_from_url(url: str) -> str:
    if not url:
        return ""
    path = urlparse(url).path.strip("/")
    if not path:
        return ""
    return path.split("/")[-1]


def slug_from_webpage_url(json_ld: dict[str, Any]) -> str:
    graph = json_ld.get("@graph", [])
    if not isinstance(graph, list):
        return ""
    for node in graph:
        if isinstance(node, dict) and node.get("@type") == "WebPage":
            slug = slug_from_url(node.get("url", ""))
            if slug:
                return slug
    return ""


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = value.replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "page"


def extract_json_object(text: str) -> str:
    depth = 0
    start = -1
    for i, ch in enumerate(text):
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start >= 0:
                return text[start : i + 1]
    return ""


def strip_ignored_content(text: str) -> str:
    # Stop at ANY section — do not wipe later pages
    text = re.sub(
        r"Step\s+0\s*[—\-]\s*Cross[-‑]Brand Fitment Check:.*?(?=SECTION\s+\d+\b|\Z)",
        "\n",
        text,
        flags=re.I | re.S,
    )
    text = re.sub(
        r"^Production Note\s*\(internal\):[^\n]*\n?",
        "",
        text,
        flags=re.I | re.M,
    )
    text = re.sub(
        r"^PRODUCTION NOTE\s*\(internal\).*?(?=^PRE[-‑]PUBLISH|^Part\s*2\b|^SECTION\s+\d|\Z)",
        "\n",
        text,
        flags=re.I | re.S | re.M,
    )
    text = re.sub(
        r"PRE[-‑]PUBLISH VALIDATION CHECKLIST.*?(?=Part\s*2\b|SECTION\s+\d+\b|\Z)",
        "\n",
        text,
        flags=re.I | re.S,
    )
    # Must stop at Part 2 OR next SECTION — otherwise eats following pages
    text = re.sub(
        r"(?:Next step:|Generate Part 2|We need to generate Part 2|Given: the content from Part 1).*?"
        r"(?=Part\s*2\b|SECTION\s+\d+\b|\Z)",
        "\n",
        text,
        flags=re.I | re.S,
    )
    text = re.sub(
        r"(?:End of Part\s*1|PART\s*1\s+COMPLETE|This completes Part\s*1).*?"
        r"(?=SECTION\s+\d+\b|Part\s*2\b|\Z)",
        "\n",
        text,
        flags=re.I | re.S | re.M,
    )
    text = re.sub(
        r"^(?:OK,\s+the user has just said|We need to generate Part|This completes the|"
        r"Let's craft|Now produce|I'll structure|Alright,\s+I'll|Summary for Part\s*2|"
        r"First,\s+I need to look at|For Section\s*\d|For the meta|For the schema|"
        r"The user is likely|Note:\s+The sample output|We have Part\s*1|We'll follow|"
        r"We'll output|We need:|Let's produce\.|Now produce the final answer\.|"
        r"Ready for Part\s*2|This completes Sections|Let's generate\.|"
        r"We need to produce|Also need to produce|Let's write the output\.|"
        r"Let's count:|I'll count:|Actually I'll|Since I'm an AI|Given:).*?$",
        "",
        text,
        flags=re.I | re.M,
    )
    return text


def normalize_section_headers(text: str) -> str:
    """Trim leading spaces/tabs before SECTION / Part 2 / META header lines."""
    out: list[str] = []
    for ln in text.splitlines():
        stripped = ln.lstrip(" \t")
        if re.match(
            r"(SECTION\s+\d+\b|Part\s*2\b|META\s+TITLE\b|META\s+DESCRIPTION\b)",
            stripped,
            re.IGNORECASE,
        ):
            out.append(stripped)
        else:
            out.append(ln)
    return "\n".join(out) + ("\n" if text.endswith("\n") else "")


def find_meta_block_start(page_text: str) -> int | None:
    """
    Start index of metadata/schema block.
    Prefer Part 2 — Meta/METADATA; else plain Part 2 that leads into Meta Title;
    else META TITLE line. Never treat 'PART 2 — SECTIONS 4–7' as meta.
    """
    m = PART2_META_RE.search(page_text)
    if m:
        return m.start()

    for m in re.finditer(r"^Part\s*2\s*$", page_text, re.MULTILINE | re.IGNORECASE):
        after = page_text[m.end() : m.end() + 2500]
        if re.search(r"Meta Title|META TITLE|OPEN GRAPH|JSON[-‑]?LD", after, re.I):
            return m.start()

    m = META_TITLE_LINE_RE.search(page_text)
    if m:
        return m.start()
    return None


def filter_internal_lines(lines: list[str]) -> list[str]:
    out: list[str] = []
    for ln in lines:
        low = ln.lower()
        if (
            low.startswith("data note (internal)")
            or low.startswith("data-integrity note")
            or low.startswith("correction applied (internal)")
            or low.startswith("production note (internal)")
            or (low.startswith("production note") and "internal" in low)
        ):
            continue
        if low.startswith("pre-publish validation checklist"):
            break
        if PART2_RE.match(ln):
            break
        out.append(ln)
    return out


def parse_trust_strip(text: str) -> list[dict[str, str]]:
    if not text:
        return []
    items: list[dict[str, str]] = []
    for part in re.split(r"\s*•\s*", text):
        part = clean(part)
        if not part:
            continue
        m = re.match(r"^(\S+)\s+(.*)$", part)
        if m and not m.group(1)[0].isalnum():
            items.append({"icon": m.group(1), "label": clean(m.group(2))})
        else:
            items.append({"icon": "", "label": part})
    return items


def parse_hero(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    fm = field_map(lines)

    cta_text = fm.get("primary cta", "")
    cta_label, cta_href = parse_href_and_label(cta_text) if cta_text else ("", "#")
    if cta_text and cta_href == "#":
        cta_label = cta_text

    return {
        "tagPill": fm.get("tag pill", ""),
        "h1": fm.get("h1", ""),
        "subHeadline": fm.get("sub headline", "") or fm.get("subheadline", ""),
        "trustStrip": parse_trust_strip(fm.get("trust strip", "")),
        "primaryCta": {"label": cta_label or cta_text, "href": cta_href or "#"},
    }


def parse_at_a_glance(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    if lines and lines[0].lower().startswith("h2:"):
        lines = lines[1:]

    header, rows = parse_table(lines, min_cols=2)
    parsed_rows: list[dict[str, str]] = []
    for row in rows:
        if not row or row[0].lower() in {"metric"}:
            continue
        m = row_dict(header, row)
        parsed_rows.append(
            {
                "metric": get_col(m, "metric"),
                "value": get_col(m, "value"),
            }
        )

    return {"rows": parsed_rows}


def merge_score_and_how(score: str, how: str) -> str:
    score = clean(score)
    how = clean(how)
    if score and how:
        return f"{score} ({how})"
    return score or how


def fm_get(fm: dict[str, str], *keys: str) -> str:
    for key in keys:
        norm = key.lower().replace("-", " ").replace("‑", "-")
        if norm in fm:
            return fm[norm]
    return ""


def parse_verdict_rating(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    fm = field_map(lines)

    star_rating = fm_get(fm, "star rating")
    confidence = fm_get(fm, "confidence")
    one_line = fm_get(fm, "one-line verdict", "one line verdict")

    if lines and lines[0].lower().startswith("h2:"):
        lines = lines[1:]

    score_note = ""
    table_lines: list[str] = []
    best_for = ""
    avoid_if = ""
    mode = "scan"

    for ln in lines:
        low = ln.lower()
        if low.startswith("engine score breakdown"):
            score_note = ln if ln.endswith(":") else ln
            mode = "table"
            continue
        if low.startswith("one-line verdict"):
            mode = "after_table"
            continue
        if low.startswith("best for / avoid if"):
            mode = "best_avoid"
            continue
        if low.startswith("best for:"):
            best_for = clean(ln.split(":", 1)[1])
            continue
        if low.startswith("avoid if:"):
            avoid_if = clean(ln.split(":", 1)[1])
            continue
        if mode == "table":
            table_lines.append(ln)

    header, rows = parse_table(table_lines, min_cols=2)
    has_how = any("how" in h.lower() for h in header)
    score_rows: list[dict[str, str]] = []
    for row in rows:
        if not row:
            continue
        dim = clean(row[0].strip("*"))
        if dim.lower() in {"dimension"}:
            continue
        if has_how and len(row) >= 3:
            score_val = merge_score_and_how(row[1], row[2])
        elif len(row) >= 2:
            score_val = clean(row[1])
        else:
            score_val = ""
        score_rows.append({"dimension": dim, "score": score_val})

    return {
        "starRating": star_rating,
        "confidence": confidence,
        "scoreNote": score_note,
        "scoreBreakdown": {
            "columns": ["Dimension", "Score (of 20)"],
            "rows": score_rows,
        },
        "oneLineVerdict": one_line,
        "bestFor": best_for,
        "avoidIf": avoid_if,
    }


def parse_cross_brand_note(text: str) -> str:
    text = clean(text)
    text = re.sub(
        r"^Cross[-‑]link line\s*(?:\([^)]*\))?\s*:\s*",
        "",
        text,
        flags=re.I,
    )
    return text


def parse_compatibility(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    if lines and lines[0].lower().startswith("h2:"):
        lines = lines[1:]

    split_idx = len(lines)
    for i, ln in enumerate(lines):
        if re.match(
            r"^(Exclusive|Cross[-‑]link|Also powers|Also fitted)",
            ln,
            re.I,
        ):
            split_idx = i
            break

    table_lines = lines[:split_idx]
    note_lines = lines[split_idx:]

    header, rows = parse_table(table_lines, min_cols=4)
    parsed_rows: list[dict[str, str]] = []
    for row in rows:
        if not row or row[0].lower() in {"model"}:
            continue
        m = row_dict(header, row)
        parsed_rows.append(
            {
                "model": get_col(m, "model"),
                "generation": get_col(m, "generation"),
                "variantBadge": get_col(m, "variant/badge", "variant badge"),
                "years": get_col(m, "years"),
            }
        )

    cross_note = parse_cross_brand_note(" ".join(note_lines))

    return {
        "columns": ["Model", "Generation", "Variant/Badge", "Years"],
        "rows": parsed_rows,
        "crossBrandNote": cross_note,
    }


def parse_cost_guide(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    fm = field_map(lines)

    if lines and lines[0].lower().startswith("h2:"):
        lines = lines[1:]

    labour = fm_get(fm, "labour estimate")
    shared_note = fm_get(fm, "shared-cost note", "shared cost note")
    for ln in lines:
        if re.match(r"^Shared[-‑]cost note", ln, re.I):
            shared_note = clean(ln.split(":", 1)[1] if ":" in ln else ln)
            break

    cta_text = fm_get(fm, "cta line")
    cta_label, cta_href = parse_href_and_label(cta_text) if cta_text else ("", "#")
    if cta_text:
        cta_label = clean(cta_text.lstrip("→").lstrip("->").strip())
        if cta_href == "#" and ("→" in cta_text or "->" in cta_text):
            cta_label, cta_href = parse_href_and_label(cta_text)

    table_lines: list[str] = []
    for ln in lines:
        low = ln.lower()
        if low.startswith(("labour estimate", "shared", "cta line")):
            continue
        if re.match(r"^Shared[-‑]cost note", ln, re.I):
            continue
        table_lines.append(ln)

    header, rows = parse_table(table_lines, min_cols=4)
    parsed_rows: list[dict[str, str]] = []
    for row in rows:
        if not row or row[0].lower() in {"condition"}:
            continue
        m = row_dict(header, row)
        parsed_rows.append(
            {
                "condition": get_col(m, "condition"),
                "supplyOnly": get_col(m, "supply only"),
                "fittedIndie": get_col(m, "fitted (indie)"),
                "warranty": get_col(m, "warranty"),
            }
        )

    return {
        "columns": ["Condition", "Supply Only", "Fitted (Indie)", "Warranty"],
        "rows": parsed_rows,
        "labourEstimate": labour,
        "sharedCostNote": shared_note,
        "cta": {"label": cta_label, "href": cta_href or "#"},
    }


def normalize_faq_question(q: str) -> str:
    q = clean(q)
    for sep in (" — ", " - "):
        if sep in q:
            after = q.split(sep, 1)[1].strip()
            if after.endswith("?") or re.match(
                r"^(how|what|which|is|does|can|are|do|will|should)\b",
                after,
                re.I,
            ):
                return after
    return q


def parse_faq(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    if lines and lines[0].lower().startswith("h2:"):
        lines = lines[1:]

    items: list[dict[str, Any]] = []
    q_re = re.compile(r"^(?:Q\s*)?(\d+)\s*[.:]\s*(.*)$", re.IGNORECASE)
    current: dict[str, Any] | None = None

    for ln in lines:
        m = q_re.match(ln)
        if m:
            if current:
                items.append(current)
            current = {
                "id": int(m.group(1)),
                "question": normalize_faq_question(m.group(2)),
                "answer": "",
            }
        elif current is not None:
            current["answer"] = clean((current["answer"] + " " + ln).strip())

    if current:
        items.append(current)

    if not items:
        current = None
        for ln in lines:
            if ln.endswith("?"):
                if current:
                    items.append(current)
                current = {
                    "id": len(items) + 1,
                    "question": normalize_faq_question(ln),
                    "answer": "",
                }
            elif current is not None:
                current["answer"] = clean((current["answer"] + " " + ln).strip())
        if current:
            items.append(current)

    return {"items": items}


def parse_trust_cta(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    fm = field_map(lines)

    trust_points: list[str] = []
    final_cta = fm_get(fm, "final cta")
    cta_text = fm_get(fm, "cta button")
    cta_label, cta_href = parse_href_and_label(cta_text) if cta_text else ("", "#")
    if cta_text and cta_href == "#":
        cta_label = cta_text

    in_trust = False
    for ln in lines:
        low = ln.lower()
        if low.startswith("trust points"):
            in_trust = True
            continue
        if low.startswith("final cta"):
            in_trust = False
            continue
        if low.startswith("cta button"):
            in_trust = False
            continue
        if in_trust:
            item = clean(ln.lstrip("* ").strip())
            if item:
                trust_points.append(item)

    return {
        "trustPoints": trust_points,
        "finalCta": final_cta,
        "ctaButton": {"label": cta_label or cta_text, "href": cta_href or "#"},
    }


def extract_meta_value(block: str, field_name: str) -> str:
    pattern = re.compile(rf"^{re.escape(field_name)}\s*$", re.MULTILINE | re.IGNORECASE)
    m = pattern.search(block)
    if not m:
        colon = re.search(rf"^{re.escape(field_name)}\s*:\s*(.+)$", block, re.I | re.M)
        if colon:
            return clean(colon.group(1))
        return ""

    for raw in block[m.end() :].splitlines():
        ln = clean(raw)
        if not ln:
            continue
        low = ln.lower()
        if low in META_SKIP_PREFIXES or low.startswith(META_SKIP_PREFIXES):
            continue
        if low.startswith(("meta title", "meta description", "open graph", "twitter", "json")):
            break
        return ln
    return ""


def parse_meta_and_schema(page_text: str) -> dict[str, Any]:
    meta: dict[str, Any] = {
        "slug": "",
        "title": "",
        "description": "",
        "canonical": "",
        "openGraph": {
            "title": "",
            "description": "",
            "type": "",
            "url": "",
            "image": "",
            "siteName": "",
        },
        "twitter": {
            "card": "",
            "title": "",
            "description": "",
            "image": "",
        },
        "jsonLd": {},
    }

    meta_start = find_meta_block_start(page_text)
    if meta_start is None:
        return meta

    meta_block = page_text[meta_start:]
    meta_block = re.split(
        r"Production Note\s*\(internal\)|Pre[-‑]Publish Validation Checklist",
        meta_block,
        maxsplit=1,
        flags=re.I,
    )[0]

    meta["title"] = extract_meta_value(meta_block, "Meta Title")
    meta["description"] = extract_meta_value(meta_block, "Meta Description")

    cm = re.search(
        r'Canonical Tag:\s*<link\s+rel="canonical"\s+href="([^"]+)"',
        meta_block,
        re.I,
    )
    if cm:
        meta["canonical"] = cm.group(1)

    og_mapping = {
        "title": "title",
        "description": "description",
        "type": "type",
        "url": "url",
        "image": "image",
        "site_name": "siteName",
    }
    tw_mapping = {
        "card": "card",
        "title": "title",
        "description": "description",
        "image": "image",
    }

    for ln in meta_block.splitlines():
        ln = clean(ln)
        og_m = re.search(r'property="og:([^"]+)"\s+content="([^"]*)"', ln, re.I)
        if og_m:
            key = og_m.group(1).lower()
            if key in og_mapping:
                meta["openGraph"][og_mapping[key]] = og_m.group(2)
            continue
        tw_m = re.search(r'name="twitter:([^"]+)"\s+content="([^"]*)"', ln, re.I)
        if tw_m:
            key = tw_m.group(1).lower()
            if key in tw_mapping:
                meta["twitter"][tw_mapping[key]] = tw_m.group(2)
            continue
        # og:title = … / twitter:card = …
        kv = re.match(
            r"^(?P<key>(?:og|twitter):[A-Za-z0-9_:]+)\s*[=:]\s*(?P<val>.+)$",
            ln,
            re.I,
        )
        if not kv:
            continue
        key = kv.group("key").lower()
        val = clean(kv.group("val"))
        if val.startswith("[") and val.endswith("]"):
            val = ""
        if key.startswith("og:"):
            og_key = key[3:]
            if og_key in og_mapping:
                meta["openGraph"][og_mapping[og_key]] = val
        elif key.startswith("twitter:"):
            tw_key = key[8:]
            if tw_key in tw_mapping:
                meta["twitter"][tw_mapping[tw_key]] = val

    if not meta["title"] and meta["openGraph"].get("title"):
        meta["title"] = meta["openGraph"]["title"]
    if not meta["description"] and meta["openGraph"].get("description"):
        meta["description"] = meta["openGraph"]["description"]

    json_m = re.search(r"JSON[-‑]LD.*?$", meta_block, re.I | re.M)
    schema_block = meta_block[json_m.end() :] if json_m else meta_block
    brace_start = schema_block.find("{")
    if brace_start >= 0:
        raw = extract_json_object(schema_block[brace_start:])
        if raw:
            try:
                meta["jsonLd"] = json.loads(raw)
            except json.JSONDecodeError:
                cleaned = re.sub(r",\s*}", "}", raw)
                cleaned = re.sub(r",\s*]", "]", cleaned)
                try:
                    meta["jsonLd"] = json.loads(cleaned)
                except json.JSONDecodeError as e:
                    print(f"  ! warning: could not parse JSON-LD ({e})", file=sys.stderr)
                    meta["jsonLd"] = {}

    slug = ""
    if meta["openGraph"].get("url"):
        slug = slug_from_url(meta["openGraph"]["url"])
    if not slug and meta["jsonLd"]:
        slug = slug_from_webpage_url(meta["jsonLd"])
    if not slug and meta.get("canonical"):
        slug = slug_from_url(meta["canonical"])
    if slug:
        meta["slug"] = slug

    if not meta["canonical"] and meta["openGraph"].get("url"):
        meta["canonical"] = meta["openGraph"]["url"]

    return meta


def empty_page_skeleton() -> dict[str, Any]:
    return {
        "meta": {
            "slug": "",
            "title": "",
            "description": "",
            "canonical": "",
            "openGraph": {
                "title": "",
                "description": "",
                "type": "",
                "url": "",
                "image": "",
                "siteName": "",
            },
            "twitter": {
                "card": "",
                "title": "",
                "description": "",
                "image": "",
            },
            "jsonLd": {},
        },
        "hero": {
            "tagPill": "",
            "h1": "",
            "subHeadline": "",
            "trustStrip": [],
            "primaryCta": {"label": "", "href": "#"},
        },
        "atAGlance": {"rows": []},
        "verdictRating": {
            "starRating": "",
            "confidence": "",
            "scoreNote": "",
            "scoreBreakdown": {"columns": ["Dimension", "Score (of 20)"], "rows": []},
            "oneLineVerdict": "",
            "bestFor": "",
            "avoidIf": "",
        },
        "compatibility": {
            "columns": ["Model", "Generation", "Variant/Badge", "Years"],
            "rows": [],
            "crossBrandNote": "",
        },
        "costGuide": {
            "columns": ["Condition", "Supply Only", "Fitted (Indie)", "Warranty"],
            "rows": [],
            "labourEstimate": "",
            "sharedCostNote": "",
            "cta": {"label": "", "href": "#"},
        },
        "faq": {"items": []},
        "trustCta": {
            "trustPoints": [],
            "finalCta": "",
            "ctaButton": {"label": "", "href": "#"},
        },
    }


SECTION_PARSERS = {
    "hero": parse_hero,
    "atAGlance": parse_at_a_glance,
    "verdictRating": parse_verdict_rating,
    "compatibility": parse_compatibility,
    "costGuide": parse_cost_guide,
    "faq": parse_faq,
    "trustCta": parse_trust_cta,
}


def split_pages(text: str) -> list[tuple[str, str]]:
    starts = list(PAGE_START_RE.finditer(text))
    if not starts:
        raise SystemExit(
            "No engine pages found. Expected lines like "
            "'SECTION 1 — HERO' or 'SECTION 1: HERO'."
        )

    pages: list[tuple[str, str]] = []
    for i, m in enumerate(starts):
        lookback_start = starts[i - 1].end() if i > 0 else 0
        preamble = text[lookback_start : m.start()]
        start = m.start()
        end = starts[i + 1].start() if i + 1 < len(starts) else len(text)
        body = text[start:end]
        pages.append((preamble, body))
    return pages


def iter_sections(content: str) -> list[tuple[str, str, str]]:
    matches = list(SECTION_RE.finditer(content))
    sections: list[tuple[str, str, str]] = []
    for i, m in enumerate(matches):
        num = m.group("num")
        if num not in SECTION_KEY_BY_NUM:
            continue
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(content)
        key = SECTION_KEY_BY_NUM[num]
        label = m.group("label") or ""
        sections.append((key, label, content[start:end]))
    return sections


def guess_page_title(preamble: str, hero: dict[str, Any]) -> str:
    if hero.get("tagPill"):
        return hero["tagPill"].split("•")[0].strip()
    if hero.get("h1"):
        return re.split(r"\s+[—\-]\s+", hero["h1"])[0]
    lines = [clean(ln) for ln in preamble.splitlines() if clean(ln)]
    for ln in reversed(lines[-20:]):
        if re.search(r"\bengine page\b", ln, re.I):
            return ln
    return "unknown-engine"


def build_page(preamble: str, page_text: str) -> dict[str, Any]:
    page = empty_page_skeleton()

    meta_start = find_meta_block_start(page_text)
    content = page_text[:meta_start] if meta_start is not None else page_text
    content = re.sub(
        r"PRODUCTION NOTE\s*\(internal\).*$",
        "",
        content,
        flags=re.I | re.S,
    )
    content = re.sub(
        r"PRE[-‑]PUBLISH VALIDATION CHECKLIST.*$",
        "",
        content,
        flags=re.I | re.S,
    )

    sections = iter_sections(content)
    for key, _label, body in sections:
        parser = SECTION_PARSERS.get(key)
        if not parser:
            continue
        try:
            page[key] = parser(body)
        except Exception as e:
            print(f"  ! failed parsing section '{key}': {e}", file=sys.stderr)

    page["meta"] = parse_meta_and_schema(page_text)

    if not page["meta"]["slug"]:
        h1 = page.get("hero", {}).get("h1", "")
        raw = ""
        if h1:
            raw = re.sub(
                r"\b(engine|engines)\b.*$",
                "",
                h1,
                flags=re.I,
            ).strip(" —-")
        page["meta"]["slug"] = slugify(raw or guess_page_title(preamble, page.get("hero", {})))

    if not page["meta"]["title"] and page.get("hero", {}).get("h1"):
        page["meta"]["title"] = page["hero"]["h1"]

    return {
        "meta": page["meta"],
        "hero": page["hero"],
        "atAGlance": page["atAGlance"],
        "verdictRating": page["verdictRating"],
        "compatibility": page["compatibility"],
        "costGuide": page["costGuide"],
        "faq": page["faq"],
        "trustCta": page["trustCta"],
    }


def find_missing_sections(page_text: str) -> list[str]:
    meta_start = find_meta_block_start(page_text)
    content = page_text[:meta_start] if meta_start is not None else page_text
    found = {key for key, _label, _body in iter_sections(content)}
    return [key for key in SECTION_KEY_BY_NUM.values() if key not in found]


def find_empty_critical_sections(page: dict[str, Any]) -> list[str]:
    empty: list[str] = []
    faq = page.get("faq") or {}
    if not faq.get("items"):
        empty.append("faq")
    meta = page.get("meta") or {}
    og = meta.get("openGraph") or {}
    if not meta.get("jsonLd") and not meta.get("description") and not og.get("url"):
        empty.append("schema")
    return empty


def collect_page_gaps(page_text: str, page: dict[str, Any]) -> list[str]:
    gaps: list[str] = []
    seen: set[str] = set()
    for key in find_missing_sections(page_text) + find_empty_critical_sections(page):
        if key not in seen:
            seen.add(key)
            gaps.append(key)
    return gaps


def write_missing_sections_log(
    out_dir: Path, entries: list[tuple[str, list[str]]]
) -> Path:
    lines: list[str] = []
    for page_name, missing in entries:
        if not missing:
            continue
        lines.append(page_name)
        for key in missing:
            lines.append(f"missing {key}")
        lines.append("")
    if not lines:
        lines = ["No missing sections.\n"]
    log_path = out_dir / "loging.txt"
    log_path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    return log_path


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
            sys.stderr.reconfigure(encoding="utf-8")
        except Exception:
            pass

    parser = argparse.ArgumentParser(description="Convert engine page TXT → JSON")
    parser.add_argument(
        "input",
        nargs="?",
        default=str(DEFAULT_INPUT),
        help="Path to engine pages TXT file",
    )
    parser.add_argument(
        "--out",
        default=str(DEFAULT_OUT),
        help="Output directory for JSON files",
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.is_file():
        alt = ROOT / args.input
        if alt.is_file():
            input_path = alt
        else:
            raise SystemExit(f"Input not found: {args.input}")

    out_dir = Path(args.out)
    if not out_dir.is_absolute():
        out_dir = ROOT / out_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    text = input_path.read_text(encoding="utf-8-sig")
    text = strip_ignored_content(text)
    text = normalize_section_headers(text)
    pages = split_pages(text)
    print(f"Found {len(pages)} page(s) in {input_path.name}")

    written: list[tuple[str, Path]] = []
    used_slugs: set[str] = set()
    missing_log_entries: list[tuple[str, list[str]]] = []
    for preamble, page_text in pages:
        try:
            data = build_page(preamble, page_text)
        except Exception as e:
            print(f"  ! failed page: {e}", file=sys.stderr)
            continue

        title = guess_page_title(preamble, data.get("hero", {}))
        print(f"- Parsing: {title}")

        slug = data["meta"]["slug"] or slugify(title)
        if slug in used_slugs:
            n = 2
            while f"{slug}-{n}" in used_slugs:
                n += 1
            slug = f"{slug}-{n}"
            data["meta"]["slug"] = slug
        used_slugs.add(slug)

        missing = collect_page_gaps(page_text, data)
        missing_log_entries.append((slug, missing))
        if missing:
            print(f"  ! missing sections: {', '.join(missing)}", file=sys.stderr)

        out_path = out_dir / f"{slug}.json"
        out_path.write_text(
            json.dumps(data, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        written.append((slug, out_path))
        print(f"  → {out_path.relative_to(ROOT)}")

    log_path = write_missing_sections_log(out_dir, missing_log_entries)
    print(f"Missing-section log → {log_path.relative_to(ROOT)}")
    print(f"Done. Wrote {len(written)} file(s).")
    if written:
        print("Slugs:", ", ".join(slug for slug, _ in written))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
