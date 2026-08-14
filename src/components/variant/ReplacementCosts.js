"use client";

import { useState } from "react";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "../generation/GenIcons";

const ROW_ICONS = ["tag", "refresh", "wrench", "crown"];
const DESKTOP_COLS = "grid-cols-[1.2fr_1fr_1fr_0.9fr_1.4fr]";

function DesktopRow({ row, icon, isDark }) {
  const rowClass = isDark ? "bg-black text-white" : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]";

  return (
    <div className={`grid ${DESKTOP_COLS} items-center gap-px ${rowClass} px-2 py-3 text-[0.82rem] border-b ${borderBottom} last:border-b-0`}>
      <span className="flex items-center gap-2 px-2 font-semibold">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <GenIcon name={icon} className="h-3.5 w-3.5" />
        </span>
        <span dangerouslySetInnerHTML={{ __html: row.engineType }} />
      </span>
      <span className={`px-2 border-l ${cellDivider} ${mutedText}`} dangerouslySetInnerHTML={{ __html: row.supplyOnly }} />
      <span className={`px-2 border-l ${cellDivider} ${mutedText}`} dangerouslySetInnerHTML={{ __html: row.fittedIndie }} />
      <span className={`flex items-center gap-1.5 px-2 border-l ${cellDivider}`}>
        <GenIcon name="shield" className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
        <span dangerouslySetInnerHTML={{ __html: row.warranty }} />
      </span>
      <span className={`px-2 border-l ${cellDivider} ${mutedText}`} dangerouslySetInnerHTML={{ __html: row.bestFor }} />
    </div>
  );
}

// Mobile only: accordion (one open at a time) — a collapsed summary
// card expanding to reveal the full price/warranty/best-for detail, each
// divided by a thin hairline.
function AccordionRow({ row, icon, isOpen, onToggle }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-sm ${
        isOpen ? "border-2 border-[var(--color-primary)]" : "border-[var(--color-border)]"
      } bg-[var(--color-surface)]`}
    >
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
            <GenIcon name={icon} className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.92rem] font-bold leading-tight text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: row.engineType }} />
            <p className="mt-0.5 truncate text-[0.74rem] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: row.bestFor }} />
          </div>
        </div>
        <GenIcon name="chevronDown" className={`h-4 w-4 shrink-0 text-[var(--color-primary)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div className="flex flex-col gap-2.5 px-4 pb-4 text-[0.84rem]">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-[var(--color-border)] pt-2.5">
            <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
              <GenIcon name="tag" className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
              Supply Only
            </span>
            <span className="font-semibold text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: row.supplyOnly }} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-[var(--color-border)] pt-2.5">
            <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
              <GenIcon name="wrench" className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
              Fitted (Indie)
            </span>
            <span className="font-semibold text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: row.fittedIndie }} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-[var(--color-border)] pt-2.5">
            <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
              <GenIcon name="shield" className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
              Warranty
            </span>
            <span className="font-semibold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: row.warranty }} />
          </div>
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 border-t border-[var(--color-border)] pt-2.5">
            <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
              <GenIcon name="users" className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
              Best For
            </span>
            <span className="text-right text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: row.bestFor }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function ReplacementCosts({ data }) {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState(1);
  if (!data) return null;

  const isDark = theme === "dark";
  const headerBg = isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]";
  const headerDivider = isDark ? "border-white/20" : "border-white/25";
  const bodyWrapperBg = isDark ? "bg-black" : "bg-[var(--color-table-surface)]";

  return (
    <section className="w-full bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <h2 className="text-[2.15rem] font-bold leading-[1.1] tracking-normal md:text-[3rem]">{data.h2}</h2>
        <div className="mt-3">
          <MStripe />
        </div>

        {/* Mobile only: accordion list */}
        <div className="mt-6 flex flex-col gap-3 md:hidden">
          {data.rows?.map((row, index) => (
            <AccordionRow
              key={row.engineType}
              row={row}
              icon={ROW_ICONS[index % ROW_ICONS.length]}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Desktop only: original table */}
        <div className="mt-6 hidden overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:block">
          <div className={`grid ${DESKTOP_COLS} gap-px ${headerBg} px-2 py-3 text-[0.82rem] font-semibold text-white`}>
            {data.columns?.map((col, index) => (
              <span key={col} className={`px-2 ${index > 0 ? `border-l ${headerDivider}` : ""}`}>{col}</span>
            ))}
          </div>
          <div className={bodyWrapperBg}>
            {data.rows?.map((row, index) => (
              <DesktopRow key={row.engineType} row={row} icon={ROW_ICONS[index % ROW_ICONS.length]} isDark={isDark} />
            ))}
          </div>
        </div>

        {data.figuresNote ? (
          <div className="glass-panel mt-6 flex gap-3 rounded-md p-4">
            <span className="mt-0.5 shrink-0 text-[var(--color-primary)]">
              <GenIcon name="info" className="h-5 w-5" />
            </span>
            <p className="text-[0.82rem] leading-[1.5] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: data.figuresNote }} />
          </div>
        ) : null}

        {/* Mobile: labour estimate and CTA as two separate stacked cards */}
        {data.labourEstimate ? (
          <div className="mt-4 flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm md:hidden">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
              <GenIcon name="wrench" className="h-4.5 w-4.5" />
            </span>
            <p className="text-[0.82rem] leading-[1.45] text-[var(--color-text)]">
              <span className="font-bold">Labour estimate: </span>
              <span dangerouslySetInnerHTML={{ __html: data.labourEstimate }} />
            </p>
          </div>
        ) : null}

        {/* Desktop: labour estimate + CTA combined into a single row card */}
        {data.labourEstimate || data.cta?.label ? (
          <div className="mt-4 hidden items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm md:flex">
            {data.labourEstimate ? (
              <>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                  <GenIcon name="wrench" className="h-4.5 w-4.5" />
                </span>
                <p className="flex-1 text-[0.82rem] leading-[1.45] text-[var(--color-text)]">
                  <span className="font-bold">Labour estimate: </span>
                  <span dangerouslySetInnerHTML={{ __html: data.labourEstimate }} />
                </p>
              </>
            ) : null}
            {data.cta?.label ? (
              <a
                href="/quote"
                className="btn-cta flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-[0.8rem] font-bold text-white no-underline shadow-[0_12px_28px_var(--color-shadow)]"
              >
                <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
                {data.cta.label}
              </a>
            ) : null}
          </div>
        ) : null}

        {data.cta?.label ? (
          <a
            href="/quote"
            className="btn-cta mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-3 py-2.5 text-white no-underline shadow-[0_12px_28px_var(--color-shadow)] md:hidden"
          >
            <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap text-center text-[0.78rem] font-bold md:text-[0.9rem]">{data.cta.label}</span>
            <GenIcon name="chevron" className="h-4 w-4 shrink-0" />
          </a>
        ) : null}
      </div>
    </section>
  );
}
