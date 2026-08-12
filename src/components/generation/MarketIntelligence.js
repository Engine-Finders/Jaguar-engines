"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";

function splitVehicle(vehicle = "") {
  const match = vehicle.match(/^(.*?)\s((?:E|F|G)\d{2}\b.*)$/);
  if (!match) return { model: vehicle, chassis: "" };
  return { model: match[1], chassis: match[2] };
}

function splitEnquiries(enquiries = "") {
  const [count, ...rest] = enquiries.split(" ");
  return { count, label: rest.join(" ") };
}

function StatCard({ icon, title, children }) {
  return (
    <div className="glass-panel flex flex-col gap-2 rounded-md p-3">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <GenIcon name={icon} className="h-4 w-4" />
        </span>
        <p className="text-[0.68rem] font-semibold uppercase leading-[1.25] tracking-wide text-[var(--color-primary)]">{title}</p>
      </div>
      {children}
    </div>
  );
}

function RankedList({ items }) {
  return (
    <ol className="flex flex-col gap-1">
      {items?.map((item, index) => (
        <li key={item} className="flex gap-1.5 text-[0.74rem] leading-[1.3] text-[var(--color-text)]">
          <span className="font-semibold text-[var(--color-primary)]">{index + 1}.</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ol>
  );
}

export default function MarketIntelligence({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const feedBg = isDark ? "bg-black" : "bg-[var(--color-table-surface)]";
  const feedBorder = isDark ? "border-white/10" : "border-[var(--color-border)]";
  const feedText = isDark ? "text-white" : "text-[var(--color-text)]";
  const feedMuted = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const feedSoft = isDark ? "text-white/50" : "text-[var(--color-text-soft)]";
  const feedHeaderBg = isDark ? "bg-white/[0.03]" : "bg-[var(--color-page-soft)]";
  const feedImageBg = isDark ? "bg-white/5" : "bg-[var(--color-page-soft)]";

  return (
    <section className="w-full border-t border-[var(--color-border)] bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div>
            <h2 className="text-[2.15rem] font-bold leading-[1.1] tracking-normal text-[var(--color-text)] md:text-[3rem]">
              {data.h2 || "Market Intelligence"}
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard icon="chart" title="Most Requested E90 Engines (2025)">
                <RankedList items={data.mostRequestedEngines} />
              </StatCard>
              <StatCard icon="car" title="Most Requested E90 Variants">
                <RankedList items={data.mostRequestedVariants} />
              </StatCard>
              <StatCard icon="dollar" title="Average E90 Replacement Cost">
                <p className="text-[1.5rem] font-bold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: data.averageReplacementCost }} />
                {data.averageReplacementCostNote ? (
                  <p className="text-[0.68rem] leading-[1.3] text-[var(--color-text-soft)]" dangerouslySetInnerHTML={{ __html: data.averageReplacementCostNote }} />
                ) : null}
              </StatCard>
              <StatCard icon="warning" title="Most Common E90 Failures">
                <RankedList items={data.mostCommonFailures} />
              </StatCard>
            </div>
          </div>

          {data.liveFeed?.length > 0 ? (
            <div className={`overflow-hidden rounded-md border shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur ${feedBorder} ${feedBg}`}>
              <div className={`flex items-center gap-2 border-b px-4 py-3 text-[0.85rem] font-semibold uppercase tracking-wide ${feedBorder} ${feedText}`}>
                <GenIcon name="gauge" className="h-4 w-4 text-[var(--color-primary)]" />
                Live Feed
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[560px] md:min-w-0">
                  <div className={`grid grid-cols-[1.3fr_0.9fr_1fr_0.7fr] gap-2 border-b px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-wide ${feedBorder} ${feedHeaderBg} ${feedSoft}`}>
                    <span>Vehicle</span>
                    <span>Location</span>
                    <span>Issue</span>
                    <span>Enquiries</span>
                  </div>

                  {data.liveFeed.map((row, index) => {
                    const { model, chassis } = splitVehicle(row.vehicle);
                    const { count, label } = splitEnquiries(row.enquiries);
                    return (
                      <div
                        key={`${row.vehicle}-${row.location}`}
                        className={`grid grid-cols-[1.3fr_0.9fr_1fr_0.7fr] items-center gap-2 px-4 py-3 text-[0.8rem] ${feedText} ${
                          index === data.liveFeed.length - 1 ? "" : `border-b ${feedBorder}`
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`relative h-8 w-11 shrink-0 overflow-hidden rounded ${feedImageBg}`}>
                            <Image src="/live_feed.webp" alt={model} fill className="object-cover" sizes="44px" />
                          </span>
                          <div className="min-w-0">
                            <p className={`truncate font-semibold ${feedText}`} dangerouslySetInnerHTML={{ __html: model }} />
                            {chassis ? <p className={`truncate text-[0.7rem] ${feedSoft}`} dangerouslySetInnerHTML={{ __html: chassis }} /> : null}
                          </div>
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

              {data.liveFeed[0]?.updated ? (
                <div className={`flex items-center justify-end gap-1.5 border-t px-4 py-2.5 text-[0.72rem] ${feedBorder} ${feedSoft}`}>
                  <GenIcon name="refresh" className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
                  <span dangerouslySetInnerHTML={{ __html: data.liveFeed[0].updated }} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
