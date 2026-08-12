"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const iconPaths = {
  link: <path d="M10 13a5 5 0 0 0 7.1 0l1.4-1.4a5 5 0 0 0-7.1-7.1l-.8.8M14 11a5 5 0 0 0-7.1 0l-1.4 1.4a5 5 0 0 0 7.1 7.1l.8-.8" />,
  wrench: <path d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  trophy: <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
};

function cleanText(value = "") {
  return value
    .replaceAll("â€”", "-")
    .replaceAll("â€“", "-")
    .replaceAll("â†’", "")
    .replaceAll("â›“ï¸", "")
    .replaceAll("ðŸ”§", "")
    .replaceAll("ðŸ†", "")
    .trim();
}

function Icon({ name, className = "h-5 w-5", strokeWidth = 2 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.link}
    </svg>
  );
}

function iconName(item) {
  const title = item.title.toLowerCase();
  if (title.includes("m54") || title.includes("n63") || title.includes("s63")) return "trophy";
  if (title.includes("b58") || title.includes("b57") || title.includes("n57")) return "wrench";
  return "link";
}

function CentreCard({ item, isDark }) {
  return (
    <article className={`relative overflow-hidden rounded-md border shadow-[0_14px_34px_rgba(10,26,43,0.08)] ${isDark ? "border-[#223a51] bg-[rgba(7,23,36,0.9)]" : "border-[#dfe5ed] bg-white"}`}>
      <span className="absolute left-0 top-0 z-20 flex h-9 w-9 items-center justify-center rounded-br-md bg-[var(--color-primary)] text-[1.05rem] font-bold text-white md:h-8 md:w-8 md:text-[0.9rem]">
        {item.id}
      </span>

      <div className="relative h-38 md:h-30">
        <Image src={item.image.src} alt={item.image.alt} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 25vw" />
        <div className={isDark ? "absolute inset-x-0 bottom-0 h-14 bg-[linear-gradient(0deg,rgba(7,23,36,0.94)_0%,transparent_100%)]" : "absolute inset-x-0 bottom-0 h-14 bg-[linear-gradient(0deg,white_0%,rgba(255,255,255,0)_100%)]"} />
      </div>

      <span className={`absolute left-6 top-14 z-20 flex h-18 w-18 items-center justify-center rounded-full md:left-12 md:top-3 md:h-12 md:w-12 ${isDark ? "bg-[#0c2748] text-[#7fb0ff]" : "bg-[#eef5ff] text-[var(--color-primary)]"} border ${isDark ? "border-[#29445e]" : "border-[#b8d4ff]"}`}>
        <Icon name={iconName(item)} className="h-9 w-9 md:h-6 md:w-6" />
      </span>

      <div className="p-5 pt-2 md:p-4 md:pt-2">
        <h3 className={`text-[1.32rem] font-bold leading-tight md:text-[1.1rem] ${isDark ? "text-white" : "text-[#071827]"}`}>{item.title}</h3>
        <p className={`mt-4 text-[0.9rem] leading-[1.55] md:mt-3 md:text-[0.82rem] ${isDark ? "text-white/78" : "text-[#071827]"}`} dangerouslySetInnerHTML={{ __html: cleanText(item.description) }} />
        <Link href={item.link.href} className="mt-6 flex items-center justify-end gap-3 text-[0.95rem] font-bold text-[var(--color-primary)] md:mt-4 md:text-[0.82rem]">
          <span>{cleanText(item.link.label)}</span>
          <Icon name="arrow" className="h-5 w-5" />
        </Link>
      </div>
    </article>
  );
}

export default function HomeSec8({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:py-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 h-[520px] md:h-[330px]">
        <Image src={data.headerImage.src} alt={data.headerImage.alt} fill className="object-cover object-[82%_center]" sizes="100vw" />
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,11,0.98)_0%,rgba(2,7,11,0.82)_40%,rgba(2,7,11,0.22)_78%)]" : "absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.9)_43%,rgba(255,255,255,0.32)_78%)]"} />
        <div className="absolute right-0 top-0 h-full w-12 -skew-x-[32deg] bg-[rgba(21,129,255,0.34)] md:w-10" />
        <div className="absolute right-[2.5rem] top-0 h-full w-4 -skew-x-[32deg] bg-[rgba(21,129,255,0.52)] md:right-[38%]" />
        <div className={isDark ? "absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,#02070b_0%,transparent_100%)]" : "absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,white_0%,transparent_100%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="max-w-[680px] pt-4 md:pt-8">
          <h2 className={`text-[2.75rem] font-bold leading-[1.04] tracking-normal md:text-[3.25rem] ${isDark ? "text-white" : "text-[#071827]"}`} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <div className="mt-5">
            <MStripe />
          </div>
          <p className={`mt-6 max-w-[610px] whitespace-pre-line text-[0.9rem] leading-[1.6] md:text-[1rem] ${isDark ? "text-white/80" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline).replace(". Every guide", ".\n\nEvery guide") }} />
        </div>

        <div className="mt-10 grid gap-4 md:mt-8 md:grid-cols-4 md:gap-4">
          {data.centres.map((item) => (
            <CentreCard key={item.id} item={item} isDark={isDark} />
          ))}
        </div>

        <div className="mt-8 hidden h-3 items-center md:flex">
          <span className="h-full flex-[1.3] -skew-x-[28deg] bg-[var(--color-primary)]" />
          <span className="h-full flex-[1.15] -skew-x-[28deg] bg-[#6f98df]" />
          <span className="h-full flex-[1.6] -skew-x-[28deg] bg-[#8a6fa2]" />
          <span className="h-full flex-[1.2] -skew-x-[28deg] bg-[var(--color-accent-red)]" />
          <span className="h-full flex-[0.35] -skew-x-[28deg] bg-[linear-gradient(90deg,#ed1c24_0%,rgba(237,28,36,0)_100%)]" />
        </div>
      </div>
    </section>
  );
}
