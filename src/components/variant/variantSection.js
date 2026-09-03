export { sectionH2 } from "@/components/models/sectionTypography";

export function variantSectionBg(isDark, tinted = false) {
  if (isDark) return "bg-[var(--color-page)]";
  return tinted ? "bg-[#ececea]" : "bg-[var(--color-page)]";
}

export function splitSectionH2(title = "") {
  const clean = String(title ?? "").trim();

  const dash = clean.indexOf(" - ");
  if (dash !== -1) {
    return {
      before: clean.slice(0, dash).trim(),
      accent: clean.slice(dash + 3).trim(),
    };
  }

  const replacement = clean.match(/^(.*?)\s+(Engine Replacement Costs)$/i);
  if (replacement) {
    return { before: replacement[1].trim(), accent: replacement[2] };
  }

  const trust = clean.match(/^(.*?)\s+(Trust\s+JaguarEngine\.uk|Trust\s+jaguarengines\.uk)$/i);
  if (trust) {
    return { before: trust[1].trim(), accent: trust[2] };
  }

  const twoTone = clean.match(/^(Frequently Asked|Market|Engine|Buying|Common)\s+(.+)$/i);
  if (twoTone) {
    return { before: twoTone[1].trim(), accent: twoTone[2].trim() };
  }

  return { before: clean, accent: "" };
}

export function tableHeaderClass(isDark) {
  return isDark
    ? "bg-[var(--color-chrome)] text-[var(--color-page)]"
    : "bg-black text-white";
}

export function indexBadgeClass(isDark) {
  return isDark
    ? "bg-[var(--color-chrome)] text-[var(--color-page)]"
    : "bg-black text-white";
}

export function primaryBadgeClass(isDark) {
  return isDark
    ? "bg-[var(--color-primary)] text-[var(--color-page)]"
    : "bg-[var(--color-primary)] text-white";
}

export function primaryCtaClass(extra = "") {
  return `btn-cta font-bold no-underline shadow-[0_12px_28px_var(--color-shadow)] ${extra}`.trim();
}

export function stripCtaArrow(label = "") {
  return String(label)
    .replace(/^\s*→\s*/, "")
    .replace(/\s*→\s*$/, "")
    .trim();
}

export function VariantSectionHeading({ title, className = "" }) {
  const parts = splitSectionH2(title);
  if (!title) return null;

  return (
    <h2
      className={`text-[2.15rem] font-bold leading-[1.1] tracking-normal md:text-[3rem] ${className}`}
    >
      {parts.before ? <span dangerouslySetInnerHTML={{ __html: parts.before }} /> : null}
      {parts.accent ? (
        <>
          {parts.before ? " " : null}
          <span
            className="text-[var(--color-chrome-bright)]"
            dangerouslySetInnerHTML={{ __html: parts.accent }}
          />
        </>
      ) : null}
    </h2>
  );
}
