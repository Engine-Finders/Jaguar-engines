"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";

function VariantPanel({ title, icon, variants, tone, isDark }) {
  if (!variants?.length) return null;
  const isDiesel = tone === "diesel";
  const labelToneClass = isDiesel ? "text-[var(--color-primary)]" : "text-[#189454]";
  const blockToneClass = isDiesel ? "bg-[var(--color-primary)]" : "bg-[#189454]";
  const textClass = isDark ? "text-white" : "text-[var(--color-text)]";
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
  const image = isDark ? "/e90/core_dark.webp" : "/e90/core_light.webp";
  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const scopeNoteTextClass = isDark ? "text-white/85" : "text-[var(--color-text-muted)]";
  const scopeNoteStrongClass = isDark ? "text-white" : "text-[var(--color-text)]";

  const scopeNoteBlock = data.scopeNote ? (
    <div className="glass-panel flex gap-3 rounded-md p-4">
      <span className="mt-0.5 shrink-0 text-[var(--color-primary)]">
        <GenIcon name="info" className="h-5 w-5" />
      </span>
      <p className={`text-[0.82rem] leading-[1.5] ${scopeNoteTextClass}`}>
        <span className={`font-semibold ${scopeNoteStrongClass}`}>Scope note: </span>
        <span dangerouslySetInnerHTML={{ __html: data.scopeNote }} />
      </p>
    </div>
  ) : null;

  const variantPanels = (
    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
  );

  return (
    <section className="w-full bg-[var(--color-page)]">
      {/* MOBILE: no background image — plain page background, content stacks in normal flow */}
      <div className="px-4 py-8 text-[var(--color-text)] md:hidden">
        <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          {data.subheading || "Core Variants"}
        </p>
        <h2 className="mt-1.5 text-[2.15rem] font-bold leading-[1.1] tracking-normal">
          {data.h2 || "Diesel &amp; Petrol Lineup"}
        </h2>
        <div className="mt-2.5">
          <MStripe />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {variantPanels}
          {scopeNoteBlock}
        </div>
      </div>

      {/* DESKTOP: full-bleed background image with content overlaid on top */}
      <div
        className={`relative hidden overflow-hidden md:block md:h-[380px] lg:h-[400px] ${headingClass}`}
      >
        <div className="absolute inset-0">
          <Image
            src={image}
            alt="BMW 3 Series E90"
            fill
            className="object-cover object-right"
            sizes="100vw"
          />
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,17,0.9)_0%,rgba(2,7,17,0.55)_38%,transparent_75%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(2,7,17,0.65)_0%,transparent_28%)]" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.6)_38%,transparent_75%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.7)_0%,transparent_28%)]" />
            </>
          )}
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-8xl flex-col justify-start px-8 py-5">
          <div className="flex w-full max-w-[640px] flex-col gap-4">
            <div>
              <h2 className={`text-[3rem] font-bold leading-[1.1] tracking-normal ${headingClass}`}>
                {data.h2 || "Core Variants"}
              </h2>
              <div className="mt-3">
                <MStripe />
              </div>
            </div>

            {variantPanels}
            {scopeNoteBlock}
          </div>
        </div>
      </div>
    </section>
  );
}
