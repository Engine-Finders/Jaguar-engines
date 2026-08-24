"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const ICON_LG = "h-11 w-11 md:h-12 md:w-12";

function cleanText(value = "") {
  return String(value || "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replaceAll("â†’", "")
    .trim();
}

function unlinkHtml(value = "") {
  return cleanText(value).replace(
    /<a\b[^>]*>([\s\S]*?)<\/a>/gi,
    '<span class="text-[var(--color-chrome-bright)]">$1</span>'
  );
}

function CentreCard({ item, isDark }) {
  return (
    <Link
      href={item.link?.href || "#"}
      className={`group relative flex h-full flex-col items-center overflow-hidden rounded-xl border px-4 pb-4 pt-5 text-center transition md:px-4 md:pb-4 md:pt-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:border-white/25"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_20px_rgba(16,18,16,0.04)] hover:border-[var(--color-chrome)]"
      }`}
    >
      <span
        className={`pointer-events-none absolute left-3 top-2 font-serif text-[1.6rem] font-semibold italic leading-none md:text-[1.85rem] ${
          isDark ? "text-white/12" : "text-[#e4e4e2]"
        }`}
      >
        {String(item.id).padStart(2, "0")}
      </span>

      <span className="relative z-[1] mt-1">
        <HomeIcon name={item.icon || "knowledge"} isDark={isDark} className={ICON_LG} />
      </span>

      <h3
        className={`relative z-[1] mt-3 font-serif text-[0.98rem] font-semibold leading-tight md:text-[1.05rem] ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {item.title}
      </h3>

      <p
        className={`relative z-[1] mt-2 flex-1 text-[0.74rem] font-normal leading-[1.4] md:text-[0.78rem] ${
          isDark ? "text-white/65" : "text-[var(--color-text-muted)]"
        }`}
        dangerouslySetInnerHTML={{ __html: unlinkHtml(item.description) }}
      />

      <span
        className={`relative z-[1] mt-3 text-[0.8rem] font-semibold md:text-[0.84rem] ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {(item.link?.label || "Explore").replace(/\s*→\s*$/, "")} →
      </span>
    </Link>
  );
}

function NoteWithBadge({ text, badge, isDark }) {
  const cleaned = cleanText(text);
  const marker = badge ? `[${badge}]` : null;
  const parts = marker && cleaned.includes(marker) ? cleaned.split(marker) : [cleaned];

  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 ? (
            <span
              className={`mx-1 inline-flex translate-y-[-1px] items-center rounded border px-1.5 py-[1px] text-[0.58rem] font-bold uppercase tracking-[0.06em] ${
                isDark
                  ? "border-white/25 bg-white/5 text-white/80"
                  : "border-[#d0d0ce] bg-white text-[var(--color-text-muted)]"
              }`}
            >
              {badge}
            </span>
          ) : null}
        </span>
      ))}
    </>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-3 flex items-center gap-2.5 rounded-xl border px-3 py-2.5 md:mt-3.5 md:px-3.5 md:py-2.5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-[#f3f3f2]"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center md:h-10 md:w-10">
        <HomeIcon name="info" isDark={isDark} className={ICON_LG} />
      </span>
      <p className={`min-w-0 text-[0.72rem] leading-[1.35] md:text-[0.76rem] ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
        <strong className={isDark ? "text-white" : "text-black"}>{note.label}</strong>{" "}
        <NoteWithBadge text={note.text} badge={note.badge} isDark={isDark} />
      </p>
    </div>
  );
}

export default function HomeSec8({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headerImage = data.headerImage || {
    src: "/home-image/sec2-bg.webp",
    alt: "Jaguar knowledge centres",
  };
  const centres = data.centres || [];
  const sectionBg = "bg-[var(--color-page)]";

  return (
    <section className={`overflow-x-hidden ${sectionBg}`}>
      {/* Header — same pattern as Sec2 */}
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
          <div className="max-w-[620px]">
            <p
              className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
              }`}
            >
              Knowledge Centres
            </p>
            <h2
              className={`mt-1.5 font-serif text-[2rem] font-semibold leading-[0.98] md:text-[2.75rem] md:leading-[0.96] ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Knowledge{" "}
              <span className="text-[var(--color-chrome-bright)]">Centres</span>
            </h2>
            <div className="mt-2.5">
              <MStripe />
            </div>
            <p
              className={`mt-2 max-w-[540px] text-[0.86rem] leading-[1.4] md:text-[0.95rem] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
            >
              {cleanText(data.subHeadline)}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-8xl px-4 pb-5 pt-2 md:px-6 md:pb-6 md:pt-2.5 lg:px-8">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {centres.map((item) => (
            <CentreCard key={item.id} item={item} isDark={isDark} />
          ))}
        </div>

        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
