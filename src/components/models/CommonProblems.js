"use client";

import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionDescription, sectionH2, sectionTableText } from "@/components/models/sectionTypography";

const defaultProblemImage = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=700&q=80";

const problemImages = [
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1632823469850-1b7b1e8b7e1e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=700&q=80",
];

const severityStyles = {
  catastrophic: { dot: "bg-red-500", text: "text-red-600" },
  immediate: { dot: "bg-orange-500", text: "text-orange-600" },
  monitor: { dot: "bg-yellow-400", text: "text-yellow-600" },
  low: { dot: "bg-green-600", text: "text-green-600" },
};

function cleanText(text = "") {
  return String(text)
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

  if (index === -1) return { main: clean, accent: "" };

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

function ProblemImage({ index }) {
  return (
    <div className="relative h-full min-h-[150px] overflow-hidden bg-[var(--color-page-soft)] md:min-h-[210px]">
      <img
        src={problemImages[index] || defaultProblemImage}
        alt=""
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src = defaultProblemImage;
        }}
        className="h-full w-full object-cover"
      />
      <span className="absolute left-3 top-3 rounded-md bg-[var(--color-surface-raised)] px-2 py-1 text-[18px] font-bold text-[var(--color-primary)] shadow-sm">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

function ProblemCard({ problem, index }) {
  const href = problem.link?.href || "#";
  const label = cleanText(problem.link?.label || "Learn more");

  return (
    <article className="grid grid-cols-[0.85fr_1.55fr] overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_8px_22px_var(--color-shadow)] md:grid-cols-[0.9fr_1.3fr]">
      <ProblemImage index={index} />
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
<p className={`mt-2 ${sectionTableText} text-[var(--color-text-muted)] md:mt-3`} dangerouslySetInnerHTML={{ __html: cleanText(problem.description) }} />
        <Link href={href} className="mt-auto flex items-center justify-end gap-2 pt-4 text-[18px] font-bold text-[var(--color-primary)]">
          <span dangerouslySetInnerHTML={{ __html: label.replace(/\s*\u2192\s*$/, "") }} />
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

function UrgencyKey({ items }) {
  if (!items?.length) return null;

  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_8px_22px_var(--color-shadow)]">
      <div className="grid gap-4 md:grid-cols-[1fr_repeat(4,1.2fr)] md:items-start">
        <h3 className="text-[15px] font-bold uppercase text-[var(--color-text)]">Urgency Key</h3>
        {items.map((item) => {
          const label = cleanText(item.label);
          const type = label.toLowerCase();
          const dot = severityStyles[type]?.dot || "bg-yellow-400";

          return (
            <div key={label} className="flex gap-3 border-[var(--color-border)] md:border-l md:pl-6">
              <span className={`mt-1 h-4 w-4 shrink-0 rounded-full ${dot}`} />
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

  const title = splitTitle(data.h2);

  return (
    <section data-theme-mode={theme} className="bg-[var(--color-page)] py-6 text-[var(--color-text)]">
      <div>
        <h2 className={`max-w-[860px] ${sectionH2} tracking-normal`}>
          <span dangerouslySetInnerHTML={{ __html: title.main }} />
          {title.accent ? <span className="text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: title.accent }} /> : null}
        </h2>
        <div className="mt-2">
          <MStripe />
        </div>
        {data.subHeadline ? (
          <p className="mt-3 max-w-[620px] text-[14px] leading-[1.45] text-[var(--color-text-muted)] md:text-[16px]">
            {cleanText(data.subHeadline)}
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-3">
        {(data.problems || []).map((problem, index) => (
          <ProblemCard key={problem.id || problem.issue} problem={problem} index={index} />
        ))}
      </div>

      <div className="mt-4">
        <UrgencyKey items={data.urgencyKey} />
      </div>
    </section>
  );
}
