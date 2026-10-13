"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import HomeIcon from "@/components/home/homeIcons";
import { sectionButton, sectionDescription, sectionH1 } from "@/components/models/sectionTypography";

const TRUST_STRIP_ICONS = ["real-inquiries", "vehicle", "expert-verified", "engine-finders"];

function normalizeText(value = "") {
  return value
    .replace(/\u00c3\u00a2\u00e2\u20ac\u00a2|\u00e2\u20ac\u00a2|\u2022/g, " \u2022 ")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u00a0\u00e2\u201e\u00a2|\u00e2\u2020\u2019|\u2192/g, "\u2192")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u201c|\u00c3\u00a2\u00e2\u20ac\u201d|\u00e2\u20ac\u201c|\u00e2\u20ac\u201d|\u2013|\u2014/g, "\u2013")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u02dc|\u00e2\u20ac\u2018|\u2011/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTagPill(tagPill = "") {
  return normalizeText(tagPill)
    .split(" \u2022 ")
    .map((item) => item.trim())
    .filter(Boolean);
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function StatIcon({ index, isDark }) {
  return (
    <span
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border text-[var(--color-primary)] md:h-16 md:w-16 ${
        isDark
          ? "border-white/14 bg-[var(--color-primary-soft)]"
          : "border-[var(--color-border)] bg-[var(--color-primary-soft)]"
      }`}
    >
      <HomeIcon
        name={TRUST_STRIP_ICONS[index] || "real-inquiries"}
        isDark={isDark}
        className="h-10 w-10 object-contain md:h-11 md:w-11"
      />
    </span>
  );
}

function MetaPill({ items, isDark }) {
  if (items.length === 0) return null;

  return (
    <div
      className={`inline-flex max-w-full items-center gap-0 overflow-x-auto whitespace-nowrap rounded-full border px-2.5 py-2.5 text-[13px] leading-[1.2] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-x-4 md:gap-y-2 md:px-6 md:py-3.5 md:text-[16px] ${
        isDark
          ? "border-white/30 bg-[rgba(11,12,12,0.55)] text-white"
          : "border-[var(--color-border-strong)] bg-[rgba(255,255,255,0.58)] text-[var(--color-text)]"
      }`}
    >
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex shrink-0 items-center md:gap-4">
          {index > 0 ? (
            <span aria-hidden="true" className={`px-[1px] md:px-0 ${isDark ? "text-white/60" : "text-[var(--color-text-soft)]"}`}>
              {"\u2022"}
            </span>
          ) : null}
          <span className={index === 1 ? "font-semibold text-[var(--color-primary)]" : ""}>{item}</span>
        </span>
      ))}
    </div>
  );
}

function splitHeroH1(title = "") {
  const cleanTitle = normalizeText(title);
  const dash = cleanTitle.indexOf(" - ");
  const before = dash === -1 ? cleanTitle : cleanTitle.slice(0, dash).trim();
  const accent = dash === -1 ? "" : cleanTitle.slice(dash + 3).trim();

  if (!accent) {
    return { line1: before, line2: "", line3: "" };
  }

  const amp = accent.indexOf(" & ");
  if (amp !== -1) {
    return {
      line1: before,
      line2: accent.slice(0, amp).trim(),
      line3: accent.slice(amp + 1).trim(),
    };
  }

  const comma = accent.lastIndexOf(", ");
  if (comma !== -1) {
    return {
      line1: before,
      line2: accent.slice(0, comma + 1).trim(),
      line3: accent.slice(comma + 2).trim(),
    };
  }

  const words = accent.split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  return {
    line1: before,
    line2: words.slice(0, mid).join(" "),
    line3: words.slice(mid).join(" "),
  };
}

function HeroTitle({ title, isDark }) {
  const { line1, line2, line3 } = splitHeroH1(title);
  const textClass = isDark ? "text-white" : "text-[var(--color-text)]";

  return (
    <h1 className={`max-w-[820px] font-bold tracking-normal ${textClass} ${sectionH1}`}>
      <span className="block md:whitespace-nowrap">{line1}</span>
      {line2 ? <span className="block text-[var(--color-chrome-bright)]">{line2}</span> : null}
      {line3 ? <span className="block text-[var(--color-chrome-bright)]">{line3}</span> : null}
    </h1>
  );
}

function StatCard({ item, index, isDark }) {
  const label = normalizeText(item.label);

  return (
    <li
      className={`glass-panel flex min-h-[108px] w-full min-w-0 items-center gap-3 overflow-hidden rounded-2xl border px-3 py-2 backdrop-blur-md md:min-h-[96px] md:w-auto md:min-w-0 md:flex-none md:overflow-visible md:rounded-none md:border-0 md:border-r md:bg-transparent md:px-5 md:py-3 md:shadow-none md:backdrop-blur-none md:last:border-r-0 ${
        isDark
          ? "border-white/18 bg-[rgba(18,19,19,0.45)] md:border-white/20"
          : "border-[var(--color-glass-border)] bg-[rgba(255,255,255,0.42)] md:border-[var(--color-border)]"
      }`}
    >
      <StatIcon index={index} isDark={isDark} />
      <p
        className={`min-w-0 flex-1 break-words text-[13px] font-semibold leading-[1.2] md:flex-none md:whitespace-nowrap md:text-[15px] md:leading-none ${isDark ? "text-white" : "text-[var(--color-text)]"}`}
      >
        {label}
      </p>
    </li>
  );
}

export default function EngineHero({ data }) {
  const { theme } = useTheme();

  if (!data) return null;

  const isDark = theme === "dark";
  const metaItems = splitTagPill(data.tagPill);
  const description = normalizeText(data.subHeadline);
  const ctaLabel = data.primaryCta?.label ? normalizeText(data.primaryCta.label).replace(/\s*\u2192$/, "") : "";

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[var(--color-page)]" />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[radial-gradient(circle_at_78%_64%,rgba(183,184,179,0.12)_0%,transparent_28%),linear-gradient(180deg,rgba(11,12,12,0.92)_0%,rgba(11,12,12,0.98)_100%)]"
              : "bg-[radial-gradient(circle_at_78%_64%,rgba(183,184,179,0.22)_0%,transparent_28%),linear-gradient(180deg,var(--color-page)_0%,var(--color-page-soft)_40%,var(--color-page)_100%)]"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(90deg,rgba(11,12,12,0.98)_0%,rgba(11,12,12,0.88)_42%,rgba(11,12,12,0.35)_72%,transparent_100%)]"
              : "bg-[linear-gradient(90deg,var(--color-hero-fade)_0%,var(--color-hero-overlay)_42%,transparent_78%)]"
          }`}
        />
        <div className="absolute right-[28%] top-0 hidden h-full w-[190px] skew-x-[-24deg] bg-[linear-gradient(180deg,rgba(183,184,179,0.14)_0%,rgba(183,184,179,0.03)_100%)] md:block" />
        <div className="absolute bottom-[23%] right-[8%] hidden h-[230px] w-[460px] rounded-[50%] border border-[var(--color-border-strong)]/50 md:block" />
        <div className="absolute bottom-[26%] right-[11%] hidden h-[170px] w-[340px] rounded-[50%] border border-[var(--color-border)]/70 md:block" />
      </div>

      <div className="relative mx-auto flex w-full max-w-8xl flex-col px-3 pb-[6px] pt-0 md:px-6 md:pb-[12px] md:pt-1">
        <div className="grid items-start md:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.85fr)] md:gap-3 lg:gap-4">
          <div className="order-1 min-w-0 max-w-[820px] pt-1 md:order-none md:self-start md:pt-2">
            <MetaPill items={metaItems} isDark={isDark} />

            <div className="mt-3 md:mt-3">
              <HeroTitle title={data.h1} isDark={isDark} />
            </div>
            <div className="mt-3">
              <MStripe />
            </div>

            <p className={`mt-3 max-w-full break-words px-0 ${sectionDescription} ${isDark ? "text-white/88" : "text-[var(--color-text-muted)]"}`}>
              {description.split("[JAG-VERIFIED]").map((part, index, array) => (
                <span key={`${part}-${index}`}>
                  {part}
                  {index < array.length - 1 ? <span className="text-[var(--color-primary)]">[JAG-VERIFIED]</span> : null}
                </span>
              ))}
            </p>

            {data.primaryCta ? (
              <Link
                href="/quote"
                className={`btn-cta mt-4 hidden min-h-11 w-fit max-w-full items-center justify-center gap-3 rounded-md px-6 py-2.5 font-bold shadow-[0_12px_28px_var(--color-shadow)] md:inline-flex ${sectionButton}`}
              >
                <span className="min-w-0 text-left leading-tight">{ctaLabel}</span>
                <ArrowIcon />
              </Link>
            ) : null}
          </div>

          <div className="relative order-2 flex min-h-[220px] items-end justify-center md:min-h-[400px] md:justify-end">
            <div className="absolute inset-x-0 bottom-[8%] mx-auto h-[150px] w-[92%] rounded-[50%] border border-[var(--color-border-strong)]/45 md:bottom-[3%] md:h-[200px] md:w-[86%]" />
            <div className="absolute inset-x-0 bottom-[11%] mx-auto h-[104px] w-[72%] rounded-[50%] border border-[var(--color-border)]/55 md:bottom-[7%] md:h-[140px] md:w-[64%]" />
            <Image
              src="/e90/engine.webp"
              alt={normalizeText(data.h1)}
              width={522}
              height={608}
              priority
              className="relative z-10 mx-auto h-auto w-[64%] max-w-[270px] object-contain drop-shadow-[0_28px_48px_rgba(0,0,0,0.35)] md:ml-auto md:w-full md:max-w-[460px]"
            />
          </div>
        </div>

        {data.trustStrip?.length > 0 ? (
          <ul
            className={`relative z-10 mt-5 grid grid-cols-2 gap-2.5 md:mt-3 md:flex md:w-max md:grid-cols-none md:gap-0 md:overflow-hidden md:rounded-2xl md:border md:shadow-[0_10px_30px_var(--color-shadow)] md:backdrop-blur-md ${
              isDark
                ? "md:border-white/20 md:bg-[rgba(18,19,19,0.45)]"
                : "md:border-[var(--color-glass-border)] md:bg-[rgba(255,255,255,0.42)]"
            }`}
          >
            {data.trustStrip.map((item, index) => (
              <StatCard key={`${item.label}-${index}`} item={item} index={index} isDark={isDark} />
            ))}
          </ul>
        ) : null}

        {data.primaryCta ? (
          <Link
            href="/quote"
            className={`btn-cta relative z-10 mt-4 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md px-5 py-3 text-center font-bold shadow-[0_12px_28px_var(--color-shadow)] md:hidden ${sectionButton}`}
          >
            <span className="min-w-0 leading-tight">{ctaLabel}</span>
            <ArrowIcon />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
