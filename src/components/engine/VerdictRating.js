"use client";

import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import HomeIcon from "@/components/home/homeIcons";
import { sectionH2 } from "@/components/models/sectionTypography";
import { engineSectionBg } from "./engineSection";

const DIMENSION_ICONS = {
  Reliability: "shield",
  "Repair Cost": "pound",
  Repairability: "repair",
  "Parts Supply": "uk-wide-delivery",
  "Replacement Economics": "real-inquiries",
};

function cleanText(text = "") {
  return String(text)
    .replace(/\u00c2\u00a3|\u00a3/g, "\u00a3")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u201c|\u00c3\u00a2\u00e2\u20ac\u201d|\u00e2\u20ac\u201c|\u00e2\u20ac\u201d|\u2013|\u2014/g, "\u2013")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u02dc|\u00e2\u20ac\u2018|\u2011/g, "-")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u00a2|\u00e2\u20ac\u00a2|\u2022/g, "\u2022")
    .replace(/\s+/g, " ")
    .trim();
}

function cardClass(isDark) {
  return isDark
    ? "border-[var(--color-border)] bg-[var(--color-surface)]"
    : "border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[0_10px_28px_var(--color-shadow)]";
}

function parseStarRating(value = "") {
  const clean = cleanText(value);
  const halfMatch = clean.match(/(\d+)\s*[½]/);
  if (halfMatch) {
    return { display: `${halfMatch[1]}\u00bd`, numeric: Number(halfMatch[1]) + 0.5 };
  }

  const decimalMatch = clean.match(/(\d+(?:\.\d+)?)/);
  if (!decimalMatch) return { display: clean, numeric: 0 };

  const numeric = Number(decimalMatch[1]);
  const display = Number.isInteger(numeric) ? String(numeric) : String(numeric);
  return { display, numeric };
}

function parseScoreCell(score = "") {
  const clean = cleanText(score);
  const totalMatch = clean.match(/^(\d+)\s*\/\s*(\d+)\s*(?:\((.+)\))?$/);
  if (totalMatch) {
    return {
      points: Number(totalMatch[1]),
      outOf: Number(totalMatch[2]),
      detail: totalMatch[3] || "",
      isTotal: true,
    };
  }

  const match = clean.match(/^(\d+)\s*(?:\((.+)\))?$/);
  if (!match) return { points: 0, outOf: 20, detail: clean, isTotal: false };

  return {
    points: Number(match[1]),
    outOf: 20,
    detail: match[2] || "",
    isTotal: false,
  };
}

function parseVerdict(value = "") {
  const clean = cleanText(value);
  const match = clean.match(/^["“]?(.+?)["”]?\s*(\(Clause[\s\S]*)?$/i);

  if (!match) {
    return { quote: clean, meta: "" };
  }

  return {
    quote: match[1].replace(/^["“]|["”]$/g, "").trim(),
    meta: (match[2] || "").trim(),
  };
}

function renderTaggedText(text = "") {
  const parts = cleanText(text).split(/(\[[^\]]+\])/g);

  return parts.map((part, index) => {
    if (/^\[[^\]]+\]$/.test(part)) {
      return (
        <span key={`${part}-${index}`} className="font-semibold text-[var(--color-primary)]">
          {part}
        </span>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function StarRating({ value }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.25 && value - full < 0.75;
  const roundedHalf = value - full >= 0.75;
  const filled = roundedHalf ? full + 1 : full;

  return (
    <div className="flex items-center gap-0.5 text-[var(--color-primary)]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => {
        if (index < filled) {
          return (
            <span key={index} className="text-[16px] leading-none md:text-[20px]">
              ★
            </span>
          );
        }

        if (index === filled && hasHalf) {
          return (
            <span key={index} className="relative inline-block text-[16px] leading-none text-[var(--color-border-strong)] md:text-[20px]">
              ★
              <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden text-[var(--color-primary)]">
                ★
              </span>
            </span>
          );
        }

        return (
          <span key={index} className="text-[16px] leading-none text-[var(--color-border-strong)] md:text-[20px]">
            ★
          </span>
        );
      })}
    </div>
  );
}

function CircleIcon({ isDark, className = "", icon, iconClass = "h-5 w-5" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-soft)] ${className}`}
    >
      <HomeIcon name={icon} isDark={isDark} className={`${iconClass} object-contain`} />
    </span>
  );
}

function DimensionIcon({ dimension, isDark }) {
  return (
    <CircleIcon
      isDark={isDark}
      icon={DIMENSION_ICONS[dimension] || "shield"}
      className="h-8 w-8 md:h-10 md:w-10"
      iconClass="h-5 w-5 md:h-6 md:w-6"
    />
  );
}

function RatingCard({ starRating, confidence, isDark }) {
  const rating = parseStarRating(starRating);

  return (
    <article className={`rounded-xl border px-3.5 py-3.5 md:px-5 md:py-5 ${cardClass(isDark)}`}>
      <p className={`text-[12px] font-medium md:text-[14px] ${isDark ? "text-[var(--color-text)]" : "text-[var(--color-text-soft)]"}`}>Rating:</p>

      <div className="mt-1.5 flex flex-wrap items-end gap-x-2.5 gap-y-1 md:mt-2 md:gap-x-3">
        <p className="text-[36px] font-bold leading-none text-[var(--color-primary)] md:text-[48px]">{rating.display}</p>
        <div className="mb-0.5 flex items-center gap-1.5 md:mb-1 md:gap-2">
          <StarRating value={rating.numeric} />
          <span className="text-[11px] text-[var(--color-text-soft)] md:text-[13px]">out of 5</span>
        </div>
      </div>

      <div className="mt-3 border-t border-[var(--color-border)] pt-3">
        <div className="flex items-start gap-2.5">
          <CircleIcon isDark={isDark} icon="shield" className="mt-0.5 h-7 w-7 md:h-8 md:w-8" iconClass="h-4 w-4 md:h-5 md:w-5" />
          <p className="min-w-0 text-[12px] leading-[1.4] text-[var(--color-text-muted)] md:text-[13px]">
            {renderTaggedText(confidence)}
          </p>
        </div>
      </div>
    </article>
  );
}

function VerdictQuote({ oneLineVerdict, isDark }) {
  const { quote, meta } = parseVerdict(oneLineVerdict);

  return (
    <article className={`relative overflow-hidden rounded-xl border px-3.5 py-3.5 md:px-5 md:py-5 ${cardClass(isDark)}`}>
      <span aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1 text-[36px] font-bold leading-none text-[var(--color-primary)] opacity-70 md:left-4 md:top-2 md:text-[48px] md:opacity-80">
        “
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-5 right-2.5 text-[36px] font-bold leading-none text-[var(--color-primary)] opacity-70 md:bottom-6 md:right-4 md:text-[48px] md:opacity-80">
        ”
      </span>

      <p className="relative z-[1] px-4 pt-4 text-[13px] font-medium leading-[1.45] text-[var(--color-text)] md:px-6 md:pt-5 md:text-[15px]">
        {quote}
      </p>
      {meta ? (
        <p className="relative z-[1] mt-2.5 px-1 text-[10px] leading-[1.35] text-[var(--color-text-soft)] md:mt-3 md:text-[11px]">
          {meta}
        </p>
      ) : null}
    </article>
  );
}

function AdviceCards({ bestFor, avoidIf, isDark }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:gap-3">
      <article
        className={`rounded-xl border px-3.5 py-3 md:px-4 md:py-3.5 ${
          isDark
            ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-soft)]"
            : "border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[0_8px_22px_var(--color-shadow)]"
        }`}
      >
        <div className="flex items-center gap-2 text-[var(--color-accent-green)]">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-accent-green)] bg-[var(--color-accent-green-soft)]">
            <HomeIcon name="check" isDark={isDark} className="h-4 w-4 object-contain" />
          </span>
          <p className="text-[13px] font-semibold md:text-[14px]">Best for:</p>
        </div>
        <p className="mt-2 text-[12px] leading-[1.4] text-[var(--color-text)] md:text-[13px]">{cleanText(bestFor)}</p>
      </article>

      <article
        className={`rounded-xl border px-3.5 py-3 md:px-4 md:py-3.5 ${
          isDark
            ? "border-[var(--color-accent-red)] bg-[var(--color-accent-red-soft)]"
            : "border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[0_8px_22px_var(--color-shadow)]"
        }`}
      >
        <div className="flex items-center gap-2 text-[var(--color-accent-red)]">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-accent-red)] bg-[var(--color-accent-red-soft)]">
            <HomeIcon name="warning" isDark={isDark} className="h-4 w-4 object-contain" />
          </span>
          <p className="text-[13px] font-semibold md:text-[14px]">Avoid if:</p>
        </div>
        <p className="mt-2 text-[12px] leading-[1.4] text-[var(--color-text)] md:text-[13px]">{cleanText(avoidIf)}</p>
      </article>
    </div>
  );
}

function ScoreBreakdown({ scoreNote, scoreBreakdown, isDark }) {
  const columns = scoreBreakdown?.columns || ["Dimension", "Score (of 20)"];
  const rawRows = scoreBreakdown?.rows || [];

  const parsedRows = rawRows
    .map((row) => ({
      dimension: cleanText(row.dimension),
      ...parseScoreCell(row.score),
    }))
    .filter((row) => row.dimension);

  const bodyRows = parsedRows.filter((row) => !row.isTotal && row.dimension.toLowerCase() !== "total");
  const totalRow = parsedRows.find((row) => row.isTotal || row.dimension.toLowerCase() === "total");
  const totalPoints = totalRow?.points ?? bodyRows.reduce((sum, row) => sum + row.points, 0);
  const totalOutOf = totalRow?.outOf ?? 100;

  return (
    <article className={`overflow-hidden rounded-xl border ${cardClass(isDark)}`}>
      <div className="px-3.5 pt-3.5 md:px-5 md:pt-5">
        <p className="text-[13px] font-semibold text-[var(--color-text)] md:text-[15px]">{cleanText(scoreNote)}</p>
      </div>

      <div className="mt-2.5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 bg-[var(--color-primary-soft)] px-3.5 py-2 text-[11px] font-semibold text-[var(--color-text)] md:mt-3 md:gap-3 md:px-5 md:py-2.5 md:text-[13px]">
        <span>{columns[0] || "Dimension"}</span>
        <span className="text-right">{columns[1] || "Score (of 20)"}</span>
      </div>

      <div>
        {bodyRows.map((row) => (
          <div
            key={row.dimension}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 border-b border-[var(--color-border)] px-3 py-2.5 md:gap-4 md:px-5 md:py-3.5"
          >
            <div className="flex min-w-0 items-start gap-2 md:gap-3">
              <DimensionIcon dimension={row.dimension} isDark={isDark} />
              <div className="min-w-0">
                <p className="text-[12px] font-semibold leading-tight text-[var(--color-text)] md:text-[14px]">{row.dimension}</p>
                {row.detail ? (
                  <p className="mt-0.5 text-[11px] leading-[1.35] text-[var(--color-text-soft)] md:mt-1 md:text-[12px]">{row.detail}</p>
                ) : null}
              </div>
            </div>
            <p className="shrink-0 pt-0.5 text-right leading-none">
              <span className="text-[20px] font-bold text-[var(--color-primary)] md:text-[26px]">{row.points}</span>
              <span className={`text-[11px] font-medium md:text-[13px] ${isDark ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"}`}> /{row.outOf}</span>
            </p>
          </div>
        ))}
      </div>

      <div
        className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3.5 py-3 md:gap-3 md:px-5 md:py-4 ${
          isDark ? "bg-[var(--color-page-soft)]" : "bg-[var(--color-primary-soft)]"
        }`}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[var(--color-text)] md:text-[13px]">
          Total Engine Score
        </p>
        <p className="text-right leading-none">
          <span className="text-[26px] font-bold text-[var(--color-primary)] md:text-[34px]">{totalPoints}</span>
          <span className={`text-[12px] font-medium md:text-[14px] ${isDark ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"}`}> / {totalOutOf}</span>
        </p>
      </div>
    </article>
  );
}

export default function VerdictRating({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";

  return (
    <section className={`relative w-full overflow-x-hidden py-6 text-[var(--color-text)] md:py-9 ${engineSectionBg(isDark, false)}`}>
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="text-center md:text-left">
          <h2 className={`font-bold tracking-normal ${sectionH2}`}>
            Verdict <span className="text-[var(--color-primary)]">& Rating</span>
          </h2>
          <div className="mt-3 flex justify-center md:justify-start">
            <MStripe />
          </div>
        </div>

        <div className="mt-5 hidden gap-3 md:grid md:grid-cols-[0.95fr_1.05fr] md:items-start">
          <div className="grid gap-3">
            <RatingCard starRating={data.starRating} confidence={data.confidence} isDark={isDark} />
            <VerdictQuote oneLineVerdict={data.oneLineVerdict} isDark={isDark} />
            <AdviceCards bestFor={data.bestFor} avoidIf={data.avoidIf} isDark={isDark} />
          </div>
          <ScoreBreakdown scoreNote={data.scoreNote} scoreBreakdown={data.scoreBreakdown} isDark={isDark} />
        </div>

        <div className="mt-4 grid gap-2.5 md:hidden">
          <RatingCard starRating={data.starRating} confidence={data.confidence} isDark={isDark} />
          <VerdictQuote oneLineVerdict={data.oneLineVerdict} isDark={isDark} />
          <ScoreBreakdown scoreNote={data.scoreNote} scoreBreakdown={data.scoreBreakdown} isDark={isDark} />
          <AdviceCards bestFor={data.bestFor} avoidIf={data.avoidIf} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
