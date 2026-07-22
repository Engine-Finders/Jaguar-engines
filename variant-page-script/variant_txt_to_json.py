#!/usr/bin/env python3
"""
Convert variant-page TXT content into JSON files matching the shape used by
src/data/variants/bmw-320d.json.

Usage:
  python variant-page-script/variant_txt_to_json.py
  python variant-page-script/variant_txt_to_json.py "variant-page-txt/variant.txt"
  python variant-page-script/variant_txt_to_json.py path/to/input.txt --out variant-page-output

IGNORE RULES (apply to this script and future TXT→JSON converters):
  1. Step 0 Check Results / STEP 0 DECLARATIONS — never put in JSON.
  2. "Data Note (internal):" / "Data-integrity note (internal):" — never put in JSON
     (eraMap.dataNote is always "").
  3. Part 1 / Part 2 chat fluff ("End of Part 1", "Part 2", "Proceed to Part 2",
     LLM thinking paragraphs) — strip anywhere; never put in JSON.
  4. PRODUCTION NOTE (Internal) — ignore.
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
DEFAULT_INPUT = ROOT / "variant-page-txt" / "variant.txt"
DEFAULT_OUT = ROOT / "variant-page-output"

# Allow leading spaces/tabs on headers (export sometimes indents SECTION/META/SCHEMA)
PAGE_START_RE = re.compile(
    r"^[ \t]*SECTION\s+1\s*[—\-:]+\s*HERO\b",
    re.MULTILINE | re.IGNORECASE,
)
SECTION_RE = re.compile(
    r"^[ \t]*SECTION\s+(?P<num>\d+[A-Z]?)\s*[—\-:]+\s*(?P<label>.+?)\s*$",
    re.MULTILINE | re.IGNORECASE,
)
# META  |  META TITLE  |  META TITLE & DESCRIPTION
META_SECTION_RE = re.compile(
    r"^[ \t]*META(?:\s+TITLE(?:\s*&\s*DESCRIPTION)?)?\s*$",
    re.MULTILINE | re.IGNORECASE,
)
SCHEMA_SECTION_RE = re.compile(
    r"^[ \t]*SCHEMA\s*(?:\(JSON[-‑–—]LD\))?\s*$",
    re.MULTILINE | re.IGNORECASE,
)
META_TITLE_BLOCK_RE = re.compile(
    r"^[ \t]*META(?:\s+TITLE(?:\s*&\s*DESCRIPTION)?)?\s*\n"
    r"(?:[ \t]*Meta Title[^\n]*\n)?"
    r"(?:[ \t]*Meta Description[^\n]*\n)?",
    re.MULTILINE | re.IGNORECASE,
)

FIELD_RE = re.compile(
    r"^(Tag Pill|H1|Sub-headline|Sub-Headline|Trust Badges|Price Anchor|"
    r"Registration Input|Ticker|Headline|Supporting line|Supporting Line|Button|H2)\s*:\s*(.*)$",
    re.IGNORECASE,
)

SECTION_KEY_BY_NUM = {
    "1": "hero",
    "1B": "eraMap",
    "2": "replacementCosts",
    "3": "commonProblems",
    "3B": "quotesCta",
    "4": "repairBuyOrReplace",
    "5": "buyingChecklist",
    "6": "engineCodes",
    "7": "marketIntelligence",
    "8": "faq",
    "9": "trustCta",
}

KNOWN_HEADER_CELLS = {
    "generation",
    "years",
    "engine code",
    "reliability",
    "recon cost",
    "era note",
    "engine type",
    "supply only",
    "fitted (indie)",
    "warranty",
    "best for",
    "problem",
    "repairable?",
    "typical cost",
    "when it makes sense",
    "engine code",
    "power",
    "2025 enquiries",
    "avg. recon cost",
    "metric",
    "data",
    "value",
    "display",
}


def clean(text: str) -> str:
    return re.sub(r"[ \t]+", " ", text.replace("\u00a0", " ").replace("\ufeff", "")).strip()


def non_empty_lines(block: str) -> list[str]:
    return [clean(ln) for ln in block.splitlines() if clean(ln)]


def strip_section_noise(lines: list[str]) -> list[str]:
    out = []
    for ln in lines:
        if ln == "________________" or re.fullmatch(r"_+", ln):
            continue
        low = ln.lower()
        if low in {"text", "json"}:
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
    low = cell.lower().rstrip(":")
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
    if path:
        return path.replace("/", "-")
    return ""


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
    # Stop at ANY section — restated Step 0 before Part 2 must not wipe FAQ/META/SCHEMA
    text = re.sub(
        r"(?:Step\s+0\s+Check\s+Results|STEP\s+0\s+DECLARATIONS).*?(?=SECTION\s+\d+\b|\Z)",
        "\n",
        text,
        flags=re.I | re.S,
    )
    text = re.sub(
        r"PRODUCTION NOTE\s*\(Internal\).*?(?=SECTION\s+\d+\b|\Z)",
        "\n",
        text,
        flags=re.I | re.S,
    )
    text = re.sub(
        r"(?:End of Part\s*1|PART\s*1\s+COMPLETE|This completes Part\s*1|"
        r"END OF PART\s*1).*?(?=SECTION\s+\d+\b|META\b|SCHEMA\b|\Z)",
        "\n",
        text,
        flags=re.I | re.S | re.M,
    )
    text = re.sub(
        r"^(?:Part\s*2|PART\s*2)(?:\s*[—\-][^\n]*)?\s*\n(?:(?!SECTION\s+\d+\b|META\b|SCHEMA\b).)*",
        "\n",
        text,
        flags=re.I | re.S | re.M,
    )
    text = re.sub(
        r"^(?:OK,\s+the user has just said|We need to generate Part|This completes the|"
        r"Let's craft|Now produce|I'll structure|Alright,\s+I'll|Summary for Part\s*2|"
        r"First,\s+I need to look at|For Section\s*9|For the meta|For the schema|"
        r"The user is likely|Note:\s+The sample output|We have Part\s*1|We'll follow|"
        r"We'll output|We need:|Let's produce\.|Now produce the final answer\.|"
        r"Ready for Part\s*2|This completes Sections).*?$",
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
            r"(SECTION\s+\d+|META\b|SCHEMA\b)",
            stripped,
            re.IGNORECASE,
        ):
            out.append(stripped)
        else:
            out.append(ln)
    return "\n".join(out) + ("\n" if text.endswith("\n") else "")


def filter_internal_lines(lines: list[str]) -> list[str]:
    out: list[str] = []
    skip_block = False
    for ln in lines:
        low = ln.lower()
        if low.startswith("data note (internal)") or low.startswith("data-integrity note"):
            skip_block = True
            continue
        if skip_block:
            if re.match(r"^SECTION\s+\d", ln, re.I):
                skip_block = False
            else:
                continue
        if low.startswith("production note"):
            break
        out.append(ln)
    return out


def parse_registration_input(text: str) -> dict[str, Any]:
    text = clean(text)
    flag = ""
    placeholder = ""
    cta_label = ""
    cta_href = "#"

    flag_m = re.search(r"\[([^\]]+)\]", text)
    if flag_m:
        flag = clean(flag_m.group(1))
        text = clean(text[flag_m.end() :])

    bracket_cta = re.search(r"\[([^\]]+(?:→|->)?)\]", text)
    if bracket_cta:
        cta_label = clean(bracket_cta.group(1))
        text = clean(text[: bracket_cta.start()])

    if "→" in text or "->" in text:
        parts = re.split(r"\s*(?:→|->)\s*", text, maxsplit=1)
        placeholder = clean(parts[0])
        if len(parts) > 1 and not cta_label:
            cta_label = clean(parts[1])
    else:
        placeholder = text

    placeholder = re.sub(r"^\[|\]$", "", placeholder).strip()
    cta_label = cta_label.rstrip("→").rstrip("->").strip()
    if cta_label and not cta_label.endswith("→"):
        cta_label = cta_label + " →"

    return {
        "flag": flag,
        "placeholder": placeholder,
        "cta": {"label": cta_label, "href": cta_href},
    }


def parse_hero(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    fm = field_map(lines)

    trust_raw = fm.get("trust badges", "")
    trust_badges = [clean(p) for p in trust_raw.split("|") if clean(p)] if trust_raw else []

    reg = parse_registration_input(fm.get("registration input", ""))

    return {
        "tagPill": fm.get("tag pill", ""),
        "h1": fm.get("h1", ""),
        "subHeadline": fm.get("sub headline", "") or fm.get("subheadline", ""),
        "trustBadges": trust_badges,
        "priceAnchor": fm.get("price anchor", ""),
        "registrationInput": reg,
        "ticker": fm.get("ticker", ""),
    }


def era_map_title_from_label(label: str) -> str:
    label = clean(label)
    label = re.sub(r"^THE\s+", "The ", label, flags=re.I)
    label = re.sub(r"\s*[—\-]\s*ERA\s+MAP\s*$", "", label, flags=re.I)
    if label and not label.lower().endswith("era map"):
        label = label + " — Era Map"
    return label


def parse_era_map(body: str, section_label: str = "") -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    title = era_map_title_from_label(section_label)

    if lines and lines[0].lower().startswith("h2:"):
        title = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]

    table_lines, rest = take_until_markers(
        lines,
        ["data note", "this table", "source note"],
    )

    source_note = ""
    for ln in rest:
        low = ln.lower()
        if low.startswith("this table"):
            source_note = ln
            break

    header, rows = parse_table(table_lines, min_cols=4)
    parsed_rows = []
    for row in rows:
        if not row or row[0].lower() in {"generation"}:
            continue
        m = row_dict(header, row)
        parsed_rows.append(
            {
                "generation": get_col(m, "generation"),
                "years": get_col(m, "years"),
                "engineCode": get_col(m, "engine code"),
                "reliability": get_col(m, "reliability"),
                "reconCost": get_col(m, "recon cost"),
                "eraNote": get_col(m, "era note"),
            }
        )

    return {
        "title": title,
        "columns": header
        or [
            "Generation",
            "Years",
            "Engine Code",
            "Reliability",
            "Recon Cost",
            "Era Note",
        ],
        "rows": parsed_rows,
        "sourceNote": source_note,
        "dataNote": "",
    }


def parse_replacement_costs(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    h2 = ""
    figures_note = ""
    labour = ""
    cta_label = ""
    cta_href = "#"

    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    elif lines and not looks_like_header_cell(lines[0]) and "£" not in lines[0]:
        h2 = lines[0]
        lines = lines[1:]

    table_lines: list[str] = []
    for ln in lines:
        low = ln.lower()
        if low.startswith("figures above") or low.startswith("figures reflect"):
            figures_note = ln
            continue
        if low.startswith("labour estimate"):
            labour = clean(ln.split(":", 1)[1] if ":" in ln else ln)
            continue
        if low.startswith("cta:") or low.startswith("cta line:"):
            cta_text = clean(ln.split(":", 1)[1] if ":" in ln else ln)
            cta_label, cta_href = parse_href_and_label(cta_text)
            if cta_href == "#":
                cta_label = cta_text
            continue
        table_lines.append(ln)

    header, rows = parse_table(table_lines, min_cols=4)
    parsed_rows = []
    for row in rows:
        if not row or row[0].lower() in {"engine type"}:
            continue
        m = row_dict(header, row)
        parsed_rows.append(
            {
                "engineType": get_col(m, "engine type"),
                "supplyOnly": get_col(m, "supply only"),
                "fittedIndie": get_col(m, "fitted (indie)"),
                "warranty": get_col(m, "warranty"),
                "bestFor": get_col(m, "best for"),
            }
        )

    return {
        "h2": h2,
        "columns": header
        or [
            "Engine Type",
            "Supply Only",
            "Fitted (Indie)",
            "Warranty",
            "Best For",
        ],
        "rows": parsed_rows,
        "figuresNote": figures_note,
        "labourEstimate": labour,
        "cta": {"label": cta_label, "href": cta_href},
    }


def parse_urgency(text: str) -> dict[str, str]:
    text = clean(text)
    icon = ""
    m = re.match(r"^(\S+)\s+(.*)$", text)
    if m and not m.group(1)[0].isalnum():
        icon = m.group(1)
        text = clean(m.group(2))

    label = text
    detail = ""
    if " — " in text:
        label, detail = [clean(x) for x in text.split(" — ", 1)]
    elif " - " in text:
        label, detail = [clean(x) for x in text.split(" - ", 1)]

    return {"icon": icon, "label": label, "text": detail}


def parse_common_problems(body: str) -> dict[str, Any]:
    text = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    joined = "\n".join(text)
    chunks = re.split(r"(?=Problem\s+\d+\s*:)", joined, flags=re.I)
    problems = []

    for chunk in chunks:
        chunk = chunk.strip()
        if not chunk or not re.match(r"Problem\s+\d+\s*:", chunk, re.I):
            continue

        lines = non_empty_lines(chunk)
        title_m = re.match(r"Problem\s+(\d+)\s*:\s*(.+)$", lines[0], re.I)
        if not title_m:
            continue

        pid = int(title_m.group(1))
        title = clean(title_m.group(2))
        symptoms = ""
        mileage = ""
        repair_cost = ""
        replacement_cost = ""
        urgency = {"icon": "", "label": "", "text": ""}
        recommendation = ""
        failure_label = ""
        failure_href = "#"

        for ln in lines[1:]:
            low = ln.lower()
            if low.startswith("symptoms:"):
                symptoms = clean(ln.split(":", 1)[1])
            elif low.startswith("typical mileage"):
                mileage = clean(ln.split(":", 1)[1])
            elif low.startswith("repair cost"):
                repair_cost = clean(ln.split(":", 1)[1])
            elif low.startswith("replacement cost"):
                replacement_cost = clean(ln.split(":", 1)[1])
            elif low.startswith("urgency:"):
                urgency = parse_urgency(ln.split(":", 1)[1] if ":" in ln else ln)
            elif low.startswith("our recommendation"):
                recommendation = clean(ln.split(":", 1)[1] if ":" in ln else ln)
            elif low.startswith("failure link") or low.startswith("failure-link"):
                rest = clean(ln.split(":", 1)[1] if ":" in ln else ln)
                failure_label, failure_href = parse_href_and_label(rest)
                if failure_href == "#" and rest.startswith("/"):
                    failure_href = rest
                    failure_label = failure_label or "Read the full failure guide →"
                elif failure_href == "#":
                    failure_label = rest
            elif low.startswith("cta line"):
                continue

        problems.append(
            {
                "id": pid,
                "title": title,
                "symptoms": symptoms,
                "typicalMileage": mileage,
                "repairCost": repair_cost,
                "replacementCost": replacement_cost,
                "urgency": urgency,
                "recommendation": recommendation,
                "failureLink": {"label": failure_label, "href": failure_href},
            }
        )

    return {"problems": problems}


def parse_quotes_cta(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    fm = field_map(lines)
    button_text = fm.get("button", "")
    btn_label, btn_href = parse_href_and_label(button_text) if button_text else ("", "#")
    if button_text and btn_href == "#":
        btn_label = button_text

    return {
        "headline": fm.get("headline", ""),
        "supportingLine": fm.get("supporting line", ""),
        "button": {"label": btn_label, "href": btn_href},
    }


def parse_repair_buy_or_replace(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    h2 = ""
    closing = ""
    cta_label = ""
    cta_href = "#"
    buy_if: list[str] = []
    avoid_if: list[str] = []
    buying_title = ""

    if lines and lines[0].lower().startswith("h2:"):
        h2 = clean(lines[0].split(":", 1)[1])
        lines = lines[1:]
    elif lines and "repair, buy, or replace" in lines[0].lower():
        h2 = lines[0]
        lines = lines[1:]

    repair_lines: list[str] = []
    mode = "repair"
    for ln in lines:
        low = ln.lower()
        if low.startswith("can it be repaired"):
            mode = "repair"
            continue
        if low.startswith("buying this"):
            buying_title = ln
            continue
        if low.startswith("buy if"):
            mode = "buy_list"
            continue
        if low.startswith("avoid if"):
            mode = "avoid_list"
            continue
        if low.startswith("closing verdict"):
            closing = clean(ln.split(":", 1)[1] if ":" in ln else ln)
            mode = "after"
            continue
        if low.startswith("cta:") or low.startswith("cta line:"):
            cta_text = clean(ln.split(":", 1)[1] if ":" in ln else ln)
            cta_label, cta_href = parse_href_and_label(cta_text)
            if cta_href == "#":
                cta_label = cta_text
            continue

        if mode == "repair":
            repair_lines.append(ln)
        elif mode == "buy_list":
            buy_if.append(ln)
        elif mode == "avoid_list":
            avoid_if.append(ln)

    header, rows = parse_table(repair_lines, min_cols=3)
    repair_rows = []
    for row in rows:
        if not row or row[0].lower() in {"problem"}:
            continue
        m = row_dict(header, row)
        repair_rows.append(
            {
                "problem": get_col(m, "problem"),
                "repairable": get_col(m, "repairable?"),
                "typicalCost": get_col(m, "typical cost"),
                "whenItMakesSense": get_col(m, "when it makes sense"),
            }
        )

    return {
        "h2": h2,
        "canItBeRepaired": {
            "title": "Can It Be Repaired?",
            "columns": header
            or ["Problem", "Repairable?", "Typical Cost", "When It Makes Sense"],
            "rows": repair_rows,
        },
        "buyingChecks": {
            "title": buying_title or "Buying This? Check These First",
            "buyIf": buy_if,
            "avoidIf": avoid_if,
        },
        "closingVerdict": closing,
        "cta": {"label": cta_label, "href": cta_href},
    }


def parse_buying_checklist(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    if not lines:
        return {"intro": "", "items": []}
    intro = lines[0]
    items = lines[1:]
    return {"intro": intro, "items": items}


def parse_technical_specs(lines: list[str]) -> dict[str, Any]:
    title = ""
    items: list[dict[str, str]] = []
    for ln in lines:
        low = ln.lower()
        if low.startswith("technical specs"):
            title = clean(ln.split(":", 1)[1] if ":" in ln else ln)
            if not title:
                title = ln
            continue
        if ":" in ln:
            label, value = [clean(x) for x in ln.split(":", 1)]
            items.append({"label": label, "value": value})
    return {"title": title, "items": items}


def parse_engine_codes(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    match_note = ""
    cta_label = ""
    cta_href = "#"
    tech_lines: list[str] = []

    table_lines: list[str] = []
    mode = "table"
    for ln in lines:
        low = ln.lower()
        if low.startswith("this table"):
            match_note = ln
            mode = "after_table"
            continue
        if low.startswith("technical specs"):
            mode = "tech"
            tech_lines.append(ln)
            continue
        if low.startswith("cta:") or low.startswith("cta line:"):
            cta_text = clean(ln.split(":", 1)[1] if ":" in ln else ln)
            cta_label, cta_href = parse_href_and_label(cta_text)
            if cta_href == "#":
                cta_label = cta_text
            continue
        if mode == "tech":
            tech_lines.append(ln)
        elif mode == "table":
            table_lines.append(ln)

    header, rows = parse_table(table_lines, min_cols=4)
    parsed_rows = []
    for row in rows:
        if not row or row[0].lower() in {"engine code"}:
            continue
        m = row_dict(header, row)
        parsed_rows.append(
            {
                "engineCode": get_col(m, "engine code"),
                "years": get_col(m, "years"),
                "power": get_col(m, "power"),
                "enquiries": get_col(m, "2025 enquiries", "enquiries"),
                "avgReconCost": get_col(m, "avg. recon cost", "avg recon cost"),
            }
        )

    return {
        "columns": header
        or ["Engine Code", "Years", "Power", "2025 Enquiries", "Avg. Recon Cost"],
        "rows": parsed_rows,
        "matchNote": match_note,
        "technicalSpecs": parse_technical_specs(tech_lines),
        "cta": {"label": cta_label, "href": cta_href},
    }


def parse_market_intelligence(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    metric_idx = None
    for i, ln in enumerate(lines):
        if ln.lower() in {"metric", "metric:", "data", "data:"}:
            metric_idx = i
            break
    if metric_idx is not None:
        lines = lines[metric_idx:]

    header, rows = parse_table(lines, min_cols=2)
    items: list[dict[str, str]] = []
    for row in rows:
        if not row:
            continue
        label = row[0]
        value = row[1] if len(row) > 1 else ""
        if label.lower() in {"metric", "data", "value", "display"}:
            continue
        items.append({"label": label, "value": value})

    if not items:
        cleaned = [
            ln
            for ln in lines
            if ln.lower()
            not in {"metric", "metric:", "data", "data:", "value", "display"}
        ]
        # Same-line "Label: value" (740d / X5 style)
        same_line = 0
        for ln in cleaned:
            if ":" in ln:
                left, right = ln.split(":", 1)
                if clean(left) and clean(right):
                    same_line += 1
        if same_line >= max(2, len(cleaned) // 2):
            for ln in cleaned:
                if ":" not in ln:
                    continue
                left, right = ln.split(":", 1)
                label, value = clean(left), clean(right)
                if label and value:
                    items.append({"label": label, "value": value})
        else:
            # Alternating label / value lines (116i style)
            i = 0
            while i + 1 < len(cleaned):
                items.append({"label": cleaned[i], "value": cleaned[i + 1]})
                i += 2

    return {"items": items}


def parse_faq(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    if lines and lines[0].lower().startswith("h2:"):
        lines = lines[1:]

    items: list[dict[str, Any]] = []
    disclaimer = ""
    # Numbered: "1. …" / "Q1: …"
    q_re = re.compile(r"^(?:Q\s*)?(\d+)\s*[.:]\s*(.*)$", re.IGNORECASE)
    current: dict[str, Any] | None = None

    for ln in lines:
        low = ln.lower()
        if low.startswith("disclaimer:"):
            disclaimer = clean(ln.split(":", 1)[1] if ":" in ln else ln)
            if current:
                items.append(current)
                current = None
            continue
        m = q_re.match(ln)
        if m:
            if current:
                items.append(current)
            current = {"id": int(m.group(1)), "question": clean(m.group(2)), "answer": ""}
        elif current is not None:
            current["answer"] = clean((current["answer"] + " " + ln).strip())

    if current:
        items.append(current)

    # Unnumbered fallback: question lines end with "?"
    if not items:
        current = None
        for ln in lines:
            low = ln.lower()
            if low.startswith("disclaimer:"):
                disclaimer = clean(ln.split(":", 1)[1] if ":" in ln else ln)
                if current:
                    items.append(current)
                    current = None
                continue
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

    return {"items": items, "disclaimer": disclaimer}


def parse_trust_cta(body: str) -> dict[str, Any]:
    lines = filter_internal_lines(strip_section_noise(non_empty_lines(body)))
    h2 = ""
    trust_points: list[dict[str, str]] = []
    final_cta = ""
    cta_label = ""
    cta_href = "#"

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
            final_cta = clean(ln.split(":", 1)[1] if ":" in ln else ln)
            continue
        if low.startswith("cta button"):
            in_trust = False
            cta_text = clean(ln.split(":", 1)[1] if ":" in ln else ln)
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
        "ctaButton": {"label": cta_label, "href": cta_href},
    }


def parse_meta_and_schema(page_text: str) -> dict[str, Any]:
    meta: dict[str, Any] = {
        "slug": "",
        "title": "",
        "titleCharCount": 0,
        "description": "",
        "descriptionCharCount": 0,
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

    meta_m = META_SECTION_RE.search(page_text)
    # Fall back: some pages omit META header but still have Meta Title / SCHEMA
    if meta_m:
        after_meta = page_text[meta_m.end() :]
    else:
        after_meta = page_text

    schema_m = None
    for m in SCHEMA_SECTION_RE.finditer(after_meta):
        schema_m = m
    meta_block = after_meta[: schema_m.start()] if schema_m else after_meta
    schema_block = after_meta[schema_m.end() :] if schema_m else ""

    # Also scan full page for title/description if meta_block missed them
    scan_text = meta_block if meta_block.strip() else page_text

    tm = re.search(
        r"Meta Title\s*(?:\((\d+)\s*chars?\))?\s*:\s*(.+)$",
        scan_text,
        re.I | re.M,
    )
    if tm:
        if tm.group(1):
            meta["titleCharCount"] = int(tm.group(1))
        meta["title"] = clean(tm.group(2))

    dm = re.search(
        r"Meta Description\s*(?:\((\d+)\s*chars?\))?\s*:\s*(.+)$",
        scan_text,
        re.I | re.M,
    )
    if dm:
        if dm.group(1):
            meta["descriptionCharCount"] = int(dm.group(1))
        meta["description"] = clean(dm.group(2))

    if meta["title"] and not meta["titleCharCount"]:
        meta["titleCharCount"] = len(meta["title"])
    if meta["description"] and not meta["descriptionCharCount"]:
        meta["descriptionCharCount"] = len(meta["description"])

    cm = re.search(
        r'Canonical Tag:\s*<link\s+rel="canonical"\s+href="([^"]+)"',
        scan_text,
        re.I,
    )
    if cm:
        meta["canonical"] = cm.group(1)

    og_section = re.search(
        r"OPEN GRAPH.*?TWITTER CARD.*?(?=SCHEMA|\Z)",
        scan_text,
        re.I | re.S,
    )
    og_text = og_section.group(0) if og_section else scan_text
    for ln in og_text.splitlines():
        ln = clean(ln)
        m = re.match(
            r"^(?P<key>(?:og|twitter):[A-Za-z0-9_:]+)\s*[=:]\s*(?P<val>.+)$",
            ln,
            re.I,
        )
        if not m:
            continue
        key = m.group("key").lower()
        val = clean(m.group("val"))
        if val.startswith("[") and val.endswith("]"):
            val = ""
        if key.startswith("og:"):
            og_key = key[3:]
            mapping = {
                "title": "title",
                "description": "description",
                "type": "type",
                "url": "url",
                "image": "image",
                "site_name": "siteName",
            }
            if og_key in mapping:
                meta["openGraph"][mapping[og_key]] = val
        elif key.startswith("twitter:"):
            tw_key = key[8:]
            mapping = {
                "card": "card",
                "title": "title",
                "description": "description",
                "image": "image",
            }
            if tw_key in mapping:
                meta["twitter"][mapping[tw_key]] = val

    if schema_block:
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


def content_for_sections(page_text: str) -> str:
    """
    Body used for SECTION parsers.
    Cut only before SCHEMA; strip META title blocks so early META does not drop later sections.
    """
    schema_m = None
    for m in SCHEMA_SECTION_RE.finditer(page_text):
        schema_m = m
    content = page_text[: schema_m.start()] if schema_m else page_text
    content = META_TITLE_BLOCK_RE.sub("\n", content)
    return content


def empty_page_skeleton() -> dict[str, Any]:
    return {
        "meta": {
            "slug": "",
            "title": "",
            "titleCharCount": 0,
            "description": "",
            "descriptionCharCount": 0,
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
            "trustBadges": [],
            "priceAnchor": "",
            "registrationInput": {
                "flag": "",
                "placeholder": "",
                "cta": {"label": "", "href": "#"},
            },
            "ticker": "",
        },
        "eraMap": {
            "title": "",
            "columns": [],
            "rows": [],
            "sourceNote": "",
            "dataNote": "",
        },
        "replacementCosts": {
            "h2": "",
            "columns": [],
            "rows": [],
            "figuresNote": "",
            "labourEstimate": "",
            "cta": {"label": "", "href": "#"},
        },
        "commonProblems": {"problems": []},
        "quotesCta": {
            "headline": "",
            "supportingLine": "",
            "button": {"label": "", "href": "#"},
        },
        "repairBuyOrReplace": {
            "h2": "",
            "canItBeRepaired": {"title": "", "columns": [], "rows": []},
            "buyingChecks": {"title": "", "buyIf": [], "avoidIf": []},
            "closingVerdict": "",
            "cta": {"label": "", "href": "#"},
        },
        "buyingChecklist": {"intro": "", "items": []},
        "engineCodes": {
            "columns": [],
            "rows": [],
            "matchNote": "",
            "technicalSpecs": {"title": "", "items": []},
            "cta": {"label": "", "href": "#"},
        },
        "marketIntelligence": {"items": []},
        "faq": {"items": [], "disclaimer": ""},
        "trustCta": {
            "h2": "",
            "trustPoints": [],
            "finalCta": "",
            "ctaButton": {"label": "", "href": "#"},
        },
    }


SECTION_PARSERS = {
    "hero": parse_hero,
    "replacementCosts": parse_replacement_costs,
    "commonProblems": parse_common_problems,
    "quotesCta": parse_quotes_cta,
    "repairBuyOrReplace": parse_repair_buy_or_replace,
    "buyingChecklist": parse_buying_checklist,
    "engineCodes": parse_engine_codes,
    "marketIntelligence": parse_market_intelligence,
    "faq": parse_faq,
    "trustCta": parse_trust_cta,
}


def split_pages(text: str) -> list[tuple[str, str]]:
    starts = list(PAGE_START_RE.finditer(text))
    if not starts:
        raise SystemExit(
            "No variant pages found. Expected lines like "
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
        num = m.group("num").upper()
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
        if re.search(r"\bvariant page\b", ln, re.I):
            return ln
    return "unknown-variant"


def build_page(preamble: str, page_text: str) -> dict[str, Any]:
    page = empty_page_skeleton()

    content = content_for_sections(page_text)

    sections = iter_sections(content)
    for key, label, body in sections:
        if key == "eraMap":
            try:
                page[key] = parse_era_map(body, section_label=label)
            except Exception as e:
                print(f"  ! failed parsing section '{key}': {e}", file=sys.stderr)
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
                r"\b(engines?|engine replacement)\b",
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
    content = content_for_sections(page_text)
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

    mi = page.get("marketIntelligence") or {}
    if not mi.get("items"):
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
      BMW 1 Series 116i
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

    parser = argparse.ArgumentParser(description="Convert variant page TXT → JSON")
    parser.add_argument(
        "input",
        nargs="?",
        default=str(DEFAULT_INPUT),
        help="Path to variant pages TXT file",
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
