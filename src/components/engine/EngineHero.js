"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import { sectionButton, sectionDescription, sectionH1 } from "@/components/models/sectionTypography";

const statIconPaths = [
  <path key="chart" d="M5 19V9m5 10V5m5 14v-7m5 7H3" />,
  <path key="tool" d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  <path key="shield" d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />,
  <path key="trophy" d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
];

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

function splitStatLabel(label = "") {
  const clean = normalizeText(label);
  const match = clean.match(/^([0-9,/+.]+)\s+(.+)$/);

  if (!match) {
    return { value: "", lines: [clean] };
  }

  const [, value, rest] = match;
  return {
    value,
    lines: rest.split(" ").reduce(
      (acc, word) => {
        if (acc[0].length <= acc[1].length) {
          acc[0] = acc[0] ? `${acc[0]} ${word}` : word;
        } else {
          acc[1] = acc[1] ? `${acc[1]} ${word}` : word;
        }

        return acc;
      },
      ["", ""],
    ),
  };
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
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-[var(--color-primary)] md:h-14 md:w-14 ${
        isDark
          ? "border-white/14 bg-[radial-gradient(circle_at_30%_30%,rgba(31,90,185,0.24),rgba(4,12,26,0.92)_72%)]"
          : "border-[rgba(11,103,220,0.18)] bg-[radial-gradient(circle_at_30%_30%,rgba(220,234,255,0.95),rgba(255,255,255,0.98)_72%)]"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8" fill="none" stroke="currentColor" strokeWidth="1.85">
        {statIconPaths[index] || statIconPaths[0]}
      </svg>
    </span>
  );
}

function MetaPill({ items, isDark }) {
  if (items.length === 0) return null;

  return (
    <div
      className={`inline-flex max-w-full items-center gap-0 overflow-x-auto whitespace-nowrap rounded-full border px-2.5 py-2.5 text-[13px] leading-[1.2] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-x-4 md:gap-y-2 md:px-6 md:py-3.5 md:text-[16px] ${
        isDark
          ? "border-[rgba(36,132,255,0.9)] bg-[rgba(4,12,24,0.62)] text-white"
          : "border-[rgba(11,103,220,0.58)] bg-[rgba(255,255,255,0.52)] text-[var(--color-text)]"
      }`}
    >
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex shrink-0 items-center md:gap-4">
          {index > 0 ? <span aria-hidden="true" className="px-[1px] text-white/80 md:px-0">{"\u2022"}</span> : null}
          <span className={index === 1 ? "font-semibold text-[var(--color-primary)]" : ""}>{item}</span>
        </span>
      ))}
    </div>
  );
}

function HeroTitle({ title, isDark, accentText }) {
  const cleanTitle = normalizeText(title);
  const accent = accentText && cleanTitle.includes(accentText) ? accentText : "Replacement Cost";
  const accentIndex = cleanTitle.indexOf(accent);
  const textClass = isDark ? "text-white" : "text-[var(--color-text)]";

  if (accentIndex === -1) {
    return <h1 className={`max-w-[700px] font-bold tracking-normal ${textClass} ${sectionH1}`}>{cleanTitle}</h1>;
  }

  return (
    <h1 className={`max-w-[700px] font-bold tracking-normal ${textClass} ${sectionH1}`}>
      {cleanTitle.slice(0, accentIndex)}
      <span className="text-[var(--color-primary)]">{accent}</span>
      {cleanTitle.slice(accentIndex + accent.length)}
    </h1>
  );
}

function StatCard({ item, index, isDark }) {
  const stat = splitStatLabel(item.label);

  return (
    <li
      className={`flex min-h-[108px] items-center gap-2 rounded-2xl border px-3 py-0 shadow-[0_20px_48px_rgba(0,0,0,0.22)] md:min-h-[82px] md:rounded-none md:border-0 md:border-r md:bg-transparent md:px-3 md:py-1.5 md:last:border-r-0 md:shadow-none ${
        isDark
          ? "border-white/14 bg-[linear-gradient(180deg,rgba(7,16,33,0.88)_0%,rgba(3,10,23,0.96)_100%)] md:border-white/14"
          : "border-[rgba(11,103,220,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(239,245,252,0.96)_100%)] md:border-[rgba(11,103,220,0.16)]"
      }`}
    >
      <StatIcon index={index} isDark={isDark} />
      <div className="min-w-0">
        {stat.value ? <p className={`text-[21px] font-bold leading-none md:text-[20px] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{stat.value}</p> : null}
        <div className={`${stat.value ? "mt-0.5" : ""} space-y-0`}>
          {stat.lines.filter(Boolean).map((line) => (
            <p key={line} className={`text-[11px] font-medium uppercase leading-[1.02] md:text-[11px] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </li>
  );
}

export default function EngineHero({ data }) {
  const { theme } = useTheme();

  if (!data) return null;

  const isDark = theme === "dark";
  const metaItems = splitTagPill(data.tagPill);
  const accentToken = metaItems[1] || "";
  const description = normalizeText(data.subHeadline);
  const ctaLabel = data.primaryCta?.label ? normalizeText(data.primaryCta.label).replace(/\s*\u2192$/, "") : "";

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[radial-gradient(circle_at_78%_64%,rgba(36,132,255,0.2)_0%,rgba(36,132,255,0)_24%),linear-gradient(180deg,#02060d_0%,#07101d_58%,#030913_100%)]"
              : "bg-[radial-gradient(circle_at_78%_64%,rgba(11,103,220,0.16)_0%,rgba(11,103,220,0)_24%),linear-gradient(180deg,#dbe7f7_0%,#cfdced_24%,#f2f5fa_100%)]"
          }`}
        />
        <div className="absolute inset-0 bg-[url('/Hero-dark.webp')] bg-cover bg-[center_right] opacity-25 mix-blend-screen md:opacity-35" />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(90deg,rgba(2,6,13,0.98)_0%,rgba(2,8,18,0.95)_36%,rgba(2,8,18,0.68)_58%,rgba(2,8,18,0.2)_74%,rgba(2,8,18,0.06)_100%)]"
              : "bg-[linear-gradient(90deg,rgba(238,244,252,0.98)_0%,rgba(232,239,248,0.94)_36%,rgba(232,239,248,0.72)_58%,rgba(232,239,248,0.26)_74%,rgba(232,239,248,0.08)_100%)]"
          }`}
        />
        <div className="absolute right-[28%] top-0 hidden h-full w-[190px] skew-x-[-24deg] bg-[linear-gradient(180deg,rgba(108,158,255,0.16)_0%,rgba(108,158,255,0.04)_100%)] md:block" />
        <div className="absolute bottom-[23%] right-[8%] hidden h-[230px] w-[460px] rounded-[50%] border border-[rgba(79,133,242,0.35)] md:block" />
        <div className="absolute bottom-[26%] right-[11%] hidden h-[170px] w-[340px] rounded-[50%] border border-[rgba(79,133,242,0.28)] md:block" />
      </div>

      <div className="relative mx-auto flex w-full max-w-8xl flex-col px-3 pb-[6px] pt-0 md:px-6 md:pb-[12px] md:pt-1">
        <div className="grid items-start md:grid-cols-[minmax(0,1.02fr)_minmax(400px,0.98fr)] md:gap-2">
          <div className="order-1 min-w-0 max-w-[760px] pt-1 md:order-none md:self-start md:pt-2">
            <MetaPill items={metaItems} isDark={isDark} />

            <div className="mt-3 md:mt-3">
              <HeroTitle title={data.h1} isDark={isDark} accentText={accentToken} />
            </div>
            <div className="mt-3">
              <MStripe />
            </div>

            <p className={`mt-3 max-w-full break-words px-0 ${sectionDescription} ${isDark ? "text-white/88" : "text-[var(--color-text-muted)]"}`}>
              {description.split("[BMW-VERIFIED]").map((part, index, array) => (
                <span key={`${part}-${index}`}>
                  {part}
                  {index < array.length - 1 ? <span className="text-[var(--color-primary)]">[BMW-VERIFIED]</span> : null}
                </span>
              ))}
            </p>

            {data.primaryCta ? (
              <Link
                href="/quote"
                className={`btn-cta mt-4 hidden min-h-11 w-fit items-center justify-center md:gap-3 rounded-lg border border-[rgba(114,160,255,0.34)] bg-[linear-gradient(180deg,var(--color-primary)_0%,var(--color-primary-strong)_100%)] px-6 py-2.5 font-bold text-white shadow-[0_18px_46px_rgba(1,20,48,0.42)] md:inline-flex ${sectionButton}`}
              >
                <span>{ctaLabel}</span>
                <ArrowIcon />
              </Link>
            ) : null}
          </div>

          <div className="relative order-2 flex min-h-[240px] items-end justify-center md:min-h-[500px] md:justify-end">
            <div className="absolute inset-x-0 bottom-[8%] mx-auto h-[150px] w-[92%] rounded-[50%] border border-[rgba(79,133,242,0.3)] md:bottom-[3%] md:h-[220px] md:w-[86%]" />
            <div className="absolute inset-x-0 bottom-[11%] mx-auto h-[104px] w-[72%] rounded-[50%] border border-[rgba(79,133,242,0.2)] md:bottom-[7%] md:h-[152px] md:w-[64%]" />
            <Image
              src="/e90/engine.webp"
              alt={normalizeText(data.h1)}
              width={522}
              height={608}
              priority
              className="relative z-10 mx-auto h-auto w-[64%] max-w-[270px] object-contain drop-shadow-[0_28px_48px_rgba(0,0,0,0.5)] md:ml-auto md:w-full md:max-w-[522px]"
            />
          </div>
        </div>

        {data.primaryCta ? (
          <Link
            href="/quote"
            className={`btn-cta relative z-10 mt-4 inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-[rgba(114,160,255,0.34)] bg-[linear-gradient(180deg,var(--color-primary)_0%,var(--color-primary-strong)_100%)] px-6 py-3 text-center font-bold text-white shadow-[0_18px_46px_rgba(1,20,48,0.42)] md:hidden ${sectionButton}`}
          >
            <span>{ctaLabel}</span>
            <ArrowIcon />
          </Link>
        ) : null}

        {data.trustStrip?.length > 0 ? (
          <ul
            className={`relative z-10 mt-3 grid grid-cols-2 gap-2.5 md:mt-[-10px] md:grid-cols-4 md:gap-0 md:overflow-hidden md:rounded-2xl md:border md:shadow-[0_22px_56px_rgba(0,0,0,0.24)] ${
              isDark
                ? "md:border-white/14 md:bg-[linear-gradient(180deg,rgba(7,16,33,0.74)_0%,rgba(3,10,23,0.86)_100%)]"
                : "md:border-[rgba(11,103,220,0.16)] md:bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(239,245,252,0.94)_100%)]"
            }`}
          >
            {data.trustStrip.map((item, index) => (
              <StatCard key={`${item.label}-${index}`} item={item} index={index} isDark={isDark} />
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
