"use client";

import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const riskDot = {
  catastrophic: "bg-[#ed1c24]",
  immediate: "bg-[#ff7900]",
  monitor: "bg-[#f6b800]",
};

function cleanText(value = "") {
  return String(value || "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .trim();
}

function stripTags(value = "") {
  return cleanText(value).replace(/<[^>]*>/g, "").trim();
}

function unlinkHtml(value = "") {
  return cleanText(value).replace(
    /<a\b[^>]*>([\s\S]*?)<\/a>/gi,
    '<span class="font-semibold text-[var(--color-chrome-bright)]">$1</span>'
  );
}

function ChevronIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function PinIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function VerifiedPill({ tag, isDark }) {
  if (!tag) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.04em] ${
        isDark ? "bg-white/10 text-white/70" : "bg-[#ececeb] text-[#6a6a68]"
      }`}
    >
      {tag}
    </span>
  );
}

function PanelFooter({ footer, isDark }) {
  if (!footer?.label) return null;
  return (
    <div className={`border-t px-4 py-3 md:px-5 ${isDark ? "border-[var(--color-border)]" : "border-[#ececeb]"}`}>
      <Link
        href={footer.href || "#"}
        className={`inline-flex items-center gap-1.5 text-[0.8rem] font-semibold ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        <span>{footer.label}</span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

function PanelTitle({ block, isDark, trailing = null }) {
  return (
    <div className={`flex items-center gap-3 border-b px-4 py-3.5 md:px-5 ${isDark ? "border-[var(--color-border)]" : "border-[#ececeb]"}`}>
      <span className="shrink-0">
        <HomeIcon name={block.icon} isDark={isDark} className="h-10 w-10 md:h-11 md:w-11" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className={`text-[0.82rem] font-bold uppercase tracking-[0.04em] md:text-[0.88rem] ${isDark ? "text-white" : "text-black"}`}>
          {block.title}
        </h3>
        {block.subtitle ? (
          <p className={`mt-0.5 text-[0.72rem] ${isDark ? "text-white/60" : "text-[var(--color-text-muted)]"}`}>
            {block.subtitle}
          </p>
        ) : null}
      </div>
      {trailing}
    </div>
  );
}

function DataPanel({ children, block, isDark, className = "", trailing = null }) {
  return (
    <section
      className={`flex h-full flex-col overflow-hidden rounded-xl border ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_24px_rgba(16,18,16,0.05)]"
      } ${className}`}
    >
      <PanelTitle block={block} isDark={isDark} trailing={trailing} />
      <div className="min-w-0 flex-1 overflow-x-auto">{children}</div>
      <PanelFooter footer={block.footer} isDark={isDark} />
    </section>
  );
}

function EnginesTable({ data, isDark }) {
  return (
    <div className="min-w-[480px] md:min-w-0">
      <div
        className={`grid grid-cols-[44px_minmax(110px,1.1fr)_minmax(100px,1fr)_minmax(110px,1fr)] gap-2 border-b px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.04em] md:px-5 ${
          isDark ? "border-[var(--color-border)] text-white/55" : "border-[#ececeb] text-[var(--color-text-muted)]"
        }`}
      >
        {data.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {data.rows.map((row) => (
        <div
          key={stripTags(row.code) || row.rank}
          className={`grid grid-cols-[44px_minmax(110px,1.1fr)_minmax(100px,1fr)_minmax(110px,1fr)] items-center gap-2 border-b px-4 py-2.5 text-[0.8rem] last:border-b-0 md:px-5 md:text-[0.84rem] ${
            isDark ? "border-[var(--color-border)]" : "border-[#ececeb]"
          }`}
        >
          <span className={`text-center font-bold ${isDark ? "text-white" : "text-black"}`}>{row.rank}</span>
          <span
            className={`font-semibold leading-snug ${isDark ? "text-white" : "text-black"}`}
            dangerouslySetInnerHTML={{ __html: unlinkHtml(row.code) }}
          />
          <span className={`leading-snug ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>{row.label}</span>
          <span className="flex flex-wrap items-center gap-1.5">
            <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{row.enquiries}</span>
            <VerifiedPill tag={row.tag} isDark={isDark} />
          </span>
        </div>
      ))}
    </div>
  );
}

function ModelsTable({ data, isDark }) {
  return (
    <div className="min-w-[320px] md:min-w-0">
      <div
        className={`grid grid-cols-[44px_1fr_minmax(110px,0.9fr)] gap-2 border-b px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.04em] md:px-5 ${
          isDark ? "border-[var(--color-border)] text-white/55" : "border-[#ececeb] text-[var(--color-text-muted)]"
        }`}
      >
        {data.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {data.rows.map((row) => (
        <div
          key={row.model}
          className={`grid grid-cols-[44px_1fr_minmax(110px,0.9fr)] items-center gap-2 border-b px-4 py-2.5 text-[0.8rem] last:border-b-0 md:px-5 md:text-[0.84rem] ${
            isDark ? "border-[var(--color-border)]" : "border-[#ececeb]"
          }`}
        >
          <span className={`text-center font-bold ${isDark ? "text-white" : "text-black"}`}>{row.rank}</span>
          <span className={isDark ? "text-white" : "text-black"}>{row.model}</span>
          <span className="flex flex-wrap items-center gap-1.5">
            <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{row.enquiries}</span>
            <VerifiedPill tag={row.tag} isDark={isDark} />
          </span>
        </div>
      ))}
    </div>
  );
}

function CostsTable({ data, isDark }) {
  return (
    <div className="min-w-[280px] md:min-w-0">
      <div
        className={`grid grid-cols-[1fr_1fr] gap-2 border-b px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.04em] md:px-5 ${
          isDark ? "border-[var(--color-border)] text-white/55" : "border-[#ececeb] text-[var(--color-text-muted)]"
        }`}
      >
        {data.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {data.rows.map((row) => (
        <div
          key={row.code}
          className={`grid grid-cols-[1fr_1fr] items-center gap-2 border-b px-4 py-2.5 text-[0.8rem] last:border-b-0 md:px-5 md:text-[0.84rem] ${
            isDark ? "border-[var(--color-border)]" : "border-[#ececeb]"
          }`}
        >
          <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{row.code}</span>
          <span className={isDark ? "text-white/85" : "text-[var(--color-text)]"}>{cleanText(row.cost)}</span>
        </div>
      ))}
    </div>
  );
}

function FailuresTable({ data, isDark }) {
  return (
    <div className="min-w-[520px] md:min-w-0">
      <div
        className={`grid grid-cols-[minmax(180px,1.3fr)_minmax(110px,0.7fr)_minmax(160px,1fr)] gap-2 border-b px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.04em] md:px-5 ${
          isDark ? "border-[var(--color-border)] text-white/55" : "border-[#ececeb] text-[var(--color-text-muted)]"
        }`}
      >
        {data.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {data.rows.map((row) => {
        const type = row.risk?.type || "monitor";
        return (
          <div
            key={stripTags(row.failure)}
            className={`grid grid-cols-[minmax(180px,1.3fr)_minmax(110px,0.7fr)_minmax(160px,1fr)] items-center gap-2 border-b px-4 py-3 text-[0.8rem] last:border-b-0 md:px-5 md:text-[0.84rem] ${
              isDark ? "border-[var(--color-border)]" : "border-[#ececeb]"
            }`}
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <span
                className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:h-12 md:w-12 ${
                  isDark ? "bg-white/10" : "bg-[#ececeb]"
                }`}
              >
                <HomeIcon name={row.icon || "engine"} isDark={false} className="h-7 w-7 md:h-8 md:w-8" />
              </span>
              <span
                className={`min-w-0 font-semibold leading-snug ${isDark ? "text-white" : "text-black"}`}
                dangerouslySetInnerHTML={{ __html: unlinkHtml(row.failure) }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 shrink-0 rounded-full ${riskDot[type] || riskDot.monitor}`} />
              <span className={`font-medium ${isDark ? "text-white/85" : "text-[var(--color-text)]"}`}>
                {row.risk?.label}
              </span>
            </div>
            <span className={`leading-snug ${isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}`}>
              {row.note}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FeedTable({ data, isDark }) {
  return (
    <div className="min-w-[520px] md:min-w-0">
      <div
        className={`grid grid-cols-[minmax(120px,1.1fr)_minmax(90px,0.8fr)_minmax(120px,1.1fr)_minmax(90px,0.7fr)] gap-2 border-b px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.04em] md:px-5 ${
          isDark ? "border-[var(--color-border)] text-white/55" : "border-[#ececeb] text-[var(--color-text-muted)]"
        }`}
      >
        {data.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {data.rows.map((row) => (
        <div
          key={`${row.vehicle}-${row.timestamp}`}
          className={`grid grid-cols-[minmax(120px,1.1fr)_minmax(90px,0.8fr)_minmax(120px,1.1fr)_minmax(90px,0.7fr)] items-center gap-2 border-b px-4 py-2.5 text-[0.78rem] last:border-b-0 md:px-5 md:text-[0.82rem] ${
            isDark ? "border-[var(--color-border)]" : "border-[#ececeb]"
          }`}
        >
          <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{row.vehicle}</span>
          <span className={`inline-flex items-center gap-1 ${isDark ? "text-white/75" : "text-[var(--color-text)]"}`}>
            <PinIcon className={`h-3.5 w-3.5 shrink-0 ${isDark ? "text-white/55" : "text-[#8a8a88]"}`} />
            {row.location}
          </span>
          <span className={isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}>{row.issue}</span>
          <span className={isDark ? "text-white/55" : "text-[var(--color-text-muted)]"}>{row.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

function LiveBadge({ text, isDark }) {
  if (!text) return null;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 text-[0.68rem] font-medium ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
      <span className="h-2 w-2 rounded-full bg-[#f6a21a]" />
      {text}
    </span>
  );
}

function MobileAccordion({ block, children, isDark, trailing = null }) {
  return (
    <details
      className={`group overflow-hidden rounded-xl border ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_24px_rgba(16,18,16,0.05)]"
      }`}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 marker:hidden md:px-5">
        <span className="shrink-0">
          <HomeIcon name={block.icon} isDark={isDark} className="h-10 w-10" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={`text-[0.82rem] font-bold uppercase tracking-[0.04em] ${isDark ? "text-white" : "text-black"}`}>
            {block.title}
          </h3>
          {block.subtitle ? (
            <p className={`mt-0.5 text-[0.72rem] ${isDark ? "text-white/60" : "text-[var(--color-text-muted)]"}`}>
              {block.subtitle}
            </p>
          ) : null}
        </div>
        {trailing}
        <ChevronIcon className={`h-5 w-5 shrink-0 transition-transform group-open:rotate-180 ${isDark ? "text-white/60" : "text-[#8a8a88]"}`} />
      </summary>
      <div className={`border-t overflow-x-auto ${isDark ? "border-[var(--color-border)]" : "border-[#ececeb]"}`}>
        {children}
      </div>
      <PanelFooter footer={block.footer} isDark={isDark} />
    </details>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;
  return (
    <div
      className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3.5 md:mt-6 md:items-center md:px-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-[#f3f3f2]"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
        <HomeIcon name="info" isDark={isDark} className="h-10 w-10 md:h-11 md:w-11" />
      </span>
      <p className={`min-w-0 flex-1 text-[0.76rem] leading-[1.45] md:text-[0.82rem] ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}>
        <strong className={isDark ? "text-white" : "text-black"}>{note.label}</strong>{" "}
        <span dangerouslySetInnerHTML={{ __html: cleanText(note.text) }} />
      </p>
    </div>
  );
}

export default function HomeSec10({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`overflow-x-hidden ${isDark ? "bg-[var(--color-page)]" : "bg-[#f8f8f7]"}`}>
      <div className="mx-auto w-full min-w-0 max-w-8xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
        {/* Centered header */}
        <div className="mx-auto max-w-[720px] text-center">
          <h2
            className={`font-serif text-[2rem] font-semibold leading-[1.05] md:text-[2.75rem] md:leading-[1.02] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Jaguar Market Intelligence
          </h2>
          <p
            className={`mx-auto mt-3 max-w-[640px] text-[0.88rem] leading-[1.5] md:mt-4 md:text-[0.98rem] ${
              isDark ? "text-white/75" : "text-[var(--color-text-muted)]"
            }`}
            dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }}
          />
          <div className={`mx-auto mt-4 h-px w-14 md:mt-5 ${isDark ? "bg-white/25" : "bg-[#cfcfcd]"}`} />
        </div>

        {/* Desktop: 3 + 2 card grid */}
        <div className="mt-8 hidden gap-4 md:mt-10 md:grid md:grid-cols-3">
          <DataPanel block={data.engines} isDark={isDark}>
            <EnginesTable data={data.engines} isDark={isDark} />
          </DataPanel>
          <DataPanel block={data.models} isDark={isDark}>
            <ModelsTable data={data.models} isDark={isDark} />
          </DataPanel>
          <DataPanel block={data.replacementCosts} isDark={isDark}>
            <CostsTable data={data.replacementCosts} isDark={isDark} />
          </DataPanel>
        </div>

        <div className="mt-4 hidden gap-4 md:grid md:grid-cols-2">
          <DataPanel block={data.failures} isDark={isDark}>
            <FailuresTable data={data.failures} isDark={isDark} />
          </DataPanel>
          <DataPanel
            block={data.liveFeed}
            isDark={isDark}
            trailing={<LiveBadge text={data.liveFeed?.liveBadge} isDark={isDark} />}
          >
            <FeedTable data={data.liveFeed} isDark={isDark} />
          </DataPanel>
        </div>

        {/* Mobile: keep existing accordion pattern for top 3; panels for failures + live feed */}
        <div className="mt-8 grid gap-3 md:hidden">
          <MobileAccordion block={data.engines} isDark={isDark}>
            <EnginesTable data={data.engines} isDark={isDark} />
          </MobileAccordion>
          <MobileAccordion block={data.models} isDark={isDark}>
            <ModelsTable data={data.models} isDark={isDark} />
          </MobileAccordion>
          <MobileAccordion block={data.replacementCosts} isDark={isDark}>
            <CostsTable data={data.replacementCosts} isDark={isDark} />
          </MobileAccordion>

          <DataPanel block={data.failures} isDark={isDark} className="mt-1">
            <FailuresTable data={data.failures} isDark={isDark} />
          </DataPanel>
          <DataPanel
            block={data.liveFeed}
            isDark={isDark}
            trailing={<LiveBadge text={data.liveFeed?.liveBadge} isDark={isDark} />}
          >
            <FeedTable data={data.liveFeed} isDark={isDark} />
          </DataPanel>
        </div>

        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
