export function engineSectionBg(isDark, tinted = false) {
  if (isDark) return "bg-[var(--color-page)]";
  return tinted ? "bg-[#ececea]" : "bg-[var(--color-page)]";
}
