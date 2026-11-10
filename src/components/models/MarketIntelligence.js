"use client";

import Image from "next/image";
import { ArrowRight, TrendingDown } from "lucide-react";
import { BarChart3, CarFront, ShieldCheck, TrendingUp, UsersRound, Zap, StarBadge } from "@/components/models/brandIcons";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import CarOnBackground from "@/components/shared/CarOnBackground";
import { carImageFor } from "@/components/shared/carImage";
import { outsideTags } from "@/components/models/outsideTags";

/*
 * Model page "Market Intelligence" + editorial pull-quote (section 7), built from the 1536px reference.
 *
 * Title (two lines, the "N UK Owners" phrase in the silver accent) with the enquiries stat card on the
 * right; the signal table (black header, icon circle, value + source tag, trend arrow); "Insights from the
 * data" in three columns; the pull-quote card with a photo on its right, cut on a diagonal. Sizes come from
 * the --mi-* tokens in globals.css. Below lg everything stacks; the table becomes one row card per signal.
 */

const INSIGHT_ICONS = [StarBadge, ShieldCheck, Zap];

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replace(/\s+/g, " ")
    .trim();
}

function typeset(text = "") {
  return outsideTags(cleanText(text), (part) =>
    part
      .replace(/(\d)\s*-\s*(£?\d)/g, "$1–$2")
      .replace(/\s-\s/g, " — "),
  );
}

// "E-Pace Market Intelligence - What 140 UK Owners Told Us in 2025"
//   -> line 1 "E-Pace Market Intelligence —", line 2 "What " + accent "140 UK Owners" + " Told Us in 2025"
function splitTitle(title = "") {
  const clean = cleanText(title);
  const [lead, tail = ""] = clean.split(/\s+[-–—]\s+/);
  const accent = tail.match(/^(What\s+)(.+?\bOwners)(.*)$/i);
  return { lead: tail ? `${lead} —` : lead, before: accent ? accent[1] : tail, accent: accent ? accent[2] : "", after: accent ? accent[3] : "" };
}

// "590 JLR-wide enquiries [JAG-VERIFIED]" -> figure "590", note "JLR-wide enquiries [JAG-VERIFIED]"
function splitData(text = "") {
  const clean = typeset(text);
  const match = clean.match(/^((?:~|Approx\s+)?[£\d][\d,.%+£–-]*)\s+(.*)$/i);
  return match ? { figure: match[1], note: match[2] } : { figure: "", note: clean };
}

function trendOf(text = "") {
  const clean = cleanText(text);
  const kind = /^(⬆|↑)|rising/i.test(clean) ? "rising" : /^(⬇|↓)|falling/i.test(clean) ? "falling" : "stable";
  return { kind, label: clean.replace(/^[⬆⬇➡↑↓→]️?\s*/, "") };
}

// Leading "Interesting insight:" (or a bolded lead such as "Petrol Ingenium") is set in bold.
function insightParts(text = "") {
  const clean = typeset(text);
  const colon = clean.match(/^([^:.]{3,40}):\s*(.*)$/);
  return colon ? { lead: `${colon[1]}:`, body: colon[2] } : { lead: "", body: clean };
}

function palette(isDark) {
  return isDark
    ? {
        text: "text-white",
        muted: "text-white/[0.72]",
        accent: "bg-[linear-gradient(180deg,#e4e4e1_0%,#9a9a97_100%)] bg-clip-text text-transparent",
        card: "border-white/[0.16] bg-[rgba(14,16,17,0.92)]",
        head: "bg-[#2a2b2c] text-white",
        circle: "bg-white/[0.08] text-white",
        rule: "border-white/[0.1]",
        quoteMark: "bg-[#ececea] text-[#111210]",
        quoteCard: "border-white/[0.16] bg-[linear-gradient(90deg,#141617_0%,#0f1011_60%)]",
        rising: "text-[#4fc27a]",
        falling: "text-[#f0625a]",
      }
    : {
        text: "text-[#111210]",
        muted: "text-[#3d3e3b]",
        accent: "bg-[linear-gradient(180deg,#8a8b87_0%,#6b6c68_100%)] bg-clip-text text-transparent",
        card: "border-[#e8e8e5] bg-white shadow-[0_6px_20px_rgba(16,18,16,0.05)]",
        head: "bg-[#1f2021] text-white",
        circle: "bg-[#efefed] text-[#111210]",
        rule: "border-[#ececea]",
        quoteMark: "bg-[#111210] text-white",
        quoteCard: "border-[#e8e8e5] bg-[linear-gradient(90deg,#f6f6f5_0%,#fbfbfa_60%)] shadow-[0_6px_20px_rgba(16,18,16,0.05)]",
        rising: "text-[#2f8a4f]",
        falling: "text-[#d42a2a]",
      };
}

/* ---------- Pieces ---------- */

function StatCard({ stat, tones }) {
  if (!stat?.value) return null;
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border px-4 py-4 lg:min-h-[var(--mi-stat-h)] lg:min-w-[var(--mi-stat-w)] lg:shrink-0 lg:gap-[var(--mi-stat-gap)] lg:px-[var(--mi-stat-px)] lg:py-0 ${tones.card} ${tones.text}`}
    >
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full lg:h-[var(--mi-stat-circle)] lg:w-[var(--mi-stat-circle)] ${tones.circle}`}>
        <UsersRound aria-hidden="true" className="h-[52%] w-[52%]" strokeWidth={1.7} />
      </span>
      <div className="min-w-0">
        <p className="text-[24px] font-medium leading-none tracking-[-0.01em] lg:text-[length:var(--mi-stat-value)]">{stat.value}</p>
        <p className="mt-1.5 text-[13.5px] lg:whitespace-nowrap lg:text-[length:var(--mi-stat-label)]">{cleanText(stat.label)}</p>
        {stat.tag ? <p className={`mt-1 text-[12.5px] lg:text-[length:calc(var(--mi-stat-label)*0.93)] ${tones.muted}`}>{stat.tag}</p> : null}
      </div>
    </div>
  );
}

function SignalIcon({ index, isDark }) {
  if (index === 0) return <CarFront aria-hidden="true" className="h-[48%] w-[48%]" strokeWidth={1.7} />;
  return <HomeIcon name="engine" isDark={isDark} className="h-[62%] w-[62%]" />;
}

function Trend({ text, tones }) {
  const { kind, label } = trendOf(text);
  const Icon = kind === "rising" ? TrendingUp : kind === "falling" ? TrendingDown : ArrowRight;
  return (
    <span className="flex items-center gap-4">
      <Icon aria-hidden="true" className={`h-6 w-6 shrink-0 ${kind === "stable" ? "" : tones[kind]}`} strokeWidth={1.8} />
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </span>
  );
}

function SignalTable({ rows, tones, isDark }) {
  if (!rows.length) return null;
  const cols = "lg:grid-cols-[minmax(0,503fr)_minmax(0,468fr)_minmax(0,461fr)]";
  return (
    <div className={`overflow-hidden rounded-xl border ${tones.card} ${tones.text}`}>
      <div className={`hidden h-[var(--mi-th-h)] items-center text-[length:var(--mi-th)] font-medium lg:grid ${cols} ${tones.head}`}>
        <span className="pl-[var(--mi-row-pl)]">Signal</span>
        <span className="h-full border-l border-white/[0.28] pl-[var(--mi-cell-pl)] leading-[var(--mi-th-h)]">2025 Data</span>
        <span className="h-full border-l border-white/[0.28] pl-[var(--mi-cell-pl)] leading-[var(--mi-th-h)]">Demand Trend</span>
      </div>
      <ul>
        {rows.map((row, index) => {
          const data = splitData(row.data);
          return (
            <li
              key={row.signal}
              className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 gap-y-1 px-4 py-3.5 lg:min-h-[var(--mi-row-h)] lg:gap-0 lg:px-0 lg:py-0 ${cols} ${index > 0 ? `border-t ${tones.rule}` : ""}`}
            >
              <div className="row-span-3 flex items-center gap-[var(--mi-row-gap)] self-start lg:row-span-1 lg:self-auto lg:pl-[var(--mi-row-pl)]">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full lg:h-[var(--mi-circle)] lg:w-[var(--mi-circle)] ${tones.circle}`}>
                  <SignalIcon index={index} isDark={isDark} />
                </span>
                <span className="hidden text-[length:var(--mi-cell)] font-medium lg:block" dangerouslySetInnerHTML={{ __html: typeset(row.signal) }} />
              </div>
              <span className="text-[15px] font-semibold leading-snug lg:hidden" dangerouslySetInnerHTML={{ __html: typeset(row.signal) }} />
              <p className={`text-[14px] leading-snug lg:flex lg:h-full lg:items-center lg:gap-3 lg:border-l lg:pl-[var(--mi-cell-pl)] lg:text-[length:var(--mi-cell)] ${tones.rule}`}>
                {data.figure ? <strong className="mr-2 font-semibold lg:mr-0">{data.figure}</strong> : null}
                <span className={`text-[13px] lg:text-[length:var(--mi-tag)] ${data.figure ? tones.muted : ""}`} dangerouslySetInnerHTML={{ __html: data.note }} />
              </p>
              <div className={`text-[14px] lg:flex lg:h-full lg:items-center lg:border-l lg:pl-[var(--mi-cell-pl)] lg:text-[length:var(--mi-cell)] ${tones.rule}`}>
                <Trend text={row.demandTrend} tones={tones} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Insights({ items, tones }) {
  if (!items.length) return null;
  return (
    <div className={`mt-4 rounded-xl border px-4 py-5 lg:mt-[var(--mi-gap)] lg:px-[var(--mi-ins-px)] lg:pb-[var(--mi-ins-pt)] lg:pt-[var(--mi-ins-pt)] ${tones.card} ${tones.text}`}>
      <h3 className="flex items-center gap-3.5 text-[16px] font-semibold lg:text-[length:var(--mi-ins-head)]">
        <BarChart3 aria-hidden="true" className="h-5 w-5" strokeWidth={2.4} />
        Insights from the data:
      </h3>
      <ul className={`mt-4 grid gap-5 lg:mt-[calc(var(--mi-ins-pt)*1.6)] lg:gap-0 ${items.length > 1 ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
        {items.map((item, index) => {
          const Icon = INSIGHT_ICONS[index % INSIGHT_ICONS.length];
          const { lead, body } = insightParts(item);
          return (
            <li
              key={item.slice(0, 40)}
              className={`flex gap-3.5 lg:gap-[var(--mi-ins-gap)] lg:px-[var(--mi-ins-col-px)] lg:first:pl-0 lg:last:pr-0 ${index > 0 ? `lg:border-l ${tones.rule}` : ""}`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full lg:h-[var(--mi-ins-circle)] lg:w-[var(--mi-ins-circle)] ${tones.circle}`}>
                <Icon aria-hidden="true" className="h-[50%] w-[50%]" strokeWidth={1.7} />
              </span>
              <p className={`text-[13.5px] leading-[1.55] lg:text-[length:var(--mi-ins)] lg:leading-[var(--mi-ins-lh)] ${tones.muted}`}>
                {lead ? <strong className={`font-semibold ${tones.text}`} dangerouslySetInnerHTML={{ __html: `${lead} ` }} /> : null}
                <span dangerouslySetInnerHTML={{ __html: body }} />
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PullQuote({ data, tones, isDark }) {
  if (!data?.quote) return null;
  const scene = data.scene;
  const car = scene ? null : data.image || carImageFor(data.title, data.quote);
  const text = typeset(data.quote).replace(/^["“]|["”]$/g, "");

  return (
    <figure
      className={`relative mt-4 grid overflow-hidden rounded-xl border lg:mt-[var(--mi-gap)] lg:min-h-[var(--mi-quote-h)] lg:grid-cols-[minmax(0,907fr)_minmax(0,575fr)] ${tones.quoteCard} ${tones.text}`}
    >
      <div className="relative z-10 flex flex-col gap-3 px-4 py-5 sm:flex-row sm:gap-4 lg:gap-[var(--mi-quote-gap)] lg:px-[var(--mi-quote-px)] lg:py-[calc(var(--mi-quote-px)*1.15)]">
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-[28px] sm:h-12 sm:w-12 sm:text-[34px] font-bold leading-none lg:h-[var(--mi-quote-mark)] lg:w-[var(--mi-quote-mark)] lg:text-[calc(var(--mi-quote-mark)*0.72)] ${tones.quoteMark}`}
        >
          <span className="translate-y-[16%]">{"“"}</span>
        </span>
        <div className="min-w-0 pt-1 lg:pt-[calc(var(--mi-quote-px)*0.25)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.04em] lg:text-[length:var(--mi-quote-label)]">{cleanText(data.label || "Editorial pull-quote")}</p>
          <h3 className="mt-2 text-[20px] font-semibold leading-tight lg:mt-[calc(var(--mi-quote-px)*0.5)] lg:text-[length:var(--mi-quote-title)]" dangerouslySetInnerHTML={{ __html: typeset(data.title) }} />
          <blockquote
            className={`mt-3 max-w-[530px] text-[15px] leading-[1.6] lg:mt-[calc(var(--mi-quote-px)*0.6)] lg:text-[length:var(--mi-quote-text)] lg:leading-[var(--mi-quote-lh)] ${tones.muted}`}
            dangerouslySetInnerHTML={{ __html: `“${text}”` }}
          />
        </div>
      </div>

      {/* Photo on the right, cut on a diagonal (reference); a full-width band under the quote below lg */}
      {scene || car ? (
        <div aria-hidden="true" className="relative aspect-[16/7] lg:aspect-auto lg:[clip-path:polygon(8%_0,100%_0,100%_100%,0_100%)]">
          {scene ? (
            <Image src={scene.src} alt="" fill sizes="(min-width: 1024px) 575px, 100vw" className="object-cover object-[60%_center]" />
          ) : (
            <CarOnBackground
              src={car}
              isDark={isDark}
              className="absolute inset-0"
              bgClassName="object-cover object-[62%_78%]"
              carClassName="inset-x-[12%] top-[12%] bottom-[8%]"
              sizes="(min-width: 1024px) 575px, 100vw"
            />
          )}
        </div>
      ) : null}
    </figure>
  );
}

/* ---------- Section ---------- */

export default function MarketIntelligence({ data, quoteData }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const tones = palette(isDark);
  const title = splitTitle(data.h2);

  return (
    <section id="market-intelligence" className="model-market relative overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-[1546px] px-4 pb-12 pt-10 sm:px-6 lg:px-[var(--mi-px)] lg:pb-[var(--mi-pb)] lg:pt-[var(--mi-pt)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h2 className={`model-market-title ${tones.text}`}>
            <span className="block" dangerouslySetInnerHTML={{ __html: title.lead }} />
            {title.before || title.accent ? (
              <span className="block">
                {title.before}
                {title.accent ? <span className={tones.accent}>{title.accent}</span> : null}
                {title.after}
              </span>
            ) : null}
          </h2>
          <StatCard stat={data.stat} tones={tones} />
        </div>

        <div className="mt-6 lg:mt-[var(--mi-table-mt)]">
          <SignalTable rows={data.signals || []} tones={tones} isDark={isDark} />
        </div>
        <Insights items={data.insights || []} tones={tones} />
        <PullQuote data={quoteData} tones={tones} isDark={isDark} />
      </div>
    </section>
  );
}
