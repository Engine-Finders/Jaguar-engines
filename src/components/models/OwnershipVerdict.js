"use client";

import Image from "next/image";
import { Star, StarHalf } from "lucide-react";
import { CircleAlert, CircleCheck, Crown, Gem, Medal, Rocket, Scale, ShieldCheck, ShoppingCart, TriangleAlert, Trophy, Zap, PoundShield, StarBadge } from "@/components/models/brandIcons";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { carImageFor } from "@/components/shared/carImage";
import CarOnBackground from "@/components/shared/CarOnBackground";
import { splitStat } from "@/components/models/statText";
import { outsideTags } from "@/components/models/outsideTags";

/*
 * Model page "Ownership Verdict", built from the 1536px brand references (light + dark).
 *
 *  - lg+ (1024px up): the reference layout. Left: title + copy over the scene, the car resting on the
 *    one-line verdict card, which is bottom-aligned with the verdict table on the right. Sizes come from
 *    the --v-* tokens in globals.css: exact reference values at 1536px, scaled linearly down to 1024px.
 *  - sm–lg (640–1023px): the same overlay composition at full width, table below.
 *  - phones: copy, scene, card, then the table as stacked rows.
 */

// Same artwork as the reference strip: bar chart, shield, book, trophy.
const STAT_ICONS = ["real-inquiries", "shield", "generation-honest-rated", "engine-finders"];

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replaceAll("â€¢", "•")
    .replaceAll("â˜…", "★")
    .replaceAll("â˜†", "☆")
    .replace(/\s+/g, " ")
    .trim();
}

// " - " separators read as em dashes; numeric ranges (£3,000-£5,800, 2017-2020) take an en dash.
function typeset(text = "") {
  return outsideTags(cleanText(text), (part) =>
    part
      .replace(/\s-\s/g, " — ")
      .replace(/(\d)-(£?\d)/g, "$1–$2"),
  );
}

function splitTitle(title = "") {
  const match = cleanText(title).match(/^(.*?)\s+[-–—]\s+(.*)$/);
  if (!match) return { lead: cleanText(title), accent: "" };
  return { lead: `${match[1]} —`, accent: match[2] };
}

/* ---------- Icons ---------- */

const GLYPH = "h-[20px] w-[20px] sm:h-[22px] sm:w-[22px] lg:h-[var(--v-glyph)] lg:w-[var(--v-glyph)]";

function LineIcon({ icon: Icon, className = GLYPH }) {
  return <Icon aria-hidden="true" className={className} strokeWidth={1.9} />;
}

// Metric -> glyph, matched to the reference: outline star/scales/shield/triangle/cart, filled
// trophy/bars/crown (the site's own icon set) and a plain pound sign.
function MetricGlyph({ metric, isDark }) {
  const name = cleanText(metric).toLowerCase();
  if (name.includes("ownership rating")) return <LineIcon icon={StarBadge} />;
  if (name.includes("economics")) return <LineIcon icon={Scale} />;
  if (name === "reliability") return <LineIcon icon={ShieldCheck} />;
  if (name.includes("most reliable")) {
    return <HomeIcon name="trophy" isDark={isDark} className="h-[30px] w-[30px] sm:h-[32px] sm:w-[32px] lg:h-[calc(var(--v-glyph)*1.55)] lg:w-[calc(var(--v-glyph)*1.55)]" />;
  }
  if (name.includes("highest-risk") || name.includes("highest risk")) return <LineIcon icon={TriangleAlert} />;
  if (name.includes("used buy") || name.includes("petrol buy")) return <LineIcon icon={ShoppingCart} />;
  if (name.includes("replacement")) {
    return <LineIcon icon={PoundShield} />;
  }
  if (name.includes("failure")) {
    return <HomeIcon name="real-inquiries" isDark={isDark} className="h-[28px] w-[28px] sm:h-[30px] sm:w-[30px] lg:h-[calc(var(--v-glyph)*1.5)] lg:w-[calc(var(--v-glyph)*1.5)]" />;
  }
  if (name.includes("ranking")) {
    return <HomeIcon name="ranking" isDark={isDark} className="h-[30px] w-[30px] sm:h-[32px] sm:w-[32px] lg:h-[calc(var(--v-glyph)*1.65)] lg:w-[calc(var(--v-glyph)*1.65)]" />;
  }
  return <LineIcon icon={ShieldCheck} />;
}

function IconCircle({ children, isDark, className = "" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${
        isDark
          ? "border border-white/[0.16] bg-[radial-gradient(circle_at_32%_28%,#232323_0%,#0f0f0f_78%)] text-white"
          : "bg-white text-[#141513] shadow-[0_2px_8px_rgba(16,18,16,0.12),0_0_0_1px_rgba(16,18,16,0.04)]"
      } ${className}`}
    >
      {children}
    </span>
  );
}

// Leading emoji in the data become the reference's line icons.
const LEAD_ICONS = [
  ["✅", CircleCheck, "check"],
  ["🚀", Rocket],
  ["🏆", Trophy],
  ["⚡", Zap],
  ["🔴", CircleAlert],
  ["⚠️", TriangleAlert],
  ["⚠", TriangleAlert],
  ["🥇", Medal],
  ["👑", Crown],
  ["💎", Gem],
];

// Engine codes the reference sets in bold: AJ200P, 204DTD, AJ20D6, AJ-V8 …
const CODE = "(?:<a[^>]*>)?(?=[A-Z0-9-]*[A-Z])(?=[A-Z0-9-]*\\d)[A-Z0-9-]{3,}(?:<\\/a>)?";
const LEADING_CODES = new RegExp(`^(${CODE}(?:\\s*\\/\\s*${CODE})*)`);

const STAR = "h-[20px] w-[20px] sm:h-[22px] sm:w-[22px] lg:h-[var(--v-star)] lg:w-[var(--v-star)]";

function Stars({ value, isDark }) {
  const full = (value.match(/★/g) || []).length;
  const half = value.includes("½") ? 1 : 0;
  const total = Math.max(5, full + half + (value.match(/☆/g) || []).length);

  return (
    <span
      className={`inline-flex items-center gap-[7px] lg:gap-[calc(var(--v-star)*0.32)] ${isDark ? "text-[#d6d6d3]" : "text-[#141513]"}`}
      role="img"
      aria-label={`${full + half * 0.5} out of ${total} stars`}
    >
      {Array.from({ length: total }, (_, index) => {
        if (index < full) return <Star key={index} aria-hidden="true" className={`${STAR} fill-current`} strokeWidth={1.5} />;
        if (index === full && half) {
          return (
            <span key={index} className={`relative ${STAR}`}>
              <Star aria-hidden="true" className="absolute inset-0 h-full w-full" strokeWidth={1.25} />
              <StarHalf aria-hidden="true" className="absolute inset-0 h-full w-full fill-current" strokeWidth={1.5} />
            </span>
          );
        }
        return <Star key={index} aria-hidden="true" className={STAR} strokeWidth={1.25} />;
      })}
    </span>
  );
}

function VerdictValue({ text, isDark }) {
  const raw = cleanText(text);
  if (/^[★☆½\s]+$/.test(raw)) return <Stars value={raw} isDark={isDark} />;

  const strong = `font-semibold text-[15px] lg:text-[length:var(--v-strong)] ${isDark ? "text-white" : "text-[#111210]"}`;
  const lead = LEAD_ICONS.find(([emoji]) => raw.startsWith(emoji));

  if (lead) {
    const [emoji, Icon, kind] = lead;
    const body = typeset(raw.slice(emoji.length).trim());
    const [label, ...rest] = body.split(" — ");
    const iconTone = kind === "check" && !isDark ? "text-[#2f7a4f]" : isDark ? "text-white" : "text-[#141513]";
    return (
      <span className="flex items-start gap-3">
        <Icon aria-hidden="true" className={`mt-px shrink-0 ${GLYPH} ${iconTone}`} strokeWidth={1.9} />
        <span>
          <strong className={strong} dangerouslySetInnerHTML={{ __html: label }} />
          {rest.length ? <span dangerouslySetInnerHTML={{ __html: ` — ${rest.join(" — ")}` }} /> : null}
        </span>
      </span>
    );
  }

  const body = typeset(raw);
  const codes = body.match(LEADING_CODES);
  if (codes) {
    return (
      <span>
        <strong className={strong} dangerouslySetInnerHTML={{ __html: codes[1] }} />
        <span dangerouslySetInnerHTML={{ __html: body.slice(codes[1].length) }} />
      </span>
    );
  }
  return <span dangerouslySetInnerHTML={{ __html: body }} />;
}

/* ---------- Table ---------- */

const COLS = "sm:grid-cols-[minmax(0,294fr)_minmax(0,450fr)]";

function VerdictTable({ metrics, isDark }) {
  const rule = isDark ? "border-white/[0.1]" : "border-[#e9e9e6]";

  return (
    <div
      className={`overflow-hidden rounded-[14px] border px-3 sm:px-4 lg:px-[var(--v-inset)] ${
        isDark
          ? "border-white/[0.18] bg-[rgba(10,10,10,0.9)] shadow-[0_18px_44px_rgba(0,0,0,0.5)]"
          : "border-[#e6e6e3] bg-white shadow-[0_10px_34px_rgba(16,18,16,0.07)]"
      }`}
    >
      {/* Header: two labelled columns from sm up (phones read each row as a stacked card) */}
      <div
        className={`hidden h-[54px] items-center border-b text-[15.5px] font-medium sm:grid lg:h-[var(--v-head-h)] lg:text-[length:var(--v-head)] ${COLS} ${rule} ${
          isDark ? "text-white" : "text-[#111210]"
        }`}
      >
        <span className="pl-3 lg:pl-[calc(var(--v-metric-pl)+8px)]">Verdict Metric</span>
        <span className="pl-6 lg:pl-[var(--v-verdict-pl)]">Our Verdict</span>
      </div>

      <ul>
        {metrics.map((row, index) => (
          <li
            key={row.metric}
            className={`grid grid-cols-[auto_minmax(0,1fr)] gap-x-3.5 py-3.5 sm:gap-x-0 sm:py-0 ${COLS} ${index > 0 ? `border-t ${rule}` : ""}`}
          >
            <div className="row-span-2 flex items-start gap-4 sm:row-span-1 sm:items-center sm:py-2.5 sm:pl-2 sm:pr-3 lg:gap-[var(--v-metric-gap)] lg:py-[var(--v-row-py)] lg:pl-[var(--v-metric-pl)]">
              <IconCircle isDark={isDark} className="h-10 w-10 sm:h-[44px] sm:w-[44px] lg:h-[var(--v-circle)] lg:w-[var(--v-circle)]">
                <MetricGlyph metric={row.metric} isDark={isDark} />
              </IconCircle>
              <span
                className={`hidden text-[15px] leading-[1.35] sm:block lg:text-[length:var(--v-label)] ${isDark ? "text-white/[0.94]" : "text-[#111210]"}`}
                dangerouslySetInnerHTML={{ __html: cleanText(row.metric) }}
              />
            </div>
            {/* Phones: metric name above its verdict */}
            <span
              className={`self-end text-[14px] font-semibold leading-snug sm:hidden ${isDark ? "text-white" : "text-[#111210]"}`}
              dangerouslySetInnerHTML={{ __html: cleanText(row.metric) }}
            />
            <div
              className={`mt-1 flex items-center text-[14.5px] leading-[1.6] sm:mt-0 sm:border-l sm:py-2.5 sm:pl-6 sm:pr-3 sm:text-[14.5px] sm:leading-[23px] lg:py-[var(--v-row-py)] lg:pl-[var(--v-verdict-pl)] lg:pr-[var(--v-verdict-pr)] lg:text-[length:var(--v-verdict)] lg:leading-[var(--v-verdict-lh)] ${rule} ${
                isDark ? "text-white/[0.78]" : "text-[#3d3e3b]"
              } [&_a]:[font-weight:inherit] [&_a]:text-inherit [&_a]:underline-offset-2 [&_a:hover]:underline`}
            >
              <VerdictValue text={row.ourCall} isDark={isDark} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- One-line verdict ---------- */

function OneLineVerdict({ text, isDark }) {
  // Engine codes in the sentence are set in bold, as in the reference ("The petrol AJ200P …").
  const html = typeset(text).replace(/\b(AJ[-\dA-Z]+|\d{3}[A-Z]{2,4})\b/g, `<strong class="font-semibold ${isDark ? "text-white" : "text-[#111210]"}">$1</strong>`);

  return (
    // Phones: shield beside the heading, sentence full width below. From sm: the reference layout,
    // shield on the left spanning both lines.
    <div
      className={`relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 rounded-xl border p-4 sm:items-start sm:gap-x-6 sm:p-6 lg:gap-x-[var(--v-card-gap)] lg:py-[var(--v-card-py)] lg:pl-[var(--v-card-pl)] lg:pr-[var(--v-card-pr)] ${
        isDark
          ? "border-white/[0.18] bg-[rgba(10,10,10,0.9)] shadow-[0_18px_44px_rgba(0,0,0,0.5)] backdrop-blur-md"
          : "border-[#e9e9e6] bg-white shadow-[0_10px_30px_rgba(16,18,16,0.07)]"
      }`}
    >
      <Image
        src={isDark ? "/model/verdict/verdict-shield-dark.webp" : "/model/verdict/verdict-shield-light.webp"}
        alt=""
        width={isDark ? 162 : 174}
        height={isDark ? 192 : 200}
        className="h-[46px] w-auto sm:row-span-2 sm:h-[76px] lg:h-[var(--v-shield)]"
      />
      <p className={`pr-8 text-[16px] font-semibold leading-snug sm:text-[17px] lg:text-[length:var(--v-card-head)] ${isDark ? "text-white" : "text-[#111210]"}`}>
        One-line verdict:
      </p>
      <p
        className={`col-span-2 mt-3 text-[14.5px] leading-[1.6] sm:col-span-1 sm:col-start-2 sm:mt-1.5 lg:mt-[6px] lg:text-[length:var(--v-card-text)] lg:leading-[var(--v-card-lh)] ${
          isDark ? "text-white/[0.8]" : "text-[#2c2d2b]"
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <HomeIcon
        name="quote"
        isDark={isDark}
        className="absolute right-4 top-4 h-7 w-7 rotate-180 sm:right-6 sm:top-6 lg:right-[calc(var(--v-card-pr)-6px)] lg:top-[var(--v-card-py)] lg:h-[calc(var(--v-quote)*1.35)] lg:w-[calc(var(--v-quote)*1.35)]"
      />
    </div>
  );
}

/* ---------- Stats strip ---------- */

function StatsStrip({ items, isDark }) {
  const divider = isDark ? "bg-white/[0.13]" : "bg-[#e3e3e0]";
  const text = isDark ? "text-white/[0.85]" : "text-[#3d3e3b]";

  return (
    <ul
      className={`mt-4 hidden grid-cols-2 overflow-hidden rounded-xl border md:grid lg:mt-[var(--v-stats-mt)] lg:min-h-[var(--v-stats-h)] lg:grid-cols-4 ${
        isDark
          ? "border-white/[0.18] bg-[rgba(10,10,10,0.9)] shadow-[0_18px_44px_rgba(0,0,0,0.5)]"
          : "border-[#e9e9e6] bg-white shadow-[0_10px_30px_rgba(16,18,16,0.06)]"
      }`}
    >
      {items.slice(0, 4).map((item, index) => {
        const stat = splitStat(item);
        return (
          <li
            key={item.label}
            className="relative flex items-center gap-4 px-6 py-4 lg:gap-[var(--v-stat-gap)] lg:py-3 lg:pl-[var(--v-stat-pl)] lg:pr-3"
          >
            {index % 2 === 0 ? <span aria-hidden="true" className={`absolute inset-y-4 right-0 w-px lg:hidden ${divider}`} /> : null}
            {index < 2 ? <span aria-hidden="true" className={`absolute inset-x-5 bottom-0 h-px lg:hidden ${divider}`} /> : null}
            {index < 3 ? <span aria-hidden="true" className={`absolute inset-y-4 right-0 hidden w-px lg:block ${divider}`} /> : null}
            <IconCircle isDark={isDark} className="h-14 w-14 lg:h-[var(--v-stat-circle)] lg:w-[var(--v-stat-circle)]">
              <HomeIcon
                name={STAT_ICONS[index] || STAT_ICONS[0]}
                isDark={isDark}
                className="h-[42px] w-[42px] lg:h-[var(--v-stat-glyph)] lg:w-[var(--v-stat-glyph)]"
              />
            </IconCircle>
            <div className="min-w-0 text-[15.5px] leading-[1.3] lg:max-w-[var(--v-stat-maxw)] lg:text-[length:var(--v-stat-label)] lg:leading-[var(--v-stat-lh)]">
              {stat.value ? (
                <p className={`text-[23px] font-medium leading-[1.15] lg:text-[length:var(--v-stat-value)] ${isDark ? "text-white" : "text-[#111210]"}`}>
                  {stat.value}
                </p>
              ) : null}
              {stat.prefix ? <p className={text}>{stat.prefix}</p> : null}
              <p
                className={stat.value ? text : `font-semibold ${isDark ? "text-white" : "text-[#111210]"}`}
                dangerouslySetInnerHTML={{ __html: stat.label }}
              />
              {stat.verified ? <p className={text}>[JAG-VERIFIED]</p> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Scene ---------- */

// The reference frame: left column from the navbar to just below the verdict card (~0.9 aspect),
// so the floor continues beside and under the card exactly as in the mockups.
function Scene({ photo, isScene, isDark }) {
  return (
    <div
      aria-hidden="true"
      className={[
        // phones: a full-bleed band under the copy, top of the sky cropped
        "relative -mx-4 mt-5 aspect-[724/600] overflow-hidden",
        // sm–lg: the full frame behind the copy (same grid cell, aligned to its bottom)
        "sm:col-start-1 sm:row-start-1 sm:-mx-6 sm:mt-0 sm:aspect-[715/796] sm:self-end",
        // lg+: behind the column, bleeding to the page edge and under the table's left edge. Its bottom
        // 22.4% is the floor under the reference card, so it hangs below the card's top edge by exactly
        // that much: the wheels always stand on the card, whatever height the card has.
        "lg:absolute lg:bottom-0 lg:left-[-40px] lg:-z-10 lg:mx-0 lg:w-[calc(100%+40px+var(--v-gap))] lg:translate-y-[22.4%]",
      ].join(" ")}
    >
      {isScene ? (
        <Image src={photo} alt="" fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover object-bottom" />
      ) : (
        // Models without an art-directed scene: their cut-out car stands in Jaguar's own scene (light /
        // dark), cropped to the column so the copy sits on the wall and the car on the floor above the card.
        <CarOnBackground
          src={photo}
          isDark={isDark}
          className="absolute inset-0"
          bgClassName="object-cover object-[72%_center]"
          carClassName="inset-x-[7%] top-[40%] bottom-[23%] sm:top-[46%] sm:bottom-[22%]"
          sizes="(min-width: 1024px) 720px, 100vw"
        />
      )}
      {/* soften the top into the page (and, from lg, the floor's lower edge beside a taller card) */}
      <div className="absolute inset-x-0 top-0 h-[16%] bg-[linear-gradient(180deg,var(--color-page)_0%,transparent_100%)] lg:h-[8%]" />
      <div className="absolute inset-x-0 bottom-0 hidden h-[7%] bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)] lg:block" />
      <div className="absolute inset-y-0 left-0 hidden w-[5%] bg-[linear-gradient(90deg,var(--color-page)_0%,transparent_100%)] min-[1600px]:block" />
    </div>
  );
}

/* ---------- Section ---------- */

export default function OwnershipVerdict({ data, stats = [] }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const scene = data.scenes?.[isDark ? "dark" : "light"] || null;
  const photo = scene?.src || data.image || carImageFor(data.h2) || null;
  const summary = data.summaryStats?.length ? data.summaryStats : stats;

  return (
    <section className="model-verdict relative isolate overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-[1546px] px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:px-10 lg:pb-[var(--v-pb)] lg:pt-[var(--v-pt)] 2xl:pl-[40px] 2xl:pr-[37px]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,642fr)_minmax(0,785fr)] lg:gap-[var(--v-gap)]">
          {/* Left column. Phones: stacked. sm–lg: copy and scene share one grid cell, card below.
              lg+: flex column, scene absolutely behind it, card pinned to the table's bottom edge. */}
          <div className="relative flex min-w-0 flex-col sm:grid sm:grid-cols-1 lg:flex">
            <div className="relative z-10 sm:col-start-1 sm:row-start-1 sm:self-start lg:pl-[10px]">
              <h2 className="model-verdict-title">
                <span className={`block ${isDark ? "text-white" : "text-[#111210]"}`} dangerouslySetInnerHTML={{ __html: title.lead }} />
                {title.accent ? (
                  <span
                    className={`block ${isDark ? "bg-[linear-gradient(180deg,#e4e4e1_0%,#9a9a97_100%)] bg-clip-text text-transparent" : "text-[#111210]"}`}
                    dangerouslySetInnerHTML={{ __html: title.accent }}
                  />
                ) : null}
              </h2>
              {data.subHeadline ? (
                <p
                  className={`mt-4 max-w-[470px] text-[15.5px] leading-[1.62] lg:mt-[var(--v-desc-mt)] lg:max-w-[455px] lg:text-[length:var(--v-desc)] lg:leading-[var(--v-desc-lh)] ${
                    isDark ? "text-white/[0.76]" : "text-[#5a5b57]"
                  }`}
                  dangerouslySetInnerHTML={{ __html: typeset(data.subHeadline) }}
                />
              ) : null}
            </div>

            {/* lg+: the space between the copy and the card; the scene is anchored to its bottom edge */}
            <div className="contents lg:relative lg:block lg:flex-1">
              {photo ? <Scene photo={photo} isScene={Boolean(scene)} isDark={isDark} /> : null}
            </div>

            {data.oneLineVerdict ? (
              // Overlaps the scene's floor (≈22% of its height, ≈20% of its width) like the reference.
              <div className="relative z-10 -mt-[18%] sm:col-start-1 sm:row-start-2 sm:-mt-[21%] lg:mt-0">
                <OneLineVerdict text={data.oneLineVerdict} isDark={isDark} />
              </div>
            ) : null}
          </div>

          <VerdictTable metrics={data.metrics || []} isDark={isDark} />
        </div>

        {summary.length > 0 ? <StatsStrip items={summary} isDark={isDark} /> : null}
      </div>
    </section>
  );
}
