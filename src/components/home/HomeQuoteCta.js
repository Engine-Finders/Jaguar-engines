import Link from "next/link";

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

/**
 * Compact homepage quote CTA strip - button + optional one-line support text.
 * Keeps spacing tight so it slots into existing sections without redesign.
 */
export default function HomeQuoteCta({
  label,
  href = "/quote",
  support,
  isDark = false,
  className = "",
}) {
  return (
    <div className={`mt-4 flex flex-col gap-2 sm:mt-5 ${className}`}>
      {support ? (
        <p
          className={`max-w-[40rem] text-[0.8rem] leading-[1.4] md:text-[0.86rem] ${
            isDark ? "text-white/75" : "text-[var(--color-text-muted)]"
          }`}
        >
          {support}
        </p>
      ) : null}
      <Link
        href={href}
        className="btn-cta inline-flex w-full items-center justify-center gap-2.5 rounded-md px-4 py-3 text-[0.82rem] font-bold tracking-[0.02em] sm:w-fit sm:px-5 sm:text-[0.88rem]"
      >
        <span>{label}</span>
        <ArrowIcon className="h-4 w-4 shrink-0" />
      </Link>
    </div>
  );
}
