"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "../generation/GenIcons";
import HomeIcon from "@/components/home/homeIcons";
import { primaryCtaClass } from "./variantSection";

// "🔧 Supply & Fit Available", "✅ 12-Month Warranty", "🚚 Nationwide Delivery", "👥 15+ Specialists"
const BADGE_HOME_ICON_BY_EMOJI = {
  "🔧": "fitting-engine",
  "✅": "shield",
  "🚚": "uk-wide-delivery",
  "👥": "expert",
};

const VARIANT_TRUST_BADGE_ICONS = ["fitting-engine", "shield", "uk-wide-delivery", "expert"];

function parseBadge(badge = "", index = 0) {
  const [emoji, ...rest] = badge.split(" ");
  return {
    icon: BADGE_HOME_ICON_BY_EMOJI[emoji] || VARIANT_TRUST_BADGE_ICONS[index] || "check",
    label: rest.join(" "),
  };
}

function splitPriceAnchor(priceAnchor = "") {
  const [headline, ...rest] = priceAnchor.split(" · ");
  return { headline, note: rest.join(" · ") };
}

function splitTagPill(tagPill = "") {
  const parts = tagPill.split(" • ");
  return { model: parts[0] || "", body: parts[1] || "", years: parts[2] || "" };
}

// Trailing phrase after " - " uses the chrome accent, matching home/model heroes.
function HeroHeadline({ h1 = "" }) {
  const dashIndex = h1.indexOf(" - ");
  if (dashIndex === -1) return <span dangerouslySetInnerHTML={{ __html: h1 }} />;

  const lead = h1.slice(0, dashIndex);
  const accent = h1.slice(dashIndex + 3);
  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: `${lead} - ` }} />
      <span className="text-[var(--color-chrome-bright)]" dangerouslySetInnerHTML={{ __html: accent }} />
    </>
  );
}

// Inline UK flag - emoji regional-indicator flags don't render as a flag glyph
// on Windows (shows "GB" letter tiles instead), so use a real vector icon.
function TickerItems({ items, isDark, dotSizeClass, keyPrefix }) {
  return items.map((item, index) => (
    <span key={`${keyPrefix}-${index}`} className="flex shrink-0 items-center gap-1.5">
      <span
        className={`${dotSizeClass} shrink-0 rounded-full ${
          index === 0 ? "bg-[#189454]" : isDark ? "bg-white/40" : "bg-[var(--color-border-strong)]"
        }`}
        aria-hidden="true"
      />
      {item}
    </span>
  ));
}

function TickerHalf({ items, isDark, dotSizeClass, copies, keyPrefix }) {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {Array.from({ length: copies }, (_, copyIndex) => (
        <TickerItems
          key={`${keyPrefix}-copy-${copyIndex}`}
          items={items}
          isDark={isDark}
          dotSizeClass={dotSizeClass}
          keyPrefix={`${keyPrefix}-${copyIndex}`}
        />
      ))}
    </div>
  );
}

function TickerTrack({ items, isDark, dotSizeClass = "h-2 w-2" }) {
  const viewportRef = useRef(null);
  const measureRef = useRef(null);
  const [copies, setCopies] = useState(2);
  const [duration, setDuration] = useState(32);

  useEffect(() => {
    const viewport = viewportRef.current;
    const measure = measureRef.current;
    if (!viewport || !measure || items.length === 0) return;

    const update = () => {
      const setWidth = measure.scrollWidth;
      const viewWidth = viewport.offsetWidth;
      if (!setWidth || !viewWidth) return;

      const needed = Math.max(2, Math.ceil(viewWidth / setWidth) + 1);
      setCopies(needed);
      setDuration(Math.max(18, (setWidth * needed) / 42));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [items]);

  return (
    <div ref={viewportRef} className="relative overflow-hidden">
      <div
        ref={measureRef}
        className="pointer-events-none invisible absolute left-0 top-0 flex items-center gap-8 pr-8"
        aria-hidden="true"
      >
        <TickerItems items={items} isDark={isDark} dotSizeClass={dotSizeClass} keyPrefix="measure" />
      </div>
      <div className="flex w-max animate-ticker will-change-transform" style={{ animationDuration: `${duration}s` }}>
        <TickerHalf items={items} isDark={isDark} dotSizeClass={dotSizeClass} copies={copies} keyPrefix="a" />
        <TickerHalf items={items} isDark={isDark} dotSizeClass={dotSizeClass} copies={copies} keyPrefix="b" />
      </div>
    </div>
  );
}

function UkFlagIcon({ className = "h-4 w-5" }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true">
      <rect width="20" height="14" fill="#012169" />
      <path d="M0 0 20 14M20 0 0 14" stroke="#fff" strokeWidth="2.4" />
      <path d="M0 0 20 14M20 0 0 14" stroke="#C8102E" strokeWidth="1.2" />
      <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4" />
      <path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="2.4" />
    </svg>
  );
}

export default function VariantHero({ data }) {
  const { theme } = useTheme();
  const router = useRouter();
  const [regNumber, setRegNumber] = useState("");

  if (!data) return null;

  function goToQuoteWithReg(event) {
    event.preventDefault();
    const cleaned = regNumber.replace(/\s+/g, "").toUpperCase();
    if (!cleaned) {
      router.push("/quote");
      return;
    }
    router.push(`/quote?reg=${encodeURIComponent(cleaned)}`);
  }

  const isDark = theme === "dark";
  // This car's generation standing in Jaguar's own scene, light or dark (set server-side), or the
  // client's line-up scene when the model has no photo of its own (I-Pace). Laid out like the model hero.
  const scene = data.heroScene;
  const sceneSrc = scene ? (isDark && scene.darkSrc) || scene.src : null;
  const carAlt = `Jaguar ${data.vehicle || ""}`.trim();
  const price = splitPriceAnchor(data.priceAnchor);
  const pill = splitTagPill(data.tagPill);
  const tickerItems = (data.ticker || "").replace(/^●\s*/, "").split(" · ").filter(Boolean);

  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyTextClass = isDark ? "text-white/85" : "text-[var(--color-text-muted)]";
  const cardBorderClass = isDark ? "border-white/20" : "border-[var(--color-border)]";
  const cardBgClass = isDark ? "bg-[var(--color-surface-glass)]" : "bg-[rgba(255,255,255,0.7)]";
  const innerBgClass = isDark ? "bg-[rgba(11,12,12,0.55)]" : "bg-[rgba(255,255,255,0.85)]";
  const tagPillClass = isDark ? "border-white/30 bg-[rgba(11,12,12,0.55)] text-white" : "border-[var(--color-border-strong)] bg-[rgba(255,255,255,0.75)] text-[var(--color-text)]";
  // Stronger contrast than the plain --color-border token, since these sit on
  // a translucent card over a busy photo background rather than a solid surface.
  const dividerClass = isDark ? "bg-white/35" : "bg-[rgba(7,24,39,0.25)]";
  const dividerBorderClass = isDark ? "border-white/35" : "border-[rgba(7,24,39,0.25)]";
  const badgeTextClass = isDark ? "text-white/85" : "text-[var(--color-text)]";
  const heroDescriptionShadow = isDark
    ? ""
    : "[text-shadow:0_0_8px_#fff,0_0_16px_#fff,0_0_24px_rgba(255,255,255,0.9),0_1px_2px_rgba(255,255,255,0.95)]";

  // Desktop: single row over the hero image, floating vertical dividers between every item.
  // Self-hides on mobile so it can stay embedded in the hero section for both breakpoints.
  const desktopTrustBadges = data.trustBadges?.length > 0 ? (
    <div className={`mt-6 hidden rounded-md border ${cardBorderClass} ${cardBgClass} px-3 py-2 backdrop-blur-sm md:block`}>
      <div className="flex items-stretch py-0.5">
        {data.trustBadges.map((badge, index) => {
          const { icon, label } = parseBadge(badge, index);
          return (
            <div key={badge} className="flex flex-1 items-stretch">
              {index > 0 ? (
                <span aria-hidden="true" className={`mx-3 my-0.5 w-px shrink-0 self-center ${dividerClass}`} style={{ height: "70%" }} />
              ) : null}
              <div className="flex w-full items-center gap-2 text-left">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center md:h-14 md:w-14">
                  <HomeIcon name={icon} isDark={isDark} className="h-12 w-12 object-contain md:h-14 md:w-14" />
                </span>
                <span className={`text-[0.88rem] leading-[1.3] ${badgeTextClass}`}>{label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;

  // Mobile: single-row 4-column icon-on-top grid, rendered below the hero image
  // (not overlapping the car) in normal page flow.
  const mobileTrustBadges = data.trustBadges?.length > 0 ? (
    <div className={`rounded-md border ${cardBorderClass} ${cardBgClass} p-2 backdrop-blur-sm md:hidden`}>
      <div className="grid grid-cols-4 gap-x-1 text-center">
        {data.trustBadges.map((badge, index) => {
          const { icon, label } = parseBadge(badge, index);
          return (
            <div
              key={badge}
              className={`flex flex-col items-center gap-1 px-0.5 ${index > 0 ? `border-l ${dividerBorderClass}` : ""}`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                <HomeIcon name={icon} isDark={isDark} className="h-12 w-12 object-contain" />
              </span>
              <span className={`text-[0.58rem] leading-tight ${badgeTextClass}`}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;

  // Price/code row, shared by the mobile "engine summary" card and the
  // desktop combined card.
  const priceLinkClass = "[&_a]:text-[var(--color-primary)] [&_a]:underline [&_a]:underline-offset-2";

  const priceRow = data.priceAnchor ? (
    <div className="flex flex-wrap items-center gap-2 text-[0.74rem] md:text-[0.92rem]">
      <GenIcon name="tag" className="h-6 w-6 shrink-0 md:h-7 md:w-7" />
      <span className={`font-semibold ${headingClass} ${priceLinkClass}`} dangerouslySetInnerHTML={{ __html: price.headline }} />
      {price.note ? (
        <span className={`hidden md:inline ${bodyTextClass} ${priceLinkClass}`}>
          · <span dangerouslySetInnerHTML={{ __html: price.note }} />
        </span>
      ) : null}
    </div>
  ) : null;

  // Registration row → redirects to /quote with ?reg=… (lookup stays on quote page).
  // Spec's "top split" row (country + input) holds on every breakpoint;
  // only the full-width submit button drops to its own row.
  const registrationRow = data.registrationInput ? (
    <form
      onSubmit={goToQuoteWithReg}
      className="flex w-full flex-col gap-1.5 md:flex-row md:items-center md:gap-3"
    >
      <div className="flex w-full items-center gap-1.5 md:flex-1 md:gap-3">
        <span className={`flex shrink-0 items-center gap-1.5 rounded-md border ${cardBorderClass} ${innerBgClass} px-2.5 py-2 text-[0.8rem] font-semibold md:py-3 md:text-[0.92rem] ${headingClass}`}>
          <UkFlagIcon />
          GB
        </span>
        <input
          type="text"
          name="reg"
          value={regNumber}
          onChange={(event) => setRegNumber(event.target.value.toUpperCase())}
          placeholder={data.registrationInput.placeholder}
          autoComplete="off"
          className={`min-w-0 flex-1 rounded-md border ${cardBorderClass} ${innerBgClass} px-2.5 py-2 text-[0.8rem] uppercase focus:outline-none md:py-3 md:text-[0.92rem] ${headingClass} ${isDark ? "placeholder:text-white/50" : "placeholder:text-[var(--color-text-soft)]"}`}
        />
      </div>
      {data.registrationInput.cta ? (
        <button
          type="submit"
          className={`${primaryCtaClass("flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md px-2 py-2 text-center text-[0.68rem] md:w-auto md:py-3 md:px-6 md:text-[0.9rem]")}`}
        >
          {data.registrationInput.cta.label.replace(/\s*→\s*$/, "")}
          <GenIcon name="arrow" className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
        </button>
      ) : null}
    </form>
  ) : null;

  // Mobile: two distinct stacked cards (engine summary, then the reg/quote form).
  // Icon sits left, vertically centered against both text lines.
  const mobileEngineSummaryCard = data.priceAnchor ? (
    <div className={`mt-1.5 flex w-full items-center gap-3 rounded-md border ${cardBorderClass} ${cardBgClass} p-2.5 backdrop-blur-sm md:hidden`}>
      <GenIcon name="tag" className="h-9 w-9 shrink-0" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          className={`text-[0.74rem] font-semibold ${headingClass} ${priceLinkClass}`}
          dangerouslySetInnerHTML={{ __html: price.headline }}
        />
        {price.note ? (
          <span className={`text-[0.7rem] ${bodyTextClass} ${priceLinkClass}`} dangerouslySetInnerHTML={{ __html: price.note }} />
        ) : null}
      </div>
    </div>
  ) : null;

  const mobileQuoteWidget = data.registrationInput ? (
    <div className={`mt-1.5 flex w-full flex-col gap-2 rounded-md border ${cardBorderClass} ${cardBgClass} p-2.5 backdrop-blur-sm md:hidden`}>
      {registrationRow}
    </div>
  ) : null;

  // Desktop: single combined card (price/codes row over the reg/quote row),
  // matching the original design.
  const desktopQuoteWidget = data.priceAnchor || data.registrationInput ? (
    <div className={`mt-6 hidden w-full flex-col gap-4 rounded-md border ${cardBorderClass} ${cardBgClass} p-5 backdrop-blur-sm md:flex`}>
      {priceRow}
      {registrationRow}
    </div>
  ) : null;

  return (
    <>
      <section className={`relative w-full overflow-hidden bg-[var(--color-page)] xl:min-h-[640px] ${headingClass}`}>
        {/* Desktop: the scene sits on the right and fades in from the page colour, as on the model page.
            Below 1600px it starts a third of the way in so the copy stays on plain page colour. */}
        {sceneSrc ? (
          <div className="absolute inset-y-0 left-[34%] right-0 hidden xl:block min-[1600px]:left-auto min-[1600px]:aspect-[1200/676]">
            <Image src={sceneSrc} alt={carAlt} fill className="object-cover object-right" sizes="(min-width: 1280px) 1200px, 100vw" priority />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,color-mix(in_srgb,var(--color-page)_88%,transparent)_16%,color-mix(in_srgb,var(--color-page)_45%,transparent)_34%,transparent_56%)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)]" />
          </div>
        ) : null}

        <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-4 pt-2 md:px-8 md:pb-6 md:pt-5 xl:min-h-[640px] xl:justify-center xl:py-8">
          <div className="flex w-full max-w-[640px] flex-col gap-1.5 md:gap-2">
            <span className={`inline-flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-md border px-3 py-2 text-[0.82rem] leading-[1.35] md:px-2.5 md:py-1.5 md:text-[0.78rem] ${tagPillClass}`}>
              <GenIcon name="car" className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
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

            <h1 className={`text-[32px] font-bold leading-[0.95] tracking-normal md:text-[2.6rem] md:leading-[1.08] ${headingClass}`}>
              <HeroHeadline h1={data.h1} />
            </h1>

            <MStripe />

            <p
              className={`max-w-full text-[0.88rem] leading-[1.42] md:max-w-[560px] md:text-[0.92rem] md:leading-[1.35] ${isDark ? "text-white/85" : "text-black"} ${heroDescriptionShadow}`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>

          {/* Phones, tablets + small laptops: the scene as its own band, so it never sits behind the copy */}
          {sceneSrc ? (
            <div className="relative -mx-4 my-3 aspect-[16/10] max-h-[440px] w-[calc(100%+2rem)] overflow-hidden md:-mx-8 md:w-[calc(100%+4rem)] xl:hidden">
              <Image src={sceneSrc} alt={carAlt} fill className="object-cover object-[70%_center]" sizes="100vw" priority />
              <div className="absolute inset-x-0 top-0 h-14 bg-[linear-gradient(180deg,var(--color-page)_0%,transparent_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-14 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)]" />
            </div>
          ) : null}

          <div className="flex w-full max-w-[820px] flex-col gap-1.5 md:gap-2">
            {desktopTrustBadges}
            {mobileTrustBadges}
            {mobileEngineSummaryCard}
            {mobileQuoteWidget}
            {desktopQuoteWidget}

            {/* Bottom micro-feature ticker: compact card in the mobile stack,
                matching the other hero cards; desktop keeps the full-bleed strip below. */}
            {tickerItems.length > 0 ? (
              <div className={`mt-1.5 overflow-hidden rounded-md border ${cardBorderClass} ${isDark ? "bg-black/70" : "bg-white/85"} py-2.5 text-[0.65rem] ${bodyTextClass} md:hidden`}>
                <TickerTrack items={tickerItems} isDark={isDark} dotSizeClass="h-1.5 w-1.5" />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {tickerItems.length > 0 ? (
        <div className="hidden w-full overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)] py-3 md:block">
          <div className="text-[0.72rem] text-[var(--color-text-muted)] md:text-[0.8rem]">
            <TickerTrack items={tickerItems} isDark={isDark} />
          </div>
        </div>
      ) : null}
    </>
  );
}
