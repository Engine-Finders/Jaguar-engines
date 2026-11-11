"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { heroBackground } from "@/components/shared/carImage";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { modelLabelFromData } from "@/components/shared/SectionQuoteCta";
import { splitStat as parseStat } from "@/components/models/statText";

/*
 * Model page hero. Desktop (xl) values are taken 1:1 from the 1536px brand reference:
 * pill 63px tall, title 79px line pitch, copy 19/31px, CTA 328x64, stats card 204px with 95px icon circles.
 * Below xl everything scales down; under lg the photo becomes a full-bleed band under the copy.
 */

// Same artwork as the home hero stats: bar chart, wrench, book, trophy.
const STAT_ICONS = ["real-inquiries", "vetted-specialist", "generation-honest-rated", "engine-finders"];

// Every scene is shown in the frame of the reference photo, so all models compose the same way.
const SCENE_ASPECT = "aspect-[916/661]";

// "2017-Present" -> "2017–Present" (date ranges take an en dash).
function typeset(text = "") {
  return String(text).replace(/(\d{4})\s*-\s*(\d{4}|Present)/g, "$1–$2");
}

function splitTagPill(tagPill = "") {
  const parts = typeset(tagPill).split(/\s*•\s*/).filter(Boolean);
  return { meta: parts.slice(0, 4), engines: parts.slice(4) };
}

// "E-Pace Engines - The Complete UK Guide" -> lead "E-Pace Engines –", rest "The Complete", accent "UK Guide".
function splitTitle(title = "") {
  const match = String(title).match(/^(.*?)\s+[-–—]\s+(.*)$/);
  if (!match) return { lead: title, rest: "", accent: "" };
  const [, lead, tail] = match;
  const ukIndex = tail.indexOf("UK ");
  const words = tail.split(" ");
  const cut = ukIndex > 0 ? ukIndex : tail.length - words.slice(-2).join(" ").length;
  // Non-breaking space: the dash never drops onto a line of its own.
  return { lead: `${lead} –`, rest: tail.slice(0, cut).trim(), accent: tail.slice(cut).trim() };
}

// "140+ Enquiries (2025) [JAG-VERIFIED]" -> value "140+", label "Enquiries (2025)", detail "[JAG-VERIFIED] — …".
// "Part of Engine Finders" (no number) -> prefix "Part of", label "Engine Finders".
function splitStat(item) {
  const { verified, ...stat } = parseStat(item);
  // Non-breaking hyphens keep "E-Pace" / "Most-Enquired" whole; the verified tag keeps its own line.
  const noBreak = (value) => String(value).replace(/-/g, "‑");
  const extra = item?.detail ? noBreak(item.detail) : "";
  const detail = verified
    ? `<span class="whitespace-nowrap">[JAG‑VERIFIED]${extra ? " —" : ""}</span>${extra ? `<br />${extra}` : ""}`
    : extra;
  return { ...stat, detail };
}

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

function TagPill({ tagPill, isDark }) {
  const { meta, engines } = splitTagPill(tagPill);
  const items = [
    ...meta.map((text, index) => ({ text, icon: index === 0 ? "shield" : null })),
    ...engines.map((text, index) => ({ text, icon: index === 0 ? "engine" : null })),
  ];

  // Each item carries its own leading dot inside a gap the list pulls left by; the pill clips
  // that gap, so whichever item starts a wrapped line (phones) never shows a dangling separator.
  return (
    <div
      className={`inline-flex max-w-full items-center rounded-[10px] border px-3.5 py-2.5 sm:px-4 sm:py-3 xl:min-h-[63px] xl:px-[20px] xl:py-0 ${
        isDark
          ? "border-white/[0.16] bg-[rgba(10,10,10,0.55)] text-white/90 backdrop-blur-md"
          : "border-[#e2e2df] bg-white/80 text-[#1c1d1b] shadow-[0_2px_10px_rgba(16,18,16,0.04)] backdrop-blur-md"
      }`}
    >
      <div className="overflow-hidden">
        <ul className="-ml-[22px] flex flex-wrap items-center gap-y-1.5 text-[13px] leading-[1.5] sm:text-[14px] lg:text-[15px] xl:-ml-[36px] xl:text-[16px]">
          {items.map((item, index) => (
            <li key={`${item.text}-${index}`} className="relative inline-flex items-center whitespace-nowrap pl-[22px] xl:pl-[36px]">
              <span
                aria-hidden="true"
                className={`absolute left-[9px] top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full xl:left-[16px] xl:h-1 xl:w-1 ${isDark ? "bg-white/70" : "bg-[#2a2b29]"}`}
              />
              {item.icon ? (
                <HomeIcon
                  name={item.icon}
                  isDark={isDark}
                  className="mr-2 h-[26px] w-[26px] sm:h-7 sm:w-7 xl:mr-[13px] xl:h-[30px] xl:w-[30px]"
                />
              ) : null}
              <span dangerouslySetInnerHTML={{ __html: item.text }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HeroTitle({ title, isDark }) {
  const { lead, rest, accent } = splitTitle(title);
  const accentClass = isDark
    ? "bg-[linear-gradient(180deg,#b9b9b6_0%,#7e7e7b_100%)]"
    : "bg-[linear-gradient(180deg,#8a8b87_0%,#6b6c68_100%)]";
  // Titles longer than the reference ("E-Pace Engines – The Complete UK Guide") get a smaller size
  // and a narrower measure, so every line still ends left of the cars instead of running over them.
  const isLong = lead.length > 20 || `${rest} ${accent}`.trim().length > 24;
  // Short accents ("UK Guide") never break; long ones ("UK EV Ownership Guide") take their own line
  // and only wrap where a phone is too narrow to hold them.
  const accentWrap = accent.length <= 12 ? "whitespace-nowrap" : "block sm:whitespace-nowrap";

  return (
    <h1 className={`model-hero-title ${isLong ? "model-hero-title--long" : ""} text-[var(--color-text)]`}>
      <span className="block" dangerouslySetInnerHTML={{ __html: lead }} />
      {rest || accent ? (
        <span className="block">
          {rest ? <span dangerouslySetInnerHTML={{ __html: rest }} /> : null}{" "}
          {accent ? (
            <span
              className={`${accentClass} ${accentWrap} bg-clip-text text-transparent [-webkit-box-decoration-break:clone] [box-decoration-break:clone]`}
              dangerouslySetInnerHTML={{ __html: accent }}
            />
          ) : null}
        </span>
      ) : null}
    </h1>
  );
}

function SubHeadline({ html, isDark }) {
  const formatted = String(html || "")
    .replace(/\s-\s/g, " — ")
    .replace(/\[JAG-VERIFIED\]/g, '<strong class="whitespace-nowrap font-semibold text-[var(--color-text)]">[JAG-VERIFIED]</strong>');

  return (
    <p
      className={`mt-4 max-w-[560px] text-[16px] leading-[1.6] sm:text-[17px] sm:leading-[1.62] lg:max-w-[min(560px,39vw)] xl:mt-[14px] xl:max-w-[min(556px,39vw)] xl:text-[19px] xl:leading-[31px] ${
        isDark ? "text-white/[0.78]" : "text-[#444542]"
      }`}
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
}

function StatItem({ item, index, isDark }) {
  const stat = splitStat(item);
  const iconKey = STAT_ICONS[index] || STAT_ICONS[0];
  const muted = isDark ? "text-white/60" : "text-[#7a7b77]";
  const divider = isDark ? "bg-white/[0.13]" : "bg-[#e3e3e0]";

  return (
    <li className="relative flex min-w-0 flex-col items-start gap-3 px-4 py-5 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-6 lg:gap-3.5 lg:pl-5 lg:pr-3 xl:gap-[18px] xl:pl-[34px] xl:pr-4 2xl:gap-6 2xl:py-[24px] 2xl:pl-[47px]">
      {/* Phones/tablets (2 x 2): rule right of the left column, under the top row */}
      {index % 2 === 0 ? <span aria-hidden="true" className={`absolute inset-y-5 right-0 w-px lg:hidden ${divider}`} /> : null}
      {index < 2 ? <span aria-hidden="true" className={`absolute inset-x-4 bottom-0 h-px lg:hidden ${divider}`} /> : null}
      {/* Desktop (1 x 4): inset vertical rule between items */}
      {index < 3 ? <span aria-hidden="true" className={`absolute inset-y-8 right-0 hidden w-px lg:block ${divider}`} /> : null}

      <span
        className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border sm:h-16 sm:w-16 xl:h-20 xl:w-20 2xl:h-[95px] 2xl:w-[95px] ${
          isDark
            ? "border-white/[0.12] bg-[radial-gradient(circle_at_32%_28%,#262626_0%,#141414_72%)]"
            : "border-[#e4e4e1] bg-[radial-gradient(circle_at_32%_28%,#fbfbfa_0%,#efefed_78%)]"
        }`}
      >
        <HomeIcon name={iconKey} isDark={isDark} className="h-[78%] w-[78%]" />
      </span>

      <div className="min-w-0 text-[var(--color-text)]">
        {stat.value ? (
          <p className="text-[26px] font-semibold leading-none tracking-[-0.01em] sm:text-[28px] lg:text-[25px] xl:text-[28px] 2xl:text-[32px] 2xl:leading-[36px]">{stat.value}</p>
        ) : null}
        {stat.prefix ? <p className="text-[14px] leading-snug sm:text-[16px] lg:text-[15px] xl:text-[17px] 2xl:text-[19px]">{stat.prefix}</p> : null}
        {stat.label ? (
          <p
            className={
              stat.value
                ? "mt-2 text-[14px] leading-snug sm:text-[16px] lg:text-[15px] xl:text-[17px] 2xl:mt-[6px] 2xl:text-[19px] 2xl:leading-[28px]"
                : `${stat.prefix ? "mt-1" : ""} text-[15px] font-semibold leading-snug sm:text-[17px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]`
            }
            dangerouslySetInnerHTML={{ __html: stat.label }}
          />
        ) : null}
        {stat.detail ? (
          <p
            className={`mt-1.5 text-[12.5px] leading-[1.5] sm:text-[14px] lg:text-[13px] xl:text-[15.5px] xl:leading-[25px] 2xl:mt-[2px] 2xl:text-[18px] 2xl:leading-[29px] ${muted}`}
            dangerouslySetInnerHTML={{ __html: stat.detail }}
          />
        ) : null}
      </div>
    </li>
  );
}

function ctaTarget(href, pathname) {
  // The model's own page is where the visitor already is: jump to its engine database instead.
  const clean = (value = "") => value.replace(/\/$/, "") || "/";
  if (!href || href === "#" || clean(href) === clean(pathname || "")) return "#engine-database";
  return href;
}

export default function ModelHero({ data }) {
  const { theme } = useTheme();
  const pathname = usePathname();
  if (!data) return null;

  const isDark = theme === "dark";
  const modelName = modelLabelFromData(data);
  const ctaLabel = data.primaryCta?.label?.replace(/\s*(?:→|â†’)\s*$/, "").trim() || `Explore ${modelName} Engines`;
  const ctaHref = ctaTarget(data.primaryCta?.href, pathname);

  // Art-directed light/dark scene (E-Pace) when present; otherwise the model's colour line-up,
  // turned monochrome to sit in the same black-and-silver look.
  const themed = data.heroThemedScenes?.[isDark ? "dark" : "light"] || null;
  const scene = themed || data.heroScene || null;
  const photoSrc = scene?.src || heroBackground(isDark);
  const car = scene ? null : data.heroCar;
  const photoTone = themed ? "" : isDark ? "grayscale brightness-[0.72] contrast-[1.12]" : "grayscale brightness-[1.06]";

  return (
    <section className="relative isolate w-full overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-[1546px] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10 lg:pb-12 lg:pt-9 xl:px-[53px] xl:pb-[56px] xl:pt-[42px]">
        <TagPill tagPill={data.tagPill} isDark={isDark} />

        <div className="mt-7 sm:mt-9 lg:max-w-[720px] xl:mt-[65px] xl:max-w-[840px]">
          <HeroTitle title={data.h1} isDark={isDark} />
          <div aria-hidden="true" className={`mt-4 h-px w-11 sm:mt-5 xl:mt-[14px] ${isDark ? "bg-white/40" : "bg-[#a5a6a2]"}`} />
          <SubHeadline html={data.subHeadline} isDark={isDark} />

          <a
            href={ctaHref}
            className={`btn-cta mt-7 inline-flex min-h-[56px] w-full items-center justify-center gap-[19px] rounded-[6px] px-6 text-[17px] !font-medium tracking-[0.005em] sm:w-auto sm:px-[30px] xl:mt-[40px] xl:min-h-[64px] xl:min-w-[328px] xl:pr-[32px] xl:text-[20px] ${
              isDark
                ? "border border-white/50 shadow-[0_12px_30px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.85)]"
                : "bg-[linear-gradient(180deg,#2c2d2b_0%,#121312_100%)] shadow-[0_10px_22px_rgba(16,18,16,0.2)]"
            }`}
          >
            <span>{ctaLabel}</span>
            <ArrowIcon className="h-5 w-5 shrink-0" />
          </a>
        </div>

        {/* One photo element: a full-bleed band under the copy on phones/tablets, the right-hand
            backdrop behind the copy from lg up (so a phone never downloads two hero images). */}
        <div
          aria-hidden="true"
          className={`model-hero-scene relative -mx-4 mt-7 overflow-hidden sm:-mx-6 sm:mt-9 lg:absolute lg:right-0 lg:top-0 lg:-z-10 lg:m-0 lg:h-[min(43vw,662px)] ${SCENE_ASPECT}`}
        >
          <Image
            src={photoSrc}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={`object-cover object-right ${photoTone}`}
          />
          {car ? (
            <div className="absolute bottom-[12%] right-[6%] w-[72%]">
              <Image src={car.src} alt="" width={car.width} height={car.height} sizes="(min-width: 1024px) 640px, 90vw" className={`h-auto w-full ${photoTone}`} />
            </div>
          ) : null}
          {/* Phones: soften the top and bottom edges into the page */}
          <div className="absolute inset-x-0 top-0 h-[14%] bg-[linear-gradient(180deg,var(--color-page)_0%,transparent_100%)] lg:hidden" />
          <div className="absolute inset-x-0 bottom-0 h-[10%] bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)] lg:h-[12%]" />
        </div>

        {data.trustStrip?.length > 0 ? (
          <ul
            className={`relative z-10 -mt-5 grid grid-cols-2 overflow-hidden rounded-xl border sm:-mt-8 lg:mt-12 lg:grid-cols-4 xl:mt-[47px] xl:rounded-[13px] 2xl:min-h-[204px] ${
              isDark
                ? "border-white/[0.13] bg-[rgba(14,14,14,0.78)] shadow-[0_18px_44px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                : "border-[#e4e4e1] bg-[rgba(251,251,250,0.92)] shadow-[0_10px_30px_rgba(16,18,16,0.06)] backdrop-blur-xl"
            }`}
          >
            {data.trustStrip.slice(0, 4).map((item, index) => (
              <StatItem key={item.label} item={item} index={index} isDark={isDark} />
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
