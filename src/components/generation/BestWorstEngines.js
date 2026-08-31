"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";
import GenerationSectionHeader from "./GenerationSectionHeader";
import {
  generationSectionBg,
  splitBestWorstEnginesH2,
} from "./generationSection";

const typeStyles = {
  success: {
    icon: "check",
    color: "#189454",
    accent: "border-b-[#189454]",
    light: "text-[#13884a] bg-[#eafaf0]",
    dark: "text-[#67d99a] bg-[rgba(24,148,84,0.16)]",
  },
  trophy: {
    icon: "gauge",
    color: "var(--color-primary)",
    accent: "border-b-[var(--color-primary)]",
    light: "text-[var(--color-primary)] bg-[var(--color-primary-soft)]",
    dark: "text-[var(--color-chrome-bright)] bg-[rgba(255,255,255,0.08)]",
  },
  danger: {
    icon: "warning",
    color: "#e03232",
    accent: "border-b-[#e03232]",
    light: "text-[#db2e2e] bg-[#fff0f0]",
    dark: "text-[#ff8b90] bg-[rgba(255,45,53,0.15)]",
  },
  fire: {
    icon: "dollar",
    color: "#da7a12",
    accent: "border-b-[#da7a12]",
    light: "text-[#da7a12] bg-[#fff5ea]",
    dark: "text-[#ffb66a] bg-[rgba(218,122,18,0.15)]",
  },
  diamond: {
    icon: "diamond",
    color: "#189454",
    accent: "border-b-[#189454]",
    light: "text-[#13884a] bg-[#eafaf0]",
    dark: "text-[#67d99a] bg-[rgba(24,148,84,0.16)]",
  },
  crown: {
    icon: "shield",
    color: "var(--color-primary)",
    accent: "border-b-[var(--color-primary)]",
    light: "text-[var(--color-primary)] bg-[var(--color-primary-soft)]",
    dark: "text-[var(--color-chrome-bright)] bg-[rgba(255,255,255,0.08)]",
  },
};

function MobileCard({ item, isDark }) {
  const style = typeStyles[item.type] || typeStyles.success;
  const badgeClass = isDark ? style.dark : style.light;

  return (
    <div
      className="glass-panel flex gap-3 overflow-hidden rounded-md p-3"
      style={{ borderLeft: `4px solid ${style.color}` }}
    >
      <div className="flex w-20 shrink-0 flex-col items-center gap-1.5">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${badgeClass}`}>
          <GenIcon name={style.icon} className="h-3.5 w-3.5" />
        </span>
        <div className="relative h-28 w-20 shrink-0 overflow-hidden">
          <Image src="/e90/engine.webp" alt={`${item.engine} engine`} fill className="object-contain" sizes="80px" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className={`text-[0.72rem] font-semibold leading-tight ${badgeClass.split(" ")[0]}`} dangerouslySetInnerHTML={{ __html: item.slot }} />

        <p className="flex flex-wrap items-baseline gap-x-1.5 text-[1rem] font-bold leading-tight text-[var(--color-text)]">
          <span dangerouslySetInnerHTML={{ __html: item.engine }} />
          {item.engineNote ? (
            <span className="text-[0.72rem] font-normal text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.engineNote }} />
          ) : null}
        </p>

        <p className="text-[0.78rem] leading-[1.35] text-[var(--color-text-muted)]">&ldquo;<span dangerouslySetInnerHTML={{ __html: item.quote }} />&rdquo;</p>

        <p className="border-t border-[var(--color-border)] pt-2 text-[0.76rem] leading-[1.3] text-[var(--color-text)]">
          <span className="font-semibold" style={{ color: style.color }}>Who it&apos;s for:</span>{" "}
          <span dangerouslySetInnerHTML={{ __html: item.whoItsFor }} />
        </p>
        {item.modelWideNote ? (
          <p className="rounded-md bg-[var(--color-page-soft)] p-1.5 text-[0.68rem] leading-[1.3] text-[var(--color-text-soft)]" dangerouslySetInnerHTML={{ __html: item.modelWideNote }} />
        ) : null}
      </div>
    </div>
  );
}

function Card({ item, isDark }) {
  const style = typeStyles[item.type] || typeStyles.success;
  const badgeClass = isDark ? style.dark : style.light;

  return (
    <div className={`hidden h-full flex-col gap-2 overflow-hidden rounded-md border border-b-4 border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:flex ${style.accent}`}>
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${badgeClass}`}>
          <GenIcon name={style.icon} className="h-3.5 w-3.5" />
        </span>
        <p className={`flex-1 text-[0.76rem] font-semibold leading-tight ${badgeClass.split(" ")[0]}`} dangerouslySetInnerHTML={{ __html: item.slot }} />
      </div>

      <p className="flex flex-wrap items-baseline gap-x-1.5 text-[1.05rem] font-bold leading-tight text-[var(--color-text)]">
        <span dangerouslySetInnerHTML={{ __html: item.engine }} />
        {item.engineNote ? (
          <span className="text-[0.76rem] font-normal text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.engineNote }} />
        ) : null}
      </p>

      <div className="flex items-start gap-2.5">
        <div className="relative -ml-3 h-36 w-24 shrink-0 overflow-hidden rounded-sm">
          <Image src="/e90/engine.webp" alt={`${item.engine} engine`} fill className="object-contain" sizes="100px" />
        </div>
        <p className="text-[0.8rem] leading-[1.35] text-[var(--color-text-muted)]">&ldquo;<span dangerouslySetInnerHTML={{ __html: item.quote }} />&rdquo;</p>
      </div>

      <div className="mt-auto">
        <p className="border-t border-[var(--color-border)] pt-2 text-[0.78rem] leading-[1.3] text-[var(--color-text)]">
          <span className="font-semibold">Who it&apos;s for:</span> <span dangerouslySetInnerHTML={{ __html: item.whoItsFor }} />
        </p>
        {item.modelWideNote ? (
          <p className="mt-1.5 rounded-md bg-[var(--color-page-soft)] p-1.5 text-[0.7rem] leading-[1.3] text-[var(--color-text-soft)]" dangerouslySetInnerHTML={{ __html: item.modelWideNote }} />
        ) : null}
      </div>
    </div>
  );
}

function OverlookedCard({ item, isDark }) {
  const style = typeStyles[item.type] || typeStyles.crown;
  const badgeClass = isDark ? style.dark : style.light;

  return (
    <div className={`glass-panel overflow-hidden rounded-md border border-b-4 border-[var(--color-border)] ${style.accent}`}>
      <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.7fr_1fr] md:divide-x md:divide-[var(--color-border)]">
        <div className="flex items-start gap-3 p-4 md:p-5">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${badgeClass}`}>
            <GenIcon name={style.icon} className="h-5 w-5" />
          </span>
          <div>
            <p className={`text-[0.82rem] font-semibold ${badgeClass.split(" ")[0]}`} dangerouslySetInnerHTML={{ __html: item.slot }} />
            <p className="mt-1 text-[1.05rem] font-bold leading-tight text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: item.engine }} />
            {item.engineNote ? <p className="mt-0.5 text-[0.78rem] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.engineNote }} /> : null}
          </div>
        </div>

        <div className="p-4 md:p-5 md:pt-5">
          <p className="text-[0.88rem] leading-[1.5] text-[var(--color-text-muted)]">&ldquo;<span dangerouslySetInnerHTML={{ __html: item.quote }} />&rdquo;</p>
        </div>

        <div className="p-4 md:flex md:items-center md:p-5">
          <p className="text-[0.82rem] leading-[1.5] text-[var(--color-text)]">
            <span className="font-semibold text-[var(--color-primary)]">Who it&apos;s for: </span>
            <span dangerouslySetInnerHTML={{ __html: item.whoItsFor }} />
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BestWorstEngines({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const sectionBg = generationSectionBg(isDark, true);
  const title = splitBestWorstEnginesH2(data.h2 || "Best &amp; Worst Engines");
  const items = data.items || [];
  const mainItems = items.filter((item) => !item.fullWidth);
  const wideItems = items.filter((item) => item.fullWidth);

  return (
    <section className={`w-full text-[var(--color-text)] ${sectionBg}`}>
      <GenerationSectionHeader title={title} subHeadline={data.subHeadline} isDark={isDark} sectionBg={sectionBg} />

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5">
        <div className="flex flex-col gap-3 sm:hidden">
          {mainItems.map((item) => (
            <MobileCard key={item.slot} item={item} isDark={isDark} />
          ))}
        </div>

        <div className="hidden items-stretch gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-5">
          {mainItems.map((item) => (
            <Card key={item.slot} item={item} isDark={isDark} />
          ))}
        </div>

        {wideItems.length > 0 ? (
          <div className="mt-3 flex flex-col gap-3 md:mt-4">
            {wideItems.map((item) => (
              <OverlookedCard key={item.slot} item={item} isDark={isDark} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
