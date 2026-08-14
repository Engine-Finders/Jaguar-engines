"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const severityConfig = {
  catastrophic: { dot: "bg-[#ff2b2b]", text: "text-[#07113a]" },
  immediate: { dot: "bg-[#ff8a00]", text: "text-[#07113a]" },
  monitor: { dot: "bg-[#ffd400]", text: "text-[#07113a]" },
  low: { dot: "bg-[#25a844]", text: "text-[#07113a]" },
};

const iconPaths = {
  gear: (
    <>
      <path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z" />
      <path d="m19.4 15.1.1 2.2-2.2 2.2-2.2-.9-1.3.5-.9 2.1H9.8l-.9-2.1-1.3-.5-2.2.9-2.2-2.2.1-2.2-.6-1.2-2-1v-3.1l2-1 .6-1.2-.1-2.2 2.2-2.2 2.2.9 1.3-.5.9-2.1h3.1l.9 2.1 1.3.5 2.2-.9 2.2 2.2-.1 2.2.6 1.2 2 1v3.1l-2 1-.6 1.2Z" />
    </>
  ),
  warning: (
    <>
      <path d="M12 7.5v5.4" />
      <path d="M12 16.5h.01" />
      <path d="M10.2 4.8 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.8 4.8a2.1 2.1 0 0 0-3.6 0Z" />
    </>
  ),
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
};

function Icon({ name, className = "h-5 w-5", strokeWidth = 2 }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      {iconPaths[name] || iconPaths.gear}
    </svg>
  );
}

function Severity({ severity }) {
  const config = severityConfig[severity.type] || severityConfig.monitor;

  return (
    <span className={`inline-flex items-center gap-2 text-[0.86rem] leading-none md:gap-3 md:text-[0.95rem] ${config.text}`}>
      <span className={`h-4 w-4 shrink-0 rounded-full ${config.dot}`} />
      <span>{severity.label}</span>
    </span>
  );
}

function SectionIcon({ icon, isDark }) {
  return (
    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded text-white md:h-9 md:w-11 ${isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"}`}>
      <Icon name={icon} className="h-7 w-7 md:h-5 md:w-5" strokeWidth={2.3} />
    </span>
  );
}

function TableHeader({ block, isDark }) {
  return (
    <div className={`flex items-center border-b ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#dfe5ed] bg-white"}`}>
      <SectionIcon icon={block.icon} isDark={isDark} />
      <h3 className={`px-4 py-3 text-[1.15rem] font-bold uppercase text-[var(--color-primary)] md:py-2 md:text-[1rem] ${isDark ? "md:text-white" : "md:text-[#071827]"}`}>
        {block.title}
      </h3>
    </div>
  );
}

function DesktopRows({ block, isDark }) {
  return (
    <div className="hidden md:block">
      <div className={`grid grid-cols-[60px_minmax(230px,0.95fr)_minmax(420px,1.8fr)_180px_170px] border-b text-[0.72rem] font-bold uppercase ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)] text-white/88" : "border-[#dfe5ed] bg-[#fbfcfe] text-[#071827]"}`}>
        {block.columns.map((column) => (
          <span key={column} className={`border-r px-6 py-2 last:border-r-0 ${isDark ? "border-[var(--color-border)]" : "border-[#e5e9ef]"}`}>
            {column}
          </span>
        ))}
      </div>

      {block.rows.map((row) => (
        <div
          key={row.id}
          className={`grid grid-cols-[60px_minmax(230px,0.95fr)_minmax(420px,1.8fr)_180px_170px] border-b last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[#e5e9ef]"}`}
        >
          <div className={`border-r px-6 py-4 text-[1.55rem] font-bold leading-none text-[var(--color-primary)] ${isDark ? "border-[var(--color-border)]" : "border-[#e5e9ef]"}`}>
            {row.id}
          </div>
          <div
            className={`border-r px-6 py-4 text-[1rem] font-bold leading-tight ${isDark ? "border-[var(--color-border)] text-white" : "border-[#e5e9ef] text-[#071827]"}`}
            dangerouslySetInnerHTML={{ __html: row.title }}
          />
          <p className={`border-r px-6 py-3 text-[0.82rem] leading-[1.25] ${isDark ? "border-[var(--color-border)] text-white/76" : "border-[#e5e9ef] text-[#171f2a]"}`} dangerouslySetInnerHTML={{ __html: row.description }} />
          <div className={`border-r px-6 py-4 ${isDark ? "border-[var(--color-border)]" : "border-[#e5e9ef]"}`}>
            <Severity severity={row.severity} />
          </div>
          <Link href={row.link.href} className="flex items-center gap-3 px-6 py-4 text-[0.9rem] font-medium text-[var(--color-primary)]">
            {row.link.label}
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      ))}
    </div>
  );
}

function MobileRows({ block, isDark }) {
  return (
    <div className="md:hidden">
      {block.rows.map((row) => (
        <div key={row.id} className={`border-b px-4 py-4 last:border-b-0 ${isDark ? "border-[var(--color-border)]" : "border-[#dfe5ed]"}`}>
          <div className="flex items-start gap-3">
            <span className="w-8 shrink-0 text-[1.65rem] font-bold leading-none text-[var(--color-primary)]">
              {row.id}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className={`text-[1.05rem] font-bold leading-tight ${isDark ? "text-white" : "text-[#07113a]"}`} dangerouslySetInnerHTML={{ __html: row.title }} />
              <div className="mt-2">
                <Severity severity={row.severity} />
              </div>
            </div>
          </div>
          <p className={`mt-3 text-[0.86rem] leading-[1.48] ${isDark ? "text-white/78" : "text-[#07113a]"}`} dangerouslySetInnerHTML={{ __html: row.description }} />
          <Link href={row.link.href} className="mt-4 inline-flex items-center gap-3 text-[0.95rem] font-bold text-[var(--color-primary)]">
            {row.link.label}
            <Icon name="arrow" className="h-5 w-5" />
          </Link>
        </div>
      ))}
    </div>
  );
}

function FailureTable({ block, isDark }) {
  return (
    <div className={`border-y md:overflow-hidden md:rounded-md md:border md:shadow-[0_12px_32px_rgba(10,26,43,0.06)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#dfe5ed] bg-white"}`}>
      <TableHeader block={block} isDark={isDark} />
      <DesktopRows block={block} isDark={isDark} />
      <MobileRows block={block} isDark={isDark} />
    </div>
  );
}

function UrgencyKey({ items, isDark }) {
  return (
    <div className={`border-y px-4 py-4 md:rounded-md md:border md:px-8 md:shadow-[0_12px_32px_rgba(10,26,43,0.04)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#dfe5ed] bg-white"}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
        <p className={`text-[0.9rem] font-bold uppercase md:mr-2 ${isDark ? "text-white" : "text-[#071827]"}`}>Urgency Key:</p>
        {items.map((item) => (
          <div key={item.label} className={`flex items-center gap-3 text-[0.88rem] ${isDark ? "text-white/84" : "text-[#071827]"}`}>
            <span className={`h-4 w-4 shrink-0 rounded-full ${(severityConfig[item.type] || severityConfig.monitor).dot}`} />
            <span>
              <strong>{item.label}</strong> - <span dangerouslySetInnerHTML={{ __html: item.text }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeSec9({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`relative overflow-hidden px-4 py-8 md:px-6 md:py-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 h-[390px] md:h-[295px]">
        <Image
          src={data.headerImage.src}
          alt={data.headerImage.alt}
          fill
          className="object-cover object-[88%_top] md:object-[82%_center]"
          sizes="100vw"
        />
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(115deg,#02070b_0%,rgba(2,7,11,0.98)_42%,rgba(2,7,11,0.72)_66%,rgba(2,7,11,0.18)_100%)] md:bg-[linear-gradient(90deg,#02070b_0%,rgba(2,7,11,0.95)_38%,rgba(2,7,11,0.45)_70%,rgba(2,7,11,0.2)_100%)]" : "absolute inset-0 bg-[linear-gradient(115deg,white_0%,rgba(255,255,255,0.98)_42%,rgba(255,255,255,0.68)_66%,rgba(255,255,255,0.18)_100%)] md:bg-[linear-gradient(90deg,white_0%,rgba(255,255,255,0.96)_38%,rgba(255,255,255,0.45)_70%,rgba(255,255,255,0.2)_100%)]"} />
        <div className={isDark ? "absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,#02070b_0%,rgba(2,7,11,0)_100%)]" : "absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,white_0%,rgba(255,255,255,0)_100%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="max-w-[740px] pt-3 md:pt-6">
          <h2 className={`text-[2.9rem] font-bold leading-[1.03] tracking-normal md:text-[3.45rem] ${isDark ? "text-white" : "text-[#07113a] md:text-black"}`}>The Jaguar Failure Database</h2>
          <div className="mt-4">
            <MStripe />
          </div>
          <p className={`mt-5 max-w-[665px] text-[0.92rem] leading-[1.55] md:text-[1rem] ${isDark ? "text-white/78" : "text-[#07113a] md:text-[#171f2a]"}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
        </div>

        <div className="mt-8 -mx-4 grid gap-4 md:mx-0 md:mt-5">
          <FailureTable block={data.engineFailures} isDark={isDark} />
          <FailureTable block={data.warningSigns} isDark={isDark} />
          <UrgencyKey items={data.urgencyKey} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
