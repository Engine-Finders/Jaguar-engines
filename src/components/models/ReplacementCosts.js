"use client";

import Image from "next/image";
import { ArrowRight, PoundSterling } from "lucide-react";
import { BarChart3, Clock3, FileText, Settings, ShieldCheck, Wrench } from "@/components/models/brandIcons";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import OpenQuoteButton from "@/components/shared/OpenQuoteButton";
import { carImageFor } from "@/components/shared/carImage";
import { outsideTags } from "@/components/models/outsideTags";
import shared from "@/data/shared/replacementCosts.json";

/*
 * Model page "Replacement Costs - By Generation" (section 8), built from the 1536px reference.
 *
 * Header: title (second line in the silver accent) + copy, the four-item trust strip on the right. Then one
 * group per generation / engine table: a car card (name, years, cut-out car) joined to a cost table with a
 * black header. Then Important Notes | Labour Estimate | the model's "rule" box, and the source footnote.
 * Sizes come from the --rc-* tokens in globals.css. Below lg each group stacks (car card above) and on
 * phones every row becomes a small price card. Shared copy: src/data/shared/replacementCosts.json.
 */

const FIELDS = ["model", "engineCode", "usedSupply", "reconditionedSupply", "rebuiltSupply", "labourHours"];
// Reference column widths at 1536px (Variant, Engine Code, Used, Reconditioned, Rebuilt, Labour Hours).
const WIDTHS = [210, 179, 195, 222, 199, 173];

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replace(/\s+/g, " ")
    .trim();
}

// Ranges take a spaced en dash ("£1,800 – £3,200", "10 – 14 hrs", "2017 – Present"), as in the reference.
function typeset(text = "") {
  return outsideTags(cleanText(text), (part) =>
    part.replace(/(\d)\s*-\s*(£?\d|Present)/g, "$1 – $2").replace(/\s-\s/g, " — "),
  );
}

function splitTitle(title = "") {
  const match = cleanText(title).match(/^(.*?)\s+[-–—]\s+(.*)$/);
  return match ? { main: `${match[1]} —`, accent: match[2] } : { main: cleanText(title), accent: "" };
}

// "E-Pace X540 (2017-Present)" + "All Engines" -> name "E-Pace X540", years "2017 – Present", note "(All Engines)"
// "2.0 Diesel (pre-2020)" + "2017-2020"      -> name "2.0 Diesel (pre-2020)", years "2017 – 2020"
function cardLabel(table) {
  const title = cleanText(table.title);
  const parens = title.match(/^(.*?)\s*\((\d{4}\s*-\s*(?:\d{4}|Present))\)\s*(?:[-–—]\s*(.*))?$/i);
  const subtitle = cleanText(table.subtitle);
  if (parens) {
    return { name: parens[1], years: typeset(parens[2]), note: [parens[3], subtitle].filter(Boolean).map((part) => `(${part})`).join(" ") };
  }
  return { name: title, years: /\d{4}/.test(subtitle) ? typeset(subtitle) : "", note: subtitle && !/\d{4}/.test(subtitle) ? `(${subtitle})` : "" };
}

// A price we have not confirmed yet carries a [PLACEHOLDER …] tag: show the figure as an estimate.
function cellParts(value = "") {
  const text = cleanText(value);
  const estimate = /PLACEHOLDER/i.test(text);
  return { text: typeset(text.replace(/\s*\[[^\]]*\]/g, "")), estimate };
}

// Small source tags ("[THIRD-PARTY]", "[JAG-QUOTE]") set in small caps, as in the reference.
function withTags(html = "") {
  return typeset(html).replace(/\[([A-Z][A-Z‑-]+)\]/g, '<span class="whitespace-nowrap text-[0.82em] tracking-[0.02em] opacity-80">[$1]</span>');
}

// Engine codes in the rule text set in bold (as the reference does for "diesel AJ200D", "pre-2020").
function boldCodes(html = "", strongClass = "") {
  return outsideTags(html, (part) => part.replace(/\b(AJ[\dA-Z-]+|pre-20\d\d|\d{3}[A-Z]{2,3})\b/g, `<strong class="${strongClass}">$1</strong>`));
}

function palette(isDark) {
  return isDark
    ? {
        text: "text-white",
        muted: "text-white/[0.72]",
        accent: "bg-[linear-gradient(180deg,#e4e4e1_0%,#9a9a97_100%)] bg-clip-text text-transparent",
        card: "border-white/[0.16] bg-[rgba(14,16,17,0.92)]",
        head: "bg-[#2a2b2c] text-white",
        rule: "border-white/[0.1]",
        badge: "border-white/[0.2] text-white/[0.75]",
        ruleBox: "border-white/[0.32] bg-[linear-gradient(135deg,#17191a_0%,#101112_100%)]",
        ruleAccent: "text-[#e4e4e1]",
        ruleBar: "bg-white/50",
        mark: "text-white/[0.2]",
        strong: "font-semibold text-white",
      }
    : {
        text: "text-[#111210]",
        muted: "text-[#3d3e3b]",
        accent: "bg-[linear-gradient(180deg,#8a8b87_0%,#6b6c68_100%)] bg-clip-text text-transparent",
        card: "border-[#e8e8e5] bg-white shadow-[0_6px_20px_rgba(16,18,16,0.05)]",
        head: "bg-[#1a1b1a] text-white",
        rule: "border-[#ececea]",
        badge: "border-[#dcdcda] text-[#6a6b67]",
        ruleBox: "border-[#b5b6b1] bg-[linear-gradient(135deg,#ffffff_0%,#f4f4f2_100%)] shadow-[0_6px_20px_rgba(16,18,16,0.06)]",
        ruleAccent: "text-[#111210]",
        ruleBar: "bg-[#9b9c97]",
        mark: "text-[#c9cac6]",
        strong: "font-semibold text-[#111210]",
      };
}

/* ---------- Header ---------- */

const TRUST_ICONS = {
  pound: () => <PoundSterling aria-hidden="true" className="h-[52%] w-[52%]" strokeWidth={2} />,
  cog: () => <Settings aria-hidden="true" className="h-full w-full" strokeWidth={1.5} />,
  wrench: () => <Wrench aria-hidden="true" className="h-full w-full" strokeWidth={1.5} />,
  check: () => <ShieldCheck aria-hidden="true" className="h-full w-full" strokeWidth={1.5} />,
};

function TrustStrip({ tones }) {
  return (
    <ul
      className={`grid grid-cols-2 rounded-xl border sm:grid-cols-4 lg:min-h-[var(--rc-trust-h)] xl:w-[var(--rc-trust-w)] xl:shrink-0 ${tones.card} ${tones.text}`}
    >
      {shared.trust.map((item, index) => {
        const Icon = TRUST_ICONS[item.icon] || TRUST_ICONS.check;
        return (
          <li
            key={item.title}
            className={`flex flex-col items-center justify-center px-2 py-4 text-center even:border-l [&:nth-child(n+3)]:border-t sm:[&:nth-child(n+3)]:border-t-0 sm:[&:not(:first-child)]:border-l ${tones.rule}`}
          >
            <span className="relative flex h-10 w-10 items-center justify-center lg:h-[var(--rc-trust-icon)] lg:w-[var(--rc-trust-icon)]">
              {item.icon === "pound" ? (
                // £ inside a shield outline, as in the reference
                <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute inset-0 h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                  <path d="M12 2.5 4.5 5.5v5.8c0 4.6 3.1 8.6 7.5 10.2 4.4-1.6 7.5-5.6 7.5-10.2V5.5L12 2.5Z" />
                </svg>
              ) : null}
              <Icon />
            </span>
            <p className="mt-2.5 text-[13.5px] font-semibold leading-tight lg:text-[length:var(--rc-trust-title)]">{item.title}</p>
            <p className={`mt-1 text-[12.5px] leading-tight lg:text-[length:var(--rc-trust-text)] ${tones.muted}`}>{item.text}</p>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Cost groups ---------- */

function CarCard({ table, tones }) {
  const label = cardLabel(table);
  return (
    <div className="relative grid min-h-[118px] grid-cols-[minmax(0,1fr)_46%] items-end gap-x-2 px-4 pt-3.5 sm:min-h-[132px] lg:flex lg:min-h-[150px] lg:flex-col lg:items-stretch lg:px-[var(--rc-card-px)] lg:pt-[calc(var(--rc-card-px)*0.8)]">
      <div className="self-start pb-3 lg:pb-0">
      <h3 className="text-[18px] font-medium leading-tight tracking-[-0.005em] lg:text-[length:var(--rc-card-label)]" dangerouslySetInnerHTML={{ __html: typeset(label.name) }} />
      {label.years ? <p className="mt-1 text-[13px] lg:text-[length:var(--rc-card-years)]">{label.years}</p> : null}
      {label.note ? <p className="text-[13px] lg:text-[length:var(--rc-card-years)]">{label.note}</p> : null}
      </div>
      {table.image ? (
        // The generation's cut-out car, bottom-right of the card with a soft contact shadow.
        <div className="relative ml-auto mt-auto h-[92px] w-full sm:h-[108px] lg:-mt-6 lg:h-[clamp(84px,7vw,106px)] lg:w-[82%]">
          <div aria-hidden="true" className="absolute inset-x-[12%] bottom-[4%] h-[12%] rounded-[50%] bg-black/25 blur-md" />
          <Image src={table.image} alt="" fill sizes="(min-width: 1024px) 230px, 60vw" className="object-contain object-bottom" />
        </div>
      ) : (
        <div className="pb-4" />
      )}
    </div>
  );
}

function PriceText({ value, tones }) {
  const { text, estimate } = cellParts(value);
  return (
    <span className="inline-flex flex-col items-start">
      <span dangerouslySetInnerHTML={{ __html: text || "—" }} />
      {estimate ? <span className={`mt-1 rounded-full border px-1.5 text-[10.5px] font-medium leading-[1.5] ${tones.badge}`}>{shared.estimateLabel}</span> : null}
    </span>
  );
}

function CostTable({ table, tones }) {
  const columns = table.columns?.length === FIELDS.length ? table.columns : ["Variant", "Engine Code", "Used (Supply)", "Reconditioned (Supply)", "Rebuilt (Supply)", "Labour Hours"];
  const total = WIDTHS.reduce((sum, width) => sum + width, 0);
  return (
    <table className="hidden h-full w-full table-fixed border-collapse md:table">
      <colgroup>
        {WIDTHS.map((width, index) => (
          <col key={index} style={{ width: `${(width / total) * 100}%` }} />
        ))}
      </colgroup>
      <thead>
        <tr className={tones.head}>
          {columns.map((column, index) => (
            <th
              key={column}
              scope="col"
              className={`h-[34px] px-3 text-[12.5px] font-medium lg:h-[var(--rc-th-h)] lg:px-[var(--rc-cell-px)] lg:text-[length:var(--rc-th)] ${index === 0 ? "text-left" : "border-l border-white/[0.18] text-center"}`}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, rowIndex) => (
          <tr key={`${row.model}-${rowIndex}`} className={rowIndex > 0 ? `border-t ${tones.rule}` : ""}>
            {FIELDS.map((field, index) => (
              <td
                key={field}
                className={`px-3 py-2 text-[13px] leading-snug lg:h-[var(--rc-row-min)] lg:px-[var(--rc-cell-px)] lg:text-[length:var(--rc-cell)] ${
                  index === 0 ? "font-medium" : `text-center ${index === 1 ? `border-l ${tones.rule}` : ""}`
                }`}
              >
                {index >= 2 && index <= 4 ? <PriceText value={row[field]} tones={tones} /> : <span dangerouslySetInnerHTML={{ __html: typeset(row[field]) }} />}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Phones: one small card per variant (prices in a 3-up grid, labour underneath).
function CostCards({ table, tones }) {
  const columns = table.columns?.length === FIELDS.length ? table.columns : [];
  return (
    <ul className={`border-t md:hidden ${tones.rule}`}>
      {table.rows.map((row, rowIndex) => (
        <li key={`${row.model}-${rowIndex}`} className={`px-4 py-3.5 ${rowIndex > 0 ? `border-t ${tones.rule}` : ""}`}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[15px] font-semibold leading-snug" dangerouslySetInnerHTML={{ __html: typeset(row.model) }} />
            <p className={`shrink-0 text-[12.5px] ${tones.muted}`} dangerouslySetInnerHTML={{ __html: typeset(row.engineCode) }} />
          </div>
          <dl className="mt-2.5 grid grid-cols-3 gap-2 text-[13px]">
            {["usedSupply", "reconditionedSupply", "rebuiltSupply"].map((field) => (
              <div key={field} className="min-w-0">
                <dt className={`text-[11px] leading-tight ${tones.muted}`}>{(columns[FIELDS.indexOf(field)] || field).replace(/\s*\(Supply\)/, "")}</dt>
                <dd className="mt-0.5 font-medium leading-snug">
                  <PriceText value={row[field]} tones={tones} />
                </dd>
              </div>
            ))}
          </dl>
          <p className={`mt-2 text-[12.5px] ${tones.muted}`}>
            {columns[5] || "Labour Hours"}: <span className={tones.text} dangerouslySetInnerHTML={{ __html: typeset(row.labourHours) }} />
          </p>
        </li>
      ))}
    </ul>
  );
}

function CostGroup({ table, tones }) {
  return (
    <article
      className={`grid overflow-hidden rounded-xl border lg:grid-cols-[var(--rc-card-w)_minmax(0,1fr)] ${tones.card} ${tones.text}`}
    >
      <CarCard table={table} tones={tones} />
      <div className={`min-w-0 lg:border-l ${tones.rule}`}>
        <CostTable table={table} tones={tones} />
        <CostCards table={table} tones={tones} />
      </div>
    </article>
  );
}

/* ---------- Notes ---------- */

function Note({ icon: Icon, title, html, tones }) {
  if (!html) return null;
  return (
    <div className={`flex gap-3.5 rounded-xl border px-4 py-4 lg:px-[var(--rc-note-px)] lg:py-[var(--rc-note-py)] ${tones.card} ${tones.text}`}>
      <Icon aria-hidden="true" className="h-8 w-8 shrink-0 lg:h-[var(--rc-note-icon)] lg:w-[var(--rc-note-icon)]" strokeWidth={1.4} />
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold lg:text-[length:var(--rc-note-head)]">{title}</h3>
        <p className={`mt-1.5 text-[13px] leading-[1.6] lg:text-[length:var(--rc-note)] lg:leading-[var(--rc-note-lh)] ${tones.muted}`} dangerouslySetInnerHTML={{ __html: withTags(html) }} />
      </div>
    </div>
  );
}

function RuleBox({ rule, tones, isDark }) {
  if (!rule?.title) return null;
  const [first, ...rest] = rule.paragraphs || [];
  return (
    <div className={`relative flex gap-4 overflow-hidden rounded-xl border px-4 py-4 lg:gap-[calc(var(--rc-note-px)*1.1)] lg:px-[calc(var(--rc-note-px)*1.2)] lg:py-[var(--rc-note-py)] ${tones.ruleBox} ${tones.text}`}>
      <HomeIcon name="crown" isDark={isDark} className="mt-1 hidden h-[clamp(40px,3.6vw,56px)] w-[clamp(40px,3.6vw,56px)] shrink-0 sm:inline-flex" />
      <div className="min-w-0 flex-1">
        <h3 className={`text-[16px] font-semibold leading-snug lg:text-[length:var(--rc-rule-title)] ${tones.ruleAccent}`} dangerouslySetInnerHTML={{ __html: typeset(rule.title) }} />
        {first ? (
          <p className={`mt-1.5 text-[13px] leading-[1.6] lg:text-[length:var(--rc-note)] lg:leading-[var(--rc-note-lh)] ${tones.muted}`} dangerouslySetInnerHTML={{ __html: withTags(first) }} />
        ) : null}
        {rest.length ? (
          <p
            className={`mt-3 border-l-2 pl-3.5 text-[13px] leading-[1.6] lg:mt-[calc(var(--rc-note-py)*0.9)] lg:text-[length:var(--rc-note)] lg:leading-[var(--rc-note-lh)] ${tones.muted}`}
            style={{ borderColor: "currentColor" }}
            dangerouslySetInnerHTML={{ __html: boldCodes(withTags(rest.join(" ")), tones.strong) }}
          />
        ) : null}
      </div>
      {/* Decorative shield with bars (reference), in the site's silver */}
      <span aria-hidden="true" className={`relative hidden h-[var(--rc-rule-mark)] w-[calc(var(--rc-rule-mark)*0.9)] shrink-0 self-center xl:block ${tones.mark}`}>
        <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
          <path d="M12 2 4 5v6.3c0 5 3.4 9.3 8 10.7 4.6-1.4 8-5.7 8-10.7V5l-8-3Z" />
        </svg>
        <BarChart3 className="absolute left-1/2 top-[45%] h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2" strokeWidth={2.6} />
      </span>
    </div>
  );
}

/* ---------- Section ---------- */

export default function ReplacementCosts({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const tones = palette(isDark);
  const title = splitTitle(data.h2);
  const tables = (data.tables || [])
    .filter((table) => table.rows?.length)
    .map((table) => ({ ...table, image: table.image || carImageFor(table.title, data.h2) }));

  return (
    <section id="replacement-costs" className="model-costs relative overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-[1546px] px-4 pb-12 pt-10 sm:px-6 lg:px-[var(--rc-px)] lg:pb-[var(--rc-pb)] lg:pt-[var(--rc-pt)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between xl:gap-10">
          <div className="min-w-0 xl:pt-[calc(var(--rc-title)*0.35)]">
            <h2 className={`model-costs-title ${tones.text}`}>
              <span className="block" dangerouslySetInnerHTML={{ __html: title.main }} />
              {title.accent ? <span className={`block ${tones.accent}`} dangerouslySetInnerHTML={{ __html: title.accent }} /> : null}
            </h2>
            {data.subHeadline ? (
              <p
                className={`mt-3 max-w-[540px] text-[15px] leading-[1.6] lg:mt-[var(--rc-desc-mt)] lg:text-[length:var(--rc-desc)] lg:leading-[var(--rc-desc-lh)] ${tones.text}`}
                dangerouslySetInnerHTML={{ __html: typeset(data.subHeadline) }}
              />
            ) : null}
          </div>
          <TrustStrip tones={tones} />
        </div>

        {tables.length ? (
          <div className="mt-6 grid gap-4 lg:mt-[var(--rc-groups-mt)] lg:gap-[var(--rc-group-gap)]">
            {tables.map((table, index) => (
              <CostGroup key={`${table.title}-${index}`} table={table} tones={tones} />
            ))}
          </div>
        ) : (
          // No published table for this model yet: point straight to a quote.
          <OpenQuoteButton
            className={`mt-6 flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-[15px] font-semibold lg:mt-[var(--rc-groups-mt)] ${tones.card} ${tones.text}`}
          >
            Get a free replacement quote for your engine
            <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.8} />
          </OpenQuoteButton>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:mt-[var(--rc-notes-mt)] lg:grid-cols-[minmax(0,342fr)_minmax(0,334fr)_minmax(0,738fr)] lg:gap-[var(--rc-notes-gap)]">
          <Note icon={FileText} title={shared.importantNotes.title} html={shared.importantNotes.text} tones={tones} />
          <Note icon={Clock3} title={shared.labourTitle} html={data.labourEstimate} tones={tones} />
          <div className="md:col-span-2 lg:col-span-1">
            <RuleBox rule={data.rule} tones={tones} isDark={isDark} />
          </div>
        </div>

        <p className={`mt-4 text-[12px] lg:mt-[var(--rc-foot-mt)] lg:text-[length:var(--rc-foot)] ${tones.muted}`}>{shared.footnote}</p>
      </div>
    </section>
  );
}
