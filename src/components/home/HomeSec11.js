"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const ROW_IMAGE = "/home-image/right.webp";
const ICON_LG = "h-12 w-12 md:h-14 md:w-14";
const ICON_MD = "h-8 w-8 md:h-9 md:w-9";
const ICON_CIRCLE = "h-12 w-12 md:h-14 md:w-14";

function cleanText(value = "") {
  return String(value || "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .trim();
}

function ModelCard({ model, isDark }) {
  return (
    <Link
      href={model.href || "#"}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border transition ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:border-white/25"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_22px_rgba(16,18,16,0.05)] hover:border-[var(--color-chrome)]"
      }`}
    >
      <div className="relative px-3 pt-3 md:px-3 md:pt-3">
        <span
          className={`pointer-events-none absolute left-2.5 top-2 font-serif text-[1.05rem] font-semibold leading-none md:left-3 md:top-2.5 md:text-[1.1rem] ${
            isDark ? "text-white/14" : "text-[#d8d8d6]"
          }`}
        >
          {model.id}
        </span>

        <h3
          className={`relative z-[1] pl-7 text-[1rem] font-bold leading-none md:text-[1.05rem] ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {model.name}
        </h3>
        <p
          className={`relative z-[1] mt-1 pl-7 text-[0.7rem] leading-[1.25] md:text-[0.72rem] ${
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
        className={`mt-auto flex items-center gap-1.5 border-t px-2.5 py-2 md:gap-2 md:px-3 md:py-2 ${
          isDark ? "border-[var(--color-border)] bg-white/[0.03]" : "border-[#ececeb] bg-[#f3f3f2]"
        }`}
      >
        <HomeIcon name={model.verdict?.icon || "safe-buy"} isDark={false} className={`${ICON_MD} shrink-0`} />
        <span className={`text-[0.74rem] font-semibold leading-tight md:text-[0.78rem] ${isDark ? "text-white" : "text-black"}`}>
          {model.verdict?.label}
        </span>
      </div>
    </Link>
  );
}

function CategoryBlock({ category, isDark }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 md:mb-2.5">
        <HomeIcon name={category.icon || "vehicle"} isDark={isDark} className={ICON_LG} />
        <p
          className={`text-[0.68rem] font-bold uppercase tracking-[0.12em] ${
            isDark ? "text-white/70" : "text-[var(--color-text-muted)]"
          }`}
        >
          {category.label}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 md:gap-2.5">
        {(category.models || []).map((model) => (
          <ModelCard key={`${category.id}-${model.name}`} model={model} isDark={isDark} />
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
      <div className="grid gap-4 p-4 md:grid-cols-[minmax(180px,0.85fr)_minmax(200px,1fr)_minmax(260px,1.25fr)] md:items-center md:gap-4 md:p-5 lg:gap-5">
        {/* Left */}
        <div>
          <p
            className={`text-[0.64rem] font-bold uppercase tracking-[0.12em] ${
              isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
            }`}
          >
            {data.eyebrow}
          </p>
          <h3
            className={`mt-1.5 font-serif text-[1.55rem] font-semibold leading-[1.05] md:text-[1.85rem] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {data.model}
          </h3>

          <ul className="mt-3 grid gap-2.5 md:mt-3.5 md:gap-2.5">
            {(data.highlights || []).map((item) => (
              <li key={item.title} className="flex items-start gap-2.5">
                <span
                  className={`mt-0.5 flex ${ICON_CIRCLE} shrink-0 items-center justify-center rounded-full ${
                    isDark ? "bg-white/10" : "bg-white"
                  }`}
                >
                  <HomeIcon name={item.icon} isDark={false} className={ICON_MD} />
                </span>
                <span className="min-w-0 pt-0.5">
                  <strong className={`block text-[0.84rem] leading-tight md:text-[0.88rem] ${isDark ? "text-white" : "text-black"}`}>
                    {item.title}
                  </strong>
                  <span className={`mt-0.5 block text-[0.72rem] ${isDark ? "text-white/60" : "text-[var(--color-text-muted)]"}`}>
                    {item.text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Center image */}
        <div className="relative mx-auto h-[150px] w-full max-w-[300px] md:h-[180px] lg:h-[190px]">
          <Image
            src={data.image?.src || ROW_IMAGE}
            alt={data.image?.alt || data.model || ""}
            fill
            className="object-contain object-center"
            sizes="(max-width: 768px) 80vw, 300px"
          />
        </div>

        {/* Right details grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3.5">
          {(data.details || []).map((item) => (
            <div key={item.title} className="flex items-start gap-2.5">
              <span className={`mt-0.5 flex ${ICON_CIRCLE} shrink-0 items-center justify-center rounded-full bg-black`}>
                <HomeIcon name={item.icon} isDark className={ICON_MD} />
              </span>
              <div className="min-w-0">
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
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center md:h-10 md:w-10`}>
        <HomeIcon name="info" isDark={isDark} className="h-8 w-8 md:h-9 md:w-9" />
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

  return (
    <section className={`overflow-x-hidden ${isDark ? "bg-[var(--color-page)]" : "bg-[#f8f8f7]"}`}>
      <div className="mx-auto w-full min-w-0 max-w-8xl px-4 pb-4 pt-3 md:px-6 md:pb-5 md:pt-4 lg:px-8">
        <div className="mx-auto max-w-[720px] text-center">
          <h2
            className={`font-serif text-[1.75rem] font-semibold leading-[1.08] md:text-[2.35rem] md:leading-[1.05] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Every Model. Every Generation. Honestly Rated.
          </h2>
          <p
            className={`mx-auto mt-2 max-w-[640px] text-[0.84rem] leading-[1.4] md:mt-2.5 md:text-[0.9rem] ${
              isDark ? "text-white/75" : "text-[var(--color-text-muted)]"
            }`}
          >
            {cleanText(data.subHeadline)}
          </p>
          <div className={`mx-auto mt-2.5 h-px w-12 md:mt-3 ${isDark ? "bg-white/25" : "bg-[#cfcfcd]"}`} />
        </div>

        <div className="mt-4 grid gap-5 md:mt-5 md:gap-4">
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
