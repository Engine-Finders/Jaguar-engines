"use client";

import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import HomeIcon from "@/components/home/homeIcons";
import { sectionH2 } from "@/components/models/sectionTypography";
import { engineSectionBg } from "./engineSection";

const TRUST_ICONS = ["shield", "real-inquiries", "pin"];

function cleanText(text = "") {
  return String(text)
    .replace(/\u00c2\u00a3|\u00a3/g, "\u00a3")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u201c|\u00c3\u00a2\u00e2\u20ac\u201d|\u00e2\u20ac\u201c|\u00e2\u20ac\u201d|\u2013|\u2014/g, "\u2013")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u02dc|\u00e2\u20ac\u2018|\u2011/g, "-")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u00a2|\u00e2\u20ac\u00a2|\u2022/g, "\u2022")
    .replace(/\s+/g, " ")
    .trim();
}

function shortEngineName(engineLabel = "") {
  return cleanText(engineLabel).replace(/^Jaguar\s+/i, "").replace(/^BMW\s+/i, "") || "Engine";
}

function parseTrustPoint(point = "") {
  const clean = cleanText(point);
  const index = clean.indexOf(":");
  if (index === -1) return { title: clean, text: "" };
  return {
    title: clean.slice(0, index).trim(),
    text: clean.slice(index + 1).trim(),
  };
}

function TrustIcon({ index, isDark }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)]">
      <HomeIcon name={TRUST_ICONS[index % TRUST_ICONS.length]} isDark={isDark} className="h-7 w-7 object-contain" />
    </span>
  );
}

function highlightConfidence(text = "") {
  const clean = cleanText(text);
  const phrase = "get back on the road with confidence.";
  const index = clean.toLowerCase().indexOf(phrase);

  if (index === -1) return clean;

  return (
    <>
      {clean.slice(0, index)}
      <span className="font-semibold text-[var(--color-primary)]">{clean.slice(index, index + phrase.length)}</span>
      {clean.slice(index + phrase.length)}
    </>
  );
}

export default function TrustCta({ data, engineLabel = "Jaguar Engine" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const engineCode = shortEngineName(engineLabel);
  const points = (data.trustPoints || []).map(parseTrustPoint);
  const ctaLabel = cleanText(data.ctaButton?.label || "")
    .replace(/BMW/gi, "Jaguar")
    .replace(/\s*→\s*$/, "");

  const lightCard =
    "border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_10px_28px_var(--color-shadow)]";
  const darkCard = "border-[var(--color-border)] bg-[var(--color-surface)]";

  return (
    <section className={`relative w-full overflow-x-hidden py-6 text-[var(--color-text)] md:py-9 ${engineSectionBg(isDark, false)}`}>
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div>
          <h2 className={`font-bold tracking-normal ${sectionH2}`}>
            Why Owners <span className="text-[var(--color-primary)]">Trust Us</span>
          </h2>
          <div className="mt-3">
            <MStripe />
          </div>
        </div>

        <div className="mt-4 hidden gap-3 md:grid md:grid-cols-3">
          {points.map((point, index) => (
            <article
              key={point.title}
              className={`rounded-xl border px-4 py-4 ${isDark ? darkCard : lightCard}`}
            >
              <div className="flex items-start gap-3">
                <TrustIcon index={index} isDark={isDark} />
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-[var(--color-text)]">{point.title}</p>
                  <p className="mt-1.5 text-[13px] leading-[1.45] text-[var(--color-text-muted)]">{point.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div
          className={`mt-3 hidden items-center gap-4 rounded-xl border px-4 py-3.5 md:flex ${
            isDark
              ? "border-[var(--color-border)] bg-[var(--color-primary-soft)]"
              : "border-[var(--color-border)] bg-[var(--color-primary-soft)] shadow-[0_10px_28px_var(--color-shadow)]"
          }`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] shadow-[0_4px_12px_var(--color-shadow)]">
            <HomeIcon name="engine-finders" isDark={isDark} className="h-7 w-7 object-contain" />
          </span>
          <p className="min-w-0 flex-1 text-[13px] leading-[1.45] text-[var(--color-text)]">
            {highlightConfidence(cleanText(data.finalCta || "").replace(/BMW/gi, "Jaguar"))}
          </p>
          {data.ctaButton?.href ? (
            <Link
              href="/quote"
              className="btn-cta inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] px-5 text-[13px] font-bold text-white"
            >
              {ctaLabel || `Compare Jaguar ${engineCode} Engine Prices Now`} →
            </Link>
          ) : null}
        </div>

        <div className="mt-3 grid gap-2.5 md:hidden">
          {points.map((point, index) => (
            <article
              key={point.title}
              className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 ${isDark ? darkCard : lightCard}`}
            >
              <TrustIcon index={index} isDark={isDark} />
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-[var(--color-text)]">{point.title}</p>
                <p className="mt-1 text-[12px] leading-[1.4] text-[var(--color-text-muted)]">{point.text}</p>
              </div>
            </article>
          ))}

          <article
            className={`rounded-xl border px-3.5 py-4 text-center ${
              isDark
                ? "border-[var(--color-border)] bg-[var(--color-primary-soft)]"
                : "border-[var(--color-border)] bg-[var(--color-primary-soft)] shadow-[0_10px_28px_var(--color-shadow)]"
            }`}
          >
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface)] shadow-[0_4px_12px_var(--color-shadow)]">
              <HomeIcon name="engine-finders" isDark={isDark} className="h-7 w-7 object-contain" />
            </span>
            <p className="mt-3 text-[20px] font-bold leading-[1.25] text-[var(--color-text)]">
              Find the best Jaguar {engineCode} engine replacement UK drivers rely on.
            </p>
            <p className="mt-2 text-[12px] leading-[1.4] text-[var(--color-text-muted)]">
              {highlightConfidence(
                cleanText(data.finalCta || "")
                  .replace(/BMW/gi, "Jaguar")
                  .includes("Compare")
                  ? cleanText(data.finalCta || "")
                      .replace(/BMW/gi, "Jaguar")
                      .slice(cleanText(data.finalCta || "").replace(/BMW/gi, "Jaguar").indexOf("Compare"))
                  : cleanText(data.finalCta || "").replace(/BMW/gi, "Jaguar"),
              )}
            </p>
            {data.ctaButton?.href ? (
              <Link
                href="/quote"
                className="btn-cta mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 text-[13px] font-bold text-white"
              >
                <span>{ctaLabel || `Compare Jaguar ${engineCode} Engine Prices Now`}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ) : null}
          </article>
        </div>
      </div>
    </section>
  );
}
