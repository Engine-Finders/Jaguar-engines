"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import { sectionDescription, sectionH2 } from "@/components/models/sectionTypography";

const ENGINE_IMAGE =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80";

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
  return cleanText(engineLabel).replace(/^BMW\s+/i, "") || "Engine";
}

function parseQuestion(question = "") {
  const clean = cleanText(question);
  const match = clean.match(/^(.+?)\s*[-–—]\s*[“"']?(.+?)[”"']?\s*$/);
  if (!match) return { topic: "", title: clean };
  return {
    topic: match[1].trim(),
    title: match[2].replace(/^["“']|["”']$/g, "").trim(),
  };
}

function renderTaggedText(text = "") {
  return cleanText(text).split(/(\[[^\]]+\])/g).map((part, index) => {
    if (/^\[[^\]]+\]$/.test(part)) {
      return (
        <span key={`${part}-${index}`} className="font-semibold text-[var(--color-primary)]">
          {part}
        </span>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function FaqItem({ item, open, onToggle, isLast, isDark }) {
  const { topic, title } = parseQuestion(item.question);

  return (
    <div className={!isLast ? "border-b border-[var(--color-border)]" : ""}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-3.5 text-left md:gap-3.5 md:px-5 md:py-4"
        aria-expanded={open}
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary-soft)] text-[13px] font-bold text-[var(--color-primary)]">
          {item.id}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-[14px] font-bold leading-[1.3] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
            {topic ? (
              <>
                {topic} – “{title}”
              </>
            ) : (
              title
            )}
          </span>
          {open ? (
            <span className={`mt-1.5 block text-[13px] leading-[1.45] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>
              {renderTaggedText(item.answer)}
            </span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className={`mt-1 shrink-0 text-[15px] font-bold text-[var(--color-primary)] transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
    </div>
  );
}

export default function FAQAccordion({ data, engineLabel = "BMW Engine" }) {
  const { theme } = useTheme();
  const items = data?.items || [];
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  if (!data) return null;

  const isDark = theme === "dark";
  const engineCode = shortEngineName(engineLabel);

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[var(--color-page)] py-6 text-[var(--color-text)] md:py-9">
      {/* Full-section engine background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${isDark ? "bg-[var(--color-page)]" : "bg-[var(--color-page-soft)]"}`} />
        <Image
          src={ENGINE_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_35%] opacity-80 md:opacity-90"
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(90deg,var(--color-page)_0%,var(--color-hero-overlay)_42%,transparent_72%)]"
              : "bg-[linear-gradient(90deg,var(--color-page-soft)_0%,var(--color-hero-overlay)_42%,transparent_72%)]"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(180deg,var(--color-hero-overlay)_0%,transparent_30%,transparent_70%,var(--color-hero-fade)_100%)]"
              : "bg-[linear-gradient(180deg,var(--color-hero-overlay)_0%,transparent_32%,transparent_68%,var(--color-hero-fade)_100%)]"
          }`}
        />
      </div>

      <div className="relative z-[1] mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="grid items-start gap-5 md:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.35fr)] md:gap-8 lg:gap-10">
          <div className="min-w-0 max-w-[480px]">
            <h2 className={`font-bold tracking-normal ${sectionH2}`}>
              Frequently Asked Questions
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>
            <p className={`mt-4 ${sectionDescription} ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
              Expert answers to the most common BMW{" "}
              <span className="font-semibold text-[var(--color-primary)]">{engineCode}</span> engine questions.
            </p>
          </div>

          <div
            className={`overflow-hidden rounded-xl border backdrop-blur-[2px] ${
              isDark
                ? "border-[var(--color-border)] bg-[var(--color-surface)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_14px_36px_var(--color-shadow)]"
            }`}
          >
            {items.map((item, index) => (
              <FaqItem
                key={item.id}
                item={item}
                isDark={isDark}
                isLast={index === items.length - 1}
                open={openId === item.id}
                onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
