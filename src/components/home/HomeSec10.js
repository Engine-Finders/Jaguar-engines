"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const riskClass = {
  catastrophic: "bg-[#ed1c24] text-white",
  immediate: "bg-[#ff7900] text-white",
  monitor: "bg-[#f6b800] text-white",
};

const iconPaths = {
  users: (
    <>
      <path d="M16 19c0-2.2-1.8-4-4-4H7c-2.2 0-4 1.8-4 4" />
      <path d="M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M21 19c0-2-1.2-3.3-3.2-3.8" />
      <path d="M16.5 4.4a3.2 3.2 0 0 1 0 6.2" />
    </>
  ),
  engine: <path d="M3 13h2v-3h4V7H7V5h8v2h-2v3h3l2 2h3v7h-3l-2 2H7v-3H5v-3H3v-2Zm6-1v7h6.2l1.8-2h2v-3h-2l-1.8-2H9Z" />,
  refresh: <path d="M20 6v5h-5M4 18v-5h5M18.2 9A7 7 0 0 0 6.7 6.7L4 9m2 6a7 7 0 0 0 11.3 2.3L20 15" />,
  car: <path d="m5 13 1.4-4.2A3 3 0 0 1 9.2 7h5.6a3 3 0 0 1 2.8 1.8L19 13m-15 0h16v5H4v-5Zm2 5v2m12-2v2M7 13l-2-1m12 1 2-1M8 16h.01M16 16h.01" />,
  pound: <path d="M16 6.5A4 4 0 0 0 8.8 9v8M6 12h8M6 17h11" />,
  warning: <path d="M12 8v5m0 4h.01M10.2 4.8 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.8 4.8a2.1 2.1 0 0 0-3.6 0Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  pulse: <path d="M3 12h4l2-6 4 12 2-6h6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
};

function Icon({ name, className = "h-5 w-5", strokeWidth = 2 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
      {iconPaths[name] || iconPaths.engine}
    </svg>
  );
}

function stripTags(value = "") {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replaceAll("Â£", "£")
    .trim();
}

function PanelTitle({ block, isDark }) {
  return (
    <div className={`flex items-center gap-4 border-b px-4 py-4 md:px-5 ${isDark ? "border-[var(--color-border)]" : "border-[#dfe5ed]"}`}>
      <span className="shrink-0">
        <HomeIcon name={block.icon} isDark={isDark} className="h-7 w-7" />
      </span>
      <h3 className={`text-[1rem] font-bold uppercase leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>
        {block.title}
        {block.subtitle ? <span className="block text-[0.78rem]">{block.subtitle}</span> : null}
      </h3>
    </div>
  );
}

function DataPanel({ children, block, isDark, className = "" }) {
  return (
    <section className={`overflow-hidden rounded-md border shadow-[0_10px_28px_rgba(10,26,43,0.05)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#dfe5ed] bg-white"} ${className}`}>
      <PanelTitle block={block} isDark={isDark} />
      {children}
    </section>
  );
}

function EnginesTable({ data, isDark }) {
  return (
    <div>
      <div className={`grid grid-cols-[58px_1fr_1fr_1.1fr] border-b px-4 py-2 text-[0.68rem] font-bold uppercase ${isDark ? "border-[var(--color-border)] text-white/88" : "border-[#dfe5ed] text-[#071827]"}`}>
        {data.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {data.rows.map((row) => (
        <div key={stripTags(row.code) || row.rank} className={`grid grid-cols-[58px_1fr_1fr_1.1fr] border-b px-4 py-2.5 text-[0.88rem] last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[#e7ebf0]"}`}>
          <span className="text-center text-[1.15rem] font-bold leading-none text-[var(--color-primary)]">{row.rank}</span>
          <span className={`font-semibold ${isDark ? "text-white" : "text-[#071827]"}`} dangerouslySetInnerHTML={{ __html: row.code }} />
          <span className={`${isDark ? "text-white/76" : "text-[#172334]"}`}>{row.label}</span>
          <span className="font-medium text-[var(--color-primary)]">{row.enquiries}</span>
        </div>
      ))}
    </div>
  );
}

function ModelsTable({ data, isDark }) {
  return (
    <div>
      <div className={`grid grid-cols-[58px_1fr_1.1fr] border-b px-4 py-2 text-[0.68rem] font-bold uppercase ${isDark ? "border-[var(--color-border)] text-white/88" : "border-[#dfe5ed] text-[#071827]"}`}>
        {data.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {data.rows.map((row) => (
        <div key={row.model} className={`grid grid-cols-[58px_1fr_1.1fr] border-b px-4 py-2.5 text-[0.9rem] last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[#e7ebf0]"}`}>
          <span className="text-center text-[1.15rem] font-bold leading-none text-[var(--color-primary)]">{row.rank}</span>
          <span className={isDark ? "text-white" : "text-[#071827]"}>{row.model}</span>
          <span className="font-medium text-[var(--color-primary)]">{row.enquiries}</span>
        </div>
      ))}
    </div>
  );
}

function CostsTable({ data, isDark }) {
  return (
    <div>
      <div className={`grid grid-cols-[0.75fr_1.45fr] border-b px-5 py-2 text-[0.68rem] font-bold uppercase ${isDark ? "border-[var(--color-border)] text-white/88" : "border-[#dfe5ed] text-[#071827]"}`}>
        {data.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {data.rows.map((row) => (
        <div key={row.code} className={`grid grid-cols-[0.75fr_1.45fr] border-b px-5 py-2.5 text-[0.9rem] last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[#e7ebf0]"}`}>
          <span className={`font-bold ${isDark ? "text-white" : "text-[#071827]"}`}>{row.code}</span>
          <span className={`font-medium ${isDark ? "text-white/84" : "text-[#071827]"}`}>{row.cost.replaceAll("Â£", "£")}</span>
        </div>
      ))}
    </div>
  );
}

function FailuresTable({ data, isDark }) {
  return (
    <div>
      <div className={`grid grid-cols-[52px_1fr_110px] border-b px-4 py-2 text-[0.68rem] font-bold uppercase md:grid-cols-[58px_1fr_120px] ${isDark ? "border-[var(--color-border)] text-white/88" : "border-[#dfe5ed] text-[#071827]"}`}>
        {data.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {data.rows.map((row) => (
        <div key={row.rank} className={`grid grid-cols-[52px_1fr_110px] items-center border-b px-4 py-3 text-[0.88rem] last:border-b-0 md:grid-cols-[58px_1fr_120px] md:py-2.5 ${isDark ? "border-[var(--color-border)]" : "border-[#e7ebf0]"}`}>
          <span className="text-center text-[1.25rem] font-bold leading-none text-[var(--color-primary)]">{row.rank}</span>
          <span className={`pr-3 leading-snug ${isDark ? "text-white/84" : "text-[#071827]"}`} dangerouslySetInnerHTML={{ __html: row.failure }} />
          <span className={`justify-self-end rounded px-3 py-1 text-[0.78rem] font-bold ${riskClass[row.risk.type] || "bg-gray-100 text-gray-800"}`}>
            {row.risk.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function RegionChart({ data, isDark }) {
  return (
    <div className="grid gap-5 px-5 py-5 sm:grid-cols-[150px_1fr] sm:items-center md:grid-cols-[150px_1fr]">
      <div className="mx-auto h-36 w-36 rounded-full bg-[conic-gradient(#075fd8_0_35%,#166be8_35%_56%,#3d8dff_56%_74%,#74aaff_74%_84%,#dbe9ff_84%_100%)] p-9">
        <div className={`h-full w-full rounded-full ${isDark ? "bg-[var(--color-surface)]" : "bg-white"}`} />
      </div>
      <ul className="grid gap-4">
        {data.rows.map((row, index) => (
          <li key={row.region} className="grid grid-cols-[16px_1fr_auto_auto] items-center gap-3 text-[0.9rem]">
            <span className={`h-3.5 w-3.5 rounded-full ${index === 3 ? "bg-[#74aaff]" : "bg-[var(--color-primary)]"}`} />
            <span className={isDark ? "text-white/84" : "text-[#071827]"}>{row.region}</span>
            <strong className={isDark ? "text-white" : "text-[#071827]"}>{row.percentage}</strong>
            <span className="text-[0.7rem] font-medium text-[var(--color-primary)]">{row.source}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeedTable({ data, isDark }) {
  return (
    <div>
      <div className={`grid grid-cols-[1.2fr_0.95fr_1.2fr_0.9fr] border-b px-3 py-3 text-[0.58rem] font-bold uppercase sm:px-4 sm:text-[0.64rem] md:grid-cols-4 md:text-[0.68rem] ${isDark ? "border-[var(--color-border)] text-white/88" : "border-[#dfe5ed] text-[#071827]"}`}>
        {data.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {data.rows.map((row) => (
        <div key={`${row.vehicle}-${row.timestamp}`} className={`grid grid-cols-[1.2fr_0.95fr_1.2fr_0.9fr] border-b px-3 py-3 text-[0.78rem] last:border-b-0 sm:px-4 sm:text-[0.84rem] md:grid-cols-4 md:text-[0.88rem] ${isDark ? "border-[var(--color-border)] text-white/76" : "border-[#e7ebf0]"}`}>
          <span className={`pr-2 font-medium ${isDark ? "text-white" : "text-[#071827]"}`}>{row.vehicle}</span>
          <span>{row.location}</span>
          <span className="pr-2">{row.issue}</span>
          <span>{row.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

function MobileAccordion({ block, children, isDark }) {
  return (
    <details className={`group rounded-md border shadow-[0_10px_28px_rgba(10,26,43,0.06)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#dfe5ed] bg-white"}`}>
      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 marker:hidden">
        <span className="shrink-0">
          <HomeIcon name={block.icon} isDark={isDark} className="h-7 w-7" />
        </span>
        <h3 className={`min-w-0 flex-1 text-[1rem] font-bold uppercase leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>
          {block.title}
          {block.subtitle ? <span className="block text-[0.78rem]">{block.subtitle}</span> : null}
        </h3>
        <Icon name="chevron" className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className={`border-t overflow-x-auto ${isDark ? "border-[var(--color-border)]" : "border-[#dfe5ed]"}`}>{children}</div>
    </details>
  );
}

function StatsPanel({ stats, isDark }) {
  return (
    <ul className={`grid rounded-md border px-7 shadow-[0_10px_28px_rgba(10,26,43,0.05)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#dfe5ed] bg-white"}`}>
      {stats.map((stat) => (
        <li key={stat.label} className={`flex items-center gap-5 border-b py-6 last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[#e7ebf0]"}`}>
          <HomeIcon name={stat.icon} isDark={isDark} className="h-8 w-8" />
          <span>
            <strong className={`block text-[1.9rem] leading-none ${isDark ? "text-white" : "text-[#071827]"}`}>{stat.value}</strong>
            <span className={`mt-1 block text-[0.82rem] ${isDark ? "text-white/74" : "text-[#172334]"}`}>{stat.label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function HomeSec10({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`relative overflow-hidden px-4 py-7 md:px-6 md:py-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 hidden h-[330px] md:block">
        <Image src={data.headerImage.src} alt={data.headerImage.alt} fill className="object-cover object-center" sizes="100vw" />
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,#02070b_0%,rgba(2,7,11,0.94)_34%,rgba(2,7,11,0.42)_62%,rgba(2,7,11,0.92)_92%)]" : "absolute inset-0 bg-[linear-gradient(90deg,white_0%,rgba(255,255,255,0.94)_34%,rgba(255,255,255,0.42)_62%,rgba(255,255,255,0.92)_92%)]"} />
        <div className={isDark ? "absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,#02070b_0%,rgba(2,7,11,0)_100%)]" : "absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,white_0%,rgba(255,255,255,0)_100%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px] md:items-start">
          <div className="max-w-[690px]">
            <h2 className={`text-[2.55rem] font-bold leading-[1.08] tracking-normal md:text-[3rem] ${isDark ? "text-white" : "text-[#071827]"}`}>Jaguar Market Intelligence</h2>
            <div className="mt-4">
              <MStripe />
            </div>
            <p className={`mt-4 max-w-[620px] text-[0.92rem] leading-[1.55] ${isDark ? "text-white/78" : "text-[#172334]"}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
          </div>

          <div className="hidden md:block">
            <StatsPanel stats={data.stats} isDark={isDark} />
          </div>
        </div>

        <div className="mt-6 hidden grid-cols-3 gap-3 md:grid">
          <DataPanel block={data.engines} isDark={isDark}>
            <EnginesTable data={data.engines} isDark={isDark} />
          </DataPanel>
          <DataPanel block={data.models} isDark={isDark}>
            <ModelsTable data={data.models} isDark={isDark} />
          </DataPanel>
          <DataPanel block={data.replacementCosts} isDark={isDark}>
            <CostsTable data={data.replacementCosts} isDark={isDark} />
          </DataPanel>
          <DataPanel block={data.failures} isDark={isDark}>
            <FailuresTable data={data.failures} isDark={isDark} />
          </DataPanel>
          <DataPanel block={data.regionalDemand} isDark={isDark}>
            <RegionChart data={data.regionalDemand} isDark={isDark} />
          </DataPanel>
          <DataPanel block={data.liveFeed} isDark={isDark}>
            <FeedTable data={data.liveFeed} isDark={isDark} />
          </DataPanel>
        </div>

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

          <DataPanel block={data.failures} isDark={isDark} className="mt-3 shadow-[0_10px_28px_rgba(10,26,43,0.06)]">
            <FailuresTable data={data.failures} isDark={isDark} />
          </DataPanel>
          <DataPanel block={data.regionalDemand} isDark={isDark} className="shadow-[0_10px_28px_rgba(10,26,43,0.06)]">
            <RegionChart data={data.regionalDemand} isDark={isDark} />
          </DataPanel>
          <DataPanel block={data.liveFeed} isDark={isDark} className="shadow-[0_10px_28px_rgba(10,26,43,0.06)]">
            <FeedTable data={data.liveFeed} isDark={isDark} />
          </DataPanel>
        </div>

        <div className={`mt-5 flex items-center justify-center gap-2 border-t pt-3 text-center text-[0.82rem] md:mt-4 ${isDark ? "border-[var(--color-border)] text-white/74" : "border-[#dfe5ed] text-[#172334]"}`}>
          <Icon name="refresh" className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={2.2} />
          <p>{data.liveFeed.footer}</p>
        </div>

        <div className="mt-7 hidden h-3 items-center md:flex">
          <span className="h-full flex-[1.1] -skew-x-[28deg] bg-[var(--color-primary)]" />
          <span className="h-full flex-[1.25] -skew-x-[28deg] bg-[var(--color-chrome)]" />
          <span className="h-full flex-[1.8] -skew-x-[28deg] bg-[var(--color-accent-red)]" />
          <span className="h-full flex-[1.5] -skew-x-[28deg] bg-[linear-gradient(90deg,#ed1c24_0%,rgba(237,28,36,0)_100%)]" />
        </div>
      </div>
    </section>
  );
}
