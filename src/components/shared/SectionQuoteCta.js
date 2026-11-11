"use client";

import { openFreeQuote } from "@/lib/openFreeQuote";

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v5c0 4.4 2.9 7.8 7 9 4.1-1.2 7-4.6 7-9V6l-7-3Z" />
      <path d="m9.2 12.2 1.9 1.9 3.7-3.8" />
    </svg>
  );
}

/** Boxed section CTA → opens sticky free-quote modal. Support text left, button right. */
export default function SectionQuoteCta({
  label,
  support,
  isDark = false,
  className = "",
  onClick,
}) {
  if (!label) return null;

  return (
    <div
      className={`mt-4 rounded-lg border px-4 py-4 sm:mt-5 md:px-6 md:py-5 ${
        isDark
          ? "border-white/15 bg-white/[0.04]"
          : "border-[#d8d8d6] bg-[#f3f3f1]"
      } ${className}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        {support ? (
          <div className="flex min-w-0 items-start gap-3 md:items-center">
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border md:mt-0 ${
                isDark
                  ? "border-white/25 text-white/85"
                  : "border-[#bdbdb9] text-[#2a2a28]"
              }`}
            >
              <ShieldCheckIcon className="h-[1.05rem] w-[1.05rem]" />
            </span>
            <p
              className={`min-w-0 text-[0.84rem] font-bold leading-[1.4] md:text-[0.92rem] md:leading-[1.35] ${
                isDark ? "text-white/90" : "text-[#1f1f1d]"
              }`}
            >
              {support}
            </p>
          </div>
        ) : (
          <span className="hidden md:block" />
        )}

        <button
          type="button"
          onClick={(event) => {
            if (onClick) {
              onClick(event);
              return;
            }
            openFreeQuote();
          }}
          className={`inline-flex w-full shrink-0 items-center justify-center gap-2.5 rounded-md px-5 py-3 text-[0.78rem] font-bold uppercase tracking-[0.04em] no-underline sm:w-fit md:text-[0.82rem] ${
            isDark
              ? "bg-white text-black hover:bg-[var(--color-chrome-bright)]"
              : "bg-black text-white hover:bg-[#222]"
          }`}
        >
          <span>{label}</span>
          <ArrowIcon className="h-4 w-4 shrink-0" />
        </button>
      </div>
    </div>
  );
}

/** Pull model name from tagPill "Jaguar • E-Pace • …" or h1. */
export function modelLabelFromData(data = {}) {
  const pill = String(data.tagPill || "");
  if (pill.includes("•")) {
    const part = pill.split("•")[1]?.trim();
    if (part) return part.replace(/Engines?/i, "").trim();
  }
  const h1 = String(data.h1 || "");
  const m = h1.match(/^Jaguar\s+(.+?)\s+Engines?\b/i) || h1.match(/^(.+?)\s+Engines?\b/i);
  return (m?.[1] || "Jaguar").trim();
}

export function generationLabelFromData(data = {}) {
  const pill = String(data.tagPill || data.pill || "");
  const h1 = String(data.h1 || "");
  const fromH1 = h1.match(/\b(X\d{3}|XJ\d*|Series\s*\d+|X\d{3}\/X\d{3})\b/i);
  if (fromH1) return fromH1[1].replace(/\s+/g, " ");
  const parts = pill.split("•").map((p) => p.trim());
  for (const p of parts) {
    if (/^X\d/i.test(p) || /^Series/i.test(p)) return p;
  }
  return modelLabelFromData(data);
}
