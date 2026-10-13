"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const ICON_LG = "h-11 w-11 md:h-12 md:w-12";
const ICON_XL = "h-12 w-12 md:h-14 md:w-14";

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function TrustpilotMark({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3-4.6-4.5 6.4-.9L12 2.8Z" />
    </svg>
  );
}

function StarBox({ isDark }) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center md:h-9 md:w-9 ${
        isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="currentColor">
        <path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3-4.6-4.5 6.4-.9L12 2.8Z" />
      </svg>
    </span>
  );
}

export default function HomeSec14({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headerImage = data.headerImage || {
    src: "/home-image/sec2-bg.webp",
    alt: "Jaguar specialist guidance",
  };
  const stats = data.stats || [];
  const guidance = data.guidance || {};
  const review = data.review || null;
  const cta = guidance.cta || {};

  return (
    <section className={`overflow-x-hidden ${isDark ? "bg-[var(--color-page)]" : "bg-[#f8f8f7]"}`}>
      {/* Header — same pattern as Sec2 */}
      <div className="relative overflow-hidden bg-[var(--color-page)]">
        <div className="absolute inset-y-0 right-0 w-[62%] md:w-[48%]">
          <Image
            src={headerImage.src}
            alt={headerImage.alt || ""}
            fill
            className="object-cover object-right"
            sizes="(max-width: 768px) 62vw, 48vw"
          />
          <div
            className={
              isDark
                ? "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(11,12,12,0.82)_34%,rgba(11,12,12,0.18)_100%)]"
                : "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(243,243,241,0.88)_34%,rgba(243,243,241,0.18)_100%)]"
            }
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
          <div className="max-w-[640px]">
            <h2
              className={`font-serif text-[2rem] font-semibold leading-[1.05] md:text-[2.85rem] md:leading-[1.02] ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Get the Right Answer.{" "}
              <span className="text-[var(--color-chrome-bright)]">Not Just Any Answer.</span>
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>
            <p
              className={`mt-3 text-[0.78rem] font-bold uppercase tracking-[0.12em] md:text-[0.84rem] ${
                isDark ? "text-white/75" : "text-[var(--color-text-muted)]"
              }`}
            >
              {data.subHeadline}
            </p>

            {stats.length ? (
              <ul className="mt-5 grid max-w-[600px] grid-cols-4 md:mt-6">
                {stats.map((stat, index) => {
                  const borderColor = isDark ? "border-white/15" : "border-[#d8d8d6]";

                  return (
                    <li
                      key={stat.label}
                      className={`flex flex-col items-center px-1.5 py-2 text-center md:px-3 ${
                        index > 0 ? `border-l ${borderColor}` : ""
                      }`}
                    >
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-full md:h-14 md:w-14 ${
                          isDark ? "bg-white/10" : "bg-[#ececeb]"
                        }`}
                      >
                        <HomeIcon name={stat.icon} isDark={isDark} className="h-11 w-11 md:h-12 md:w-12" />
                      </span>
                      <span
                        className={`mt-1.5 max-w-[120px] text-center text-[0.62rem] leading-[1.25] md:mt-2 md:text-[0.78rem] ${
                          isDark ? "text-white/80" : "text-[var(--color-text)]"
                        }`}
                      >
                        {stat.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom cards */}
      <div className="mx-auto w-full max-w-8xl px-4 py-4 md:px-6 md:py-5 lg:px-8">
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {/* Ask a specialist */}
          <div
            className={`flex flex-col items-center justify-center rounded-xl border px-5 py-6 text-center md:px-8 md:py-7 ${
              isDark
                ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
                : "border-[#e8e8e6] bg-white shadow-[0_8px_22px_rgba(16,18,16,0.04)]"
            }`}
          >
            <p
              className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
              }`}
            >
              {guidance.eyebrow}
            </p>
            <h3
              className={`mt-2 font-heading text-[1.35rem] font-semibold leading-tight md:text-[1.55rem] ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {guidance.title}
            </h3>
            <div className={`mx-auto mt-3 h-px w-12 ${isDark ? "bg-white/25" : "bg-[#d0d0ce]"}`} />

            <Link
              href={cta.href || "#"}
              className={`mt-5 flex w-full max-w-[420px] items-center gap-3 rounded-lg px-4 py-3.5 md:mt-6 md:gap-4 md:px-5 md:py-4 ${
                isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:h-11 md:w-11 ${
                  isDark ? "bg-[var(--color-page)]" : "bg-white"
                }`}
              >
                <HomeIcon name="phone" isDark={isDark} className="h-6 w-6 md:h-7 md:w-7" />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-[0.82rem] font-bold uppercase tracking-[0.04em] md:text-[0.9rem]">
                  {cta.label}
                </span>
                <span className={`mt-0.5 block text-[0.72rem] md:text-[0.78rem] ${isDark ? "opacity-80" : "text-white/80"}`}>
                  {cta.subLabel}
                </span>
              </span>
              <ArrowIcon className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
            </Link>
          </div>

          {/* Trustpilot */}
          {review ? (
            <div
              className={`flex flex-col items-center justify-center rounded-xl border px-5 py-6 text-center md:px-8 md:py-7 ${
                isDark
                  ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
                  : "border-[#e8e8e6] bg-white shadow-[0_8px_22px_rgba(16,18,16,0.04)]"
              }`}
            >
              <div className={`flex items-center gap-2 text-[1.25rem] font-bold md:gap-2.5 md:text-[1.45rem] ${isDark ? "text-white" : "text-black"}`}>
                <TrustpilotMark className="h-7 w-7 md:h-8 md:w-8" />
                <span>{review.brand}</span>
              </div>

              <div className="mt-3.5 flex gap-1 md:mt-4">
                {Array.from({ length: review.stars || 5 }).map((_, index) => (
                  <StarBox key={index} isDark={isDark} />
                ))}
              </div>

              <p className={`mt-3 text-[0.9rem] md:text-[1rem] ${isDark ? "text-white/80" : "text-black"}`}>
                {review.score}
              </p>

              <div className={`my-3.5 h-px w-full max-w-[280px] ${isDark ? "bg-white/20" : "bg-[#e0e0de]"}`} />

              <p className={`max-w-[280px] text-[0.78rem] leading-[1.4] md:text-[0.84rem] ${isDark ? "text-white/70" : "text-[var(--color-text)]"}`}>
                {review.footer}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
