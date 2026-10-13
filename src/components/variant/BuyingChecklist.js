"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "../generation/GenIcons";
import { variantSectionBg, VariantSectionHeading, primaryBadgeClass, indexBadgeClass } from "./variantSection";

const ITEM_ICONS = ["ear", "clipboardCheck", "cloud", "fan", "exhaust", "oilDrop", "engineWarning", "clipboardSearch"];

function splitItem(item = "") {
  const clean = item.replace(/^\*\s*/, "");
  const dashIndex = clean.indexOf(" - ");
  if (dashIndex === -1) return { label: clean, text: "" };
  return { label: clean.slice(0, dashIndex), text: clean.slice(dashIndex + 3) };
}

function TrustCard({ className = "", isDark }) {
  const cardBorder = isDark ? "border-white/10" : "border-[var(--color-border)]";
  const cardBg = isDark ? "bg-[var(--color-surface-glass)]" : "bg-[var(--color-surface)]";
  const titleClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyClass = isDark ? "text-white/80" : "text-[var(--color-text-muted)]";

  return (
    <div className={`flex w-full max-w-[360px] items-center gap-3 rounded-xl border ${cardBorder} ${cardBg} p-3.5 shadow-sm backdrop-blur ${className}`}>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${primaryBadgeClass(isDark)}`}>
        <GenIcon name="shield" className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className={`text-[0.92rem] font-bold leading-tight ${titleClass}`}>Buy smart. Drive with confidence.</p>
        <p className={`mt-1 text-[0.8rem] leading-[1.4] ${bodyClass}`}>
          A few checks today can save thousands tomorrow. Use this checklist to avoid the most common 320d pitfalls.
        </p>
      </div>
    </div>
  );
}

export default function BuyingChecklist({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const image = isDark ? "/320d/checklist_dark.webp" : "/320d/checklist_light.webp";
  const imageMobile = isDark ? "/320d/checklist_mobile_dark.webp" : "/320d/checklist_mobile_light.webp";
  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyTextClass = isDark ? "text-white/80" : "text-[var(--color-text-muted)]";

  return (
    <section className={`relative w-full overflow-x-hidden text-[var(--color-text)] ${variantSectionBg(isDark, false)}`}>
      {/* Mobile: image sits at the top of the section (ModelHero pattern), with a
          seamless fade into the page background in light mode; desktop keeps the
          existing full-bleed background image. */}
      <div className="relative h-[220px] w-full bg-[var(--color-page)] md:hidden">
        <Image src={imageMobile} alt="BMW 320d" fill className="object-cover" sizes="100vw" />
        {isDark ? (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(0deg,rgba(0,0,0,0.85)_0%,transparent_100%)]" />
        ) : (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)]" />
        )}
      </div>

      <div className="absolute inset-0 hidden md:block">
        <Image src={image} alt="BMW 320d" fill className="object-cover object-right" sizes="100vw" />
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,12,12,0.95)_0%,rgba(11,12,12,0.75)_38%,rgba(11,12,12,0.25)_75%)]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(11,12,12,0.85)_0%,transparent_100%)]" />
          </>
        ) : null}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-8xl px-4 py-5 md:px-8 md:py-6">
        <div className="flex flex-col gap-5">
          <div>
            <VariantSectionHeading title="Buying Checklist" className={headingClass} />
            <div className="mt-3">
              <MStripe />
            </div>
            {data.intro ? (
              <p className={`mt-4 max-w-[560px] text-[0.88rem] leading-[1.5] md:text-[1rem] ${bodyTextClass}`} dangerouslySetInnerHTML={{ __html: data.intro }} />
            ) : null}
          </div>

          {data.items?.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px] lg:items-end">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {data.items.map((item, index) => {
                  const { label, text } = splitItem(item);
                  return (
                    <div key={item} className="relative flex flex-col items-center gap-2 rounded-md bg-[var(--color-surface)] p-4 text-center shadow-[0_14px_40px_var(--color-shadow)]">
                      <span className={`absolute left-3 top-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[0.7rem] font-bold ${indexBadgeClass(isDark)}`}>
                        {index + 1}
                      </span>
                      <GenIcon name={ITEM_ICONS[index % ITEM_ICONS.length]} className="mt-2 h-10 w-10 text-[var(--color-primary)]" />
                      <p className="text-[0.92rem] font-bold leading-tight text-[var(--color-text)]">{label}</p>
                      {text ? <p className="text-[0.8rem] leading-[1.4] text-[var(--color-text-muted)]">{text}</p> : null}
                    </div>
                  );
                })}
              </div>

              <TrustCard className="hidden lg:flex" isDark={isDark} />
            </div>
          ) : null}

          <TrustCard className="lg:hidden" isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
