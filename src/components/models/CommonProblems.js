"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NumberGlyph, ShieldCheck, UsersRound } from "@/components/models/brandIcons";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { engineImageFor } from "@/components/shared/carImage";
import SectionQuoteCta from "@/components/shared/SectionQuoteCta";
import { outsideTags } from "@/components/models/outsideTags";

/*
 * Model page "Common Problems" (section 6), built from the 1536px brand reference.
 *
 * Header: title (model in black, "Engine Problems" in the site's silver accent), divider, copy; the
 * enquiries stat card on the right. Then the problem cards (dark studio photo left, number badge, title,
 * urgency dot, description, "Read more") - three across from xl, two from sm, one on phones - and the
 * urgency key. Sizes come from the --pr-* tokens in globals.css.
 *
 * Photos: six studio shots cut from the reference, matched to any model's problem by its wording (timing
 * chain, water pump, hybrid / battery, DPF / EGR, infotainment / electrics, air suspension). Anything else
 * shows the model's own engine photo on the same dark studio backdrop.
 */

const URGENCY = {
  catastrophic: "bg-[#e5393a]",
  immediate: "bg-[#f47b20]",
  monitor: "bg-[#f5c242]",
  low: "bg-[#2f9e47]",
};

const PHOTOS = [
  [/air suspension|compressor/i, "air-suspension"],
  [/infotainment|software|gremlin|electrical/i, "infotainment"],
  [/hybrid|phev|battery|charging|on-board charger|12v|drive unit|motor bearing/i, "hybrid"],
  [/dpf|adblue|egr|oil dilution|emission/i, "dpf"],
  [/timing chain|tensioner/i, "timing-chain"],
  [/water pump|coolant pump/i, "water-pump"],
];

function iconFor(issue = "") {
  if (/gearbox|transmission|torque converter|mechatronic/i.test(issue)) return "gearbox";
  if (/injector/i.test(issue)) return "injector";
  if (/turbo/i.test(issue)) return "turbo";
  if (/cool|thermostat|crossover/i.test(issue)) return "cooling";
  if (/oil/i.test(issue)) return "oil-leak";
  return "engine";
}

function photoFor(issue = "") {
  const match = PHOTOS.find(([pattern]) => pattern.test(issue));
  return match ? `/model/problems/${match[1]}.webp` : null;
}

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replaceAll("â†’", "→")
    .replace(/\s+/g, " ")
    .trim();
}

function typeset(text = "") {
  return outsideTags(cleanText(text), (part) =>
    part
      .replace(/(\d)\s*-\s*(\d)/g, "$1–$2")
      .replace(/\s-\s/g, " — "),
  );
}

// "Common E-Pace Engine Problems" -> "Common E-Pace" + "Engine Problems" (accent), as in the reference.
function splitTitle(title = "") {
  const clean = cleanText(title);
  const match = clean.match(/^(.*?)\s+((?:Engine|Drive Unit|EV)?\s*Problems)$/i);
  return match ? { main: match[1], accent: match[2].trim() } : { main: clean, accent: "" };
}

// "AJ200D / 204DTD Timing Chain Tensioner Wear" -> codes on line one, the fault on line two (reference).
function splitIssue(issue = "") {
  const clean = typeset(issue);
  // Only a code pair ("AJ200D / 204DTD") takes its own line; a single code wraps naturally ("AJ20D6 DPF &").
  const codes = clean.match(/^((?:[A-Z]{1,3}[\dA-Z-]*\d[\dA-Z-]*|\d{3}[A-Z]{2,3})\s*\/\s*[\dA-Z-]+)\s+(.+)$/);
  return codes ? [codes[1], codes[2]] : [clean];
}

function sentence(text = "") {
  const clean = typeset(text);
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function palette(isDark) {
  return isDark
    ? {
        text: "text-white",
        muted: "text-white/[0.72]",
        accent: "bg-[linear-gradient(180deg,#e4e4e1_0%,#9a9a97_100%)] bg-clip-text text-transparent",
        card: "border-white/[0.16] bg-[rgba(14,16,17,0.92)]",
        iconBox: "bg-white/[0.08] text-white",
        badge: "border-white/[0.3] text-white/[0.9]",
        rule: "border-white/[0.12]",
        num: "bg-[#ececea] text-[#111210]",
        divider: "bg-white/70",
      }
    : {
        text: "text-[#111210]",
        muted: "text-[#3d3e3b]",
        accent: "bg-[linear-gradient(180deg,#8a8b87_0%,#6b6c68_100%)] bg-clip-text text-transparent",
        card: "border-[#e8e8e5] bg-white shadow-[0_6px_20px_rgba(16,18,16,0.05)]",
        iconBox: "bg-[#f2f2f0] text-[#111210]",
        badge: "border-[#cfd0cc] bg-[#f6f6f4] text-[#2a2b29]",
        rule: "border-[#e8e8e5]",
        num: "bg-white text-[#111210]",
        divider: "bg-[#2a2b29]",
      };
}

/* ---------- Pieces ---------- */

function StatCard({ stat, tones }) {
  if (!stat?.value) return null;
  const verified = /VERIFIED/i.test(stat.tag || "");
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border px-4 py-4 lg:min-h-[var(--pr-stat-h)] lg:w-[var(--pr-stat-w)] lg:gap-[var(--pr-stat-gap)] lg:px-[var(--pr-stat-px)] lg:py-0 ${tones.card} ${tones.text}`}
    >
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl lg:h-[var(--pr-stat-icon)] lg:w-[var(--pr-stat-icon)] ${tones.iconBox}`}>
        <UsersRound aria-hidden="true" className="h-[55%] w-[55%]" strokeWidth={1.6} />
      </span>
      <div className="min-w-0">
        <p className="text-[24px] font-medium leading-none tracking-[-0.01em] lg:text-[length:var(--pr-stat-value)]">{stat.value}</p>
        <p className={`mt-1.5 text-[13.5px] leading-[1.4] lg:text-[length:var(--pr-stat-label)] lg:leading-[var(--pr-stat-lh)] ${tones.muted}`}>{cleanText(stat.label)}</p>
        {verified ? (
          <span className={`mt-1.5 inline-flex items-center gap-1 rounded-full border px-2 py-[1px] text-[11px] font-medium ${tones.badge}`}>
            <ShieldCheck aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
            Verified
          </span>
        ) : null}
      </div>
    </div>
  );
}

function ProblemPhoto({ issue, index, tones }) {
  const photo = photoFor(issue);
  const engine = photo ? null : engineImageFor(issue);
  return (
    // Photos are dark studio shots in both themes; the fallback engine stands on the same dark backdrop.
    <div className="relative aspect-[16/8] overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#2a2b2c_0%,#0c0c0d_75%)] sm:aspect-auto sm:min-h-[200px]">
      {photo ? (
        <Image src={photo} alt="" fill className="object-cover object-center" sizes="(min-width: 1280px) 190px, (min-width: 640px) 22vw, 100vw" />
      ) : engine ? (
        <Image src={engine} alt="" fill className="object-contain object-center p-3" sizes="(min-width: 1280px) 190px, 36vw" />
      ) : (
        // No matching photo: the problem's icon in silver on the same dark studio backdrop
        <span className="absolute inset-0 flex items-center justify-center">
          <HomeIcon name={iconFor(issue)} isDark className="h-[42%] max-h-24 w-[42%] max-w-24 opacity-90" />
        </span>
      )}
      {index < 10 ? (
        // Brand number disc on a white ring, so it reads on both the dark studio photo and the card
        <span className="absolute left-2.5 top-2.5 flex rounded-full bg-white p-[3px] text-[#111210] shadow-[0_2px_8px_rgba(0,0,0,0.35)] lg:left-[calc(var(--pr-num)*0.3)] lg:top-[calc(var(--pr-num)*0.3)]">
          <NumberGlyph value={index + 1} tone="current" className="h-[28px] w-[28px] lg:h-[calc(var(--pr-num)*0.95)] lg:w-[calc(var(--pr-num)*0.95)]" />
        </span>
      ) : (
        <span
          className={`absolute left-2.5 top-2.5 flex h-[30px] min-w-[32px] items-center justify-center rounded-md px-1.5 text-[15px] font-semibold leading-none shadow-sm lg:left-[calc(var(--pr-num)*0.3)] lg:top-[calc(var(--pr-num)*0.3)] lg:h-[var(--pr-num)] lg:min-w-[calc(var(--pr-num)*1.05)] lg:text-[length:var(--pr-num-text)] ${tones.num}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

function ProblemCard({ problem, index, tones }) {
  const lines = splitIssue(problem.issue);
  const type = cleanText(problem.severity?.type).toLowerCase();
  const dot = URGENCY[type];
  const href = problem.link?.href || "#";
  const label = cleanText(problem.link?.label || "Read more").replace(/\s*→\s*$/, "");

  return (
    <article className={`grid overflow-hidden rounded-xl border sm:grid-cols-[minmax(0,39%)_minmax(0,1fr)] ${tones.card} ${tones.text}`}>
      <ProblemPhoto issue={problem.issue} index={index} tones={tones} />
      <div className="flex min-w-0 flex-col px-4 py-4 sm:px-3.5 sm:py-3.5 lg:px-[var(--pr-card-px)] lg:py-[var(--pr-card-py)]">
        <h3 className="text-[15.5px] font-semibold leading-[1.3] lg:text-[length:var(--pr-card-title)] lg:leading-[var(--pr-card-title-lh)]">
          {lines.map((line) => (
            <span key={line} className="block" dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </h3>
        {dot ? (
          <p className="mt-2.5 flex items-center gap-2 text-[13px] font-semibold lg:mt-[var(--pr-sev-mt)] lg:text-[length:var(--pr-sev)]">
            <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-full ${dot}`} />
            {cleanText(problem.severity.label)}
          </p>
        ) : null}
        <p
          className={`mt-2.5 text-[13px] leading-[1.5] lg:mt-[var(--pr-card-text-mt)] lg:text-[length:var(--pr-card-text)] lg:leading-[var(--pr-card-text-lh)] ${tones.muted}`}
          dangerouslySetInnerHTML={{ __html: typeset(problem.description) }}
        />
        <Link
          href={href}
          className="ml-auto mt-auto inline-flex min-h-[40px] items-center gap-2 pt-3 text-[13.5px] !font-semibold hover:underline hover:underline-offset-2 lg:text-[length:var(--pr-more)]"
        >
          <span dangerouslySetInnerHTML={{ __html: label }} />
          <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
        </Link>
      </div>
    </article>
  );
}

function UrgencyKey({ items = [], tones }) {
  if (!items.length) return null;
  return (
    <div
      className={`mt-5 grid gap-4 rounded-xl border px-4 py-4 sm:grid-cols-2 lg:mt-[var(--pr-key-mt)] lg:min-h-[var(--pr-key-h)] lg:grid-cols-[minmax(0,0.8fr)_repeat(4,minmax(0,1fr))] lg:items-center lg:gap-0 lg:px-[var(--pr-key-px)] lg:py-3 ${tones.card} ${tones.text}`}
    >
      <p className="text-[14px] font-semibold uppercase tracking-[0.02em] sm:col-span-2 lg:col-span-1 lg:self-start lg:pt-1 lg:text-[length:var(--pr-key-label)]">Urgency key</p>
      {items.map((item, index) => {
        const type = cleanText(item.label).toLowerCase();
        return (
          <div key={item.label} className={`flex gap-3 lg:px-[calc(var(--pr-key-px)*0.9)] ${index > 0 ? `lg:border-l ${tones.rule}` : ""}`}>
            <span aria-hidden="true" className={`mt-[3px] h-3.5 w-3.5 shrink-0 rounded-full ${URGENCY[type] || "bg-current"}`} />
            <div>
              <p className="text-[14.5px] font-semibold lg:text-[length:var(--pr-key-label)]">{cleanText(item.label)}</p>
              <p className={`mt-1 text-[12.5px] leading-[1.5] lg:text-[length:var(--pr-key-text)] lg:leading-[var(--pr-key-lh)] ${tones.muted}`}>{sentence(item.text)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Section ---------- */

export default function CommonProblems({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const tones = palette(isDark);
  const title = splitTitle(data.h2);
  const modelName = String(data.h2 || "").match(/Common\s+(?:Jaguar\s+)?(.+?)\s+(?:Engine\s+|Drive Unit\s+|EV\s+)?Problems/i)?.[1]?.trim() || "Jaguar";

  return (
    <section id="common-problems" className="model-problems relative overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-[1546px] px-4 pb-12 pt-10 sm:px-6 lg:px-[var(--pr-px)] lg:pb-[var(--pr-pb)] lg:pt-[var(--pr-pt)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="min-w-0 lg:pt-[calc(var(--pr-title)*0.55)]">
            <h2 className={`model-problems-title ${tones.text}`}>
              <span dangerouslySetInnerHTML={{ __html: title.main }} />
              {title.accent ? (
                <>
                  {" "}
                  <span className={tones.accent} dangerouslySetInnerHTML={{ __html: title.accent }} />
                </>
              ) : null}
            </h2>
            <div aria-hidden="true" className={`mt-3 h-px w-8 lg:mt-[var(--pr-div-mt)] ${tones.divider}`} />
            {data.subHeadline ? (
              <p
                className={`mt-3 max-w-[560px] text-[15px] leading-[1.6] lg:mt-[var(--pr-desc-mt)] lg:text-[length:var(--pr-desc)] lg:leading-[var(--pr-desc-lh)] ${tones.muted}`}
                dangerouslySetInnerHTML={{ __html: typeset(data.subHeadline) }}
              />
            ) : null}
          </div>
          <StatCard stat={data.stat} tones={tones} />
        </div>

        <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:mt-[var(--pr-grid-mt)] lg:gap-[var(--pr-gap)] xl:grid-cols-3">
          {(data.problems || []).map((problem, index) => (
            <ProblemCard key={problem.id || problem.issue} problem={problem} index={index} tones={tones} />
          ))}
        </div>

        <UrgencyKey items={data.urgencyKey} tones={tones} />

        <SectionQuoteCta
          label={`Diagnose Jaguar ${modelName} Engine Problems`}
          href="/quote"
          support="Experiencing similar symptoms? Explore possible faults and understand your repair or replacement options."
          isDark={isDark}
        />
      </div>
    </section>
  );
}
