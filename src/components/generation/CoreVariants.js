"use client";

import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";
import GenerationSectionHeader from "./GenerationSectionHeader";
import { generationSectionBg, splitCoreVariantsH2 } from "./generationSection";

function VariantPanel({ title, icon, variants, tone, isDark }) {
  if (!variants?.length) return null;
  const isDiesel = tone === "diesel";
  const labelToneClass = isDiesel ? "text-[var(--color-primary)]" : "text-[#189454]";
  const blockToneClass = isDiesel
    ? isDark
      ? "bg-[var(--color-chrome)]"
      : "bg-[var(--color-primary)]"
    : "bg-[#189454]";
  const textClass = isDark ? "text-white/88" : "text-[var(--color-text)]";
  const separatorClass = isDark ? "text-white/50" : "text-[var(--color-text-soft)]";

  return (
    <div className="glass-panel flex items-stretch overflow-hidden rounded-md">
      <span
        className={`flex w-16 shrink-0 items-center justify-center text-white ${blockToneClass}`}
        style={{ clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)" }}
      >
        <GenIcon name={icon} className="h-7 w-7" />
      </span>
      <div className="min-w-0 flex-1 py-4 pl-3 pr-4">
        <p className={`text-[0.76rem] font-semibold uppercase tracking-wide ${labelToneClass}`}>
          {title}
        </p>
        <p className={`mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.98rem] font-bold leading-snug ${textClass}`}>
          {variants.map((variant, index) => (
            <span key={variant.url || variant.name || index} className="inline-flex items-center">
              <Link
                href={variant.url || "#"}
                className={`cursor-pointer rounded-sm px-1 py-0.5 transition-colors duration-200 hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:outline-none active:text-[var(--color-primary)] ${textClass}`}
                dangerouslySetInnerHTML={{ __html: variant.name }}
              />
              {index < variants.length - 1 ? (
                <span aria-hidden="true" className={separatorClass}>
                  •
                </span>
              ) : null}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export default function CoreVariants({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const sectionBg = generationSectionBg(isDark, true);
  const headerText =
    data.h2 ||
    [data.subheading, "Diesel & Petrol Lineup"].filter(Boolean).join(" - ");
  const title = splitCoreVariantsH2(headerText);

  const scopeNoteBlock = data.scopeNote ? (
    <div className="glass-panel flex gap-3 rounded-md p-4">
      <span className="mt-0.5 shrink-0 text-[var(--color-primary)]">
        <GenIcon name="info" className="h-5 w-5" />
      </span>
      <p className={`text-[0.82rem] leading-[1.5] ${isDark ? "text-white/85" : "text-[var(--color-text-muted)]"}`}>
        <span className={`font-semibold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>Scope note: </span>
        <span dangerouslySetInnerHTML={{ __html: data.scopeNote }} />
      </p>
    </div>
  ) : null;

  return (
    <section className={`w-full text-[var(--color-text)] ${sectionBg}`}>
      <GenerationSectionHeader title={title} subHeadline={data.subHeadline} isDark={isDark} sectionBg={sectionBg} />

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
          <VariantPanel
            title="Diesel Variants"
            icon="drum"
            variants={data.dieselVariants}
            tone="diesel"
            isDark={isDark}
          />
          <VariantPanel
            title="Petrol Variants"
            icon="drum"
            variants={data.petrolVariants}
            tone="petrol"
            isDark={isDark}
          />
        </div>

        {scopeNoteBlock ? <div className="mt-3 md:mt-4">{scopeNoteBlock}</div> : null}
      </div>
    </section>
  );
}
