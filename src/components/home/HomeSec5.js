"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

const LEFT_IMAGE = "/home-image/left.webp";
const RIGHT_IMAGE = "/home-image/right.webp";

function ComparisonCard({ item, isDark }) {
  const left = item.left || {};
  const right = item.right || {};

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-transparent bg-white shadow-[0_10px_28px_rgba(16,18,16,0.08)]"
      }`}
    >
      {/* Number tab — top left */}
      <span
        className={`absolute left-0 top-0 z-20 flex h-[26px] min-w-[34px] items-center justify-center rounded-br-[10px] px-2.5 font-serif text-[0.8rem] font-semibold leading-none ${
          isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
        }`}
      >
        {item.id}
      </span>

      {/* Visual half — labels + cars + center line */}
      <div className="relative px-4 pb-1 pt-9 md:px-5 md:pt-10">
        <div
          className={`pointer-events-none absolute bottom-1 left-1/2 top-9 w-px -translate-x-1/2 md:top-10 ${
            isDark ? "bg-white/20" : "bg-[#d8d8d6]"
          }`}
          aria-hidden="true"
        />

        {/* Labels row with vs on the line */}
        <div className="relative grid grid-cols-2">
          <p
            className={`pr-5 text-center font-serif text-[0.95rem] font-medium leading-none md:pr-6 md:text-[1.05rem] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {left.label}
          </p>
          <p
            className={`pl-5 text-center font-serif text-[0.95rem] font-medium leading-none md:pl-6 md:text-[1.05rem] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {right.label}
          </p>
          <span
            className={`absolute left-1/2 top-1/2 z-10 flex h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[0.62rem] font-semibold lowercase leading-none md:h-6 md:w-6 ${
              isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
            }`}
          >
            vs
          </span>
        </div>

        <div className="relative mt-3 grid grid-cols-2 md:mt-3.5">
          <div className="relative h-[92px] pr-3 md:h-[108px] md:pr-4">
            <Image
              src={LEFT_IMAGE}
              alt={left.image?.alt || left.label || ""}
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 42vw, 180px"
            />
          </div>
          <div className="relative h-[92px] pl-3 md:h-[108px] md:pl-4">
            <Image
              src={RIGHT_IMAGE}
              alt={right.image?.alt || right.label || ""}
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 42vw, 180px"
            />
          </div>
        </div>
      </div>

      {/* Info half */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3 md:px-5 md:pb-5 md:pt-3.5">
        <div className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              isDark ? "bg-white/10" : "bg-[#ececeb]"
            }`}
          >
            <HomeIcon name={item.icon} isDark={isDark} className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h3
              className={`text-[0.98rem] font-bold leading-tight md:text-[1.08rem] ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {item.title}
            </h3>
            <p
              className={`mt-1 text-[0.78rem] leading-[1.4] md:text-[0.84rem] ${
                isDark ? "text-white/72" : "text-[#5c5c5a]"
              }`}
              dangerouslySetInnerHTML={{ __html: item.preview }}
            />
          </div>
        </div>

        <div className="mt-auto flex justify-end pt-3">
          <Link
            href={item.link?.href || "#"}
            className={`inline-flex items-center gap-1.5 text-[0.82rem] font-semibold md:text-[0.88rem] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            <span>{(item.link?.label || "Read the verdict").replace(/\s*→\s*$/, "")}</span>
            <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-xl border px-3.5 py-3.5 md:mt-6 md:items-center md:px-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[var(--color-border)] bg-[var(--color-page-soft)]"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
        <HomeIcon name="info" isDark={isDark} className="h-8 w-8" />
      </span>
      <p className={`min-w-0 flex-1 text-[0.78rem] leading-[1.4] md:text-[0.86rem] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>
        <strong className={isDark ? "text-white" : "text-[var(--color-text)]"}>{note.label}</strong>{" "}
        <span dangerouslySetInnerHTML={{ __html: note.text }} />
      </p>
      <span className={`hidden shrink-0 text-[var(--color-chrome)] md:block`}>
        <HomeIcon name="info" isDark={isDark} className="h-10 w-10 opacity-40" />
      </span>
    </div>
  );
}

export default function HomeSec5({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const heroImage =
    (isDark ? data.heroImages?.dark : data.heroImages?.light) ||
    data.headerImage || {
      src: "/home-image/sec2-bg.webp",
      alt: "Jaguar comparison hub",
    };
  const comparisons = data.comparisons || [];

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)]">
      {/* Header — same as Sec2 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-[58%] md:w-[46%]">
          <Image
            src={heroImage.src}
            alt={heroImage.alt || ""}
            fill
            className="object-cover object-right"
            sizes="(max-width: 768px) 58vw, 46vw"
          />
          <div
            className={
              isDark
                ? "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(11,12,12,0.82)_34%,rgba(11,12,12,0.18)_100%)]"
                : "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(243,243,241,0.88)_34%,rgba(243,243,241,0.18)_100%)]"
            }
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-3 py-6 md:px-6 md:py-10 lg:px-8">
          <div className="max-w-[720px]">
            <h2
              className={`text-[2.1rem] font-bold leading-[0.98] md:text-[3.2rem] md:leading-[0.96] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Comparison Hub —{" "}
              <span className="text-[var(--color-chrome-bright)]">Head-to-Head Verdicts</span>
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>
            <p
              className={`mt-3 max-w-[640px] text-[0.88rem] leading-[1.4] md:text-[1.02rem] md:leading-[1.45] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-page-soft)]">
        <div className="mx-auto w-full max-w-8xl px-3 py-4 md:px-6 md:py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
            {comparisons.map((item) => (
              <ComparisonCard key={item.id} item={item} isDark={isDark} />
            ))}
          </div>

          <DataNote note={data.dataNote} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
