"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import HomeIcon from "@/components/home/homeIcons";
import { sectionDescription, sectionH2 } from "@/components/models/sectionTypography";
import { engineSectionBg } from "./engineSection";

const METRIC_ICONS = {
  "Engine Family": "engine",
  Fuel: "fuel",
  "Configuration / Displacement": "engine-codes",
  "Power Range": "diagnosis",
  "Years Produced": "timeline",
  "Models Fitted (Jaguar)": "vehicle",
  "Models Fitted (BMW only)": "vehicle",
  "Cross-Brand Fitment": "globe",
  "Overall Engine Score": "star",
};

const TRUST_ITEMS = [
  { icon: "shield", title: "Jaguar-Verified Data", text: "Verified using real UK enquiries and workshop data." },
  { icon: "real-inquiries", title: "Real-World Insights", text: "Based on UK enquiries and specialist workshop reports." },
  { icon: "engine-finders", title: "Trusted by Enthusiasts", text: "Part of Engine Finders — the UK's engine specialists." },
  { icon: "check", title: "Quality You Can Trust", text: "Every engine is checked, inspected and quality assured." },
];

function cleanText(text = "") {
  return String(text ?? "")
    .replace(/\u00c2\u00a3|\u00a3/g, "£")
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
  const badge = clean.includes("[JAG-VERIFIED]") || clean.includes("[BMW-VERIFIED]");
  return {
    text: clean.replace("[JAG-VERIFIED]", "").replace("[BMW-VERIFIED]", "").trim(),
    badge,
  };
}

function modelsFittedKey(rowMap) {
  return Object.keys(rowMap).find((key) => key.startsWith("Models Fitted")) || "Models Fitted (Jaguar)";
}

function CircleIcon({ metric, isDark, compact = false }) {
  const icon = METRIC_ICONS[metric] || "engine";
  const sizeClass = compact ? "h-10 w-10 md:h-14 md:w-14" : "h-14 w-14";
  const iconClass = compact ? "h-8 w-8 md:h-11 md:w-11" : "h-11 w-11";

  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] ${sizeClass}`}>
      <HomeIcon name={icon} isDark={isDark} className={`${iconClass} object-contain`} />
    </span>
  );
}

function VerifiedBadge({ isDark }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] font-semibold ${
        isDark ? "border-white/16 bg-white/8 text-white/85" : "border-[var(--color-chrome)]/40 bg-[#f3f3f1] text-[var(--color-text)]"
      }`}
    >
      <HomeIcon name="shield" isDark={isDark} className="h-4 w-4 object-contain" />
      JAG-VERIFIED
    </span>
  );
}

function ScoreStars() {
  return (
    <div className="flex items-center gap-1 text-[var(--color-chrome-bright)]">
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} className="text-[18px] leading-none">★</span>
      ))}
      <span className="text-[18px] leading-none text-[var(--color-border-strong)]">☆</span>
    </div>
  );
}

function cardClass(isDark) {
  return isDark
    ? "border-white/14 bg-[rgba(12,12,12,0.55)]"
    : "border-[var(--color-border)] bg-[rgba(255,255,255,0.92)]";
}

function DesktopSmallCard({ metric, value, isDark }) {
  const verified = metric === "Power Range" ? verifiedParts(value) : null;
  const score = metric === "Overall Engine Score" ? parseScore(value) : null;

  return (
    <article className={`glass-panel rounded-md border px-5 py-5 ${cardClass(isDark)}`}>
      <div className="flex items-start gap-4">
        <CircleIcon metric={metric} isDark={isDark} />
        <div className="min-w-0 pt-1">
          <p className={`text-[13px] font-medium uppercase leading-none tracking-[0.04em] ${isDark ? "text-white/72" : "text-[var(--color-text-soft)]"}`}>
            {metric}
          </p>
          {score ? (
            <>
              <p className={`font-heading mt-3 text-[1.4rem] font-bold leading-none ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                <span className="text-[var(--color-chrome-bright)]">{score.score}</span>/{score.total}
              </p>
              <div className="mt-3">
                <ScoreStars />
              </div>
            </>
          ) : (
            <>
              <p className={`font-heading mt-3 text-[18px] font-bold leading-snug md:text-[20px] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                {verified ? verified.text : cleanText(value)}
              </p>
              {verified?.badge ? (
                <div className="mt-3">
                  <VerifiedBadge isDark={isDark} />
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
  return (
    <article className={`glass-panel grid min-h-[180px] overflow-hidden rounded-md border md:grid-cols-[1.45fr_0.95fr] ${cardClass(isDark)}`}>
      <div className="flex items-start gap-4 px-5 py-5">
        <CircleIcon metric={metric} isDark={isDark} />
        <div className="min-w-0 pt-1">
          <p className={`text-[13px] font-medium uppercase leading-none tracking-[0.04em] ${isDark ? "text-white/72" : "text-[var(--color-text-soft)]"}`}>
            {metric}
          </p>
          <p className={`font-heading mt-3 text-[18px] font-bold leading-snug md:text-[20px] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
            {cleanText(value)}
          </p>
          {text ? (
            <p className={`mt-3 max-w-[340px] text-[15px] leading-[1.45] ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
              {text}
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center">
        {imageType === "engine" ? (
          <Image src="/e90/engine.webp" alt="" width={240} height={200} className="h-auto w-[220px] object-contain opacity-90" />
        ) : imageType === "clock" ? (
          <HomeIcon name="timeline" isDark={isDark} className="h-24 w-24 object-contain opacity-25" />
        ) : imageType === "car" ? (
          <HomeIcon name="vehicle" isDark={isDark} className="h-24 w-24 object-contain opacity-25" />
        ) : imageType === "globe" ? (
          <HomeIcon name="globe" isDark={isDark} className="h-24 w-24 object-contain opacity-25" />
        ) : null}
      </div>
    </article>
  );
}

function TrustFooter({ isDark }) {
  return (
    <div className={`glass-panel mt-4 overflow-hidden rounded-md border ${cardClass(isDark)}`}>
      <div className="grid md:grid-cols-4">
        {TRUST_ITEMS.map((item, index) => (
          <article
            key={item.title}
            className={`flex items-start gap-3 px-4 py-4 md:px-5 ${
              index < TRUST_ITEMS.length - 1 ? "border-b border-[var(--color-border)] md:border-b-0 md:border-r" : ""
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              <HomeIcon name={item.icon} isDark={isDark} className="h-8 w-8 object-contain" />
            </span>
            <div>
              <p className={`text-[14px] font-semibold leading-[1.15] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                {item.title}
              </p>
              <p className={`mt-1 text-[13px] leading-[1.45] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>
                {item.text}
              </p>
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

  return (
    <article className={`grid grid-cols-[minmax(132px,0.42fr)_1px_minmax(0,1fr)] items-center overflow-hidden rounded-md border px-3 py-3 ${cardClass(isDark)}`}>
      <div className="flex min-w-0 items-center gap-2 pr-2">
        <CircleIcon metric={metric} isDark={isDark} compact />
        <p className={`min-w-0 break-words text-[11px] font-medium leading-[1.2] ${isDark ? "text-white/85" : "text-[var(--color-text-muted)]"}`}>
          {metric}
        </p>
      </div>
      <span className="h-full min-h-14 w-px self-stretch bg-[var(--color-border)] opacity-80" />
      <div className="min-w-0 pl-3">
        {score ? (
          <>
            <p className={`font-heading text-[22px] font-bold leading-none ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
              <span className="text-[var(--color-chrome-bright)]">{score.score}</span>/{score.total}
            </p>
            <div className="mt-2">
              <ScoreStars />
            </div>
          </>
        ) : (
          <>
            <p className={`font-heading text-[17px] font-bold leading-[1.2] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
              {verified ? verified.text : cleanText(value)}
            </p>
            {verified?.badge ? (
              <div className="mt-3">
                <VerifiedBadge isDark={isDark} />
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
  const fittedKey = modelsFittedKey(rowMap);
  const topMetrics = ["Engine Family", "Fuel", "Power Range", "Overall Engine Score"].filter((metric) => rowMap[metric]);
  const mobileMetrics = (data.rows || []).map((row) => row.metric);

  return (
    <section className={`w-full overflow-x-hidden py-8 text-[var(--color-text)] md:py-9 ${engineSectionBg(isDark, true)}`}>
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="max-w-[720px]">
          <h2 className={`font-bold tracking-normal ${sectionH2} ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
            Jaguar <span className="text-[var(--color-chrome-bright)]">{engineName.replace(/^Jaguar\s+/, "")}</span>
            <br />
            Engine Overview
          </h2>
          <div className="mt-3">
            <MStripe />
          </div>
          <p className={`mt-4 max-w-[680px] ${sectionDescription} ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
            {data.subHeadline || "All the essential specifications, performance data, and compatibility information at a glance."}
          </p>
        </div>

        <div className="mt-6 hidden md:block">
          <div className="grid grid-cols-4 gap-3">
            {topMetrics.map((metric) => (
              <DesktopSmallCard key={metric} metric={metric} value={rowMap[metric]} isDark={isDark} />
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {rowMap["Configuration / Displacement"] ? (
              <DesktopWideCard
                metric="Configuration / Displacement"
                value={rowMap["Configuration / Displacement"]}
                text="Modern Jaguar architecture with proven UK workshop data behind it."
                isDark={isDark}
                imageType="engine"
              />
            ) : null}
            {rowMap["Years Produced"] ? (
              <DesktopWideCard
                metric="Years Produced"
                value={rowMap["Years Produced"]}
                text="Production years and running changes that matter when you buy."
                isDark={isDark}
                imageType="clock"
              />
            ) : null}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {rowMap[fittedKey] ? (
              <DesktopWideCard
                metric={fittedKey}
                value={rowMap[fittedKey]}
                text="Jaguar models this engine was factory-fitted to."
                isDark={isDark}
                imageType="car"
              />
            ) : null}
            {rowMap["Cross-Brand Fitment"] ? (
              <DesktopWideCard
                metric="Cross-Brand Fitment"
                value={rowMap["Cross-Brand Fitment"]}
                text="Where this engine also appears outside Jaguar, if at all."
                isDark={isDark}
                imageType="globe"
              />
            ) : null}
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
