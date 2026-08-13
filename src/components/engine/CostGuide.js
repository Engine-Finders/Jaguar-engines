"use client";

import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import { sectionDescription, sectionH2 } from "@/components/models/sectionTypography";

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
  return cleanText(engineLabel).replace(/^BMW\s+/i, "") || "Engine";
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
        <span key={`${part}-${index}`} className="font-semibold text-[var(--color-primary)]">
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

function ConditionIcon({ condition }) {
  const key = cleanText(condition).toLowerCase();

  let path = <path d="M3 12h3m12 0h3M7 9h10v6H7V9Zm2-3h6m-3 0V3M5 15v3m14-3v3M9 18h6" />;
  if (key.includes("recondition")) {
    path = <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />;
  } else if (key.includes("rebuild")) {
    path = <path d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />;
  }

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] md:h-10 md:w-10">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" strokeWidth="1.85">
        {path}
      </svg>
    </span>
  );
}

function PriceCard({ row, popular = false, isDark, compact = false }) {
  const supply = parseQuotedPrice(row.supplyOnly);
  const fitted = parseQuotedPrice(row.fittedIndie);
  const warranty = cleanText(row.warranty);
  const title = cleanText(row.condition).toUpperCase();

  return (
    <article
      className={`relative rounded-xl border px-3.5 py-3.5 md:px-4 md:py-4 ${
        popular
          ? "border-[var(--color-primary)] bg-[var(--color-surface)] shadow-[0_12px_28px_var(--color-shadow)]"
          : cardClass(isDark)
      }`}
    >
      {popular ? (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-md bg-[var(--color-primary)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-white">
          Most Popular
        </span>
      ) : null}

      <div className="flex items-center gap-2.5">
        <ConditionIcon condition={row.condition} />
        <p className="text-[14px] font-bold uppercase tracking-[0.04em] text-[var(--color-text)] md:text-[15px]">{title}</p>
      </div>

      {compact ? (
        <div className="mt-3">
          <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] pb-2.5">
            <p className="pt-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--color-text-soft)]">Supply Only</p>
            <div className="text-right">
              <p className="text-[18px] font-bold leading-none text-[var(--color-text)]">{supply.price}</p>
              {supply.tag ? <p className="mt-1 text-[11px] font-semibold text-[var(--color-primary)]">{supply.tag}</p> : null}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--color-text-soft)]">Fitted (Indie)</p>
            <p className="text-[16px] font-bold text-[var(--color-text)]">{fitted.price}</p>
          </div>
          <div className="flex items-center justify-between gap-3 pt-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--color-text-soft)]">Warranty</p>
            <span className="rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-[11px] font-semibold text-white">
              {warranty}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--color-text-soft)]">Supply Only</p>
          <p className="mt-1 text-[22px] font-bold leading-none text-[var(--color-text)] md:text-[24px]">{supply.price}</p>
          {supply.tag ? <p className="mt-1.5 text-[11px] font-semibold text-[var(--color-primary)]">{supply.tag}</p> : null}

          <div className="mt-3 border-t border-[var(--color-border)] pt-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--color-text-soft)]">Fitted (Indie)</p>
            <p className="mt-1 text-[15px] font-bold text-[var(--color-text)]">{fitted.price}</p>
          </div>

          <div className="mt-3">
            <span className="inline-flex rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-[11px] font-semibold text-white">
              {warranty}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}

function CompareCta({ cta, engineCode, desktop = false }) {
  if (!cta?.href) return null;

  const label = cleanText(cta.label)
    .replace(/^[→\-\s]+/, "")
    .replace(/\s*→\s*$/, "");

  if (desktop) {
    return (
      <article className="flex h-full flex-col justify-between rounded-xl bg-[var(--color-primary)] p-4 text-white">
        <div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M5 19V9m5 10V5m5 14v-7m5 7H3" />
            </svg>
          </span>
          <p className="mt-4 text-[18px] font-bold leading-[1.2]">
            Compare Prices from UK specialists
          </p>
          <p className="mt-2 text-[13px] leading-[1.4] text-white/85">
            Get live pricing from 20+ trusted engine suppliers.
          </p>
        </div>
        <Link
          href="/quote"
          className="btn-cta mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--color-surface)] px-4 text-[13px] font-bold uppercase tracking-[0.04em] text-[var(--color-text)]"
        >
          Compare Prices →
        </Link>
      </article>
    );
  }

  return (
    <Link
      href="/quote"
      className="btn-cta mt-1 flex min-h-12 items-center justify-between gap-3 rounded-xl bg-[var(--color-primary)] px-3.5 py-3 text-white shadow-[0_12px_28px_var(--color-shadow)]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M5 19V9m5 10V5m5 14v-7m5 7H3" />
        </svg>
      </span>
      <span className="min-w-0 flex-1 text-[13px] font-bold leading-[1.25]">
        {label || `Compare BMW ${engineCode} engine prices from UK specialists`}
      </span>
      <span aria-hidden="true" className="text-[18px] font-bold">→</span>
    </Link>
  );
}

export default function CostGuide({ data, engineLabel = "BMW Engine" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const engineCode = shortEngineName(engineLabel);
  const rows = data.rows || [];
  const exclusiveNote = cleanText(data.sharedCostNote || "(Exclusive mode – no cross-link)");
  const quoteTag = parseQuotedPrice(rows[0]?.supplyOnly || "").tag || "[BMW-QUOTE]";

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[var(--color-page)] py-6 text-[var(--color-text)] md:py-9">
      <div className={`absolute inset-0 ${isDark ? "bg-[var(--color-page)]" : "bg-[var(--color-page-soft)]"}`} />

      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
          {/* Desktop */}
          <div className="hidden gap-4 md:grid md:grid-cols-[minmax(240px,0.85fr)_minmax(0,1.7fr)] md:items-stretch">
            <div className="flex flex-col">
              <h2 className={`font-bold tracking-normal ${sectionH2}`}>
                Jaguar <span className="text-[var(--color-primary)]">{engineCode}</span> Engine Price Guide
              </h2>
              <div className="mt-3">
                <MStripe />
              </div>

              <p className={`mt-4 ${sectionDescription} text-[var(--color-text-muted)]`}>
                All prices are estimates from UK specialists{" "}
                <span className="font-semibold text-[var(--color-primary)]">{quoteTag}</span>
              </p>

              {data.labourEstimate ? (
                <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-primary-soft)] px-3.5 py-3">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] text-[12px] font-bold text-[var(--color-primary)]">
                      i
                    </span>
                    <p className="text-[12px] leading-[1.4] text-[var(--color-text-muted)]">
                      {renderTaggedText(data.labourEstimate)}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="mt-auto flex items-center gap-2 pt-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />
                  </svg>
                </span>
                <p className="text-[11px] text-[var(--color-text-soft)]">{exclusiveNote}</p>
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
              <CompareCta cta={data.cta} engineCode={engineCode} desktop />
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <h2 className={`font-bold tracking-normal ${sectionH2}`}>
              Jaguar <span className="text-[var(--color-primary)]">{engineCode}</span> Engine Price Guide
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>

            <p className="mt-4 text-[13px] leading-[1.4] text-[var(--color-text-muted)]">
              All prices are estimates from UK specialists
            </p>
            <p className="mt-1 text-[12px] font-semibold text-[var(--color-primary)]">{quoteTag}</p>

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
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] text-[11px] font-bold text-[var(--color-primary)]">
                  i
                </span>
                <p className="text-[11px] leading-[1.4] text-[var(--color-text-muted)]">
                  {renderTaggedText(data.labourEstimate)}
                </p>
              </div>
            ) : null}

            <div className={`mt-2.5 flex items-center gap-2 rounded-xl border px-3 py-2.5 ${cardClass(isDark)}`}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />
                </svg>
              </span>
              <p className="text-[11px] text-[var(--color-text-soft)]">{exclusiveNote}</p>
            </div>

            <div className="mt-3">
              <CompareCta cta={data.cta} engineCode={engineCode} />
            </div>
          </div>
      </div>
    </section>
  );
}
