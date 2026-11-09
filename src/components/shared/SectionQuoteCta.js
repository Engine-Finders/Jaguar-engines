import Link from "next/link";

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

/** Compact section CTA → /quote. Optional one-line support. */
export default function SectionQuoteCta({
  label,
  href = "/quote",
  support,
  isDark = false,
  className = "",
}) {
  if (!label) return null;
  return (
    <div className={`mt-4 flex flex-col gap-2 sm:mt-5 ${className}`}>
      {support ? (
        <p className={`max-w-[40rem] text-[0.8rem] leading-[1.4] md:text-[0.86rem] ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}>
          {support}
        </p>
      ) : null}
      <Link
        href={href}
        className="btn-cta inline-flex w-full items-center justify-center gap-2.5 rounded-md px-4 py-3 text-[0.82rem] font-bold sm:w-fit sm:px-5 sm:text-[0.88rem]"
      >
        <span>{label}</span>
        <ArrowIcon className="h-4 w-4 shrink-0" />
      </Link>
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
  // Often "Jaguar E-Pace X540 …" or similar in h1
  const h1 = String(data.h1 || "");
  const fromH1 = h1.match(/\b(X\d{3}|XJ\d*|Series\s*\d+|X\d{3}\/X\d{3})\b/i);
  if (fromH1) return fromH1[1].replace(/\s+/g, " ");
  const parts = pill.split("•").map((p) => p.trim());
  for (const p of parts) {
    if (/^X\d/i.test(p) || /^Series/i.test(p)) return p;
  }
  return modelLabelFromData(data);
}
