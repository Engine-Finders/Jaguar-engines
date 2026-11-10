"use client";

import Image from "next/image";
import { ChartNoAxesCombined, FileText, History, Info, Settings, SteeringWheel } from "@/components/models/brandIcons";
import { useTheme } from "@/components/shared/themeProvider";
import { carImageFor, engineImageFor } from "@/components/shared/carImage";
import { outsideTags } from "@/components/models/outsideTags";

/*
 * Model page "How the Engine Range Evolved" (section 9), built from the 1536px reference.
 *
 * Header: title (the year span in the silver accent) + copy, the four-item stat strip on the right. Then the
 * era table: black header; per era a car (name, years, cut-out car), the years, key engines with their
 * cut-out engine photos, "Why Jaguar Changed" and "Worth Knowing" (info icon); then the data footnote.
 * Sizes come from the --ev-* tokens in globals.css. Below lg every era becomes a card.
 */

// Reference column widths at 1536px: Era, Years, Key Engines, Why Jaguar Changed, Worth Knowing.
const WIDTHS = [300, 141, 341, 322, 334];

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replace(/\s+/g, " ")
    .trim();
}

// Ranges take a spaced en dash ("2017 – 2019"); " - " separators an em dash.
function typeset(text = "") {
  return outsideTags(cleanText(text), (part) =>
    part.replace(/(\d{4})\s*-\s*(\d{4}|Present)/gi, "$1 – $2").replace(/\s-\s/g, " — "),
  );
}

// "How the E-Pace Engine Range Evolved - 2017 to Today" -> "How the E-Pace Engine Range" / "Evolved —" + "2017 to Today"
function splitTitle(title = "") {
  const match = cleanText(title).match(/^(.*?)\s+[-–—]\s+(.*)$/);
  if (!match) return { lines: [cleanText(title)], accent: "" };
  const words = match[1].split(" ");
  const last = words.pop();
  return { lines: [words.join(" "), `${last} —`], accent: match[2] };
}

// "Launch - Early Ingenium" -> ["Launch —", "Early Ingenium"] (two lines, as in the reference)
function eraLines(era = "") {
  const parts = cleanText(era).split(/\s+[-–—]\s+/);
  if (parts.length > 1) return [`${parts[0]} —`, parts.slice(1).join(" — ")];
  const amp = cleanText(era).match(/^(.*?&)\s+(.*)$/);
  return amp ? [amp[1], amp[2]] : [cleanText(era)];
}

// "AJ200D / 204DTD (diesel), AJ200P / 204PT (petrol)" -> [{ name: "AJ200D / 204DTD", note: "(diesel)" }, …]
function engines(value = "") {
  return cleanText(value)
    .split(/,\s+(?![^()]*\))/)
    .map((item) => {
      const match = item.match(/^(.*?)\s*(\([^)]*\))?$/);
      return { name: typeset(match?.[1] || item), note: match?.[2] || "" };
    })
    .filter((item) => item.name);
}

// Up to two different engine photos for an era, matched from its engine codes.
function enginePhotos(value = "") {
  const photos = [];
  for (const item of engines(value)) {
    const photo = engineImageFor(item.name + " " + item.note);
    if (photo && !photos.includes(photo)) photos.push(photo);
    if (photos.length === 2) break;
  }
  return photos;
}

function palette(isDark) {
  return isDark
    ? {
        text: "text-white",
        muted: "text-white/[0.72]",
        accent: "bg-[linear-gradient(180deg,#e4e4e1_0%,#9a9a97_100%)] bg-clip-text text-transparent",
        card: "border-white/[0.16] bg-[rgba(14,16,17,0.92)]",
        head: "bg-[#2a2b2c] text-white",
        rule: "border-white/[0.1]",
      }
    : {
        text: "text-[#111210]",
        muted: "text-[#3d3e3b]",
        accent: "bg-[linear-gradient(180deg,#8a8b87_0%,#6b6c68_100%)] bg-clip-text text-transparent",
        card: "border-[#e8e8e5] bg-white shadow-[0_6px_20px_rgba(16,18,16,0.05)]",
        head: "bg-[#1a1b1a] text-white",
        rule: "border-[#ececea]",
      };
}

/* ---------- Header stats ---------- */

const STAT_ICONS = {
  eras: (cls) => <History aria-hidden="true" className={cls} />,
  engines: (cls) => <Settings aria-hidden="true" className={cls} strokeWidth={1.3} />,
  years: (cls) => <ChartNoAxesCombined aria-hidden="true" className={cls} strokeWidth={1.4} />,
  drivers: (cls) => <SteeringWheel aria-hidden="true" className={cls} />,
};

function Stats({ stats = [], tones }) {
  if (!stats.length) return null;
  const icon = "block h-10 w-10 lg:h-[var(--ev-stat-icon)] lg:w-[var(--ev-stat-icon)]";
  return (
    <ul
      className={`grid grid-cols-2 rounded-xl border py-2 sm:grid-cols-4 lg:min-h-[var(--ev-stats-h)] xl:w-[var(--ev-stats-w)] xl:shrink-0 ${tones.card} ${tones.text}`}
    >
      {stats.map((stat) => (
        <li
          key={stat.label}
          className={`flex flex-col items-center justify-center px-2 py-3 text-center even:border-l [&:nth-child(n+3)]:border-t sm:[&:nth-child(n+3)]:border-t-0 sm:[&:not(:first-child)]:border-l ${tones.rule}`}
        >
          {(STAT_ICONS[stat.icon] || STAT_ICONS.eras)(icon)}
          {stat.value ? <p className="mt-2 text-[16px] font-semibold leading-none lg:text-[length:var(--ev-stat-value)]">{stat.value}</p> : null}
          <p className={`text-[13.5px] font-medium leading-tight lg:text-[length:var(--ev-stat-label)] ${stat.value ? "mt-2" : "mt-[2.1rem]"}`}>{stat.label}</p>
          <p className={`mt-1 text-[12.5px] leading-tight lg:text-[length:var(--ev-stat-text)] ${tones.muted}`}>{stat.text}</p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Era pieces ---------- */

function EraHead({ era, tones }) {
  return (
    <>
      <h3 className="text-[16px] font-semibold leading-snug lg:text-[length:var(--ev-era)] lg:leading-[var(--ev-era-lh)]">
        {eraLines(era.era).map((line) => (
          <span key={line} className="block" dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </h3>
      <p className={`mt-1.5 text-[13px] lg:text-[length:var(--ev-era-years)] ${tones.muted}`}>{typeset(era.years)}</p>
    </>
  );
}

function CarPhoto({ src, className = "" }) {
  if (!src) return null;
  return (
    <div className={`relative ${className}`}>
      <div aria-hidden="true" className="absolute inset-x-[12%] bottom-[3%] h-[12%] rounded-[50%] bg-black/25 blur-md" />
      <Image src={src} alt="" fill sizes="(min-width: 1024px) 230px, 45vw" className="object-contain object-bottom" />
    </div>
  );
}

function Engines({ value, align = "center" }) {
  const items = engines(value);
  const photos = enginePhotos(value);
  return (
    <div className={`flex flex-col ${align === "center" ? "items-center text-center" : "items-start"}`}>
      <ul className="text-[14px] leading-[1.45] lg:text-[length:var(--ev-engine)]">
        {items.map((item) => (
          <li key={item.name + item.note}>
            <strong className="font-semibold" dangerouslySetInnerHTML={{ __html: item.name }} />
            {item.note ? <span className="font-normal"> {item.note}</span> : null}
          </li>
        ))}
      </ul>
      {photos.length ? (
        <div className="mt-2 flex items-end gap-4 lg:mt-3 lg:gap-[calc(var(--ev-cell-px)*1.3)]">
          {photos.map((photo) => (
            <span key={photo} className="relative block h-[72px] w-[90px] lg:h-[var(--ev-engine-h)] lg:w-[calc(var(--ev-engine-h)*1.1)]">
              <Image src={photo} alt="" fill sizes="110px" className="object-contain object-bottom" />
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function WorthKnowing({ text, tones }) {
  if (!text) return null;
  return (
    <div className="flex items-start gap-4 lg:gap-[calc(var(--ev-cell-px)*0.95)]">
      <Info aria-hidden="true" className="mt-0.5 h-8 w-8 shrink-0 lg:h-[var(--ev-info)] lg:w-[var(--ev-info)]" strokeWidth={1.3} />
      <p className={`text-[13.5px] leading-[1.6] lg:text-[length:var(--ev-cell)] lg:leading-[var(--ev-cell-lh)] ${tones.text}`} dangerouslySetInnerHTML={{ __html: typeset(text) }} />
    </div>
  );
}

/* ---------- Table (lg+) ---------- */

function EraTable({ eras, columns, tones }) {
  const total = WIDTHS.reduce((sum, width) => sum + width, 0);
  const cell = "px-[var(--ev-cell-px)] align-middle";
  return (
    <div className={`hidden overflow-hidden rounded-xl border lg:block ${tones.card} ${tones.text}`}>
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          {WIDTHS.map((width, index) => (
            <col key={index} style={{ width: `${(width / total) * 100}%` }} />
          ))}
        </colgroup>
        <thead>
          <tr className={tones.head}>
            {columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={`h-[var(--ev-th-h)] px-[var(--ev-cell-px)] text-[length:var(--ev-th)] font-medium ${index === 0 ? "text-left" : "border-l border-white/[0.18] text-center"}`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {eras.map((era, index) => (
            <tr key={era.era} className={index > 0 ? `border-t ${tones.rule}` : ""}>
              <th scope="row" className={`${cell} h-[var(--ev-row-h)] py-[calc(var(--ev-cell-px)*1.05)] text-left align-top font-normal`}>
                <EraHead era={era} tones={tones} />
                <CarPhoto src={era.image} className="ml-[8%] mt-1 h-[var(--ev-car-h)] w-[88%]" />
              </th>
              <td className={`border-l px-2 text-center align-middle text-[length:var(--ev-era-years)] ${tones.rule}`}>{typeset(era.years)}</td>
              <td className={`${cell} border-l py-[calc(var(--ev-cell-px)*0.8)] ${tones.rule}`}>
                <Engines value={era.keyEngines} />
              </td>
              <td className={`${cell} border-l ${tones.rule}`}>
                <p className="text-[length:var(--ev-cell)] leading-[var(--ev-cell-lh)]" dangerouslySetInnerHTML={{ __html: typeset(era.whyBmwChanged || era.whyChanged) }} />
              </td>
              <td className={`${cell} border-l ${tones.rule}`}>
                <WorthKnowing text={era.worthKnowing} tones={tones} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Cards (phones / tablets) ---------- */

function EraCards({ eras, columns, tones }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:hidden">
      {eras.map((era) => (
        <li key={era.era} className={`overflow-hidden rounded-xl border ${tones.card} ${tones.text}`}>
          <div className="grid grid-cols-[minmax(0,1fr)_46%] items-end gap-x-2 px-4 pt-4">
            <div className="self-start pb-3">
              <EraHead era={era} tones={tones} />
            </div>
            <CarPhoto src={era.image} className="h-[86px] w-full" />
          </div>
          <div className={`border-t px-4 py-4 ${tones.rule}`}>
            <p className={`mb-2 text-[11.5px] font-medium uppercase tracking-[0.04em] ${tones.muted}`}>{columns[2]}</p>
            <Engines value={era.keyEngines} align="start" />
          </div>
          <div className={`border-t px-4 py-4 ${tones.rule}`}>
            <p className={`mb-1.5 text-[11.5px] font-medium uppercase tracking-[0.04em] ${tones.muted}`}>{columns[3]}</p>
            <p className="text-[13.5px] leading-[1.6]" dangerouslySetInnerHTML={{ __html: typeset(era.whyBmwChanged || era.whyChanged) }} />
          </div>
          {era.worthKnowing ? (
            <div className={`border-t px-4 py-4 ${tones.rule}`}>
              <p className={`mb-2 text-[11.5px] font-medium uppercase tracking-[0.04em] ${tones.muted}`}>{columns[4]}</p>
              <WorthKnowing text={era.worthKnowing} tones={tones} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/* ---------- Section ---------- */

export default function EngineEvolution({ data }) {
  const { theme } = useTheme();
  if (!data?.eras?.length) return null;

  const isDark = theme === "dark";
  const tones = palette(isDark);
  const title = splitTitle(data.h2);
  const columns = data.columns?.length === 5 ? data.columns : ["Era", "Years", "Key Engines", "Why Jaguar Changed", "Worth Knowing"];
  const eras = data.eras.map((era) => ({ ...era, image: era.image || carImageFor(era.era, era.years, data.h2) }));

  return (
    <section id="engine-evolution" className="model-evo relative overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-[1546px] px-4 pb-12 pt-10 sm:px-6 lg:px-[var(--ev-px)] lg:pb-[var(--ev-pb)] lg:pt-[var(--ev-pt)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between xl:gap-10">
          <div className="min-w-0 xl:pt-[calc(var(--ev-title)*0.3)]">
            {/* Reference break ("…Engine Range" / "Evolved — 2017 to Today") from lg, when line one is short
                enough to hold; otherwise (phones, long names like "I-Pace Drive Unit") the title flows. */}
            <h2 className={`model-evo-title ${tones.text}`}>
              <span className={title.lines[0].length <= 32 ? "lg:block" : ""} dangerouslySetInnerHTML={{ __html: `${title.lines[0]} ` }} />
              {title.lines[1] ? (
                <span>
                  <span dangerouslySetInnerHTML={{ __html: title.lines[1] }} />{" "}
                  {title.accent ? <span className={`whitespace-nowrap ${tones.accent}`}>{title.accent}</span> : null}
                </span>
              ) : null}
            </h2>
            {data.subHeadline ? (
              <p
                className={`mt-3 max-w-[480px] text-[15px] leading-[1.6] lg:mt-[var(--ev-desc-mt)] lg:text-[length:var(--ev-desc)] lg:leading-[var(--ev-desc-lh)] ${tones.text}`}
                dangerouslySetInnerHTML={{ __html: typeset(data.subHeadline) }}
              />
            ) : null}
          </div>
          <Stats stats={data.stats} tones={tones} />
        </div>

        <div className="mt-6 lg:mt-[var(--ev-table-mt)]">
          <EraTable eras={eras} columns={columns} tones={tones} />
          <EraCards eras={eras} columns={columns} tones={tones} />
        </div>

        {data.footnote ? (
          <div
            className={`mt-4 flex items-center gap-4 rounded-xl border px-4 py-3 lg:mt-[var(--ev-foot-mt)] lg:min-h-[var(--ev-foot-h)] lg:px-[calc(var(--ev-cell-px)*0.9)] lg:py-2 ${tones.card} ${tones.text}`}
          >
            <FileText aria-hidden="true" className="h-7 w-7 shrink-0" strokeWidth={1.3} />
            <p className={`text-[12.5px] leading-[1.55] lg:max-w-[620px] lg:text-[length:var(--ev-foot)] ${tones.muted}`}>{cleanText(data.footnote)}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
