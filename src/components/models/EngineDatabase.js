"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronsUpDown, ChevronUp, List, PoundSterling, Star, StarHalf } from "lucide-react";
import { BarChart3, Info, ShieldCheck } from "@/components/models/brandIcons";
import { engineHrefFor } from "@/components/shared/engineLink";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import shared from "@/data/shared/engineDatabase.json";
import { outsideTags, stripTags } from "@/components/models/outsideTags";

/*
 * Model page "Engine Database" (section 5), built from the 1536px brand reference.
 *
 * Desktop (lg+): title + copy on the left, four stat cards on the right; the full engine table (sortable by
 * code, hints on the data columns); a controls row (view all / count / rating legend); the confidence box
 * (ratings | data note) and the verification bar. Sizes come from the --db-* tokens in globals.css.
 * Below lg the table becomes one card per engine (two across on tablets), everything else stacks.
 * Per-model copy: data.engineDatabase in each model JSON; shared labels: src/data/shared/engineDatabase.json.
 */

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replaceAll("â˜…", "★")
    .replaceAll("â˜†", "☆")
    .replaceAll("Â½", "½")
    .replace(/\s*【[^】]*】/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Ranges take an en dash ("148–178 bhp", "2017–Present", "£3,500–£5,800"); " - " separators an em dash.
function typeset(text = "") {
  return outsideTags(cleanText(text), (part) =>
    part
      .replace(/(\d)\s*-\s*(£?\d|Present)/g, "$1–$2")
      .replace(/\s-\s/g, " — "),
  );
}

function splitTitle(title = "") {
  const match = cleanText(title).match(/^(.*?)\s+[-–—]\s+(.*)$/);
  if (!match) return { main: cleanText(title), accent: "" };
  return { main: `${match[1]} —`, accent: match[2] };
}

// "140 [JAG-VERIFIED]" -> { value: "140", tag: "[JAG-VERIFIED]" }; "[PATTERN DATA]" -> { value: "", tag }
function valueAndTag(raw = "") {
  const text = typeset(raw);
  const tags = text.match(/\[[^\]]*\]/g) || [];
  const value = text.replace(/\[[^\]]*\]/g, "").replace(/^[-–—\s]+$/, "").trim();
  return { value, tag: tags.join(" ") };
}

// "★★★☆☆ (pre-2020) / ★★★★☆ (2020+)" -> [{ stars: 3, caption: "(pre-2020)" }, { stars: 4, caption: "(2020+)" }]
// Anything without stars ("🔴 Avoid (oil pump failure)") is kept as text.
function ratingParts(raw = "") {
  return cleanText(raw)
    .split(/\s+\/\s+/)
    .map((part) => {
      const starChars = part.match(/[★☆½]/g) || [];
      if (!starChars.length) return { text: typeset(part) };
      const full = starChars.filter((char) => char === "★").length;
      const half = starChars.includes("½") ? 0.5 : 0;
      const caption = typeset(part.replace(/[★☆½\s]+/g, " ").trim());
      return { stars: Math.min(5, full + half), caption };
    });
}

function fillTemplate(template = "", values = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

/* ---------- Palette ---------- */

function palette(isDark) {
  return isDark
    ? {
        text: "text-white",
        muted: "text-white/[0.68]",
        accent: "bg-[linear-gradient(180deg,#e4e4e1_0%,#9a9a97_100%)] bg-clip-text text-transparent",
        card: "border-white/[0.16] bg-[rgba(14,16,17,0.92)]",
        table: "border-white/[0.2] bg-[#111315]",
        head: "bg-[#16181a]",
        rule: "border-white/[0.1]",
        star: "text-[#ececea]",
        starEmpty: "text-white/[0.28]",
        icon: "text-white",
        circle: "bg-white/[0.08] text-white",
        button: "border-white/[0.2] text-white hover:border-white/[0.45]",
        tip: "border-white/[0.2] bg-[#1b1d1f] text-white/[0.86]",
        link: "text-[#d4d4d2] hover:text-white",
        leaper: "opacity-60 invert",
        badge: "border-white/[0.3] text-white/[0.9]",
        badgeSoft: "border-white/[0.16] text-white/[0.6]",
      }
    : {
        text: "text-[#111210]",
        muted: "text-[#4a4b48]",
        accent: "",
        card: "border-[#e6e6e3] bg-white shadow-[0_6px_20px_rgba(16,18,16,0.05)]",
        table: "border-[#e6e6e3] bg-white shadow-[0_6px_20px_rgba(16,18,16,0.04)]",
        head: "bg-white",
        rule: "border-[#ededeb]",
        star: "text-[#2a2b29]",
        starEmpty: "text-[#d3d3d0]",
        icon: "text-[#2a2b29]",
        circle: "bg-[#efefed] text-[#111210]",
        button: "border-[#dcdcda] text-[#111210] hover:border-[#9b9c97]",
        tip: "border-[#e2e2df] bg-white text-[#2a2b29] shadow-[0_10px_28px_rgba(16,18,16,0.12)]",
        link: "text-[#111210] hover:text-[#4a4b48]",
        leaper: "opacity-80",
        badge: "border-[#cfd0cc] bg-[#f6f6f4] text-[#2a2b29]",
        badgeSoft: "border-[#e2e2df] text-[#6a6b67]",
      };
}

/* ---------- Small pieces ---------- */

function Stars({ value, tones, size = "h-[14px] w-[14px] lg:h-[var(--db-star)] lg:w-[var(--db-star)]" }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className={`inline-flex items-center gap-[3px] ${tones.star}`} role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        if (index < full) return <Star key={index} aria-hidden="true" className={`${size} fill-current`} strokeWidth={1.2} />;
        if (index === full && half) {
          return (
            <span key={index} className={`relative ${size}`}>
              <Star aria-hidden="true" className={`absolute inset-0 h-full w-full fill-current ${tones.starEmpty}`} strokeWidth={0} />
              <StarHalf aria-hidden="true" className="absolute inset-0 h-full w-full fill-current" strokeWidth={1.2} />
            </span>
          );
        }
        return <Star key={index} aria-hidden="true" className={`${size} fill-current ${tones.starEmpty}`} strokeWidth={0} />;
      })}
    </span>
  );
}

function Reliability({ raw, tones, align = "center" }) {
  const parts = ratingParts(raw);
  return (
    <span className={`flex flex-col gap-1.5 ${align === "center" ? "items-center text-center" : "items-start"}`}>
      {parts.map((part, index) =>
        part.text ? (
          <span key={index} className="font-semibold text-[#d42a2a]" dangerouslySetInnerHTML={{ __html: part.text }} />
        ) : (
          <span key={index} className={`flex flex-col gap-0.5 ${align === "center" ? "items-center" : "items-start"}`}>
            <Stars value={part.stars} tones={tones} />
            {part.caption ? (
              <span className="text-[12px] leading-tight lg:text-[length:var(--db-tag)]" dangerouslySetInnerHTML={{ __html: part.caption }} />
            ) : null}
          </span>
        ),
      )}
    </span>
  );
}

// Source tags as short, readable badges (the raw "[JAG-VERIFIED]" style reads as internal markup).
const TAG_LABELS = [
  [/JAG-VERIFIED|BMW-VERIFIED/i, "Verified", "verified"],
  [/JAG-QUOTE|BMW-QUOTE/i, "Specialist quote", "quote"],
  [/PATTERN DATA/i, "Pattern data", "pattern"],
  [/THIRD-PARTY/i, "Third-party", "pattern"],
];

function SourceBadge({ tag, tones }) {
  const match = TAG_LABELS.find(([pattern]) => pattern.test(tag));
  if (!match) return null;
  const [, label, kind] = match;
  return (
    <span
      className={`mt-1 inline-flex w-fit items-center gap-1 rounded-full border px-2 py-[1px] text-[11px] font-medium leading-[1.5] lg:text-[length:calc(var(--db-tag)*0.9)] ${
        kind === "pattern" ? tones.badgeSoft : tones.badge
      }`}
    >
      {kind === "verified" ? <ShieldCheck aria-hidden="true" className="h-3 w-3" strokeWidth={2} /> : null}
      {label}
    </span>
  );
}

// Value with its source badge underneath. No value: an em dash (enquiries) or, for a cost we have not
// confirmed yet, a "Quote on request" link instead of the placeholder.
function Tagged({ raw, tones, kind }) {
  const { value, tag } = valueAndTag(raw);
  const placeholder = /PLACEHOLDER/i.test(tag);
  if (kind === "cost" && !value && placeholder) {
    return (
      <Link href="/quote" className={`inline-flex items-center gap-1.5 text-[13.5px] !font-semibold underline-offset-2 hover:underline lg:text-[length:var(--db-cell)] ${tones.text}`}>
        Quote on request
        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
      </Link>
    );
  }
  return (
    <span className="flex flex-col items-start">
      <span className="text-[14.5px] lg:text-[length:calc(var(--db-cell)*1.05)]" dangerouslySetInnerHTML={{ __html: value || "\u2014" }} />
      {tag && !placeholder ? <SourceBadge tag={tag} tones={tones} /> : null}
    </span>
  );
}

// Info icon with a hint that opens on hover, focus or tap.
function Hint({ text, tones, label }) {
  if (!text) return null;
  return (
    <span className="group relative inline-flex">
      <button type="button" aria-label={`About ${label}`} className="inline-flex rounded-full outline-offset-2">
        <Info aria-hidden="true" className="h-[15px] w-[15px]" strokeWidth={1.8} />
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none invisible absolute right-0 top-full z-20 mt-2 w-[250px] rounded-lg border px-3 py-2 text-left text-[12.5px] font-normal leading-[1.45] opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${tones.tip}`}
      >
        {text}
      </span>
    </span>
  );
}

const STAT_ICONS = {
  engine: (tones) => <HomeIcon name="engine" isDark={tones.text === "text-white"} className="h-full w-full" />,
  shield: () => <ShieldCheck aria-hidden="true" className="h-full w-full" strokeWidth={1.6} />,
  chart: () => <BarChart3 aria-hidden="true" className="h-full w-full" strokeWidth={1.6} />,
  pound: () => <PoundSterling aria-hidden="true" className="h-full w-full rounded-full border-[1.6px] border-current p-[18%]" strokeWidth={2} />,
};

function StatCard({ stat, tones }) {
  const Icon = STAT_ICONS[stat.icon] || STAT_ICONS.chart;
  return (
    <li className={`flex flex-col items-start gap-2.5 rounded-xl border px-4 py-4 sm:flex-row sm:items-center sm:gap-3 lg:min-h-[var(--db-stat-h)] lg:gap-[var(--db-stat-icon-gap)] lg:px-[var(--db-stat-px)] lg:py-0 ${tones.card} ${tones.text}`}>
      <span className={`h-9 w-9 shrink-0 lg:h-[var(--db-stat-icon)] lg:w-[var(--db-stat-icon)] ${tones.icon}`}>{Icon(tones)}</span>
      <div className="min-w-0">
        <p className="text-[20px] font-semibold sm:whitespace-nowrap sm:text-[21px] leading-tight tracking-[-0.01em] lg:text-[length:var(--db-stat-value)]">{stat.value}</p>
        <p className="mt-1 text-[13px] leading-[1.35] lg:max-w-[9.5em] lg:text-[length:var(--db-stat-label)] lg:leading-[var(--db-stat-lh)]">{stat.label}</p>
      </div>
    </li>
  );
}

/* ---------- Table (lg+) ---------- */

// Reference column widths (px at 1536), in data order: code, family, fuel, disp., power, years, gen., reliability,
// enquiries, cost.
const WIDTHS = [171, 187, 108, 97, 130, 130, 101, 165, 195, 192];
const FIELDS = ["engineCode", "family", "fuel", "displacement", "power", "years", "model", "reliability", "enquiries", "avgRebuildCost"];

function EngineTable({ rows, columns, tones, sort, onSort }) {
  const total = WIDTHS.reduce((sum, width) => sum + width, 0);
  const cell = "px-2 py-3 text-[13px] leading-[1.4] lg:px-[var(--db-cell-px)] lg:py-[var(--db-cell-py)] lg:text-[length:var(--db-cell)] lg:leading-[var(--db-cell-lh)]";

  return (
    <div className={`hidden overflow-hidden rounded-xl border lg:block ${tones.table} ${tones.text}`}>
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          {WIDTHS.map((width, index) => (
            <col key={index} style={{ width: `${(width / total) * 100}%` }} />
          ))}
        </colgroup>
        <thead>
          <tr className={`border-b ${tones.rule} ${tones.head}`}>
            {columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                aria-sort={index === 0 && sort ? (sort === "asc" ? "ascending" : "descending") : undefined}
                className={`h-[var(--db-th-h)] px-2 text-[13px] font-semibold lg:px-[var(--db-cell-px)] lg:text-[length:var(--db-th)] ${index > 0 ? `border-l text-center ${tones.rule}` : "text-left"}`}
              >
                {index === 0 ? (
                  <button type="button" onClick={onSort} className="flex w-full items-center justify-between gap-2 text-left font-semibold">
                    {column}
                    {sort === "asc" ? (
                      <ChevronUp aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                    ) : sort === "desc" ? (
                      <ChevronDown aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <ChevronsUpDown aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                    )}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    {column}
                    <Hint text={shared.columnHints[column]} tones={tones} label={column} />
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((engine) => (
            <tr key={engine.engineCode} className={`border-t ${tones.rule}`}>
              {FIELDS.map((field, index) => {
                const value = engine[field];
                const base = `${cell} ${index > 0 ? `border-l ${tones.rule}` : ""}`;
                if (index === 0) {
                  return (
                    <th key={field} scope="row" className={`${base} text-left font-medium`}>
                      <Link href={engineHrefFor(engine.engineCode, engine.family)} className="engine-code-weight font-medium hover:underline hover:underline-offset-2">{stripTags(typeset(value))}</Link>
                    </th>
                  );
                }
                if (field === "reliability") return <td key={field} className={base}><Reliability raw={value} tones={tones} /></td>;
                if (field === "enquiries" || field === "avgRebuildCost") {
                  return (
                    <td key={field} className={`${base} lg:pl-[calc(var(--db-cell-px)*1.35)]`}>
                      <Tagged raw={value} tones={tones} kind={field === "avgRebuildCost" ? "cost" : "enquiries"} />
                    </td>
                  );
                }
                return <td key={field} className={`${base} text-center`} dangerouslySetInnerHTML={{ __html: typeset(value) }} />;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Cards (phones / tablets) ---------- */

function EngineCard({ engine, columns, tones }) {
  const label = (field) => columns[FIELDS.indexOf(field)] || field;
  const specs = ["fuel", "displacement", "power", "years", "model"];
  return (
    <li className={`rounded-xl border p-4 ${tones.card} ${tones.text}`}>
      <Link href={engineHrefFor(engine.engineCode, engine.family)} className="engine-code-weight text-[16.5px] font-medium leading-tight">{stripTags(typeset(engine.engineCode))}</Link>
      <p className={`mt-0.5 text-[13.5px] ${tones.muted}`} dangerouslySetInnerHTML={{ __html: typeset(engine.family) }} />
      <dl className={`mt-3 grid grid-cols-3 gap-x-3 gap-y-2.5 border-t pt-3 text-[13px] ${tones.rule}`}>
        {specs.map((field) => (
          <div key={field} className="min-w-0">
            <dt className={`text-[11.5px] ${tones.muted}`}>{label(field)}</dt>
            <dd className="font-medium leading-snug" dangerouslySetInnerHTML={{ __html: typeset(engine[field]) }} />
          </div>
        ))}
      </dl>
      <dl className={`mt-3 grid grid-cols-2 gap-x-3 gap-y-3 border-t pt-3 text-[13px] ${tones.rule}`}>
        <div className="col-span-2 min-w-0">
          <dt className={`mb-1 text-[11.5px] ${tones.muted}`}>{label("reliability")}</dt>
          <dd className="flex"><Reliability raw={engine.reliability} tones={tones} align="start" /></dd>
        </div>
        <div className="min-w-0">
          <dt className={`mb-1 text-[11.5px] ${tones.muted}`}>{label("enquiries")}</dt>
          <dd className="leading-snug"><Tagged raw={engine.enquiries} tones={tones} kind="enquiries" /></dd>
        </div>
        <div className="min-w-0">
          <dt className={`mb-1 text-[11.5px] ${tones.muted}`}>{label("avgRebuildCost")}</dt>
          <dd className="leading-snug"><Tagged raw={engine.avgRebuildCost} tones={tones} kind="cost" /></dd>
        </div>
      </dl>
    </li>
  );
}

/* ---------- Controls, confidence box, verification bar ---------- */

function Legend({ tones }) {
  return (
    <ul className={`grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl border px-4 py-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between lg:min-h-[var(--db-ctrl-h)] lg:py-0 ${tones.card} ${tones.text}`}>
      {shared.legend.map((item) => (
        <li key={item.label} className="flex items-center gap-2.5 text-[13px] lg:text-[length:var(--db-legend)]">
          <Stars value={item.stars} tones={tones} size="h-[12px] w-[12px] lg:h-[var(--db-legend-star)] lg:w-[var(--db-legend-star)]" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function ConfidenceBox({ score, tones }) {
  const paragraphs = score?.paragraphs || [];
  const note = score?.dataNote;
  if (!paragraphs.length && !note?.text) return null;
  return (
    <div
      className={`mt-3 grid gap-5 rounded-xl border px-4 py-4 lg:mt-[var(--db-row-gap)] lg:grid-cols-[minmax(0,820fr)_minmax(0,656fr)] lg:gap-0 lg:px-[var(--db-box-px)] lg:py-[var(--db-box-py)] ${tones.card} ${tones.text}`}
    >
      {paragraphs.length ? (
        <div className="flex gap-3.5 lg:gap-[calc(var(--db-box-px)*0.9)] lg:pr-[calc(var(--db-box-px)*1.6)]">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[17px] font-bold lg:h-[var(--db-i)] lg:w-[var(--db-i)] ${tones.circle}`}>i</span>
          <div className="min-w-0">
            {score.title ? <h3 className="text-[15.5px] font-semibold lg:text-[length:var(--db-box-head)]">{cleanText(score.title)}</h3> : null}
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className={`mt-1 text-[13.5px] leading-[1.5] lg:text-[length:var(--db-box)] lg:leading-[var(--db-box-lh)] ${tones.muted}`}
                dangerouslySetInnerHTML={{ __html: typeset(paragraph) }}
              />
            ))}
          </div>
        </div>
      ) : null}
      {note?.text ? (
        <div className={`flex items-center gap-4 border-t pt-4 lg:border-l lg:border-t-0 lg:pl-[calc(var(--db-box-px)*2.5)] lg:pt-0 ${tones.rule}`}>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold lg:text-[length:calc(var(--db-box-head)*0.97)]">{cleanText(note.title)}</h3>
            <p className={`mt-1.5 text-[13.5px] leading-[1.55] lg:text-[length:var(--db-box)] lg:leading-[calc(var(--db-box-lh)*1.08)] ${tones.muted}`} dangerouslySetInnerHTML={{ __html: typeset(note.text) }} />
          </div>
          <Image src="/model/engines/leaper-line.webp" alt="" width={327} height={132} className={`hidden h-auto w-[105px] shrink-0 sm:block ${tones.leaper}`} />
        </div>
      ) : null}
    </div>
  );
}

function VerificationBar({ lines = [], link, tones }) {
  if (!lines.length && !link?.href) return null;
  return (
    <div
      className={`mt-3 flex flex-col gap-3 rounded-xl border px-4 py-4 lg:mt-[var(--db-row-gap)] lg:min-h-[var(--db-bar-h)] lg:flex-row lg:items-center lg:gap-0 lg:px-[var(--db-box-px)] lg:py-2 ${tones.card} ${tones.text}`}
    >
      {lines.length ? (
        <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-[calc(var(--db-box-px)*1.2)]">
          <ShieldCheck aria-hidden="true" className="h-8 w-8 shrink-0" strokeWidth={1.5} />
          <div className={`min-w-0 text-[13px] leading-[1.5] lg:text-[length:var(--db-box)] lg:leading-[var(--db-box-lh)] ${tones.muted}`}>
            {lines.map((line) => (
              <p key={line.slice(0, 40)} dangerouslySetInnerHTML={{ __html: typeset(line) }} />
            ))}
          </div>
        </div>
      ) : null}
      {link?.href ? (
        <Link
          href={link.href}
          className={`inline-flex shrink-0 items-center gap-3 text-[15px] !font-medium transition-colors lg:ml-auto lg:min-h-[44px] lg:border-l lg:pl-[calc(var(--db-box-px)*2.3)] lg:pr-[calc(var(--db-box-px)*0.6)] lg:text-[length:var(--db-bar-link)] ${tones.rule} ${tones.link}`}
        >
          {cleanText(link.label)}
          <ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
        </Link>
      ) : null}
    </div>
  );
}

/* ---------- Section ---------- */

export default function EngineDatabase({ data }) {
  const { theme } = useTheme();
  const [sort, setSort] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const engines = useMemo(() => data?.engines || [], [data]);
  const sorted = useMemo(() => {
    if (!sort) return engines;
    const list = [...engines].sort((a, b) => cleanText(a.engineCode).localeCompare(cleanText(b.engineCode)));
    return sort === "desc" ? list.reverse() : list;
  }, [engines, sort]);
  if (!data || !engines.length) return null;

  const isDark = theme === "dark";
  const tones = palette(isDark);
  const title = splitTitle(data.h2);
  const columns = data.columns?.length === FIELDS.length ? data.columns : FIELDS;
  const limit = shared.visibleRows;
  const rows = showAll ? sorted : sorted.slice(0, limit);
  const count = engines.length;

  return (
    <section id="engine-database" className="model-db relative overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-[1546px] px-4 pb-12 pt-10 sm:px-6 lg:px-[var(--db-px)] lg:pb-[var(--db-pb)] lg:pt-[var(--db-pt)]">
        {/* Header: copy left, stat cards right (reference: 544 | 911 at 1536px) */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,544fr)_minmax(0,911fr)] lg:items-start lg:gap-[var(--db-head-gap)]">
          <div className="lg:pt-[calc(var(--db-title)*0.2)]">
            <h2 className={`model-db-title ${tones.text}`}>
              <span className="block" dangerouslySetInnerHTML={{ __html: title.main }} />
              {title.accent ? <span className={`block ${tones.accent}`} dangerouslySetInnerHTML={{ __html: title.accent }} /> : null}
            </h2>
            {data.subHeadline ? (
              <p
                className={`mt-3 max-w-[460px] text-[15px] leading-[1.6] lg:mt-[var(--db-desc-mt)] lg:max-w-[450px] lg:text-[length:var(--db-desc)] lg:leading-[var(--db-desc-lh)] ${tones.text}`}
                dangerouslySetInnerHTML={{ __html: typeset(data.subHeadline) }}
              />
            ) : null}
          </div>
          {data.stats?.length ? (
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,209fr)_minmax(0,201fr)_minmax(0,206fr)_minmax(0,234fr)] lg:gap-[var(--db-stat-gap)]">
              {data.stats.map((stat) => (
                <StatCard key={stat.label} stat={stat} tones={tones} />
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-6 lg:mt-[var(--db-table-mt)]">
          <EngineTable rows={rows} columns={columns} tones={tones} sort={sort} onSort={() => setSort((value) => (value === null ? "asc" : value === "asc" ? "desc" : null))} />
          <ul className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {rows.map((engine) => (
              <EngineCard key={engine.engineCode} engine={engine} columns={columns} tones={tones} />
            ))}
          </ul>
        </div>

        {/* View all / count / rating legend */}
        <div className="mt-3 grid gap-3 lg:mt-[var(--db-row-gap)] xl:grid-cols-[minmax(0,795fr)_minmax(0,681fr)] xl:gap-[var(--db-head-gap)]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {count > limit ? (
              <button
                type="button"
                onClick={() => setShowAll((value) => !value)}
                aria-expanded={showAll}
                className={`flex min-h-[44px] items-center gap-3 rounded-lg border px-4 text-[14.5px] font-medium lg:min-h-[var(--db-ctrl-h)] lg:min-w-[267px] lg:text-[length:var(--db-ctrl)] ${tones.button} ${tones.card}`}
              >
                <List aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.7} />
                <span className="flex-1 text-left">{fillTemplate(showAll ? shared.viewLessLabel : shared.viewAllLabel, { count })}</span>
                {showAll ? <ChevronUp aria-hidden="true" className="h-4 w-4" strokeWidth={2} /> : <ChevronDown aria-hidden="true" className="h-4 w-4" strokeWidth={2} />}
              </button>
            ) : null}
            <p className={`text-[14px] lg:text-[length:calc(var(--db-ctrl)*0.97)] ${tones.text}`}>{fillTemplate(shared.showingLabel, { shown: rows.length, count })}</p>
          </div>
          <Legend tones={tones} />
        </div>

        <ConfidenceBox score={data.confidenceScore} tones={tones} />
        <VerificationBar lines={data.confidenceScore?.verification} link={data.methodologyLink} tones={tones} />
      </div>
    </section>
  );
}
