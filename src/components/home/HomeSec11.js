"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const ROW_IMAGE = "/home-image/right.webp";
const ICON_LG = "h-12 w-12 md:h-14 md:w-14";
const ICON_MD = "h-9 w-9 md:h-10 md:w-10";
const ICON_XL = "h-11 w-11 md:h-12 md:w-12";
const ICON_CIRCLE = "h-14 w-14 md:h-16 md:w-16";

function cleanText(value = "") {
  return String(value || "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .trim();
}

function ModelCard({ model, isDark, centerLast = false }) {
  return (
    <Link
      href={model.href || "#"}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border transition ${
        centerLast
          ? "col-span-2 mx-auto w-[calc(50%-0.25rem)] sm:col-span-1 sm:mx-0 sm:w-auto"
          : ""
      } ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:border-white/25"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_22px_rgba(16,18,16,0.05)] hover:border-[var(--color-chrome)]"
      }`}
    >
      <div className="relative px-3 pt-3 md:px-3 md:pt-3">
        <span
          className={`pointer-events-none absolute left-2.5 top-2 font-heading text-[1.05rem] font-semibold leading-none md:left-3 md:top-2.5 md:text-[1.1rem] ${
            isDark ? "text-white/14" : "text-[#d8d8d6]"
          }`}
        >
          {model.id}
        </span>

        <h3
          className={`relative z-[1] pl-7 font-heading text-[1rem] font-medium leading-none md:text-[1.05rem] ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {model.name}
        </h3>
        <p
          className={`relative z-[1] mt-1 pl-7 text-[0.7rem] font-normal leading-[1.25] md:text-[0.72rem] ${
            isDark ? "text-white/60" : "text-[var(--color-text-muted)]"
          }`}
        >
          {model.generations}
        </p>

        <div className="relative mt-1.5 h-[80px] w-full md:mt-2 md:h-[92px]">
          <Image
            src={ROW_IMAGE}
            alt={model.name}
            fill
            className="object-contain object-center transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 45vw, 180px"
          />
        </div>
      </div>

      <div
        className={`mt-auto flex items-center justify-center gap-1.5 border-t px-2.5 py-2 md:gap-2 md:px-3 md:py-2 ${
          isDark ? "border-[var(--color-border)] bg-white/[0.03]" : "border-[#ececeb] bg-[#f6f6f5]"
        }`}
      >
        <HomeIcon name={model.verdict?.icon || "safe-buy"} isDark={isDark} className={`${ICON_MD} shrink-0`} />
        <span className={`text-center text-[0.74rem] font-medium leading-tight md:text-[0.78rem] ${isDark ? "text-white" : "text-black"}`}>
          {model.verdict?.label}
        </span>
      </div>
    </Link>
  );
}

function CategoryBlock({ category, isDark }) {
  return (
    <div className="pt-1 md:pt-1.5">
      <div className="mb-3.5 flex items-center gap-2.5 md:mb-4 md:gap-3">
        <HomeIcon name={category.icon || "vehicle"} isDark={isDark} className={ICON_LG} />
        <p
          className={`shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.12em] ${
            isDark ? "text-white/70" : "text-[var(--color-text-muted)]"
          }`}
        >
          {category.label}
        </p>
        <span className={`h-px flex-1 ${isDark ? "bg-white/18" : "bg-[#d8d8d6]"}`} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 md:gap-2.5">
        {(category.models || []).map((model, index, arr) => (
          <ModelCard
            key={`${category.id}-${model.name}`}
            model={model}
            isDark={isDark}
            centerLast={arr.length % 2 === 1 && index === arr.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function ExampleVerdict({ data, isDark }) {
  if (!data) return null;

  return (
    <div
      className={`mt-5 overflow-hidden rounded-xl border md:mt-6 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-[#f3f3f2]"
      }`}
    >
      <div className="grid gap-4 p-4 md:grid-cols-[max-content_minmax(200px,260px)_minmax(0,1fr)] md:items-center md:gap-3 md:p-5">
        {/* Left — only as wide as content */}
        <div className="md:max-w-[220px] lg:max-w-[240px]">
          <p
            className={`text-[0.64rem] font-bold uppercase tracking-[0.12em] ${
              isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
            }`}
          >
            {data.eyebrow}
          </p>
          <h3
            className={`mt-1.5 font-heading text-[1.55rem] font-semibold leading-[1.05] md:text-[1.85rem] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {data.model}
          </h3>

          <ul className="mt-3 grid grid-cols-3 gap-2 md:mt-3.5 md:grid-cols-1 md:gap-3">
            {(data.highlights || []).map((item) => (
              <li
                key={item.title}
                className="flex flex-col items-center gap-1.5 text-center md:flex-row md:items-start md:gap-3 md:text-left"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:mt-0.5 md:h-14 md:w-14 ${
                    isDark ? "bg-white/10" : "bg-white"
                  }`}
                >
                  <HomeIcon name={item.icon} isDark={isDark} className="h-8 w-8 md:h-11 md:w-11" />
                </span>
                <span className="min-w-0 md:pt-1">
                  <strong className={`block text-[0.72rem] leading-tight md:text-[0.88rem] ${isDark ? "text-white" : "text-black"}`}>
                    {item.title}
                  </strong>
                  <span className={`mt-0.5 block text-[0.62rem] leading-[1.25] md:text-[0.72rem] ${isDark ? "text-white/60" : "text-[var(--color-text-muted)]"}`}>
                    {item.text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Center image — side breathing room from left + right columns */}
        <div className="relative mx-auto h-[210px] w-full md:mx-0 md:h-[240px] md:px-3.5 lg:h-[260px]">
          <Image
            src={data.image?.src || ROW_IMAGE}
            alt={data.image?.alt || data.model || ""}
            fill
            className="object-contain object-center"
            sizes="(max-width: 768px) 90vw, 260px"
          />
        </div>

        {/* Right — takes remaining width */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4 md:gap-x-5 md:gap-y-5">
          {(data.details || []).map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex ${ICON_CIRCLE} shrink-0 items-center justify-center rounded-full ${
                  isDark ? "bg-white/10" : "bg-black"
                }`}
              >
                <HomeIcon name={item.icon} isDark className={ICON_XL} />
              </span>
              <div className="min-w-0 pt-1">
                <p className={`text-[0.8rem] font-bold leading-tight md:text-[0.84rem] ${isDark ? "text-white" : "text-black"}`}>
                  {item.title}
                </p>
                <p
                  className={`mt-0.5 text-[0.7rem] leading-[1.35] md:text-[0.72rem] ${
                    isDark ? "text-white/65" : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {cleanText(item.text)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-3 flex items-center gap-2 rounded-xl border px-3 py-2 md:mt-3.5 md:gap-2.5 md:px-3.5 md:py-2 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-[#f3f3f2]"
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center md:h-11 md:w-11">
        <HomeIcon name="info" isDark={isDark} className={ICON_LG} />
      </span>
      <p className={`min-w-0 flex-1 text-[0.72rem] leading-[1.35] md:text-[0.76rem] ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}>
        <strong className={isDark ? "text-white" : "text-black"}>{note.label}</strong>{" "}
        <span dangerouslySetInnerHTML={{ __html: cleanText(note.text) }} />
      </p>
    </div>
  );
}

export default function HomeSec11({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const categories = data.categories || [];
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[#ececea]";
  const headerImage = data.headerImage || {
    src: "/home-image/sec2-bg.webp",
    alt: "Jaguar models",
  };

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
                : "absolute inset-0 bg-[linear-gradient(90deg,#ececea_0%,rgba(236,236,234,0.88)_34%,rgba(236,236,234,0.18)_100%)]"
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
              Every Model
            </p>
            <h2
              className={`mt-1.5 font-serif text-[1.55rem] font-semibold leading-[1.05] sm:text-[1.85rem] md:text-[2.35rem] md:leading-[1.02] lg:text-[2.5rem] ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Every Model. Every Generation.{" "}
              <span className="text-[var(--color-chrome-bright)]">Honestly Rated.</span>
            </h2>
            <div className="mt-2.5">
              <MStripe />
            </div>
            <p
              className={`mt-2 max-w-[640px] text-[0.86rem] leading-[1.4] md:text-[0.95rem] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
            >
              {cleanText(data.subHeadline)}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-8xl px-4 pb-5 pt-2 md:px-6 md:pb-6 md:pt-2.5 lg:px-8">
        <div className="grid gap-6 md:gap-5">
          {categories.map((category) => (
            <CategoryBlock key={category.id} category={category} isDark={isDark} />
          ))}
        </div>

        <ExampleVerdict data={data.exampleVerdict} isDark={isDark} />
        <DataNote note={data.dataNote} isDark={isDark} />
      </div>
    </section>
  );
}
