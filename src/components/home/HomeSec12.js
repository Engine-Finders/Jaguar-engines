"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const iconPaths = {
  chart: <path d="M4 19V9m5 10V5m5 14v-7m5 7H3" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.5 1.5L15 10" />,
  wrench: <path d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  trophy: <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
};

function cleanText(value = "") {
  return value
    .replaceAll("â€”", "-")
    .replaceAll("ðŸ“Š", "")
    .replaceAll("ðŸ’š", "")
    .replaceAll("ðŸ”§", "")
    .replaceAll("ðŸ†", "")
    .trim();
}

function Icon({ name, className = "h-5 w-5", strokeWidth = 2 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.chart}
    </svg>
  );
}

function signalIcon(title) {
  const lower = title.toLowerCase();
  if (lower.includes("real data")) return "chart";
  if (lower.includes("not to repair")) return "shield";
  if (lower.includes("specialists")) return "wrench";
  return "trophy";
}

export default function HomeSec12({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 h-[320px] md:h-[260px]">
        <Image src={data.headerImage.src} alt={data.headerImage.alt} fill className="object-cover object-[72%_center]" sizes="100vw" />
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,#02070b_0%,rgba(2,7,11,0.92)_42%,rgba(2,7,11,0.24)_78%)]" : "absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.92)_42%,rgba(255,255,255,0.24)_78%)]"} />
        <div className={isDark ? "absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,#02070b_0%,transparent_100%)]" : "absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,white_0%,transparent_100%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="max-w-[680px] pt-4 md:pt-7">
          <h2 className={`text-[2.7rem] font-bold leading-[1.04] tracking-normal md:text-[3.25rem] ${isDark ? "text-white" : "text-[#071827]"}`}>Why Jaguar Owners Trust This Site</h2>
          <div className="mt-4">
            <MStripe />
          </div>
          <p className={`mt-5 max-w-[620px] text-[0.9rem] leading-[1.58] md:text-[1rem] ${isDark ? "text-white/78" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-7 md:grid-cols-4 md:gap-4">
          {data.signals.map((item) => (
            <article key={item.id} className={`rounded-md border p-4 shadow-[0_12px_28px_rgba(10,26,43,0.06)] ${isDark ? "border-[#223343] bg-[rgba(10,21,32,0.92)]" : "border-[#dfe5ed] bg-white"}`}>
              <div className="mb-3 flex items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-md text-[0.85rem] font-bold text-white ${isDark ? "bg-[#0c2748]" : "bg-[var(--color-primary)]"}`}>
                  {item.id}
                </span>
                <span className={`flex h-10 w-10 items-center justify-center rounded-full border ${isDark ? "border-[#2f4860] bg-[#0c2748] text-[#7fb0ff]" : "border-[#cfe0ff] bg-[#eef5ff] text-[var(--color-primary)]"}`}>
                  <Icon name={signalIcon(item.title)} className="h-5 w-5" strokeWidth={2.1} />
                </span>
              </div>
              <h3 className={`text-[1rem] font-bold leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>{item.title}</h3>
              <p className={`mt-3 text-[0.86rem] leading-[1.52] ${isDark ? "text-white/76" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: cleanText(item.description) }} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
