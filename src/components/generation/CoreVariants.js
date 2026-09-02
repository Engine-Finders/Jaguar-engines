"use client";

import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";
import GenerationSectionHeader from "./GenerationSectionHeader";
import { generationSectionBg, splitCoreVariantsH2 } from "./generationSection";

function VariantPanel({ title, icon, variants, tone, isDark }) {
  if (!variants?.length) return null;
  const isDiesel = tone === "diesel";
  const labelToneClass = isDiesel ? (isDark ? "text-[#2484ff]" : "text-[#0b67dc]") : "text-[#189454]";
  const blockToneClass = isDiesel ? (isDark ? "bg-[#2484ff]" : "bg-[#0b67dc]") : "bg-[#189454]";
  const textClass = isDark ? "text-white/88" : "text-[var(--color-text)]";

  return (
    <div className="glass-panel flex items-stretch overflow-hidden rounded-md">
      <span
        className={`flex w-[4.25rem] shrink-0 items-center justify-center text-white ${blockToneClass}`}
        style={{ clipPath: "polygon(0 0, 100% 0, 58% 100%, 0 100%)" }}
      >
        <GenIcon name={icon} className="h-7 w-7" />
      </span>
      <div className="min-w-0 flex-1 py-4 pl-3 pr-4">
        <p className={`text-[0.76rem] font-semibold uppercase tracking-wide ${labelToneClass}`}>
          {title}
        </p>
        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
          {variants.map((variant, index) => (
            <li key={variant.url || variant.name || index} className="min-w-0">
              <Link
                href={variant.url || "#"}
                className={`block text-[0.88rem] font-bold leading-snug transition-colors duration-200 hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:outline-none ${textClass}`}
                dangerouslySetInnerHTML={{ __html: variant.name }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function CoreVariants({ data, grouped = false, className = "" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const sectionBg = grouped ? "" : generationSectionBg(isDark, true);
  const headerBg = generationSectionBg(isDark, true);
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

  const body = (
    <>
      <GenerationSectionHeader
        title={title}
        subHeadline={data.subHeadline}
        isDark={isDark}
        sectionBg={headerBg}
        mobilePlain
      />

      <div className={`relative mx-auto w-full max-w-8xl ${grouped ? "px-0 pb-5 pt-4 md:pb-6 md:pt-5" : "px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5"}`}>
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
            icon="engine"
            variants={data.petrolVariants}
            tone="petrol"
            isDark={isDark}
          />
        </div>

        {scopeNoteBlock ? <div className="mt-3 md:mt-4">{scopeNoteBlock}</div> : null}
      </div>
    </>
  );

  if (grouped) {
    return (
      <section className={`w-full text-[var(--color-text)] ${className}`.trim()}>
        {body}
      </section>
    );
  }

  return (
    <section className={`w-full text-[var(--color-text)] ${sectionBg}`}>
      {body}
    </section>
  );
}
