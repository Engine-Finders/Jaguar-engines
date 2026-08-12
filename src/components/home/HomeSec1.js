"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const iconPaths = [
  <path key="chart" d="M5 19V9m5 10V5m5 14v-7m5 7H3" />,
  <path key="tool" d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  <path key="book" d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22V6.5Zm16 0A2.5 2.5 0 0 0 17.5 4H13v16h4.5A2.5 2.5 0 0 1 20 22V6.5Z" />,
  <path key="trophy" d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
];

function StatIcon({ index }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[var(--color-primary)] md:h-auto md:w-auto md:bg-transparent md:text-[var(--color-primary)]">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        {iconPaths[index] || iconPaths[0]}
      </svg>
    </span>
  );
}

function splitStat(label) {
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
        <span className="block">Honestly</span>
        <span className="block">Rated</span>
      </>
    );
  }

  if (label === "Part of Engine Finders") {
    return (
      <>
        <span className="block">Part of Engine</span>
        <span className="block">Finders</span>
      </>
    );
  }

  return label;
}

function HeroTitle({ html }) {
  return (
    <h1
      className="max-w-[660px] text-[32px] font-bold leading-[0.95] tracking-normal text-white md:max-w-[720px] md:text-[3.5rem] md:leading-[0.94] md:text-[var(--color-text)] lg:text-[4rem]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function HomeSec1({ data }) {
  const { theme } = useTheme();
  const heroImageSrc = theme === "dark" ? "/Hero-dark.webp" : "/hero-day.webp";
  const isDark = theme === "dark";

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)] text-[var(--color-text)] md:min-h-[620px]">
      <div className="absolute inset-0 md:hidden">
        <Image
          src={heroImageSrc}
          alt=""
          fill
          className="object-cover object-[62%_center]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,11,0.94)_0%,rgba(2,7,11,0.84)_34%,rgba(2,7,11,0.36)_68%,rgba(2,7,11,0.94)_100%)]" />
      </div>

      <div className="absolute inset-0 hidden md:block">
        <Image
          src={heroImageSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-hero-fade)_0%,var(--color-hero-overlay)_35%,transparent_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_28%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-5 pt-8 md:min-h-[620px] md:justify-center md:px-0 md:py-8">
        <div className="relative flex w-full max-w-[720px] flex-col gap-3 md:-ml-6 md:mt-0 md:gap-4">
          <HeroTitle html={data.h1} />

          <MStripe />

          <div className="h-0.5 w-18 bg-[var(--color-primary)] md:hidden" />

          <p
            className="max-w-[620px] text-[0.88rem] leading-[1.42] text-white/88 md:text-[1.08rem] md:leading-[1.42] md:text-[var(--color-text-muted)]"
            dangerouslySetInnerHTML={{ __html: data.subHeadline }}
          />

          <div className="relative mt-1 h-[310px] md:hidden" />

          <ul
            className={`grid grid-cols-4 overflow-hidden rounded-md border shadow-[0_14px_32px_rgba(10,26,43,0.12)] backdrop-blur-xl md:max-w-[700px] md:rounded-lg md:border-[var(--color-border)] md:bg-[var(--color-surface-glass)] md:shadow-[0_10px_30px_var(--color-shadow)] md:grid-cols-4 ${
              isDark
                ? "border-white/10 bg-[rgba(11,17,24,0.44)] shadow-black/30"
                : "border-[var(--color-border)] bg-[rgba(255,255,255,0.4)] shadow-[var(--color-shadow)]"
            }`}
          >
            {data.trustStrip.map((item, index) => {
              const stat = splitStat(item.label);

              return (
                <li
                  key={item.label}
                  className={`flex flex-col items-center justify-start gap-2 border-r px-1.5 py-3.5 text-center last:border-r-0 md:gap-2 md:border-b-0 md:border-r md:border-[var(--color-border)] md:px-3 md:py-3 md:last:border-r-0 ${
                    isDark ? "border-white/10" : "border-[var(--color-border)]"
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center md:h-auto md:w-auto md:rounded-none md:border-0 md:bg-transparent">
                    <StatIcon index={index} />
                  </span>
                  <span className={`text-[0.95rem] leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"} md:text-[var(--color-text)]`}>
                    {stat.value && <strong className="block text-[0.86rem] font-bold leading-none md:inline md:text-[1.25rem]">{stat.value}</strong>}
                    <span
                      className={`mt-1.5 block text-[10px] uppercase leading-[1.3] tracking-normal ${
                        isDark ? "text-white/78" : "text-[var(--color-text-muted)]"
                      } md:mt-0 md:max-w-none md:text-[0.9rem] md:font-normal md:leading-[1.25] md:text-[var(--color-text-muted)] md:normal-case`}
                    >
                      <TrustLabel label={stat.text} />
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <Link
            href={data.cta.href}
            className={`btn-cta rounded-[1.15rem] border p-4 shadow-lg md:hidden ${
              isDark
                ? "border-[rgba(41,115,219,0.75)] bg-[linear-gradient(180deg,rgba(14,79,184,0.98)_0%,rgba(8,59,143,0.98)_100%)] text-white shadow-black/30"
                : "border-[rgba(41,115,219,0.28)] bg-[linear-gradient(180deg,rgba(14,79,184,0.98)_0%,rgba(8,59,143,0.98)_100%)] text-white shadow-[var(--color-shadow)]"
            }`}
          >
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />
                  </svg>
                </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.86rem] font-semibold tracking-[0.06em]">{data.cta.label}</p>
                <p className="mt-1 text-[0.7rem] leading-[1.25] text-white/82">
                  UNBIASED. DATA-DRIVEN. TRUSTED BY THOUSANDS.
                </p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/12 bg-[rgba(3,14,31,0.4)]">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </span>
            </div>
          </Link>

          <Link
            href={data.cta.href}
            className="btn-cta hidden w-full items-center justify-between rounded-[1.25rem] border border-[rgba(41,115,219,0.75)] bg-[linear-gradient(180deg,rgba(14,79,184,0.98)_0%,rgba(8,59,143,0.98)_100%)] px-5 py-4 text-white shadow-lg shadow-black/30 md:flex md:w-fit md:justify-start md:gap-5 md:rounded md:border-0 md:bg-[var(--color-primary)] md:px-7 md:py-3.5 md:text-base md:shadow-lg md:shadow-[var(--color-shadow)]"
          >
            <span className="text-left">
              <span className="block text-lg font-bold tracking-[0.08em] md:text-[1.05rem] md:tracking-normal">{data.cta.label}</span>
            </span>
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[rgba(3,14,31,0.55)] md:h-auto md:w-auto md:rounded-none md:border-0 md:bg-transparent">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </span>
          </Link>

          <div className="flex items-center justify-center gap-3 text-[10px] text-white/62 md:hidden">
            <span>100% INDEPENDENT</span>
            <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
            <span>NO SPONSORSHIP</span>
            <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
            <span>COMPLETELY UNBIASED</span>
          </div>
        </div>
      </div>
    </section>
  );
}
