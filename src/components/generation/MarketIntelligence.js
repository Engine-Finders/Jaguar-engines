"use client";

import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";
import HomeIcon from "@/components/home/homeIcons";
import GenerationSectionHeader from "./GenerationSectionHeader";
import {
  generationSectionBg,
  splitMarketIntelligenceH2,
  tableHeaderClass,
} from "./generationSection";

const STAT_ICON_MAP = {
  chart: "real-inquiries",
  car: "vehicle",
  dollar: "value",
  warning: "warning",
};

function splitVehicle(vehicle = "") {
  const parenMatch = vehicle.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (parenMatch) {
    return { model: parenMatch[1].trim(), chassis: parenMatch[2].trim() };
  }

  const match = vehicle.match(/^(.*?)\s((?:E|F|G|X)\d{2}\b.*)$/);
  if (!match) return { model: vehicle, chassis: "" };
  return { model: match[1], chassis: match[2] };
}

function splitEnquiries(enquiries = "") {
  const [count, ...rest] = enquiries.split(" ");
  return { count, label: rest.join(" ") };
}

function stripListPrefix(text = "") {
  return String(text).replace(/^\d+\.\s*/, "");
}

function splitAverageCost(text = "") {
  const quoteMatch = text.match(/(\[[^\]]+\])/);
  const quote = quoteMatch ? quoteMatch[1] : "";
  const main = text.replace(/\s*\[[^\]]+\]\s*/g, " ").trim();
  const reconMatch = main.match(/^(.+?)\s+(reconditioned.*)$/i);

  if (reconMatch) {
    return { price: reconMatch[1].trim(), note: reconMatch[2].trim(), quote };
  }

  return { price: main, note: "", quote };
}

function StatCardIcon({ icon, isDark, compact = false, className = "" }) {
  const homeIcon = STAT_ICON_MAP[icon] || "real-inquiries";
  const sizeClass = compact ? "h-8 w-8" : "h-9 w-9";
  const iconSizeClass = compact ? "h-5 w-5" : "h-6 w-6";

  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] ${sizeClass} ${className}`}>
      <HomeIcon name={homeIcon} isDark={isDark} className={`${iconSizeClass} object-contain`} />
    </span>
  );
}

function StatCard({ icon, title, children, isDark }) {
  return (
    <div className="glass-panel flex h-full min-h-[168px] flex-col gap-2 rounded-md p-3">
      <div className="flex items-start gap-2">
        <StatCardIcon icon={icon} isDark={isDark} compact />
        <p className="min-w-0 flex-1 text-[0.62rem] font-semibold uppercase leading-[1.25] tracking-wide text-[var(--color-primary)] md:text-[0.68rem]">
          {title}
        </p>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

function RankedList({ items, compact = false }) {
  return (
    <ol className="flex flex-col gap-1.5">
      {items?.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className={`flex gap-1.5 leading-[1.3] text-[var(--color-text)] ${compact ? "text-[0.68rem]" : "text-[0.74rem]"}`}
        >
          <span className="shrink-0 font-semibold text-[var(--color-primary)]">{index + 1}.</span>
          <span dangerouslySetInnerHTML={{ __html: stripListPrefix(item) }} />
        </li>
      ))}
    </ol>
  );
}

function AverageCostCard({ value, note }) {
  const { price, note: parsedNote, quote } = splitAverageCost(value);
  const displayNote = note || parsedNote;

  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <div>
        <p
          className="text-[1.1rem] font-bold leading-[1.1] text-[var(--color-text)] md:text-[0.92rem]"
          dangerouslySetInnerHTML={{ __html: price }}
        />
        {displayNote ? (
          <p
            className="mt-1 text-[0.64rem] leading-[1.3] text-[var(--color-text-soft)]"
            dangerouslySetInnerHTML={{ __html: displayNote }}
          />
        ) : null}
      </div>
      {quote ? (
        <p className="text-[0.62rem] font-semibold text-[var(--color-primary)] md:text-[0.64rem]" dangerouslySetInnerHTML={{ __html: quote }} />
      ) : null}
    </div>
  );
}

function LiveFeedHeader({ isDark, feedBorder, feedText }) {
  return (
    <div className={`flex items-center gap-2 border-b px-4 py-3 text-[0.82rem] font-semibold uppercase tracking-wide ${feedBorder} ${feedText}`}>
      <HomeIcon name="live" isDark={isDark} className="h-5 w-5 object-contain" />
      Live Feed
    </div>
  );
}

function MobileLiveFeedRow({ row, feedBorder, feedText, feedMuted, feedSoft, showUpdated }) {
  const { model, chassis } = splitVehicle(row.vehicle);
  const { count, label } = splitEnquiries(row.enquiries);

  return (
    <div className={`grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.8fr)_minmax(0,0.95fr)_minmax(0,0.8fr)] items-stretch text-[0.68rem] ${feedText}`}>
      <div className={`border-r px-2.5 py-3 ${feedBorder}`}>
        <div className="min-w-0">
          <p className="font-semibold leading-[1.25]" dangerouslySetInnerHTML={{ __html: model }} />
          {chassis ? <p className={`mt-0.5 text-[0.6rem] ${feedSoft}`} dangerouslySetInnerHTML={{ __html: chassis }} /> : null}
        </div>
      </div>

      <div className={`flex items-center gap-1 border-r px-2 py-3 ${feedBorder} ${feedMuted}`}>
        <GenIcon name="pin" className="h-3 w-3 shrink-0 text-[var(--color-primary)]" />
        <span className="min-w-0 break-words" dangerouslySetInnerHTML={{ __html: row.location }} />
      </div>

      <div className={`flex items-center gap-1 border-r px-2 py-3 ${feedBorder} ${feedMuted}`}>
        <GenIcon name="warning" className="h-3 w-3 shrink-0 text-[var(--color-primary)]" />
        <span className="min-w-0 break-words leading-[1.25]" dangerouslySetInnerHTML={{ __html: row.issue }} />
      </div>

      <div className="flex flex-col justify-center px-2 py-3 leading-[1.2]">
        <p className="text-[0.95rem] font-bold leading-none" dangerouslySetInnerHTML={{ __html: count }} />
        {label ? <p className={`text-[0.58rem] ${feedSoft}`} dangerouslySetInnerHTML={{ __html: label }} /> : null}
        {showUpdated && row.updated ? (
          <div className={`mt-1.5 flex items-center gap-1 text-[0.56rem] ${feedSoft}`}>
            <GenIcon name="refresh" className="h-3 w-3 shrink-0 text-[var(--color-primary)]" />
            <span dangerouslySetInnerHTML={{ __html: row.updated }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function useFeedStyles(isDark) {
  return {
    feedBg: isDark ? "bg-black" : "bg-[var(--color-table-surface)]",
    feedBorder: isDark ? "border-white/15" : "border-[var(--color-border)]",
    feedText: isDark ? "text-white" : "text-[var(--color-text)]",
    feedMuted: isDark ? "text-white/70" : "text-[var(--color-text-muted)]",
    feedSoft: isDark ? "text-white/50" : "text-[var(--color-text-soft)]",
    feedHeaderBg: tableHeaderClass(isDark),
    feedHeaderDivider: isDark ? "border-[var(--color-page)]/20" : "border-white/25",
  };
}

export function DesktopLiveFeed({ liveFeed, isDark }) {
  const {
    feedBg,
    feedBorder,
    feedText,
    feedMuted,
    feedSoft,
    feedHeaderBg,
    feedHeaderDivider,
  } = useFeedStyles(isDark);

  if (!liveFeed?.length) return null;

  return (
    <div className={`overflow-hidden rounded-md border shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur ${feedBorder} ${feedBg}`}>
      <LiveFeedHeader isDark={isDark} feedBorder={feedBorder} feedText={feedText} />

      <div className="overflow-x-auto">
        <div className="min-w-[560px] md:min-w-0">
          <div className={`grid grid-cols-[1.3fr_0.9fr_1fr_0.7fr] gap-2 border-b px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-wide ${feedBorder} ${feedHeaderBg}`}>
            <span className={`border-r pr-2 ${feedHeaderDivider}`}>Vehicle</span>
            <span className={`border-r pr-2 ${feedHeaderDivider}`}>Location</span>
            <span className={`border-r pr-2 ${feedHeaderDivider}`}>Issue</span>
            <span>Enquiries</span>
          </div>

          {liveFeed.map((row, index) => {
            const { model, chassis } = splitVehicle(row.vehicle);
            const { count, label } = splitEnquiries(row.enquiries);

            return (
              <div
                key={`${row.vehicle}-${row.location}`}
                className={`grid grid-cols-[1.3fr_0.9fr_1fr_0.7fr] items-center gap-2 px-4 py-3 text-[0.8rem] ${feedText} ${
                  index === liveFeed.length - 1 ? "" : `border-b ${feedBorder}`
                }`}
              >
                <div className="min-w-0">
                  <p className={`font-semibold leading-[1.25] ${feedText}`} dangerouslySetInnerHTML={{ __html: model }} />
                  {chassis ? <p className={`mt-0.5 text-[0.7rem] ${feedSoft}`} dangerouslySetInnerHTML={{ __html: chassis }} /> : null}
                </div>

                <div className={`flex items-center gap-1.5 ${feedMuted}`}>
                  <GenIcon name="pin" className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
                  <span dangerouslySetInnerHTML={{ __html: row.location }} />
                </div>

                <div className={`flex items-center gap-1.5 ${feedMuted}`}>
                  <GenIcon name="warning" className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
                  <span dangerouslySetInnerHTML={{ __html: row.issue }} />
                </div>

                <div className="leading-[1.25]">
                  <p className={`font-semibold ${feedText}`} dangerouslySetInnerHTML={{ __html: count }} />
                  {label ? <p className={`text-[0.7rem] ${feedSoft}`} dangerouslySetInnerHTML={{ __html: label }} /> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {liveFeed[0]?.updated ? (
        <div className={`flex items-center justify-end gap-1.5 border-t px-4 py-2.5 text-[0.72rem] ${feedBorder} ${feedSoft}`}>
          <GenIcon name="refresh" className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
          <span dangerouslySetInnerHTML={{ __html: liveFeed[0].updated }} />
        </div>
      ) : null}
    </div>
  );
}

export function MarketIntelligenceSidebar({ data }) {
  const { theme } = useTheme();
  if (!data?.liveFeed?.length) return null;

  const isDark = theme === "dark";
  return <DesktopLiveFeed liveFeed={data.liveFeed} isDark={isDark} />;
}

function MarketIntelligenceBody({ data, isDark, grouped, hideSidebar }) {
  const title = splitMarketIntelligenceH2(data.h2 || "Market Intelligence");
  const feedStyles = useFeedStyles(isDark);

  const statCards = (
    <>
      <StatCard icon="chart" title={data.engineCardTitle || "Most Requested Engines (2025)"} isDark={isDark}>
        <RankedList items={data.mostRequestedEngines} compact />
      </StatCard>
      <StatCard icon="car" title={data.variantCardTitle || "Most Requested Variants"} isDark={isDark}>
        <RankedList items={data.mostRequestedVariants} compact />
      </StatCard>
      <StatCard icon="dollar" title={data.costCardTitle || "Average Replacement Cost"} isDark={isDark}>
        <AverageCostCard value={data.averageReplacementCost} note={data.averageReplacementCostNote} />
      </StatCard>
      <StatCard icon="warning" title={data.failureCardTitle || "Most Common Failures"} isDark={isDark}>
        <RankedList items={data.mostCommonFailures} compact />
      </StatCard>
    </>
  );

  const headerBg = grouped ? generationSectionBg(isDark, true) : generationSectionBg(isDark, false);

  return (
    <>
      <GenerationSectionHeader title={title} subHeadline={data.subHeadline} isDark={isDark} sectionBg={headerBg} showHeaderImage={false} />

      <div className={`relative mx-auto w-full max-w-8xl ${grouped ? "px-0 pb-6 pt-4 md:pb-6 md:pt-5" : "px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5"}`}>
        <div className="flex flex-col gap-3 md:hidden">
          <div className="grid grid-cols-2 gap-3">{statCards}</div>

          {!hideSidebar && data.liveFeed?.length > 0 ? (
            <div className={`overflow-hidden rounded-md border shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur ${feedStyles.feedBorder} ${feedStyles.feedBg}`}>
              <LiveFeedHeader isDark={isDark} feedBorder={feedStyles.feedBorder} feedText={feedStyles.feedText} />
              <div className="divide-y divide-[var(--color-border)]">
                {data.liveFeed.map((row) => (
                  <MobileLiveFeedRow
                    key={`${row.vehicle}-${row.location}`}
                    row={row}
                    feedBorder={feedStyles.feedBorder}
                    feedText={feedStyles.feedText}
                    feedMuted={feedStyles.feedMuted}
                    feedSoft={feedStyles.feedSoft}
                    showUpdated
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="hidden md:grid md:grid-cols-2 md:gap-3 lg:hidden">
          {statCards}
        </div>

        {!hideSidebar ? (
          <div className="mt-4 hidden md:block lg:hidden">
            <DesktopLiveFeed liveFeed={data.liveFeed} isDark={isDark} />
          </div>
        ) : null}

        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-3">{statCards}</div>
      </div>
    </>
  );
}

export default function MarketIntelligence({ data, grouped = false, hideSidebar = false, className = "" }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const sectionBg = grouped ? "" : generationSectionBg(isDark, false);

  const body = <MarketIntelligenceBody data={data} isDark={isDark} grouped={grouped} hideSidebar={hideSidebar} />;

  if (grouped) {
    return (
      <section className={`w-full text-[var(--color-text)] ${className}`.trim()}>
        {body}
      </section>
    );
  }

  return (
    <section className={`w-full overflow-x-hidden text-[var(--color-text)] ${sectionBg}`}>
      {body}
    </section>
  );
}
