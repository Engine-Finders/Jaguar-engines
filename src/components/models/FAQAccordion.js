"use client";

import MStripe from "@/components/reusableComponents/MStripe";
import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionBody } from "@/components/models/sectionTypography";

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Ãƒâ€šÃ‚Â£", "\u00a3")
    .replaceAll("Ã‚Â£", "\u00a3")
    .replaceAll("Ã¢â‚¬â€œ", "-")
    .replaceAll("Ã¢â‚¬â€", "-")
    .replaceAll("Ã¢â€ â€™", "->")
    .replaceAll("✅", "")
    .replaceAll("❌", "")
    .replace(/\s+-\s+/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatAnswer(value = "") {
  return cleanText(value).replace(
    /<span class=["']safe-verdict["']>([\s\S]*?)<\/span>/gi,
    '<span class="inline-flex items-center gap-1 font-semibold text-[#1c8b3d]"><svg aria-hidden="true" viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>$1</span>'
  );
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const marker = "Frequently Asked Questions";
  const index = clean.indexOf(marker);

  if (index === -1) return { before: clean, accent: "" };

  return {
    before: clean.slice(0, index).trim(),
    accent: clean.slice(index).trim(),
  };
}

function ChevronIcon({ className = "h-5 w-5", isDark }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${className} ${isDark ? "text-white/55" : "text-[#8a8a88]"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
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
          {cleanText(item.question)}
        </span>
        <ChevronIcon
          className="mt-0.5 h-4 w-4 shrink-0 transition-transform group-open:rotate-180 md:h-5 md:w-5"
          isDark={isDark}
        />
      </summary>
      <div className="px-3.5 pb-3 pl-[2.75rem] md:px-4 md:pb-3.5 md:pl-[3.1rem]">
        <p
          className={`${sectionBody} text-[0.76rem] leading-[1.45] md:text-[0.8rem] ${
            isDark ? "text-white/70" : "text-[var(--color-text-muted)]"
          }`}
          dangerouslySetInnerHTML={{ __html: formatAnswer(item.answer) }}
        />
      </div>
    </details>
  );
}

export default function FAQAccordion({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data) return null;

  const title = splitTitle(data.h2);
  const items = data.items || [];
  const left = items.slice(0, Math.ceil(items.length / 2));
  const right = items.slice(Math.ceil(items.length / 2));
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[var(--color-page)]";

  return (
    <section className={`overflow-x-hidden ${sectionBg}`}>
      <div className={`relative overflow-hidden ${sectionBg}`}>
        <div className="absolute inset-y-0 right-0 w-[62%] md:w-[48%]">
          <Image
            src="/home-image/sec2-bg.webp"
            alt=""
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
          <div className="max-w-[760px]">
            <p
              className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
              }`}
            >
              FAQ
            </p>
            <h2
              className={`mt-1.5 text-[1.55rem] font-bold leading-[1.02] sm:text-[1.85rem] md:text-[2.35rem] md:leading-[0.98] lg:text-[2.5rem] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: title.before }} />
              {title.accent ? (
                <>
                  <br />
                  <span className="text-[var(--color-chrome-bright)]" dangerouslySetInnerHTML={{ __html: title.accent }} />
                </>
              ) : null}
            </h2>
            <div className="mt-2.5">
              <MStripe />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-8xl px-4 pb-5 pt-2 md:px-6 md:pb-6 md:pt-2.5 lg:px-8">
        <div
          className={`overflow-hidden rounded-xl border ${
            isDark
              ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
              : "border-[#e8e8e6] bg-white shadow-[0_8px_24px_rgba(16,18,16,0.05)]"
          }`}
        >
          <div
            className={`border-b px-4 py-3 md:px-5 md:py-3.5 ${
              isDark ? "border-[var(--color-border)]" : "border-[#ececeb]"
            }`}
          >
            <h3
              className={`font-heading text-[1.15rem] font-semibold md:text-[1.3rem] ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Common Questions
            </h3>
          </div>

          <div className="grid md:grid-cols-2">
            <div className={isDark ? "md:border-r md:border-[var(--color-border)]" : "md:border-r md:border-[#ececeb]"}>
              {left.map((item) => (
                <FaqItem key={item.id || item.question} item={item} isDark={isDark} />
              ))}
            </div>
            <div>
              {right.map((item) => (
                <FaqItem key={item.id || item.question} item={item} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
