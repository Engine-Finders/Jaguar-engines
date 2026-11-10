"use client";

import Image from "next/image";
import { Star, StarHalf } from "lucide-react";
import { CalendarDays, ChartLine, CircleStar, Engine, Fuel, Layers, ShieldCheck, Tag, TriangleAlert, Zap, PoundShield } from "@/components/models/brandIcons";
import { useTheme } from "@/components/shared/themeProvider";
import CarOnBackground from "@/components/shared/CarOnBackground";
import { outsideTags } from "@/components/models/outsideTags";

/*
 * Model page "At a Glance", built from the 1536px brand references (light + dark).
 *
 *  - lg+ (1024px up): title, divider and copy on the left; the car scene on the right, ending exactly
 *    on the table's top edge; then the full-width table (icon column, Metric | Value). Sizes come from the
 *    --g-* tokens in globals.css: exact reference values at 1536px, scaled linearly down to 1024px.
 *  - sm–lg: same table at tablet sizes, the scene as a full-bleed band above it.
 *  - phones: copy, scene band, then each metric as a row (icon, label, value + badges).
 */

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replaceAll("â˜…", "★")
    .replaceAll("â˜†", "☆")
    .replace(/\s+/g, " ")
    .trim();
}

// Year and price ranges take an en dash ("2017–Present", "£3,000–£5,800").
function typeset(text = "") {
  return outsideTags(cleanText(text), (part) =>
    part
      .replace(/(\d)\s*-\s*(£?\d|Present)/g, "$1–$2")
      .replace(/\s-\s/g, " — "),
  );
}

// "£3,000-£5,800 [JAG-QUOTE]" -> text + badges ("JAG-QUOTE"); any bracketed source tag becomes a badge.
function splitBadges(value = "") {
  const badges = [];
  const text = cleanText(value)
    .replace(/\[([^\]]+)\]/g, (_, tag) => {
      badges.push(tag.trim().replace(/\s+-\s+/g, " · "));
      return "";
    })
    .trim();
  return { text: typeset(text), badges };
}

function ratingOf(value = "") {
  const text = cleanText(value);
  const full = (text.match(/★/g) || []).length;
  const half = text.includes("½") ? 0.5 : 0;
  return full || half ? full + half : null;
}

/* ---------- Icons ---------- */

const GLYPH = "h-[19px] w-[19px] sm:h-[21px] sm:w-[21px] lg:h-[var(--g-glyph)] lg:w-[var(--g-glyph)]";

function MetricGlyph({ metric, isDark }) {
  const name = cleanText(metric).toLowerCase();
  const line = (Icon, extra = "") => <Icon aria-hidden="true" className={`${GLYPH} ${extra}`} strokeWidth={1.8} />;
  if (name.startsWith("generation")) return line(Layers, isDark ? "" : "fill-current");
  if (name.includes("years")) return line(CalendarDays);
  if (name.includes("drive unit")) return line(Zap);
  if (name.includes("codes")) return line(Engine);
  if (name.includes("fuel")) return line(Fuel);
  if (name.includes("most enquired")) return line(ChartLine);
  if (name.includes("most reliable")) return line(ShieldCheck);
  if (name.includes("risk")) return line(TriangleAlert);
  if (name.includes("replacement") || name.includes("cost")) {
    return line(PoundShield);
  }
  if (name.includes("value")) return line(Tag);
  if (name.includes("rating")) return line(CircleStar);
  return line(ShieldCheck);
}

function IconCircle({ children, isDark }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-[42px] sm:w-[42px] lg:h-[var(--g-circle)] lg:w-[var(--g-circle)] ${
        isDark
          ? "border border-white/[0.22] bg-[radial-gradient(circle_at_32%_28%,#232323_0%,#0f0f0f_78%)] text-white"
          : "bg-white text-[#141513] shadow-[0_2px_8px_rgba(16,18,16,0.12),0_0_0_1px_rgba(16,18,16,0.04)]"
      }`}
    >
      {children}
    </span>
  );
}

/* ---------- Value cell ---------- */

function Badge({ label, isDark }) {
  return (
    <span
      className={`inline-flex h-[26px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] border px-2.5 text-[11.5px] font-medium uppercase tracking-[0.02em] lg:h-[var(--g-badge-h)] lg:px-[11px] lg:text-[length:var(--g-badge)] ${
        isDark ? "border-white/[0.28] text-white/[0.85]" : "border-[#d9d9d6] bg-white text-[#2a2b29]"
      }`}
    >
      <ShieldCheck aria-hidden="true" className="h-[14px] w-[14px] lg:h-[calc(var(--g-badge)*1.18)] lg:w-[calc(var(--g-badge)*1.18)]" strokeWidth={2} />
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </span>
  );
}

function StatusMark({ kind, isDark }) {
  if (kind === "good") {
    return (
      <span
        role="img"
        aria-label="Lowest-risk choice"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          isDark ? "border-[#3fbf72] bg-[#1d6b3e]/40 text-[#4fd384]" : "border-[#2f8a55] text-[#2f8a55]"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </span>
    );
  }
  return (
    <span role="img" aria-label="Highest risk" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e5484d] text-[14px] font-bold leading-none text-white">
      !
    </span>
  );
}

const STAR = "h-[22px] w-[22px] sm:h-[24px] sm:w-[24px] lg:h-[var(--g-star)] lg:w-[var(--g-star)]";

function Rating({ value, isDark }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const tone = isDark ? "text-[#e8e8e5]" : "text-[#111210]";

  return (
    <span className="inline-flex flex-wrap items-center gap-x-5 gap-y-2 lg:gap-x-[calc(var(--g-star)*0.9)]">
      <span className={`inline-flex items-center gap-[5px] ${tone}`} role="img" aria-label={`${value} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, index) => {
          if (index < full) return <Star key={index} aria-hidden="true" className={`${STAR} fill-current`} strokeWidth={1.4} />;
          if (index === full && half) {
            return (
              <span key={index} className={`relative ${STAR}`}>
                <Star aria-hidden="true" className="absolute inset-0 h-full w-full" strokeWidth={1.2} />
                <StarHalf aria-hidden="true" className="absolute inset-0 h-full w-full fill-current" strokeWidth={1.4} />
              </span>
            );
          }
          return <Star key={index} aria-hidden="true" className={STAR} strokeWidth={1.2} />;
        })}
      </span>
      <span
        className={`inline-flex h-[34px] items-center rounded-lg border px-4 text-[16px] lg:h-[var(--g-score-h)] lg:px-[18px] lg:text-[length:var(--g-score)] ${
          isDark ? "border-white/[0.28] text-white" : "border-[#d9d9d6] bg-white text-[#111210]"
        }`}
      >
        {value.toFixed(1)}/5
      </span>
    </span>
  );
}

function Value({ row, isDark }) {
  const rating = /rating/i.test(row.metric) ? ratingOf(row.value) : null;
  if (rating !== null) return <Rating value={rating} isDark={isDark} />;

  const { text, badges } = splitBadges(row.value);
  const metric = cleanText(row.metric).toLowerCase();
  const status = metric.includes("most reliable") ? "good" : metric.includes("risk") ? "risk" : null;

  return (
    <span className="inline-flex flex-wrap items-center gap-x-3.5 gap-y-1.5 lg:gap-x-[var(--g-badge-ml)]">
      <span dangerouslySetInnerHTML={{ __html: text }} />
      {status ? <StatusMark kind={status} isDark={isDark} /> : null}
      {badges.map((badge) => (
        <Badge key={badge} label={badge} isDark={isDark} />
      ))}
    </span>
  );
}

/* ---------- Table ---------- */

const COLS = "sm:grid-cols-[52px_minmax(0,488fr)_minmax(0,820fr)] lg:grid-cols-[var(--g-icon-col)_minmax(0,488fr)_minmax(0,820fr)]";

function GlanceTable({ rows, isDark }) {
  const rule = isDark ? "border-white/[0.1]" : "border-[#ececea]";
  const head = isDark ? "text-white" : "text-[#111210]";
  const value = isDark ? "text-white/[0.86]" : "text-[#1c1d1b]";

  return (
    <div
      className={`overflow-hidden rounded-[14px] border px-3.5 pb-1 sm:px-4 sm:pb-3 lg:px-[var(--g-inset)] lg:pb-[var(--g-pb)] ${
        isDark
          ? "border-white/[0.18] bg-[rgba(10,10,10,0.9)] shadow-[0_18px_44px_rgba(0,0,0,0.5)]"
          : "border-[#e6e6e3] bg-white shadow-[0_10px_34px_rgba(16,18,16,0.07)]"
      }`}
    >
      {/* Header: tablet/desktop only (phones read each row as label over value) */}
      <div className={`hidden h-[48px] items-center border-b text-[16px] font-medium sm:grid lg:h-[var(--g-head-h)] lg:text-[length:var(--g-label)] ${COLS} ${rule} ${head}`}>
        <span />
        <span className="pl-3 lg:pl-[var(--g-label-pl)]">Metric</span>
        <span className="pl-6 lg:pl-[var(--g-value-pl)]">Value</span>
      </div>

      <ul>
        {rows.map((row, index) => (
          <li key={row.metric} className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 py-3 sm:items-stretch sm:gap-x-0 sm:py-0 ${COLS}`}>
            <span className="row-span-2 self-start sm:row-span-1 sm:self-center sm:pl-0.5 lg:pl-[var(--g-circle-pl)]">
              <IconCircle isDark={isDark}>
                <MetricGlyph metric={row.metric} isDark={isDark} />
              </IconCircle>
            </span>
            {/* the row rule starts after the icon column, as in the reference */}
            <span
              className={`text-[13.5px] font-medium leading-snug sm:flex sm:min-h-[48px] sm:items-center sm:py-2 sm:border-t sm:pl-3 sm:text-[16px] sm:font-normal lg:min-h-[var(--g-row-h)] lg:py-1 lg:pl-[var(--g-label-pl)] lg:text-[length:var(--g-label)] ${
                index === 0 ? "sm:border-t-0" : ""
              } ${rule} ${isDark ? "text-white/[0.62] sm:text-white/[0.94]" : "text-[#6a6b67] sm:text-[#111210]"}`}
              dangerouslySetInnerHTML={{ __html: cleanText(row.metric) }}
            />
            <span
              className={`mt-0.5 text-[16px] font-semibold leading-snug sm:mt-0 sm:flex sm:min-h-[48px] sm:items-center sm:py-2 sm:border-l sm:border-t sm:pl-6 sm:font-normal lg:min-h-[var(--g-row-h)] lg:py-1 lg:pl-[var(--g-value-pl)] lg:text-[length:var(--g-value)] ${
                index === 0 ? "sm:border-t-0" : ""
              } ${rule} ${value}`}
            >
              <Value row={row} isDark={isDark} />
            </span>
            {/* phones: a hairline between rows, inset to the text column */}
            {index < rows.length - 1 ? <span aria-hidden="true" className={`col-span-2 col-start-1 mt-3 border-t sm:hidden ${rule}`} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Section ---------- */

export default function AtAGlance({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const rows = data.rows || [];
  const scene = data.scenes?.[isDark ? "dark" : "light"] || null;

  // One photo element: a full-bleed band above the table on phones/tablets. From lg it fills the right of
  // the header band from top to bottom, whatever the band's height, so the car is always large and its
  // floor always meets the table's top edge (cropped from the left: the skyline gives way before the car).
  // E-Pace: the reference scene. Other models: their own photo standing in Jaguar's scene.
  const sceneBox =
    "relative order-2 mt-6 aspect-[921/360] w-full overflow-hidden sm:aspect-[921/330] lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:mt-0 lg:aspect-auto lg:w-[60%] min-[1546px]:w-[921px]";
  const fades = (
    <>
      <div className="absolute inset-y-0 left-0 hidden w-[22%] bg-[linear-gradient(90deg,var(--color-page)_0%,transparent_100%)] lg:block" />
      <div className="absolute inset-x-0 top-0 h-[14%] bg-[linear-gradient(180deg,var(--color-page)_0%,transparent_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[10%] bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)] lg:h-[6%]" />
    </>
  );

  return (
    <section className="model-glance relative isolate overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      {/* Header band (full width, so the scene can run to the page's right edge) */}
      <div className="relative flex flex-col lg:block">
        {/* Copy: at least the reference scene's height (306px at 1536), so the table starts on its floor line */}
        <div className="order-1 mx-auto w-full max-w-[1546px] px-4 pt-8 sm:px-6 sm:pt-10 lg:min-h-[19.94vw] lg:px-10 lg:pb-[var(--g-band-pb)] lg:pt-[var(--g-pt)] 2xl:px-[56px] min-[1546px]:min-h-[306px]">
          <h2 className={`model-glance-title max-w-[640px] ${isDark ? "text-white" : "text-[#111210]"}`} dangerouslySetInnerHTML={{ __html: cleanText(data.h2) }} />
          <div aria-hidden="true" className={`mt-4 h-px w-11 lg:mt-[var(--g-div-mt)] ${isDark ? "bg-white/70" : "bg-[#2a2b29]"}`} />
          {data.subHeadline ? (
            <p
              className={`mt-4 max-w-[455px] text-[15.5px] leading-[1.62] lg:mt-[var(--g-desc-mt)] lg:text-[length:var(--g-desc)] lg:leading-[var(--g-desc-lh)] ${
                isDark ? "text-white/[0.7]" : "text-[#5b5c58]"
              }`}
              dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }}
            />
          ) : null}
        </div>

        {scene ? (
          <div aria-hidden="true" className={sceneBox}>
            <Image src={scene.src} alt="" fill loading="eager" sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-right" />
            {fades}
          </div>
        ) : data.image ? (
          <div aria-hidden="true" className={sceneBox}>
            <CarOnBackground
              src={data.image}
              isDark={isDark}
              className="absolute inset-0"
              bgClassName="object-cover object-[62%_78%]"
              carClassName="left-[20%] right-[20%] top-[12%] bottom-[7%] lg:left-[27%] lg:right-[8%] lg:top-[7%]"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
            {fades}
          </div>
        ) : null}
      </div>

      <div className="mx-auto w-full max-w-[1546px] px-4 pb-12 sm:px-6 lg:px-10 lg:pb-[var(--g-sect-pb)] 2xl:px-[56px]">
        <div className="relative z-10 -mt-3 sm:-mt-5 lg:mt-0">
          <GlanceTable rows={rows} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
