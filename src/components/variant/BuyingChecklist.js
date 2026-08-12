"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "../generation/GenIcons";

const ITEM_ICONS = ["ear", "clipboardCheck", "cloud", "fan", "exhaust", "oilDrop", "engineWarning", "clipboardSearch"];

function splitItem(item = "") {
  const clean = item.replace(/^\*\s*/, "");
  const dashIndex = clean.indexOf(" - ");
  if (dashIndex === -1) return { label: clean, text: "" };
  return { label: clean.slice(0, dashIndex), text: clean.slice(dashIndex + 3) };
}

function TrustCard({ className = "", isDark }) {
  const cardBorder = isDark ? "border-white/10" : "border-[var(--color-border)]";
  const cardBg = isDark ? "bg-[rgba(2,7,17,0.75)]" : "bg-[var(--color-surface)]";
  const titleClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyClass = isDark ? "text-white/80" : "text-[var(--color-text-muted)]";

  return (
    <div className={`flex w-full max-w-[360px] items-center gap-3 rounded-xl border ${cardBorder} ${cardBg} p-3.5 shadow-sm backdrop-blur ${className}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
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
    <section className="relative w-full overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
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
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,17,0.95)_0%,rgba(2,7,17,0.75)_38%,rgba(2,7,17,0.25)_75%)]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(2,7,17,0.85)_0%,transparent_100%)]" />
          </>
        ) : null}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-8xl px-4 py-8 md:px-8 md:py-10 lg:pr-[400px]">
        <div className="flex flex-col gap-5 lg:max-w-[720px]">
          <div>
            <h2 className={`text-[2.15rem] font-bold leading-[1.1] tracking-normal md:text-[3rem] ${headingClass}`}>Buying Checklist</h2>
            <div className="mt-3">
              <MStripe />
            </div>
            {data.intro ? (
              <p className={`mt-4 max-w-[560px] text-[0.88rem] leading-[1.5] md:text-[1rem] ${bodyTextClass}`} dangerouslySetInnerHTML={{ __html: data.intro }} />
            ) : null}
          </div>

          {data.items?.length > 0 ? (
            <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4">
              {data.items.map((item, index) => {
                const { label, text } = splitItem(item);
                return (
                  <div key={item} className="relative flex flex-col items-center gap-2 rounded-md bg-[var(--color-surface)] p-4 text-center shadow-[0_14px_40px_var(--color-shadow)]">
                    <span className="absolute left-3 top-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)] text-[0.7rem] font-bold text-white">
                      {index + 1}
                    </span>
                    <GenIcon name={ITEM_ICONS[index % ITEM_ICONS.length]} className="mt-2 h-10 w-10 text-[var(--color-primary)]" />
                    <p className="text-[0.92rem] font-bold leading-tight text-[var(--color-text)]">{label}</p>
                    {text ? <p className="text-[0.8rem] leading-[1.4] text-[var(--color-text-muted)]">{text}</p> : null}
                  </div>
                );
              })}

              <div className="absolute bottom-0 left-full ml-6 hidden w-[340px] lg:block">
                <TrustCard isDark={isDark} />
              </div>
            </div>
          ) : null}

          <TrustCard className="lg:hidden" isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
