"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import GenIcon from "./GenIcons";
import MStripe from "@/components/reusableComponents/MStripe";
import { generationSectionBg, splitBestWorstEnginesH2, sectionH2 } from "./generationSection";

const VISIBLE_CARDS = 4;

const typeStyles = {
  dieselBest: {
    icon: "check",
    color: "#189454",
    colorDark: "#22a866",
    accent: "border-b-[#189454]",
    label: "text-[#189454]",
    labelDark: "text-[#3ecf7a]",
  },
  petrolBest: {
    icon: "gauge",
    color: "#2484ff",
    colorDark: "#4da0ff",
    accent: "border-b-[#2484ff]",
    label: "text-[#2484ff]",
    labelDark: "text-[#6bb4ff]",
  },
  danger: {
    icon: "warning",
    color: "#e03232",
    colorDark: "#f04a4a",
    accent: "border-b-[#e03232]",
    label: "text-[#e03232]",
    labelDark: "text-[#ff6b6b]",
  },
  fire: {
    icon: "dollar",
    color: "#da7a12",
    colorDark: "#f09028",
    accent: "border-b-[#da7a12]",
    label: "text-[#da7a12]",
    labelDark: "text-[#ffb04a]",
  },
  diamond: {
    icon: "diamond",
    color: "#189454",
    colorDark: "#22a866",
    accent: "border-b-[#189454]",
    label: "text-[#189454]",
    labelDark: "text-[#3ecf7a]",
  },
  crown: {
    icon: "shield",
    color: "#111210",
    colorDark: "#c8c9c4",
    accent: "border-b-[var(--color-primary)]",
    label: "text-[var(--color-text)]",
    labelDark: "text-[var(--color-chrome-bright)]",
  },
};

function slotStyleKey(slot = "", type) {
  if (type && typeStyles[type]) return type;

  const label = slot.toLowerCase();
  if (label.includes("best diesel")) return "dieselBest";
  if (label.includes("best petrol")) return "petrolBest";
  if (label.includes("highest risk")) return "danger";
  if (label.includes("most expensive")) return "fire";
  if (label.includes("best value")) return "diamond";
  if (label.includes("most overlooked")) return "crown";

  return "dieselBest";
}

function resolveStyle(item, isDark = false) {
  const key = slotStyleKey(item.slot, item.type);
  const base = typeStyles[key] || typeStyles.dieselBest;
  if (!isDark) {
    return { ...base, iconTextClass: "text-white" };
  }

  return {
    ...base,
    color: base.colorDark || base.color,
    label: base.labelDark || base.label,
    iconTextClass: key === "crown" ? "text-black" : "text-white",
  };
}

function isOverlookedItem(item) {
  return item.fullWidth || item.slot?.toLowerCase().includes("most overlooked");
}

function hasItemContent(item) {
  if (!item) return false;
  return [item.slot, item.engine, item.quote, item.whoItsFor].some((value) =>
    String(value ?? "")
      .replace(/<[^>]+>/g, "")
      .trim()
  );
}

function SectionHeader({ data, isDark, sectionBg }) {
  const title = splitBestWorstEnginesH2(data.h2 || "Best &amp; Worst Engines");
  const generationCode = data.generationCode || "";
  const heading = title.accent || title.main || "Best & Worst Engines";
  const watermarkClass = isDark ? "text-white/[0.04]" : "text-black/[0.04]";

  return (
    <div className={`relative overflow-hidden ${sectionBg}`}>
      {generationCode ? (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-[4%] top-1/2 hidden -translate-y-1/2 select-none font-heading text-[8.5rem] font-bold leading-none tracking-tight md:block lg:text-[10rem] ${watermarkClass}`}
        >
          {generationCode}
        </div>
      ) : null}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute right-0 top-0 hidden h-full w-[38%] md:block ${isDark ? "opacity-20" : "opacity-35"}`}
      >
        <svg viewBox="0 0 420 260" className="h-full w-full" fill="none" preserveAspectRatio="xMaxYMid slice">
          <path d="M40 220C120 120 180 40 320 20" stroke="currentColor" strokeWidth="1.5" className={isDark ? "text-white/30" : "text-[#c8c9c4]"} />
          <path d="M80 250C170 150 230 70 380 48" stroke="currentColor" strokeWidth="1.5" className={isDark ? "text-white/20" : "text-[#d5d6d1]"} />
        </svg>
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-5 md:px-8 md:pb-4 md:pt-6">
        <h2
          className={`tracking-normal text-[var(--color-text)] ${sectionH2} ${isDark ? "text-white" : ""}`}
          dangerouslySetInnerHTML={{ __html: heading }}
        />
        <div className="mt-2.5">
          <MStripe />
        </div>
      </div>
    </div>
  );
}

function EngineCard({ item, isDark }) {
  const style = resolveStyle(item, isDark);
  const cardSurfaceClass = isDark
    ? "border-white/15 bg-[rgba(20,21,21,0.96)] shadow-[0_10px_28px_rgba(0,0,0,0.4)]"
    : "border-[var(--color-border)] bg-white shadow-[0_10px_28px_rgba(17,18,16,0.08)]";
  const bodyTextClass = isDark ? "text-white/72" : "text-[var(--color-text-muted)]";
  const titleTextClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const noteBgClass = isDark ? "bg-white/[0.06] text-white/55" : "bg-[var(--color-page-soft)] text-[var(--color-text-soft)]";

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-xl border ${cardSurfaceClass} ${style.accent} border-b-[4px]`}
    >
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.iconTextClass}`}
            style={{ backgroundColor: style.color }}
          >
            <GenIcon name={style.icon} className="h-4 w-4" />
          </span>
          <p className={`text-[0.68rem] font-bold uppercase tracking-[0.08em] ${style.label}`} dangerouslySetInnerHTML={{ __html: item.slot }} />
        </div>

        <p className={`mt-3 text-[0.98rem] font-bold leading-[1.25] ${titleTextClass}`}>
          <span dangerouslySetInnerHTML={{ __html: item.engine }} />
          {item.engineNote ? (
            <span className={`mt-0.5 block text-[0.72rem] font-normal ${bodyTextClass}`} dangerouslySetInnerHTML={{ __html: item.engineNote }} />
          ) : null}
        </p>

        <div className="relative mx-auto my-3 h-36 w-full max-w-[210px]">
          <Image src="/e90/engine.webp" alt="" fill className="object-contain" sizes="210px" />
        </div>

        <p className={`text-[0.8rem] leading-[1.45] ${bodyTextClass}`}>
          &ldquo;<span dangerouslySetInnerHTML={{ __html: item.quote }} />&rdquo;
        </p>

        <p className={`mt-auto border-t pt-3 text-[0.78rem] leading-[1.35] ${isDark ? "border-white/12 text-white/88" : "border-[var(--color-border)] text-[var(--color-text)]"}`}>
          <span className="font-semibold" style={{ color: style.color }}>
            Who it&apos;s for:
          </span>{" "}
          <span dangerouslySetInnerHTML={{ __html: item.whoItsFor }} />
        </p>

        {item.modelWideNote ? (
          <p className={`mt-2 rounded-md p-2 text-[0.68rem] leading-[1.3] ${noteBgClass}`} dangerouslySetInnerHTML={{ __html: item.modelWideNote }} />
        ) : null}
      </div>
    </article>
  );
}

function CarouselControls({ page, pageCount, onPrev, onNext, onSelectPage, isDark, showDots = true }) {
  const canPrev = page > 0;
  const canNext = page < pageCount - 1;
  const buttonBase = "flex h-9 w-9 items-center justify-center rounded-full border transition-colors";
  const activeClass = isDark
    ? "border-white/20 bg-white text-black"
    : "border-[var(--color-border)] bg-white text-[var(--color-text)]";
  const disabledClass = isDark
    ? "border-white/10 bg-transparent text-white/25"
    : "border-[var(--color-border)] bg-white text-[var(--color-text-soft)]";

  return (
    <div className={`flex flex-col items-center gap-3 ${showDots ? "" : ""}`}>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Previous engines"
          className={`${buttonBase} ${canPrev ? activeClass : disabledClass}`}
        >
          <GenIcon name="chevron" className="h-4 w-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          aria-label="Next engines"
          className={`${buttonBase} ${canNext ? (isDark ? "border-white bg-black text-white" : "border-black bg-black text-white") : disabledClass}`}
        >
          <GenIcon name="chevron" className="h-4 w-4" />
        </button>
      </div>

      {showDots ? (
        <div className="flex items-center gap-1.5">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => onSelectPage(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === page
                  ? `w-4 ${isDark ? "bg-white" : "bg-black"}`
                  : `w-1.5 ${isDark ? "bg-white/25" : "bg-black/20"}`
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function OverlookedBanner({ item, databaseCta, isDark }) {
  if (!hasItemContent(item)) return null;

  const cta = databaseCta || { label: "View Full Engine Database →", href: "#" };
  const ctaLabel = cta.label?.replace(/\s*→\s*$/, "").trim();

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[var(--color-border)] ${
        isDark ? "bg-[rgba(20,21,21,0.92)]" : "bg-[rgba(255,255,255,0.82)]"
      } shadow-[0_10px_28px_rgba(17,18,16,0.08)]`}
    >
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-[88px_1.2fr_0.95fr_auto] md:items-center md:gap-5 md:p-5">
        <div className="flex items-start justify-center md:justify-start">
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${
              isDark ? "border-white/20 bg-[rgba(255,255,255,0.06)]" : "border-[var(--color-border)] bg-white"
            }`}
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-full ${isDark ? "bg-white/10" : "bg-[var(--color-page-soft)]"}`}>
              <HomeIcon name="shield" isDark={isDark} className="h-7 w-7 object-contain" />
            </span>
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-[0.82rem] font-bold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: item.slot }} />
          <p className="mt-1 text-[1rem] font-bold leading-tight text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: item.engine }} />
          {item.engineNote ? (
            <p className="mt-0.5 text-[0.78rem] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.engineNote }} />
          ) : null}
          <p className="mt-2 text-[0.84rem] leading-[1.5] text-[var(--color-text-muted)]">
            &ldquo;<span dangerouslySetInnerHTML={{ __html: item.quote }} />&rdquo;
          </p>
        </div>

        <div className="min-w-0 border-t border-[var(--color-border)] pt-3 md:border-t-0 md:pt-0">
          <p className="text-[0.82rem] leading-[1.5] text-[var(--color-text)]">
            <span className="font-semibold text-[var(--color-text)]">Who it&apos;s for: </span>
            <span dangerouslySetInnerHTML={{ __html: item.whoItsFor }} />
          </p>
        </div>

        {ctaLabel ? (
          <a
            href={cta.href || "#"}
            className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border px-4 text-[0.78rem] font-semibold whitespace-nowrap ${
              isDark
                ? "border-white/20 bg-transparent text-white hover:bg-white/5"
                : "border-[var(--color-border-strong)] bg-white text-[var(--color-text)] hover:bg-[var(--color-page-soft)]"
            }`}
          >
            <span dangerouslySetInnerHTML={{ __html: ctaLabel }} />
            <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function BestWorstEngines({ data }) {
  const { theme } = useTheme();
  const [page, setPage] = useState(0);

  if (!data) return null;

  const isDark = theme === "dark";
  const sectionBg = generationSectionBg(isDark, true);
  const items = data.items || [];
  const carouselItems = items.filter((item) => !isOverlookedItem(item) && hasItemContent(item));
  const overlookedItems = items.filter((item) => isOverlookedItem(item) && hasItemContent(item));

  if (carouselItems.length === 0 && overlookedItems.length === 0) return null;

  const maxSlideIndex = Math.max(0, carouselItems.length - VISIBLE_CARDS);
  const slideCount = maxSlideIndex + 1;

  const goToSlide = (nextSlide) => {
    setPage(Math.max(0, Math.min(maxSlideIndex, nextSlide)));
  };

  return (
    <section className={`w-full overflow-x-hidden text-[var(--color-text)] ${sectionBg}`}>
      <SectionHeader data={data} isDark={isDark} sectionBg={sectionBg} />

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5">
        <div className="flex flex-col gap-3 sm:hidden">
          {carouselItems.map((item) => (
            <EngineCard key={item.slot} item={item} isDark={isDark} />
          ))}
        </div>

        <div className="hidden sm:block">
          <div className="flex items-start gap-4 lg:gap-5">
            <div className="min-w-0 flex-1 [--card-width:calc((100%-3rem)/4)]">
              <div className="overflow-hidden w-full">
                <div
                  className="flex gap-4 transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(calc(-${page} * (var(--card-width) + 1rem)))`,
                  }}
                >
                  {carouselItems.map((item) => (
                    <div key={item.slot} className="w-[var(--card-width)] shrink-0">
                      <EngineCard item={item} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </div>

              {slideCount > 1 ? (
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: slideCount }, (_, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Go to slide ${index + 1}`}
                        onClick={() => goToSlide(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          index === page
                            ? `w-4 ${isDark ? "bg-white" : "bg-black"}`
                            : `w-1.5 ${isDark ? "bg-white/25" : "bg-black/20"}`
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {slideCount > 1 ? (
              <CarouselControls
                page={page}
                pageCount={slideCount}
                isDark={isDark}
                showDots={false}
                onPrev={() => goToSlide(page - 1)}
                onNext={() => goToSlide(page + 1)}
                onSelectPage={goToSlide}
              />
            ) : null}
          </div>
        </div>

        {overlookedItems.length > 0 ? (
          <div className="mt-4 flex flex-col gap-3 md:mt-5">
            {overlookedItems.map((item) => (
              <OverlookedBanner key={item.slot} item={item} databaseCta={data.databaseCta} isDark={isDark} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
