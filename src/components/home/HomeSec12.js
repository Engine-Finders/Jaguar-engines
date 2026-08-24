"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const ICON_LG = "h-12 w-12 md:h-14 md:w-14";

function cleanText(value = "") {
  return String(value || "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replaceAll("✅", "")
    .trim();
}

function formatAnswer(value = "") {
  return cleanText(value).replace(
    /<span class=["']safe-verdict["']>([\s\S]*?)<\/span>/gi,
    '<span class="inline-flex items-center gap-1 font-semibold text-[#1c8b3d]"><svg aria-hidden="true" viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>$1</span>'
  );
}

function ChevronIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function TrustCard({ item, isDark }) {
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-xl border px-3.5 pb-3.5 pt-5 md:px-4 md:pb-4 md:pt-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_22px_rgba(16,18,16,0.05)]"
      }`}
    >
      {/* Number tab — top left like ref */}
      <span
        className={`absolute left-0 top-0 flex h-[22px] min-w-[26px] items-center justify-center rounded-br-md px-1.5 text-[0.72rem] font-bold ${
          isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
        }`}
      >
        {item.id}
      </span>

      {/* Icon left — title right */}
      <div className="mt-1 flex items-center gap-3 md:gap-3.5">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full md:h-16 md:w-16 ${
            isDark ? "bg-white/10" : "bg-[#ececeb]"
          }`}
        >
          <HomeIcon name={item.icon} isDark={isDark} className={ICON_LG} />
        </div>

        <h3
          className={`min-w-0 flex-1 text-[0.9rem] font-bold leading-tight md:text-[0.95rem] ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {item.title}
        </h3>
      </div>

      {/* Description full-width below the icon row */}
      <p
        className={`mt-2.5 text-[0.76rem] leading-[1.4] md:mt-3 md:text-[0.78rem] ${
          isDark ? "text-white/70" : "text-[var(--color-text-muted)]"
        }`}
        dangerouslySetInnerHTML={{ __html: cleanText(item.description) }}
      />
    </article>
  );
}

function FaqItem({ item, isDark }) {
  return (
    <details
      className={`group border-b last:border-b-0 ${
        isDark ? "border-[var(--color-border)]" : "border-[#ececeb]"
      }`}
    >
      <summary
        className={`flex cursor-pointer list-none items-start gap-2.5 px-3.5 py-3 marker:hidden md:gap-3 md:px-4 md:py-3 ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-bold md:h-7 md:w-7 ${
            isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
          }`}
        >
          {item.id}
        </span>
        <span className="min-w-0 flex-1 pt-0.5 text-[0.84rem] font-semibold leading-snug md:text-[0.9rem]">
          {item.question}
        </span>
        <ChevronIcon
          className={`mt-0.5 h-4 w-4 shrink-0 transition-transform group-open:rotate-180 md:h-5 md:w-5 ${
            isDark ? "text-white/55" : "text-[#8a8a88]"
          }`}
        />
      </summary>
      <div className="px-3.5 pb-3 pl-[2.75rem] md:px-4 md:pb-3.5 md:pl-[3.1rem]">
        <p
          className={`text-[0.76rem] leading-[1.45] md:text-[0.8rem] ${
            isDark ? "text-white/70" : "text-[var(--color-text-muted)]"
          }`}
          dangerouslySetInnerHTML={{ __html: formatAnswer(item.answer) }}
        />
      </div>
    </details>
  );
}

function FaqBlock({ faq, isDark }) {
  if (!faq?.items?.length) return null;

  const left = faq.items.slice(0, 3);
  const right = faq.items.slice(3, 6);

  return (
    <div
      className={`mt-4 overflow-hidden rounded-xl border md:mt-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_24px_rgba(16,18,16,0.05)]"
      }`}
    >
      <div className={`border-b px-4 py-3 md:px-5 md:py-3.5 ${isDark ? "border-[var(--color-border)]" : "border-[#ececeb]"}`}>
        <h3 className={`font-serif text-[1.15rem] font-semibold md:text-[1.3rem] ${isDark ? "text-white" : "text-black"}`}>
          {faq.title}
        </h3>
      </div>

      <div className="grid md:grid-cols-2">
        <div className={isDark ? "md:border-r md:border-[var(--color-border)]" : "md:border-r md:border-[#ececeb]"}>
          {left.map((item) => (
            <FaqItem key={item.id} item={item} isDark={isDark} />
          ))}
        </div>
        <div>
          {right.map((item) => (
            <FaqItem key={item.id} item={item} isDark={isDark} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomeSec12({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headerImage = data.headerImage || {
    src: "/home-image/sec2-bg.webp",
    alt: "Jaguar trust",
  };
  const signals = data.signals || [];
  const sectionBg = "bg-[var(--color-page)]";

  return (
    <section className={`overflow-x-hidden ${sectionBg}`}>
      {/* Header — same pattern as other home sections */}
      <div className={`relative overflow-hidden ${sectionBg}`}>
        <div className="absolute inset-y-0 right-0 w-[62%] md:w-[48%]">
          <Image
            src={headerImage.src}
            alt={headerImage.alt || ""}
            fill
            className="object-cover object-right"
            sizes="(max-width: 768px) 62vw, 48vw"
          />
          <div
            className={
              isDark
                ? "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(11,12,12,0.82)_34%,rgba(11,12,12,0.18)_100%)]"
                : "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(243,243,241,0.88)_34%,rgba(243,243,241,0.18)_100%)]"
            }
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-5 md:px-6 md:pb-3.5 md:pt-7 lg:px-8">
          <div className="max-w-[720px]">
            <p
              className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
              }`}
            >
              Trust + FAQ
            </p>
            <h2
              className={`mt-1.5 whitespace-nowrap text-[1.55rem] font-bold leading-[0.98] sm:text-[1.85rem] md:text-[2.45rem] md:leading-[0.96] lg:text-[2.6rem] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Why Jaguar Owners{" "}
              <span className="text-[var(--color-chrome-bright)]">Trust This Site</span>
            </h2>
            <div className="mt-2.5">
              <MStripe />
            </div>
            <p
              className={`mt-2 max-w-[560px] text-[0.86rem] leading-[1.35] md:text-[0.95rem] md:leading-[1.4] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-8xl px-4 pb-5 pt-2 md:px-6 md:pb-6 md:pt-2.5 lg:px-8">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {signals.map((item) => (
            <TrustCard key={item.id} item={item} isDark={isDark} />
          ))}
        </div>

        <FaqBlock faq={data.faq} isDark={isDark} />
      </div>
    </section>
  );
}
