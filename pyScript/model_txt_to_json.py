#!/usr/bin/env python3
"""
Convert IBS Brand/Model page TXT content into model JSON files
matching the shape used by src/data/models/bmw-2002.json.

Usage:
  python pyScript/model_txt_to_json.py
  python pyScript/model_txt_to_json.py "txt-files/IBS Pages Content (Brand_Models) (1).txt"
  python pyScript/model_txt_to_json.py path/to/input.txt --out output-json
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
DEFAULT_INPUT = ROOT / "txt-files" / "IBS Pages Content (Brand_Models).txt"
DEFAULT_OUT = ROOT / "output-json"

# Every model page content block starts with SECTION 1 ... <ModelHero>
# Supports both:
#   SECTION 1 — HERO — <ModelHero>
#   SECTION 1: HERO — <ModelHero>
PAGE_START_RE = re.compile(
    r"^SECTION\s+1\s*[:—\-]\s*.*?[—\-]\s*<ModelHero>\s*.*$",
    re.MULTILINE | re.IGNORECASE,
)
# Match headers like:
#   JAGUAR XF — METADATA & SCHEMA
#   Jaguar E-Pace — Metadata & Schema
#   … METADATA & SCHEMA PACKAGE
META_START_RE = re.compile(
    r"^(?P<title>.+?)\s+[—\-]+\s+METADATA\s*&\s*SCHEMA(?:\s+PACKAGE)?\s*$",
    re.MULTILINE | re.IGNORECASE,
)
# Fallback when meta starts with no model header (XE / F-Type / XK style):
#   PART A — META TITLE
#   META TITLE
#   META TITLE (50–60 characters)
META_FALLBACK_START_RE = re.compile(
    r"^(?:PART\s+A\s*[—\-]\s*)?META\s+TITLE(?:\s*\([^)]*\))?\s*$",
    re.MULTILINE | re.IGNORECASE,
)
OG_LINE_RE = re.compile(
    r"^(?P<key>(?:og|twitter):[A-Za-z0-9_:]+)\s*[=:]\s*(?P<val>.+)$",
    re.MULTILINE | re.IGNORECASE,
)
# Match by section number + component tag (label text varies by model)
SECTION_RE = re.compile(
    r"^SECTION\s+(?P<num>\d+[A-Z]?)\s*[:—\-]\s*(?P<label>.+?)\s+[—\-]+\s*"
    r"<(?P<component>[A-Za-z0-9_]+)>(?P<extra>[^\n]*)\s*$",
    re.MULTILINE,
)
META_TAG_RE = re.compile(
    r'<meta\s+(?:property|name)="(?P<key>[^"]+)"\s+content="(?P<val>[^"]*)"\s*/?>',
    re.IGNORECASE,
)
FIELD_RE = re.compile(
    r"^(Tag Pill|H1|Sub-headline|Sub-Headline|Trust Strip|Primary CTA|H2)\s*:\s*(.*)$",
    re.IGNORECASE,
)
MODEL_PAGE_TITLE_RE = re.compile(
    r"^(?P<title>.+?)\s+MODEL PAGE\s+[—\-]+\s+COMPLETE CONTENT\s*$",
    re.IGNORECASE,
)

SEVERITY_TYPE = {
    "catastrophic": "catastrophic",
    "immediate": "immediate",
    "monitor": "monitor",
    "low": "low",
}


def clean(text: str) -> str:
    return re.sub(r"[ \t]+", " ", text.replace("\u00a0", " ").replace("\ufeff", "")).strip()


def blank_lines_split(block: str) -> list[str]:
    return [ln.rstrip() for ln in block.splitlines()]


def non_empty_lines(block: str) -> list[str]:
    return [clean(ln) for ln in blank_lines_split(block) if clean(ln)]


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
    """
    Split a line into cells.
    Leading-tab / indent-only separators (common in this TXT export) are NOT
    multi-column rows — treat those as a single cell.
    """
    if "\t" in line:
        parts = [clean(c) for c in line.split("\t")]
        parts = [p for p in parts if p]
        if len(parts) >= 2:
            return parts
        if len(parts) == 1:
            return parts
        return []
    return [clean(line)] if clean(line) else []


def is_real_tab_row(line: str, min_cols: int) -> bool:
    if "\t" not in line:
        return False
    parts = [clean(c) for c in line.split("\t") if clean(c)]
    return len(parts) >= min_cols


KNOWN_HEADER_CELLS = {
    "#",
    "metric",
    "value",
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
    "avg. rebuild cost",
    "avg rebuild cost",
    "problem",
    "issue",
    "description",
    "severity",
    "link",
    "era",
    "key engines",
    "worth knowing",
    "why land rover changed",
    "why bmw changed",
    "variant",
    "used (supply)",
    "reconditioned (supply)",
    "rebuilt (supply)",
    "labour hours",
    "buyer profile",
    "rating",
    "our verdict",
    "our call",
    "verdict metric",
    "aspect",
    "condition",
    "supply only",
    "fitted (indie)",
    "warranty",
    "best for",
}


def looks_like_header_cell(cell: str) -> bool:
    cell = clean(cell)
    if not cell:
        return False
    low = cell.lower().rstrip(":")
    if low in KNOWN_HEADER_CELLS:
        return True
    if low.startswith("why ") and len(cell) <= 48:
        return True
    return False


def parse_table(lines: list[str], min_cols: int = 2) -> tuple[list[str], list[list[str]]]:
    """
    Parse either tab-separated rectangular tables, or one-cell-per-line tables.
    Returns (header, rows).
    """
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

    # Grow header while cells match known header vocabulary
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


def slug_from_url(url: str) -> str:
    path = urlparse(url).path.strip("/")
    if not path:
        return "page"
    parts = [p for p in path.split("/") if p]
    # Prefer leaf segment so /jaguar/s-type/ → s-type (not jaguar)
    return parts[-1]


def parse_hero(body: str) -> dict[str, Any]:
    lines = non_empty_lines(body)
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
    }


def parse_ownership_verdict(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]

    one_line = ""
    rest = []
    for ln in lines:
        if ln.lower().startswith("one-line verdict"):
            one_line = clean(ln.split(":", 1)[1] if ":" in ln else "")
        else:
            rest.append(ln)

    while rest and rest[0].lower() in {"verdict metric", "our call", "metric", "value"}:
        rest = rest[1:]

    metrics: list[dict[str, str]] = []
    raw_lines = strip_section_noise([ln.rstrip() for ln in body.splitlines() if clean(ln)])
    real_tab_rows = [
        ln
        for ln in raw_lines
        if is_real_tab_row(ln, 2)
        and not ln.lower().startswith("h2:")
        and not ln.lower().startswith("one-line")
    ]
    if real_tab_rows:
        for ln in real_tab_rows:
            parts = [clean(c) for c in ln.split("\t") if clean(c)]
            if len(parts) >= 2 and parts[0].lower() not in {"verdict metric", "metric"}:
                metrics.append({"metric": parts[0], "ourCall": parts[1]})
    else:
        i = 0
        while i + 1 < len(rest):
            metrics.append({"metric": rest[i], "ourCall": rest[i + 1]})
            i += 2

    return {"h2": h2, "metrics": metrics, "oneLineVerdict": one_line}


def parse_at_a_glance(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    header, rows = parse_table(lines, min_cols=2)
    out_rows = []
    for row in rows:
        if len(row) >= 2:
            if row[0].lower() in {"metric", "value"}:
                continue
            out_rows.append({"metric": row[0], "value": row[1]})
    if not out_rows and lines:
        data = [ln for ln in lines if ln.lower() not in {"metric", "value"}]
        for i in range(0, len(data) - 1, 2):
            out_rows.append({"metric": data[i], "value": data[i + 1]})
    return {"h2": h2, "rows": out_rows}


def parse_generation_cards(block_lines: list[str]) -> list[dict[str, Any]]:
    cards: list[dict[str, Any]] = []
    buf: list[str] = []
    chunks: list[list[str]] = []

    def flush():
        nonlocal buf
        if buf:
            chunks.append(buf)
            buf = []

    for ln in block_lines:
        low = ln.lower()
        if low.startswith("pre-facelift") or low.startswith("read the full"):
            flush()
            break
        if low.startswith("h2:") or low.startswith("sub-headline"):
            continue
        buf.append(ln)
        if re.match(r"^(Explore|Read)\b", ln, re.I):
            flush()
    flush()

    for chunk in chunks:
        chunk = [c for c in chunk if c]
        if len(chunk) < 2:
            continue
        title = chunk[0]
        badge = ""
        badge_m = re.search(r"(🔥.*)$", title)
        if badge_m:
            badge = clean(badge_m.group(1))
            title = clean(title[: badge_m.start()])

        meta = ""
        rating = ""
        verdict = ""
        cta_label = ""
        cta_href = "#"
        for ln in chunk[1:]:
            low = ln.lower()
            if "our verdict:" in low:
                verdict = clean(ln.split(":", 1)[1])
            elif ln.startswith("⭐") or ln.startswith("★"):
                rating = clean(ln)
            elif low.startswith("explore") or low.startswith("read"):
                cta_label, cta_href = parse_href_and_label(ln)
                if cta_href == "#" and ("→" in ln or "->" in ln):
                    cta_label = clean(ln)
                elif cta_href == "#":
                    cta_label = clean(ln)
            elif not meta and ("•" in ln or re.search(r"\d{4}", ln)):
                meta = ln
            elif not badge and ("🔥" in ln or "Most" in ln):
                badge = ln
        if not verdict and not meta:
            continue
        cards.append(
            {
                "title": title,
                "badge": badge,
                "meta": meta,
                "rating": rating,
                "verdict": verdict,
                "cta": {"label": cta_label or "", "href": cta_href or "#"},
            }
        )
    return cards


def parse_generations(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    sub = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    if lines and lines[0].lower().startswith("sub-headline"):
        sub = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]

    comparison_link = {"label": "", "href": "#"}
    range_table: dict[str, Any] = {"title": "", "columns": [], "rows": []}

    remaining = []
    for ln in lines:
        if ln.lower().startswith("read the full comparison") or ln.lower().startswith(
            "read the full head"
        ):
            m = re.search(r"(→|->)\s*(\S+)\s*$", ln)
            if m:
                comparison_link = {
                    "label": clean(ln[: m.start()]),
                    "href": m.group(2),
                }
            else:
                comparison_link = {"label": ln, "href": "#"}
        else:
            remaining.append(ln)

    era_idx = None
    for i, ln in enumerate(remaining):
        if ("pre-facelift" in ln.lower() and "post-facelift" in ln.lower() and "vs" in ln.lower()) or ln.lower().startswith(
            "pre-facelift vs"
        ):
            era_idx = i
            break

    card_lines = remaining
    if era_idx is not None:
        card_lines = remaining[:era_idx]
        era_lines = remaining[era_idx:]
        range_table["title"] = era_lines[0]
        data = era_lines[1:]
        if len(data) >= 2:
            col_a, col_b = data[0], data[1]
            range_table["columns"] = ["Aspect", col_a, col_b]
            triples = data[2:]
            cleaned = []
            for t in triples:
                if t.lower().startswith("read the full"):
                    break
                cleaned.append(t)
            rows = []
            for i in range(0, len(cleaned) - 2, 3):
                rows.append(
                    {
                        "model": cleaned[i],
                        "engineCode": cleaned[i + 1],
                        "power": cleaned[i + 2],
                        "induction": "",
                        "years": "",
                        "notes": "",
                    }
                )
            range_table["rows"] = rows

    cards = parse_generation_cards(card_lines)
    return {
        "h2": h2,
        "subHeadline": sub,
        "cards": cards,
        "rangeTable": range_table,
        "comparisonLink": comparison_link,
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

    conf_title = ""
    conf_text = ""
    table_lines, rest = take_until_markers(lines, ["confidence score"])
    if rest:
        conf_block = " ".join(rest)
        conf_block = re.sub(r"^confidence score panel:\s*", "", conf_block, flags=re.I)
        m = re.match(r"(How confident are these ratings\?)\s*(.*)$", conf_block, re.I | re.S)
        if m:
            conf_title = clean(m.group(1))
            conf_text = clean(m.group(2))
        else:
            conf_title = "How confident are these ratings?"
            conf_text = clean(conf_block)

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
                "model": get("gen.", "gen", "model", "generation"),
                "reliability": get("reliability"),
                "enquiries": get("2025 enquiries", "enquiries"),
                "avgRebuildCost": get(
                    "avg. recon cost",
                    "avg. rebuild cost",
                    "avg recon cost",
                    "avg rebuild cost",
                ),
            }
        )

    return {
        "h2": h2,
        "subHeadline": sub,
        "columns": header,
        "engines": engines,
        "confidenceScore": {"title": conf_title, "text": conf_text},
        "dataCorrections": [],
    }


def parse_severity(text: str) -> dict[str, str]:
    text = clean(text)
    m = re.match(r"^(\S+)\s+(.*)$", text)
    icon = m.group(1) if m else ""
    label = clean(m.group(2)) if m else text
    typ = label.lower()
    for key in SEVERITY_TYPE:
        if key in label.lower():
            typ = key
            break
    return {"icon": icon, "label": label, "type": typ}


def parse_common_problems(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    sub = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    if lines and lines[0].lower().startswith("sub-headline"):
        sub = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]

    urgency_key: list[dict[str, str]] = []
    table_lines, rest = take_until_markers(lines, ["urgency key"])
    if rest:
        uk = " ".join(rest)
        uk = re.sub(r"^urgency key:\s*", "", uk, flags=re.I)
        for part in re.split(r"\s*•\s*", uk):
            part = clean(part)
            if not part:
                continue
            m = re.match(r"^(\S+)\s+([A-Za-z/]+)\s*[—\-]+\s*(.*)$", part)
            if m:
                urgency_key.append(
                    {"icon": m.group(1), "label": clean(m.group(2)), "text": clean(m.group(3))}
                )
            else:
                urgency_key.append({"icon": "", "label": part, "text": ""})

    header, rows = parse_table(table_lines, min_cols=4)
    problems = []
    for row in rows:
        if not row or not re.match(r"^\d+$", str(row[0])):
            continue
        while len(row) < 5:
            row.append("")
        sev = parse_severity(row[3])
        link_label, link_href = parse_href_and_label(row[4]) if row[4] else ("Learn more →", "#")
        if row[4] and link_href == "#":
            link_label = row[4]
        problems.append(
            {
                "id": int(row[0]),
                "issue": row[1],
                "description": row[2],
                "severity": sev,
                "link": {"label": link_label or "Learn more →", "href": link_href or "#"},
            }
        )

    return {
        "h2": h2,
        "subHeadline": sub,
        "columns": header or ["#", "Problem", "Description", "Severity", "Link"],
        "problems": problems,
        "urgencyKey": urgency_key,
    }


def parse_market_intelligence(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    if lines and lines[0].lower().startswith("sub-headline"):
        lines = lines[1:]

    insights: list[str] = []
    feed_note = ""
    table_part = []
    mode = "table"
    for ln in lines:
        low = ln.lower()
        if low.startswith("insights"):
            mode = "insights"
            continue
        if low.startswith("live enquiry"):
            feed_note = ln
            continue
        if mode == "insights":
            if ln.startswith("*"):
                insights.append(clean(ln.lstrip("* ").strip()))
            else:
                insights.append(ln)
        else:
            table_part.append(ln)

    header, rows = parse_table(table_part, min_cols=2)
    signals = []
    for row in rows:
        if not row or row[0].lower() in {"signal", "2025 data"}:
            continue
        while len(row) < 3:
            row.append("")
        signals.append(
            {
                "signal": row[0],
                "data": row[1],
                "demandTrend": row[2] if len(row) > 2 else "",
            }
        )

    if not signals and table_part:
        data = [ln for ln in table_part if ln.lower() not in {"signal", "2025 data", "demand trend"}]
        for i in range(0, len(data) - 1, 2):
            signals.append({"signal": data[i], "data": data[i + 1], "demandTrend": ""})

    return {
        "h2": h2,
        "signals": signals,
        "insights": insights,
        "liveEnquiryFeedNote": feed_note,
    }


def parse_editorial(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    if not lines:
        return {"title": "", "quote": ""}
    # Title is first non-quote line; quote is the rest (often quoted)
    if lines[0].startswith('"') or lines[0].startswith("“"):
        title = ""
        quote_lines = lines
    else:
        title = lines[0]
        quote_lines = lines[1:]
    quote = ""
    for ln in quote_lines:
        piece = ln.strip().strip('"“”')
        quote = clean((quote + " " + piece).strip())
    return {"title": title, "quote": quote}


def parse_replacement_costs(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    sub = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    if lines and lines[0].lower().startswith("sub-headline"):
        sub = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]

    figures_note = ""
    labour = ""
    econ_title = ""
    econ_text = ""

    note_idx = None
    for i, ln in enumerate(lines):
        low = ln.lower()
        if (
            "labour estimate" in low
            or low.startswith("all figures")
            or low.startswith("204dtd and")
            or low.startswith("the economics box")
            or low.startswith("the discovery rule")
            or low.startswith("the discovery sport rule")
        ):
            note_idx = i
            break

    table_region = lines
    trailing: list[str] = []
    if note_idx is not None:
        table_region = lines[:note_idx]
        trailing = lines[note_idx:]

    joined_trailing = " ".join(trailing)
    joined_trailing = re.sub(
        r"The economics box\s*\([^)]*\)\s*:\s*",
        "",
        joined_trailing,
        flags=re.I,
    )
    econ_m = re.search(
        r"(The .+? rule)\s*:\s*(.*)$",
        joined_trailing,
        re.I | re.S,
    )
    if econ_m:
        econ_title = clean(econ_m.group(1))
        econ_text = clean(econ_m.group(2))

    labour_m = re.search(r"Labour estimate:\s*(.*?)(?:The economics|The Discovery|\Z)", joined_trailing, re.I | re.S)
    if labour_m:
        labour = clean(labour_m.group(1))

    figures_m = re.search(
        r"^(.+?)(?:Labour estimate:|The economics|The Discovery|\Z)",
        joined_trailing,
        re.I | re.S,
    )
    if figures_m:
        figures_note = clean(figures_m.group(1))
        if figures_note.lower().startswith("the economics") or figures_note.lower().startswith(
            "the discovery"
        ):
            figures_note = ""

    col_headers = {
        "variant",
        "engine code",
        "used (supply)",
        "reconditioned (supply)",
        "rebuilt (supply)",
        "labour hours",
    }
    tables: list[dict[str, Any]] = []
    current_title = ""
    bucket: list[str] = []

    def flush_table():
        nonlocal bucket, current_title
        if not current_title and not bucket:
            return
        header, rows = parse_table(bucket, min_cols=5)
        parsed_rows = []
        for row in rows:
            if not row or row[0].lower() == "variant":
                continue
            while len(row) < 6:
                row.append("")
            parsed_rows.append(
                {
                    "model": row[0],
                    "engineCode": row[1],
                    "usedSupply": row[2],
                    "reconditionedSupply": row[3],
                    "rebuiltSupply": row[4],
                    "labourHours": row[5],
                }
            )
        tables.append(
            {
                "title": current_title,
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
            }
        )
        bucket = []

    for ln in table_region:
        low = ln.lower()
        is_headerish = low in col_headers
        looks_like_title = (
            not is_headerish
            and re.search(r"\d{4}", ln)
            and ("—" in ln or "-" in ln or "Discovery" in ln or "facelift" in low)
            and not re.match(r"^£", ln)
            and "hrs" not in low
        )
        if looks_like_title:
            if bucket:
                flush_table()
            current_title = ln
            continue
        bucket.append(ln)
    flush_table()

    return {
        "h2": h2,
        "subHeadline": sub,
        "tables": tables,
        "figuresNote": figures_note,
        "labourEstimate": labour,
        "economicsBox": {"title": econ_title, "text": econ_text},
    }


def parse_engine_evolution(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    header, rows = parse_table(lines, min_cols=4)
    eras = []
    for row in rows:
        if not row or row[0].lower() == "era":
            continue
        while len(row) < 5:
            row.append("")
        eras.append(
            {
                "era": row[0],
                "years": row[1],
                "keyEngines": row[2],
                "whyBmwChanged": row[3],
                "worthKnowing": row[4],
            }
        )
    return {
        "h2": h2,
        "columns": header
        or ["Era", "Years", "Key Engines", "Why Land Rover Changed", "Worth Knowing"],
        "eras": eras,
    }


def parse_who_should_buy(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    header, rows = parse_table(lines, min_cols=3)
    profiles = []
    for row in rows:
        if not row or row[0].lower() in {"buyer profile"}:
            continue
        while len(row) < 3:
            row.append("")
        profiles.append({"buyerProfile": row[0], "rating": row[1], "verdict": row[2]})
    return {
        "h2": h2,
        "columns": header or ["Buyer Profile", "Rating", "Our Verdict"],
        "profiles": profiles,
    }


def parse_calculator_cta(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    paths = []
    intro_parts = []
    for ln in lines:
        if re.match(r"^path\s*\d+", ln, re.I):
            m = re.match(r"^(Path\s*\d+\s*[—\-].*?)\s*(?:→|->)\s*(\S+)\s*$", ln, re.I)
            if m:
                paths.append({"label": clean(m.group(1)), "href": m.group(2)})
            else:
                label, href = parse_href_and_label(ln)
                paths.append({"label": label or ln, "href": href})
        else:
            intro_parts.append(ln)
    return {"h2": h2, "intro": clean(" ".join(intro_parts)), "paths": paths}


def parse_trust_block(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    signals = []
    for ln in lines:
        item = ln.lstrip("* ").strip()
        m = re.match(r"^(\S+)\s+(.+?)\s*[—\-]+\s*(.*)$", item)
        if m:
            signals.append(
                {"icon": m.group(1), "title": clean(m.group(2)), "text": clean(m.group(3))}
            )
        else:
            m2 = re.match(r"^(\S+)\s+(.+)$", item)
            if m2 and not m2.group(1)[0].isalnum():
                rest = m2.group(2)
                if "—" in rest or " - " in rest:
                    title, text = re.split(r"\s*[—\-]\s*", rest, maxsplit=1)
                    signals.append(
                        {"icon": m2.group(1), "title": clean(title), "text": clean(text)}
                    )
                else:
                    signals.append({"icon": m2.group(1), "title": clean(rest), "text": ""})
            else:
                signals.append({"icon": "", "title": item, "text": ""})
    return {"h2": h2, "signals": signals}


def parse_faq(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    items = []
    # Jaguar TXT uses "Q1: …"; some older exports use "1. …"
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
    return {"h2": h2, "items": items}


def parse_closing(body: str) -> dict[str, Any]:
    lines = strip_section_noise(non_empty_lines(body))
    h2 = ""
    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    cards = []
    footer = ""
    for ln in lines:
        if ln.lower().startswith("(minimal footer"):
            footer = ln
            continue
        m2 = re.match(r"^Card\s*\d+\s*[—\-]\s*(.+)$", ln, re.I)
        if m2:
            rest = m2.group(1)
            href = "#"
            hm = re.search(r"(?:→|->)\s*(\S+)\s*$", rest)
            if hm:
                href = hm.group(1)
                rest = clean(rest[: hm.start()])
            icon = ""
            im = re.match(r"^(\S+)\s+(.*)$", rest)
            if im and not im.group(1)[0].isalnum():
                icon = im.group(1)
                rest = im.group(2)
            if "—" in rest:
                title, text = [clean(x) for x in rest.split("—", 1)]
            else:
                title, text = rest, ""
            cards.append({"icon": icon, "title": title, "text": text, "href": href})
    return {"h2": h2, "cards": cards, "footerNote": footer}


COMPONENT_PARSERS = {
    "ModelHero": ("hero", parse_hero),
    "OwnershipVerdict": ("ownershipVerdict", parse_ownership_verdict),
    "AtAGlance": ("atAGlance", parse_at_a_glance),
    "GenerationsGrid": ("generations", parse_generations),
    "EngineDatabase": ("engineDatabase", parse_engine_database),
    "CommonProblems": ("commonProblems", parse_common_problems),
    "MarketIntelligence": ("marketIntelligence", parse_market_intelligence),
    "EditorialPullQuote": ("editorialPullQuote", parse_editorial),
    "ReplacementCosts": ("replacementCosts", parse_replacement_costs),
    "EngineEvolution": ("engineEvolution", parse_engine_evolution),
    "WhoShouldBuy": ("whoShouldBuy", parse_who_should_buy),
    "CalculatorCTA": ("calculatorCta", parse_calculator_cta),
    "TrustBlock": ("trustBlock", parse_trust_block),
    "FAQAccordion": ("faq", parse_faq),
    "ClosingActionCards": ("closingActionCards", parse_closing),
}

# Expected section keys (JSON field names) for missing-section logging
EXPECTED_SECTION_KEYS = [key for key, _ in COMPONENT_PARSERS.values()]
COMPONENT_TO_KEY = {comp: key for comp, (key, _) in COMPONENT_PARSERS.items()}


def empty_page_skeleton() -> dict[str, Any]:
    return {
        "meta": {
            "slug": "",
            "title": "",
            "titleCharCount": 0,
            "description": "",
            "descriptionCharCount": 0,
            "openGraph": {
                "title": "",
                "description": "",
                "type": "",
                "url": "",
                "image": "",
                "siteName": "",
            },
            "twitter": {"card": "", "title": "", "description": ""},
            "jsonLd": {},
        },
        "hero": {
            "tagPill": "",
            "h1": "",
            "subHeadline": "",
            "trustStrip": [],
            "primaryCta": {"label": "", "href": "#"},
        },
        "ownershipVerdict": {"h2": "", "metrics": [], "oneLineVerdict": ""},
        "atAGlance": {"h2": "", "rows": []},
        "generations": {
            "h2": "",
            "subHeadline": "",
            "cards": [],
            "rangeTable": {"title": "", "columns": [], "rows": []},
            "comparisonLink": {"label": "", "href": "#"},
        },
        "engineDatabase": {
            "h2": "",
            "subHeadline": "",
            "columns": [],
            "engines": [],
            "confidenceScore": {"title": "", "text": ""},
            "dataCorrections": [],
        },
        "commonProblems": {
            "h2": "",
            "subHeadline": "",
            "columns": [],
            "problems": [],
            "urgencyKey": [],
        },
        "marketIntelligence": {
            "h2": "",
            "signals": [],
            "insights": [],
            "liveEnquiryFeedNote": "",
        },
        "editorialPullQuote": {"title": "", "quote": ""},
        "replacementCosts": {
            "h2": "",
            "subHeadline": "",
            "tables": [],
            "figuresNote": "",
            "labourEstimate": "",
            "economicsBox": {"title": "", "text": ""},
        },
        "engineEvolution": {"h2": "", "columns": [], "eras": []},
        "whoShouldBuy": {"h2": "", "columns": [], "profiles": []},
        "calculatorCta": {"h2": "", "intro": "", "paths": []},
        "trustBlock": {"h2": "", "signals": []},
        "faq": {"h2": "", "items": []},
        "closingActionCards": {"h2": "", "cards": [], "footerNote": ""},
    }


def _extract_meta_text_field(meta_text: str, field_name: str) -> tuple[str, int]:
    """
    Pull META TITLE / META DESCRIPTION value + optional character count.
    Handles PART A wrappers, 'text' labels, and varied count lines.
    """
    header = re.search(
        rf"(?:PART\s+[AB]\s*[—\-]\s*)?META\s+{field_name}"
        rf"(?:\s*\([^)]*\))?\s*:?\s*",
        meta_text,
        re.I,
    )
    if not header:
        return "", 0

    after = meta_text[header.end() :]
    value = ""
    count = 0
    for ln in after.splitlines():
        cl = clean(ln)
        if not cl or re.fullmatch(r"_+", cl) or cl == "________________":
            if value:
                break
            continue
        low = cl.lower()
        if low in {"text", "html", "json", "yaml", "script"}:
            continue
        if low in {"meta title:", "meta description:", "meta title", "meta description"}:
            continue
        if low.startswith("part ") and value:
            break
        if low.startswith("open graph") or low.startswith("json-ld") or low.startswith(
            "schema markup"
        ):
            break
        if low.startswith("meta description") and field_name.lower() == "title":
            break
        if low.startswith("open graph") or (
            field_name.lower() == "description"
            and (low.startswith("part c") or low.startswith("part d"))
        ):
            break

        cm = re.search(r"(?:character count|length)\s*:?\s*(\d+)", cl, re.I)
        if not cm:
            cm = re.search(r"\((\d+)\s*characters?", cl, re.I)
        if cm and ("character" in low or "length" in low or cl.startswith("(")):
            count = int(cm.group(1))
            if value:
                break
            continue
        if low.startswith("* ") and value:
            # annotation bullets after the value (XJ style)
            cm = re.search(r"(?:character count|length)\s*:?\s*(\d+)", cl, re.I)
            if cm:
                count = int(cm.group(1))
            continue
        if not value:
            value = cl
            continue
        # Title/description are single-line; stop once we have one.
        break

    if value and not count:
        count = len(value)
    return value, count


def _parse_og_lines(meta_text: str) -> dict[str, str]:
    """Parse `og:title = …` / `og:title: …` / twitter equivalents."""
    tags: dict[str, str] = {}
    for m in OG_LINE_RE.finditer(meta_text):
        key = m.group("key").lower()
        val = clean(m.group("val"))
        # Skip placeholder image notes
        if val.startswith("[") and val.endswith("]"):
            val = ""
        tags[key] = val
    return tags


def _extract_balanced_json_object(text: str, at: int) -> str | None:
    """Return the JSON object that contains index `at` (walk back to its '{')."""
    i = text.rfind("{", 0, at + 1)
    if i < 0:
        return None
    depth = 0
    in_str = False
    escape = False
    for j in range(i, len(text)):
        ch = text[j]
        if in_str:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_str = False
            continue
        if ch == '"':
            in_str = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return text[i : j + 1]
    return None


def _parse_json_ld(meta_text: str) -> dict[str, Any]:
    candidates: list[str] = []
    for sm in re.finditer(
        r"<script[^>]*type=[\"']application/ld\+json[\"'][^>]*>(.*?)</script>",
        meta_text,
        re.I | re.S,
    ):
        raw = sm.group(1).strip()
        # Ignore prose mentions like: one <script type="application/ld+json"> block)
        if raw.startswith("{"):
            candidates.append(raw)

    if not candidates:
        ctx = re.search(r'["\']@context["\']', meta_text)
        if ctx:
            raw = _extract_balanced_json_object(meta_text, ctx.start())
            if raw:
                candidates.append(raw)

    for raw in candidates:
        try:
            data = json.loads(raw)
            if isinstance(data, dict):
                return data
        except json.JSONDecodeError:
            cleaned = re.sub(r",\s*}", "}", raw)
            cleaned = re.sub(r",\s*]", "]", cleaned)
            try:
                data = json.loads(cleaned)
                if isinstance(data, dict):
                    return data
            except json.JSONDecodeError as e:
                print(f"  ! warning: could not parse JSON-LD ({e})", file=sys.stderr)
    return {}


def parse_meta_block(meta_text: str) -> dict[str, Any]:
    meta = empty_page_skeleton()["meta"]

    title, title_count = _extract_meta_text_field(meta_text, "TITLE")
    if title:
        meta["title"] = title
        meta["titleCharCount"] = title_count or len(title)

    desc, desc_count = _extract_meta_text_field(meta_text, "DESCRIPTION")
    if desc:
        meta["description"] = desc
        meta["descriptionCharCount"] = desc_count or len(desc)

    tags = {m.group("key"): m.group("val") for m in META_TAG_RE.finditer(meta_text)}
    tags.update(_parse_og_lines(meta_text))

    meta["openGraph"] = {
        "title": tags.get("og:title", meta["title"]),
        "description": tags.get("og:description", meta["description"]),
        "type": tags.get("og:type", ""),
        "url": tags.get("og:url", ""),
        "image": tags.get("og:image", ""),
        "siteName": tags.get("og:site_name", ""),
    }
    meta["twitter"] = {
        "card": tags.get("twitter:card", ""),
        "title": tags.get("twitter:title", meta["title"]),
        "description": tags.get("twitter:description", meta["description"]),
    }
    if meta["openGraph"]["url"]:
        meta["slug"] = slug_from_url(meta["openGraph"]["url"])

    meta["jsonLd"] = _parse_json_ld(meta_text)
    return meta


def guess_page_title(text_before: str) -> str:
    """Pull a page title from lines immediately before SECTION 1."""
    lines = [clean(ln) for ln in text_before.splitlines() if clean(ln)]
    window = lines[-40:]

    for ln in reversed(window):
        m = MODEL_PAGE_TITLE_RE.match(ln)
        if m:
            return clean(m.group(1))

    skip_prefixes = (
        "classification:",
        "justification:",
        "step 0",
        "brand voice",
        "people also compare",
        "internal linking",
        "data-integrity",
        "section ",
    )
    skip_bits = (
        "metadata",
        "schema",
        "complete content",
        "http",
        "<script",
        "</script",
        "internal working note",
        "not published",
    )

    candidates = []
    for ln in reversed(window):
        low = ln.lower()
        if any(low.startswith(p) for p in skip_prefixes):
            continue
        if any(bit in low for bit in skip_bits):
            continue
        if ln.startswith("{") or ln.startswith("}") or ln.startswith("</") or ln.startswith("<"):
            continue
        if re.fullmatch(r"_+", ln) or ln == "________________":
            continue
        if low in {"text", "html", "json", "script"}:
            continue
        if len(ln) > 70 or ln.count(" ") > 8 or ln.endswith("."):
            continue
        candidates.append(ln)

    # Prefer explicit model-name style titles
    modelish = re.compile(
        r"^(bmw|defender|discovery|freelander|range rover|rr|jaguar|land rover)\b",
        re.I,
    )
    for ln in candidates:
        if modelish.match(ln):
            return ln
    if candidates:
        return candidates[0]
    return "unknown-page"


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = value.replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "page"


def split_pages(text: str) -> list[tuple[str, str]]:
    """
    Split the big TXT into one chunk per model page.

    Page boundary = every SECTION 1 ... <ModelHero> line.
    This covers Land Rover pages (with/without MODEL PAGE header)
    and BMW pages that only use SECTION 1 — HERO — <ModelHero>.
    """
    starts = list(PAGE_START_RE.finditer(text))
    if not starts:
        raise SystemExit(
            "No model pages found. Expected lines like "
            "'SECTION 1 — HERO — <ModelHero>' or 'SECTION 1: HERO — <ModelHero>'."
        )

    pages = []
    for i, m in enumerate(starts):
        # Include a little look-back so "DISCOVERY MODEL PAGE…" / "DEFENDER" titles
        # and the SECTION 1 line itself stay inside the page chunk.
        lookback_start = starts[i - 1].end() if i > 0 else 0
        pre = text[lookback_start:m.start()]
        title = guess_page_title(pre)

        # Page body starts at SECTION 1 line (keep section markers for parsers)
        start = m.start()
        end = starts[i + 1].start() if i + 1 < len(starts) else len(text)
        # Also include any title lines immediately before SECTION 1 (same page)
        title_block = ""
        pre_lines = [ln for ln in pre.splitlines() if clean(ln)]
        kept = []
        for ln in reversed(pre_lines[-8:]):
            cl = clean(ln)
            low = cl.lower()
            if "metadata" in low and "schema" in low:
                break
            if cl.startswith("</script") or cl.startswith("<script") or cl == "}":
                break
            if re.fullmatch(r"_+", cl) or cl == "________________":
                kept.append(ln)
                continue
            if MODEL_PAGE_TITLE_RE.match(cl) or (
                len(cl) <= 70 and cl.count(" ") <= 8 and not cl.endswith(".")
            ):
                kept.append(ln)
                continue
            break
        if kept:
            title_block = "\n".join(reversed(kept)) + "\n"

        pages.append((title, title_block + text[start:end]))
    return pages


def split_content_and_meta(page_text: str) -> tuple[str, str]:
    """
    Split page body from trailing metadata/schema block.

    Accepts:
      Model — METADATA & SCHEMA
      Model — Metadata & Schema Package
      PART A — META TITLE / META TITLE  (no header)
    Prefers the latest match so content notes mentioning 'meta' don't win.
    """
    starts: list[int] = []
    for m in META_START_RE.finditer(page_text):
        starts.append(m.start())
    for m in META_FALLBACK_START_RE.finditer(page_text):
        starts.append(m.start())
    if not starts:
        return page_text, ""
    start = max(starts)
    return page_text[:start], page_text[start:]


def iter_sections(content: str) -> list[tuple[str, str, str]]:
    matches = list(SECTION_RE.finditer(content))
    sections = []
    for i, m in enumerate(matches):
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(content)
        sections.append((m.group("component"), m.group("label"), content[start:end]))
    return sections


def find_missing_sections(page_text: str) -> list[str]:
    """Return expected JSON section keys that have no SECTION marker on this page."""
    content, _meta_text = split_content_and_meta(page_text)
    found_keys = set()
    for component, _label, _body in iter_sections(content):
        key = COMPONENT_TO_KEY.get(component)
        if key:
            found_keys.add(key)
    return [key for key in EXPECTED_SECTION_KEYS if key not in found_keys]


def find_empty_critical_sections(page: dict[str, Any]) -> list[str]:
    """
    Flag faq / schema when the section marker existed but parsed data is empty.
    Logged as: missing faq / missing schema
    """
    empty: list[str] = []
    faq = page.get("faq") or {}
    if not faq.get("items"):
        empty.append("faq")

    meta = page.get("meta") or {}
    og = meta.get("openGraph") or {}
    schema_ok = bool(meta.get("jsonLd")) or bool(meta.get("description")) or bool(
        og.get("url")
    )
    if not schema_ok:
        empty.append("schema")
    return empty


def collect_page_gaps(page_text: str, page: dict[str, Any]) -> list[str]:
    """Marker-missing sections + empty faq/schema (deduped, stable order)."""
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
      jaguar xe
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


def build_page(page_name: str, page_text: str) -> dict[str, Any]:
    content, meta_text = split_content_and_meta(page_text)
    page = empty_page_skeleton()
    if meta_text:
        page["meta"] = parse_meta_block(meta_text)

    sections = iter_sections(content)
    if not sections:
        print(f"  ! warning: no SECTION markers found for '{page_name}'", file=sys.stderr)

    for component, _label, body in sections:
        if component not in COMPONENT_PARSERS:
            print(f"  ! unknown component <{component}> — skipped", file=sys.stderr)
            continue
        key, parser = COMPONENT_PARSERS[component]
        try:
            page[key] = parser(body)
        except Exception as e:
            print(f"  ! failed parsing <{component}>: {e}", file=sys.stderr)

    if not page["meta"]["slug"]:
        # Prefer H1 / tag pill / page title for slug when meta package is missing
        h1 = page.get("hero", {}).get("h1") or ""
        tag = page.get("hero", {}).get("tagPill") or ""
        raw = ""
        if h1:
            raw = re.split(r"\s+[—\-]\s+", h1)[0]
            raw = re.sub(
                r"\b(engines?|engine replacement|the complete uk guide)\b",
                "",
                raw,
                flags=re.I,
            ).strip(" —-")
        if not raw and tag:
            raw = tag.split("•")[0].strip()
        if not raw:
            raw = page_name
        page["meta"]["slug"] = slugify(raw)
    if not page["meta"]["title"] and page.get("hero", {}).get("h1"):
        page["meta"]["title"] = page["hero"]["h1"]
        page["meta"]["titleCharCount"] = len(page["meta"]["title"])
    return page


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
            sys.stderr.reconfigure(encoding="utf-8")
        except Exception:
            pass

    parser = argparse.ArgumentParser(description="Convert model page TXT → JSON")
    parser.add_argument(
        "input",
        nargs="?",
        default=str(DEFAULT_INPUT),
        help="Path to IBS Brand/Models TXT file",
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
    pages = split_pages(text)
    print(f"Found {len(pages)} page(s) in {input_path.name}")

    written = []
    used_slugs: set[str] = set()
    missing_log_entries: list[tuple[str, list[str]]] = []
    for name, page_text in pages:
        print(f"- Parsing: {name}")
        try:
            data = build_page(name, page_text)
        except Exception as e:
            print(f"  ! failed page '{name}': {e}", file=sys.stderr)
            continue

        missing = collect_page_gaps(page_text, data)
        missing_log_entries.append((name, missing))
        if missing:
            print(f"  ! missing sections: {', '.join(missing)}", file=sys.stderr)

        slug = data["meta"]["slug"] or slugify(name)
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
