"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const iconPaths = {
  chart: <path d="M4 19V9m5 10V5m5 14v-7m5 7H3" />,
  wrench: <path d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  book: <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22V6.5Zm16 0A2.5 2.5 0 0 0 17.5 4H13v16h4.5A2.5 2.5 0 0 1 20 22V6.5Z" />,
  trophy: <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
  engine: <path d="M3 13h2v-3h4V7H7V5h8v2h-2v3h3l2 2h3v7h-3l-2 2H7v-3H5v-3H3v-2Zm6-1v7h6.2l1.8-2h2v-3h-2l-1.8-2H9Z" />,
  car: <path d="M5 13 7 7h10l2 6M4 13h16v6H4v-6Zm2 0V9m12 4V9M7 17h.01M17 17h.01" />,
  tag: <path d="M20 10 12 18 4 10V4h6l10 10ZM7.5 7.5h.01" />,
  warning: <path d="M12 9v4m0 4h.01M10 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L14 4.9a2 2 0 0 0-3.48 0Z" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.5 1.5L15 10" />,
  flame: <path d="M12 3s1 2.5 1 4.5S11 11 11 11s.3-3-1.5-5.5C7.2 8 6 10 6 13a6 6 0 0 0 12 0c0-3.2-1.8-5.7-4.5-8.2.1 1.7-.2 3.1-1.5 4.7" />,
  users: <path d="M16 21v-2a4 4 0 0 0-8 0v2m12 0v-2.5a3.5 3.5 0 0 0-3-3.45M4 21v-2.5a3.5 3.5 0 0 1 3-3.45M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-1a3 3 0 1 0 0-6M6 10a3 3 0 1 1 0-6" />,
  crown: <path d="m3 8 4 3 5-6 5 6 4-3-2 10H5L3 8Zm4 11h10" />,
  check: <path d="m5 12 4 4L19 6" />,
  x: <path d="M8 8l8 8M16 8l-8 8" />,
  alert: <path d="M12 8v5m0 4h.01M12 3 2 21h20L12 3Z" />,
  clock: <path d="M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />,
};

const rankingIcons = ["engine", "car", "tag", "flame", "shield", "warning", "users", "clock"];

const verdictStyles = {
  best: "border-[#cfe8d6] bg-[#eefaf3] text-[#13884a]",
  safe: "border-[#cfe8d6] bg-[#eefaf3] text-[#13884a]",
  avoid: "border-[#f4cfd2] bg-[#fff0f1] text-[#c42430]",
  watch: "border-[#f4dfbf] bg-[#fff7ea] text-[#c77700]",
  family: "border-[#d5e8fb] bg-[#f0f8ff] text-[#2f6feb]",
};

const verdictIconColors = {
  best: "text-[#d4a017]",
  safe: "text-[#35a853]",
  avoid: "text-[#df232a]",
  watch: "text-[#f59e0b]",
  family: "text-[var(--color-primary)]",
};

const categoryColors = {
  best: "text-[#13884a]",
  safe: "text-[#13884a]",
  avoid: "text-[#c42430]",
  watch: "text-[#c77700]",
  family: "text-[#2f6feb]",
};

function Icon({ name, className = "h-6 w-6" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.trophy}
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function resolveIcon(row, index) {
  if (row.icon && iconPaths[row.icon]) return row.icon;
  if (row.verdict?.type === "best") return index === 6 ? "best-family-icon" : "top-choice";
  if (row.verdict?.type === "safe") return "safe-buy";
  if (row.verdict?.type === "avoid") return "flame";
  if (row.verdict?.type === "watch") return "warning";
  return rankingIcons[index] || "top-choice";
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

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[0.72rem] font-bold md:min-w-[104px] md:gap-2 md:rounded-md md:px-3 md:py-2 md:text-[0.86rem] ${
        fullWidth ? "w-full" : ""
      } ${verdictStyles[verdict.type] || verdictStyles.best}`}
    >
      <HomeIcon name={iconName} isDark={isDark} className="h-6 w-6 md:h-7 md:w-7" />
      <span>{verdict.text}</span>
    </span>
  );
}

function RankingIcon({ row, index, isDark }) {
  const iconName = resolveIcon(row, index);

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center md:h-12 md:w-12">
      <HomeIcon name={iconName} isDark={isDark} className="h-9 w-9 md:h-10 md:w-10" />
    </span>
  );
}

function RankingRow({ row, index, isDark }) {
  const rowClassName = `relative grid grid-cols-[minmax(280px,1.2fr)_minmax(160px,0.7fr)_minmax(0,2fr)_120px_24px] items-center gap-4 border-b px-5 py-3.5 last:border-b-0 ${
    isDark ? "border-[var(--color-border)] text-white hover:bg-[var(--color-page-soft)]" : "border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-page-soft)]"
  }`;

  return (
    <div className={rowClassName}>
      {row.href ? (
        <Link href={row.href} className="absolute inset-0 z-0" aria-label={row.ranking}>
          <span className="sr-only">{row.ranking}</span>
        </Link>
      ) : null}
      <div className="relative z-10 pointer-events-none flex min-w-0 items-center gap-4">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.78rem] font-bold ${
            isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-[var(--color-primary)] text-white"
          }`}
        >
          {index + 1}
        </span>
        <RankingIcon row={row} index={index} isDark={isDark} />
        <span className="text-[0.78rem] font-bold uppercase tracking-[0.04em]">{row.ranking}</span>
      </div>
      <div className="relative z-10 pointer-events-none min-w-0">
        <span className="block text-[0.95rem] font-bold leading-tight">{row.winner}</span>
        {row.winnerNote ? (
          <span
            className={`mt-1 block text-[0.78rem] leading-[1.25] ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}
            dangerouslySetInnerHTML={{ __html: row.winnerNote }}
          />
        ) : null}
      </div>
      <div
        className={`relative z-10 min-w-0 text-[0.86rem] leading-[1.35] ${isDark ? "text-white/82" : "text-[var(--color-chrome-bright)]"}`}
        dangerouslySetInnerHTML={{ __html: row.why }}
      />
      <div className="relative z-10 pointer-events-none flex justify-end">
        <VerdictBadge verdict={row.verdict} />
      </div>
      <span className={`relative z-10 pointer-events-none ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
        <ChevronIcon />
      </span>
    </div>
  );
}

function MobileRankingCard({ row, index, isDark }) {
  const iconName = resolveIcon(row, index);
  const rank = String(index + 1).padStart(2, "0");
  const categoryColor = categoryColors[row.verdict.type] || categoryColors.best;
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-[3px] text-[0.64rem] font-bold ${
            isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-[var(--color-primary)] text-white"
          }`}
        >
          {rank}
        </span>
        <span className={`max-w-[68%] text-right text-[0.58rem] font-bold uppercase leading-[1.15] tracking-[0.04em] ${categoryColor}`}>
          {row.ranking}
        </span>
      </div>

      <h3 className={`mt-2 text-[0.82rem] font-bold leading-[1.2] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
        {row.winner}
      </h3>

      <div className="mt-2.5 flex justify-center py-1">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            row.verdict.type === "avoid"
              ? "bg-[#ed1c24] text-white"
              : row.verdict.type === "watch"
                ? "bg-[#f59e0b] text-white"
                : isDark
                  ? "bg-[var(--color-chrome-soft)] text-white"
                  : "bg-[var(--color-primary-soft)] text-[var(--color-text)]"
          }`}
        >
          <Icon name={iconName} className="h-5 w-5" />
        </span>
      </div>

      <div
        className={`mt-1.5 flex-1 text-[0.68rem] leading-[1.3] ${isDark ? "text-white/75" : "text-[var(--color-chrome-bright)]"}`}
        dangerouslySetInnerHTML={{ __html: row.why }}
      />

      <div className="mt-auto pt-2.5">
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
      className={`mt-4 flex items-start gap-3 rounded-xl border px-3.5 py-3.5 md:mt-6 md:px-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)]"
      }`}
    >
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-[var(--color-primary)] text-white"
        }`}
      >
        <Icon name="book" className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className={`text-[0.72rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
          {dataSources.title || "Data Note"}
        </p>
        <p className={`mt-1 text-[0.78rem] leading-[1.4] ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}>
          {summary || "Rankings are drawn from live UK enquiry data and specialist-verified failure patterns."}
        </p>
      </div>
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
      {/* Header - image on right only, same treatment as Sec2 */}
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

        <div className="relative mx-auto w-full max-w-8xl px-3 py-6 md:px-6 md:py-10 lg:px-8">
          <div className="max-w-[720px]">
            <h2
              className={`text-[2.2rem] font-bold leading-[0.98] md:text-[3.4rem] md:leading-[0.96] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Jaguar{" "}
              <span className="text-[var(--color-chrome-bright)]">Ownership Rankings</span>
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>
            <p
              className={`mt-3 max-w-[640px] text-[0.88rem] leading-[1.4] md:text-[1.05rem] md:leading-[1.45] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-page-soft)]">
        <div className="mx-auto w-full max-w-8xl px-3 py-4 md:px-6 md:py-8 lg:px-8">
          {/* Mobile cards - 2-col tight grid */}
          <div className="grid grid-cols-2 gap-2.5 md:hidden">
            {rankings.map((row, index) => (
              <MobileRankingCard key={row.ranking} row={row} index={index} isDark={isDark} />
            ))}
          </div>

          {/* Desktop table / list */}
          <div
            className={`hidden overflow-hidden rounded-xl border md:block ${
              isDark
                ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_12px_32px_var(--color-shadow)]"
            }`}
          >
            <div
              className={`grid grid-cols-[minmax(280px,1.2fr)_minmax(160px,0.7fr)_minmax(0,2fr)_120px_24px] gap-4 px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-white ${
                isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-[var(--color-primary)]"
              }`}
            >
              <span>{data.columns?.[0] || "Ranking"}</span>
              <span>{data.columns?.[1] || "Winner"}</span>
              <span>{data.columns?.[2] || "Why"}</span>
              <span className="text-right">{data.columns?.[3] || "Verdict"}</span>
              <span />
            </div>
            {rankings.map((row, index) => (
              <RankingRow key={row.ranking} row={row} index={index} isDark={isDark} />
            ))}
          </div>

          <DataNote dataSources={data.dataSources} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
