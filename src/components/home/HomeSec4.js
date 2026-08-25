"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const rankingIcons = ["engine", "car", "tag", "flame", "shield", "warning", "best-family", "long-term"];

// Soft / muted verdict colours (day)
const verdictStyles = {
  best: "border-[#d8e6dc] bg-[#f4f8f5] text-[#4d8f66]",
  safe: "border-[#d8e6dc] bg-[#f4f8f5] text-[#4d8f66]",
  avoid: "border-[#e8d6d8] bg-[#f9f4f4] text-[#a15c62]",
  watch: "border-[#e8dece] bg-[#f9f6f1] text-[#a07a45]",
  family: "border-[#d8e2ef] bg-[#f4f7fb] text-[#5a7eb0]",
};

// Soft muted badges for dark theme (light-on-dark tints)
const verdictStylesDark = {
  best: "border-white/12 bg-[#1c2420] text-[#8fb89a]",
  safe: "border-white/12 bg-[#1c2420] text-[#8fb89a]",
  avoid: "border-white/12 bg-[#261c1e] text-[#c49a9e]",
  watch: "border-white/12 bg-[#262218] text-[#c4ae86]",
  family: "border-white/12 bg-[#1c2228] text-[#9aafc8]",
};

const categoryColors = {
  best: "text-[#4d8f66]",
  safe: "text-[#4d8f66]",
  avoid: "text-[#a15c62]",
  watch: "text-[#a07a45]",
  family: "text-[#5a7eb0]",
};

function resolveIcon(row, index) {
  if (typeof row.icon === "string" && /^[a-z0-9-]+$/i.test(row.icon)) return row.icon;
  return rankingIcons[index] || "engine";
}

function resolveVerdictIcon(verdict) {
  if (verdict.type === "best") return "top-choice";
  if (verdict.type === "safe") return "safe-buy";
  if (verdict.type === "avoid") return "check-watch";
  if (verdict.type === "watch") return "check-watch";
  return "top-choice";
}

function VerdictBadge({ verdict, fullWidth = false }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const iconName = resolveVerdictIcon(verdict);
  const styles = isDark ? verdictStylesDark : verdictStyles;

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold md:min-w-[96px] md:gap-1.5 md:rounded-md md:px-2.5 md:py-1.5 md:text-[0.78rem] ${
        fullWidth ? "w-full" : ""
      } ${styles[verdict.type] || styles.best}`}
    >
      <HomeIcon name={iconName} isDark={isDark} className="h-8 w-8 md:h-9 md:w-9" />
      <span>{verdict.text}</span>
    </span>
  );
}

/** Ranking-column icon: day = black on silver circle; night = silver on dark circle */
function RankingIcon({ row, index, isDark }) {
  const iconName = resolveIcon(row, index);

  return (
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full md:h-14 md:w-14 ${
        isDark ? "bg-[#1a1a1a] ring-1 ring-white/15" : "bg-[#d8d8d6]"
      }`}
    >
      <HomeIcon name={iconName} isDark={isDark} className="h-8 w-8 md:h-9 md:w-9" />
    </span>
  );
}

function ColRule({ isDark }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute right-0 top-1/2 h-4 w-px -translate-y-1/2 md:h-5 ${
        isDark ? "bg-white/25" : "bg-[#cfcfcb]"
      }`}
    />
  );
}

function RankingRow({ row, index, isDark }) {
  return (
    <div
      className={`relative grid grid-cols-[minmax(260px,1.15fr)_minmax(150px,0.7fr)_minmax(0,2fr)_minmax(110px,120px)] items-center border-b last:border-b-0 ${
        isDark
          ? "border-[var(--color-border)] text-white hover:bg-white/[0.03]"
          : "border-[#e8e8e6] text-[var(--color-text)] hover:bg-black/[0.015]"
      }`}
    >
      {row.href ? (
        <Link href={row.href} className="absolute inset-0 z-0" aria-label={row.ranking}>
          <span className="sr-only">{row.ranking}</span>
        </Link>
      ) : null}

      <div className="relative z-10 pointer-events-none flex min-w-0 items-center gap-3 px-4 py-2.5 md:gap-3.5 md:px-5 md:py-2.5">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-bold ${
            isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
          }`}
        >
          {index + 1}
        </span>
        <RankingIcon row={row} index={index} isDark={isDark} />
        <span className="text-[0.72rem] font-bold uppercase tracking-[0.04em]">{row.ranking}</span>
        <ColRule isDark={isDark} />
      </div>

      <div className="relative z-10 pointer-events-none min-w-0 px-3 py-2.5 md:px-4">
        <span className="block text-[0.88rem] font-bold leading-tight md:text-[0.92rem]">{row.winner}</span>
        {row.winnerNote ? (
          <span
            className={`mt-0.5 block text-[0.74rem] leading-[1.25] ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}
            dangerouslySetInnerHTML={{ __html: row.winnerNote }}
          />
        ) : null}
        <ColRule isDark={isDark} />
      </div>

      <div
        className={`relative z-10 min-w-0 px-3 py-2.5 text-[0.8rem] font-normal leading-[1.35] md:px-4 md:text-[0.84rem] ${
          isDark ? "text-white/78" : "text-[var(--color-text-muted)]"
        }`}
      >
        <span className="font-normal" dangerouslySetInnerHTML={{ __html: row.why }} />
        <ColRule isDark={isDark} />
      </div>

      <div className="relative z-10 pointer-events-none flex justify-center px-2 py-2.5 md:px-3">
        <VerdictBadge verdict={row.verdict} />
      </div>
    </div>
  );
}

function MobileRankingCard({ row, index, isDark }) {
  const rank = String(index + 1).padStart(2, "0");
  const categoryColor = categoryColors[row.verdict.type] || categoryColors.best;
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-[3px] text-[0.64rem] font-bold ${
            isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
          }`}
        >
          {rank}
        </span>
        <span className={`max-w-[68%] text-right text-[0.58rem] font-bold uppercase leading-[1.15] tracking-[0.04em] ${categoryColor}`}>
          {row.ranking}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2.5">
        <RankingIcon row={row} index={index} isDark={isDark} />
        <h3 className={`min-w-0 flex-1 text-[0.82rem] font-bold leading-[1.2] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
          {row.winner}
        </h3>
      </div>

      <div
        className={`mt-1.5 flex-1 text-[0.68rem] font-normal leading-[1.3] ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}
        dangerouslySetInnerHTML={{ __html: row.why }}
      />

      <div className="mt-auto pt-2">
        <VerdictBadge verdict={row.verdict} fullWidth />
      </div>
    </>
  );

  const cardClass = `flex h-full flex-col rounded-lg border p-2.5 ${
    isDark
      ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
      : "border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_4px_12px_rgba(16,18,16,0.06)]"
  }`;

  if (row.href) {
    return (
      <Link href={row.href} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <article className={cardClass}>{content}</article>;
}

function DataNote({ dataSources, isDark }) {
  if (!dataSources) return null;
  const summary =
    dataSources.note ||
    (dataSources.rows || [])
      .map((row) => row.claim)
      .filter(Boolean)
      .slice(0, 2)
      .join(" ");

  return (
    <div
      className={`mt-3 rounded-xl border px-3 py-2.5 md:mt-4 md:px-3.5 md:py-2.5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white"
      }`}
    >
      <div className="flex items-center gap-2 md:gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center md:h-10 md:w-10">
          <HomeIcon name="info" isDark={isDark} className="h-8 w-8 md:h-9 md:w-9" />
        </span>
        <p className={`text-[0.78rem] font-bold leading-none md:text-[0.82rem] ${isDark ? "text-white" : "text-black"}`}>
          {dataSources.title || "Data Note :"}
        </p>
      </div>
      <p className={`mt-1.5 text-[0.72rem] font-normal leading-[1.35] md:mt-1 md:pl-[2.625rem] md:text-[0.76rem] ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
        {summary || "Rankings are drawn from live UK enquiry data and specialist-verified failure patterns."}
      </p>
    </div>
  );
}

export default function HomeSec4({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const heroImage =
    (isDark ? data.heroImages?.dark : data.heroImages?.light) ||
    data.headerImage || {
      src: "/home-image/sec2-bg.webp",
      alt: "Jaguar ownership rankings",
    };
  const rankings = data.rankings || [];

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)]">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-[58%] md:w-[46%]">
          <Image
            src={heroImage.src}
            alt={heroImage.alt || ""}
            fill
            className="object-cover object-right"
            sizes="(max-width: 768px) 58vw, 46vw"
          />
          <div
            className={
              isDark
                ? "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(11,12,12,0.82)_34%,rgba(11,12,12,0.18)_100%)]"
                : "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(243,243,241,0.88)_34%,rgba(243,243,241,0.18)_100%)]"
            }
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-3 pb-3 pt-5 md:px-6 md:pb-3.5 md:pt-8 lg:px-8">
          <div className="max-w-[720px]">
            <p
              className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
              }`}
            >
              Ownership Rankings
            </p>
            <h2
              className={`mt-1.5 text-[2.2rem] font-bold leading-[0.98] md:text-[3.4rem] md:leading-[0.96] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Jaguar{" "}
              <span className="text-[var(--color-chrome-bright)]">Ownership Rankings</span>
            </h2>
            <div className="mt-2.5">
              <MStripe />
            </div>
            <p
              className={`mt-2 max-w-[640px] text-[0.88rem] leading-[1.4] md:text-[1.05rem] md:leading-[1.45] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>
      </div>

      {/* Same Sec2 / page bg — no alternate soft band */}
      <div className="mx-auto w-full max-w-8xl px-3 pb-5 pt-2 md:px-6 md:pb-7 md:pt-2.5 lg:px-8">
        {/* Mobile cards */}
        <div className="grid grid-cols-2 gap-2.5 md:hidden">
          {rankings.map((row, index) => (
            <MobileRankingCard key={row.ranking} row={row} index={index} isDark={isDark} />
          ))}
        </div>

        {/* Desktop table */}
        <div
            className={`hidden overflow-hidden rounded-md border md:block ${
            isDark
              ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
              : "border-[#e8e8e6] bg-white shadow-[0_8px_22px_rgba(16,18,16,0.05)]"
          }`}
        >
          <div
            className={`grid grid-cols-[minmax(260px,1.15fr)_minmax(150px,0.7fr)_minmax(0,2fr)_minmax(110px,120px)] text-[0.68rem] font-bold uppercase tracking-[0.06em] ${
              isDark ? "bg-[var(--color-chrome)] text-black" : "bg-black text-white"
            }`}
          >
            <span className="relative px-4 py-2.5 md:px-5">
              {data.columns?.[0] || "Ranking"}
              <span
                aria-hidden="true"
                className={`absolute right-0 top-1/2 h-3.5 w-px -translate-y-1/2 ${isDark ? "bg-black/25" : "bg-white/35"}`}
              />
            </span>
            <span className="relative px-3 py-2.5 md:px-4">
              {data.columns?.[1] || "Winner"}
              <span
                aria-hidden="true"
                className={`absolute right-0 top-1/2 h-3.5 w-px -translate-y-1/2 ${isDark ? "bg-black/25" : "bg-white/35"}`}
              />
            </span>
            <span className="relative px-3 py-2.5 md:px-4">
              {data.columns?.[2] || "Why"}
              <span
                aria-hidden="true"
                className={`absolute right-0 top-1/2 h-3.5 w-px -translate-y-1/2 ${isDark ? "bg-black/25" : "bg-white/35"}`}
              />
            </span>
            <span className="px-2 py-2.5 text-center">{data.columns?.[3] || "Verdict"}</span>
          </div>
          {rankings.map((row, index) => (
            <RankingRow key={row.ranking} row={row} index={index} isDark={isDark} />
          ))}
        </div>

        <DataNote dataSources={data.dataSources} isDark={isDark} />
      </div>
    </section>
  );
}
