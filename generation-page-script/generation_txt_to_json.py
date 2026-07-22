#!/usr/bin/env python3
"""
Convert generation-page TXT content into JSON files matching the shape used by
src/data/generations/bmw-3-series-e90.json.

Usage:
  python generation-page-script/generation_txt_to_json.py
  python generation-page-script/generation_txt_to_json.py "generation-page-txt/EM Generation Pages 1 (1).txt"
  python generation-page-script/generation_txt_to_json.py path/to/input.txt --out generation-page-outputs

IGNORE RULES (apply to this script and future TXT→JSON converters):
  1. Step 0 Check Results (Check A / Check B / Authority Model mode) — never put in JSON.
  2. Hero "Data-integrity note (internal): ..." — never put in JSON (leave dataIntegrityNote empty).
  3. Sec 2 "Data sources note:" and "Data note (internal) — corrections..." / "Correction applied..."
     — never put in JSON (leave dataCorrections empty).
  4. Part 1 / Part 2 chat fluff ("End of Part 1 Output", "Part 2", LLM thinking paragraphs)
     — strip anywhere; never put in JSON.
  5. Sec 2 "Confidence Score panel:" — ALWAYS include in confidenceScore; empty title/text if missing.
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
DEFAULT_INPUT = ROOT / "generation-page-txt" / "EM Generation Pages 1 (1).txt"
DEFAULT_OUT = ROOT / "generation-page-outputs"

# Allow leading spaces/tabs on headers (export sometimes indents SECTION/META/SCHEMA)
PAGE_START_RE = re.compile(
    r"^[ \t]*SECTION\s+1\s*[—\-:]+\s*HERO\b",
    re.MULTILINE | re.IGNORECASE,
)
SECTION_RE = re.compile(
    r"^[ \t]*SECTION\s+(?P<num>\d+)\s*[—\-:]+\s*(?P<label>.+?)"
    r"(?:\s*[—\-]+\s*(?:<\s*(?P<component>[A-Za-z0-9_]+)\s*>)?)?\s*$",
    re.MULTILINE | re.IGNORECASE,
)
META_SECTION_RE = re.compile(r"^[ \t]*META\s*$", re.MULTILINE | re.IGNORECASE)
SCHEMA_SECTION_RE = re.compile(
    r"^[ \t]*SCHEMA\s*(?:\(JSON[-‑–—]LD\))?\s*$",
    re.MULTILINE | re.IGNORECASE,
)
META_TITLE_BLOCK_RE = re.compile(
    r"^[ \t]*META\s*\n"
    r"(?:[ \t]*Meta Title[^\n]*\n)?"
    r"(?:[ \t]*Meta Description[^\n]*\n)?",
    re.MULTILINE | re.IGNORECASE,
)

FIELD_RE = re.compile(
    r"^(Tag Pill|H1|Sub-headline|Sub-Headline|Trust Strip|Primary CTA|H2)\s*:\s*(.*)$",
    re.IGNORECASE,
)

SECTION_KEY_BY_NUM = {
    "1": "hero",
    "2": "engineDatabase",
    "3": "overview",
    "4": "bestWorstEngines",
    "5": "ownershipEconomics",
    "6": "commonProblems",
    "7": "replacementCosts",
    "8": "coreVariants",
    "9": "marketIntelligence",
    "10": "faq",
    "11": "trustCta",
}

KNOWN_HEADER_CELLS = {
    "#",
    "metric",
    "display",
    "signal",
    "2025 data",
    "demand trend",
    "engine code",
    "family",
    "fuel",
    "disp.",
    "disp",
    "displacement",
    "power",
    "years",
    "gen.",
    "gen",
    "generation",
    "model",
    "reliability",
    "2025 enquiries",
    "enquiries",
    "avg. recon cost",
    "avg recon cost",
    "variant",
    "used (supply)",
    "reconditioned (supply)",
    "rebuilt (supply)",
    "labour hours",
    "engine",
    "typical mileage",
    "common major failure",
    "repair cost (specialist)",
    "replacement cost (recon)",
    "ownership verdict",
    "preventative/early repair",
    "catastrophic/full replacement",
    "dealer",
    "specialist",
    "work",
    "viable?",
}


def clean(text: str) -> str:
    return re.sub(r"[ \t]+", " ", text.replace("\u00a0", " ").replace("\ufeff", "")).strip()


def non_empty_lines(block: str) -> list[str]:
    return [clean(ln) for ln in block.splitlines() if clean(ln)]


def strip_section_noise(lines: list[str]) -> list[str]:
    out = []
    for ln in lines:
        if ln == "________________":
            continue
        if re.fullmatch(r"_+", ln):
            continue
        out.append(ln)
    return out


def field_map(lines: list[str]) -> dict[str, str]:
    found: dict[str, str] = {}
    for ln in lines:
        m = FIELD_RE.match(ln)
        if m:
            key = m.group(1).lower().replace("-", " ")
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
    return text, "#"


def split_bullet_line(text: str) -> list[str]:
    text = clean(text)
    if " • " in text:
        return [clean(p) for p in text.split(" • ") if clean(p)]
    if "·" in text:
        return [clean(p) for p in text.split("·") if clean(p)]
    return [text] if text else []


def parse_trust_strip(text: str) -> list[dict[str, str]]:
    items = []
    for part in split_bullet_line(text):
        m = re.match(r"^(\S+)\s+(.*)$", part)
        if m and not m.group(1)[0].isalnum():
            items.append({"icon": m.group(1), "label": clean(m.group(2))})
        else:
            items.append({"icon": "", "label": part})
    return items


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
    low = cell.lower().rstrip(":")
    if low in KNOWN_HEADER_CELLS:
        return True
    if low.startswith("years (") or low.startswith("variants ("):
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

    tab_widths = []
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
            else:
                if parts == header:
                    continue
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


def take_until_markers(lines: list[str], markers: list[str]) -> tuple[list[str], list[str]]:
    lowered = [m.lower() for m in markers]
    for i, ln in enumerate(lines):
        low = ln.lower()
        for m in lowered:
            if low.startswith(m):
                return lines[:i], lines[i:]
    return lines, []


def slug_from_webpage_url(json_ld: dict[str, Any]) -> str:
    graph = json_ld.get("@graph", [])
    if not isinstance(graph, list):
        return ""
    for node in graph:
        if isinstance(node, dict) and node.get("@type") == "WebPage":
            url = node.get("url", "")
            if url:
                path = urlparse(url).path.strip("/")
                if path:
                    return "bmw-" + path.replace("/", "-")
    return ""


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = value.replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "page"


def empty_page_skeleton() -> dict[str, Any]:
    return {
        "meta": {
            "slug": "",
            "title": "",
            "titleCharCount": 0,
            "description": "",
            "descriptionCharCount": 0,
            "jsonLd": {},
        },
        "internalDeclarations": {
            "checkA": "",
            "checkB": "",
            "authorityModelMode": "",
        },
        "hero": {
            "tagPill": "",
            "h1": "",
            "subHeadline": "",
            "trustStrip": [],
            "primaryCta": {"label": "", "href": "#"},
            "dataIntegrityNote": "",
        },
        "engineDatabase": {
            "h2": "",
            "subHeadline": "",
            "columns": [],
            "engines": [],
            "confidenceScore": {"title": "", "text": ""},
            "dataCorrections": [],
        },
        "overview": {
            "h2": "",
            "intro": "",
            "keyFacts": "",
            "marketIntelligenceLine": "",
        },
        "bestWorstEngines": {"items": []},
        "ownershipEconomics": {
            "h2": "",
            "columns": [],
            "rows": [],
            "economicsRule": {"title": "", "text": ""},
            "keyTakeaways": [],
        },
        "commonProblems": {"problems": []},
        "replacementCosts": {
            "h2": "",
            "columns": [],
            "rows": [],
            "note": "",
        },
        "coreVariants": {
            "dieselVariants": [],
            "petrolVariants": [],
            "scopeNote": "",
        },
        "marketIntelligence": {
            "mostRequestedEngines": [],
            "mostRequestedVariants": [],
            "averageReplacementCost": "",
            "mostCommonFailures": [],
            "liveFeed": [],
        },
        "faq": {"items": []},
        "trustCta": {
            "h2": "",
            "trustPoints": [],
            "finalCta": "",
            "ctaButton": {"label": "", "href": "#", "note": ""},
        },
    }


def strip_ignored_content(text: str) -> str:
    """
    Strip blocks that must never enter JSON (shared ignore rules).
    """
    # Step 0 Check Results — stop at ANY section (not only SECTION 1).
    # Restated Step 0 before Part 2 sections must not wipe FAQ/META/SCHEMA.
    text = re.sub(
        r"Step\s+0\s+Check\s+Results.*?(?=SECTION\s+\d+\b|\Z)",
        "\n",
        text,
        flags=re.I | re.S,
    )

    # Part 1 / Part 2 LLM chat fluff between sections
    text = re.sub(
        r"End of Part\s*1\s+Output.*?(?=SECTION\s+\d+\b|META\s*$|SCHEMA\b|\Z)",
        "\n",
        text,
        flags=re.I | re.S | re.M,
    )
    text = re.sub(
        r"^Part\s*2\s*\n(?:(?!SECTION\s+\d+\b|META\s*$|SCHEMA\b).)*",
        "\n",
        text,
        flags=re.I | re.S | re.M,
    )
    # Common leftover chat openers
    text = re.sub(
        r"^(?:OK,\s+the user has just said|We need to generate Part|This completes the).*$",
        "",
        text,
        flags=re.I | re.M,
    )
    return text


def normalize_section_headers(text: str) -> str:
    """Trim leading spaces/tabs before SECTION / META / SCHEMA header lines only."""
    out: list[str] = []
    for ln in text.splitlines():
        stripped = ln.lstrip(" \t")
        if re.match(
            r"(SECTION\s+\d+\b|META\s*$|SCHEMA\b)",
            stripped,
            re.IGNORECASE,
        ):
            out.append(stripped)
        else:
            out.append(ln)
    return "\n".join(out) + ("\n" if text.endswith("\n") else "")


def parse_hero(body: str) -> dict[str, Any]:
    lines = non_empty_lines(body)
    # Ignore internal data-integrity notes in hero
    lines = [
        ln
        for ln in lines
        if not ln.lower().startswith("data-integrity note")
    ]
    fm = field_map(lines)
    tag = fm.get("tag pill", "")
    h1 = fm.get("h1", "")
    sub = fm.get("sub headline", "") or fm.get("subheadline", "")
    trust = fm.get("trust strip", "")
    cta = fm.get("primary cta", "")
    label, href = parse_href_and_label(cta) if cta else ("", "#")
    if cta and href == "#" and "→" not in cta and "->" not in cta:
        label = cta

    return {
        "tagPill": tag,
        "h1": h1,
        "subHeadline": sub,
        "trustStrip": parse_trust_strip(trust),
        "primaryCta": {"label": label or cta, "href": href or "#"},
        # Always empty — Data-integrity note (internal) is ignored
        "dataIntegrityNote": "",
    }


def parse_engine_database(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    sub = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    if lines and lines[0].lower().startswith("sub-headline"):
        sub = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]

    # Always present in output; empty if page has no Confidence Score panel
    conf_title = ""
    conf_text = ""

    # Cut table before confidence / ignored notes
    table_lines, rest = take_until_markers(
        lines,
        ["confidence score", "data sources note", "data note", "correction applied"],
    )

    conf_block: list[str] = []
    for ln in rest:
        low = ln.lower()
        # Always ignore data sources / internal correction notes
        if (
            low.startswith("data sources note")
            or low.startswith("data note")
            or low.startswith("correction applied")
            or (ln.startswith("*") and "correction" in low)
        ):
            break
        if low.startswith("confidence score"):
            conf_block.append(re.sub(r"^confidence score panel:\s*", "", ln, flags=re.I))
        else:
            conf_block.append(ln)

    if conf_block:
        joined = clean(" ".join(conf_block))
        joined = re.sub(r"^confidence score panel:\s*", "", joined, flags=re.I)
        m = re.match(r"(How confident are these ratings\?)\s*(.*)$", joined, re.I | re.S)
        if m:
            conf_title = clean(m.group(1))
            conf_text = clean(m.group(2))
        else:
            # TXT often has panel text without the "How confident..." question
            conf_title = "Confidence Score"
            conf_text = clean(joined)

    header, rows = parse_table(table_lines, min_cols=5)
    engines = []
    for row in rows:
        if not row or row[0].lower() in {"engine code"}:
            continue
        while len(row) < len(header):
            row.append("")
        mapping = {clean(h).lower(): clean(v) for h, v in zip(header, row)}

        def get(*names: str) -> str:
            for n in names:
                for k, v in mapping.items():
                    if k == n.lower() or n.lower() in k:
                        return v
            return ""

        engines.append(
            {
                "engineCode": get("engine code"),
                "family": get("family"),
                "fuel": get("fuel"),
                "displacement": get("disp.", "displacement", "disp"),
                "power": get("power"),
                "years": get("years"),
                "variants": get("variants", "variants (badges)"),
                "reliability": get("reliability"),
                "enquiries": get("2025 enquiries", "enquiries"),
                "avgReconCost": get("avg. recon cost", "avg recon cost"),
            }
        )

    return {
        "h2": h2,
        "subHeadline": sub,
        "columns": header,
        "engines": engines,
        "confidenceScore": {"title": conf_title, "text": conf_text},
        # Always empty — data sources / correction notes are ignored
        "dataCorrections": [],
    }


def parse_overview(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    intro = ""
    key_facts = ""
    mi_line = ""

    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]

    intro_parts: list[str] = []
    key_fact_parts: list[str] = []
    mode = "intro"
    for ln in lines:
        low = ln.lower()
        if low.startswith("key facts"):
            mode = "facts"
            inline = clean(ln.split(":", 1)[1] if ":" in ln else "")
            if inline:
                key_fact_parts.append(inline)
            continue
        if low.startswith("market intelligence line"):
            mode = "done"
            mi_line = clean(ln.split(":", 1)[1] if ":" in ln else "")
            continue
        if mode == "intro":
            intro_parts.append(ln)
        elif mode == "facts":
            if ln.startswith("*"):
                key_fact_parts.append(clean(ln.lstrip("* ").strip()))
            else:
                key_fact_parts.append(ln)

    if intro_parts:
        intro = clean(" ".join(intro_parts))
    if key_fact_parts:
        key_facts = " • ".join(key_fact_parts)

    return {
        "h2": h2,
        "intro": intro,
        "keyFacts": key_facts,
        "marketIntelligenceLine": mi_line,
    }


def parse_best_worst_engines(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    items: list[dict[str, Any]] = []

    if not lines:
        return {"items": items}

    joined = " ".join(lines)
    if re.search(r"thin-data fallback mode", joined, re.I):
        para = joined
        para = re.sub(r"^thin-data fallback mode:\s*", "", para, flags=re.I)
        para = re.sub(r"^exactly one paragraph,\s*\d+[–\-]\d+\s*words:\s*", "", para, flags=re.I)
        items.append(
            {
                "slot": "Thin-Data Summary",
                "engine": "",
                "quote": clean(para),
                "whoItsFor": "",
            }
        )
        return {"items": items}

    slot_re = re.compile(
        r"^(Best Diesel Overall|Best Petrol Overall|Highest Risk|Most Expensive Failure|Best Value|Most Overlooked)\s*:\s*(.*)$",
        re.I,
    )

    for ln in lines:
        m = slot_re.match(ln)
        if not m:
            continue
        slot = clean(m.group(1))
        rest = m.group(2)
        engine = rest
        quote = ""
        who = ""

        qm = re.search(r'[—\-]\s*"([^"]+)"\s*', rest)
        if qm:
            quote = clean(qm.group(1))
            before = rest[: qm.start()].strip()
            after = rest[qm.end() :].strip()
            engine = clean(before)
            wm = re.search(r"Who it'?s for:\s*(.*)$", after, re.I)
            if wm:
                who = clean(wm.group(1))
        else:
            wm = re.search(r"Who it'?s for:\s*(.*)$", rest, re.I)
            if wm:
                engine = clean(rest[: wm.start()].strip(" —-"))
                who = clean(wm.group(1))
            else:
                dash = re.split(r"\s+[—\-]\s+", rest, maxsplit=1)
                if len(dash) == 2:
                    engine = clean(dash[0])
                    quote = clean(dash[1].strip('"'))

        items.append(
            {
                "slot": slot,
                "engine": engine,
                "quote": quote,
                "whoItsFor": who,
            }
        )

    return {"items": items}


def parse_ownership_economics(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]

    econ_title = ""
    econ_text = ""
    takeaways: list[dict[str, str]] = []

    table_lines, rest = take_until_markers(
        lines,
        ["economics rule", "key takeaways"],
    )

    for ln in rest:
        low = ln.lower()
        if low.startswith("economics rule"):
            continue
        if low.startswith("key takeaways"):
            continue
        if not econ_title and ("rule:" in low or low.startswith("the ")):
            if ":" in ln:
                parts = ln.split(":", 1)
                econ_title = clean(parts[0])
                econ_text = clean(parts[1])
            else:
                econ_text = clean((econ_text + " " + ln).strip())
        elif low.startswith("key takeaways") or ln.startswith("*"):
            qtext = clean(ln.lstrip("* ").strip())
            qm = re.match(r"^(.+?\?)\s+(.*)$", qtext)
            if qm:
                takeaways.append({"question": clean(qm.group(1)), "answer": clean(qm.group(2))})
            elif qtext:
                takeaways.append({"question": qtext, "answer": ""})

    header, rows = parse_table(table_lines, min_cols=4)
    parsed_rows = []
    for row in rows:
        if not row or row[0].lower() == "engine":
            continue
        while len(row) < 6:
            row.append("")
        parsed_rows.append(
            {
                "engine": row[0],
                "typicalMileage": row[1],
                "commonMajorFailure": row[2],
                "repairCostSpecialist": row[3],
                "replacementCostRecon": row[4],
                "ownershipVerdict": row[5],
            }
        )

    return {
        "h2": h2,
        "columns": header
        or [
            "Engine",
            "Typical Mileage",
            "Common Major Failure",
            "Repair Cost (Specialist)",
            "Replacement Cost (Recon)",
            "Ownership Verdict",
        ],
        "rows": parsed_rows,
        "economicsRule": {"title": econ_title, "text": econ_text},
        "keyTakeaways": takeaways,
    }


def normalize_tier_name(name: str) -> str:
    name = clean(name)
    low = name.lower()
    if "prevent" in low:
        return "Preventative (Repair)"
    if "catastroph" in low:
        return "Catastrophic (Replacement)"
    return name


def parse_tiered_cost_table(block_lines: list[str]) -> list[dict[str, str]]:
    lines = [ln for ln in block_lines if clean(ln)]
    if len(lines) < 5:
        return []

    tier_prevent = ""
    tier_cata = ""
    data_rows: list[tuple[str, str, str]] = []

    idx = 0
    if len(lines) >= 2 and not re.match(r"^(dealer|specialist|work|viable)", lines[0], re.I):
        tier_prevent = lines[0]
        tier_cata = lines[1]
        idx = 2
    elif len(lines) >= 2:
        tier_prevent = lines[0]
        tier_cata = lines[1]
        idx = 2

    while idx + 2 < len(lines):
        label = lines[idx]
        val1 = lines[idx + 1]
        val2 = lines[idx + 2]
        if re.match(r"^(dealer|specialist|work|viable)", label, re.I):
            data_rows.append((label.rstrip("?"), val1, val2))
        idx += 3

    if not tier_prevent and data_rows:
        tier_prevent = "Preventative/Early Repair"
        tier_cata = "Catastrophic/Full Replacement"

    tiers = [
        {
            "tier": normalize_tier_name(tier_prevent),
            "dealer": "",
            "specialist": "",
            "work": "",
            "note": "",
        },
        {
            "tier": normalize_tier_name(tier_cata),
            "dealer": "",
            "specialist": "",
            "work": "",
            "note": "",
        },
    ]
    field_map_rows = {
        "dealer": "dealer",
        "specialist": "specialist",
        "work": "work",
        "viable": "note",
    }
    for label, v1, v2 in data_rows:
        key = field_map_rows.get(label.lower(), "")
        if not key:
            continue
        tiers[0][key] = v1
        tiers[1][key] = v2

    return tiers


def parse_common_problems(body: str) -> dict[str, Any]:
    text = body
    chunks = re.split(r"(?=Problem\s+\d+\s*[—\-])", text, flags=re.I)
    problems = []

    for chunk in chunks:
        chunk = chunk.strip()
        if not chunk or not re.match(r"Problem\s+\d+", chunk, re.I):
            continue

        lines = strip_section_noise(non_empty_lines(chunk))
        title_m = re.match(r"Problem\s+(\d+)\s*[—\-]\s*(.+)$", lines[0], re.I)
        if not title_m:
            continue
        pid = int(title_m.group(1))
        title = clean(title_m.group(2))

        affected = ""
        mileage = ""
        root = ""
        recommendation = ""
        cta_label = ""
        cta_href = "#"
        tier_lines: list[str] = []
        mode = "meta"

        for ln in lines[1:]:
            low = ln.lower()
            if low.startswith("affected models"):
                affected = clean(ln.split(":", 1)[1] if ":" in ln else "")
                continue
            if low.startswith("typical failure mileage"):
                mileage = clean(ln.split(":", 1)[1] if ":" in ln else "")
                continue
            if low.startswith("root cause"):
                root = clean(ln.split(":", 1)[1] if ":" in ln else "")
                continue
            if low.startswith("tiered cost table"):
                mode = "tier"
                continue
            if low.startswith("our recommendation"):
                recommendation = clean(ln.split(":", 1)[1] if ":" in ln else "")
                mode = "after"
                continue
            if low.startswith("cta:"):
                cta_text = clean(ln.split(":", 1)[1] if ":" in ln else "")
                cta_label, cta_href = parse_href_and_label(cta_text)
                if cta_href == "#":
                    cta_label = cta_text
                continue
            if mode == "tier":
                tier_lines.append(ln)

        problems.append(
            {
                "id": pid,
                "title": title,
                "affectedModels": affected,
                "typicalFailureMileage": mileage,
                "rootCause": root,
                "tieredCosts": parse_tiered_cost_table(tier_lines),
                "recommendation": recommendation,
                "cta": {"label": cta_label, "href": cta_href},
            }
        )

    return {"problems": problems}


def parse_replacement_costs(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    note = ""

    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]

    table_lines: list[str] = []
    for ln in lines:
        low = ln.lower()
        if low.startswith("no generation variance") or low.startswith("note:"):
            note = clean(ln.split(":", 1)[1] if ":" in ln and not low.startswith("no generation") else ln)
            continue
        if re.match(r"^[a-z].{40,}", ln) and "£" not in ln and "hrs" not in low:
            if not table_lines:
                continue
            note = clean((note + " " + ln).strip()) if note else ln
            continue
        table_lines.append(ln)

    header, rows = parse_table(table_lines, min_cols=5)
    parsed_rows = []
    for row in rows:
        if not row or row[0].lower() == "variant":
            continue
        while len(row) < 6:
            row.append("")
        parsed_rows.append(
            {
                "variant": row[0],
                "engineCode": row[1],
                "usedSupply": row[2],
                "reconditionedSupply": row[3],
                "rebuiltSupply": row[4],
                "labourHours": row[5],
            }
        )

    if not note:
        for ln in reversed(lines):
            if ln.lower().startswith("no generation variance"):
                note = ln
                break

    return {
        "h2": h2,
        "columns": header
        or [
            "Variant",
            "Engine Code",
            "Used (Supply)",
            "Reconditioned (Supply)",
            "Rebuilt (Supply)",
            "Labour Hours",
        ],
        "rows": parsed_rows,
        "note": note,
    }


def parse_variant_list(text: str) -> list[str]:
    text = clean(text.split(":", 1)[1] if ":" in text else text)
    parts = re.split(r"\s*[·•]\s*", text)
    return [clean(p) for p in parts if clean(p)]


def parse_core_variants(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    diesel: list[str] = []
    petrol: list[str] = []
    scope = ""

    for ln in lines:
        low = ln.lower()
        if low.startswith("diesel variants"):
            diesel = parse_variant_list(ln)
        elif low.startswith("petrol variants"):
            petrol = parse_variant_list(ln)
        elif low.startswith("plug") and "hybrid" in low:
            petrol.extend(parse_variant_list(ln))
        elif low.startswith("scope note"):
            scope = clean(ln.split(":", 1)[1] if ":" in ln else "")

    return {
        "dieselVariants": diesel,
        "petrolVariants": petrol,
        "scopeNote": scope,
    }


def _live_feed_from_lines(live_lines: list[str]) -> list[dict[str, str]]:
    live_feed: list[dict[str, str]] = []
    for ln in live_lines:
        parts = [clean(p) for p in re.split(r"\s+[—\-]\s+", ln) if clean(p)]
        if len(parts) >= 5:
            live_feed.append(
                {
                    "vehicle": parts[0],
                    "location": parts[1],
                    "issue": parts[2],
                    "enquiries": parts[3],
                    "updated": parts[4],
                }
            )
        elif len(parts) >= 4:
            live_feed.append(
                {
                    "vehicle": parts[0],
                    "location": parts[1],
                    "issue": parts[2],
                    "enquiries": parts[3],
                    "updated": "",
                }
            )
    return live_feed


def _parse_mi_colon_blocks(
    lines: list[str],
) -> tuple[list[str], list[str], str, list[str], list[dict[str, str]]]:
    """Parse Market Intelligence written as labeled lists (C219 style)."""
    engines: list[str] = []
    variants: list[str] = []
    failures: list[str] = []
    live_raw: list[str] = []
    avg = ""
    current: str | None = None

    def take_inline(ln: str) -> str:
        return clean(ln.split(":", 1)[1]) if ":" in ln else ""

    for ln in lines:
        low = ln.lower()
        if low.startswith("most requested") and "engine" in low:
            current = "engines"
            inline = take_inline(ln)
            if inline:
                engines.append(inline)
            continue
        if low.startswith("most requested") and "variant" in low:
            current = "variants"
            inline = take_inline(ln)
            if inline:
                variants.append(inline)
            continue
        if "average" in low and ("cost" in low or "replacement" in low):
            current = None
            avg = take_inline(ln) or clean(ln)
            continue
        if low.startswith("most common") and "failure" in low:
            current = "failures"
            inline = take_inline(ln)
            if inline:
                failures.append(inline)
            continue
        if low.startswith("live feed"):
            current = "live"
            continue
        if current == "engines":
            engines.append(ln)
        elif current == "variants":
            variants.append(ln)
        elif current == "failures":
            failures.append(ln)
        elif current == "live":
            live_raw.append(ln)

    return engines, variants, avg, failures, _live_feed_from_lines(live_raw)


def parse_market_intelligence(body: str) -> dict[str, Any]:
    joined = clean(" ".join(non_empty_lines(body)))
    if re.search(r"absent\s*\(thin-data fallback|fully omitted.*thin-data", joined, re.I):
        return {
            "mostRequestedEngines": [],
            "mostRequestedVariants": [],
            "averageReplacementCost": "",
            "mostCommonFailures": [],
            "liveFeed": [],
        }

    lines = strip_section_noise(non_empty_lines(body))
    metric_idx = None
    for i, ln in enumerate(lines):
        if ln.lower() in {"metric", "metric:"}:
            metric_idx = i
            break
    if metric_idx is not None:
        lines = lines[metric_idx:]

    table_lines: list[str] = []
    live_lines: list[str] = []
    mode = "table"

    for ln in lines:
        low = ln.lower()
        if low.startswith("live feed"):
            mode = "live"
            continue
        if mode == "live":
            if ln.startswith("*"):
                live_lines.append(clean(ln.lstrip("* ").strip()))
            else:
                live_lines.append(ln)
        else:
            table_lines.append(ln)

    header, rows = parse_table(table_lines, min_cols=2)
    metrics: dict[str, str] = {}
    for row in rows:
        if not row:
            continue
        key = row[0]
        val = row[1] if len(row) > 1 else ""
        if key.lower() in {"metric", "display"}:
            continue
        metrics[key] = val

    def find_metric(*needles: str) -> str:
        for k, v in metrics.items():
            low = k.lower()
            if all(n.lower() in low for n in needles):
                return v
        return ""

    def split_ranked(text: str) -> list[str]:
        text = clean(text)
        if not text:
            return []
        if re.search(r"\d+\.\s", text):
            out = [clean(p) for p in re.split(r"(?=\d+\.\s)", text) if clean(p)]
            if out:
                return [clean(re.sub(r"[·•;,\s]+$", "", p)) for p in out]
        parts = re.split(r"\s*(?:·|•|;)\s*", text)
        return [clean(re.sub(r"[·•;,\s]+$", "", p)) for p in parts if clean(p)]

    engines = split_ranked(find_metric("most requested", "engines"))
    variants = split_ranked(find_metric("most requested", "variants"))
    failures = split_ranked(find_metric("most common", "failures"))
    avg_cost = find_metric("average", "replacement cost")
    live_feed = _live_feed_from_lines(live_lines)

    # Colon-header list format (C219) when Metric/Display table is absent
    if not engines and not variants and not avg_cost:
        engines, variants, avg_cost, failures, live_feed = _parse_mi_colon_blocks(lines)

    return {
        "mostRequestedEngines": engines,
        "mostRequestedVariants": variants,
        "averageReplacementCost": avg_cost,
        "mostCommonFailures": failures,
        "liveFeed": live_feed,
    }


def parse_faq(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    if lines and lines[0].lower().startswith("h2:"):
        lines = lines[1:]

    items: list[dict[str, Any]] = []
    # Numbered: "1. …" / "Q1: …"
    q_re = re.compile(r"^(?:Q\s*)?(\d+)\s*[.:]\s*(.*)$", re.IGNORECASE)
    current: dict[str, Any] | None = None
    for ln in lines:
        m = q_re.match(ln)
        if m:
            if current:
                items.append(current)
            current = {"id": int(m.group(1)), "question": clean(m.group(2)), "answer": ""}
        elif current is not None:
            current["answer"] = clean((current["answer"] + " " + ln).strip())
    if current:
        items.append(current)

    # Unnumbered S204-style: question lines end with "?"
    if not items:
        current = None
        for ln in lines:
            if ln.endswith("?"):
                if current:
                    items.append(current)
                current = {
                    "id": len(items) + 1,
                    "question": clean(ln),
                    "answer": "",
                }
            elif current is not None:
                current["answer"] = clean((current["answer"] + " " + ln).strip())
        if current:
            items.append(current)

    return {"items": items}


def parse_trust_cta(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    trust_points: list[dict[str, str]] = []
    final_cta = ""
    cta_label = ""
    cta_href = "#"
    cta_note = ""

    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]

    in_trust = False
    for ln in lines:
        low = ln.lower()
        if low.startswith("trust points"):
            in_trust = True
            continue
        if low.startswith("final cta"):
            in_trust = False
            final_cta = clean(ln.split(":", 1)[1] if ":" in ln else "")
            continue
        if low.startswith("cta button"):
            in_trust = False
            cta_text = clean(ln.split(":", 1)[1] if ":" in ln else "")
            note_m = re.search(r"\[(PLACEHOLDER[^\]]*)\]", cta_text, re.I)
            if note_m:
                cta_note = clean(note_m.group(0))
                cta_text = clean(cta_text[: note_m.start()])
            cta_label, cta_href = parse_href_and_label(cta_text)
            if cta_href == "#":
                cta_label = cta_text
            continue
        if in_trust:
            item = clean(ln.lstrip("* ").strip())
            if not item:
                continue
            if " — " in item:
                title, text = [clean(x) for x in item.split(" — ", 1)]
            elif " – " in item:
                title, text = [clean(x) for x in item.split(" – ", 1)]
            else:
                title, text = item, ""
            trust_points.append({"title": title, "text": text})

    return {
        "h2": h2,
        "trustPoints": trust_points,
        "finalCta": final_cta,
        "ctaButton": {"label": cta_label, "href": cta_href, "note": cta_note},
    }


SECTION_PARSERS = {
    "hero": parse_hero,
    "engineDatabase": parse_engine_database,
    "overview": parse_overview,
    "bestWorstEngines": parse_best_worst_engines,
    "ownershipEconomics": parse_ownership_economics,
    "commonProblems": parse_common_problems,
    "replacementCosts": parse_replacement_costs,
    "coreVariants": parse_core_variants,
    "marketIntelligence": parse_market_intelligence,
    "faq": parse_faq,
    "trustCta": parse_trust_cta,
}


def parse_meta_and_schema(page_text: str) -> dict[str, Any]:
    meta = {
        "slug": "",
        "title": "",
        "titleCharCount": 0,
        "description": "",
        "descriptionCharCount": 0,
        "jsonLd": {},
    }

    # Prefer Meta Title/Description lines anywhere (some pages put META before Sec 9)
    tm = re.search(
        r"Meta Title\s*\((\d+)\s*chars?\)\s*:\s*(.+)$",
        page_text,
        re.I | re.M,
    )
    if tm:
        meta["titleCharCount"] = int(tm.group(1))
        meta["title"] = clean(tm.group(2))

    dm = re.search(
        r"Meta Description\s*\((\d+)\s*chars?\)\s*:\s*(.+)$",
        page_text,
        re.I | re.M,
    )
    if dm:
        meta["descriptionCharCount"] = int(dm.group(1))
        meta["description"] = clean(dm.group(2))

    if meta["title"] and not meta["titleCharCount"]:
        meta["titleCharCount"] = len(meta["title"])
    if meta["description"] and not meta["descriptionCharCount"]:
        meta["descriptionCharCount"] = len(meta["description"])

    # Use the last SCHEMA block (real schema sits at page end)
    schema_m = None
    for m in SCHEMA_SECTION_RE.finditer(page_text):
        schema_m = m
    if schema_m:
        schema_block = page_text[schema_m.end() :]
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

    if meta["jsonLd"]:
        slug = slug_from_webpage_url(meta["jsonLd"])
        if slug:
            meta["slug"] = slug

    return meta


def content_for_sections(page_text: str) -> str:
    """
    Body used for SECTION parsers.

    Do NOT cut at the first META — some pages place META title before Sec 9–11.
    Cut only before SCHEMA, and strip META title blocks so they don't pollute Sec 8.
    """
    schema_m = None
    for m in SCHEMA_SECTION_RE.finditer(page_text):
        schema_m = m
    content = page_text[: schema_m.start()] if schema_m else page_text
    content = META_TITLE_BLOCK_RE.sub("\n", content)
    return content


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


def guess_page_title(preamble: str, hero: dict[str, Any]) -> str:
    if hero.get("tagPill"):
        return hero["tagPill"].split("•")[0].strip()
    if hero.get("h1"):
        return re.split(r"\s+[—\-]\s+", hero["h1"])[0]
    lines = [clean(ln) for ln in preamble.splitlines() if clean(ln)]
    for ln in reversed(lines[-20:]):
        if re.search(r"\b(e\d{2}|f\d{2}|g\d{2}|u\d{2})\b", ln, re.I):
            return ln
    return "unknown-generation"


def split_pages(text: str) -> list[tuple[str, str, str]]:
    starts = list(PAGE_START_RE.finditer(text))
    if not starts:
        raise SystemExit(
            "No generation pages found. Expected lines like "
            "'SECTION 1 — HERO' or 'SECTION 1 — HERO — <GenerationHero>'."
        )

    pages: list[tuple[str, str, str]] = []
    for i, m in enumerate(starts):
        lookback_start = starts[i - 1].end() if i > 0 else 0
        preamble = text[lookback_start : m.start()]
        start = m.start()
        end = starts[i + 1].start() if i + 1 < len(starts) else len(text)
        body = text[start:end]
        pages.append((preamble, body, body))
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


def build_page(preamble: str, page_text: str) -> dict[str, Any]:
    page = empty_page_skeleton()
    # Step 0 / internal declarations are ignored — keep empty structure only
    page["internalDeclarations"] = {
        "checkA": "",
        "checkB": "",
        "authorityModelMode": "",
    }

    content = content_for_sections(page_text)

    sections = iter_sections(content)
    for key, label, body in sections:
        if key == "marketIntelligence" and (
            re.search(r"absent\s*\(thin-data fallback", label, re.I)
            or re.search(r"fully omitted|thin-data fallback", body, re.I)
        ):
            page[key] = empty_page_skeleton()["marketIntelligence"]
            continue
        parser = SECTION_PARSERS.get(key)
        if not parser:
            continue
        try:
            page[key] = parser(body)
        except Exception as e:
            print(f"  ! failed parsing section '{key}': {e}", file=sys.stderr)

    page["meta"] = parse_meta_and_schema(page_text)

    if not page["meta"]["slug"]:
        tag = page.get("hero", {}).get("tagPill", "")
        h1 = page.get("hero", {}).get("h1", "")
        raw = ""
        if tag:
            raw = tag.split("•")[0].strip()
        elif h1:
            raw = re.split(r"\s+[—\-]\s+", h1)[0]
            raw = re.sub(
                r"\b(engines?|engine replacement|the complete uk guide)\b",
                "",
                raw,
                flags=re.I,
            ).strip(" —-")
        page["meta"]["slug"] = slugify(raw or guess_page_title(preamble, page.get("hero", {})))

    if not page["meta"]["title"] and page.get("hero", {}).get("h1"):
        page["meta"]["title"] = page["hero"]["h1"]
        page["meta"]["titleCharCount"] = len(page["meta"]["title"])

    return page


def find_missing_sections(page_text: str) -> list[str]:
    """Expected section keys with no SECTION marker in the content body."""
    content = content_for_sections(page_text)
    found = {key for key, _label, _body in iter_sections(content)}
    return [key for key in SECTION_KEY_BY_NUM.values() if key not in found]


def find_empty_critical_sections(page: dict[str, Any]) -> list[str]:
    """Flag faq / schema (and empty marketIntelligence) when data didn't parse."""
    empty: list[str] = []
    faq = page.get("faq") or {}
    if not faq.get("items"):
        empty.append("faq")

    meta = page.get("meta") or {}
    if not meta.get("jsonLd") and not meta.get("description"):
        empty.append("schema")

    mi = page.get("marketIntelligence") or {}
    if not mi.get("mostRequestedEngines") and not mi.get("liveFeed"):
        # Marker may exist with Thin-Data omission note — still log as missing
        empty.append("marketIntelligence")

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
    """
    Write loging.txt listing pages with missing sections.
    Format:
      Jaguar XJ X351
      missing faq
    """
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

    parser = argparse.ArgumentParser(description="Convert generation page TXT → JSON")
    parser.add_argument(
        "input",
        nargs="?",
        default=str(DEFAULT_INPUT),
        help="Path to generation pages TXT file",
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

    written = []
    used_slugs: set[str] = set()
    missing_log_entries: list[tuple[str, list[str]]] = []
    for preamble, page_text, _ in pages:
        try:
            data = build_page(preamble, page_text)
        except Exception as e:
            print(f"  ! failed page: {e}", file=sys.stderr)
            continue

        title = guess_page_title(preamble, data.get("hero", {}))
        print(f"- Parsing: {title}")

        missing = collect_page_gaps(page_text, data)
        missing_log_entries.append((title, missing))
        if missing:
            print(f"  ! missing sections: {', '.join(missing)}", file=sys.stderr)

        slug = data["meta"]["slug"] or slugify(title)
        if slug in used_slugs:
            n = 2
            while f"{slug}-{n}" in used_slugs:
                n += 1
            slug = f"{slug}-{n}"
            data["meta"]["slug"] = slug
        used_slugs.add(slug)

        out_path = out_dir / f"{slug}.json"
        out_path.write_text(
            json.dumps(data, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        written.append(out_path)
        print(f"  → {out_path.relative_to(ROOT)}")

    log_path = write_missing_sections_log(out_dir, missing_log_entries)
    print(f"Missing-section log → {log_path.relative_to(ROOT)}")
    print(f"Done. Wrote {len(written)} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
