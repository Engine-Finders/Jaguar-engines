"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import { sectionDescription, sectionH2 } from "@/components/models/sectionTypography";

const iconPaths = {
  "Engine Family": <path d="M3 12h3m12 0h3M7 9h10v6H7V9Zm2-3h6m-3 0V3M5 15v3m14-3v3M9 18h6" />,
  Fuel: <path d="M12 3C9 7 6.5 9.8 6.5 13.1A5.5 5.5 0 0 0 12 18.6a5.5 5.5 0 0 0 5.5-5.5C17.5 9.8 15 7 12 3Z" />,
  "Configuration / Displacement": <path d="m7 18 3-3m7-7 2-2m-9 9 7-7M6 14l-2 2a2 2 0 0 0 0 2.8l1.2 1.2a2 2 0 0 0 2.8 0l2-2m4-12 1.5-1.5a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8L18 10" />,
  "Power Range": <path d="M5 15a7 7 0 1 1 14 0M12 12l4-2M7 15h.01M17 15h.01M12 8h.01" />,
  "Years Produced": <path d="M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Zm3 7h2m4 0h2m-8 4h2m4 0h2" />,
  "Models Fitted (BMW only)": <path d="M5 15l1.5-4.2A2 2 0 0 1 8.4 9.5h7.2a2 2 0 0 1 1.9 1.3L19 15M7 15h10M8 18h.01M16 18h.01M6 15v3h2m8-3v3h2" />,
  "Cross-Brand Fitment": <path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm0 0v18M3 12h18" />,
  "Overall Engine Score": <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />,
};

function cleanText(text = "") {
  return text
    .replace(/\u00c2\u00a3|\u00a3/g, "\u00a3")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u201c|\u00c3\u00a2\u00e2\u20ac\u201d|\u00e2\u20ac\u201c|\u00e2\u20ac\u201d|\u2013|\u2014/g, "\u2013")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u02dc|\u00e2\u20ac\u2018|\u2011/g, "-")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u00a2|\u00e2\u20ac\u00a2|\u2022/g, "\u2022")
    .replace(/\s+/g, " ")
    .trim();
}

function getRowMap(rows = []) {
  return rows.reduce((acc, row) => {
    acc[row.metric] = row.value;
    return acc;
  }, {});
}

function extractEngineName(rows) {
  const family = cleanText(rows["Engine Family"] || "Jaguar Engine");
  return family.startsWith("Jaguar ") ? family : `Jaguar ${family}`;
}

function parseScore(value = "") {
  const clean = cleanText(value);
  const match = clean.match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return { score: clean, total: "" };
  return { score: match[1], total: match[2] };
}

function verifiedParts(value = "") {
  const clean = cleanText(value);
  const badge = clean.includes("[BMW-VERIFIED]");
  return {
    text: clean.replace("[BMW-VERIFIED]", "").trim(),
    badge,
  };
}

function ScoreStars() {
  return (
    <div className="flex items-center gap-1.5 text-[var(--color-primary)]">
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} className="text-[20px] leading-none md:text-[18px]">★</span>
      ))}
      <span className="text-[20px] leading-none text-[var(--color-border-strong)] md:text-[18px]">☆</span>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-[rgba(36,132,255,0.42)] bg-[rgba(7,95,216,0.12)] px-2.5 py-1 text-[12px] font-semibold text-[var(--color-primary)]">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />
      </svg>
      BMW-VERIFIED
    </span>
  );
}

function CircleIcon({ metric, isDark, brand = false, compact = false }) {
  const sizeClass = compact
    ? "h-10 w-10 md:h-[58px] md:w-[58px]"
    : "h-14 w-14 md:h-[58px] md:w-[58px]";
  const brandInnerClass = compact
    ? "h-7 w-7 md:h-11 md:w-11"
    : "h-10 w-10 md:h-11 md:w-11";
  const svgClass = compact
    ? "h-5 w-5 md:h-8 md:w-8"
    : "h-7 w-7 md:h-8 md:w-8";

  if (brand) {
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-full border ${sizeClass} ${
        isDark
          ? "border-[rgba(36,132,255,0.48)] bg-[radial-gradient(circle_at_30%_30%,rgba(26,70,155,0.4),rgba(4,11,22,0.96)_75%)]"
          : "border-[rgba(11,103,220,0.26)] bg-[radial-gradient(circle_at_30%_30%,rgba(218,233,255,0.92),rgba(255,255,255,0.98)_75%)]"
      }`}>
        <span className={`grid grid-cols-2 overflow-hidden rounded-full border border-[var(--color-border-strong)] ${brandInnerClass}`}>
          <span className="bg-white" />
          <span className="bg-[var(--color-primary)]" />
          <span className="bg-[var(--color-primary)]" />
          <span className="bg-white" />
        </span>
      </span>
    );
  }

  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full border text-[var(--color-primary)] ${sizeClass} ${
      isDark
        ? "border-[rgba(36,132,255,0.42)] bg-[radial-gradient(circle_at_30%_30%,rgba(26,70,155,0.35),rgba(4,11,22,0.96)_76%)]"
        : "border-[rgba(11,103,220,0.26)] bg-[radial-gradient(circle_at_30%_30%,rgba(218,233,255,0.92),rgba(255,255,255,0.98)_75%)]"
    }`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className={svgClass} fill="none" stroke="currentColor" strokeWidth="1.85">
        {iconPaths[metric] || iconPaths["Engine Family"]}
      </svg>
    </span>
  );
}

function SectionHeading({ engineName, isDark }) {
  return (
    <div className="mx-auto max-w-[860px] text-center">
      <h2 className={`font-bold tracking-normal ${sectionH2} ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
        Jaguar <span className="text-[var(--color-primary)]">{engineName.replace(/^Jaguar\s+/, "")}</span> Engine Overview
      </h2>
      <div className="mt-3 flex justify-center">
        <MStripe />
      </div>
      <p className={`mx-auto mt-4 max-w-[680px] ${sectionDescription} ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
        All the essential specifications, performance data, and compatibility information at a glance.
      </p>
    </div>
  );
}

function DesktopSmallCard({ metric, value, isDark }) {
  const verified = metric === "Power Range" ? verifiedParts(value) : null;
  const score = metric === "Overall Engine Score" ? parseScore(value) : null;

  return (
    <article className={`rounded-xl border px-6 py-5 ${
      isDark
        ? "border-white/14 bg-[linear-gradient(180deg,rgba(7,16,33,0.86)_0%,rgba(3,10,23,0.96)_100%)]"
        : "border-[rgba(11,103,220,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(240,245,252,0.96)_100%)]"
    }`}>
      <div className="flex items-start gap-4">
        <CircleIcon metric={metric} isDark={isDark} />
        <div className="min-w-0 pt-1">
          <p className={`text-[14px] font-medium uppercase leading-none tracking-[0.04em] ${isDark ? "text-white/72" : "text-[var(--color-text-soft)]"}`}>{metric}</p>
          {score ? (
            <>
              <p className={`mt-3 text-[20px] font-bold leading-none ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                <span className="text-[var(--color-primary)]">{score.score}</span>/{score.total}
              </p>
              <div className="mt-4">
                <ScoreStars />
              </div>
            </>
          ) : (
            <>
              <p className={`mt-3 text-[16px] font-bold leading-snug ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                {verified ? verified.text : cleanText(value)}
              </p>
              {verified?.badge ? (
                <div className="mt-4">
                  <VerifiedBadge />
                </div>
              ) : (
                <span className="mt-4 block h-[3px] w-12 rounded-full bg-[var(--color-primary)]" />
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function DesktopWideCard({ metric, value, text, isDark, imageType = "none" }) {
  const isBrand = metric === "Cross-Brand Fitment";

  return (
    <article className={`grid min-h-[198px] grid-cols-[1.45fr_0.95fr] overflow-hidden rounded-xl border ${
      isDark
        ? "border-white/14 bg-[linear-gradient(180deg,rgba(7,16,33,0.86)_0%,rgba(3,10,23,0.96)_100%)]"
        : "border-[rgba(11,103,220,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(240,245,252,0.96)_100%)]"
    }`}>
      <div className="flex items-start gap-4 px-6 py-6">
        <CircleIcon metric={metric} isDark={isDark} brand={isBrand} />
        <div className="min-w-0 pt-1">
          <p className={`text-[14px] font-medium uppercase leading-none tracking-[0.04em] ${isDark ? "text-white/72" : "text-[var(--color-text-soft)]"}`}>{metric}</p>
          <p className={`mt-3 text-[16px] font-bold leading-snug ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{cleanText(value)}</p>
          <p className={`mt-3 max-w-[340px] text-[15px] leading-[1.45] ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>{text}</p>
        </div>
      </div>

      <div className={`relative hidden h-full overflow-hidden lg:flex ${imageType === "engine" ? "items-center justify-center" : "items-end justify-center"}`}>
        {imageType === "engine" ? (
          <Image
            src="/e90/engine.webp"
            alt=""
            width={300}
            height={260}
            className="h-auto w-[250px] object-contain opacity-95"
          />
        ) : null}
        {imageType === "calendar" ? (
          <svg aria-hidden="true" viewBox="0 0 120 120" className="absolute bottom-4 right-5 h-32 w-32 text-[var(--color-primary)] opacity-[0.16]" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M34 18v14m52-14v14M22 42h76M28 24h64a6 6 0 0 1 6 6v60a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V30a6 6 0 0 1 6-6Z" />
            <path d="M34 56h12v12H34Zm20 0h12v12H54Zm20 0h12v12H74ZM34 76h12v12H34Zm20 0h12v12H54Zm20 0h12v12H74Z" />
          </svg>
        ) : null}
        {imageType === "car" ? (
          <svg aria-hidden="true" viewBox="0 0 180 100" className="absolute bottom-5 right-6 h-24 w-44 text-[var(--color-primary)] opacity-[0.12]" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M35 64h110l-9-23a10 10 0 0 0-9-6H53a10 10 0 0 0-9 6l-9 23Z" />
            <path d="M28 64v12h12m100-12v12h12M56 76a8 8 0 1 0 0 .1M124 76a8 8 0 1 0 0 .1" />
          </svg>
        ) : null}
        {imageType === "bmw" ? (
          <span className="absolute bottom-4 right-6 grid h-32 w-32 grid-cols-2 overflow-hidden rounded-full border border-[var(--color-primary)] opacity-[0.14]">
            <span className="bg-transparent" />
            <span className="bg-[var(--color-primary)]" />
            <span className="bg-[var(--color-primary)]" />
            <span className="bg-transparent" />
          </span>
        ) : null}
      </div>
    </article>
  );
}

function TrustFooter({ isDark }) {
  const items = [
    {
      title: "BMW-Verified Data",
      text: "Verified using real UK enquiries and workshop data.",
      path: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />,
    },
    {
      title: "Real-World Insights",
      text: "Based on 1,450+ UK enquiries in 2025.",
      path: <path d="M5 19V9m5 10V5m5 14v-7m5 7H3M7 13l3-3 3 2 4-5" />,
    },
    {
      title: "Trusted by Enthusiasts",
      text: "Part of Engine Finders - UK's leading engine specialists.",
      path: <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m16 0v-2a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm12 14v-2a4 4 0 0 0-3-3.87M20 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />,
    },
    {
      title: "Quality You Can Trust",
      text: "Every engine is checked, inspected and quality assured.",
      path: <path d="M12 3a6 6 0 0 0-6 6c0 7 6 12 6 12s6-5 6-12a6 6 0 0 0-6-6Zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-4 11h8" />,
    },
  ];

  return (
    <div className={`mt-4 overflow-hidden rounded-xl border ${
      isDark
        ? "border-white/14 bg-[linear-gradient(180deg,rgba(7,16,33,0.82)_0%,rgba(3,10,23,0.94)_100%)]"
        : "border-[rgba(11,103,220,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(240,245,252,0.96)_100%)]"
    }`}>
      <div className="grid md:grid-cols-4">
        {items.map((item, index) => (
          <article key={item.title} className={`flex items-start gap-3 px-4 py-4 md:px-5 md:py-4 ${index < items.length - 1 ? "border-b border-[var(--color-border)] md:border-b-0 md:border-r" : ""}`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--color-primary)]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9">
                {item.path}
              </svg>
            </span>
            <div>
              <p className={`text-[14px] font-semibold uppercase leading-[1.15] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{item.title}</p>
              <p className={`mt-1 text-[13px] leading-[1.45] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function MobileRow({ metric, value, isDark }) {
  const verified = metric === "Power Range" ? verifiedParts(value) : null;
  const score = metric === "Overall Engine Score" ? parseScore(value) : null;
  const metricLabel = metric.includes(" / ")
    ? metric.split(" / ").map((part, index, parts) => (
        <span key={part}>
          {part}
          {index < parts.length - 1 ? (
            <>
              {" /"}
              <br />
            </>
          ) : null}
        </span>
      ))
    : metric;

  return (
    <article className={`grid grid-cols-[92px_1px_minmax(0,1fr)] items-center overflow-hidden rounded-xl border px-3 py-3 sm:grid-cols-[108px_1px_minmax(0,1fr)] sm:px-4 sm:py-4 ${
      isDark
        ? "border-white/14 bg-[linear-gradient(180deg,rgba(7,16,33,0.88)_0%,rgba(3,10,23,0.96)_100%)]"
        : "border-[rgba(11,103,220,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(240,245,252,0.96)_100%)]"
    }`}>
      <div className="flex min-w-0 flex-col items-start gap-1.5 pr-2 sm:pr-3">
        <CircleIcon metric={metric} isDark={isDark} brand={metric === "Cross-Brand Fitment"} compact />
        <p className={`w-full break-words text-[10px] leading-[1.2] sm:text-[12px] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>{metricLabel}</p>
      </div>
      <span className="h-full min-h-14 w-px self-stretch bg-[var(--color-border)] opacity-80" />
      <div className="min-w-0 pl-3 sm:pl-4">
        {score ? (
          <>
            <p className={`text-[20px] font-bold leading-none sm:text-[25px] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
              <span className="text-[var(--color-primary)]">{score.score}</span>/{score.total}
            </p>
            <div className="mt-2">
              <ScoreStars />
            </div>
          </>
        ) : (
          <>
            <p className={`text-[15px] font-bold leading-[1.2] sm:text-[18px] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
              {verified ? verified.text : cleanText(value)}
            </p>
            {verified?.badge ? (
              <div className="mt-3">
                <VerifiedBadge />
              </div>
            ) : null}
          </>
        )}
      </div>
    </article>
  );
}

export default function AtAGlance({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const rowMap = getRowMap(data.rows || []);
  const engineName = extractEngineName(rowMap);
  const topMetrics = ["Engine Family", "Fuel", "Power Range", "Overall Engine Score"];
  const mobileMetrics = [
    "Engine Family",
    "Fuel",
    "Configuration / Displacement",
    "Power Range",
    "Years Produced",
    "Models Fitted (BMW only)",
    "Cross-Brand Fitment",
    "Overall Engine Score",
  ];

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-9">
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[radial-gradient(circle_at_78%_24%,rgba(36,132,255,0.14)_0%,rgba(36,132,255,0)_22%),linear-gradient(180deg,#02060d_0%,#07101d_55%,#030913_100%)]"
              : "bg-[radial-gradient(circle_at_78%_24%,rgba(11,103,220,0.12)_0%,rgba(11,103,220,0)_22%),linear-gradient(180deg,#dce8f8_0%,#e7eef8_32%,#f6f8fc_100%)]"
          }`}
        />
        <div className="absolute inset-0 bg-[url('/Hero-dark.webp')] bg-cover bg-[center_top] opacity-15 mix-blend-screen md:opacity-22" />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(90deg,rgba(2,6,13,0.96)_0%,rgba(2,8,18,0.88)_42%,rgba(2,8,18,0.6)_100%)]"
              : "bg-[linear-gradient(90deg,rgba(245,248,253,0.98)_0%,rgba(240,245,252,0.88)_42%,rgba(240,245,252,0.62)_100%)]"
          }`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <SectionHeading engineName={engineName} isDark={isDark} />

        <div className="mt-6 hidden md:block">
          <div className="grid grid-cols-4 gap-3">
            {topMetrics.map((metric) => (
              <DesktopSmallCard key={metric} metric={metric} value={rowMap[metric]} isDark={isDark} />
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <DesktopWideCard
              metric="Configuration / Displacement"
              value={rowMap["Configuration / Displacement"]}
              text="Modern turbodiesel four-cylinder engine with proven architecture."
              isDark={isDark}
              imageType="engine"
            />
            <DesktopWideCard
              metric="Years Produced"
              value={rowMap["Years Produced"]}
              text="Over a decade of production and continuous development."
              isDark={isDark}
              imageType="calendar"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <DesktopWideCard
              metric="Models Fitted (BMW only)"
              value={rowMap["Models Fitted (BMW only)"]}
              text="Fitted across a wide range of BMW vehicles and body styles."
              isDark={isDark}
              imageType="car"
            />
            <DesktopWideCard
              metric="Cross-Brand Fitment"
              value={rowMap["Cross-Brand Fitment"]}
              text="The N47 engine is engineered exclusively for BMW vehicles."
              isDark={isDark}
              imageType="bmw"
            />
          </div>

          <TrustFooter isDark={isDark} />
        </div>

        <div className="mt-6 grid gap-3 md:hidden">
          {mobileMetrics.map((metric) => (
            <MobileRow key={metric} metric={metric} value={rowMap[metric]} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}
