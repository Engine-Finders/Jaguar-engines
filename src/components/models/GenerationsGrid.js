"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, Star, StarHalf } from "lucide-react";
import { BookOpen, NumberGlyph, Scale } from "@/components/models/brandIcons";
import { useTheme } from "@/components/shared/themeProvider";
import { carImageFor } from "@/components/shared/carImage";
import { outsideTags } from "@/components/models/outsideTags";

/*
 * Model page "Generations" (section 4), built from the 1536px brand references (light + dark).
 *
 * Desktop (lg, 1024px up), as in the reference:
 *   title (two lines)
 *   [ description   ] [ cards 2..5 (four across)          ]
 *   [ card 1 (open) ] [ comparison table + "Our position" ]   <- card 1 and the table share a bottom edge
 *   comparison note / "Read the full comparison" bar
 * Sizes come from the --gn-* tokens in globals.css (reference values at 1536px, scaled down to 1024px).
 *
 * Any number of generations works: 1 card (F-Pace) puts the table's intro beside card 1; 2–4 cards fill
 * one row (the intro takes any free slots); 9 cards (XJ) wrap into rows of four.
 * Tablet: everything stacked, cards two/four across, real table from md. Phones: card 1 in full, the other
 * cards in a swipeable row, the table as one block per aspect.
 */

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Ã‚Â£", "£")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replaceAll("â€¢", "•")
    .replaceAll("â˜…", "★")
    .replaceAll("â˜†", "☆")
    .replaceAll("Â½", "½")
    .replaceAll("â†’", "→")
    .replace(/\s+/g, " ")
    .trim();
}

// Year ranges take an en dash ("2017–2019", "2020–Present"); " - " separators become em dashes.
function typeset(text = "") {
  return outsideTags(cleanText(text), (part) =>
    part
      .replace(/(\d{4})\s*-\s*(\d{4}|Present)/gi, "$1–$2")
      .replace(/\s-\s/g, " — "),
  );
}

// "E-Pace - One Generation, Five Powertrains" -> "E-Pace — One Generation," / "Five Powertrains"
// "XF Generations - Find Your Vehicle"       -> "XF Generations —" / "Find Your Vehicle"
function splitTitle(title = "") {
  const clean = cleanText(title);
  const match = clean.match(/^(.*?)\s+[-–—]\s+(.*)$/);
  if (!match) return { main: clean, accent: "" };
  const [, model, rest] = match;
  const comma = rest.indexOf(",");
  if (comma !== -1) return { main: `${model} — ${rest.slice(0, comma + 1)}`, accent: rest.slice(comma + 1).trim() };
  return { main: `${model} —`, accent: rest };
}

function modelNameFromH2(h2 = "") {
  return cleanText(h2).split(/\s+(?:[-–—]|Generations)\s/)[0].replace(/^Jaguar\s+/, "").trim();
}

// Card title -> chassis code, e.g. "XJ X351 (2010-2019)" -> "X351"; "2019-2024: Revised V8 Era" -> "2019-2024".
function parseCardTitle(title = "", modelName = "") {
  let name = cleanText(title).replace(/\s*-\s*$/, "");
  let years = "";
  let note = "";
  const parens = name.match(/^(.*?)\s*\(([^)]*)\)\s*(?:-\s*)?(.*)$/);
  if (parens) [, name, years, note] = parens;
  else if (name.includes(": ")) [name, note] = name.split(/:\s+(.*)/s);
  const model = modelName.toLowerCase();
  if (model && name.toLowerCase().startsWith(`${model} `)) name = name.slice(modelName.length + 1);
  name = name.replace(/^Jaguar\s+\S+\s+/i, "").replace(/\s+(Generation|All Engines)$/i, "");
  return { code: name.trim(), years: years.trim(), note: note.trim() };
}

// "1996-2006 • 4.0 AJ27 V8 • 4.2 AJ34 V8" -> years + engine list (anything else is a marketing badge).
function parseMeta(meta = "") {
  const parts = cleanText(meta).split(/\s*•\s*/).filter(Boolean);
  if (parts.length && /^\d{4}\s*-\s*(\d{4}|present)$/i.test(parts[0])) return { years: parts[0], engines: parts.slice(1) };
  if (parts.length && /^\d{4}\s*-\s*\d{4}:/.test(parts[0])) return { years: parts[0].replace(/:.*/, ""), engines: [], note: parts[0].replace(/^[^:]*:\s*/, "") };
  return { years: "", engines: [] };
}

// Subtitle lines, e.g. "2017-2019 (pre-facelift)" -> ["2017–2019", "(pre-facelift)"], as in the reference.
function subtitleLines(card, title, meta) {
  const raw = cleanText(card.subtitle) || [title.years || meta.years, title.note || meta.note].filter(Boolean).join(" (") + (title.note || meta.note ? ")" : "");
  if (!raw) return [];
  const parts = typeset(raw).match(/^(.*?)\s*(\(.*\))$/);
  return parts ? [parts[1], parts[2]].filter(Boolean) : [typeset(raw)];
}

// First five ★/☆/½ in the rating string; whatever follows ("(pre-2019 cooling caveats apply)") is a caption.
function parseRating(value = "") {
  const text = cleanText(value);
  let full = 0;
  let half = 0;
  let seen = 0;
  let end = 0;
  for (let i = 0; i < text.length && seen < 5; i += 1) {
    const char = text[i];
    if (char === "★") full += 1;
    else if (char === "½") half = 1;
    else if (char !== "☆") continue;
    seen += 1;
    end = i + 1;
  }
  if (!seen) return null;
  return { value: Math.min(5, full + half * 0.5), caption: typeset(text.slice(end)) };
}

/* ---------- Palette ---------- */

// Site palette, as in sections 1–3: black and silver in light, silver on black in dark. Red / green stay
// only as risk / safe signals in the table, as elsewhere on the site.
function palette(isDark) {
  return isDark
    ? {
        text: "text-white",
        soft: "text-white/[0.78]",
        accent: "text-[#d4d4d2]",
        badge: "border border-white/[0.32] bg-[#38393b] text-white",
        card: "border-white/[0.18] bg-[rgba(14,16,17,0.92)]",
        leadCard: "border-white/[0.38] bg-[rgba(14,16,17,0.92)]",
        rule: "border-white/[0.11]",
        outline: "border-white/[0.2] text-white hover:border-white/[0.45]",
        star: "text-[#ececea]",
        starEmpty: "text-[#ececea]/80",
        table: "border-white/[0.22] bg-[#111315]",
        head: "bg-[#16181a]",
        position: "bg-[#121416] text-white",
        positionStar: "text-[#a3a3a1] fill-current",
        risk: "text-[#f0625a]",
        safe: "text-white/[0.92]",
        bar: "border-white/[0.18] bg-[#0d0f10]",
        link: "text-[#c9cacc] hover:text-white",
      }
    : {
        text: "text-[#111210]",
        soft: "text-[#262725]",
        // the hero's silver accent ("UK Guide")
        accent: "bg-[linear-gradient(180deg,#8a8b87_0%,#6b6c68_100%)] bg-clip-text text-transparent",
        badge: "bg-[#111210] text-white",
        card: "border-[#eceeed] bg-white shadow-[0_6px_22px_rgba(16,18,16,0.06)]",
        leadCard: "border-[#a5a6a2] bg-white shadow-[0_6px_22px_rgba(16,18,16,0.06)]",
        rule: "border-[#ededeb]",
        outline: "border-[#dcdcda] text-[#111210] hover:border-[#9b9c97]",
        star: "text-[#111210]",
        starEmpty: "text-[#111210]/80",
        table: "border-[#e4e7e3] bg-white shadow-[0_6px_22px_rgba(16,18,16,0.05)]",
        head: "bg-white",
        position: "bg-[#f3f3f1] text-[#111210]",
        positionStar: "text-[#111210] fill-current",
        risk: "text-[#d42a2a]",
        safe: "text-[#24613a]",
        bar: "border-[#ececea] bg-[#f9f9f8]",
        link: "text-[#111210] hover:text-[#4a4b48]",
      };
}

/* ---------- Card ---------- */

function Stars({ rating, tones, lead }) {
  if (!rating) return null;
  const full = Math.floor(rating.value);
  const half = rating.value - full >= 0.5;
  const size = lead
    ? "h-[20px] w-[20px] lg:h-[calc(var(--gn-star)*1.08)] lg:w-[calc(var(--gn-star)*1.08)]"
    : "h-[18px] w-[18px] lg:h-[var(--gn-star)] lg:w-[var(--gn-star)]";

  return (
    <div className="mt-3 lg:mt-[var(--gn-stars-mt)]">
      <span className={`inline-flex items-center gap-[5px] ${tones.star}`} role="img" aria-label={`${rating.value} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, index) => {
          if (index < full) return <Star key={index} aria-hidden="true" className={`${size} fill-current`} strokeWidth={1.4} />;
          if (index === full && half) {
            return (
              <span key={index} className={`relative ${size}`}>
                <Star aria-hidden="true" className={`absolute inset-0 h-full w-full ${tones.starEmpty}`} strokeWidth={1.2} />
                <StarHalf aria-hidden="true" className="absolute inset-0 h-full w-full fill-current" strokeWidth={1.4} />
              </span>
            );
          }
          return <Star key={index} aria-hidden="true" className={`${size} ${tones.starEmpty}`} strokeWidth={1.2} />;
        })}
      </span>
      {rating.caption ? <p className={`mt-1 text-[12px] leading-snug ${tones.soft}`} dangerouslySetInnerHTML={{ __html: rating.caption }} /> : null}
    </div>
  );
}

// The generation's cut-out car standing on the card, with a soft contact shadow (as in the reference).
function CarPhoto({ src, alt, lead, wide = false, isDark }) {
  if (!src) return null;
  return (
    <div
      className={
        lead
          ? `relative mx-auto mt-1 h-[168px] w-[96%] sm:h-[180px] lg:mt-[var(--gn-lead-car-mt)] lg:w-[96%] ${wide ? "lg:h-[calc(var(--gn-lead-car-h)*1.4)]" : "lg:h-[var(--gn-lead-car-h)]"}`
          : "relative mx-auto mt-1 h-[122px] w-full sm:h-[126px] lg:mt-[var(--gn-car-mt)] lg:h-[var(--gn-car-h)]"
      }
    >
      <div aria-hidden="true" className={`absolute inset-x-[10%] bottom-[2%] h-[12%] rounded-[50%] blur-md ${isDark ? "bg-black/80" : "bg-black/25"}`} />
      <Image src={src} alt={alt} fill className="object-contain object-bottom" sizes={lead ? "(min-width: 1024px) 300px, 86vw" : "(min-width: 1024px) 230px, 70vw"} />
    </div>
  );
}

function GenerationCard({ card, index, modelName, lead = false, wide = false, isDark }) {
  const tones = palette(isDark);
  const verdict = typeset(card.verdict);
  const [open, setOpen] = useState(lead && Boolean(verdict));
  const title = parseCardTitle(card.title, modelName);
  const meta = parseMeta(card.meta);
  const lines = subtitleLines(card, title, meta);
  const engines = (card.engines?.length ? card.engines : meta.engines).map(typeset);
  const rating = parseRating(card.rating);
  const href = card.cta?.href || "#";
  const label = typeset(card.cta?.label || `Explore ${title.code}`)
    .replace(/\s*→\s*$/, "")
    .replace(/^Explore the\s+/i, "Explore ");
  const verdictId = `gen-verdict-${index}`;

  return (
    <article
      className={`relative flex min-w-0 flex-col rounded-xl border px-4 pb-4 pt-4 lg:px-[var(--gn-card-px)] lg:pt-[var(--gn-card-pt)] ${
        lead ? `${tones.leadCard} lg:pb-[var(--gn-lead-pb)]` : `${tones.card} lg:pb-[var(--gn-card-pb)]`
      } ${tones.text}`}
    >
      {/* sm–lg: card 1 lays out in two columns (car | verdict); phones and desktop stack it */}
      <div
        className={
          lead
            ? wide
              ? "sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-[calc(var(--gn-col-gap)*1.6)]"
              : "sm:grid sm:grid-cols-2 sm:gap-6 lg:block"
            : "flex flex-1 flex-col"
        }
      >
        <div className={lead ? "" : "flex flex-1 flex-col"}>
          <header className="flex items-start gap-3 lg:gap-[var(--gn-badge-gap)]">
            {index < 10 ? (
              <NumberGlyph value={index + 1} className="h-[26px] w-[26px] lg:h-[calc(var(--gn-badge)*1.08)] lg:w-[calc(var(--gn-badge)*1.08)]" />
            ) : (
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold leading-none lg:h-[var(--gn-badge)] lg:w-[var(--gn-badge)] lg:text-[calc(var(--gn-badge)*0.56)] ${tones.badge}`}
              >
                {index + 1}
              </span>
            )}
            <div className="min-w-0 flex-1 pt-px">
              <p className="text-[13.5px] font-medium leading-tight lg:text-[length:var(--gn-label)]" dangerouslySetInnerHTML={{ __html: cleanText(card.label) || modelName }} />
              <h3
                className="mt-0.5 text-[22px] font-medium leading-[1.2] tracking-[-0.005em] lg:text-[length:var(--gn-code)]"
                dangerouslySetInnerHTML={{ __html: title.code }}
              />
            </div>
            {lead && verdict ? (
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls={verdictId}
                aria-label={open ? "Hide our verdict" : "Show our verdict"}
                className="-mr-1 -mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
              >
                {open ? <ChevronUp className="h-6 w-6" strokeWidth={2} /> : <ChevronDown className="h-6 w-6" strokeWidth={2} />}
              </button>
            ) : null}
          </header>

          {/* Years / notes / engines, aligned with the model name as in the reference */}
          <div
            className={`mt-3 pl-9 text-[13px] leading-[1.55] lg:mt-[var(--gn-meta-mt)] lg:pl-[calc(var(--gn-badge)+var(--gn-badge-gap))] lg:text-[length:var(--gn-meta)] lg:leading-[var(--gn-meta-lh)] ${
              lead ? "" : "lg:min-h-[var(--gn-meta-min)]"
            }`}
          >
            {lines.map((line) => (
              <p key={line} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
            {engines.length ? (
              <ul className="mt-0.5">
                {engines.map((engine) => (
                  <li key={engine} className="flex gap-1.5">
                    <span aria-hidden="true">{"•"}</span>
                    <span dangerouslySetInnerHTML={{ __html: engine }} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Car, stars and button sit on the card's bottom edge, so they line up across a row */}
          <div className={lead ? "" : "mt-auto"}>
            <CarPhoto src={card.image} alt={`${modelName} ${title.code}`} lead={lead} wide={wide} isDark={isDark} />
            <Stars rating={rating} tones={tones} lead={lead} />
          </div>
        </div>

        {lead ? (
          <div className="flex flex-col">
            {open ? (
              <div id={verdictId} className="mt-5 lg:mt-[var(--gn-vhead-mt)]">
                <p className="text-[15px] font-semibold lg:text-[length:var(--gn-vhead)]">Our Verdict:</p>
                <p
                  className={`mt-1.5 text-[14.5px] leading-[1.5] lg:text-[length:var(--gn-verdict)] lg:leading-[var(--gn-verdict-lh)] ${tones.soft}`}
                  dangerouslySetInnerHTML={{ __html: verdict }}
                />
              </div>
            ) : null}
            <div className="mt-5 lg:mt-[var(--gn-cta-mt)]">
              <Link
                href={href}
                className={`inline-flex min-h-[44px] items-center gap-2.5 rounded-md px-5 text-[15px] !font-medium transition-shadow lg:min-h-[var(--gn-cta-h)] lg:text-[length:var(--gn-cta)] ${
                  isDark ? "btn-cta" : "bg-[linear-gradient(180deg,#2c2d2b_0%,#121312_100%)] text-white shadow-[0_8px_18px_rgba(16,18,16,0.18)] hover:shadow-[0_10px_24px_rgba(16,18,16,0.28)]"
                }`}
              >
                <span dangerouslySetInnerHTML={{ __html: label }} />
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        ) : (
          <Link
            href={href}
            className={`mt-5 flex min-h-[44px] items-center justify-center gap-2 rounded-md border px-3 text-center text-[14.5px] !font-semibold leading-tight transition-colors md:px-1.5 md:text-[13px] lg:mt-[var(--gn-btn-mt)] lg:min-h-[var(--gn-btn-h)] lg:text-[length:var(--gn-btn)] xl:px-3 ${tones.outline}`}
          >
            <span dangerouslySetInnerHTML={{ __html: label }} />
            <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 md:hidden xl:block" strokeWidth={2} />
          </Link>
        )}
      </div>
    </article>
  );
}

/* ---------- Comparison table ---------- */

// "AJ200D / 204DTD (tensioner wear risk)" -> the trailing note on its own line, as in the reference.
function CellText({ text }) {
  const clean = typeset(text);
  const parts = clean.match(/^(.*?)\s*(\([^)]*\))$/);
  if (!parts) return <span dangerouslySetInnerHTML={{ __html: clean }} />;
  return (
    <>
      <span className="block" dangerouslySetInnerHTML={{ __html: parts[1] }} />
      <span className="block" dangerouslySetInnerHTML={{ __html: parts[2] }} />
    </>
  );
}

function tone(cellTone, tones) {
  if (cellTone === "risk") return tones.risk;
  if (cellTone === "safe") return tones.safe;
  return "";
}

function ComparisonTable({ table, isDark }) {
  const tones = palette(isDark);
  const rows = table?.rows || [];
  if (!rows.length) return null;
  const columns = (table.columns || []).map(typeset);
  const dataColumns = Math.max(1, columns.length - 1);
  const position = table.position?.text ? table.position : null;
  // Reference proportions: aspect ~20% (22% here: Arial sets wider), data columns share the middle
  // (26% / 31% in the reference), "Our position" 23%.
  const dataWidth = (position ? 55 : 78) / dataColumns;

  return (
    <div className={`overflow-hidden rounded-xl border ${tones.table} ${tones.text}`}>
      {/* md+: the reference table */}
      <table className="hidden w-full table-fixed border-collapse text-left md:table">
        <colgroup>
          <col style={{ width: "22%" }} />
          {columns.slice(1).map((column, index) => (
            <col key={column} style={{ width: `${dataWidth * (dataColumns === 2 ? (index === 0 ? 0.92 : 1.08) : 1)}%` }} />
          ))}
          {position ? <col style={{ width: "23%" }} /> : null}
        </colgroup>
        <thead>
          <tr className={`border-b ${tones.rule} ${tones.head}`}>
            {columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={`h-[42px] px-3 text-[14px] font-semibold lg:h-[var(--gn-th-h)] lg:px-[var(--gn-cell-px)] lg:text-[length:var(--gn-cell)] ${index > 0 ? `border-l ${tones.rule}` : ""}`}
              >
                {column}
              </th>
            ))}
            {position ? (
              <th scope="col" className={`border-l px-3 text-[14px] font-semibold lg:px-[var(--gn-pos-px)] lg:text-[length:var(--gn-cell)] ${tones.rule} ${tones.position}`}>
                <span className="flex items-center gap-3">
                  <Star aria-hidden="true" className={`h-[18px] w-[18px] ${tones.positionStar}`} strokeWidth={1.4} />
                  {cleanText(position.title || "Our position")}
                </span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.label} className={rowIndex > 0 ? `border-t ${tones.rule}` : ""}>
              <th
                scope="row"
                className="px-3 py-2 text-[13.5px] font-semibold leading-[1.45] lg:px-[var(--gn-cell-px)] lg:py-[var(--gn-cell-py)] lg:text-[length:var(--gn-cell)] lg:leading-[var(--gn-cell-lh)]"
              >
                {cleanText(row.label)}
              </th>
              {(row.cells || []).map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`border-l px-3 py-2 text-[13.5px] leading-[1.45] lg:px-[var(--gn-cell-px)] lg:py-[var(--gn-cell-py)] lg:text-[length:var(--gn-cell)] lg:leading-[var(--gn-cell-lh)] ${tones.rule} ${tone(cell.tone, tones)}`}
                >
                  <CellText text={cell.text} />
                </td>
              ))}
              {position && rowIndex === 0 ? (
                <td
                  rowSpan={rows.length}
                  className={`border-l px-3 align-middle text-[13.5px] font-semibold leading-[1.6] lg:px-[var(--gn-pos-px)] lg:text-[length:var(--gn-cell)] lg:leading-[calc(var(--gn-cell-lh)*1.05)] ${tones.rule} ${tones.position} ${isDark ? "!font-normal lg:text-[length:calc(var(--gn-cell)*1.06)]" : ""}`}
                  dangerouslySetInnerHTML={{ __html: typeset(position.text) }}
                />
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phones / small tablets: one block per aspect, the column names as labels */}
      <div className="md:hidden">
        {rows.map((row, rowIndex) => (
          <div key={row.label} className={`px-4 py-3.5 ${rowIndex > 0 ? `border-t ${tones.rule}` : ""}`}>
            <p className="text-[14.5px] font-semibold">{cleanText(row.label)}</p>
            <dl className="mt-2 grid gap-2">
              {(row.cells || []).map((cell, cellIndex) => (
                <div key={cellIndex} className="grid grid-cols-[minmax(0,42%)_minmax(0,1fr)] gap-3 text-[13.5px] leading-[1.45]">
                  <dt className={tones.soft} dangerouslySetInnerHTML={{ __html: columns[cellIndex + 1] || "" }} />
                  <dd className={tone(cell.tone, tones)}>
                    <CellText text={cell.text} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        {position ? (
          <div className={`border-t px-4 py-4 ${tones.rule} ${tones.position}`}>
            <p className="flex items-center gap-2.5 text-[14.5px] font-semibold">
              <Star aria-hidden="true" className={`h-[17px] w-[17px] ${tones.positionStar}`} strokeWidth={1.4} />
              {cleanText(position.title || "Our position")}
            </p>
            <p className="mt-2 text-[14.5px] font-medium leading-[1.55]" dangerouslySetInnerHTML={{ __html: typeset(position.text) }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

// The table's lead-in, shown wherever the layout leaves room for it (pages with fewer than four
// other generations); on a full row of cards it is left out, as in the reference.
function TableIntro({ table, isDark, className = "" }) {
  const tones = palette(isDark);
  if (!table?.intro) return null;
  return (
    <div className={`rounded-xl border p-4 lg:px-[var(--gn-card-px)] lg:py-[var(--gn-card-pt)] ${tones.card} ${tones.text} ${className}`}>
      {table.title ? <h3 className="text-[15.5px] font-semibold lg:text-[length:var(--gn-vhead)]">{typeset(table.title)}</h3> : null}
      <p className={`mt-1.5 text-[14px] leading-[1.55] lg:text-[length:var(--gn-verdict)] lg:leading-[var(--gn-verdict-lh)] ${tones.soft}`} dangerouslySetInnerHTML={{ __html: typeset(table.intro) }} />
    </div>
  );
}

/* ---------- Bars under the grid ---------- */

function ComparisonNote({ note, isDark, inSlot = false, className = "" }) {
  const tones = palette(isDark);
  if (!note?.text && !note?.verdict) return null;
  return (
    <div
      className={`flex gap-3.5 rounded-xl border px-4 py-3.5 ${
        inSlot ? `${tones.card} lg:px-[var(--gn-card-px)] lg:py-[var(--gn-card-pt)]` : `mt-4 lg:mt-[var(--gn-bar-mt)] lg:px-[var(--gn-bar-px)] ${tones.bar}`
      } ${tones.text} ${className}`}
    >
      <Scale aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0" strokeWidth={1.6} />
      <div className="min-w-0 text-[14.5px] leading-[1.55] lg:text-[length:var(--gn-bar-label)]">
        {note.title ? <p className="font-semibold">{typeset(note.title)}</p> : null}
        {note.text ? <p className={tones.soft} dangerouslySetInnerHTML={{ __html: typeset(note.text) }} /> : null}
        {note.verdict ? <p className="mt-0.5 font-semibold" dangerouslySetInnerHTML={{ __html: typeset(note.verdict) }} /> : null}
      </div>
    </div>
  );
}

function ComparisonLink({ link, isDark }) {
  const tones = palette(isDark);
  if (!link?.href) return null;
  const label = typeset(link.label).replace(/^Read the full comparison:\s*/i, "").replace(/\s*→\s*$/, "");
  // Some pages only carry an href back to themselves, with no label: no bar then.
  if (!label) return null;
  return (
    <p
      className={`mt-4 flex min-h-[52px] flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border px-4 py-3 text-[15px] lg:mt-[var(--gn-bar-mt)] lg:min-h-[var(--gn-bar-h)] lg:px-[var(--gn-bar-px)] lg:py-0 lg:text-[length:var(--gn-bar-label)] ${tones.bar} ${tones.text}`}
    >
      <BookOpen aria-hidden="true" className="h-6 w-6 shrink-0 lg:h-[var(--gn-bar-icon)] lg:w-[var(--gn-bar-icon)]" strokeWidth={1.5} />
      <span>Read the full comparison:</span>
      <Link
        href={link.href}
        className={`inline-flex items-center gap-3 text-[16px] !font-semibold transition-colors lg:text-[length:var(--gn-bar-link)] ${tones.link}`}
      >
        <span dangerouslySetInnerHTML={{ __html: label }} />
        <ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
      </Link>
    </p>
  );
}

/* ---------- Section ---------- */

export default function GenerationsGrid({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const tones = palette(isDark);
  const title = splitTitle(data.h2);
  const modelName = modelNameFromH2(data.h2);
  // Photos come from the page (one per card, different colours); carImageFor is a fallback.
  const cards = (data.cards || []).map((card) => ({ ...card, image: card.image || carImageFor(card.title, data.h2) }));
  const [lead, ...others] = cards;
  const table = data.rangeTable?.rows?.length ? data.rangeTable : null;
  const note = data.comparisonNote?.text || data.comparisonNote?.verdict ? data.comparisonNote : null;
  const count = others.length;
  // Free slots beside the other cards (row one holds four): the table's intro goes there, or, on pages
  // without a table, the "dividing line" note.
  const freeSlots = count > 0 && count < 4 ? 4 - count : 0;
  const slot = freeSlots ? (table?.intro ? "intro" : !table && note ? "note" : null) : null;
  // A single generation with no table: card 1 becomes one wide card (car | verdict).
  const wideLead = count === 0 && !table;
  // Cards 2..5 in one row above the table: both columns share a bottom edge, as in the reference.
  const shareBottom = count >= 1 && count <= 4 && Boolean(table);

  return (
    <section id="generations" className="model-gens relative overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-[1546px] px-4 pb-12 pt-10 sm:px-6 lg:px-[var(--gn-px)] lg:pb-[var(--gn-pb)] lg:pt-[var(--gn-pt)]">
        <h2 className={`model-gens-title ${tones.text}`}>
          <span className="block" dangerouslySetInnerHTML={{ __html: title.main }} />
          {title.accent ? <span className={`block ${tones.accent}`} dangerouslySetInnerHTML={{ __html: title.accent }} /> : null}
        </h2>

        {data.subHeadline ? (
          <p
            className={`mt-4 max-w-[470px] text-[15px] leading-[1.55] lg:mt-[var(--gn-desc-mt)] lg:max-w-[458px] lg:text-[length:var(--gn-desc)] lg:leading-[var(--gn-desc-lh)] ${tones.soft}`}
            dangerouslySetInnerHTML={{ __html: typeset(data.subHeadline) }}
          />
        ) : null}

        {/* One row of other cards: both columns share a bottom edge (card 1 = table), so the taller right
            column starts a little above card 1, as in the reference. More rows (XJ) or none: tops align. */}
        <div
          className={`mt-5 grid gap-y-5 lg:mt-[var(--gn-lead-gap)] lg:gap-x-[var(--gn-col-gap)] ${
            wideLead ? "" : "lg:grid-cols-[minmax(0,340fr)_minmax(0,1078fr)]"
          } ${shareBottom ? "lg:items-end" : "lg:items-start"}`}
        >
          <div className="min-w-0">
            {lead ? <GenerationCard card={lead} index={0} modelName={modelName} lead wide={wideLead} isDark={isDark} /> : null}
          </div>

          {count || table ? (
          <div className="min-w-0">
            {count ? (
              <div className="md:flex md:gap-3 lg:gap-[var(--gn-card-gap)]">
                {/* Phones: a swipeable row (the next card peeks in). sm: two across; md+: four across. */}
                <div
                  className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 md:shrink-0 md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))] md:[width:calc((100%_-_3*var(--gn-card-gap,12px))/4*var(--cols)_+_(var(--cols)_-_1)*var(--gn-card-gap,12px))] lg:gap-[var(--gn-card-gap)] [&::-webkit-scrollbar]:hidden"
                  style={{ "--cols": Math.min(count, 4) }}
                >
                  {others.map((card, index) => (
                    <div key={`${card.title}-${index}`} className={`flex shrink-0 snap-start sm:w-auto ${count === 1 ? "w-full" : "w-[72%]"}`}>
                      <div className="flex w-full flex-col [&>article]:flex-1">
                        <GenerationCard card={card} index={index + 1} modelName={modelName} isDark={isDark} />
                      </div>
                    </div>
                  ))}
                </div>
                {slot === "intro" ? <TableIntro table={table} isDark={isDark} className="mt-4 md:mt-0 md:flex-1" /> : null}
                {slot === "note" ? <ComparisonNote note={note} isDark={isDark} inSlot className="mt-4 md:mt-0 md:flex-1 md:self-start" /> : null}
              </div>
            ) : table?.intro ? (
              <TableIntro table={table} isDark={isDark} />
            ) : null}

            {table ? (
              <div className={count || table.intro ? "mt-5 lg:mt-[var(--gn-row-gap)]" : ""}>
                <ComparisonTable table={table} isDark={isDark} />
              </div>
            ) : null}
          </div>
          ) : null}
        </div>

        {slot === "note" ? null : <ComparisonNote note={note} isDark={isDark} />}
        <ComparisonLink link={data.comparisonLink} isDark={isDark} />
      </div>
    </section>
  );
}
