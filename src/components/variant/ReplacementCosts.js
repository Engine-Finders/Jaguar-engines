"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "../generation/GenIcons";
import { variantSectionBg, VariantSectionHeading, tableHeaderClass, primaryBadgeClass, primaryCtaClass, stripCtaArrow } from "./variantSection";

const ROW_ICONS = ["tag", "refresh", "wrench", "crown"];
const DESKTOP_COLS = "grid-cols-[1.2fr_1fr_1fr_0.9fr_1.4fr]";
const HEADER_IMAGE = "/home-image/sec2-bg.webp";

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

// Mobile only: accordion (one open at a time) - a collapsed summary
// card expanding to reveal the full price/warranty/best-for detail, each
// divided by a thin hairline.
function AccordionRow({ row, icon, isOpen, onToggle, isDark }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-sm ${
        isOpen ? "border-2 border-[var(--color-primary)]" : "border-[var(--color-border)]"
      } bg-[var(--color-surface)]`}
    >
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${primaryBadgeClass(isDark)}`}>
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
  const sectionBg = variantSectionBg(isDark, true);
  const headerBg = tableHeaderClass(isDark);
  const headerDivider = isDark ? "border-white/20" : "border-white/25";
  const bodyWrapperBg = isDark ? "bg-black" : "bg-[var(--color-table-surface)]";
  const ctaLabel = stripCtaArrow(data.cta?.label);
  const headerGradient = isDark
    ? "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(11,12,12,0.82)_34%,rgba(11,12,12,0.18)_100%)]"
    : "absolute inset-0 bg-[linear-gradient(90deg,#ececea_0%,rgba(236,236,234,0.88)_34%,rgba(236,236,234,0.18)_100%)]";

  return (
    <section className={`w-full overflow-x-hidden text-[var(--color-text)] ${sectionBg}`}>
      <div className={`relative overflow-hidden ${sectionBg}`}>
        <div className="absolute inset-y-0 right-0 w-[62%] md:w-[48%]">
          <Image src={HEADER_IMAGE} alt="" fill className="object-cover object-right" sizes="(max-width: 768px) 62vw, 48vw" />
          <div className={headerGradient} />
        </div>
        <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-5 md:px-8 md:pb-4 md:pt-6">
          <div className="max-w-[650px]">
            <VariantSectionHeading title={data.h2} />
            <div className="mt-3">
              <MStripe />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-5 md:px-8 md:pb-6">

        {/* Mobile only: accordion list */}
        <div className="mt-6 flex flex-col gap-3 md:hidden">
          {data.rows?.map((row, index) => (
            <AccordionRow
              key={row.engineType}
              row={row}
              icon={ROW_ICONS[index % ROW_ICONS.length]}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Desktop only: original table */}
        <div className="mt-6 hidden overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:block">
          <div className={`grid ${DESKTOP_COLS} gap-px ${headerBg} px-2 py-3 text-[0.82rem] font-semibold`}>
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
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${primaryBadgeClass(isDark)}`}>
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
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${primaryBadgeClass(isDark)}`}>
                  <GenIcon name="wrench" className="h-4.5 w-4.5" />
                </span>
                <p className="flex-1 text-[0.82rem] leading-[1.45] text-[var(--color-text)]">
                  <span className="font-bold">Labour estimate: </span>
                  <span dangerouslySetInnerHTML={{ __html: data.labourEstimate }} />
                </p>
              </>
            ) : null}
            {ctaLabel ? (
              <a
                href="/quote"
                className={`${primaryCtaClass("flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-[0.8rem]")}`}
              >
                {ctaLabel}
                <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
              </a>
            ) : null}
          </div>
        ) : null}

        {ctaLabel ? (
          <a
            href="/quote"
            className={`${primaryCtaClass("mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 md:hidden")}`}
          >
            <span className="whitespace-nowrap text-center text-[0.78rem] font-bold md:text-[0.9rem]">{ctaLabel}</span>
            <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
          </a>
        ) : null}
      </div>
    </section>
  );
}
