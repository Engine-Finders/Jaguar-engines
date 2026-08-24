"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const ROW_IMAGE = "/home-image/right.webp";

const statusConfig = {
  scrap: {
    circle: "bg-[#ed1c24] text-white",
    icon: "x",
  },
  safe: {
    circle: "bg-[#20a84a] text-white",
    icon: "check",
  },
  watch: {
    circle: "bg-[#f7a51b] text-white",
    icon: "warning",
  },
};

function cleanText(value = "") {
  return value
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replaceAll("â†’", "")
    .trim();
}

function stripTags(value = "") {
  return cleanText(value).replace(/<[^>]*>/g, "").trim();
}

function unlinkHtml(value = "", { emphasize = true } = {}) {
  return cleanText(value).replace(
    /<a\b[^>]*>([\s\S]*?)<\/a>/gi,
    emphasize
      ? '<span class="font-semibold text-[var(--color-chrome-bright)]">$1</span>'
      : '<span class="font-normal text-[var(--color-chrome-bright)]">$1</span>'
  );
}

function StatusSvg({ name, className = "h-3.5 w-3.5" }) {
  if (name === "check") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }
  if (name === "x") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 8l8 8M16 8l-8 8" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4m0 4h.01M10.2 4.8 2.7 18a1.8 1.8 0 0 0 1.56 2.7h15.48A1.8 1.8 0 0 0 21.3 18L13.8 4.8a1.8 1.8 0 0 0-3.12 0Z" />
    </svg>
  );
}

function ValueCell({ value, isDark }) {
  const cleaned = cleanText(value);
  const parts = cleaned.match(/^(.+?)\s+\[(.+)\]$/);

  return (
    <p className={`text-[0.68rem] font-medium leading-[1.3] md:text-[0.84rem] md:leading-[1.35] ${isDark ? "text-white/90" : "text-[var(--color-text)]"}`}>
      <span className="block">{parts ? parts[1] : cleaned}</span>
      {parts ? (
        <span className={`mt-0.5 block text-[0.55rem] uppercase tracking-[0.04em] md:text-[0.62rem] ${isDark ? "text-white/55" : "text-[var(--color-text-muted)]"}`}>
          [{parts[2]}]
        </span>
      ) : null}
    </p>
  );
}

function VerdictCell({ verdict, isDark }) {
  const status = statusConfig[verdict?.type] || statusConfig.watch;

  return (
    <div className="flex items-start gap-1.5 md:gap-2">
      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full md:h-5 md:w-5 ${status.circle}`}>
        <StatusSvg name={status.icon} className="h-2.5 w-2.5 md:h-3 md:w-3" />
      </span>
      <p
        className={`min-w-0 text-[0.65rem] font-normal leading-[1.3] md:text-[0.78rem] md:leading-[1.35] ${isDark ? "text-white/80" : "text-[var(--color-text)]"}`}
        dangerouslySetInnerHTML={{ __html: unlinkHtml(verdict?.text || "", { emphasize: false }) }}
      />
    </div>
  );
}

function MatrixRow({ row, isDark }) {
  return (
    <Link
      href={row.href || "#"}
      className={`grid grid-cols-[minmax(170px,1.15fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(170px,1.2fr)] items-center gap-2 border-b px-3 py-2.5 last:border-b-0 md:gap-3 md:px-5 md:py-3 ${
        isDark
          ? "border-[var(--color-border)] hover:bg-white/[0.03]"
          : "border-[#ececeb] hover:bg-[#fafafa]"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2 md:gap-3">
        <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded-sm md:h-11 md:w-16">
          <Image
            src={ROW_IMAGE}
            alt={row.image?.alt || stripTags(row.model)}
            fill
            className="object-contain object-center"
            sizes="64px"
          />
        </div>
        <p
          className={`min-w-0 text-[0.75rem] font-semibold leading-[1.25] md:text-[0.9rem] ${
            isDark ? "text-white" : "text-[var(--color-text)]"
          }`}
          dangerouslySetInnerHTML={{ __html: unlinkHtml(row.model) }}
        />
      </div>

      <ValueCell value={row.vehicleValue} isDark={isDark} />
      <ValueCell value={row.replacementCost} isDark={isDark} />
      <VerdictCell verdict={row.verdict} isDark={isDark} />
    </Link>
  );
}

function DecisionMatrix({ data, isDark }) {
  const columns = data.matrix?.columns || [];
  const rows = data.matrix?.rows || [];

  return (
    <div className="w-full min-w-0 max-w-full">
      <p
        className={`mb-2.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] ${
          isDark ? "text-white/70" : "text-[var(--color-text-muted)]"
        }`}
      >
        The Decision Matrix
      </p>

      <div
        className={`w-full min-w-0 max-w-full overflow-hidden rounded-xl border ${
          isDark
            ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
            : "border-[#e8e8e6] bg-white shadow-[0_8px_24px_rgba(16,18,16,0.06)]"
        }`}
      >
        <div className="w-full max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
          <div className="w-[640px] md:w-full">
            <div
              className={`grid grid-cols-[minmax(170px,1.15fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(170px,1.2fr)] gap-2 border-b px-3 py-2.5 md:gap-3 md:px-5 md:py-3 ${
                isDark ? "border-[var(--color-border)] bg-white/[0.03]" : "border-[#ececeb] bg-[#f7f7f6]"
              }`}
            >
              {columns.map((col) => {
                const isVerdict = String(col.label || "").toUpperCase() === "VERDICT";
                return (
                  <div
                    key={col.label}
                    className={`flex items-center gap-1.5 text-[0.58rem] uppercase tracking-[0.05em] md:text-[0.62rem] md:tracking-[0.06em] ${
                      isVerdict ? "font-normal" : "font-bold"
                    } ${isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}`}
                  >
                    <HomeIcon name={col.icon} isDark={isDark} className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
                    <span className="leading-tight">{col.label}</span>
                  </div>
                );
              })}
            </div>

            <div>
              {rows.map((row) => (
                <MatrixRow key={stripTags(row.model) || row.href} row={row} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleCard({ data, isDark }) {
  const rule = data.ruleOfThumb || {};

  return (
    <div
      className={`flex h-full min-h-full flex-col items-center rounded-xl border px-4 py-5 text-center md:px-4 md:py-6 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_24px_rgba(16,18,16,0.06)]"
      }`}
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full md:h-16 md:w-16 ${
          isDark ? "bg-white/10" : "bg-[#ececeb] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        }`}
      >
        <HomeIcon name="calculator" isDark={isDark} className="h-9 w-9 md:h-10 md:w-10" />
      </span>

      <p
        className={`mt-4 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {rule.title}
      </p>

      {/* Short line under title */}
      <div className={`mt-3 h-[2px] w-10 ${isDark ? "bg-white/55" : "bg-[#2a2a28]"}`} />

      <p
        className={`mt-5 max-w-[240px] text-[0.88rem] leading-[1.45] ${
          isDark ? "text-white/80" : "text-[var(--color-text)]"
        }`}
      >
        {cleanText(rule.lead)}
      </p>

      <p
        className={`mt-3 font-serif text-[2.1rem] font-semibold leading-none md:text-[2.35rem] ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {cleanText(rule.highlight)}
      </p>

      <p
        className={`mt-4 max-w-[260px] text-[0.78rem] leading-[1.45] ${
          isDark ? "text-white/70" : "text-[var(--color-text)]"
        }`}
      >
        {cleanText(rule.body)}
      </p>

      {/* Tapered bottom line — matches ref */}
      <div
        className="mt-auto w-full max-w-[220px] pt-6"
        aria-hidden="true"
      >
        <div
          className={`h-px w-full ${
            isDark
              ? "bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.55)_50%,transparent_100%)]"
              : "bg-[linear-gradient(90deg,transparent_0%,#6a6a68_50%,transparent_100%)]"
          }`}
        />
        <div
          className={`mx-auto -mt-px h-[2px] w-[55%] ${
            isDark
              ? "bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.7)_50%,transparent_100%)]"
              : "bg-[linear-gradient(90deg,transparent_0%,#3a3a38_50%,transparent_100%)]"
          }`}
        />
      </div>
    </div>
  );
}

function DeeperLinks({ links, isDark }) {
  if (!links?.length) return null;

  return (
    <div className="mt-6 md:mt-7">
      <div className="mb-2.5 flex items-center gap-2.5 md:mb-3 md:gap-3">
        <p
          className={`shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.14em] ${
            isDark ? "text-white/70" : "text-[var(--color-text-muted)]"
          }`}
        >
          Deeper Analysis Links
        </p>
        <span className={`h-px flex-1 ${isDark ? "bg-white/18" : "bg-[#d8d8d6]"}`} />
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
        {links.map((link) => {
          const title = cleanText(link.label).replace(/\s*→\s*$/, "");

          return (
            <Link
              key={link.id}
              href={link.href || "#"}
              className={`relative flex min-h-[158px] flex-col items-center rounded-xl border px-3 pb-4 pt-5 text-center transition md:px-3.5 md:pb-4 md:pt-5 ${
                isDark
                  ? "border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:border-white/25"
                  : "border-[#e8e8e6] bg-white shadow-[0_8px_22px_rgba(16,18,16,0.05)] hover:border-[var(--color-chrome)]"
              }`}
            >
              <span
                className={`pointer-events-none absolute left-3 top-2 font-serif text-[2.2rem] font-semibold leading-none ${
                  isDark ? "text-white/10" : "text-[#e4e4e2]"
                }`}
              >
                {String(link.id).padStart(2, "0")}
              </span>

              <span className="relative z-[1] mt-1">
                <HomeIcon name={link.icon || "link"} isDark={isDark} className="h-11 w-11 md:h-12 md:w-12" />
              </span>

              <h3
                className={`relative z-[1] mt-2.5 mx-auto max-w-[10rem] text-balance text-[0.82rem] font-medium leading-[1.3] md:max-w-[10.5rem] md:text-[0.86rem] ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                {title}
                {"\u00A0→"}
              </h3>

              <div className={`my-2 h-px w-10 ${isDark ? "bg-white/20" : "bg-[#d8d8d6]"}`} />

              <p
                className={`relative z-[1] text-[0.72rem] font-normal leading-[1.4] ${
                  isDark ? "text-white/65" : "text-[var(--color-text-muted)]"
                }`}
              >
                {cleanText(link.purpose)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-xl border px-3.5 py-3 md:mt-5 md:items-center md:px-4 md:py-2.5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white"
      }`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center md:h-12 md:w-12">
        <HomeIcon name="info" isDark={isDark} className="h-10 w-10 md:h-11 md:w-11" />
      </span>
      <p className={`min-w-0 flex-1 text-[0.76rem] leading-[1.45] md:text-[0.82rem] ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}>
        <strong className={isDark ? "text-white" : "text-[var(--color-text)]"}>{note.label}</strong>{" "}
        <span dangerouslySetInnerHTML={{ __html: cleanText(note.text) }} />
      </p>
    </div>
  );
}

export default function HomeSec6({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sectionBg = "bg-[var(--color-page)]";
  const headerImage = data.headerImage || {
    src: "/home-image/sec2-bg.webp",
    alt: "Jaguar ownership economics",
  };

  return (
    <section className={`overflow-x-hidden ${sectionBg}`}>
      {/* Header — same pattern as other home sections */}
      <div className={`relative overflow-hidden ${sectionBg}`}>
        <div className="absolute inset-y-0 right-0 w-[62%] md:w-[48%]">
          <Image
            src={headerImage.src}
            alt={headerImage.alt || ""}
            fill
            className="object-cover object-right"
            sizes="(max-width: 768px) 62vw, 48vw"
          />
          <div
            className={
              isDark
                ? "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(11,12,12,0.82)_34%,rgba(11,12,12,0.18)_100%)]"
                : "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(243,243,241,0.88)_34%,rgba(243,243,241,0.18)_100%)]"
            }
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-5 md:px-6 md:pb-3.5 md:pt-7 lg:px-8">
          <div className="max-w-[720px]">
            <p
              className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
              }`}
            >
              Ownership Economics
            </p>
            <h2
              className={`mt-1.5 whitespace-nowrap font-serif text-[1.65rem] font-semibold leading-[0.98] sm:text-[2rem] md:text-[2.55rem] md:leading-[0.96] lg:text-[2.75rem] ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              The Ownership{" "}
              <span className="text-[var(--color-chrome-bright)]">Economics Centre</span>
            </h2>
            <div className="mt-2.5">
              <MStripe />
            </div>
            <p
              className={`mt-2 max-w-[620px] text-[0.86rem] leading-[1.4] md:text-[0.98rem] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-8xl px-4 pb-5 pt-2 md:px-6 md:pb-6 md:pt-2.5 lg:px-8">
        {/* Matrix + Rule of Thumb */}
        <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,270px)] md:items-stretch md:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(230px,280px)]">
          <DecisionMatrix data={data} isDark={isDark} />
          <div className="flex min-h-0 flex-col">
            <div className="mb-2.5 hidden h-[0.68rem] md:block" aria-hidden="true" />
            <div className="flex min-h-0 flex-1 flex-col">
              <RuleCard data={data} isDark={isDark} />
            </div>
          </div>
        </div>

        <DeeperLinks links={data.deeperLinks} isDark={isDark} />
        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
