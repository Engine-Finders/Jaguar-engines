"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { sectionDescription, sectionH2, sectionTableText } from "@/components/models/sectionTypography";

const HEADER_IMAGE = "/home-image/sec2-bg.webp";
const RIGHT_IMAGE = "/home-image/right.webp";

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

function generationCode(title = "") {
  return cleanText(title).split(" ").at(-1) || "";
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

function splitCardTitle(title = "") {
  const clean = cleanText(title);
  const code = generationCode(clean);

  return {
    series: clean.replace(code, "").trim(),
    code,
  };
}

function GenerationCode({ children }) {
  return (
    <>
      <span className="text-[17px] font-bold leading-[1.1] md:hidden">{children}</span>
      <span className="hidden font-bold leading-[1.05] md:inline" style={{ fontSize: "17px" }}>
        {children}
      </span>
    </>
  );
}

function splitMeta(meta = "") {
  const [years = "", engines = ""] = cleanText(meta).split(" \u2022 ");
  return { years, engines };
}

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function ChevronIcon({ open = false }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d={open ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
    </svg>
  );
}

function IndexBadge({ index, isDark }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-heading text-[1.15rem] font-bold leading-none shadow-sm md:h-10 md:w-10 md:text-[1.3rem] ${
        isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
      }`}
    >
      {index + 1}
    </span>
  );
}

function VerdictSeeMore({ text }) {
  const [expanded, setExpanded] = useState(false);
  const clean = cleanText(text);
  if (!clean) return null;

  return (
    <div className="mt-4 text-[15px] leading-[1.45]">
      <p className="font-bold">Our Verdict:</p>
      {expanded ? (
        <p className="mt-1">
          <span dangerouslySetInnerHTML={{ __html: clean }} />{" "}
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="font-semibold text-[var(--color-chrome-bright)] underline underline-offset-2"
          >
            see less
          </button>
        </p>
      ) : (
        <p className="mt-1 flex items-baseline gap-1">
          <span className="min-w-0 flex-1 truncate" dangerouslySetInnerHTML={{ __html: clean }} />
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="shrink-0 font-semibold text-[var(--color-chrome-bright)] underline underline-offset-2"
          >
            ...see more
          </button>
        </p>
      )}
    </div>
  );
}

function TableIcon({ name = "timeline", isDark }) {
  return (
    <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center ${isDark ? "" : ""}`}>
      <HomeIcon name={name} isDark={isDark} className="h-6 w-6 object-contain" />
    </span>
  );
}

function Rating({ value, compact = false }) {
  const rating = cleanText(value);
  const stars = Array.from({ length: 5 }, (_, index) => {
    const char = rating[index] || "\u2606";
    return char === "\u2605" || char === "\u00bd" ? "filled" : char === "\u2606" ? "empty" : "filled";
  });

  if (rating.includes("\u00bd")) stars[3] = "half";

  return (
    <div className={`flex ${compact ? "gap-0.5 text-[15px]" : "gap-1 text-[18px]"} leading-none`}>
      {stars.map((state, index) => (
        <span
          key={index}
          className={
            state === "empty"
              ? "text-[#cfd5dd]"
              : state === "half"
                ? "text-[var(--color-chrome-bright)] opacity-80"
                : "text-[var(--color-chrome-bright)]"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

function GenerationImage({ large = false }) {
  return (
    <div
      className={`relative flex w-full items-end justify-center overflow-hidden rounded-sm ${
        large ? "h-[180px] md:h-[168px]" : "h-[96px] md:h-[150px]"
      }`}
    >
      <Image
        src={RIGHT_IMAGE}
        alt=""
        fill
        className="object-cover object-center"
        sizes={large ? "320px" : "220px"}
      />
    </div>
  );
}

function GenerationCard({ card, index, featured = false, onToggle, isDark }) {
  const title = splitCardTitle(card.title);
  const meta = splitMeta(card.meta);
  const label = cleanText(card.cta?.label || `Explore ${title.code}`);
  const href = card.cta?.href || "#";

  return (
    <article
      className={`rounded-md border bg-[var(--color-surface-raised)] p-3 text-[var(--color-text)] shadow-[0_8px_22px_var(--color-shadow)] ${
        featured
          ? isDark
            ? "border-[var(--color-chrome)]/70 md:col-span-2"
            : "border-[var(--color-chrome)] md:col-span-2"
          : "border-[var(--color-border)]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-start gap-3 text-left ${onToggle ? "" : "pointer-events-none"}`}
      >
        <IndexBadge index={index} isDark={isDark} />
        <div className="min-w-0 flex-1">
          <p className={`${sectionTableText} font-semibold`} dangerouslySetInnerHTML={{ __html: title.series }} />
          <h3 className="mt-0.5">
            <GenerationCode>
              <span dangerouslySetInnerHTML={{ __html: title.code }} />
            </GenerationCode>
          </h3>
          <p className="mt-2 text-[12px] font-normal leading-[1.35] text-[var(--color-text-muted)]">
            <span className="text-[13px] md:text-[15px]" dangerouslySetInnerHTML={{ __html: meta.years }} />
          </p>
          {meta.engines ? (
            <p className="text-[12px] font-normal leading-[1.35] text-[var(--color-text-muted)]">
              • <span dangerouslySetInnerHTML={{ __html: meta.engines }} />
            </p>
          ) : null}
        </div>
        <span className="text-[var(--color-chrome-bright)]">
          <ChevronIcon open={featured} />
        </span>
      </button>

      <div className={featured ? "mt-2" : "mt-4"}>
        <GenerationImage large={featured} />
      </div>

      {featured ? (
        <Link
          href={href}
          className="mt-4 flex min-h-10 items-center justify-center gap-3 rounded-md border border-[var(--color-chrome)]/70 px-3 text-center text-[18px] font-bold text-[var(--color-text)] transition-all duration-200 hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)]"
        >
          <span>{label.replace(/\s*\u2192\s*$/, "")}</span>
          <ArrowIcon />
        </Link>
      ) : null}

      <div className={featured ? "mt-4" : "mt-5"}>
        <Rating value={card.rating} compact={!featured} />
      </div>

      {featured && card.verdict ? <VerdictSeeMore text={card.verdict} /> : null}

      {!featured && (
        <Link
          href={href}
          className="mt-3 hidden min-h-9 items-center justify-center gap-3 rounded-md border border-[var(--color-chrome)]/50 px-3 text-[18px] font-bold text-[var(--color-text)] transition-all duration-200 hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)] md:flex"
        >
          <span>{label.replace(/^Explore the\s+/i, "Explore ").replace(/\s*\u2192\s*$/, "")}</span>
          <ArrowIcon />
        </Link>
      )}

      {!featured && card.verdict ? (
        <div className="hidden md:block">
          <VerdictSeeMore text={card.verdict} />
        </div>
      ) : null}
    </article>
  );
}

function MobileGenerationRow({ card, index, onToggle, isDark }) {
  const title = splitCardTitle(card.title);
  const meta = splitMeta(card.meta);
  const badge = cleanText(card.badge);

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex min-h-[86px] w-full items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 text-left text-[var(--color-text)]"
    >
      <IndexBadge index={index} isDark={isDark} />
      <div className="min-w-0 flex-1">
        <p className={`${sectionTableText} font-semibold`} dangerouslySetInnerHTML={{ __html: title.series }} />
        <h3 className="mt-0.5">
          <GenerationCode>
            <span dangerouslySetInnerHTML={{ __html: title.code }} />
          </GenerationCode>
        </h3>
        {badge ? <p className="mt-1 text-[13px] font-bold leading-[1.35]" dangerouslySetInnerHTML={{ __html: badge }} /> : null}
        <p className="mt-1 text-[12px] font-normal leading-[1.35] text-[var(--color-text-muted)]">
          <span className="text-[13px] md:text-[15px]" dangerouslySetInnerHTML={{ __html: meta.years }} />{" "}
          <span className="px-1">•</span> <span dangerouslySetInnerHTML={{ __html: meta.engines }} />
        </p>
      </div>
      <div className="w-[112px] shrink-0">
        <GenerationImage />
      </div>
      <span className="shrink-0 text-[var(--color-chrome-bright)]">
        <ChevronIcon />
      </span>
    </button>
  );
}

function ComparisonTable({ rangeTable, isDark }) {
  const rows = rangeTable?.rows || [];
  if (!rows.length && !cleanText(rangeTable?.title || "")) return null;

  const diesel = {
    pre: cleanText(rows[0]?.power),
    middle: cleanText(rows[1]?.model),
    post: cleanText(rows[1]?.engineCode),
  };
  const petrol = {
    pre: cleanText(rows[2]?.model),
    middle: cleanText(rows[2]?.engineCode),
    post: cleanText(rows[2]?.power),
  };
  const recommendation = cleanText(rows[4]?.model || "The model we recommend for daily ownership");

  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 shadow-[0_8px_22px_var(--color-shadow)]">
      <div className="mb-3 flex items-center gap-3">
        <TableIcon name="scale" isDark={isDark} />
        <h3
          className={`${sectionTableText} font-bold text-[var(--color-text)] md:text-[18px]`}
          dangerouslySetInnerHTML={{ __html: cleanText(rangeTable.title) }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse overflow-hidden rounded-md text-left text-[15px] text-[var(--color-text)] md:min-w-0">
          <thead>
            <tr>
              <th className="w-[15%] border border-[var(--color-border)] bg-[var(--color-page-soft)] p-3" />
              <th className="w-[22%] border border-[var(--color-border)] bg-[var(--color-page-soft)] p-3 font-bold">
                <span className="flex items-start gap-2">
                  <TableIcon name="timeline" isDark={isDark} />
                  Pre-era
                </span>
              </th>
              <th className="w-[22%] border border-[var(--color-border)] bg-[var(--color-page-soft)] p-3 font-bold">
                <span className="flex items-start gap-2">
                  <TableIcon name="timeline" isDark={isDark} />
                  Mid-era
                </span>
              </th>
              <th className="w-[22%] border border-[var(--color-border)] bg-[var(--color-page-soft)] p-3 font-bold">
                <span className="flex items-start gap-2">
                  <TableIcon name="timeline" isDark={isDark} />
                  Later
                </span>
              </th>
              <th className="w-[19%] border border-green-100 bg-green-50 p-3 font-bold text-green-700">
                <span className="flex items-center gap-2">
                  <TableIcon name="star" isDark={isDark} />
                  Our position
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="border border-[var(--color-border)] p-3 font-bold">
                <span className="flex items-center gap-2">
                  <TableIcon name="fuel" isDark={isDark} />
                  Core diesel
                </span>
              </th>
              <td className="border border-[var(--color-border)] p-3">
                <strong className="text-red-600" dangerouslySetInnerHTML={{ __html: diesel.pre.split(" ")[0] }} />
                <span dangerouslySetInnerHTML={{ __html: diesel.pre.replace(diesel.pre.split(" ")[0], "") }} />
              </td>
              <td className="border border-[var(--color-border)] p-3">
                <strong className="text-red-600" dangerouslySetInnerHTML={{ __html: diesel.middle.split(" ")[0] }} />
                <span dangerouslySetInnerHTML={{ __html: diesel.middle.replace(diesel.middle.split(" ")[0], "") }} />
              </td>
              <td className="border border-[var(--color-border)] p-3">
                <strong className="text-green-700" dangerouslySetInnerHTML={{ __html: diesel.post.split(" ")[0] }} />
                <span dangerouslySetInnerHTML={{ __html: diesel.post.replace(diesel.post.split(" ")[0], "") }} />
              </td>
              <td
                rowSpan={2}
                className="border border-green-100 bg-green-50 p-3 text-[15px] font-bold leading-[1.35] text-green-700"
                dangerouslySetInnerHTML={{ __html: recommendation }}
              />
            </tr>
            <tr>
              <th className="border border-[var(--color-border)] p-3 font-bold">
                <span className="flex items-center gap-2">
                  <TableIcon name="fuel" isDark={isDark} />
                  Core petrol
                </span>
              </th>
              <td className="border border-[var(--color-border)] p-3" dangerouslySetInnerHTML={{ __html: petrol.pre }} />
              <td className="border border-[var(--color-border)] p-3" dangerouslySetInnerHTML={{ __html: petrol.middle }} />
              <td className="border border-[var(--color-border)] p-3">
                <strong className="text-green-700" dangerouslySetInnerHTML={{ __html: petrol.post.split(" ")[0] }} />
                <span dangerouslySetInnerHTML={{ __html: petrol.post.replace(petrol.post.split(" ")[0], "") }} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function GenerationsGrid({ data }) {
  const { theme } = useTheme();
  const [openMobileIndex, setOpenMobileIndex] = useState(-1);
  const [desktopSlide, setDesktopSlide] = useState(0);
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const cards = data.cards || [];
  const desktopSlides = [];
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[#ececea]";

  for (let index = 0; index < cards.length; index += 4) {
    desktopSlides.push(cards.slice(index, index + 4));
  }

  return (
    <section data-theme-mode={theme} className={`overflow-hidden ${sectionBg} text-[var(--color-text)]`}>
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
        <div className="hidden md:block">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${desktopSlide * 100}%)` }}
            >
              {desktopSlides.map((slide, slideIndex) => (
                <div key={slideIndex} className="grid w-full shrink-0 grid-cols-4 gap-3">
                  {slide.map((card, cardIndex) => (
                    <GenerationCard
                      key={card.title}
                      card={card}
                      index={slideIndex * 4 + cardIndex}
                      isDark={isDark}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {cards.length > 4 ? (
            <div className="mt-4 flex justify-center gap-2">
              {desktopSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show generation cards ${index + 1}`}
                  onClick={() => setDesktopSlide(index)}
                  className={`h-2.5 w-2.5 rounded-full ${
                    desktopSlide === index ? "bg-black" : "bg-[var(--color-border-strong)]"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-1 space-y-2 md:hidden">
          {cards.map((card, index) =>
            openMobileIndex === index ? (
              <GenerationCard
                key={card.title}
                card={card}
                index={index}
                featured
                isDark={isDark}
                onToggle={() => setOpenMobileIndex(openMobileIndex === index ? -1 : index)}
              />
            ) : (
              <MobileGenerationRow
                key={card.title}
                card={card}
                index={index}
                isDark={isDark}
                onToggle={() => setOpenMobileIndex(index)}
              />
            )
          )}
        </div>

        {data.rangeTable ? (
          <div className="mt-5">
            <ComparisonTable rangeTable={data.rangeTable} isDark={isDark} />
          </div>
        ) : null}

        {data.comparisonLink ? (
          <p className="mt-4 flex flex-wrap items-center gap-3 pl-2 text-[15px]">
            <TableIcon name="insight" isDark={isDark} />
            <span>Read the full comparison:</span>
            <Link
              href={data.comparisonLink.href}
              className="font-bold text-[var(--color-text)] underline decoration-[var(--color-chrome)] underline-offset-2 transition-all duration-200 hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)]"
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: cleanText(data.comparisonLink.label)
                    .replace("Read the full comparison:", "")
                    .replace(/\s*\u2192\s*$/, ""),
                }}
              />
            </Link>
            <ArrowIcon />
          </p>
        ) : null}
      </div>
    </section>
  );
}
