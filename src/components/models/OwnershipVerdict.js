"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionBody, sectionDescription, sectionH2, sectionTableText } from "@/components/models/sectionTypography";

const metricStyles = {
  "Overall Ownership Rating": { color: "#1d6fff", icon: "star" },
  "Replacement Economics": { color: "#f59e0b", icon: "scale" },
  Reliability: { color: "#4caf50", icon: "shield" },
  "Most Reliable Engine": { color: "#d99013", icon: "trophy" },
  "Highest-Risk Engine": { color: "#e34b4b", icon: "alert" },
  "Best Used Buy": { color: "#1d6fff", icon: "cart" },
  "Best Petrol Buy": { color: "#69b548", icon: "fuel" },
  "Average Engine Replacement": { color: "#2b85ff", icon: "pound" },
  "Most Common Failure Enquiry": { color: "#8b5cf6", icon: "chart" },
  "BMW Ranking": { color: "#d99013", icon: "crown" },
};

const statIcons = {
  chart: <path d="M5 19V9m5 10V5m5 14v-7m5 7H3" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />,
  gear: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v3m0 12v3M4.6 4.6l2.1 2.1m10.6 10.6 2.1 2.1M3 12h3m12 0h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" />,
  book: <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22V6.5Zm16 0A2.5 2.5 0 0 0 17.5 4H13v16h4.5A2.5 2.5 0 0 1 20 22V6.5Z" />,
  trophy: <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
};

function cleanText(text = "") {
  return text
    .replaceAll("Â£", "\u00a3")
    .replaceAll("â€“", "\u2013")
    .replaceAll("â€”", "\u2014")
    .replaceAll("â€¢", "\u2022")
    .replaceAll("â˜…", "\u2605")
    .replaceAll("â˜†", "\u2606")
    .replaceAll("âšï¸", "")
    .replaceAll("ðŸ¥‡", "")
    .replaceAll(" -", " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const marker = "The Ownership Verdict";
  const index = clean.indexOf(marker);

  if (index === -1) {
    return { before: clean, accent: "" };
  }

  return {
    before: clean.slice(0, index).trim(),
    accent: clean.slice(index).trim(),
  };
}

function MetricIcon({ metric }) {
  const style = metricStyles[metric] || metricStyles.Reliability;
  const common = "h-6 w-6";
  let path;

  switch (style.icon) {
    case "star":
      path = <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />;
      break;
    case "scale":
      path = <path d="M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7ZM8 21h8" />;
      break;
    case "shield":
      path = <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />;
      break;
    case "trophy":
      path = statIcons.trophy;
      break;
    case "alert":
      path = <path d="M12 9v4m0 4h.01M10 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L14 4.9a2 2 0 0 0-3.48 0Z" />;
      break;
    case "cart":
      path = <path d="M4 5h2l2 11h9l2-8H7m3 12h.01M17 20h.01" />;
      break;
    case "fuel":
      path = <path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M4 21h13M16 8h2l2 2v8a2 2 0 0 1-4 0v-5h4M8 7h5" />;
      break;
    case "pound":
      path = <path d="M17 6.5A5 5 0 0 0 8 9v8m-3 0h10M6 13h7" />;
      break;
    case "chart":
      path = statIcons.chart;
      break;
    case "crown":
      path = <path d="m3 8 4 3 5-6 5 6 4-3-2 10H5L3 8Zm4 11h10" />;
      break;
    default:
      path = statIcons.shield;
  }

  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-[var(--color-primary-soft)]"
      style={{ color: style.color, borderColor: `${style.color}55` }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2">
        {path}
      </svg>
    </span>
  );
}

function StatIcon({ iconKey }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
        {statIcons[iconKey] || statIcons.chart}
      </svg>
    </span>
  );
}

function VerdictTable({ metrics, isDark }) {
  return (
    <div
      className={`overflow-hidden rounded-md border shadow-[0_14px_36px_var(--color-shadow)] backdrop-blur ${
        isDark ? "border-white/20 bg-[rgba(2,13,25,0.74)]" : "border-[var(--color-border)] bg-[rgba(255,255,255,0.84)]"
      }`}
    >
      <div className={`grid grid-cols-[40%_60%] border-b border-[var(--color-border)] px-3 py-2 font-semibold md:grid-cols-[42%_58%] md:px-3 md:py-2.5 ${sectionTableText} text-[13px]`}>
        <span>Verdict Metric</span>
        <span>Our Call</span>
      </div>
      {metrics.map((row) => (
        <div key={row.metric} className="grid grid-cols-[40%_60%] border-b border-[var(--color-border)] last:border-b-0 md:grid-cols-[42%_58%]">
          <div className="flex items-center gap-2 border-r border-[var(--color-border)] px-3 py-2 md:px-3 md:py-2.5">
            <MetricIcon metric={row.metric} />
            <span className={`font-medium leading-[1.25] ${sectionTableText} text-[13px]`} dangerouslySetInnerHTML={{ __html: cleanText(row.metric) }} />
          </div>
          <p className={`px-3 py-2 text-[var(--color-text-muted)] md:px-3 md:py-2.5 ${sectionTableText} text-[13px]`} dangerouslySetInnerHTML={{ __html: cleanText(row.ourCall) }} />
        </div>
      ))}
    </div>
  );
}

function OneLineVerdict({ text, isDark }) {
  return (
    <div
      className={`flex gap-4 rounded-md border p-4 shadow-[0_14px_36px_var(--color-shadow)] backdrop-blur md:items-center md:p-5 ${
        isDark ? "border-white/20 bg-[rgba(2,13,25,0.72)]" : "border-[var(--color-border)] bg-[rgba(255,255,255,0.86)]"
      }`}
    >
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] md:h-20 md:w-20">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-10 w-10 md:h-12 md:w-12" fill="none" stroke="currentColor" strokeWidth="2">
          {statIcons.shield}
        </svg>
      </span>
      <div className="min-w-0">
        <p className="font-bold text-[var(--color-primary)]">One-line verdict:</p>
        <p className={`mt-1 text-[var(--color-text-muted)] ${sectionBody}`} dangerouslySetInnerHTML={{ __html: cleanText(text) }} />
      </div>
      <span className="ml-auto hidden text-4xl font-bold text-[var(--color-primary)] md:block">&quot;</span>
    </div>
  );
}

export default function OwnershipVerdict({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const stats = data.summaryStats || [];

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)] py-7 text-[var(--color-text)] md:py-9">
      <div className="relative mx-auto w-full max-w-8xl">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1fr] lg:items-start">
          <div>
            <h2 className={`max-w-[640px] font-bold tracking-normal text-[var(--color-text)] ${sectionH2}`}>
              <span dangerouslySetInnerHTML={{ __html: title.before }} />
              {title.accent ? (
                <>
                  <br />
                  <span className="text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: title.accent }} />
                </>
              ) : null}
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>
            <div className="relative mt-4 overflow-hidden rounded-md border border-[var(--color-border)] bg-[rgba(255,255,255,0.18)] shadow-[0_10px_24px_var(--color-shadow)] md:mt-5 md:h-[260px]">
              <Image
                src="/model/Section 2-bg.webp"
                alt=""
                fill
                className="object-cover object-[35%_center] md:object-center"
                sizes="(min-width: 768px) 640px, 100vw"
              />
              <div
                className={`absolute inset-0 ${
                  isDark
                    ? "bg-[linear-gradient(180deg,rgba(2,13,25,0.05)_0%,rgba(2,13,25,0.35)_100%)]"
                    : "bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.18)_100%)]"
                }`}
              />
            </div>
            <p className={`mt-5 max-w-[470px] text-[var(--color-text-muted)] ${sectionDescription}`} dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }} />

            {data.oneLineVerdict ? (
              <div className="mt-5 hidden md:block">
                <OneLineVerdict text={data.oneLineVerdict} isDark={isDark} />
              </div>
            ) : null}
          </div>

          <VerdictTable metrics={data.metrics || []} isDark={isDark} />
        </div>

        {data.oneLineVerdict ? (
          <div className="mt-5 md:hidden">
            <OneLineVerdict text={data.oneLineVerdict} isDark={isDark} />
          </div>
        ) : null}

        {stats.length > 0 ? (
          <ul
            className={`mt-5 hidden grid-cols-5 overflow-hidden rounded-md border shadow-[0_14px_36px_var(--color-shadow)] backdrop-blur md:grid ${
              isDark ? "border-white/14 bg-[rgba(2,13,25,0.74)]" : "border-[var(--color-border)] bg-[rgba(255,255,255,0.86)]"
            }`}
          >
            {stats.map((stat) => (
              <li key={`${stat.value}-${stat.label}`} className="flex items-center gap-4 border-r border-[var(--color-border)] px-7 py-5 last:border-r-0">
                <StatIcon iconKey={stat.iconKey} />
                <p className={`text-[var(--color-text)] ${sectionTableText}`}>
                  {stat.value ? <strong className="mr-1 text-[1.45rem] leading-none text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: stat.value }} /> : null}
                  <span dangerouslySetInnerHTML={{ __html: stat.label }} />
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
