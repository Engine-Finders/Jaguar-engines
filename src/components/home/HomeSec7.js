"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const iconPaths = {
  chart: <path d="M4 19V9m5 10V5m5 14v-7m5 7H3" />,
  wrench: <path d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  book: <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22V6.5Zm16 0A2.5 2.5 0 0 0 17.5 4H13v16h4.5A2.5 2.5 0 0 1 20 22V6.5Z" />,
  trophy: <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
  droplet: <path d="M12 3s7 7.1 7 12a7 7 0 0 1-14 0c0-4.9 7-12 7-12Z" />,
  pump: <path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M7 7h5m3 1 3 3v7a2 2 0 0 0 4 0v-5a3 3 0 0 0-3-3h-1" />,
  check: <path d="m5 12 4 4L19 6" />,
  x: <path d="M8 8l8 8M16 8l-8 8" />,
  warning: <path d="M12 8v5m0 4h.01M10 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L14 4.9a2 2 0 0 0-3.48 0Z" />,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
  bulb: <path d="M9 18h6m-5 3h4m-6-7a6 6 0 1 1 8 0c-.8.6-1.2 1.5-1.2 2.5H9.2c0-1-.4-1.9-1.2-2.5Z" />,
  chevron: <path d="m9 6 6 6-6 6" />,
};

const verdictIcons = {
  watch: { icon: "warning", color: "text-[#f59e0b]" },
  safe: { icon: "check", color: "text-[#138a32]" },
  best: { icon: "trophy", color: "text-[var(--color-primary)]" },
  avoid: { icon: "x", color: "text-[#ed1c24]" },
  solid: { icon: "star", color: "text-[var(--color-primary)]" },
};

const trustIconByIndex = ["chart", "wrench", "book", "trophy"];

function cleanText(value = "") {
  return value
    .replaceAll("â€”", "-")
    .replaceAll("â€“", "-")
    .replaceAll("ðŸ“Š", "")
    .replaceAll("ðŸ”§", "")
    .replaceAll("ðŸ“–", "")
    .replaceAll("ðŸ†", "")
    .replaceAll("ðŸ›¢ï¸", "")
    .replaceAll("â›½", "")
    .replaceAll("âš ï¸", "")
    .replaceAll("âœ…", "")
    .replaceAll("ðŸ”´", "")
    .replaceAll("â­", "")
    .trim();
}

function stripTags(value = "") {
  return cleanText(value).replace(/<[^>]*>/g, "").trim();
}

function unlinkHtml(value = "") {
  return cleanText(value).replace(
    /<a\b[^>]*>([\s\S]*?)<\/a>/gi,
    '<span class="font-semibold text-[var(--color-primary)]">$1</span>'
  );
}

function Icon({ name, className = "h-5 w-5", strokeWidth = 2 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.chart}
    </svg>
  );
}

function FuelIcon({ fuel, className = "h-6 w-6" }) {
  return <Icon name={fuel === "Petrol" ? "pump" : "droplet"} className={`${className} text-[var(--color-primary)]`} strokeWidth={2.1} />;
}

function VerdictIcon({ type, mobile = false }) {
  const config = verdictIcons[type] || verdictIcons.solid;

  if (type === "safe" || type === "avoid") {
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-full border-2 ${mobile ? "h-9 w-9" : "h-7 w-7"} ${config.color}`}>
        <Icon name={config.icon} className={mobile ? "h-6 w-6" : "h-4.5 w-4.5"} strokeWidth={2.3} />
      </span>
    );
  }

  return (
    <span className={`flex shrink-0 items-center justify-center ${config.color}`}>
      <Icon name={config.icon} className={mobile ? "h-10 w-10" : "h-7 w-7"} strokeWidth={type === "warning" ? 1.8 : 2} />
    </span>
  );
}

function EngineCell({ row }) {
  return (
    <div className="min-w-0">
      <p className="text-[1.02rem] font-bold leading-tight md:text-[1.08rem]" dangerouslySetInnerHTML={{ __html: unlinkHtml(row.code) }} />
      <p className="mt-1 text-[0.75rem] font-medium leading-tight text-[var(--color-primary)] md:text-[0.78rem]">{cleanText(row.spec)}</p>
    </div>
  );
}

function EnquiryCell({ row }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.98rem] font-bold leading-tight md:text-[0.95rem]">{cleanText(row.enquiries)}</p>
      <p className="mt-1 text-[0.76rem] font-semibold leading-tight text-[var(--color-primary)] md:text-[0.78rem]">{row.sourceTag}</p>
    </div>
  );
}

function EngineRow({ row, isDark }) {
  const verdictType = row.verdict.type;

  return (
    <Link
      href={row.href}
      className={`grid grid-cols-[minmax(76px,0.95fr)_minmax(106px,1.22fr)_minmax(116px,1.32fr)_40px] items-center border-b px-3 py-3.5 last:border-b-0 md:grid-cols-[minmax(170px,1.05fr)_minmax(130px,0.78fr)_minmax(140px,0.82fr)_minmax(170px,1.05fr)_minmax(390px,2.2fr)] md:px-9 md:py-3.5 ${
        isDark ? "border-[var(--color-border)] text-white hover:bg-[var(--color-page-soft)]" : "border-[#e3e8ef] text-[#071827] hover:bg-[#f8fbff]"
      }`}
    >
      <EngineCell row={row} />

      <div className={`grid min-w-0 gap-1.5 border-l pl-3 md:contents ${isDark ? "border-[var(--color-border)]" : "border-[#dfe7f1]"}`}>
        <p className="flex items-center gap-3 text-[0.84rem] leading-tight md:text-[0.92rem]">
          <FuelIcon fuel={row.fuel} className="h-6 w-6 md:h-6 md:w-6" />
          <span>{row.fuel}</span>
        </p>
        <p className={`text-[0.82rem] leading-[1.22] md:text-[0.9rem] ${isDark ? "text-white/78" : "text-[#071827]"}`}>{cleanText(row.years)}</p>
      </div>

      <EnquiryCell row={row} />

      <div className="flex justify-center md:hidden">
        <VerdictIcon type={verdictType} mobile />
      </div>

      <div className="hidden min-w-0 items-start gap-6 md:flex">
        <VerdictIcon type={verdictType} />
        <p className="text-[0.84rem] leading-[1.42]">
          <span className="font-medium">{row.verdict.label}</span>
          {" - "}
          <span dangerouslySetInnerHTML={{ __html: unlinkHtml(row.verdict.text) }} />
        </p>
      </div>
    </Link>
  );
}

function TrustStrip({ items, isDark }) {
  return (
    <ul className={`grid grid-cols-4 overflow-hidden rounded-md border shadow-[0_16px_36px_rgba(10,26,43,0.08)] md:hidden ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#dfe5ed] bg-white"}`}>
      {items.map((item, index) => {
        const text = cleanText(item.label);
        const parts = text.match(/^(Powered by|20\+ vetted|OEM part|Part of)\s*(.*)$/);

        return (
          <li key={item.label} className={`flex min-w-0 flex-col items-center border-r px-2 py-5 text-center last:border-r-0 ${isDark ? "border-[var(--color-border)]" : "border-[#dfe7f1]"}`}>
            <Icon name={trustIconByIndex[index] || "chart"} className="h-8 w-8 text-[var(--color-primary)]" strokeWidth={2.2} />
            <span className={`mt-3 text-[0.78rem] leading-[1.28] ${isDark ? "text-white/78" : "text-[#172b4a]"}`}>
              {parts ? parts[1] : text}
              {parts?.[2] ? <strong className={isDark ? "block text-white" : "block text-[#071827]"}>{parts[2]}</strong> : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function EngineTable({ data, isDark }) {
  return (
    <div className={`overflow-hidden rounded-md border shadow-[0_16px_36px_rgba(10,26,43,0.08)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#dfe5ed] bg-white"}`}>
      <div className={`grid grid-cols-[minmax(76px,0.95fr)_minmax(106px,1.22fr)_minmax(116px,1.32fr)_40px] border-b px-3 py-3.5 text-[0.68rem] font-bold uppercase text-[var(--color-primary)] md:grid-cols-[minmax(170px,1.05fr)_minmax(130px,0.78fr)_minmax(140px,0.82fr)_minmax(170px,1.05fr)_minmax(390px,2.2fr)] md:px-9 md:py-3.5 md:text-[0.82rem] ${isDark ? "border-[var(--color-border)]" : "border-[#e3e8ef]"}`}>
        <span>{data.columns[0]}</span>
        <span className={`border-l pl-4 md:border-l-0 md:pl-0 ${isDark ? "border-[var(--color-border)]" : "border-[#dfe7f1]"}`}>
          Fuel
          <span className="block md:hidden">Years</span>
        </span>
        <span className="hidden md:block">{data.columns[2]}</span>
        <span>{data.columns[3]}</span>
        <span className="text-center md:text-left">{data.columns[4]}</span>
      </div>

      {data.engines.map((row) => (
        <EngineRow key={stripTags(row.code) || row.href} row={row} isDark={isDark} />
      ))}
    </div>
  );
}

function LegendCard({ legend, isDark }) {
  return (
    <Link href={legend.href} className={`flex items-center gap-5 rounded-md border p-5 shadow-[0_16px_36px_rgba(10,26,43,0.08)] md:hidden ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)] text-white" : "border-[#dfe5ed] bg-white text-[#071827]"}`}>
      <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-md text-white shadow-[0_12px_26px_rgba(7,95,216,0.28)] ${isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"}`}>
        <Icon name="bulb" className="h-9 w-9" />
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-[1rem]">{legend.title}</strong>
        <span className={`mt-1 block text-[0.82rem] leading-[1.4] ${isDark ? "text-white/76" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: legend.text }} />
      </span>
      <Icon name="chevron" className="h-6 w-6 shrink-0" />
    </Link>
  );
}

export default function HomeSec7({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`relative overflow-hidden px-2 py-7 md:py-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 h-[560px] md:h-[330px]">
        <Image src={data.headerImage.src} alt={data.headerImage.alt} fill className="object-cover object-[72%_center]" sizes="100vw" />
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,11,0.98)_0%,rgba(2,7,11,0.84)_37%,rgba(2,7,11,0.12)_78%)]" : "absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.9)_38%,rgba(255,255,255,0.18)_78%)]"} />
        <div className="absolute right-[26%] top-0 h-full w-5 -skew-x-[32deg] bg-[rgba(21,129,255,0.55)] md:right-[50%]" />
        <div className="absolute right-2 top-0 h-full w-16 -skew-x-[32deg] bg-[rgba(21,129,255,0.38)] md:right-0 md:w-12" />
        <div className={isDark ? "absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,#02070b_0%,transparent_100%)]" : "absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,white_0%,transparent_100%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="max-w-[640px] pt-4 md:pt-8">
          <h2 className={`text-[3rem] font-bold leading-[1.03] tracking-normal md:text-[3.6rem] ${isDark ? "text-white" : "text-[#071827]"}`}>Jaguar Engine Families — The Pillars</h2>
          <div className="mt-4">
            <MStripe />
          </div>
          <p className={`mt-5 max-w-[610px] text-[0.94rem] leading-[1.55] md:text-[1.02rem] ${isDark ? "text-white/80" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }} />
        </div>

        <div className="mt-8 md:hidden">
          <TrustStrip items={data.trustStrip} isDark={isDark} />
        </div>

        <div className="mt-7 md:mt-6">
          <EngineTable data={data} isDark={isDark} />
        </div>

        <div className="mt-8">
          <LegendCard legend={data.legend} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
