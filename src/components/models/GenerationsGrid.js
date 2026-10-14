"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { carImageFor } from "@/components/shared/carImage";
import { sectionDescription, sectionH2, sectionTableText, tableHeaderClass } from "@/components/models/sectionTypography";

const HEADER_IMAGE = "/home-image/sec2-bg.webp";

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Ã‚Â£", "\u00a3")
    .replaceAll("Â£", "\u00a3")
    .replaceAll("Ã¢â‚¬â€œ", "\u2013")
    .replaceAll("â€“", "\u2013")
    .replaceAll("Ã¢â‚¬â€", "\u2014")
    .replaceAll("â€”", "\u2014")
    .replaceAll("Ã¢â‚¬Â¢", "\u2022")
    .replaceAll("â€¢", "\u2022")
    .replaceAll("Ã¢Ëœâ€¦", "\u2605")
    .replaceAll("â˜…", "\u2605")
    .replaceAll("Ã¢Ëœâ€ ", "\u2606")
    .replaceAll("â˜†", "\u2606")
    .replaceAll("Ã‚Â½", "\u00bd")
    .replaceAll("Â½", "\u00bd")
    .replaceAll("Ã°Å¸â€�Â¥", "\ud83d\udd25")
    .replaceAll("ðŸ”¥", "\ud83d\udd25")
    .replaceAll("Ã¢â€ â€™", "\u2192")
    .replaceAll("â†’", "\u2192")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const findMarker = "Find Your Vehicle";
  const findIndex = clean.indexOf(findMarker);

  if (findIndex !== -1) {
    const before = clean.slice(0, findIndex).replace(/\s*-\s*$/, "").trim();
    return {
      main: before ? `${before} -` : "",
      accent: findMarker,
    };
  }

  const dashIndex = clean.indexOf(" - ");
  if (dashIndex !== -1) {
    const model = clean.slice(0, dashIndex).trim();
    const rest = clean.slice(dashIndex + 3).trim();
    const commaIndex = rest.indexOf(",");

    // Keep model name on line 1 with the first phrase: "E-Pace - One Generation,"
    if (commaIndex !== -1) {
      return {
        main: `${model} - ${rest.slice(0, commaIndex + 1).trim()}`,
        accent: rest.slice(commaIndex + 1).trim(),
      };
    }

    return {
      main: `${model} -`,
      accent: rest,
    };
  }

  return { main: clean, accent: "" };
}

// Card title -> parts, e.g. "XJ X351 (2010–2019)" -> code "X351", years "2010–2019";
// "2019–2024: Revised V8 + Straight-Six Era" -> code "2019–2024", note "Revised V8 + Straight-Six Era".
function parseCardTitle(title = "", modelName = "") {
  const clean = cleanText(title).replace(/\s*-\s*$/, "");
  const parens = clean.match(/^(.*?)\s*\(([^)]*)\)\s*(?:-\s*)?(.*)$/);
  let name = parens ? parens[1] : clean;
  let years = parens ? parens[2] : "";
  let note = parens ? parens[3] : "";
  if (!parens && clean.includes(": ")) {
    [name, note] = clean.split(/:\s+(.*)/s);
  }
  if (modelName && name.toLowerCase().startsWith(`${modelName.toLowerCase()} `)) {
    name = name.slice(modelName.length + 1);
  }
  const chassis = name.match(/^(X\d{3}|XJ40|Series \d)\b\s*(.*)$/i);
  if (chassis && chassis[2] && !years) {
    note = [chassis[2], note].filter(Boolean).join(" - ");
    name = chassis[1];
  }
  return { code: name.trim(), years: years.trim(), note: note.trim() };
}

// "1996–2006 • 4.0 AJ27 V8 • 4.2 AJ34 V8" -> years + engine list; anything else is a badge line.
function parseMeta(meta = "") {
  const clean = cleanText(meta);
  if (!clean) return { years: "", engines: [], extra: "" };
  const parts = clean.split(" • ");
  if (/^\d{4}\s*[–-]\s*(\d{4}|present)?$/i.test(parts[0].trim())) {
    return { years: parts[0].trim(), engines: parts.slice(1), extra: "" };
  }
  return { years: "", engines: [], extra: clean };
}

function modelNameFromH2(h2 = "") {
  return cleanText(h2).split(/\s+(?:-|Generations)\b/)[0].trim();
}

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function ChevronIcon({ open = false, className = "h-6 w-6" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d={open ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
    </svg>
  );
}

function IndexBadge({ index, isDark }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[0.95rem] font-bold leading-none shadow-sm ${
        isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
      }`}
    >
      {index + 1}
    </span>
  );
}

function TableIcon({ name = "timeline", isDark }) {
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center">
      <HomeIcon name={name} isDark={isDark} className="h-9 w-9 object-contain" />
    </span>
  );
}

// Stars only from the rating string; any words after the first five stars become a caption.
function Rating({ value }) {
  const rating = cleanText(value);
  if (!rating) return null;
  const chars = [];
  let end = 0;
  for (let i = 0; i < rating.length && chars.length < 5; i += 1) {
    if ("★☆½".includes(rating[i])) {
      chars.push(rating[i]);
      end = i + 1;
    }
  }
  if (!chars.length) return null;
  while (chars.length < 5) chars.push("☆");
  const caption = rating.slice(end).trim();

  return (
    <div>
      <div className="flex gap-1 text-[19px] leading-none" aria-label={`${chars.filter((c) => c !== "☆").length} out of 5`}>
        {chars.map((char, index) => (
          <span
            key={index}
            className={
              char === "☆"
                ? "text-[var(--color-border-strong)]"
                : char === "½"
                  ? "text-[var(--color-text)] opacity-60"
                  : "text-[var(--color-text)]"
            }
          >
            ★
          </span>
        ))}
      </div>
      {caption ? <p className="mt-1 text-[12px] leading-snug text-[var(--color-text-muted)]">{caption}</p> : null}
    </div>
  );
}

function GenerationCard({ card, index, modelName, defaultOpen = false, isDark }) {
  const [open, setOpen] = useState(defaultOpen);
  const title = parseCardTitle(card.title, modelName);
  const meta = parseMeta(card.meta);
  const subtitle = cleanText(card.subtitle) || [title.years, title.note].filter(Boolean).join(" — ") || meta.years;
  const engines = card.engines || meta.engines;
  const badge = cleanText(card.badge).replace(/^"|"$/g, "").replace(/(🔥)\s*"/, "$1 ").replace(/"$/, "");
  const extra = meta.extra;
  const verdict = cleanText(card.verdict);
  const label = cleanText(card.cta?.label || `Explore ${title.code}`).replace(/\s*→\s*$/, "").replace(/^Explore the\s+/i, "Explore ");
  const href = card.cta?.href || "#";

  return (
    <article
      className={`flex flex-col rounded-md border bg-[var(--color-surface-raised)] p-4 text-[var(--color-text)] shadow-[0_8px_22px_var(--color-shadow)] ${
        open ? "border-[var(--color-text)]/70" : "border-[var(--color-border)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <IndexBadge index={index} isDark={isDark} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold leading-tight text-[var(--color-text)]">{cleanText(card.label) || modelName}</p>
          <h3 className="mt-0.5 text-[22px] font-bold leading-[1.1]" dangerouslySetInnerHTML={{ __html: title.code }} />
        </div>
        {verdict ? (
          <button
            type="button"
            aria-label={open ? "Hide verdict" : "Show verdict"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="shrink-0 text-[var(--color-text)]"
          >
            <ChevronIcon open={open} />
          </button>
        ) : null}
      </div>

      <div className="mt-3 min-h-[5.5rem] pl-11 text-[13px] leading-[1.45] text-[var(--color-text)]">
        {subtitle ? <p dangerouslySetInnerHTML={{ __html: subtitle }} /> : null}
        {engines?.length ? (
          <ul className="mt-1">
            {engines.map((engine) => (
              <li key={engine} className="flex gap-1.5">
                <span aria-hidden="true">{"•"}</span>
                <span dangerouslySetInnerHTML={{ __html: cleanText(engine) }} />
              </li>
            ))}
          </ul>
        ) : null}
        {badge ? <p className="mt-1.5 font-semibold" dangerouslySetInnerHTML={{ __html: badge }} /> : null}
        {extra ? <p className="mt-1.5 text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: extra }} /> : null}
      </div>

      <div className="relative mt-3 h-[130px] w-full md:h-[140px]">
        {card.image ? (
          <Image src={card.image} alt={`${modelName} ${title.code}`} fill className="object-contain object-center" sizes="(min-width: 1024px) 260px, 80vw" />
        ) : null}
      </div>

      <div className="mt-3">
        <Rating value={card.rating} />
      </div>

      {open && verdict ? (
        <div className="mt-4 text-[14px] leading-[1.5]">
          <p className="font-bold">Our Verdict:</p>
          <p className="mt-1" dangerouslySetInnerHTML={{ __html: verdict }} />
        </div>
      ) : null}

      <div className="pt-4">
        <Link
          href={href}
          className={`flex min-h-11 items-center justify-center gap-2.5 rounded-md px-3 text-center text-[15px] font-bold transition-all duration-200 hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)] ${
            open
              ? isDark
                ? "bg-[var(--color-chrome)] text-[var(--color-page)]"
                : "bg-black text-white"
              : "border border-[var(--color-border-strong)] text-[var(--color-text)]"
          }`}
        >
          <span dangerouslySetInnerHTML={{ __html: label }} />
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

function toneClass(tone, isDark) {
  if (tone === "risk") return isDark ? "text-[#ff8a80]" : "text-[#b3261e]";
  if (tone === "safe") return isDark ? "text-[#7fd49b]" : "text-[#1f7a3f]";
  return "";
}

// Aspect-by-aspect comparison (e.g. pre- vs post-facelift) with "Our position" alongside.
function ComparisonTable({ table, isDark }) {
  const rows = table?.rows || [];
  if (!rows.length) return null;
  const columns = table.columns || [];

  return (
    <div className="space-y-3">
      {table.intro ? (
        <p className={`${sectionTableText} text-[var(--color-text)]`}>
          {table.title ? <strong className="font-bold">{cleanText(table.title)}: </strong> : null}
          <span dangerouslySetInnerHTML={{ __html: cleanText(table.intro) }} />
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_8px_22px_var(--color-shadow)]">
        <table className="w-full min-w-[720px] border-collapse text-left text-[14px] text-[var(--color-text)]">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} className={`px-4 py-3 font-bold ${tableHeaderClass(isDark)}`}>
                  {cleanText(column)}
                </th>
              ))}
              {table.position ? (
                <th className="bg-[var(--color-page-soft)] px-4 py-3 font-bold text-[var(--color-text)]">
                  <span className="flex items-center gap-2">
                    <HomeIcon name="star" isDark={isDark} className="h-7 w-7" />
                    {cleanText(table.position.title || "Our position")}
                  </span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.label} className="border-t border-[var(--color-border)]">
                <th className="px-4 py-3 font-bold">{cleanText(row.label)}</th>
                {(row.cells || []).map((cell, cellIndex) => (
                  <td key={cellIndex} className={`px-4 py-3 ${toneClass(cell.tone, isDark)}`} dangerouslySetInnerHTML={{ __html: cleanText(cell.text) }} />
                ))}
                {table.position && rowIndex === 0 ? (
                  <td
                    rowSpan={rows.length}
                    className="border-l border-[var(--color-border)] bg-[var(--color-page-soft)] px-4 py-3 align-middle font-semibold leading-[1.5]"
                    dangerouslySetInnerHTML={{ __html: cleanText(table.position.text) }}
                  />
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// A model's "dividing line" note (pre- vs post-facelift etc.) when there is no full table.
function ComparisonNote({ note, isDark }) {
  if (!note?.text && !note?.verdict) return null;
  return (
    <div className="flex gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 shadow-[0_8px_22px_var(--color-shadow)]">
      <TableIcon name="scale" isDark={isDark} />
      <div className={`min-w-0 ${sectionTableText} text-[var(--color-text)]`}>
        {note.title ? <h3 className="text-[16px] font-bold leading-tight">{cleanText(note.title)}</h3> : null}
        {note.text ? <p className="mt-1" dangerouslySetInnerHTML={{ __html: cleanText(note.text) }} /> : null}
        {note.verdict ? <p className="mt-1 font-semibold" dangerouslySetInnerHTML={{ __html: cleanText(note.verdict) }} /> : null}
      </div>
    </div>
  );
}

export default function GenerationsGrid({ data }) {
  const { theme } = useTheme();
  const [desktopSlide, setDesktopSlide] = useState(0);
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const modelName = modelNameFromH2(data.h2);
  // Photos come from the page (one per card, different colours); carImageFor is a fallback.
  const cards = (data.cards || []).map((card) => ({ ...card, image: card.image || carImageFor(card.title, data.h2) }));
  const perSlide = 5;
  const slides = [];
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[#ececea]";

  for (let index = 0; index < cards.length; index += perSlide) {
    slides.push(cards.slice(index, index + perSlide));
  }

  return (
    <section id="generations" data-theme-mode={theme} className={`overflow-hidden ${sectionBg} text-[var(--color-text)]`}>
      <div className={`relative overflow-hidden ${sectionBg}`}>
        <div className="absolute inset-y-0 right-0 w-[62%] md:w-[48%]">
          <Image
            src={HEADER_IMAGE}
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

        <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-7 md:px-8 md:pb-4 md:pt-10">
          <div className="max-w-[760px]">
            <h2 className={`max-w-[760px] font-bold tracking-normal text-[var(--color-text)] ${sectionH2}`}>
              <span dangerouslySetInnerHTML={{ __html: title.main || cleanText(data.h2) }} />
              {title.accent ? (
                <>
                  <br />
                  <span
                    className="text-[var(--color-chrome-bright)]"
                    dangerouslySetInnerHTML={{ __html: title.accent }}
                  />
                </>
              ) : null}
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>
            {data.subHeadline ? (
              <p
                className={`mt-3 max-w-[640px] ${sectionDescription} text-[var(--color-text-muted)]`}
                dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-7 pt-4 md:px-8 md:pb-8 md:pt-5">
        {/* Desktop: up to five cards per row; the first card opens with its verdict, as in the reference */}
        <div className="hidden lg:block">
          <div className="overflow-hidden">
            <div
              className="flex items-start transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${desktopSlide * 100}%)` }}
            >
              {slides.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  className="grid w-full shrink-0 items-start gap-3"
                  style={{ gridTemplateColumns: `1.3fr repeat(${perSlide - 1}, minmax(0, 1fr))` }}
                >
                  {slide.map((card, cardIndex) => (
                    <GenerationCard
                      key={`${card.title}-${cardIndex}`}
                      card={card}
                      index={slideIndex * perSlide + cardIndex}
                      modelName={modelName}
                      defaultOpen={slideIndex === 0 && cardIndex === 0}
                      isDark={isDark}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {slides.length > 1 ? (
            <div className="mt-4 flex justify-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show generation cards ${index + 1}`}
                  onClick={() => setDesktopSlide(index)}
                  className={`h-2.5 w-2.5 rounded-full ${
                    desktopSlide === index ? (isDark ? "bg-white" : "bg-black") : "bg-[var(--color-border-strong)]"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Phones and tablets: the same cards, two across on tablets */}
        <div className="grid items-start gap-3 sm:grid-cols-2 lg:hidden">
          {cards.map((card, index) => (
            <GenerationCard
              key={`${card.title}-${index}`}
              card={card}
              index={index}
              modelName={modelName}
              defaultOpen={index === 0}
              isDark={isDark}
            />
          ))}
        </div>

        {data.rangeTable?.rows?.length ? (
          <div className="mt-5">
            <ComparisonTable table={data.rangeTable} isDark={isDark} />
          </div>
        ) : null}

        {data.comparisonNote ? (
          <div className="mt-5">
            <ComparisonNote note={data.comparisonNote} isDark={isDark} />
          </div>
        ) : null}

        {data.comparisonLink ? (
          <p className="mt-4 flex flex-wrap items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 text-[15px]">
            <TableIcon name="book" isDark={isDark} />
            <span>Read the full comparison:</span>
            <Link
              href={data.comparisonLink.href}
              className="inline-flex items-center gap-2 font-bold text-[var(--color-text)] underline decoration-[var(--color-chrome)] underline-offset-2"
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: cleanText(data.comparisonLink.label)
                    .replace("Read the full comparison:", "")
                    .replace(/\s*→\s*$/, ""),
                }}
              />
              <ArrowIcon />
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
