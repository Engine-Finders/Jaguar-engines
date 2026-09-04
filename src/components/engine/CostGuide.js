"use client";

import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import HomeIcon from "@/components/home/homeIcons";
import { sectionDescription } from "@/components/models/sectionTypography";
import { engineSectionBg } from "./engineSection";

const priceH2 = "text-[22px] font-bold leading-[1.12] tracking-normal md:text-[28px]";

function cleanText(text = "") {
  return String(text)
    .replace(/\u00c2\u00a3|\u00a3/g, "\u00a3")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u201c|\u00c3\u00a2\u00e2\u20ac\u201d|\u00e2\u20ac\u201c|\u00e2\u20ac\u201d|\u2013|\u2014/g, "\u2013")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u02dc|\u00e2\u20ac\u2018|\u2011/g, "-")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u00a2|\u00e2\u20ac\u00a2|\u2022/g, "\u2022")
    .replace(/\s+/g, " ")
    .trim();
}

function shortEngineName(engineLabel = "") {
  return cleanText(engineLabel).replace(/^Jaguar\s+/i, "") || "Engine";
}

function parseQuotedPrice(value = "") {
  const clean = cleanText(value);
  const tagMatch = clean.match(/(\[[^\]]+\])/);
  return {
    price: clean.replace(/\[[^\]]+\]/g, "").trim(),
    tag: tagMatch?.[1] || "",
  };
}

function renderTaggedText(text = "") {
  return cleanText(text).split(/(\[[^\]]+\])/g).map((part, index) => {
    if (/^\[[^\]]+\]$/.test(part)) {
      return (
        <span key={`${part}-${index}`} className="font-semibold text-[var(--color-chrome-bright)]">
          {part}
        </span>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function cardClass(isDark) {
  return isDark
    ? "border-[var(--color-border)] bg-[var(--color-surface)]"
    : "border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[0_10px_28px_var(--color-shadow)]";
}

function badgeClass(isDark) {
  return isDark
    ? "bg-[var(--color-chrome)] text-[var(--color-page)]"
    : "bg-[var(--color-primary)] text-white";
}

function ConditionIcon({ condition, isDark }) {
  const key = cleanText(condition).toLowerCase();
  let icon = "engine";
  if (key.includes("recondition")) icon = "refresh";
  else if (key.includes("rebuild")) icon = "repair";
  else if (key.includes("used")) icon = "vehicle";

  return (
    <span className="mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-primary-soft)] md:h-10 md:w-10">
      <HomeIcon name={icon} isDark={isDark} className="h-5 w-5 object-contain md:h-6 md:w-6" />
    </span>
  );
}

function PriceGuideHeading({ engineCode, isDark }) {
  return (
    <h2 className={`${priceH2} ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
      <span className="block">
        Jaguar <span className="text-[var(--color-chrome-bright)]">{engineCode}</span>
      </span>
      <span className="block">Engine Price Guide</span>
    </h2>
  );
}

function PriceCard({ row, popular = false, isDark, compact = false }) {
  const supply = parseQuotedPrice(row.supplyOnly);
  const fitted = parseQuotedPrice(row.fittedIndie);
  const warranty = cleanText(row.warranty);
  const title = cleanText(row.condition).toUpperCase();
  const labelClass = isDark ? "text-white/70" : "text-[var(--color-text-soft)]";
  const valueClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const tagClass = "text-[var(--color-chrome-bright)]";

  return (
    <article
      className={`relative rounded-xl border px-3.5 py-3.5 text-center md:px-4 md:py-4 ${
        popular
          ? isDark
            ? "border-[var(--color-chrome-bright)] bg-[var(--color-surface)] shadow-[0_12px_28px_var(--color-shadow)]"
            : "border-[var(--color-primary)] bg-[var(--color-surface)] shadow-[0_12px_28px_var(--color-shadow)]"
          : cardClass(isDark)
      }`}
    >
      {popular ? (
        <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-md px-2.5 py-0.5 text-center text-[10px] font-bold uppercase tracking-[0.04em] ${badgeClass(isDark)}`}>
          Most Popular
        </span>
      ) : null}

      <div className={`flex flex-col items-center gap-2 ${popular ? "mt-3" : "mt-1"}`}>
        <ConditionIcon condition={row.condition} isDark={isDark} />
        <p className={`text-[14px] font-bold uppercase tracking-[0.04em] md:text-[15px] ${valueClass}`}>{title}</p>
      </div>

      {compact ? (
        <div className="mt-3">
          <div className="border-b border-[var(--color-border)] pb-2.5">
            <p className={`text-[10px] font-semibold uppercase tracking-[0.04em] ${labelClass}`}>Supply Only</p>
            <p className={`mt-1 text-[18px] font-bold leading-none ${valueClass}`}>{supply.price}</p>
            {supply.tag ? <p className={`mt-1 text-[11px] font-semibold ${tagClass}`}>{supply.tag}</p> : null}
          </div>
          <div className="border-b border-[var(--color-border)] py-2.5">
            <p className={`text-[10px] font-semibold uppercase tracking-[0.04em] ${labelClass}`}>Fitted (Indie)</p>
            <p className={`mt-1 text-[16px] font-bold ${valueClass}`}>{fitted.price}</p>
          </div>
          <div className="pt-2.5">
            <p className={`text-[10px] font-semibold uppercase tracking-[0.04em] ${labelClass}`}>Warranty</p>
            <span className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeClass(isDark)}`}>
              {warranty}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.04em] ${labelClass}`}>Supply Only</p>
          <p className={`mt-1 text-[22px] font-bold leading-none md:text-[24px] ${valueClass}`}>{supply.price}</p>
          {supply.tag ? <p className={`mt-1.5 text-[11px] font-semibold ${tagClass}`}>{supply.tag}</p> : null}

          <div className="mt-3 border-t border-[var(--color-border)] pt-2.5">
            <p className={`text-[10px] font-semibold uppercase tracking-[0.04em] ${labelClass}`}>Fitted (Indie)</p>
            <p className={`mt-1 text-[15px] font-bold ${valueClass}`}>{fitted.price}</p>
          </div>

          <div className="mt-3 flex justify-center">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeClass(isDark)}`}>
              {warranty}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}

function CompareCta({ cta, engineCode, desktop = false, isDark }) {
  if (!cta?.href) return null;

  const label = cleanText(cta.label)
    .replace(/^[→\-\s]+/, "")
    .replace(/\s*→\s*$/, "");

  if (desktop) {
    return (
      <article
        className={`flex h-full flex-col justify-between rounded-xl p-4 text-center ${
          isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-[var(--color-primary)] text-white"
        }`}
      >
        <div className="flex flex-col items-center">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${
              isDark ? "border-[var(--color-page)]/30 bg-[var(--color-page)]/10" : "border-white/35 bg-white/10"
            }`}
          >
            <HomeIcon name="real-inquiries" isDark={!isDark} className="h-6 w-6 object-contain" />
          </span>
          <p className="mt-4 text-[18px] font-bold leading-[1.2]">
            Compare Prices from UK specialists
          </p>
          <p className={`mt-2 text-[13px] leading-[1.4] ${isDark ? "text-[var(--color-page)]/80" : "text-white/85"}`}>
            Get live pricing from 20+ trusted engine suppliers.
          </p>
        </div>
        <Link
          href="/quote"
          className={`mt-5 inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-[13px] font-bold uppercase tracking-[0.04em] ${
            isDark ? "bg-[var(--color-page)] text-white" : "bg-[var(--color-surface)] text-[var(--color-text)]"
          }`}
        >
          Compare Prices →
        </Link>
      </article>
    );
  }

  return (
    <Link
      href="/quote"
      className={`btn-cta mt-1 flex min-h-12 items-center justify-between gap-3 rounded-xl px-3.5 py-3 shadow-[0_12px_28px_var(--color-shadow)] ${
        isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-[var(--color-primary)] text-white"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
          isDark ? "border-[var(--color-page)]/40" : "border-white/40"
        }`}
      >
        <HomeIcon name="real-inquiries" isDark={!isDark} className="h-5 w-5 object-contain" />
      </span>
      <span className="min-w-0 flex-1 text-center text-[13px] font-bold leading-[1.25]">
        {label || `Compare Jaguar ${engineCode} engine prices from UK specialists`}
      </span>
      <span aria-hidden="true" className="text-[18px] font-bold">→</span>
    </Link>
  );
}

export default function CostGuide({ data, engineLabel = "Jaguar Engine" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const engineCode = shortEngineName(engineLabel);
  const rows = data.rows || [];
  const exclusiveNote = cleanText(data.sharedCostNote || "(Exclusive mode – no cross-link)");
  const quoteTag = parseQuotedPrice(rows[0]?.supplyOnly || "").tag || "[JAGUAR-QUOTE]";

  return (
    <section className={`relative w-full overflow-x-hidden py-6 text-[var(--color-text)] md:py-9 ${engineSectionBg(isDark, false)}`}>
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
          {/* Desktop */}
          <div className="hidden gap-4 md:grid md:grid-cols-[minmax(240px,0.85fr)_minmax(0,1.7fr)] md:items-stretch">
            <div className="flex flex-col">
              <PriceGuideHeading engineCode={engineCode} isDark={isDark} />
              <div className="mt-3">
                <MStripe />
              </div>

              <p className={`mt-4 ${sectionDescription} ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
                All prices are estimates from UK specialists{" "}
                <span className="font-semibold text-[var(--color-chrome-bright)]">{quoteTag}</span>
              </p>

              {data.labourEstimate ? (
                <div className={`mt-4 rounded-xl border px-3.5 py-3 ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-[var(--color-primary-soft)]"}`}>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-primary-soft)]">
                      <HomeIcon name="info" isDark={isDark} className="h-4 w-4 object-contain" />
                    </span>
                    <p className={`text-[12px] leading-[1.4] ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
                      {renderTaggedText(data.labourEstimate)}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="mt-auto flex items-center gap-2 pt-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-primary-soft)]">
                  <HomeIcon name="shield" isDark={isDark} className="h-4 w-4 object-contain" />
                </span>
                <p className={`text-[11px] ${isDark ? "text-white/65" : "text-[var(--color-text-soft)]"}`}>{exclusiveNote}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {rows.map((row) => (
                <PriceCard
                  key={row.condition}
                  row={row}
                  popular={cleanText(row.condition).toLowerCase().includes("recondition")}
                  isDark={isDark}
                />
              ))}
              <CompareCta cta={data.cta} engineCode={engineCode} desktop isDark={isDark} />
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <PriceGuideHeading engineCode={engineCode} isDark={isDark} />
            <div className="mt-3">
              <MStripe />
            </div>

            <p className={`mt-4 text-[13px] leading-[1.4] ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
              All prices are estimates from UK specialists
            </p>
            <p className="mt-1 text-[12px] font-semibold text-[var(--color-chrome-bright)]">{quoteTag}</p>

            <div className="mt-4 grid gap-3">
              {rows.map((row) => (
                <PriceCard
                  key={row.condition}
                  row={row}
                  popular={cleanText(row.condition).toLowerCase().includes("recondition")}
                  isDark={isDark}
                  compact
                />
              ))}
            </div>

            {data.labourEstimate ? (
              <div className={`mt-3 flex items-start gap-2.5 rounded-xl border px-3 py-2.5 ${cardClass(isDark)}`}>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-primary-soft)]">
                  <HomeIcon name="info" isDark={isDark} className="h-4 w-4 object-contain" />
                </span>
                <p className={`text-[11px] leading-[1.4] ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
                  {renderTaggedText(data.labourEstimate)}
                </p>
              </div>
            ) : null}

            <div className={`mt-2.5 flex items-center gap-2 rounded-xl border px-3 py-2.5 ${cardClass(isDark)}`}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-primary-soft)]">
                <HomeIcon name="shield" isDark={isDark} className="h-4 w-4 object-contain" />
              </span>
              <p className={`text-[11px] ${isDark ? "text-white/65" : "text-[var(--color-text-soft)]"}`}>{exclusiveNote}</p>
            </div>

            <div className="mt-3">
              <CompareCta cta={data.cta} engineCode={engineCode} isDark={isDark} />
            </div>
          </div>
      </div>
    </section>
  );
}
