"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";

function splitTagPill(tagPill = "") {
  const parts = tagPill.split(" • ");
  return { model: parts[0] || "", body: parts[1] || "", years: parts[2] || "" };
}

// Split a trust-strip label into a leading bold value (a number/short token)
// and the remaining text, plus any trailing [TAG] marker rendered as a separate line.
function splitStat(label = "") {
  const tagMatch = label.match(/\s*\[([^\]]+)\]\s*$/);
  const tag = tagMatch ? tagMatch[1] : "";
  const text = tagMatch ? label.slice(0, tagMatch.index) : label;

  const [first, ...rest] = text.split(" ");
  const hasValue = /[0-9]/.test(first);

  return {
    value: hasValue ? first : "",
    label: hasValue ? rest.join(" ") : text,
    tag,
  };
}

function TrustLabel({ label }) {
  if (label === "Part of Engine Finders") {
    return (
      <>
        <span className="block">Part of Engine</span>
        <span className="block">Finders</span>
      </>
    );
  }
  if (label === "Every Generation, Honestly Rated") {
    return (
      <>
        <span className="block">Every Generation,</span>
        <span className="block">Honestly</span>
        <span className="block">Rated</span>
      </>
    );
  }
  return label;
}

export default function ModelHero({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const pill = splitTagPill(data.tagPill);
  const imageSrc = isDark ? data.image?.dark : data.image?.light || data.image?.dark;

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[var(--color-page)] text-[var(--color-text)] md:min-h-[620px]">
      {/* Full-bleed background image on every breakpoint - mobile: vertical fade (dark for text up top, car visible lower down); desktop: left-to-right fade */}
      <div className="absolute inset-0">
        {/* Mobile: dedicated portrait crop, narrowed and centered so it reads tall/slim rather than stretched full-width */}
        <div className="absolute inset-x-0 top-[20%] bottom-[2%] md:hidden">
          <Image
            src={isDark ? "/e90/hero_mobile_dark.webp" : "/e90/hero_mobile_day.webp"}
            alt={data.image?.alt || ""}
            fill
            className="object-fill"
            sizes="84vw"
            priority
          />
        </div>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={data.image?.alt || ""}
            fill
            className="hidden object-cover md:block"
            sizes="100vw"
            priority
          />
        ) : null}
        {/* Mobile: top-heavy vertical fade so the tag/H1/subheadline stay readable, clearing by the time the car appears lower in frame */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-hero-fade)_0%,var(--color-hero-overlay)_38%,transparent_68%)] md:hidden" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_22%)] md:hidden" />
        {/* Mobile, light mode only: soften the top-left corner so the image blends into the white page background */}
        {!isDark ? (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85)_0%,transparent_45%)] md:hidden" />
        ) : null}
        {/* Light mode only: extra white wash across the very top so it blends cleanly into the page above the hero */}
        {!isDark ? (
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,transparent_30%)]" />
        ) : null}
        {/* Desktop: left-to-right + bottom fade so the image blends into the page color */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-hero-fade)_0%,var(--color-hero-overlay)_35%,transparent_72%)] md:block" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_28%)] md:block" />
      </div>

      <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-5 pt-8 md:min-h-[620px] md:justify-center md:px-8 md:py-10">
        <div className="relative flex w-full max-w-[720px] flex-col gap-3 md:ml-0 md:mt-0 md:gap-4">
          {/* Tag pill */}
          <span
            className={`inline-flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-2 rounded-md border px-3 py-2 text-[0.82rem] leading-[1.35] md:px-4 md:py-2 md:text-[0.88rem] ${
              isDark
                ? "border-white/30 bg-[rgba(2,7,17,0.5)] text-white"
                : "border-[rgba(11,103,220,0.48)] bg-[rgba(255,255,255,0.58)] text-[var(--color-text-muted)]"
            }`}
          >
            <GenIcon name="car" className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
            <strong className="font-semibold text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: pill.model }} />
            {pill.body ? (
              <>
                <span aria-hidden="true" className="opacity-50">•</span>
                <span dangerouslySetInnerHTML={{ __html: pill.body }} />
              </>
            ) : null}
            {pill.years ? (
              <>
                <span aria-hidden="true" className="opacity-50">•</span>
                <span dangerouslySetInnerHTML={{ __html: pill.years }} />
              </>
            ) : null}
          </span>

          {/* Headline */}
          <h1
            className={`text-[32px] font-bold leading-[0.95] tracking-normal md:max-w-[720px] md:text-[3.5rem] md:leading-[0.94] ${
              isDark ? "text-white" : "text-[var(--color-text)]"
            }`}
            dangerouslySetInnerHTML={{ __html: data.h1 }}
          />

          {/* MStripe decorative accent - matches home hero (blue / blue / red / grey slashes + trailing line) */}
          <MStripe />

          {/* subHeadline - sits over the top-heavy fade on mobile, and over the solid background on desktop */}
          <p
            className={`max-w-[78%] text-[0.88rem] leading-[1.42] md:max-w-[620px] md:text-[1.08rem] md:leading-[1.42] ${
              isDark ? "text-white/88" : "text-[var(--color-text-muted)]"
            }`}
            dangerouslySetInnerHTML={{ __html: data.subHeadline }}
          />

          {/* Mobile: spacer so the CTA/stats sit lower, clear of the car in the lower portion of the image */}
          <div className="h-[130px] md:hidden" aria-hidden="true" />

          {/* Mobile: full-width primary CTA - sits below the image card in normal flow */}
          {data.primaryCta ? (
            <Link
              href="/quote"
              className="btn-cta mt-5 inline-flex w-full items-center justify-center gap-3 rounded-md bg-[var(--color-primary)] px-6 py-4 text-[1rem] font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] md:hidden"
            >
              <span dangerouslySetInnerHTML={{ __html: data.primaryCta.label.replace(/\s*→\s*$/, "") }} />
              <GenIcon name="arrow" className="h-5 w-5" />
            </Link>
          ) : null}

          {/* Trust strip - single horizontal bar, icon-first vertical stack per badge, floating dividers */}
          {data.trustStrip?.length > 0 ? (
            <div className="glass-panel mt-5 flex items-stretch justify-center rounded-md px-3 py-2.5 shadow-[0_10px_30px_var(--color-shadow)] md:max-w-fit md:rounded-lg md:px-4 md:py-3">
              {data.trustStrip.map((item, index) => {
                const stat = splitStat(item.label);
                const isSimple = !stat.value && !stat.tag && !stat.label.includes(" ");

                return (
                  <div key={item.label} className="flex items-stretch">
                    {index > 0 ? (
                      <span
                        aria-hidden="true"
                        className={`mx-2.5 my-1.5 w-px shrink-0 self-center md:mx-3 ${isDark ? "bg-white/15" : "bg-[var(--color-border)]"}`}
                        style={{ height: "70%" }}
                      />
                    ) : null}
                    {isSimple ? (
                      /* Simple badge (e.g. Saloon): icon centered on top, single label below */
                      <div className="flex w-full flex-col items-center gap-1.5 text-center">
                        <GenIcon name={item.icon} className="h-5 w-5 text-[var(--color-primary)]" />
                        <span
                          className={`text-[0.7rem] leading-[1.3] ${isDark ? "text-white/85" : "text-[var(--color-text)]"} md:text-[0.82rem]`}
                        >
                          <TrustLabel label={stat.label} />
                        </span>
                      </div>
                    ) : (
                      /* Icon left, parallel with the text starting beside it */
                      <div className="flex items-center gap-2 text-left">
                        <GenIcon name={item.icon} className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
                        <div className="flex flex-col gap-0.5">
                          {stat.value ? (
                            <strong
                              className={`text-[1rem] font-bold leading-none md:text-[1.2rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}
                              dangerouslySetInnerHTML={{ __html: stat.value }}
                            />
                          ) : null}
                          <span
                            className={`text-[0.7rem] leading-[1.3] ${isDark ? "text-white/85" : "text-[var(--color-text)]"} md:text-[0.82rem]`}
                          >
                            <TrustLabel label={stat.label} />
                          </span>
                          {stat.tag ? (
                            <span
                              className={`text-[9px] font-semibold uppercase leading-none tracking-wide ${
                                isDark ? "text-white/55" : "text-[var(--color-text-soft)]"
                              } md:text-[10px]`}
                              dangerouslySetInnerHTML={{ __html: stat.tag }}
                            />
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Desktop-only CTA (pill button) */}
          {data.primaryCta ? (
            <Link
              href="/quote"
              className="btn-cta hidden w-full items-center justify-between rounded-[1.25rem] border border-[var(--color-border-strong)] bg-[var(--color-primary)] px-5 py-4 text-white shadow-lg shadow-black/30 md:flex md:w-fit md:justify-start md:gap-5 md:rounded md:border-0 md:bg-[var(--color-primary)] md:px-7 md:py-3.5 md:text-base md:shadow-lg md:shadow-[var(--color-shadow)]"
            >
              <span className="text-left">
                <span className="block text-lg font-bold tracking-[0.08em] md:text-[1.05rem] md:tracking-normal" dangerouslySetInnerHTML={{ __html: data.primaryCta.label.replace(/\s*→\s*$/, "") }} />
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[rgba(3,14,31,0.55)] md:h-auto md:w-auto md:rounded-none md:border-0 md:bg-transparent">
                <GenIcon name="arrow" className="h-7 w-7" />
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}