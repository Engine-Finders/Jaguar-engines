"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";
import HomeIcon from "@/components/home/homeIcons";
import GenerationSectionHeader from "./GenerationSectionHeader";
import {
  generationSectionBg,
  resolveGenerationHeroAlt,
  resolveGenerationHeroImage,
  splitTrustCtaH2,
} from "./generationSection";

const TRUST_POINT_ICONS = ["genuine-failure-data", "honest-verdict", "vetted-specialist"];

function trustPointIconBoxClass(isDark) {
  return isDark
    ? "border-white/20 bg-[rgba(255,255,255,0.04)]"
    : "border-[var(--color-border)] bg-[rgba(255,255,255,0.72)]";
}

function glassCtaClass(isDark) {
  return [
    "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-4 py-3 text-center text-[0.68rem] font-bold uppercase leading-snug tracking-wide backdrop-blur-xl backdrop-saturate-150 transition-colors md:w-auto md:whitespace-nowrap md:px-6 md:text-[0.74rem]",
    isDark
      ? "border-white/20 bg-[rgba(255,255,255,0.08)] text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)] hover:bg-[rgba(255,255,255,0.12)]"
      : "border-[var(--color-border-strong)] bg-[rgba(255,255,255,0.58)] text-[var(--color-text)] shadow-[0_10px_28px_rgba(17,18,16,0.12)] hover:bg-[rgba(255,255,255,0.78)]",
  ].join(" ");
}

function bottomBarClass(isDark) {
  return [
    "glass-panel overflow-hidden rounded-md border backdrop-blur-xl backdrop-saturate-150",
    isDark
      ? "border-white/15 bg-[rgba(20,21,21,0.72)] shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
      : "border-[var(--color-glass-border)] bg-[rgba(255,255,255,0.62)] shadow-[0_12px_32px_rgba(17,18,16,0.1)]",
  ].join(" ");
}

function TrustPoint({ point, icon, isDark }) {
  return (
    <li className="flex items-start gap-4">
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-md border ${trustPointIconBoxClass(isDark)}`}
      >
        <HomeIcon name={icon} isDark={isDark} className="h-8 w-8 object-contain" />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p
          className={`text-[0.95rem] font-bold leading-snug md:text-[1rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}
          dangerouslySetInnerHTML={{ __html: point.title }}
        />
        <p
          className={`mt-1.5 text-[0.82rem] leading-[1.5] md:text-[0.88rem] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}
          dangerouslySetInnerHTML={{ __html: point.text }}
        />
      </div>
    </li>
  );
}

export default function TrustCta({ data, hero }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const sectionBg = generationSectionBg(isDark, true);
  const title = splitTrustCtaH2(data.h2 || "Trust JaguarEngine.uk");
  const image = resolveGenerationHeroImage(hero, isDark);
  const imageAlt = resolveGenerationHeroAlt(hero);
  const ctaHref = data.ctaButton?.href || "/quote";
  const ctaLabel = data.ctaButton?.label?.replace(/\s*→\s*$/, "").trim();

  return (
    <section className={`w-full overflow-x-hidden text-[var(--color-text)] ${sectionBg}`}>
      <GenerationSectionHeader title={title} subHeadline={data.subHeadline} isDark={isDark} sectionBg={sectionBg} />

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-8">
          {data.trustPoints?.length > 0 ? (
            <ul className="flex flex-col gap-5 md:gap-6">
              {data.trustPoints.map((point, index) => (
                <TrustPoint
                  key={point.title}
                  point={point}
                  icon={TRUST_POINT_ICONS[index % TRUST_POINT_ICONS.length]}
                  isDark={isDark}
                />
              ))}
            </ul>
          ) : null}

          <div className="relative h-[160px] overflow-hidden rounded-md border border-[var(--color-border)] shadow-[0_14px_40px_var(--color-shadow)] sm:h-[180px] lg:h-[200px]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover object-[68%_center]"
              sizes="(max-width: 1024px) 100vw, 520px"
            />
          </div>
        </div>

        {data.finalCta || ctaLabel ? (
          <div className={`mt-5 md:mt-6 ${bottomBarClass(isDark)}`}>
            <div className="grid grid-cols-1 items-center gap-4 p-4 md:grid-cols-[72px_1fr_auto] md:gap-5 md:p-5">
              <div className="flex items-start justify-start md:justify-center">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 ${
                    isDark ? "border-white/20 bg-[rgba(255,255,255,0.06)]" : "border-[var(--color-border)] bg-white"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${
                      isDark ? "bg-white/10" : "bg-[var(--color-page-soft)]"
                    }`}
                  >
                    <HomeIcon name="engine-finders" isDark={isDark} className="h-7 w-7 object-contain" />
                  </span>
                </span>
              </div>

              {data.finalCta ? (
                <p
                  className={`text-[0.84rem] leading-[1.55] md:text-[0.92rem] ${isDark ? "text-white/88" : "text-[var(--color-text-muted)]"}`}
                  dangerouslySetInnerHTML={{ __html: data.finalCta }}
                />
              ) : (
                <span />
              )}

              {ctaLabel ? (
                <a href={ctaHref} className={glassCtaClass(isDark)}>
                  <span dangerouslySetInnerHTML={{ __html: ctaLabel }} />
                  <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
