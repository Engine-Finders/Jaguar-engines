"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";
import GenBadge from "./GenBadge";

const DESKTOP_COLS = "grid-cols-[0.95fr_0.6fr_1.05fr_0.8fr_0.9fr_1.15fr_1fr_1.05fr_1fr_1.05fr]";
const MOBILE_COLS = "grid-cols-[100px_70px_90px_110px_120px_110px_130px]";
const MOBILE_HEADERS = ["Engine Code", "Fuel", "Power", "Years", "Reliability", "Enquiries", "Avg. Recon Cost"];

function FuelIcon({ fuel = "", className }) {
  return <GenIcon name={fuel.toLowerCase().includes("diesel") ? "engine" : "car"} className={className} />;
}

function Stars({ value = "", className = "text-[1rem]" }) {
  return <span className={`tracking-tight text-[var(--color-primary)] ${className}`}>{value}</span>;
}

function DesktopRow({ engine, isDark }) {
  // Theme-aware row styling — light keeps the original white surface + dark text; dark gets black + white text
  const rowClass = isDark
    ? "bg-black text-white"
    : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const softText = isDark ? "text-white/60" : "text-[var(--color-text-soft)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]";

  return (
    <div
      className={`grid ${DESKTOP_COLS} items-center gap-px ${rowClass} px-4 py-2 text-[0.78rem] border-b ${borderBottom} last:border-b-0`}
    >
      <span className={`min-w-0 px-2 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: engine.engineCode }} />
      <span className={`min-w-0 px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: engine.family }} />
      <span className={`flex min-w-0 items-center gap-1.5 px-2 ${mutedText} border-r ${cellDivider}`}>
        <FuelIcon fuel={engine.fuel} className="h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0" dangerouslySetInnerHTML={{ __html: engine.fuel }} />
      </span>
      <span className={`min-w-0 px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: engine.displacement }} />
      <span className={`min-w-0 px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: engine.power }} />
      <span className={`min-w-0 px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: engine.years }} />
      <span className={`min-w-0 px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: engine.variants }} />
      <span className={`flex min-w-0 flex-col gap-0.5 px-2 border-r ${cellDivider}`}>
        <Stars value={engine.reliability} className="text-[0.85rem]" />
        <GenBadge tag={engine.reliabilityTag} isDark={isDark} />
        {engine.reliabilityDetail ? (
          <span className={`text-[0.64rem] leading-[1.2] ${softText}`} dangerouslySetInnerHTML={{ __html: engine.reliabilityDetail }} />
        ) : null}
      </span>
      <span className={`min-w-0 px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: engine.enquiries }} />
      <span className="min-w-0 px-2 font-semibold" dangerouslySetInnerHTML={{ __html: engine.avgReconCost }} />
    </div>
  );
}

function MobileRow({ engine, isDark }) {
  const rowClass = isDark
    ? "bg-black text-white"
    : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const softText = isDark ? "text-white/60" : "text-[var(--color-text-soft)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]";

  return (
    <div
      className={`grid ${MOBILE_COLS} items-center gap-px ${rowClass} px-3 py-1.5 text-[0.68rem] leading-[1.25] border-b ${borderBottom} last:border-b-0`}
    >
      <span className={`px-1.5 border-r ${cellDivider}`}>
        <span className="block font-semibold" dangerouslySetInnerHTML={{ __html: engine.engineCode }} />
        <span className={`block text-[0.62rem] ${softText}`} dangerouslySetInnerHTML={{ __html: engine.family }} />
      </span>
      <span className={`flex items-center gap-1 px-1.5 ${mutedText} border-r ${cellDivider}`}>
        <FuelIcon fuel={engine.fuel} className="h-3.5 w-3.5 shrink-0" />
        <span dangerouslySetInnerHTML={{ __html: engine.fuel }} />
      </span>
      <span className={`px-1.5 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: engine.power }} />
      <span className={`px-1.5 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: engine.years }} />
      <span className={`flex flex-col items-start gap-1 px-1.5 border-r ${cellDivider}`}>
        <Stars value={engine.reliability} className="text-[0.72rem]" />
        <GenBadge tag={engine.reliabilityTag} isDark={isDark} />
      </span>
      <span className={`px-1.5 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: engine.enquiries }} />
      <span className="flex items-center gap-1 px-1.5 font-semibold">
        <span dangerouslySetInnerHTML={{ __html: engine.avgReconCost }} />
        <GenIcon name="chevron" className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
      </span>
    </div>
  );
}

export default function EngineDatabase({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";

  // Theme-aware header styling — light uses primary blue, dark uses deep navy
  const headerBg = isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]";
  const headerDivider = isDark ? "border-white/20" : "border-white/25";
  const bodyWrapperBg = isDark ? "bg-black" : "bg-[var(--color-table-surface)]";

  return (
    <section className="w-full bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 right-0 hidden w-14 sm:block md:w-auto">
            <Image
              src="/e90/stripe.webp"
              alt=""
              width={220}
              height={220}
              className="h-full w-auto object-contain object-right"
            />
          </span>

          <h2
            className="max-w-[760px] text-[2.15rem] font-bold leading-[1.1] tracking-normal text-[var(--color-text)] md:text-[3rem]"
            dangerouslySetInnerHTML={{ __html: data.h2 }}
          />
          <div className="mt-3">
            <MStripe />
          </div>
          {data.subHeadline ? (
            <p
              className="mt-4 max-w-[920px] text-[0.88rem] leading-[1.4] text-[var(--color-text-muted)] md:mt-5 md:text-[1.08rem] md:leading-[1.42]"
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          ) : null}
        </div>

        <div className="mt-6 hidden overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:block">
          <div className={`grid ${DESKTOP_COLS} gap-px rounded-t-md ${headerBg} px-4 py-2 text-[0.72rem] font-semibold leading-[1.2] text-white`}>
            {data.columns?.map((col) => (
              <span key={col} className={`min-w-0 border-r px-2 ${headerDivider} last:border-r-0`}>{col}</span>
            ))}
          </div>
          <div className={bodyWrapperBg}>
            {data.engines?.map((engine) => (
              <DesktopRow key={engine.engineCode} engine={engine} isDark={isDark} />
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:hidden">
          <div className="min-w-[730px]">
            <div className={`grid ${MOBILE_COLS} gap-px ${headerBg} px-3 py-2 text-[0.68rem] font-semibold leading-[1.2] text-white`}>
              {MOBILE_HEADERS.map((col) => (
                <span key={col} className={`border-r px-1.5 ${headerDivider} last:border-r-0`}>{col}</span>
              ))}
            </div>
            <div className={bodyWrapperBg}>
              {data.engines?.map((engine) => (
                <MobileRow key={engine.engineCode} engine={engine} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>

        {data.confidenceScore?.items?.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 items-center gap-5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:grid-cols-[72px_1fr_1fr_1fr_1.4fr] md:items-start md:gap-0 md:divide-x md:divide-[var(--color-border)]">
            {/* Column 1: Shield icon */}
            <div className="flex items-start justify-start md:pr-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)] text-white">
                <GenIcon name="shield" className="h-8 w-8" />
              </span>
            </div>
            {/* Columns 2-5: info blocks */}
            {data.confidenceScore.items.map((item, index) => {
              const iconTone =
                item.iconColor === "success"
                  ? "text-[#13884a]"
                  : "text-[var(--color-primary)]";
              const labelTone =
                item.iconColor === "success"
                  ? "text-[#13884a]"
                  : "text-[var(--color-primary)]";
              const padding = index === 0 ? "md:pl-4 md:pr-4" : "md:px-4";
              return (
                <div
                  key={`${item.label}-${index}`}
                  className={`flex flex-col gap-1.5 ${padding}`}
                >
                  <p className={`flex items-center gap-2 text-[0.82rem] font-semibold leading-[1.3] ${labelTone}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center ${iconTone}`}>
                      <GenIcon name={item.icon} className="h-5 w-5" />
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: item.label }} />
                  </p>
                  <p className="text-[0.8rem] leading-[1.45] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.text }} />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}