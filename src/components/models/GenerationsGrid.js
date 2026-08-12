"use client";

import { useState } from "react";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import { sectionDescription, sectionH2, sectionTableText } from "@/components/models/sectionTypography";

const defaultCarImage = "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80";

const carImages = {
  E21: defaultCarImage,
  E30: defaultCarImage,
  E36: defaultCarImage,
  E46: defaultCarImage,
  E90: defaultCarImage,
  F30: defaultCarImage,
  G20: defaultCarImage,
};

function cleanText(text = "") {
  return String(text)
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
  const marker = "Find Your Vehicle";
  const index = clean.indexOf(marker);

  if (index === -1) return { main: clean, accent: "" };

  return {
    main: clean.slice(0, index).trim(),
    accent: clean.slice(index).trim(),
  };
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

function TableIcon({ type = "calendar" }) {
  const path =
    type === "fuel" ? (
      <path d="M6 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M5 21h12M8 7h5m4 1h1.5L21 10.5V18a2 2 0 0 1-4 0v-5h4" />
    ) : type === "star" ? (
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
    ) : type === "scale" ? (
      <path d="M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7ZM8 21h8" />
    ) : type === "spark" ? (
      <path d="M12 3v4m0 10v4M4 12h4m8 0h4M6.3 6.3l2.8 2.8m5.8 5.8 2.8 2.8m0-11.4-2.8 2.8m-5.8 5.8-2.8 2.8" />
    ) : (
      <path d="M7 3v4m10-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v15H4V6a1 1 0 0 1 1-1Z" />
    );

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth="2">
      {path}
    </svg>
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
        <span key={index} className={state === "empty" ? "text-[#cfd5dd]" : state === "half" ? "text-[var(--color-primary)] opacity-80" : "text-[var(--color-primary)]"}>
          ★
        </span>
      ))}
    </div>
  );
}

function GenerationImage({ code, large = false }) {
  const imageCode = String(code).split("/")[0];

  return (
    <div className={`relative flex w-full items-end justify-center overflow-hidden ${large ? "h-[150px] md:h-[118px]" : "h-[64px] md:h-[112px]"}`}>
      <img
        src={carImages[imageCode] || defaultCarImage}
        alt=""
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src = defaultCarImage;
        }}
        className={`max-h-full max-w-full object-contain ${large ? "w-[86%]" : "w-[78%]"}`}
        />
      </div>
    );
  }

function GenerationCard({ card, index, featured = false, onToggle }) {
  const title = splitCardTitle(card.title);
  const meta = splitMeta(card.meta);
  const label = cleanText(card.cta?.label || `Explore ${title.code}`);
  const href = card.cta?.href || "#";

  return (
    <article
      className={`rounded-md border bg-[var(--color-surface-raised)] p-3 text-[var(--color-text)] shadow-[0_8px_22px_var(--color-shadow)] ${
        featured ? "border-[rgba(7,95,216,0.7)] md:col-span-2" : "border-[var(--color-border)]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-start gap-3 text-left ${onToggle ? "" : "pointer-events-none"}`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)] text-[0.8rem] font-bold text-white shadow-sm">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className={`${sectionTableText} font-semibold`} dangerouslySetInnerHTML={{ __html: title.series }} />
          <h3 className="mt-0.5"><GenerationCode><span dangerouslySetInnerHTML={{ __html: title.code }} /></GenerationCode></h3>
          <p className="mt-2 text-[12px] font-normal leading-[1.35] text-[var(--color-text-muted)]">
            <span className="text-[13px] md:text-[15px]" dangerouslySetInnerHTML={{ __html: meta.years }} />
          </p>
          {meta.engines ? <p className="text-[12px] font-normal leading-[1.35] text-[var(--color-text-muted)]">• <span dangerouslySetInnerHTML={{ __html: meta.engines }} /></p> : null}
        </div>
        <span className="text-[var(--color-primary)]">
          <ChevronIcon open={featured} />
        </span>
      </button>

      <div className={featured ? "mt-2" : "mt-4"}>
        <GenerationImage code={title.code} large={featured} />
      </div>

      {featured ? (
        <Link
          href={href}
          className="mt-4 flex min-h-10 items-center justify-center gap-3 rounded-md border border-[rgba(7,95,216,0.7)] px-3 text-center text-[18px] font-bold text-[var(--color-primary)] transition-all duration-200 hover:text-black hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)]"
        >
          <span>{label.replace(/\s*\u2192\s*$/, "")}</span>
          <ArrowIcon />
        </Link>
      ) : null}

      <div className={featured ? "mt-4" : "mt-5"}>
        <Rating value={card.rating} compact={!featured} />
      </div>

      {featured && card.verdict ? (
        <div className="mt-4 text-[15px] leading-[1.45]">
          <p className="font-bold">Our Verdict:</p>
          <p className="mt-1" dangerouslySetInnerHTML={{ __html: cleanText(card.verdict) }} />
        </div>
      ) : null}

      {!featured && (
        <Link
          href={href}
          className="mt-3 hidden min-h-9 items-center justify-center gap-3 rounded-md border border-[rgba(7,95,216,0.45)] px-3 text-[18px] font-bold text-[var(--color-primary)] transition-all duration-200 hover:text-black hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)] md:flex"
        >
          <span>{label.replace(/^Explore the\s+/i, "Explore ").replace(/\s*\u2192\s*$/, "")}</span>
          <ArrowIcon />
        </Link>
      )}

      {!featured && card.verdict ? (
        <div className="mt-4 hidden text-[15px] leading-[1.45] md:block">
          <p className="font-bold">Our Verdict:</p>
          <p className="mt-1" dangerouslySetInnerHTML={{ __html: cleanText(card.verdict) }} />
        </div>
      ) : null}
    </article>
  );
}

function MobileGenerationRow({ card, index, onToggle }) {
  const title = splitCardTitle(card.title);
  const meta = splitMeta(card.meta);
  const badge = cleanText(card.badge);

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex min-h-[86px] w-full items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 text-left text-[var(--color-text)]"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)] text-[0.8rem] font-bold text-white shadow-sm">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`${sectionTableText} font-semibold`} dangerouslySetInnerHTML={{ __html: title.series }} />
        <h3 className="mt-0.5"><GenerationCode><span dangerouslySetInnerHTML={{ __html: title.code }} /></GenerationCode></h3>
        {badge ? <p className="mt-1 text-[13px] font-bold leading-[1.35]" dangerouslySetInnerHTML={{ __html: badge }} /> : null}
        <p className="mt-1 text-[12px] font-normal leading-[1.35] text-[var(--color-text-muted)]">
          <span className="text-[13px] md:text-[15px]" dangerouslySetInnerHTML={{ __html: meta.years }} /> <span className="px-1">•</span> <span dangerouslySetInnerHTML={{ __html: meta.engines }} />
        </p>
      </div>
      <div className="w-[112px] shrink-0">
        <GenerationImage code={title.code} />
      </div>
      <span className="shrink-0 text-[var(--color-primary)]">
        <ChevronIcon />
      </span>
    </button>
  );
}

function ComparisonTable({ rangeTable }) {
  const rows = rangeTable?.rows || [];
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
  const recommendation = cleanText(rows[4]?.model || "The 3 Series we recommend for daily ownership");

  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 shadow-[0_8px_22px_var(--color-shadow)]">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-primary-soft)]">
          <TableIcon type="scale" />
        </span>
        <h3 className={`${sectionTableText} font-bold text-[var(--color-text)] md:text-[18px]`} dangerouslySetInnerHTML={{ __html: cleanText(rangeTable.title) }} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse overflow-hidden rounded-md text-left text-[15px] text-[var(--color-text)] md:min-w-0">
          <thead>
            <tr>
              <th className="w-[15%] border border-[var(--color-border)] bg-[var(--color-page-soft)] p-3" />
              <th className="w-[22%] border border-[var(--color-border)] bg-[var(--color-page-soft)] p-3 font-bold">
                <span className="flex items-start gap-2"><TableIcon />Pre-2013<br /><span className="font-normal">(E90/F30 early)</span></span>
              </th>
              <th className="w-[22%] border border-[var(--color-border)] bg-[var(--color-page-soft)] p-3 font-bold">
                <span className="flex items-start gap-2"><TableIcon />2013-2015<br /><span className="font-normal">(F30 pre-LCI)</span></span>
              </th>
              <th className="w-[22%] border border-[var(--color-border)] bg-[var(--color-page-soft)] p-3 font-bold">
                <span className="flex items-start gap-2"><TableIcon />2016+<br /><span className="font-normal">(F30 LCI / G20)</span></span>
              </th>
              <th className="w-[19%] border border-green-100 bg-green-50 p-3 font-bold text-green-700">
                <span className="flex items-center gap-2"><TableIcon type="star" />Our position</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="border border-[var(--color-border)] p-3 font-bold"><span className="flex items-center gap-2"><TableIcon type="fuel" />Core diesel</span></th>
              <td className="border border-[var(--color-border)] p-3"><strong className="text-red-600" dangerouslySetInnerHTML={{ __html: diesel.pre.split(" ")[0] }} /><span dangerouslySetInnerHTML={{ __html: diesel.pre.replace(diesel.pre.split(" ")[0], "") }} /></td>
              <td className="border border-[var(--color-border)] p-3"><strong className="text-red-600" dangerouslySetInnerHTML={{ __html: diesel.middle.split(" ")[0] }} /><span dangerouslySetInnerHTML={{ __html: diesel.middle.replace(diesel.middle.split(" ")[0], "") }} /></td>
              <td className="border border-[var(--color-border)] p-3"><strong className="text-green-700" dangerouslySetInnerHTML={{ __html: diesel.post.split(" ")[0] }} /><span dangerouslySetInnerHTML={{ __html: diesel.post.replace(diesel.post.split(" ")[0], "") }} /></td>
              <td rowSpan={2} className="border border-green-100 bg-green-50 p-3 text-[15px] font-bold leading-[1.35] text-green-700" dangerouslySetInnerHTML={{ __html: recommendation }} />
            </tr>
            <tr>
              <th className="border border-[var(--color-border)] p-3 font-bold"><span className="flex items-center gap-2"><TableIcon type="fuel" />Core petrol</span></th>
              <td className="border border-[var(--color-border)] p-3" dangerouslySetInnerHTML={{ __html: petrol.pre }} />
              <td className="border border-[var(--color-border)] p-3" dangerouslySetInnerHTML={{ __html: petrol.middle }} />
              <td className="border border-[var(--color-border)] p-3"><strong className="text-green-700" dangerouslySetInnerHTML={{ __html: petrol.post.split(" ")[0] }} /><span dangerouslySetInnerHTML={{ __html: petrol.post.replace(petrol.post.split(" ")[0], "") }} /></td>
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

  const title = splitTitle(data.h2);
  const cards = data.cards || [];
  const desktopSlides = [];

  for (let index = 0; index < cards.length; index += 4) {
    desktopSlides.push(cards.slice(index, index + 4));
  }

  return (
    <section data-theme-mode={theme} className="bg-[var(--color-page)] py-5 text-[var(--color-text)] md:py-6">
      <div>
      <h2 className="max-w-[640px] text-[29px] font-bold leading-[1.08] tracking-normal md:text-[45px]">
          <span dangerouslySetInnerHTML={{ __html: title.main }} />
          {title.accent ? (
            <>
              <br />
              <span className="text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: title.accent }} />
            </>
          ) : null}
        </h2>
        <div className="mt-3">
          <MStripe />
        </div>
        {data.subHeadline ? (
          <p className={`mt-3 max-w-[640px] ${sectionDescription} text-[var(--color-text-muted)]`} dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }} />
        ) : null}
      </div>

      <div className="mt-6 hidden md:block">
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
                  desktopSlide === index ? "bg-[var(--color-primary)]" : "bg-[var(--color-border-strong)]"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-5 space-y-2 md:hidden">
        {cards.map((card, index) => (
          openMobileIndex === index ? (
            <GenerationCard
              key={card.title}
              card={card}
              index={index}
              featured
              onToggle={() => setOpenMobileIndex(openMobileIndex === index ? -1 : index)}
            />
          ) : (
            <MobileGenerationRow
              key={card.title}
              card={card}
              index={index}
              onToggle={() => setOpenMobileIndex(index)}
            />
          )
        ))}
      </div>

      {data.rangeTable ? (
        <div className="mt-5">
          <ComparisonTable rangeTable={data.rangeTable} />
        </div>
      ) : null}

      {data.comparisonLink ? (
        <p className="mt-4 flex items-center gap-3 pl-2 text-[15px]">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-primary-soft)]">
            <TableIcon type="spark" />
          </span>
          <span>Read the full comparison:</span>
          <Link href={data.comparisonLink.href} className="font-bold text-[var(--color-primary)] transition-all duration-200 hover:text-black hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)]">
            <span dangerouslySetInnerHTML={{ __html: cleanText(data.comparisonLink.label).replace("Read the full comparison:", "").replace(/\s*\u2192\s*$/, "") }} />
          </Link>
          <ArrowIcon />
        </p>
      ) : null}
    </section>
  );
}
