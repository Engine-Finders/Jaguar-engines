"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionBody, sectionDescription, sectionH2, sectionTableText } from "@/components/models/sectionTypography";

const iconPaths = {
  Generations: <path d="m12 4 8 4-8 4-8-4 8-4Zm-6 7 6 3 6-3M6 15l6 3 6-3" />,
  "Years Produced": <path d="M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm3 8h2m4 0h2m-8 4h2m4 0h2" />,
  "Engine Codes Tracked": <path d="M3 12h3m12 0h3M7 9h10v6H7V9Zm2-3h6m-3 0V3M5 15v3m14-3v3M9 18h6" />,
  "Fuel Types": <path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M4 21h13M16 8h2l2 2v8a2 2 0 0 1-4 0v-5h4M8 7h5" />,
  "Most Enquired Engine (2025)": <path d="M5 19V5m0 14h14M8 15l3-3 3 2 4-6" />,
  "Most Reliable": <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />,
  "Highest-Risk": <path d="M12 9v4m0 4h.01M10 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L14 4.9a2 2 0 0 0-3.48 0Z" />,
  "Typical Replacement Cost": <path d="M17 6.5A5 5 0 0 0 8 9v8m-3 0h10M6 13h7" />,
  "Typical Host Value": <path d="m20 12-8 8-8-8V4h8l8 8Zm-12-4h.01" />,
  "Overall Rating": <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
};

function cleanText(text = "") {
  return text
    .replaceAll("Â£", "\u00a3")
    .replaceAll("â€“", "\u2013")
    .replaceAll("â€”", "\u2014")
    .replaceAll("â€¢", "\u2022")
    .replaceAll("â˜…", "\u2605")
    .replaceAll("â˜†", "\u2606")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const marker = "at a Glance";
  const index = clean.indexOf(marker);

  if (index === -1) {
    return { before: clean, accent: "" };
  }

  return {
    before: clean.slice(0, index).trim(),
    accent: clean.slice(index).trim(),
  };
}

function badgeParts(value = "") {
  const parts = [];
  let text = cleanText(value);

  for (const token of ["[BMW-VERIFIED]", "[BMW-QUOTE]"]) {
    if (text.includes(token)) {
      text = text.replace(token, "").trim();
      parts.push(token.replace("[", "").replace("]", ""));
    }
  }

  return { text, parts };
}

function IconBox({ metric }) {
  const isRisk = metric === "Highest-Risk";

  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border shadow-sm md:h-10 md:w-10 ${
        isRisk
          ? "border-red-200 bg-red-50 text-red-500"
          : "border-[rgba(11,103,220,0.18)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 md:h-7 md:w-7" fill="none" stroke="currentColor" strokeWidth="2">
        {iconPaths[metric] || iconPaths.Generations}
      </svg>
    </span>
  );
}

function ValueWithBadges({ value }) {
  const { text, parts } = badgeParts(value);
  const isRating = text.includes("\u2605") || text.includes("★");

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className={isRating ? "text-[1.7rem] leading-none text-[var(--color-primary)]" : ""} dangerouslySetInnerHTML={{ __html: text }} />
      {parts.map((part) => (
        <span
          key={part}
          className="inline-flex items-center gap-1 rounded-md border border-[rgba(11,103,220,0.2)] bg-[var(--color-primary-soft)] px-2 py-1 text-[15px] font-medium text-[var(--color-primary)]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />
          </svg>
          <span dangerouslySetInnerHTML={{ __html: part }} />
        </span>
      ))}
    </span>
  );
}

function DesktopTable({ rows, isDark }) {
  return (
    <div
      className={`hidden overflow-hidden rounded-md border shadow-[0_14px_36px_var(--color-shadow)] backdrop-blur md:block ${
        isDark ? "border-white/16 bg-[rgba(2,13,25,0.72)]" : "border-[var(--color-border)] bg-[rgba(255,255,255,0.84)]"
      }`}
    >
      <div className={`grid grid-cols-[68px_0.95fr_1.7fr] border-b border-[var(--color-border)] px-5 py-3 font-semibold text-[var(--color-text)] md:grid-cols-[72px_0.95fr_1.7fr] md:px-5 md:py-3 ${sectionTableText}`}>
        <span />
        <span>Metric</span>
        <span>Value</span>
      </div>
      {rows.map((row) => (
        <div key={row.metric} className="grid grid-cols-[68px_0.95fr_1.7fr] items-center border-b border-[var(--color-border)] px-5 py-2.5 last:border-b-0 md:grid-cols-[72px_0.95fr_1.7fr] md:px-5 md:py-2.5">
          <IconBox metric={row.metric} />
          <span className={`border-r border-[var(--color-border)] pr-5 font-semibold text-[var(--color-text)] md:pr-5 ${sectionTableText}`} dangerouslySetInnerHTML={{ __html: row.metric }} />
          <span className={`pl-5 text-[var(--color-text-muted)] md:pl-6 ${sectionTableText}`}>
            <ValueWithBadges value={row.value} />
          </span>
        </div>
      ))}
    </div>
  );
}

function MobileCard({ row, wide = false }) {
  return (
      <li className={`${wide ? "col-span-2" : ""} border-b border-[var(--color-border)] p-3.5 last:border-b-0 md:p-5`}>
      <div className="flex items-center gap-2.5 md:gap-3">
        <IconBox metric={row.metric} />
        <p className={`min-w-0 font-semibold leading-tight text-[var(--color-text)] ${sectionTableText}`} dangerouslySetInnerHTML={{ __html: row.metric }} />
      </div>
      <p className={`mt-2.5 font-medium leading-[1.35] text-[var(--color-text)] md:mt-3 ${sectionBody}`}>
        <ValueWithBadges value={row.value} />
      </p>
    </li>
  );
}

function MobileCards({ rows, isDark }) {
  const withoutRating = rows.filter((row) => row.metric !== "Overall Rating");

  return (
    <ul
      className={`grid grid-cols-2 overflow-hidden rounded-md border shadow-[0_14px_36px_var(--color-shadow)] backdrop-blur md:hidden ${
        isDark ? "border-white/16 bg-[rgba(2,13,25,0.76)]" : "border-[var(--color-border)] bg-[rgba(255,255,255,0.88)]"
      }`}
    >
      {withoutRating.map((row) => (
        <MobileCard
          key={row.metric}
          row={row}
          wide={row.metric === "Most Enquired Engine (2025)"}
        />
      ))}
    </ul>
  );
}

function RatingCard({ row }) {
  if (!row) return null;

  return (
    <div className="mt-5 flex items-center gap-5 rounded-md bg-[#020d25] p-5 text-white md:hidden">
      <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-[rgba(29,111,255,0.4)] bg-[rgba(29,111,255,0.12)] text-[var(--color-primary)]">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="2">
          {iconPaths["Overall Rating"]}
        </svg>
      </span>
      <div>
        <p className="text-[18px] font-bold">Overall Rating</p>
        <p className="mt-2 text-[40px] leading-none text-[var(--color-primary)] md:text-[50px]" dangerouslySetInnerHTML={{ __html: cleanText(row.value).replace(" 3.9/5", "") }} />
        <p className="mt-2 text-[18px] font-bold text-[var(--color-primary)]">3.9/5</p>
        <p className="mt-2 text-[15px] leading-[1.35] text-white/82">
          A perfect blend of performance, engineering excellence, and drivability.
        </p>
      </div>
    </div>
  );
}

export default function AtAGlance({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const rows = data.rows || [];
  const ratingRow = rows.find((row) => row.metric === "Overall Rating");

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="absolute inset-0">
        <Image
          src="/model/Section 3-bg.webp"
          alt=""
          fill
          className="object-cover object-[64%_top] md:object-center"
          sizes="100vw"
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(90deg,rgba(2,7,11,0.97)_0%,rgba(2,7,11,0.82)_46%,rgba(2,7,11,0.5)_100%)]"
              : "bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.78)_44%,rgba(255,255,255,0.38)_100%)]"
          }`}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="max-w-[510px]">
          <h2 className={`font-bold tracking-normal text-[var(--color-text)] ${sectionH2}`}>
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
          <p className={`mt-5 max-w-[430px] text-[var(--color-text-muted)] ${sectionDescription}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
        </div>

        <div className="mt-6 md:mt-6">
          <DesktopTable rows={rows} isDark={isDark} />
          <MobileCards rows={rows} isDark={isDark} />
          <RatingCard row={ratingRow} />
        </div>
      </div>
    </section>
  );
}
