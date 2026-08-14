"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const iconPaths = {
  check: <path d="m5 12 4 4L19 6" />,
  x: <path d="M8 8l8 8M16 8l-8 8" />,
  alert: <path d="M12 8v5m0 4h.01M12 3 2 21h20L12 3Z" />,
  dot: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />,
  car: <path d="M5 13 7 7h10l2 6M4 13h16v6H4v-6Zm2 0V9m12 4V9M7 17h.01M17 17h.01" />,
  drop: <path d="M12 3s7 7.1 7 12a7 7 0 0 1-14 0c0-4.9 7-12 7-12Z" />,
};

const toneClasses = {
  safe: "bg-[#25b85a] text-white",
  avoid: "bg-[#ed1c24] text-white",
  info: "bg-[var(--color-primary)] text-white",
  default: "text-current",
};

function Icon({ name, className = "h-5 w-5" }) {
  if (!name) return null;

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.dot}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function NumberBadge({ id, isDark }) {
  return (
    <span className={`absolute left-0 top-0 z-20 flex h-12 w-12 items-center justify-center rounded-br-xl rounded-tl-xl text-[1.35rem] font-bold text-white md:h-10 md:w-10 md:text-[1.2rem] ${isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"}`}>
      {id}
    </span>
  );
}

function OptionRow({ options, isDark }) {
  return (
    <div className={`flex items-center justify-center gap-4 border-t px-3 py-3 md:gap-5 ${isDark ? "border-[var(--color-border)]" : "border-[#dfe5ed]"}`}>
      {options.map((option, index) => (
        <div key={`${option.label}-${index}`} className="flex min-w-0 items-center gap-2">
          {index > 0 ? <span className={`mr-2 text-[0.8rem] font-bold ${isDark ? "text-white/78" : "text-[#071827]"}`}>vs</span> : null}
          {option.icon ? (
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${toneClasses[option.tone] || toneClasses.default}`}>
              <Icon name={option.icon} className="h-4 w-4" />
            </span>
          ) : null}
          <span className={`text-[0.98rem] font-bold leading-tight md:text-[1.05rem] ${isDark ? "text-white" : "text-[#071827]"}`}>{option.label}</span>
          {option.note ? <span className={`hidden text-[0.65rem] leading-tight lg:block ${isDark ? "text-white/74" : "text-[#27384a]"}`}>{option.note}</span> : null}
        </div>
      ))}
    </div>
  );
}

function ComparisonCard({ item, isDark }) {
  const options =
    item.options ||
    (item.vsLabels || []).map((label) => ({ label }));

  return (
    <article
      className={`relative overflow-hidden rounded-md border shadow-[0_12px_32px_rgba(10,26,43,0.08)] ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#d7dde6] bg-white"
      }`}
    >
      <NumberBadge id={item.id} isDark={isDark} />
      <div className="grid md:grid-cols-[minmax(260px,0.98fr)_minmax(280px,1fr)]">
        <div className={`min-w-0 border-b md:border-b-0 md:border-r ${isDark ? "border-[var(--color-border)]" : "border-[#dfe5ed]"}`}>
          <div className="relative h-40 md:h-36">
            <Image src={item.image.src} alt={item.image.alt} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 360px" />
            <div className={isDark ? "absolute inset-0 bg-[rgba(2,7,11,0.14)]" : "absolute inset-0 bg-[rgba(255,255,255,0.1)]"} />
          </div>
          <OptionRow options={options} isDark={isDark} />
        </div>

        <div className="flex min-w-0 flex-col p-4 md:p-5">
          <h3 className={`text-[1.35rem] font-bold leading-tight md:text-[1.25rem] ${isDark ? "text-white" : "text-[#071827]"}`}>{item.title}</h3>
          <p className={`mt-4 text-[0.81rem] leading-[1.5] md:mt-3 md:text-[0.9rem] ${isDark ? "text-white/78" : "text-[#172b4a]"}`} dangerouslySetInnerHTML={{ __html: item.preview }} />
          <Link href={item.link.href} className="mt-5 flex items-center justify-end gap-3 text-[0.95rem] font-semibold text-[var(--color-primary)] md:mt-auto md:text-[0.9rem]">
            <span>{item.link.label}</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function HomeSec5({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const fallbackImage =
    data.headerImages?.[0] ||
    data.headerImage || {
      src: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
      alt: "Jaguar comparisons",
    };
  const heroImage =
    (isDark ? data.heroImages?.dark : data.heroImages?.light) || fallbackImage;

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:py-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 hidden h-[330px] md:block">
        <Image src={heroImage.src} alt={heroImage.alt} fill className="object-cover object-[82%_center]" sizes="100vw" />
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,11,0.96)_0%,rgba(2,7,11,0.8)_38%,rgba(2,7,11,0.24)_76%)]" : "absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.9)_42%,rgba(255,255,255,0.08)_78%)]"} />
        <div className={isDark ? "absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,#02070b_0%,transparent_100%)]" : "absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,white_0%,transparent_100%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="max-w-[720px] pt-1 md:pt-9">
          <h2 className={`text-[2.1rem] font-bold leading-[1.03] tracking-normal md:text-[3.3rem] ${isDark ? "text-white" : "text-[#071827]"}`}>Comparison Hub — Head-to-Head Verdicts</h2>
          <div className="mt-4">
            <MStripe />
          </div>
          <p className={`mt-4 max-w-[690px] text-[0.85rem] leading-[1.55] md:text-[1.02rem] ${isDark ? "text-white/82" : "text-[#172b4a]"}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 md:gap-4">
          {data.comparisons.map((item) => (
            <ComparisonCard key={item.id} item={item} isDark={isDark} />
          ))}
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
