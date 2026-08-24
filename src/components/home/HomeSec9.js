"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const ENGINE_IMAGE = "/engine.webp";
const ICON_LG = "h-10 w-10 md:h-11 md:w-11";

const severityStyle = {
  catastrophic: { dot: "bg-[#ed1c24]", text: "text-[#ed1c24]" },
  immediate: { dot: "bg-[#ff7900]", text: "text-[#e06a00]" },
  monitor: { dot: "bg-[#f6b800]", text: "text-[#c77700]" },
  low: { dot: "bg-[#20a84a]", text: "text-[#1c8b3d]" },
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

function SeverityBadge({ severity, isDark }) {
  const style = severityStyle[severity?.type] || severityStyle.monitor;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.04em] ${style.text}`}>
      <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
      {severity?.label}
    </span>
  );
}

function CategoryLabel({ title, icon, isDark }) {
  return (
    <div className="mb-2 flex items-center gap-2 md:mb-2.5">
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
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-xl border ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_20px_rgba(16,18,16,0.04)]"
      }`}
    >
      <span
        className={`pointer-events-none absolute left-3 top-2 font-serif text-[1.4rem] font-semibold leading-none ${
          isDark ? "text-white/12" : "text-[#e0e0de]"
        }`}
      >
        {row.id}
      </span>

      <div className="relative mx-auto mt-7 h-[88px] w-full max-w-[160px] md:mt-8 md:h-[100px]">
        <Image
          src={ENGINE_IMAGE}
          alt=""
          fill
          className="object-contain object-center"
          sizes="160px"
        />
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-2 md:px-4 md:pb-4">
        <h3
          className={`text-[0.88rem] font-bold leading-tight md:text-[0.92rem] ${
            isDark ? "text-white" : "text-black"
          }`}
          dangerouslySetInnerHTML={{ __html: unlinkHtml(row.title) }}
        />
        <p
          className={`mt-1.5 text-[0.74rem] leading-[1.35] md:text-[0.76rem] ${
            isDark ? "text-white/65" : "text-[var(--color-text-muted)]"
          }`}
          dangerouslySetInnerHTML={{ __html: unlinkHtml(row.description) }}
        />

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <SeverityBadge severity={row.severity} isDark={isDark} />
          <Link
            href={row.link?.href || "#"}
            className={`shrink-0 text-[0.76rem] font-semibold md:text-[0.8rem] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {(row.link?.label || "Read more").replace(/\s*→\s*$/, "")} →
          </Link>
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
        className={`w-4 shrink-0 text-[0.9rem] font-bold leading-none md:w-5 md:text-[1rem] ${
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
          className={`text-[0.8rem] font-bold leading-tight md:text-[0.84rem] ${
            isDark ? "text-white" : "text-black"
          }`}
          dangerouslySetInnerHTML={{ __html: unlinkHtml(row.title) }}
        />
        <p
          className={`mt-0.5 text-[0.7rem] leading-[1.3] md:text-[0.72rem] ${
            isDark ? "text-white/60" : "text-[var(--color-text-muted)]"
          }`}
          dangerouslySetInnerHTML={{ __html: unlinkHtml(row.description) }}
        />
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5 pl-1">
        <SeverityBadge severity={row.severity} isDark={isDark} />
        <Link
          href={row.link?.href || "#"}
          className={`text-[0.7rem] font-semibold md:text-[0.74rem] ${
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
    <div
      className={`rounded-xl border px-3 py-3 md:px-3.5 md:py-3.5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_20px_rgba(16,18,16,0.04)]"
      }`}
    >
      <CategoryLabel title={block.title} icon={block.icon} isDark={isDark} />
      <div>
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

        <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-5 md:px-6 md:pb-3.5 md:pt-7 lg:px-8">
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
              className={`mt-2 max-w-[540px] text-[0.86rem] leading-[1.4] md:text-[0.95rem] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-8xl px-4 pb-5 pt-2 md:px-6 md:pb-6 md:pt-2.5 lg:px-8">
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
        <div className="mt-4 grid gap-2.5 md:mt-4 md:grid-cols-3 md:gap-3">
          {columns.map((block) => (
            <FailureColumn key={block.title} block={block} isDark={isDark} />
          ))}
        </div>

        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
