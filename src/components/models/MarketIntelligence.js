"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { tableHeaderClass } from "@/components/models/sectionTypography";

const signalIconKeys = ["car", "engine"];
const insightIconKeys = ["diagnosis", "shield", "star"];

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Ã‚Â£", "\u00a3")
    .replaceAll("Ã¢â‚¬â€œ", "\u2013")
    .replaceAll("Ã¢â‚¬â€", "\u2014")
    .replaceAll("Ã¢â‚¬Â¢", "\u2022")
    .replaceAll("â€”", "\u2014")
    .replaceAll("â€“", "\u2013")
    .replaceAll("â†’", "\u2192")
    .replaceAll("â¬†", "\u2191")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const [before, after = ""] = clean.split(/\s*-\s*/);

  return {
    before: before || clean,
    accent: after,
    after: "",
  };
}

function metricFromTitle(title = "") {
  const match = cleanText(title).match(/What\s+([0-9,+]+)/i);
  return match ? `${match[1]}+` : "140+";
}

function splitBadges(text = "") {
  const clean = cleanText(text);
  const pieces = clean.split(/(\[[^\]]+\])/g).filter(Boolean);

  return pieces.map((piece) => ({
    text: piece.replace("[", "").replace("]", ""),
    isBadge: piece.startsWith("[") && piece.endsWith("]"),
  }));
}

function trendParts(text = "") {
  const clean = cleanText(text);
  const trend =
    clean.startsWith("⬆") || clean.startsWith("\u2191")
      ? "rising"
      : clean.startsWith("➡") || clean.startsWith("\u2192")
        ? "stable"
        : "neutral";
  const withoutArrow = clean.replace(/^[⬆➡↑→]\s*/, "");
  const [label = "", ...rest] = withoutArrow.split(/\s+(?=\[)/);

  return {
    trend,
    label: label.trim(),
    note: rest.join(" ").trim(),
  };
}

function CircleIcon({ name, isDark, small = false }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${
        isDark ? "bg-white/10" : "bg-[#ececeb]"
      } ${small ? "h-10 w-10 md:h-11 md:w-11" : "h-16 w-16"}`}
    >
      <HomeIcon
        name={name}
        isDark={isDark}
        className={`object-contain ${small ? "h-8 w-8 md:h-9 md:w-9" : "h-12 w-12 md:h-14 md:w-14"}`}
      />
    </span>
  );
}

function TrendIcon({ trend, isDark }) {
  return (
    <HomeIcon
      name={trend === "stable" ? "trend" : "pulse"}
      isDark={isDark}
      className="h-7 w-7 shrink-0 object-contain md:h-8 md:w-8"
    />
  );
}

function RichText({ value, strongFirst = false }) {
  const parts = splitBadges(value);
  const firstColonIndex = strongFirst ? parts.findIndex((part) => !part.isBadge && part.text.includes(":")) : -1;

  return (
    <>
      {parts.map((part, index) => {
        if (part.isBadge) {
          return (
            <span
              key={`${part.text}-${index}`}
              className="mx-1 inline-flex font-medium text-[var(--color-chrome-bright)]"
            >
              [{part.text}]
            </span>
          );
        }

        if (index === firstColonIndex) {
          const [lead, ...rest] = part.text.split(":");
          return (
            <span key={`${part.text}-${index}`}>
              <strong className="font-bold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: `${lead}:` }} />
              <span dangerouslySetInnerHTML={{ __html: rest.join(":") }} />
            </span>
          );
        }

        return <span key={`${part.text}-${index}`} dangerouslySetInnerHTML={{ __html: part.text }} />;
      })}
    </>
  );
}

function SignalTable({ rows, isDark }) {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_10px_30px_var(--color-shadow)]">
      <div className={`grid grid-cols-[34%_30%_36%] text-[12px] font-bold md:grid-cols-[32%_33%_35%] md:text-[14px] ${tableHeaderClass(isDark)}`}>
        <div className="px-2 py-2 md:px-5 md:py-3">Signal</div>
        <div className="border-l border-white/28 px-2 py-2 md:px-3 md:py-2">2025 Data</div>
        <div className="border-l border-white/28 px-2 py-2 md:px-3 md:py-2">Demand Trend</div>
      </div>

      {rows.map((row, index) => {
        const trend = trendParts(row.demandTrend);
        const isEngine = row.signal?.includes("(");

        return (
          <div
            key={`${row.signal}-${index}`}
            className="grid grid-cols-[34%_30%_36%] border-t border-[var(--color-border)] text-[var(--color-text)] md:grid-cols-[32%_33%_35%]"
          >
            <div className="flex items-center gap-2 px-2 py-3 md:gap-3 md:px-3">
              <CircleIcon name={signalIconKeys[isEngine ? 1 : 0]} isDark={isDark} small />
              <p
                className="min-w-0 break-words text-[12px] font-bold leading-[1.25] md:text-[15px]"
                dangerouslySetInnerHTML={{ __html: cleanText(row.signal) }}
              />
            </div>
            <div className="border-l border-[var(--color-border)] px-2 py-3 text-[12px] leading-[1.35] md:px-3 md:text-[15px]">
              <RichText value={row.data} />
            </div>
            <div className="flex flex-col items-start gap-1.5 border-l border-[var(--color-border)] px-2 py-3 text-[12px] leading-[1.35] md:px-3 md:text-[15px]">
              <TrendIcon trend={trend.trend} isDark={isDark} />
              <p className="min-w-0 break-words hyphens-auto whitespace-normal">
                <strong className="font-bold text-[var(--color-text)]">{trend.label.split(" ")[0]}</strong>
                {trend.label.includes(" ") ? ` ${trend.label.split(" ").slice(1).join(" ")}` : ""}
                {trend.note ? (
                  <span className="ml-1 text-[var(--color-chrome-bright)]">{trend.note}</span>
                ) : null}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InsightsPanel({ insights, isDark }) {
  if (!insights?.length) return null;

  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 shadow-[0_10px_30px_var(--color-shadow)] md:col-span-3 md:p-3.5">
      <div className="mb-4 flex items-center gap-3 text-[var(--color-text)]">
        <HomeIcon name="chart" isDark={isDark} className="h-5 w-5 object-contain" />
        <h3 className="text-[15px] font-bold md:text-[16px]">Insights from the data:</h3>
      </div>

      <div className="grid gap-3 md:grid-cols-3 md:gap-0">
        {insights.map((insight, index) => (
          <article
            key={insight}
            className="overflow-hidden border-[var(--color-border)] md:border-l md:px-3 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
          >
            <span className="float-left mr-3 mb-1 md:mr-3.5">
              <CircleIcon name={insightIconKeys[index] || insightIconKeys[0]} isDark={isDark} />
            </span>
            <p className="text-[13px] leading-[1.42] text-[var(--color-text)] md:text-[14px]">
              <RichText value={insight} strongFirst />
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function LiveFeed({ note, isDark }) {
  if (!note) return null;

  const displayNote = /module embeds here/i.test(note) ? "Real-time enquiry activity across the UK." : cleanText(note);

  return (
    <aside className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 shadow-[0_10px_30px_var(--color-shadow)] md:p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[16px] font-bold text-[var(--color-text)] md:text-[17px]">Live Enquiry Feed</h3>
        <span className="inline-flex items-center gap-2 text-[13px] text-[var(--color-text-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-chrome-bright)]" />
          Live
        </span>
      </div>
      <div className="mt-5 flex h-20 items-center justify-center">
        <HomeIcon name="live" isDark={isDark} className="h-14 w-14 object-contain opacity-80" />
      </div>
      <p className="mt-3 text-[14px] leading-[1.35] text-[var(--color-text-muted)]">{displayNote}</p>
      <Link
        href="#"
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-md border border-[var(--color-border-strong)] px-5 py-3 text-[15px] font-bold text-[var(--color-text)] transition-all duration-200 hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)]"
      >
        View Live Feed
        <HomeIcon name="insight" isDark={isDark} className="h-5 w-5 object-contain" />
      </Link>
    </aside>
  );
}

function PullQuote({ data, isDark }) {
  if (!data) return null;

  return (
    <div className="grid overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_10px_30px_var(--color-shadow)] md:grid-cols-[minmax(0,1.46fr)_minmax(290px,0.7fr)]">
      <div className="p-3 md:p-3.5">
        <div className="flex items-center gap-2.5">
          <HomeIcon name="quote" isDark={isDark} className="h-7 w-7 shrink-0 object-contain opacity-70" />
          <p className="text-[11px] font-bold uppercase text-[var(--color-chrome-bright)] md:text-[12px]">
            Editorial Pull-Quote
          </p>
        </div>
        <h3
          className="mt-2 max-w-[560px] font-heading text-[22px] font-semibold leading-[1.1] text-[var(--color-text)] md:mt-2.5 md:text-[31px]"
          dangerouslySetInnerHTML={{ __html: cleanText(data.title) }}
        />
        <blockquote className="mt-2 max-w-[760px] text-[12px] leading-[1.45] text-[var(--color-text)] md:text-[13px]">
          &ldquo;<span dangerouslySetInnerHTML={{ __html: cleanText(data.quote) }} />&rdquo;
        </blockquote>
      </div>
      <div className="relative min-h-[140px] md:min-h-full">
        <Image
          src="/home-image/right.webp"
          alt=""
          fill
          className="object-cover object-center"
          sizes="(min-width: 768px) 35vw, 100vw"
        />
      </div>
    </div>
  );
}

export default function MarketIntelligence({ data, quoteData }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[var(--color-page)]";

  return (
    <section className={`relative overflow-hidden ${sectionBg} py-5 text-[var(--color-text)] md:py-6`}>
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="max-w-[960px] text-[29px] font-bold leading-[1.08] tracking-normal text-[var(--color-text)] md:text-[45px]">
              <span dangerouslySetInnerHTML={{ __html: title.before }} />
              {title.accent ? (
                <>
                  {" "}
                  <span
                    className="text-[var(--color-chrome-bright)]"
                    dangerouslySetInnerHTML={{ __html: `- ${title.accent}` }}
                  />
                </>
              ) : null}
              {title.after}
            </h2>
            <div className="mt-2">
              <MStripe />
            </div>
          </div>
          <div className="flex min-w-[210px] items-center gap-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 shadow-[0_8px_22px_var(--color-shadow)] md:p-5">
            <CircleIcon name="most-enquired" isDark={isDark} />
            <div>
              <p
                className="font-heading text-[24px] font-semibold leading-none text-[var(--color-text)] md:text-[34px]"
                dangerouslySetInnerHTML={{ __html: metricFromTitle(data.h2) }}
              />
              <p className="mt-2 text-[13px] leading-[1.45] text-[var(--color-text-muted)] md:text-[14px]">
                Total Enquiries in 2025
              </p>
              <p className="mt-1 text-[13px] font-medium text-[var(--color-chrome-bright)] md:text-[14px]">
                [JAG-VERIFIED]
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <SignalTable rows={data.signals || []} isDark={isDark} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_1fr_260px]">
          <InsightsPanel insights={data.insights || []} isDark={isDark} />
          <LiveFeed note={data.liveEnquiryFeedNote} isDark={isDark} />
        </div>

        <div className="mt-4">
          <PullQuote data={quoteData} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
