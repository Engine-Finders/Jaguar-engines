"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { sectionButton, sectionDescription, sectionH1 } from "@/components/models/sectionTypography";

const trustStripIconKeys = [
  "most-enquired",
  "generations",
  "engine-codes",
  "engine-finders",
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function splitTagPill(tagPill = "") {
  const parts = String(tagPill).split(" • ");

  return {
    brand: parts[0] || "Jaguar",
    model: parts[1] || "",
    years: parts[2] || "",
    generations: parts[3] || "",
    engines: parts.slice(4).join(" • "),
  };
}

function splitStat(label = "") {
  const cleaned = String(label);
  const [main, detail = ""] = cleaned.split(/\s+[—–-]\s+/);
  const [value, ...rest] = main.split(" ");
  const hasValue = /[0-9+]/.test(value);

  return {
    value: hasValue ? value : "",
    label: hasValue ? rest.join(" ") : main,
    detail: detail.trim(),
  };
}

function MetaSeparator({ isDark }) {
  return (
    <span aria-hidden="true" className={isDark ? "text-white/35" : "text-[var(--color-chrome)]"}>
      {"\u2022"}
    </span>
  );
}

function HeroTitle({ title, isDark }) {
  const guideIndex = title.indexOf("UK Guide");
  const textClass = isDark ? "text-white" : "text-[var(--color-text)]";

  if (guideIndex === -1) {
    return (
      <h1
        className={`max-w-[720px] font-bold tracking-normal ${sectionH1} ${textClass}`}
        dangerouslySetInnerHTML={{ __html: title }}
      />
    );
  }

  return (
    <h1 className={`max-w-[760px] font-bold tracking-normal ${sectionH1} ${textClass}`}>
      <span dangerouslySetInnerHTML={{ __html: title.slice(0, guideIndex) }} />
      <span
        className="text-[var(--color-chrome-bright)]"
        dangerouslySetInnerHTML={{ __html: title.slice(guideIndex) }}
      />
    </h1>
  );
}

function StatCard({ item, index, isDark }) {
  const stat = splitStat(item.label);
  const iconKey = trustStripIconKeys[index] || "real-inquiries";

  return (
    <li
      className={`flex flex-col items-center gap-1.5 border-r px-1 py-0.5 text-center last:border-r-0 md:flex-row md:items-center md:gap-2.5 md:px-4 md:py-3 md:text-left ${
        isDark ? "border-white/12" : "border-[var(--color-chrome)]/45"
      }`}
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center md:h-14 md:w-14">
        <HomeIcon name={iconKey} isDark={isDark} className="h-14 w-14 object-contain" />
      </span>
      <div className={`min-w-0 flex-1 ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
        {stat.value ? (
          <p className="leading-tight">
            <strong className="block text-[0.9rem] font-bold leading-none md:inline md:text-[1.05rem]">
              {stat.value}
            </strong>
            {stat.label ? (
              <span
                className={`mt-0.5 block text-[11px] leading-[1.25] md:mt-0 md:ml-1.5 md:inline md:text-[0.9rem] md:leading-snug ${
                  isDark ? "text-white/88" : "text-[var(--color-text)]"
                }`}
              >
                {stat.label}
              </span>
            ) : null}
          </p>
        ) : (
          <p className="text-[11px] font-semibold leading-tight md:text-[0.88rem]">{stat.label}</p>
        )}
        {stat.detail ? (
          <p
            className={`mt-0.5 text-[10px] leading-[1.25] md:text-[0.72rem] ${
              isDark ? "text-white/65" : "text-[var(--color-text-muted)]"
            }`}
            dangerouslySetInnerHTML={{ __html: stat.detail }}
          />
        ) : null}
      </div>
    </li>
  );
}

export default function ModelHero({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const meta = splitTagPill(data.tagPill);
  const ctaHref = data.primaryCta?.href && data.primaryCta.href !== "#" ? data.primaryCta.href : "/quote";

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
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)] md:h-44" />
      </div>

      <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-5 pt-3 md:min-h-[620px] md:px-8 md:pb-7 md:pt-11">
        <div className="max-w-[650px]">
          <div
            className={`inline-flex w-fit max-w-full flex-nowrap items-center gap-x-2 overflow-x-auto whitespace-nowrap rounded-md border px-3 py-2 text-[12px] leading-none md:overflow-x-visible md:gap-x-2.5 md:px-4 md:py-2.5 md:text-[14px] ${
              isDark
                ? "border-white/20 bg-[rgba(12,12,12,0.55)] text-white/88"
                : "border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] text-[var(--color-text-muted)]"
            }`}
          >
            <HomeIcon name="shield" isDark={isDark} className="h-7 w-7 shrink-0 object-contain md:h-8 md:w-8" />
            <strong className={`shrink-0 font-semibold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
              {meta.brand}
            </strong>
            {meta.model ? (
              <>
                <MetaSeparator isDark={isDark} />
                <span className="shrink-0" dangerouslySetInnerHTML={{ __html: meta.model }} />
              </>
            ) : null}
            {meta.years ? (
              <>
                <MetaSeparator isDark={isDark} />
                <span className="shrink-0" dangerouslySetInnerHTML={{ __html: meta.years }} />
              </>
            ) : null}
            {meta.generations ? (
              <>
                <MetaSeparator isDark={isDark} />
                <span className="shrink-0" dangerouslySetInnerHTML={{ __html: meta.generations }} />
              </>
            ) : null}
            {meta.engines ? (
              <>
                <MetaSeparator isDark={isDark} />
                <HomeIcon name="engine" isDark={isDark} className="h-7 w-7 shrink-0 object-contain md:h-8 md:w-8" />
                <span className="shrink-0" dangerouslySetInnerHTML={{ __html: meta.engines }} />
              </>
            ) : null}
          </div>

          <div className="mt-6 md:mt-8">
            <HeroTitle title={data.h1} isDark={isDark} />
            <div className="mt-3">
              <MStripe />
            </div>
            <p
              className={`mt-4 max-w-[610px] ${sectionDescription} ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />

            {data.primaryCta ? (
              <Link
                href={ctaHref}
                className={`btn-cta mt-5 inline-flex min-h-10 items-center justify-center gap-3 rounded-md px-4 py-2 font-bold shadow-[0_12px_28px_var(--color-shadow)] ${sectionButton} md:min-h-11 md:px-5`}
              >
                <span dangerouslySetInnerHTML={{ __html: data.primaryCta.label.replace(/\s*(?:→|â†’)\s*$/, "") }} />
                <ArrowIcon />
              </Link>
            ) : null}
          </div>
        </div>

        {data.trustStrip?.length > 0 ? (
          <div
            className={`mt-8 w-full max-w-[1000px] overflow-hidden rounded-md backdrop-blur-xl md:mt-auto md:rounded-xl md:border md:shadow-[0_14px_36px_rgba(16,18,16,0.1)] ${
              isDark
                ? "bg-[rgba(12,12,12,0.55)] md:border-white/16 md:shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
                : "bg-[rgba(246,246,244,0.86)] md:border-[var(--color-border)]"
            }`}
          >
            <ul className="grid grid-cols-4">
              {data.trustStrip.map((item, index) => (
                <StatCard key={item.label} item={item} index={index} isDark={isDark} />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
