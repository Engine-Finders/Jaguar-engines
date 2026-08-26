"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { sectionBody, sectionDescription, sectionH2, sectionTableText } from "@/components/models/sectionTypography";

const metricIconKeys = {
  "Overall Ownership Rating": "star",
  "Replacement Economics": "scale",
  Reliability: "shield",
  "Most Reliable Engine": "trophy",
  "Highest-Risk Engine": "alert",
  "Best Used Buy": "cart",
  "Best Petrol Buy": "fuel",
  "Average Engine Replacement": "pound",
  "Most Common Failure Enquiry": "chart",
  "BMW Ranking": "crown",
  "Jaguar Ranking": "ranking",
};

const summaryStatIconKeys = {
  chart: "chart",
  shield: "shield",
  gear: "engine",
  book: "book",
  trophy: "trophy",
};

function cleanText(text = "") {
  return String(text ?? "")
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

function MetricIcon({ metric, isDark }) {
  const iconKey = metricIconKeys[metric] || "shield";

  return (
    <span
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full md:h-16 md:w-16 ${
        isDark ? "bg-white/10" : "bg-white shadow-sm ring-1 ring-black/5"
      }`}
    >
      <HomeIcon name={iconKey} isDark={isDark} className="h-12 w-12 object-contain md:h-[3.35rem] md:w-[3.35rem]" />
    </span>
  );
}

function StatIcon({ iconKey, isDark }) {
  const name = summaryStatIconKeys[iconKey] || iconKey || "chart";

  return (
    <span
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full md:h-16 md:w-16 ${
        isDark ? "bg-white/10" : "bg-[#ececeb]"
      }`}
    >
      <HomeIcon name={name} isDark={isDark} className="h-12 w-12 object-contain md:h-[3.35rem] md:w-[3.35rem]" />
    </span>
  );
}

function VerdictTable({ metrics, isDark }) {
  return (
    <div
      className={`overflow-hidden rounded-md border shadow-[0_14px_36px_var(--color-shadow)] backdrop-blur ${
        isDark ? "border-white/20 bg-[rgba(12,12,12,0.55)]" : "border-[var(--color-border)] bg-[rgba(255,255,255,0.92)]"
      }`}
    >
      <div
        className={`grid grid-cols-[40%_60%] border-b border-[var(--color-border)] px-3 py-2.5 font-semibold md:grid-cols-[42%_58%] md:px-4 md:py-3 ${sectionTableText} text-[13px]`}
      >
        <span>Verdict Metric</span>
        <span>Our Call</span>
      </div>
      {metrics.map((row) => (
        <div
          key={row.metric}
          className="grid grid-cols-[40%_60%] border-b border-[var(--color-border)] last:border-b-0 md:grid-cols-[42%_58%]"
        >
          <div className="flex items-center gap-2.5 border-r border-[var(--color-border)] px-3 py-2.5 md:gap-3 md:px-4 md:py-3.5">
            <MetricIcon metric={row.metric} isDark={isDark} />
            <span
              className={`font-medium leading-[1.25] ${sectionTableText} text-[13px]`}
              dangerouslySetInnerHTML={{ __html: cleanText(row.metric) }}
            />
          </div>
          <p
            className={`px-3 py-2.5 text-[var(--color-text-muted)] md:px-4 md:py-3.5 ${sectionTableText} text-[13px]`}
            dangerouslySetInnerHTML={{ __html: cleanText(row.ourCall) }}
          />
        </div>
      ))}
    </div>
  );
}

function OneLineVerdict({ text, isDark }) {
  return (
    <div
      className={`flex gap-4 rounded-md border p-4 shadow-[0_14px_36px_var(--color-shadow)] backdrop-blur md:items-center md:p-5 ${
        isDark ? "border-white/20 bg-[rgba(12,12,12,0.55)]" : "border-[var(--color-border)] bg-[rgba(255,255,255,0.92)]"
      }`}
    >
      <span
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full md:h-20 md:w-20 ${
          isDark ? "bg-white/10" : "bg-white shadow-sm ring-1 ring-black/5"
        }`}
      >
        <HomeIcon name="shield" isDark={isDark} className="h-14 w-14 object-contain md:h-16 md:w-16" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-[var(--color-chrome-bright)]">One-line verdict:</p>
        <p
          className={`mt-1 text-[var(--color-text-muted)] ${sectionBody}`}
          dangerouslySetInnerHTML={{ __html: cleanText(text) }}
        />
      </div>
      <HomeIcon
        name="quote"
        isDark={isDark}
        className="ml-auto hidden h-8 w-8 shrink-0 object-contain opacity-55 md:block"
      />
    </div>
  );
}

export default function OwnershipVerdict({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const stats = data.summaryStats || [];
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[#ececea]";

  return (
    <section className={`relative overflow-hidden ${sectionBg} py-7 text-[var(--color-text)] md:py-9`}>
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1fr] lg:items-start">
          <div>
            <h2 className={`max-w-[640px] font-bold tracking-normal text-[var(--color-text)] ${sectionH2}`}>
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
            <div className="relative mt-4 overflow-hidden rounded-md border border-[var(--color-border)] bg-[rgba(255,255,255,0.18)] shadow-[0_10px_24px_var(--color-shadow)] md:mt-5 md:h-[360px]">
              <Image
                src="/home-image/right.webp"
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
            {data.subHeadline ? (
              <p
                className={`mt-5 max-w-[470px] text-[var(--color-text-muted)] ${sectionDescription}`}
                dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }}
              />
            ) : null}

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
              isDark ? "border-white/14 bg-[rgba(12,12,12,0.55)]" : "border-[var(--color-border)] bg-[rgba(255,255,255,0.92)]"
            }`}
          >
            {stats.map((stat) => (
              <li
                key={`${stat.value}-${stat.label}`}
                className="flex items-center gap-4 border-r border-[var(--color-border)] px-7 py-5 last:border-r-0"
              >
                <StatIcon iconKey={stat.iconKey} isDark={isDark} />
                <p className={`text-[var(--color-text)] ${sectionTableText}`}>
                  {stat.value ? (
                    <strong
                      className="mr-1 font-heading text-[1.45rem] font-semibold leading-none text-[var(--color-text)]"
                      dangerouslySetInnerHTML={{ __html: stat.value }}
                    />
                  ) : null}
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
