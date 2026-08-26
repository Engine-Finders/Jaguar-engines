"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { sectionH2, sectionTableText } from "@/components/models/sectionTypography";

const HEADER_IMAGE = "/home-image/sec2-bg.webp";
const CARD_IMAGE = "/engine.webp";

const severityStyles = {
  catastrophic: { dot: "bg-red-500", text: "text-red-600", icon: "alert" },
  immediate: { dot: "bg-orange-500", text: "text-orange-600", icon: "warning" },
  monitor: { dot: "bg-yellow-400", text: "text-yellow-600", icon: "check-watch" },
  low: { dot: "bg-green-600", text: "text-green-600", icon: "safe-buy" },
};

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Ã‚Â£", "\u00a3")
    .replaceAll("Â£", "\u00a3")
    .replaceAll("Ã¢â‚¬â€œ", "\u2013")
    .replaceAll("â€“", "\u2013")
    .replaceAll("Ã¢â‚¬â€", "\u2014")
    .replaceAll("â€”", "\u2014")
    .replaceAll("Ã¢â‚¬Â¢", "\u2022")
    .replaceAll("â€¢", "\u2022")
    .replaceAll("Ã¢â€ â€™", "\u2192")
    .replaceAll("â†’", "\u2192")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const marker = "Engine Problems";
  const index = clean.indexOf(marker);

  if (index === -1) {
    const dash = clean.indexOf(" - ");
    if (dash !== -1) {
      return { main: clean.slice(0, dash).trim(), accent: clean.slice(dash + 3).trim() };
    }
    // "Common E-Pace Engine Problems" → Common E-Pace / Engine Problems
    const common = clean.match(/^(Common\s+.+?)\s+(Engine Problems)$/i);
    if (common) return { main: common[1], accent: common[2] };
    return { main: clean, accent: "" };
  }

  return {
    main: clean.slice(0, index).trim(),
    accent: clean.slice(index).trim(),
  };
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function SeverityBadge({ severity }) {
  const type = severity?.type || "monitor";
  const classes = severityStyles[type] || severityStyles.monitor;

  return (
    <span className={`inline-flex items-center gap-2 text-[15px] font-bold ${classes.text}`}>
      <span className={`h-3 w-3 rounded-full ${classes.dot}`} />
      <span dangerouslySetInnerHTML={{ __html: cleanText(severity?.label) }} />
    </span>
  );
}

function ProblemImage({ index, isDark }) {
  return (
    <div className="relative h-full min-h-[150px] overflow-hidden bg-[var(--color-page-soft)] md:min-h-[210px]">
      <Image src={CARD_IMAGE} alt="" fill className="object-cover object-center" sizes="280px" />
      <span
        className={`absolute left-3 top-3 flex h-9 min-w-9 items-center justify-center rounded-md px-2 font-heading text-[1.15rem] font-bold leading-none shadow-sm md:h-10 md:text-[1.25rem] ${
          isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

function ProblemCard({ problem, index, isDark }) {
  const href = problem.link?.href || "#";
  const label = cleanText(problem.link?.label || "Learn more");

  return (
    <article className="grid grid-cols-[0.85fr_1.55fr] overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_8px_22px_var(--color-shadow)] md:grid-cols-[0.9fr_1.3fr]">
      <ProblemImage index={index} isDark={isDark} />
      <div className="flex min-w-0 flex-col p-2.5 md:p-4">
        <div className="flex items-start justify-between gap-4">
          <h3
            className="text-[13px] font-bold leading-[1.12] text-[var(--color-text)] md:text-[16px]"
            dangerouslySetInnerHTML={{ __html: cleanText(problem.issue) }}
          />
          <div className="hidden shrink-0 md:block">
            <SeverityBadge severity={problem.severity} />
          </div>
        </div>
        <div className="mt-3 md:hidden">
          <SeverityBadge severity={problem.severity} />
        </div>
        <p
          className={`mt-2 ${sectionTableText} text-[var(--color-text-muted)] md:mt-3`}
          dangerouslySetInnerHTML={{ __html: cleanText(problem.description) }}
        />
        <Link
          href={href}
          className="mt-auto flex items-center justify-end gap-2 pt-4 text-[16px] font-bold text-[var(--color-text)] md:text-[18px]"
        >
          <span dangerouslySetInnerHTML={{ __html: label.replace(/\s*\u2192\s*$/, "") }} />
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

function UrgencyKey({ items, isDark }) {
  if (!items?.length) return null;

  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_8px_22px_var(--color-shadow)]">
      <div className="grid gap-4 md:grid-cols-[1fr_repeat(4,1.2fr)] md:items-start">
        <h3 className="text-[15px] font-bold uppercase text-[var(--color-text)]">Urgency Key</h3>
        {items.map((item) => {
          const label = cleanText(item.label);
          const type = label.toLowerCase();
          const style = severityStyles[type] || severityStyles.monitor;

          return (
            <div key={label} className="flex gap-3 border-[var(--color-border)] md:border-l md:pl-6">
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  isDark ? "bg-white/10" : "bg-[#ececeb]"
                }`}
              >
                <HomeIcon name={style.icon} isDark={isDark} className="h-7 w-7 object-contain" />
              </span>
              <p className="text-[15px] leading-[1.35] text-[var(--color-text-muted)]">
                <strong className="block text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: label }} />
                <span dangerouslySetInnerHTML={{ __html: cleanText(item.text) }} />
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CommonProblems({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[#ececea]";

  return (
    <section data-theme-mode={theme} className={`overflow-hidden ${sectionBg} text-[var(--color-text)]`}>
      <div className={`relative overflow-hidden ${sectionBg}`}>
        <div className="absolute inset-y-0 right-0 w-[62%] md:w-[48%]">
          <Image
            src={HEADER_IMAGE}
            alt=""
            fill
            className="object-cover object-right"
            sizes="(max-width: 768px) 62vw, 48vw"
          />
          <div
            className={
              isDark
                ? "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(11,12,12,0.82)_34%,rgba(11,12,12,0.18)_100%)]"
                : "absolute inset-0 bg-[linear-gradient(90deg,#ececea_0%,rgba(236,236,234,0.88)_34%,rgba(236,236,234,0.18)_100%)]"
            }
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-7 md:px-8 md:pb-4 md:pt-10">
          <div className="max-w-[720px]">
            <h2 className={`font-bold tracking-normal text-[var(--color-text)] ${sectionH2}`}>
              <span dangerouslySetInnerHTML={{ __html: title.main }} />
              {title.accent ? (
                <>
                  <br />
                  <span
                    className="text-[var(--color-chrome-bright)]"
                    dangerouslySetInnerHTML={{ __html: title.accent }}
                  />
                </>
              ) : null}
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>
            {data.subHeadline ? (
              <p className="mt-3 max-w-[620px] text-[14px] leading-[1.45] text-[var(--color-text-muted)] md:text-[16px]">
                {cleanText(data.subHeadline)}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-7 pt-4 md:px-8 md:pb-8 md:pt-5">
        <div className="grid gap-3 md:grid-cols-3">
          {(data.problems || []).map((problem, index) => (
            <ProblemCard key={problem.id || problem.issue} problem={problem} index={index} isDark={isDark} />
          ))}
        </div>

        <div className="mt-4">
          <UrgencyKey items={data.urgencyKey} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
