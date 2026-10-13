"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const ENGINE_IMAGE = "/engine.webp";
const ICON_LG = "h-10 w-10 md:h-11 md:w-11";

const severityStyle = {
  catastrophic: {
    dot: "bg-[#ed1c24]",
    text: "text-[#ed1c24]",
    pill: "border-[#f7c8cc] bg-[#fff0f1] text-[#c42430]",
    darkPill: "border-[rgba(255,90,100,0.34)] bg-[rgba(255,45,53,0.14)] text-[#ff9aa0]",
  },
  immediate: {
    dot: "bg-[#ff7900]",
    text: "text-[#e06a00]",
    pill: "border-[#f5d4ad] bg-[#fff6ea] text-[#d97810]",
    darkPill: "border-[rgba(246,161,73,0.34)] bg-[rgba(246,161,73,0.14)] text-[#ffba6c]",
  },
  monitor: {
    dot: "bg-[#f6b800]",
    text: "text-[#c77700]",
    pill: "border-[#ecd7a7] bg-[#fff9ea] text-[#9c6a00]",
    darkPill: "border-[rgba(222,177,65,0.34)] bg-[rgba(222,177,65,0.13)] text-[#ffd473]",
  },
  low: {
    dot: "bg-[#20a84a]",
    text: "text-[#1c8b3d]",
    pill: "border-[#cce7d7] bg-[#eefaf3] text-[#17824f]",
    darkPill: "border-[rgba(77,198,124,0.34)] bg-[rgba(24,148,84,0.13)] text-[#74d7a1]",
  },
};

function cleanText(value = "") {
  return String(value || "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .trim();
}

function unlinkHtml(value = "") {
  return cleanText(value).replace(
    /<a\b[^>]*>([\s\S]*?)<\/a>/gi,
    '<span class="font-semibold text-[var(--color-chrome-bright)]">$1</span>'
  );
}

function SeverityBadge({ severity, isDark, variant = "plain" }) {
  const style = severityStyle[severity?.type] || severityStyle.monitor;

  if (variant === "pill") {
    return (
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.04em] ${
          isDark ? style.darkPill : style.pill
        }`}
      >
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
        {severity?.label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.04em] ${style.text}`}>
      <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
      {severity?.label}
    </span>
  );
}

function CategoryLabel({ title, icon, isDark }) {
  return (
    <div className="mb-1 flex items-center gap-1.5 md:mb-1.5 md:gap-2">
      <HomeIcon name={icon} isDark={isDark} className={ICON_LG} />
      <p
        className={`text-[0.68rem] font-bold uppercase tracking-[0.12em] ${
          isDark ? "text-white/70" : "text-[var(--color-text-muted)]"
        }`}
      >
        {title}
      </p>
    </div>
  );
}

function EngineCard({ row, isDark }) {
  const linkLabel = (row.link?.label || "Read more").replace(/\s*→\s*$/, "");

  return (
    <article
      className={`relative overflow-hidden rounded-lg border md:flex md:h-full md:flex-col md:rounded-xl ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_20px_rgba(16,18,16,0.04)]"
      }`}
    >
      {/* Mobile: horizontal ref layout */}
      <div className="flex gap-3 p-3 md:hidden">
        <span
          className={`absolute left-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full text-[0.7rem] font-bold ${
            isDark ? "bg-white/12 text-white/80" : "bg-[#ececeb] text-[#5c5c5a]"
          }`}
        >
          {row.id}
        </span>

        <div className="relative mt-5 h-[92px] w-[88px] shrink-0">
          <Image
            src={ENGINE_IMAGE}
            alt=""
            fill
            className="object-contain object-center"
            sizes="88px"
          />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`min-w-0 flex-1 text-[0.88rem] font-bold leading-tight ${
                isDark ? "text-white" : "text-black"
              }`}
              dangerouslySetInnerHTML={{ __html: unlinkHtml(row.title) }}
            />
            <SeverityBadge severity={row.severity} isDark={isDark} variant="pill" />
          </div>

          <p
            className={`mt-1.5 text-[0.72rem] font-normal leading-[1.35] ${
              isDark ? "text-white/65" : "text-[var(--color-text-muted)]"
            }`}
            dangerouslySetInnerHTML={{ __html: unlinkHtml(row.description) }}
          />

          <div className="mt-2.5 flex justify-end">
            <Link
              href={row.link?.href || "#"}
              className={`text-[0.76rem] font-semibold ${isDark ? "text-white" : "text-black"}`}
            >
              {linkLabel} →
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop: vertical card (unchanged) */}
      <div className="hidden h-full flex-col md:flex">
        <span
          className={`pointer-events-none absolute left-3 top-2 font-heading text-[1.4rem] font-semibold leading-none ${
            isDark ? "text-white/12" : "text-[#e0e0de]"
          }`}
        >
          {row.id}
        </span>

        <div className="relative mx-auto mt-8 h-[100px] w-full max-w-[160px]">
          <Image
            src={ENGINE_IMAGE}
            alt=""
            fill
            className="object-contain object-center"
            sizes="160px"
          />
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
          <h3
            className={`text-[0.92rem] font-bold leading-tight ${isDark ? "text-white" : "text-black"}`}
            dangerouslySetInnerHTML={{ __html: unlinkHtml(row.title) }}
          />
          <p
            className={`mt-1.5 text-[0.76rem] leading-[1.35] ${
              isDark ? "text-white/65" : "text-[var(--color-text-muted)]"
            }`}
            dangerouslySetInnerHTML={{ __html: unlinkHtml(row.description) }}
          />

          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <SeverityBadge severity={row.severity} isDark={isDark} />
            <Link
              href={row.link?.href || "#"}
              className={`shrink-0 text-[0.8rem] font-semibold ${isDark ? "text-white" : "text-black"}`}
            >
              {linkLabel} →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function FailureListItem({ row, isDark }) {
  return (
    <div
      className={`flex items-center gap-2.5 border-b py-2.5 last:border-b-0 md:gap-3 md:py-3 ${
        isDark ? "border-[var(--color-border)]" : "border-[#ececeb]"
      }`}
    >
      <span
        className={`w-4 shrink-0 font-heading text-[0.9rem] font-bold leading-none md:w-5 md:text-[1rem] ${
          isDark ? "text-white/45" : "text-[#c8c8c6]"
        }`}
      >
        {row.id}
      </span>

      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md md:h-12 md:w-12">
        <Image
          src={ENGINE_IMAGE}
          alt=""
          fill
          className="object-contain object-center"
          sizes="48px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[0.88rem] font-bold leading-tight ${
            isDark ? "text-white" : "text-black"
          }`}
          dangerouslySetInnerHTML={{ __html: unlinkHtml(row.title) }}
        />
        <p
          className={`mt-1.5 text-[0.72rem] font-normal leading-[1.35] ${
            isDark ? "text-white/65" : "text-[var(--color-text-muted)]"
          }`}
          dangerouslySetInnerHTML={{ __html: unlinkHtml(row.description) }}
        />
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5 pl-1">
        <SeverityBadge severity={row.severity} isDark={isDark} variant="pill" />
        <Link
          href={row.link?.href || "#"}
          className={`text-[0.76rem] font-semibold ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {(row.link?.label || "Read more").replace(/\s*→\s*$/, "")} →
        </Link>
      </div>
    </div>
  );
}

function FailureColumn({ block, isDark }) {
  if (!block?.rows?.length) return null;

  return (
    <div>
      <CategoryLabel title={block.title} icon={block.icon} isDark={isDark} />
      <div
        className={`rounded-xl border px-3 py-1.5 md:px-3.5 md:py-2 ${
          isDark
            ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
            : "border-[#e8e8e6] bg-white shadow-[0_8px_20px_rgba(16,18,16,0.04)]"
        }`}
      >
        {block.rows.map((row) => (
          <FailureListItem key={`${block.title}-${row.id}`} row={row} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}

function NoteWithBadge({ text, badge, isDark }) {
  const cleaned = cleanText(text);
  const marker = badge ? `[${badge}]` : null;
  const parts = marker && cleaned.includes(marker) ? cleaned.split(marker) : [cleaned];

  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 ? (
            <span
              className={`mx-1 inline-flex translate-y-[-1px] items-center rounded border px-1.5 py-[1px] text-[0.58rem] font-bold uppercase tracking-[0.06em] ${
                isDark
                  ? "border-white/25 bg-white/5 text-white/80"
                  : "border-[#d0d0ce] bg-white text-[var(--color-text-muted)]"
              }`}
            >
              {badge}
            </span>
          ) : null}
        </span>
      ))}
    </>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-3 flex items-center gap-2.5 rounded-xl border px-3 py-2.5 md:mt-3.5 md:px-3.5 md:py-2.5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-[#f3f3f2]"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center md:h-10 md:w-10">
        <HomeIcon name="info" isDark={isDark} className={ICON_LG} />
      </span>
      <p className={`min-w-0 text-[0.72rem] leading-[1.35] md:text-[0.76rem] ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
        <strong className={isDark ? "text-white" : "text-black"}>{note.label}</strong>{" "}
        <NoteWithBadge text={note.text} badge={note.badge} isDark={isDark} />
      </p>
    </div>
  );
}

export default function HomeSec9({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headerImage = data.headerImage || {
    src: "/home-image/sec2-bg.webp",
    alt: "Jaguar failure database",
  };
  const engine = data.engineFailures;
  const columns = [data.suspensionFailures, data.drivetrainFailures, data.electricalFailures].filter(Boolean);
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[#ececea]";

  return (
    <section className={`overflow-x-hidden ${sectionBg}`}>
      {/* Header — same pattern as Sec2/Sec3 */}
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
                : "absolute inset-0 bg-[linear-gradient(90deg,#ececea_0%,rgba(236,236,234,0.88)_34%,rgba(236,236,234,0.18)_100%)]"
            }
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-4 pt-5 pb-4 md:px-6 md:pt-7 md:pb-5 lg:px-8">
          <div className="max-w-[620px]">
            <p
              className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
              }`}
            >
              Failure Database
            </p>
            <h2
              className={`mt-1.5 text-[2rem] font-bold leading-[0.98] md:text-[2.75rem] md:leading-[0.96] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              The Jaguar{" "}
              <span className="text-[var(--color-chrome-bright)]">Failure Database</span>
            </h2>
            <div className="mt-2.5">
              <MStripe />
            </div>
            <p
              className={`mt-1.5 max-w-[540px] text-[0.86rem] leading-[1.4] md:text-[0.95rem] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-8xl px-4 pt-1 pb-5 md:px-6 md:pt-1.5 md:pb-6 lg:px-8">
        {/* Engine failures — 4 cards */}
        {engine?.rows?.length ? (
          <div>
            <CategoryLabel title={engine.title} icon={engine.icon} isDark={isDark} />
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
              {engine.rows.map((row) => (
                <EngineCard key={row.id} row={row} isDark={isDark} />
              ))}
            </div>
          </div>
        ) : null}

        {/* Suspension / Drivetrain / Electrical */}
        <div className="mt-3 grid gap-2 md:mt-3 md:grid-cols-3 md:gap-2.5">
          {columns.map((block) => (
            <FailureColumn key={block.title} block={block} isDark={isDark} />
          ))}
        </div>

        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
