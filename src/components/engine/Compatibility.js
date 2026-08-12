"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import { sectionDescription, sectionH2 } from "@/components/models/sectionTypography";

const ENGINE_IMAGE =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80";

const CAR_IMAGES = [
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=640&q=80",
];

function cleanText(text = "") {
  return String(text)
    .replace(/\u00c2\u00a3|\u00a3/g, "\u00a3")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u201c|\u00c3\u00a2\u00e2\u20ac\u201d|\u00e2\u20ac\u201c|\u00e2\u20ac\u201d|\u2013|\u2014/g, "\u2013")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u02dc|\u00e2\u20ac\u2018|\u2011/g, "-")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u00a2|\u00e2\u20ac\u00a2|\u2022/g, "\u2022")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(text = "") {
  return cleanText(text).replace(/\[[^\]]+\]/g, "").trim();
}

function shortEngineName(engineLabel = "") {
  return cleanText(engineLabel).replace(/^BMW\s+/i, "") || "Engine";
}

function seriesParts(model = "") {
  const clean = cleanText(model);
  const seriesMatch = clean.match(/^(\d+)\s+Series(.*)$/i);
  if (seriesMatch) {
    return {
      big: seriesMatch[1],
      label: seriesMatch[2]?.trim() ? `SERIES ${seriesMatch[2].trim()}` : "SERIES",
    };
  }

  if (/^X\d/i.test(clean) || /^Z\d/i.test(clean) || /^M\d/i.test(clean)) {
    const [big, ...rest] = clean.split(/\s+/);
    return { big, label: rest.join(" ") };
  }

  const [big, ...rest] = clean.split(/\s+/);
  return { big: big || clean, label: rest.join(" ") };
}

function yearBounds(rows = [], yearsProduced = "") {
  const fromRows = rows.flatMap((row) => (cleanText(row.years).match(/\d{4}/g) || []).map(Number));
  const fromGlance = (cleanText(yearsProduced).match(/\d{4}/g) || []).map(Number);
  const years = [...fromRows, ...fromGlance].filter(Boolean);

  if (years.length === 0) return { start: "", end: "", span: 0 };

  const start = Math.min(...years);
  const end = Math.max(...years);
  return { start, end, span: Math.max(end - start, 1) };
}

function groupModels(rows = []) {
  const map = new Map();

  rows.forEach((row) => {
    const model = cleanText(row.model);
    if (!map.has(model)) {
      map.set(model, {
        model,
        generations: [],
        variants: [],
        years: [],
        rowCount: 0,
      });
    }

    const entry = map.get(model);
    entry.generations.push(cleanText(row.generation).replace(/\s*\/\s*/g, " / "));
    cleanText(row.variantBadge)
      .split(/,\s*/)
      .filter(Boolean)
      .forEach((variant) => {
        if (!entry.variants.includes(variant)) entry.variants.push(variant);
      });
    entry.years.push(stripTags(row.years));
    entry.rowCount += 1;
  });

  return Array.from(map.values()).map((entry) => {
    const yearNums = entry.years.flatMap((value) => (value.match(/\d{4}/g) || []).map(Number));
    const start = yearNums.length ? Math.min(...yearNums) : "";
    const end = yearNums.length ? Math.max(...yearNums) : "";

    return {
      ...entry,
      generationLabel: entry.generations
        .join(" / ")
        .split(/\s*\/\s*/)
        .filter(Boolean)
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .join(" · "),
      variantLabel: entry.variants.join(" · "),
      yearLabel: start && end ? `${start}\u2013${end}` : entry.years[0] || "",
      variantCount: entry.variants.length,
    };
  });
}

function cardClass(isDark) {
  return isDark
    ? "border-[var(--color-border)] bg-[var(--color-surface)]"
    : "border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[0_8px_20px_var(--color-shadow)]";
}

function carImageFor(model = "") {
  const clean = cleanText(model);
  let hash = 0;
  for (let i = 0; i < clean.length; i += 1) hash += clean.charCodeAt(i);
  return CAR_IMAGES[hash % CAR_IMAGES.length];
}

function ShieldIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />
    </svg>
  );
}

function ExclusiveBadge({ isDark }) {
  return (
    <div className={`flex max-w-[260px] items-start gap-2 rounded-lg border px-2.5 py-2 ${cardClass(isDark)}`}>
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <ShieldIcon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.04em] text-[var(--color-primary)]">BMW Exclusive Engine</p>
        <p className="mt-0.5 text-[10px] leading-[1.35] text-[var(--color-text-muted)]">
          This is an exclusive BMW engine. No cross-platform sharing.
        </p>
      </div>
    </div>
  );
}

function ProductionTimeline({ start, end, span }) {
  if (!start || !end) return null;

  return (
    <div className="mt-4 flex items-center gap-3 md:mt-5">
      <span className="text-[13px] font-semibold text-[var(--color-primary)] md:text-[14px]">{start}</span>
      <div className="relative h-px flex-1 bg-[var(--color-primary)]">
        <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[var(--color-primary)]" />
        <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[var(--color-primary)]" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[var(--color-primary)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.04em] text-white md:text-[11px]">
          {span} Years of Production
        </span>
      </div>
      <span className="text-[13px] font-semibold text-[var(--color-primary)] md:text-[14px]">{end}</span>
    </div>
  );
}

function DesktopModelCard({ item, isDark }) {
  const series = seriesParts(item.model);

  return (
    <article className={`flex h-full flex-col rounded-lg border p-2.5 ${cardClass(isDark)}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[26px] font-bold leading-none text-[var(--color-primary)]">{series.big}</p>
          {series.label ? (
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-soft)]">{series.label}</p>
          ) : null}
        </div>
        <div className="relative h-11 w-[84px] shrink-0 overflow-hidden rounded-md">
          <Image src={carImageFor(item.model)} alt="" fill sizes="84px" className="object-cover object-center" />
        </div>
      </div>

      <div className="mt-2">
        <span className="inline-flex max-w-full rounded-full bg-[var(--color-page-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text)]">
          <span className="truncate">{item.generationLabel}</span>
        </span>
      </div>

      <p className="mt-1.5 line-clamp-2 min-h-[28px] text-[11px] leading-[1.3] text-[var(--color-text-muted)]">{item.variantLabel}</p>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-1.5">
        <span className="text-[10px] text-[var(--color-text-soft)]">{item.yearLabel}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--color-primary)]">
          {item.variantCount} Variants →
        </span>
      </div>
    </article>
  );
}

function MobileModelRow({ row, isDark }) {
  const series = seriesParts(row.model);

  return (
    <article className={`grid grid-cols-[68px_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border px-2.5 py-2 ${cardClass(isDark)}`}>
      <div className="min-w-0 overflow-hidden">
        <p className="text-[22px] font-bold leading-none text-[var(--color-primary)]">{series.big}</p>
        {series.label ? (
          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-soft)]">{series.label}</p>
        ) : null}
        <div className="relative mt-1 h-8 w-full overflow-hidden rounded">
          <Image src={carImageFor(row.model)} alt="" fill sizes="68px" className="object-cover object-center" />
        </div>
      </div>

      <div className="grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.04em] text-[var(--color-text-soft)]">Generation</p>
          <span className="mt-1 inline-flex max-w-full rounded-full bg-[var(--color-page-soft)] px-2 py-1 text-[11px] font-semibold text-[var(--color-text)]">
            <span className="truncate">{cleanText(row.generation).replace(/\s*\/\s*/g, "/")}</span>
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.04em] text-[var(--color-text-soft)]">Variant/Badge</p>
          <p className="mt-1 text-[11px] leading-[1.3] text-[var(--color-text)]">{cleanText(row.variantBadge)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-1">
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.04em] text-[var(--color-text-soft)]">Years</p>
          <p className="mt-1 text-[12px] font-semibold text-[var(--color-primary)]">{stripTags(row.years)}</p>
        </div>
        <span aria-hidden="true" className="text-[18px] font-bold text-[var(--color-primary)]">›</span>
      </div>
    </article>
  );
}

function VerifiedStrip() {
  return (
    <article className="flex w-full items-start gap-3 rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary-soft)] px-3.5 py-3 md:items-center md:px-4 md:py-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-primary)]">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M8 7h11M8 12h11M8 17h11M5 7h.01M5 12h.01M5 17h.01" />
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-bold uppercase tracking-[0.04em] text-[var(--color-primary)]">Compatibility Verified</p>
        <p className="mt-0.5 text-[12px] leading-[1.4] text-[var(--color-text-muted)]">
          All compatibility data verified from BMW parts catalogues and specialist databases.{" "}
          <span className="font-semibold text-[var(--color-primary)]">[BMW-VERIFIED]</span>
        </p>
      </div>
    </article>
  );
}

export default function Compatibility({
  data,
  engineLabel = "BMW Engine",
  yearsProduced = "",
  modelsFitted = "",
  crossBrandFitment = "",
}) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const rows = data.rows || [];
  const grouped = groupModels(rows);
  const bounds = yearBounds(rows, yearsProduced);
  const engineCode = shortEngineName(engineLabel);
  const modelCountLabel = stripTags(modelsFitted) || `${grouped.length}+ models`;
  const exclusiveNote = cleanText(data.crossBrandNote || crossBrandFitment || "(Exclusive mode – no cross-link)");

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[var(--color-page)] py-6 text-[var(--color-text)] md:py-9">
      {/* Engine background + fog */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${isDark ? "bg-[var(--color-page)]" : "bg-[var(--color-page-soft)]"}`} />

        <div className="absolute inset-y-0 right-0 w-full md:w-[62%]">
          <Image
            src={ENGINE_IMAGE}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 62vw"
            className="object-cover object-[center_30%] opacity-55 md:object-center md:opacity-70"
            priority={false}
          />
        </div>

        {/* Fog / smoke between image and content */}
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(90deg,var(--color-page)_0%,var(--color-page)_34%,var(--color-hero-overlay)_58%,transparent_78%)]"
              : "bg-[linear-gradient(90deg,var(--color-page-soft)_0%,var(--color-page-soft)_34%,var(--color-hero-overlay)_58%,transparent_78%)]"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(180deg,var(--color-hero-overlay)_0%,transparent_28%,transparent_72%,var(--color-hero-fade)_100%)]"
              : "bg-[linear-gradient(180deg,var(--color-hero-overlay)_0%,transparent_30%,transparent_70%,var(--color-hero-fade)_100%)]"
          }`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_42%,transparent_0%,var(--color-hero-overlay)_58%,var(--color-hero-fade)_100%)] opacity-90" />
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="grid max-w-[720px] items-start gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:gap-5">
          <div className="min-w-0">
            <h2 className={`font-bold tracking-normal ${sectionH2}`}>
              Compatible <span className="text-[var(--color-primary)]">BMW Models</span>
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>
            <p className={`mt-4 max-w-[540px] ${sectionDescription} ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
              BMW {engineCode} engines are fitted across{" "}
              <span className="font-semibold text-[var(--color-primary)]">{modelCountLabel}</span> from{" "}
              <span className="font-semibold text-[var(--color-primary)]">
                {bounds.start && bounds.end ? `${bounds.start}\u2013${bounds.end}` : stripTags(yearsProduced) || "multiple years"}
              </span>
              .
            </p>
          </div>

          <div className="md:pt-2">
            <ExclusiveBadge isDark={isDark} />
          </div>
        </div>

        <ProductionTimeline start={bounds.start} end={bounds.end} span={bounds.span} />

        {/* Desktop cards */}
        <div className="mt-4 hidden md:block">
          <div className="grid gap-2.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {grouped.map((item) => (
              <DesktopModelCard key={item.model} item={item} isDark={isDark} />
            ))}

            <article className="flex min-h-[132px] flex-col items-start justify-center rounded-lg border border-dashed border-[var(--color-primary)] bg-[var(--color-primary-soft)] p-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-primary)] text-[16px] font-bold text-[var(--color-primary)]">
                +
              </span>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.04em] text-[var(--color-primary)]">Other BMW Models</p>
              <p className="mt-1 text-[11px] leading-[1.35] text-[var(--color-text-muted)]">
                {engineCode} also appears in limited variants and markets.
              </p>
              <p className="mt-2 text-[11px] font-semibold text-[var(--color-primary)]">View full details →</p>
            </article>
          </div>

          <div className="mt-2.5">
            <VerifiedStrip />
          </div>
        </div>

        {/* Mobile rows */}
        <div className="mt-4 grid gap-2.5 md:hidden">
          {rows.map((row) => (
            <MobileModelRow key={`${row.model}-${row.generation}`} row={row} isDark={isDark} />
          ))}

          <article className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${cardClass(isDark)}`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] text-[18px] font-bold text-[var(--color-primary)]">
              +
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold uppercase tracking-[0.04em] text-[var(--color-primary)]">Other BMW Models</p>
              <p className="mt-0.5 text-[11px] leading-[1.35] text-[var(--color-text-muted)]">
                {engineCode} also appears in limited variants and markets.
              </p>
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-[var(--color-primary)]">View full details ›</span>
          </article>

          <VerifiedStrip />

          <div className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 ${cardClass(isDark)}`}>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <ShieldIcon className="h-3.5 w-3.5" />
            </span>
            <p className="text-[11px] text-[var(--color-text-soft)]">{exclusiveNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
