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
  "📖": "engine-codes-book",
  "🏆": "engine-finders",
};

const TRUST_STRIP_ICONS = ["real-inquiries", "vehicle", "engine-codes-book", "engine-finders"];

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
  // The body-style stat gets the SUV artwork for SUVs, and the power stat a meter.
  if (/\bsuv\b/i.test(item.label || "")) return "suv-body";
  if (/\b\d+\s*(ps|bhp|hp)\b/i.test(item.label || "")) return "diagnosis";
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
  const trustStripClass = `glass-panel hidden w-max shrink-0 rounded-md border ${cardBorderClass} backdrop-blur-sm shadow-[0_10px_30px_var(--color-shadow)] md:block`;

  return (
    <div className={trustStripClass}>
      <div className="flex w-max items-stretch">
        {items.map((item, index) => {
          const stat = splitStat(item.label);
          const hasValue = Boolean(stat.value);

          return (
            <div
              key={item.label}
              className={`flex w-auto flex-none items-center gap-3 px-4 py-3.5 text-left ${
                index > 0 ? `border-l ${dividerBorderClass}` : ""
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                <HomeIcon name={trustStripIcon(item, index)} isDark={isDark} className="h-12 w-12 object-contain" />
              </span>
              <div className="flex w-max max-w-none flex-col gap-0.5 whitespace-normal">
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
                  <span className={`max-w-[12rem] text-[0.82rem] leading-[1.3] ${badgeTextClass}`}>{stat.label}</span>
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
              <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                <HomeIcon name={trustStripIcon(item, index)} isDark={isDark} className="h-12 w-12 object-contain" />
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

// Phones, tablets + small laptops: the scene as its own band, so it never sits behind the copy.
function SceneBand({ src, alt, className = "" }) {
  return (
    <div className={`relative -mx-4 my-3 aspect-[16/10] max-h-[440px] w-[calc(100%+2rem)] overflow-hidden md:-mx-8 md:w-[calc(100%+4rem)] ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover object-[70%_center]" sizes="100vw" priority />
      <div className="absolute inset-x-0 top-0 h-14 bg-[linear-gradient(180deg,var(--color-page)_0%,transparent_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-14 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)]" />
    </div>
  );
}

export default function ModelHero({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const pill = splitTagPill(data.tagPill);
  // This generation standing in Jaguar's own scene, light or dark (set server-side), or the client's
  // line-up scene when the model has no photo of its own (I-Pace). Laid out like the model hero.
  const scene = data.heroScene;
  const sceneSrc = scene ? (isDark && scene.darkSrc) || scene.src : null;
  const heroAlt = pill.model.replace(/<[^>]*>/g, "");
  const heroDescriptionShadow = isDark
    ? ""
    : "[text-shadow:0_0_8px_#fff,0_0_16px_#fff,0_0_24px_rgba(255,255,255,0.9),0_1px_2px_rgba(255,255,255,0.95)]";

  const cardBorderClass = isDark ? "border-white/20" : "border-[var(--color-border)]";
  const dividerBorderClass = isDark ? "border-white/35" : "border-[rgba(7,24,39,0.25)]";
  const badgeTextClass = isDark ? "text-white/85" : "text-[var(--color-text)]";
  const badgeMutedClass = isDark ? "text-white/55" : "text-[var(--color-text-soft)]";
  const trustStripClass = `glass-panel rounded-md border ${cardBorderClass} backdrop-blur-sm shadow-[0_10px_30px_var(--color-shadow)]`;

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)] text-[var(--color-text)] xl:min-h-[620px]">
      {/* Desktop: the scene sits on the right and fades in from the page colour, as on the model page.
          Below 1600px it starts a third of the way in so the copy stays on plain page colour. */}
      {sceneSrc ? (
        <div className="absolute inset-y-0 left-[34%] right-0 hidden xl:block min-[1600px]:left-auto min-[1600px]:aspect-[1200/676]">
          <Image src={sceneSrc} alt={heroAlt} fill className="object-cover object-right" sizes="(min-width: 1280px) 1200px, 100vw" priority />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,color-mix(in_srgb,var(--color-page)_88%,transparent)_16%,color-mix(in_srgb,var(--color-page)_45%,transparent)_34%,transparent_56%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)]" />
        </div>
      ) : null}

      <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-4 pt-6 md:px-8 md:py-6 xl:min-h-[620px] xl:justify-center">
        <div className="relative flex w-full flex-col gap-2.5 md:gap-3">
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
              className={`max-w-full text-[0.88rem] leading-[1.42] md:max-w-[620px] md:text-[1.08rem] md:leading-[1.42] ${isDark ? "text-white/88" : "text-black"} ${heroDescriptionShadow}`}
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
          </div>

          {sceneSrc ? <SceneBand src={sceneSrc} alt={heroAlt} className="hidden md:block xl:hidden" /> : null}

          {data.trustStrip?.length > 0 ? (
            <div className="mt-6 hidden w-max max-w-none md:block">
              <DesktopTrustStrip
                items={data.trustStrip}
                isDark={isDark}
                cardBorderClass={cardBorderClass}
                dividerBorderClass={dividerBorderClass}
              />
            </div>
          ) : null}
        </div>

        {/* Phones: the scene as its own band between the copy and the CTA */}
        {sceneSrc ? <SceneBand src={sceneSrc} alt={heroAlt} className="md:hidden" /> : null}

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
