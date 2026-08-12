const styles = {
  "BMW-VERIFIED": {
    light: "border-[#bfe6cd] bg-[#eafaf0] text-[#13884a]",
    dark: "border-[rgba(24,148,84,0.34)] bg-[rgba(24,148,84,0.16)] text-[#67d99a]",
  },
  PROVISIONAL: {
    light: "border-[var(--color-border-strong)] bg-[var(--color-page-soft)] text-[var(--color-text-soft)]",
    dark: "border-[var(--color-border-strong)] bg-[rgba(255,255,255,0.06)] text-[var(--color-text-soft)]",
  },
  "NEWLY ASSIGNED": {
    light: "border-[rgba(11,103,220,0.3)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    dark: "border-[rgba(36,132,255,0.34)] bg-[rgba(36,132,255,0.16)] text-[#7fb2ff]",
  },
  NEW: {
    light: "border-[rgba(11,103,220,0.3)] bg-[var(--color-primary)] text-white",
    dark: "border-[rgba(36,132,255,0.34)] bg-[var(--color-primary)] text-white",
  },
};

export default function GenBadge({ tag, isDark, compact = false }) {
  if (!tag) return null;
  const style = styles[tag] || styles.PROVISIONAL;

  if (compact) {
    return (
      <span
        className={`block max-w-full truncate rounded border px-1 py-0.5 text-[0.5rem] font-semibold uppercase leading-none tracking-tight ${
          isDark ? style.dark : style.light
        }`}
        title={tag}
      >
        {tag}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex max-w-full items-center truncate rounded-md border px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wide ${
        isDark ? style.dark : style.light
      }`}
    >
      {tag}
    </span>
  );
}
