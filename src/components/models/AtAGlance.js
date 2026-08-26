"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { sectionBody, sectionDescription, sectionH2, sectionTableText } from "@/components/models/sectionTypography";

const metricIconKeys = {
  Generations: "generations",
  "Years Produced": "timeline",
  "Engine Codes Tracked": "engine-codes",
  "Fuel Types": "fuel",
  "Most Enquired Engine (2025)": "most-enquired",
  "Most Reliable": "shield",
  "Highest-Risk": "alert",
  "Typical Replacement Cost": "pound",
  "Typical Host Value": "value",
  "Overall Rating": "star",
};

function cleanText(text = "") {
  return String(text ?? "")
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

  for (const token of ["[JAG-VERIFIED]", "[JAG-QUOTE]", "[BMW-VERIFIED]", "[BMW-QUOTE]", "[THIRD-PARTY]"]) {
    if (text.includes(token)) {
      text = text.replace(token, "").trim();
      parts.push(token.replace("[", "").replace("]", ""));
    }
  }

  return { text, parts };
}

function IconBox({ metric, isDark }) {
  const iconKey = metricIconKeys[metric] || "generations";

  return (
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full md:h-14 md:w-14 ${
        isDark ? "bg-white/10" : "bg-white shadow-sm ring-1 ring-black/5"
      }`}
    >
      <HomeIcon name={iconKey} isDark={isDark} className="h-10 w-10 object-contain md:h-12 md:w-12" />
    </span>
  );
}

function ValueWithBadges({ value, isDark }) {
  const { text, parts } = badgeParts(value);
  const isRating = text.includes("\u2605") || text.includes("★");

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span
        className={
          isRating
            ? "font-heading text-[1.55rem] leading-none text-[var(--color-text)] md:text-[1.7rem]"
            : ""
        }
        dangerouslySetInnerHTML={{ __html: text }}
      />
      {parts.map((part) => (
        <span
          key={part}
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[13px] font-medium md:text-[14px] ${
            isDark
              ? "border-white/16 bg-white/8 text-white/85"
              : "border-[var(--color-chrome)]/40 bg-[#f3f3f1] text-[var(--color-text)]"
          }`}
        >
          <HomeIcon name="shield" isDark={isDark} className="h-4 w-4 object-contain" />
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
        isDark ? "border-white/16 bg-[rgba(12,12,12,0.55)]" : "border-[var(--color-border)] bg-[rgba(255,255,255,0.92)]"
      }`}
    >
      <div
        className={`grid grid-cols-[72px_0.95fr_1.7fr] border-b border-[var(--color-border)] px-5 py-3 font-semibold text-[var(--color-text)] ${sectionTableText}`}
      >
        <span />
        <span>Metric</span>
        <span>Value</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.metric}
          className="grid grid-cols-[72px_0.95fr_1.7fr] items-center border-b border-[var(--color-border)] px-5 py-3 last:border-b-0"
        >
          <IconBox metric={row.metric} isDark={isDark} />
          <span
            className={`border-r border-[var(--color-border)] pr-5 font-semibold text-[var(--color-text)] ${sectionTableText}`}
            dangerouslySetInnerHTML={{ __html: row.metric }}
          />
          <span className={`pl-5 text-[var(--color-text-muted)] md:pl-6 ${sectionTableText}`}>
            <ValueWithBadges value={row.value} isDark={isDark} />
          </span>
        </div>
      ))}
    </div>
  );
}

function MobileCard({ row, wide = false, isDark }) {
  return (
    <li className={`${wide ? "col-span-2" : ""} border-b border-[var(--color-border)] p-3.5 last:border-b-0`}>
      <div className="flex items-center gap-2.5">
        <IconBox metric={row.metric} isDark={isDark} />
        <p
          className={`min-w-0 font-semibold leading-tight text-[var(--color-text)] ${sectionTableText}`}
          dangerouslySetInnerHTML={{ __html: row.metric }}
        />
      </div>
      <p className={`mt-2.5 font-medium leading-[1.35] text-[var(--color-text)] ${sectionBody}`}>
        <ValueWithBadges value={row.value} isDark={isDark} />
      </p>
    </li>
  );
}

function MobileCards({ rows, isDark }) {
  const withoutRating = rows.filter((row) => row.metric !== "Overall Rating");

  return (
    <ul
      className={`grid grid-cols-2 overflow-hidden rounded-md border shadow-[0_14px_36px_var(--color-shadow)] backdrop-blur md:hidden ${
        isDark ? "border-white/16 bg-[rgba(12,12,12,0.55)]" : "border-[var(--color-border)] bg-[rgba(255,255,255,0.92)]"
      }`}
    >
      {withoutRating.map((row) => (
        <MobileCard
          key={row.metric}
          row={row}
          isDark={isDark}
          wide={row.metric === "Most Enquired Engine (2025)"}
        />
      ))}
    </ul>
  );
}

function RatingCard({ row, isDark }) {
  if (!row) return null;

  return (
    <div
      className={`mt-5 flex items-center gap-5 rounded-md p-5 md:hidden ${
        isDark ? "bg-[#141414] text-white" : "bg-[#1a1a1a] text-white"
      }`}
    >
      <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/10">
        <HomeIcon name="star" isDark className="h-14 w-14 object-contain" />
      </span>
      <div>
        <p className="text-[18px] font-bold">Overall Rating</p>
        <p
          className="mt-2 font-heading text-[40px] font-semibold leading-none text-[var(--color-chrome)] md:text-[50px]"
          dangerouslySetInnerHTML={{ __html: cleanText(row.value).replace(" 3.9/5", "") }}
        />
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
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[var(--color-page)]";

  return (
    <section className={`relative overflow-hidden ${sectionBg} text-[var(--color-text)]`}>
      <div className={`relative overflow-hidden ${sectionBg}`}>
        <div className="absolute inset-y-0 right-0 w-[62%] md:w-[48%]">
          <Image
            src="/home-image/sec2-bg.webp"
            alt=""
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

        <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-7 md:px-8 md:pb-4 md:pt-10">
          <div className="max-w-[560px]">
            <h2 className={`font-bold tracking-normal text-[var(--color-text)] ${sectionH2}`}>
              <span dangerouslySetInnerHTML={{ __html: title.before }} />
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
              <p
                className={`mt-3 max-w-[480px] text-[var(--color-text-muted)] ${sectionDescription}`}
                dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-8 pt-4 md:px-8 md:pb-10 md:pt-5">
        <DesktopTable rows={rows} isDark={isDark} />
        <MobileCards rows={rows} isDark={isDark} />
        <RatingCard row={ratingRow} isDark={isDark} />
      </div>
    </section>
  );
}
