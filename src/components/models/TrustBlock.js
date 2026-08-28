"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const ICON_LG = "h-10 w-10 md:h-12 md:w-12";

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Ãƒâ€šÃ‚Â£", "\u00a3")
    .replaceAll("Ã‚Â£", "\u00a3")
    .replaceAll("Ã¢â‚¬â€œ", "-")
    .replaceAll("Ã¢â‚¬â€", "-")
    .replace(/\s+-\s+/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const markers = ["jaguarengines.uk", "JaguarEngine.uk", "jaguarengine.uk"];

  for (const marker of markers) {
    const index = clean.toLowerCase().indexOf(marker.toLowerCase());
    if (index !== -1) {
      return {
        before: clean.slice(0, index).trim(),
        accent: clean.slice(index).trim(),
      };
    }
  }

  return { before: clean, accent: "" };
}

function signalIconKey(item = {}, index = 0) {
  const value = `${item.icon || ""} ${item.title || ""} ${item.text || ""}`.toLowerCase();
  if (value.includes("not to repair") || value.includes("💚")) return "honest-verdict";
  if (value.includes("specialist") || value.includes("🔧")) return "vetted-specialist";
  if (value.includes("engine finders") || value.includes("🏆")) return "engine-finders";
  if (value.includes("real data") || value.includes("📊")) return "real-data";
  return ["real-data", "honest-verdict", "vetted-specialist", "engine-finders"][index] || "real-data";
}

function TrustCard({ item, index, isDark }) {
  const iconKey = signalIconKey(item, index);

  return (
    <article
      className={`relative flex h-full overflow-hidden rounded-xl border px-3.5 pb-3.5 pt-5 md:px-4 md:pb-4 md:pt-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_22px_rgba(16,18,16,0.05)]"
      }`}
    >
      <span
        className={`absolute left-0 top-0 flex h-[22px] min-w-[26px] items-center justify-center rounded-br-md px-1.5 font-heading text-[0.72rem] font-bold ${
          isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
        }`}
      >
        {index + 1}
      </span>

      <div className="mt-1 overflow-hidden">
        <span
          className={`float-left mr-3 mb-1 flex h-16 w-16 items-center justify-center rounded-full md:mr-3.5 md:h-[4.5rem] md:w-[4.5rem] ${
            isDark ? "bg-white/10" : "bg-[#ececeb]"
          }`}
        >
          <HomeIcon name={iconKey} isDark={isDark} className={ICON_LG} />
        </span>
        <p
          className={`text-[0.9rem] leading-[1.4] md:text-[0.95rem] ${
            isDark ? "text-white/70" : "text-[var(--color-text-muted)]"
          }`}
        >
          <strong
            className={`font-bold ${isDark ? "text-white" : "text-black"}`}
            dangerouslySetInnerHTML={{ __html: cleanText(item.title) }}
          />{" "}
          <span dangerouslySetInnerHTML={{ __html: cleanText(item.text) }} />
        </p>
      </div>
    </article>
  );
}

export default function TrustBlock({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data) return null;

  const title = splitTitle(data.h2);
  const signals = data.signals || [];
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[#ececea]";

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
                : "absolute inset-0 bg-[linear-gradient(90deg,#ececea_0%,rgba(236,236,234,0.88)_34%,rgba(236,236,234,0.18)_100%)]"
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
              Trust Signals
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
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {signals.map((item, index) => (
            <TrustCard key={item.title || index} item={item} index={index} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}
