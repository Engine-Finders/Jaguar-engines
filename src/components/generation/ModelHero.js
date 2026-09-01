"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import GenIcon from "./GenIcons";
import { splitGenerationHeroH1 } from "./generationSection";

const TRUST_STRIP_ICON_BY_EMOJI = {
  "📊": "real-inquiries",
  "🔧": "vehicle",
  "📖": "engine-codes",
  "🏆": "engine-finders",
};

const TRUST_STRIP_ICONS = ["real-inquiries", "vehicle", "engine-codes", "engine-finders"];

function splitTagPill(tagPill = "") {
  const parts = tagPill.split(" • ");
  return { model: parts[0] || "", body: parts[1] || "", years: parts[2] || "" };
}

function splitStat(label = "") {
  const tagMatch = label.match(/\s*\[([^\]]+)\]\s*$/);
  const tag = tagMatch ? tagMatch[1] : "";
  const text = tagMatch ? label.slice(0, tagMatch.index) : label;

  const [first, ...rest] = text.trim().split(" ");
  const hasValue = /[0-9+]/.test(first);

  return {
    value: hasValue ? first : "",
    label: hasValue ? rest.join(" ") : text.trim(),
    tag,
  };
}

function trustStripIcon(item, index) {
  return TRUST_STRIP_ICON_BY_EMOJI[item.icon] || TRUST_STRIP_ICONS[index] || "real-inquiries";
}

function TrustLabel({ label }) {
  if (label === "Part of Engine Finders") {
    return (
      <>
        <span className="block">Part of</span>
        <span className="block">Engine Finders</span>
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

function HeroHeadline({ h1 = "", isDark }) {
  const parts = splitGenerationHeroH1(h1);
  const textClass = isDark ? "text-white" : "text-[var(--color-text)]";

  return (
    <h1 className={`text-[32px] font-bold leading-[0.95] tracking-normal md:max-w-[720px] md:text-[3.5rem] md:leading-[0.94] ${textClass}`}>
      {parts.before ? <span dangerouslySetInnerHTML={{ __html: parts.before }} /> : null}
      {parts.accent ? (
        <>
          {parts.before ? " " : null}
          <span className="text-[var(--color-chrome-bright)]" dangerouslySetInnerHTML={{ __html: parts.accent }} />
        </>
      ) : null}
    </h1>
  );
}

function DesktopTrustStrip({ items, isDark, cardBorderClass, dividerBorderClass }) {
  if (!items?.length) return null;

  const badgeTextClass = isDark ? "text-white/85" : "text-[var(--color-text)]";
  const badgeMutedClass = isDark ? "text-white/55" : "text-[var(--color-text-soft)]";
  const trustStripClass = `glass-panel hidden w-fit max-w-full shrink-0 rounded-md border ${cardBorderClass} backdrop-blur-sm shadow-[0_10px_30px_var(--color-shadow)] md:block`;

  return (
    <div className={trustStripClass}>
      <div className="flex items-stretch">
        {items.map((item, index) => {
          const stat = splitStat(item.label);
          const hasValue = Boolean(stat.value);
          const isLast = index === items.length - 1;

          return (
            <div
              key={item.label}
              className={`flex shrink-0 items-center gap-3 px-4 py-3.5 text-left ${
                isLast ? "min-w-[9.5rem] pr-5" : ""
              } ${index > 0 ? `border-l ${dividerBorderClass}` : ""}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center">
                <HomeIcon name={trustStripIcon(item, index)} isDark={isDark} className="h-11 w-11 object-contain" />
              </span>
              <div className="flex min-w-0 flex-col gap-0.5 whitespace-normal break-words">
                {hasValue ? (
                  <strong className={`text-[1.2rem] font-bold leading-none ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                    {stat.value}
                  </strong>
                ) : (
                  <strong className={`text-[0.95rem] font-bold leading-tight ${badgeTextClass}`}>
                    <TrustLabel label={stat.label} />
                  </strong>
                )}
                {hasValue && stat.label ? (
                  <span className={`max-w-[11rem] text-[0.82rem] leading-[1.3] ${badgeTextClass}`}>{stat.label}</span>
                ) : null}
                {stat.tag ? (
                  <span className={`text-[10px] font-semibold uppercase leading-none tracking-wide ${badgeMutedClass}`}>
                    {stat.tag}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileTrustStrip({ items, isDark, trustStripClass, dividerBorderClass, badgeTextClass, badgeMutedClass }) {
  if (!items?.length) return null;

  return (
    <div className={`${trustStripClass} mt-3 p-2 md:hidden`}>
      <div className="grid grid-cols-4 gap-x-0.5 text-center">
        {items.map((item, index) => {
          const stat = splitStat(item.label);

          return (
            <div
              key={item.label}
              className={`flex min-w-0 flex-col items-center gap-1 px-0.5 py-1 ${index > 0 ? `border-l ${dividerBorderClass}` : ""}`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                <HomeIcon name={trustStripIcon(item, index)} isDark={isDark} className="h-9 w-9 object-contain" />
              </span>
              {stat.value ? (
                <strong className={`text-[0.72rem] font-bold leading-none ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                  {stat.value}
                </strong>
              ) : null}
              <span className={`text-[0.52rem] leading-[1.2] ${badgeTextClass}`}>
                <TrustLabel label={stat.label} />
              </span>
              {stat.tag ? (
                <span className={`text-[0.45rem] font-semibold uppercase leading-none tracking-wide ${badgeMutedClass}`}>
                  {stat.tag}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ModelHero({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const pill = splitTagPill(data.tagPill);
  const heroImage = isDark ? "/e90/hero_dark.webp" : "/e90/hero_day.webp";
  const heroImageMobile = isDark ? "/e90/hero_mobile_dark.webp" : "/e90/hero_mobile_day.webp";
  const desktopImage = (isDark ? data.image?.dark : data.image?.light) || heroImage;
  const mobileImage = (isDark ? data.image?.mobileDark : data.image?.mobileLight) || heroImageMobile;
  const heroAlt = data.image?.alt || "";
  const heroDescriptionShadow = isDark
    ? ""
    : "[text-shadow:0_0_8px_#fff,0_0_16px_#fff,0_0_24px_rgba(255,255,255,0.9),0_1px_2px_rgba(255,255,255,0.95)]";

  const cardBorderClass = isDark ? "border-white/20" : "border-[var(--color-border)]";
  const dividerBorderClass = isDark ? "border-white/35" : "border-[rgba(7,24,39,0.25)]";
  const badgeTextClass = isDark ? "text-white/85" : "text-[var(--color-text)]";
  const badgeMutedClass = isDark ? "text-white/55" : "text-[var(--color-text-soft)]";
  const trustStripClass = `glass-panel rounded-md border ${cardBorderClass} backdrop-blur-sm shadow-[0_10px_30px_var(--color-shadow)]`;

  return (
    <section className="relative min-h-[calc(100svh-84px)] overflow-hidden bg-[var(--color-page)] text-[var(--color-text)] md:min-h-[580px]">
      <div className="absolute inset-0">
        <Image
          src={mobileImage}
          alt={heroAlt}
          fill
          className="object-cover object-[center_58%] md:hidden"
          sizes="100vw"
          priority
        />
        <Image
          src={desktopImage}
          alt={heroAlt}
          fill
          className="hidden object-cover object-[68%_center] md:block"
          sizes="100vw"
          priority
        />
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,12,12,0.62)_0%,rgba(11,12,12,0.28)_42%,rgba(11,12,12,0.82)_100%)] md:hidden" />
            <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-hero-fade)_0%,var(--color-hero-overlay)_35%,transparent_72%)] md:block" />
            <div className="absolute inset-0 hidden bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_28%)] md:block" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.55)_32%,rgba(255,255,255,0.12)_58%,rgba(255,255,255,0.72)_100%)] md:hidden" />
            <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-hero-fade)_0%,var(--color-hero-overlay)_35%,transparent_72%)] md:block" />
            <div className="absolute inset-0 hidden bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_28%)] md:block" />
          </>
        )}
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-84px)] w-full max-w-8xl flex-col justify-between px-4 pb-4 pt-6 md:min-h-[580px] md:justify-center md:px-8 md:py-6">
        <div className="relative flex w-full max-w-[720px] flex-col gap-2.5 md:gap-3">
          <span
            className={`inline-flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-2 rounded-md border px-3 py-2 text-[0.82rem] leading-[1.35] md:px-4 md:py-2 md:text-[0.88rem] ${
              isDark
                ? "border-white/30 bg-[rgba(11,12,12,0.55)] text-white"
                : "border-[var(--color-border-strong)] bg-[rgba(255,255,255,0.58)] text-[var(--color-text-muted)]"
            }`}
          >
            <HomeIcon name="vehicle" isDark={isDark} className="h-4 w-4 shrink-0 object-contain" />
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

          <HeroHeadline h1={data.h1} isDark={isDark} />

          <MStripe />

          <p
            className={`max-w-[78%] text-[0.88rem] leading-[1.42] md:max-w-[620px] md:text-[1.08rem] md:leading-[1.42] ${isDark ? "text-white/88" : "text-black"} ${heroDescriptionShadow}`}
            dangerouslySetInnerHTML={{ __html: data.subHeadline }}
          />

          {data.primaryCta ? (
            <Link
              href={data.primaryCta.href || "/quote"}
              className="btn-cta mt-4 hidden w-fit items-center gap-5 rounded-md px-7 py-3.5 text-base font-bold shadow-[0_12px_28px_var(--color-shadow)] md:inline-flex"
            >
              <span dangerouslySetInnerHTML={{ __html: data.primaryCta.label.replace(/\s*→\s*$/, "") }} />
              <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
            </Link>
          ) : null}

          {data.trustStrip?.length > 0 ? (
            <div className="mt-6 hidden md:block">
              <DesktopTrustStrip
                items={data.trustStrip}
                isDark={isDark}
                cardBorderClass={cardBorderClass}
                dividerBorderClass={dividerBorderClass}
              />
            </div>
          ) : null}
        </div>

        <div className="relative flex w-full max-w-[720px] flex-col md:hidden">
          {data.primaryCta ? (
            <Link
              href={data.primaryCta.href || "/quote"}
              className="btn-cta mt-2 inline-flex w-full items-center justify-center gap-3 rounded-md px-6 py-3.5 text-[1rem] font-bold shadow-[0_12px_28px_var(--color-shadow)]"
            >
              <span dangerouslySetInnerHTML={{ __html: data.primaryCta.label.replace(/\s*→\s*$/, "") }} />
              <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
            </Link>
          ) : null}

          <MobileTrustStrip
            items={data.trustStrip}
            isDark={isDark}
            trustStripClass={trustStripClass}
            dividerBorderClass={dividerBorderClass}
            badgeTextClass={badgeTextClass}
            badgeMutedClass={badgeMutedClass}
          />
        </div>
      </div>
    </section>
  );
}
