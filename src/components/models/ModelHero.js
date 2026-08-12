"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionButton, sectionDescription, sectionH1 } from "@/components/models/sectionTypography";

const iconPaths = [
  <path key="chart" d="M5 19V9m5 10V5m5 14v-7m5 7H3" />,
  <path key="tool" d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  <path key="book" d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22V6.5Zm16 0A2.5 2.5 0 0 0 17.5 4H13v16h4.5A2.5 2.5 0 0 1 20 22V6.5Z" />,
  <path key="trophy" d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
];

function StatIcon({ index }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] md:h-10 md:w-10 md:border-0 md:bg-transparent">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth="2">
        {iconPaths[index] || iconPaths[0]}
      </svg>
    </span>
  );
}

function MetaIcon({ type }) {
  const path =
    type === "engine" ? (
      <path d="M3 12h3m12 0h3M7 9h10v6H7V9Zm2-3h6m-3 0V3M5 15v3m14-3v3M9 18h6" />
    ) : (
      <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />
    );

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth="2">
      {path}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function splitTagPill(tagPill) {
  const parts = tagPill.split(" • ");

  return {
    model: parts[0] || "",
    years: parts[1] || "",
    generations: parts[2] || "",
    engines: parts.slice(3).join(" • "),
  };
}

function splitStat(label) {
  const [main, detail = ""] = label.split(" -");
  const [value, ...rest] = main.split(" ");
  const hasValue = /[0-9+]/.test(value);

  return {
    value: hasValue ? value : "",
    label: hasValue ? rest.join(" ") : main,
    detail,
  };
}

function renderStatLabel(label) {
  const powertrainsIndex = label.indexOf("Powertrains");
  if (powertrainsIndex !== -1) {
    return (
      <>
        {label.slice(0, powertrainsIndex)}
        <span className="block md:inline">Powertrains</span>
      </>
    );
  }

  const codesIndex = label.indexOf("Codes");
  if (codesIndex !== -1) {
    return (
      <>
        {label.slice(0, codesIndex)}
        <span className="block md:inline">Codes</span>
      </>
    );
  }

  return label;
}

function MetaSeparator() {
  return <span aria-hidden="true" className="text-[var(--color-text-muted)]">{"\u2022"}</span>;
}

function HeroTitle({ title, isDark }) {
  const guideIndex = title.indexOf("UK Guide");
  const textClass = isDark ? "text-white" : "text-[var(--color-primary)]";

  if (guideIndex === -1) {
    return (
      <h1 className={`max-w-[720px] font-bold tracking-normal ${sectionH1} ${textClass}`} dangerouslySetInnerHTML={{ __html: title }} />
    );
  }

  return (
    <h1 className={`max-w-[760px] font-bold tracking-normal ${sectionH1} ${textClass}`}>
      <span dangerouslySetInnerHTML={{ __html: title.slice(0, guideIndex) }} />
      <span className="text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: title.slice(guideIndex) }} />
    </h1>
  );
}

function StatCard({ item, index, isDark }) {
  const stat = splitStat(item.label);

  return (
    <li
      className={`flex min-h-[92px] flex-col items-center justify-center gap-2.5 rounded-md border p-2.5 text-center md:min-h-0 md:flex-row md:items-center md:justify-start md:gap-3 md:rounded-none md:border-y-0 md:border-l-0 md:border-r md:px-5 md:py-3 md:text-left md:last:border-r-0 ${
        isDark
          ? "border-white/14 bg-[rgba(4,35,82,0.52)] md:border-white/12 md:bg-transparent"
          : "border-[var(--color-border)] bg-[rgba(255,255,255,0.86)] md:border-[var(--color-border)] md:bg-transparent"
      }`}
    >
      <StatIcon index={index} />
      <div className="min-w-0 flex-1">
        <p className="text-[19px] font-bold leading-tight text-[var(--color-text)] md:text-[18px]">
          {stat.value ? (
            <>
              <span dangerouslySetInnerHTML={{ __html: stat.value }} /> <span className="text-[12px] font-semibold md:text-[12px]">{renderStatLabel(stat.label)}</span>
            </>
          ) : (
            renderStatLabel(stat.label)
          )}
        </p>
        <span className="mt-2 block h-px w-full bg-[var(--color-border)] opacity-70 md:hidden" />
        {stat.detail ? <p className="mt-1.5 text-[12px] leading-[1.3] text-[var(--color-text-muted)] md:mt-1" dangerouslySetInnerHTML={{ __html: stat.detail }} /> : null}
      </div>
    </li>
  );
}

export default function ModelHero({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const meta = splitTagPill(data.tagPill);

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[var(--color-page)] text-[var(--color-text)] md:min-h-[620px]">
      <div className="absolute inset-0">
        <Image
          src="/model/Hero-bg-image.webp"
          alt=""
          fill
          className="object-cover object-[62%_center] md:object-center"
          sizes="100vw"
          priority
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(100deg,rgba(2,7,17,0.98)_0%,rgba(2,7,17,0.93)_41%,rgba(2,7,17,0.18)_67%,rgba(2,7,17,0.08)_100%)]"
              : "bg-[linear-gradient(90deg,var(--color-hero-fade)_0%,rgba(255,255,255,0.91)_35%,rgba(255,255,255,0.2)_66%,rgba(255,255,255,0)_100%)]"
          }`}
        />
        <div
          className={`absolute inset-y-0 left-[48%] hidden w-14 -skew-x-[18deg] md:left-[48%] md:block ${
            isDark ? "bg-[rgba(50,126,231,0.26)]" : "bg-[rgba(11,103,220,0.14)]"
          }`}
        />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)] md:h-44" />
      </div>
      <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-5 pt-3 md:min-h-[620px] md:px-8 md:pb-7 md:pt-11">
        <div className="max-w-[650px]">
          <div
            className={`inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1.5 rounded-md border px-3 py-2 text-[13px] leading-[1.35] md:max-w-[680px] md:px-4 md:py-2.5 md:text-[15px] md:leading-[1.45] ${
              isDark
                ? "border-white/30 bg-[rgba(4,35,82,0.46)] text-white"
                : "border-[rgba(11,103,220,0.48)] bg-[rgba(255,255,255,0.58)] text-[var(--color-text-muted)]"
            }`}
          >
            <MetaIcon />
            <strong className="font-semibold text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: meta.model }} />
            <MetaSeparator />
            <span dangerouslySetInnerHTML={{ __html: meta.years }} />
            <MetaSeparator />
            <span dangerouslySetInnerHTML={{ __html: meta.generations }} />
            <MetaSeparator />
            <MetaIcon type="engine" />
            <span dangerouslySetInnerHTML={{ __html: meta.engines }} />
          </div>

          <div className="mt-6 md:mt-8">
            <HeroTitle title={data.h1} isDark={isDark} />
          </div>
          <div className="mt-3">
            <MStripe />
          </div>
          <p className={`mt-4 max-w-[610px] ${sectionDescription} text-[var(--color-text-muted)]`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />

          {data.primaryCta ? (
            <Link
              href="/quote"
              className={`btn-cta mt-5 inline-flex min-h-10 items-center justify-center gap-3 rounded-md bg-[var(--color-primary)] px-4 py-2 font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] ${sectionButton} md:min-h-11 md:px-5`}
            >
              <span dangerouslySetInnerHTML={{ __html: data.primaryCta.label.replace(/\s*(?:→|â†’)\s*$/, "") }} />
              <ArrowIcon />
            </Link>
          ) : null}
        </div>

        {data.trustStrip?.length > 0 ? (
          <ul
            className={`mt-8 grid grid-cols-2 gap-2.5 md:mt-auto md:grid-cols-4 md:gap-0 md:overflow-hidden md:rounded-lg md:border md:shadow-[0_14px_36px_var(--color-shadow)] ${
              isDark
                ? "md:border-white/12 md:bg-[rgba(4,35,82,0.54)]"
                : "md:border-[var(--color-border)] md:bg-[rgba(255,255,255,0.86)]"
            }`}
          >
            {data.trustStrip.map((item, index) => (
              <StatCard key={item.label} item={item} index={index} isDark={isDark} />
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
