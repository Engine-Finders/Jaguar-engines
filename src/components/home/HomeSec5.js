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
      className={`relative flex h-full flex-col overflow-hidden rounded-xl border ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_20px_rgba(16,18,16,0.06)]"
      }`}
    >
      {/* Number tab — top left */}
      <span
        className={`absolute left-0 top-0 z-20 flex h-[22px] min-w-[30px] items-center justify-center rounded-br-[8px] px-2 font-heading text-[0.74rem] font-semibold leading-none ${
          isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
        }`}
      >
        {item.id}
      </span>

      {/* Visual half — labels + cars + center line */}
      <div className="relative px-3 pb-0.5 pt-7 md:px-3.5 md:pt-8">
        <div
          className={`pointer-events-none absolute bottom-0.5 left-1/2 top-7 w-px -translate-x-1/2 md:top-8 ${
            isDark ? "bg-white/20" : "bg-[#d8d8d6]"
          }`}
          aria-hidden="true"
        />

        {/* Labels row with vs on the line */}
        <div className="relative grid grid-cols-2">
          <p
            className={`pr-5 text-center font-serif text-[0.95rem] font-bold leading-none md:pr-6 md:text-[1.05rem] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {left.label}
          </p>
          <p
            className={`pl-5 text-center font-serif text-[0.95rem] font-bold leading-none md:pl-6 md:text-[1.05rem] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {right.label}
          </p>
          <span
            className={`absolute left-1/2 top-1/2 z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[0.72rem] font-bold lowercase leading-none md:h-8 md:w-8 md:text-[0.8rem] ${
              isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
            }`}
          >
            vs
          </span>
        </div>

        <div className="relative mt-2 grid grid-cols-2 md:mt-2.5">
          <div className="relative h-[80px] pr-2.5 md:h-[96px] md:pr-3">
            <Image
              src={LEFT_IMAGE}
              alt={left.image?.alt || left.label || ""}
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 42vw, 180px"
            />
          </div>
          <div className="relative h-[80px] pl-2.5 md:h-[96px] md:pl-3">
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
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2 md:px-3.5 md:pb-3.5 md:pt-2.5">
        <div className="flex items-start gap-2.5">
          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:h-10 md:w-10 ${
              isDark ? "bg-white/10" : "bg-[#ececeb]"
            }`}
          >
            <HomeIcon name={item.icon} isDark={isDark} className="h-6 w-6 md:h-7 md:w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <h3
              className={`text-[0.92rem] font-bold leading-tight md:text-[1rem] ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {item.title}
            </h3>
            <p
              className={`mt-1 text-[0.74rem] leading-[1.35] md:text-[0.8rem] ${
                isDark ? "text-white/72" : "text-[#5c5c5a]"
              }`}
              dangerouslySetInnerHTML={{ __html: item.preview }}
            />
          </div>
        </div>

        <div className="mt-auto flex justify-end pt-2">
          <Link
            href={item.link?.href || "#"}
            className={`inline-flex items-center gap-1.5 text-[0.78rem] font-semibold md:text-[0.84rem] ${
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
      className={`mt-3 flex items-center gap-2.5 rounded-xl border px-3 py-2.5 md:mt-3.5 md:px-3.5 md:py-2.5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center md:h-10 md:w-10">
        <HomeIcon name="info" isDark={isDark} className="h-8 w-8 md:h-9 md:w-9" />
      </span>
      <p className={`min-w-0 flex-1 text-[0.72rem] leading-[1.35] md:text-[0.78rem] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>
        <strong className={isDark ? "text-white" : "text-[var(--color-text)]"}>{note.label}</strong>{" "}
        <span dangerouslySetInnerHTML={{ __html: note.text }} />
      </p>
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
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[#ececea]";

  return (
    <section className={`relative overflow-hidden ${sectionBg}`}>
      {/* Header — same as Sec2/Sec3 */}
      <div className={`relative overflow-hidden ${sectionBg}`}>
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
                : "absolute inset-0 bg-[linear-gradient(90deg,#ececea_0%,rgba(236,236,234,0.88)_34%,rgba(236,236,234,0.18)_100%)]"
            }
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-3 pt-5 pb-4 md:px-6 md:pt-8 md:pb-5 lg:px-8">
          <div className="max-w-[720px]">
            <p
              className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
              }`}
            >
              Comparison Hub
            </p>
            <h2
              className={`mt-1.5 text-[2.1rem] font-bold leading-[0.98] md:text-[3.2rem] md:leading-[0.96] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Comparison Hub
              <br />
              <span className="text-[var(--color-chrome-bright)]">Head-to-Head Verdicts</span>
            </h2>
            <div className="mt-2.5">
              <MStripe />
            </div>
            <p
              className={`mt-1.5 max-w-[640px] text-[0.88rem] leading-[1.4] md:text-[1.02rem] md:leading-[1.45] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-8xl px-3 pt-1 pb-5 md:px-6 md:pt-1.5 md:pb-6 lg:px-8">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-3 lg:gap-3">
          {comparisons.map((item) => (
            <ComparisonCard key={item.id} item={item} isDark={isDark} />
          ))}
        </div>

        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
