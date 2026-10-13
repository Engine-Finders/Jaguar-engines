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
  "expert-verified",
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
        <span className="block md:hidden">Every</span>
        <span className="block md:hidden">Generation,</span>
        <span className="hidden md:block">Every Generation,</span>
        <span className="block">Honestly Rated</span>
      </>
    );
  }

  if (label === "Part of Engine Finders") {
    return (
      <>
        <span className="block">Part of</span>
        <span className="block">Engine Finders</span>
      </>
    );
  }

  if (label === "Real Enquiries") {
    return <span className="block">Real Enquiries</span>;
  }

  if (label === "Vetted Jaguar Specialists") {
    return (
      <>
        <span className="block">Vetted Jaguar</span>
        <span className="block">Specialists</span>
      </>
    );
  }

  return label;
}

function TrustBadgeText({ text = "" }) {
  const lines = {
    "Genuine failure data from thousands of UK owners": ["Genuine failure data from", "thousands of UK owners"],
    "Honest repair vs replace economics": ["Honest repair vs replace", "economics"],
    "Expertly verified by 15+ vetted Jaguar specialists": ["Expertly verified by 15+", "vetted Jaguar specialists"],
    "100% independent. No sponsors. No bias.": ["100% independent.", "No sponsors. No bias."],
  };

  const pair = lines[text];
  if (pair) {
    return (
      <>
        <span className="block">{pair[0]}</span>
        <span className="block">{pair[1]}</span>
      </>
    );
  }

  return text;
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
  const heroImageSrc = isDark ? "/home-image/hero-front-dark.webp" : "/home-image/hero-front-day.webp";
  const trustStrip = data.trustStrip || [];
  const trustBadges = data.trustBadges || [];
  const ctaHref = data.cta?.href || "/quote";
  const ctaLabel = data.cta?.label || "START YOUR RESEARCH →";

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)] text-[var(--color-text)] xl:min-h-[640px]">
      {/* Desktop background (1280px+) */}
      <div className="absolute inset-0 hidden xl:block">
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

      <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-5 pt-6 xl:min-h-[640px] xl:justify-center md:px-6 md:py-10 md:pb-6 md:pt-8 lg:px-8">
        <div className="relative flex w-full flex-col gap-3 md:gap-4 xl:max-w-[720px]">
          {/* Copy block. Below 1280px the hero photo sits behind it, anchored to the paragraph so the car
              lands beside the text on every width; on desktop the full-bleed background above is used. */}
          <div className="relative flex flex-col gap-3 md:gap-4">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[28vw] -right-[calc(7vw+1rem)] w-[129vw] md:-bottom-[18vw] md:-right-[calc(1.5rem-2vw)] md:w-[75vw] lg:-right-[calc(2rem-2vw)] xl:hidden"
            >
              <Image
                src={heroImageSrc}
                alt=""
                width={1536}
                height={1024}
                className="block h-auto w-full [mask-image:radial-gradient(ellipse_62%_44%_at_72%_54%,#000_58%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_62%_44%_at_72%_54%,#000_58%,transparent_100%)]"
                sizes="(min-width: 768px) 75vw, 129vw"
                priority
              />
            </div>

          {/* H1 hardcoded - two lines like ref */}
          <p
            className={`relative text-[0.68rem] font-bold uppercase tracking-[0.16em] md:text-[0.73rem] md:tracking-[0.14em] ${
              isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
            }`}
          >
            The UK&apos;s Most
          </p>
          <h1
            className={`relative max-w-[660px] text-[32px] font-bold leading-[0.98] tracking-normal md:max-w-[720px] md:text-[3.5rem] md:leading-[0.96] lg:text-[4rem] ${
              isDark ? "text-white" : "text-[var(--color-text)]"
            }`}
          >
            Trusted <span className="text-[var(--color-chrome-bright)]">Jaguar</span>
            <br />
            <span className="text-[var(--color-chrome-bright)]">Ownership Guide</span>
          </h1>

          <div className="relative">
            <MStripe />
          </div>

          <p
            className={`relative max-w-[46%] text-[0.84rem] leading-[1.45] md:max-w-[52%] xl:max-w-[620px] md:text-[1.08rem] md:leading-[1.45] ${
              isDark ? "text-white/86" : "text-[var(--color-text-muted)]"
            }`}
            dangerouslySetInnerHTML={{ __html: data.subHeadline }}
          />

          </div>

          {/* Stats strip — open columns below 1280px; a frosted card on desktop, where it sits over the photo */}
          <ul
            className={`relative mt-[7vw] grid grid-cols-4 md:mt-[5vw] md:max-w-[700px] xl:mt-0 xl:rounded-lg xl:border xl:py-1.5 xl:backdrop-blur-xl ${
              isDark
                ? "xl:border-white/14 xl:bg-[rgba(12,12,12,0.62)] xl:shadow-[0_14px_32px_rgba(0,0,0,0.45)]"
                : "xl:border-[var(--color-border)] xl:bg-[rgba(250,250,248,0.86)] xl:shadow-[0_12px_28px_rgba(16,18,16,0.1)]"
            }`}
          >
            {trustStrip.map((item, index) => {
              const stat = splitStat(item.label);
              const iconKey = trustStripIconKeys[index] || "real-inquiries";

              return (
                <li
                  key={item.label}
                  className={`flex flex-col items-center gap-1.5 border-r px-1 py-0.5 text-center last:border-r-0 md:flex-row md:items-start md:gap-2.5 md:px-3 md:py-2 md:text-left ${
                    isDark ? "border-white/18" : "border-[var(--color-chrome)]/55"
                  }`}
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center md:h-12 md:w-12">
                    <HomeIcon name={iconKey} isDark={isDark} className="h-14 w-14 md:h-12 md:w-12" />
                  </span>
                  <span className={`min-w-0 ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                    {stat.value ? (
                      <strong className="block text-[0.9rem] font-bold leading-none md:text-[1.05rem]">{stat.value}</strong>
                    ) : null}
                    <span
                      className={`mt-0.5 block text-[11px] leading-[1.25] md:mt-0.5 md:text-[0.78rem] md:leading-[1.3] ${
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

        {/* Trust badges glass panel — larger icons on mobile only */}
        {trustBadges.length > 0 ? (
          <div
            className={`mt-3.5 w-full max-w-[1000px] overflow-hidden rounded-md backdrop-blur-xl md:mt-5 md:rounded-xl md:border md:shadow-[0_14px_36px_rgba(16,18,16,0.1)] ${
              isDark
                ? "bg-[rgba(12,12,12,0.55)] md:border-white/16 md:shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
                : "bg-[rgba(246,246,244,0.78)] md:border-[var(--color-border)]"
            }`}
          >
            <ul className="grid md:grid-cols-4">
              {trustBadges.map((badge, index) => (
                <li
                  key={badge.text}
                  className={`flex items-center gap-3 border-b px-3.5 py-3 last:border-b-0 md:gap-2.5 md:border-b-0 md:border-r md:px-3.5 md:py-3 md:last:border-r-0 ${
                    isDark ? "border-white/12" : "border-[var(--color-chrome)]/45"
                  }`}
                >
                  <span className={`flex h-16 w-16 shrink-0 items-center justify-center md:h-14 md:w-14 ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                    <HomeIcon name={trustBadgeIconKeys[index]} isDark={isDark} className="h-16 w-16 md:h-14 md:w-14" />
                  </span>
                  <p
                    className={`min-w-0 text-[0.8rem] leading-[1.3] md:text-[0.82rem] ${
                      isDark ? "text-white/88" : "text-[var(--color-text)]"
                    }`}
                  >
                    <TrustBadgeText text={badge.text} />
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
