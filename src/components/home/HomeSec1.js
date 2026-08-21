"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const trustStripIconKeys = [
  "real-inquiries",
  "vetted-specialist",
  "generation-honest-rated",
  "engine-finders",
];

const trustBadgeIconKeys = [
  "genuine-failure-data",
  "repair-vs-replace",
  "vetted-specialist",
  "independent",
];

function splitStat(label = "") {
  const [first, ...rest] = label.split(" ");
  const hasMetric = /[0-9+]/.test(first);

  return {
    value: hasMetric ? first : "",
    text: hasMetric ? rest.join(" ") : label,
  };
}

function TrustLabel({ label }) {
  if (label === "Every Generation, Honestly Rated") {
    return (
      <>
        <span className="block">Every Generation,</span>
        <span className="block">Honestly Rated</span>
      </>
    );
  }

  if (label === "Part of Engine Finders") {
    return (
      <>
        <span className="block md:inline">Part of</span>
        <span className="block md:ml-1 md:inline">Engine Finders</span>
      </>
    );
  }

  if (label === "Real Enquiries") {
    return (
      <>
        <span className="block md:inline">Real Enquiries</span>
      </>
    );
  }

  if (label === "Vetted Jaguar Specialists") {
    return (
      <>
        <span className="block md:inline">Vetted Jaguar</span>
        <span className="block md:ml-1 md:inline">Specialists</span>
      </>
    );
  }

  return label;
}

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export default function HomeSec1({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const heroImageSrc = isDark ? "/Hero-dark.webp" : "/hero-day.webp";
  const trustStrip = data.trustStrip || [];
  const trustBadges = data.trustBadges || [];
  const ctaHref = data.cta?.href || "/quote";
  const ctaLabel = data.cta?.label || "START YOUR RESEARCH →";

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)] text-[var(--color-text)] md:min-h-[640px]">
      {/* Mobile background */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src={heroImageSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div
          className={
            isDark
              ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.78)_28%,rgba(0,0,0,0.28)_58%,rgba(0,0,0,0.88)_100%)]"
              : "absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.72)_28%,rgba(255,255,255,0.18)_58%,rgba(255,255,255,0.88)_100%)]"
          }
        />
      </div>

      {/* Desktop background */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src={heroImageSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div
          className={
            isDark
              ? "absolute inset-0 bg-[linear-gradient(105deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.82)_34%,rgba(0,0,0,0.28)_62%,transparent_78%)]"
              : "absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.86)_34%,rgba(255,255,255,0.28)_62%,transparent_78%)]"
          }
        />
        <div
          className={
            isDark
              ? "absolute inset-y-0 left-[36%] w-[18%] -skew-x-[18deg] bg-[linear-gradient(90deg,rgba(0,0,0,0.55)_0%,transparent_100%)]"
              : "absolute inset-y-0 left-[36%] w-[18%] -skew-x-[18deg] bg-[linear-gradient(90deg,rgba(255,255,255,0.35)_0%,transparent_100%)]"
          }
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-6 pt-8 md:min-h-[640px] md:justify-center md:px-6 md:py-10 lg:px-8">
        <div className="relative flex w-full max-w-[720px] flex-col gap-3.5 md:gap-4">
          {/* H1 hardcoded - two lines like ref */}
          <h1
            className={`max-w-[660px] text-[32px] font-bold leading-[0.98] tracking-normal md:max-w-[720px] md:text-[3.5rem] md:leading-[0.96] lg:text-[4rem] ${
              isDark ? "text-white" : "text-[var(--color-text)]"
            }`}
          >
            Trusted <span className="text-[var(--color-chrome-bright)]">Jaguar</span>
            <br />
            <span className="text-[var(--color-chrome-bright)]">Ownership Guide</span>
          </h1>

          <MStripe />

          <p
            className={`max-w-[620px] text-[0.88rem] leading-[1.45] md:text-[1.08rem] md:leading-[1.45] ${
              isDark ? "text-white/86" : "text-[var(--color-text-muted)]"
            }`}
            dangerouslySetInnerHTML={{ __html: data.subHeadline }}
          />

          {/* Mobile spacer for car visibility */}
          <div className="relative mt-1 h-[210px] md:hidden" />

          {/* Stats strip - mobile fog/glass band for readability */}
          <ul
            className={`grid grid-cols-4 md:max-w-[700px] md:bg-transparent md:backdrop-blur-none md:border-0 md:shadow-none ${
              isDark
                ? "rounded-lg border border-white/14 bg-[rgba(8,8,8,0.55)] py-3 shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur-md md:rounded-none md:border-0 md:bg-transparent md:py-0 md:shadow-none"
                : "rounded-lg border border-[var(--color-chrome)]/40 bg-[rgba(236,236,232,0.72)] py-3 shadow-[0_10px_28px_rgba(16,18,16,0.1)] backdrop-blur-md md:rounded-none md:border-0 md:bg-transparent md:py-0 md:shadow-none"
            }`}
          >
            {trustStrip.map((item, index) => {
              const stat = splitStat(item.label);
              const iconKey = trustStripIconKeys[index] || "real-inquiries";

              return (
                <li
                  key={item.label}
                  className={`flex flex-col items-center gap-2 border-r px-1.5 py-1 text-center last:border-r-0 md:flex-row md:items-start md:gap-2.5 md:px-3 md:py-2 md:text-left ${
                    isDark ? "border-white/18" : "border-[var(--color-chrome)]/55"
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center md:h-10 md:w-10">
                    <HomeIcon name={iconKey} isDark={isDark} className="h-8 w-8 md:h-10 md:w-10" />
                  </span>
                  <span className={`min-w-0 ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                    {stat.value ? (
                      <strong className="block text-[0.86rem] font-bold leading-none md:text-[1.05rem]">{stat.value}</strong>
                    ) : null}
                    <span
                      className={`mt-1 block text-[10px] leading-[1.25] md:mt-0.5 md:text-[0.78rem] md:leading-[1.3] ${
                        isDark ? "text-white/76" : "text-[var(--color-text-muted)]"
                      } ${stat.value ? "" : "md:pt-1"}`}
                    >
                      <TrustLabel label={stat.text} />
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <Link
            href={ctaHref}
            className="btn-cta mt-1 inline-flex w-full items-center justify-center gap-3 rounded-md px-5 py-3.5 text-[0.82rem] font-bold tracking-[0.04em] md:mt-2 md:w-fit md:px-6 md:py-3.5 md:text-[0.9rem]"
          >
            <span>{ctaLabel.replace(/\s*→\s*$/, "")}</span>
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Trust badges glass panel */}
        {trustBadges.length > 0 ? (
          <div
            className={`mt-4 overflow-hidden rounded-xl border backdrop-blur-xl md:mt-5 ${
              isDark
                ? "border-white/16 bg-[rgba(12,12,12,0.55)] shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
                : "border-[var(--color-border)] bg-[rgba(246,246,244,0.78)] shadow-[0_14px_36px_rgba(16,18,16,0.1)]"
            }`}
          >
            <ul className="grid md:grid-cols-4">
              {trustBadges.map((badge, index) => (
                <li
                  key={badge.text}
                  className={`flex items-center gap-2.5 border-b px-3 py-2.5 last:border-b-0 md:border-b-0 md:border-r md:px-3.5 md:py-3 md:last:border-r-0 ${
                    isDark ? "border-white/12" : "border-[var(--color-chrome)]/45"
                  }`}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                    <HomeIcon name={trustBadgeIconKeys[index]} isDark={isDark} className="h-7 w-7" />
                  </span>
                  <p
                    className={`min-w-0 text-[0.78rem] leading-[1.3] md:text-[0.82rem] ${
                      isDark ? "text-white/88" : "text-[var(--color-text)]"
                    }`}
                  >
                    {badge.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
