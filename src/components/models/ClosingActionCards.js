"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Handshake, Search, Stethoscope } from "@/components/models/brandIcons";
import { useTheme } from "@/components/shared/themeProvider";
import CarOnBackground from "@/components/shared/CarOnBackground";
import { outsideTags } from "@/components/models/outsideTags";

/*
 * Model page "Ready to Make a Decision?" (section 14), built from the 1536px reference: one card holding the
 * title (second line in the silver accent), divider and two-line copy, the model's car in Jaguar's scene top
 * right, and three action cards (generations line-up, diagnosis checklist + engine, UK specialists map),
 * each with an icon tile, title, short rule, text and arrow link. Sizes come from the --ca-* tokens in
 * globals.css. Below md the action cards stack; the header scene becomes a band under the copy.
 */

const CARD_ICONS = { search: Search, diagnose: Stethoscope, specialists: Handshake };

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("â†’", "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function typeset(text = "") {
  return outsideTags(cleanText(text), (part) =>
    part.replace(/\s-\s/g, " — ").replace(/([A-Za-z])-([A-Za-z])/g, "$1‑$2"),
  );
}

// "Ready to Make a Decision?" -> "Ready to Make" / accent "a Decision?"
function splitTitle(title = "") {
  const match = cleanText(title).match(/^(.*?)\s+(a\s+Decision\??)$/i);
  return match ? { lead: match[1], accent: match[2] } : { lead: cleanText(title), accent: "" };
}

function palette(isDark) {
  return isDark
    ? {
        text: "text-white",
        muted: "text-white/[0.8]",
        accent: "bg-[linear-gradient(180deg,#e4e4e1_0%,#9a9a97_100%)] bg-clip-text text-transparent",
        outer: "border-white/[0.14] bg-[rgba(14,16,17,0.92)]",
        card: "border-white/[0.14] bg-[#151718] hover:border-white/[0.3]",
        tile: "border-white/[0.16] bg-[#1d1f20]",
        rule: "bg-white",
        list: "border-white/[0.14] bg-[#1d1f20] text-white/85",
        tick: "bg-white text-[#111210]",
        fade: "from-[#151718]",
      }
    : {
        text: "text-[#111210]",
        muted: "text-[#2c2d2b]",
        accent: "bg-[linear-gradient(180deg,#8a8b87_0%,#6b6c68_100%)] bg-clip-text text-transparent",
        outer: "border-[#ebebe8] bg-white shadow-[0_6px_20px_rgba(16,18,16,0.04)]",
        card: "border-[#ebebe8] bg-[#fbfbfa] shadow-[0_6px_18px_rgba(16,18,16,0.06)] hover:shadow-[0_12px_28px_rgba(16,18,16,0.1)]",
        tile: "border-[#ececea] bg-white shadow-[0_6px_16px_rgba(16,18,16,0.08)]",
        rule: "bg-[#111210]",
        list: "border-[#e6e6e3] bg-white text-[#222]",
        tick: "bg-[#111210] text-white",
        fade: "from-[#fbfbfa]",
      };
}

/* ---------- Card art ---------- */

// UK map with specialist pins (cut from the reference), one version per theme.
function UkMap({ isDark }) {
  return (
    <span aria-hidden="true" className="absolute right-[3%] top-[3%] block h-[88%] w-[48%]">
      <Image
        src={isDark ? "/model/uk-specialists-map-dark.webp" : "/model/uk-specialists-map-light.webp"}
        alt=""
        fill
        sizes="(min-width: 768px) 230px, 45vw"
        className="object-contain object-right-top"
      />
    </span>
  );
}

function CardArt({ card, data, tones }) {
  if (card.art === "lineup" && data.heroCar?.src) {
    // The model's line-up photo along the top of the card, as in the reference.
    return (
      <div aria-hidden="true" className="absolute inset-x-0 top-[78px] h-[110px] sm:top-[13%] sm:h-[40%]">
        <Image src={data.heroCar.src} alt="" fill sizes="(min-width: 768px) 470px, 90vw" className="object-contain object-right-bottom px-[2%]" />
      </div>
    );
  }
  if (card.art === "engine") {
    return (
      // Starts right of the icon tile (reference), so the checklist never slides under it.
      <div aria-hidden="true" className="absolute left-[100px] right-[3%] top-[20px] flex h-[150px] max-w-[420px] sm:top-[5%] sm:h-[52%] items-start gap-2 lg:left-[calc(var(--ca-card-in)+var(--ca-tile)+14px)]">
        {card.steps?.length ? (
          <div className={`mt-[1%] w-[46%] shrink-0 rounded-md border px-2.5 py-2 text-[11px] leading-none shadow-[0_8px_18px_rgba(0,0,0,0.06)] lg:text-[12px] ${tones.list}`}>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.08em] opacity-60">Diagnosis</p>
            <ul className="space-y-2.5">
              {card.steps.map((step) => (
                <li key={step} className="flex items-center gap-2">
                  <span className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px] ${tones.tick}`}>
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {data.engineImage ? (
          <span className="relative h-full min-w-0 flex-1">
            <Image src={data.engineImage} alt="" fill sizes="(min-width: 768px) 200px, 40vw" className="object-contain object-top" />
          </span>
        ) : null}
      </div>
    );
  }
  if (card.art === "map") return <UkMap isDark={tones.text === "text-white"} />;
  return null;
}

function ActionCard({ card, data, tones }) {
  const Icon = CARD_ICONS[card.icon] || Search;
  return (
    <Link
      href={card.href || "#"}
      className={`group relative flex min-h-[300px] flex-col overflow-hidden rounded-xl border px-5 pb-6 pt-5 transition-shadow sm:min-h-[330px] lg:min-h-[var(--ca-card-h)] lg:px-[var(--ca-card-in)] lg:pb-[calc(var(--ca-card-in)*1.3)] lg:pt-[var(--ca-card-in)] ${tones.card} ${tones.text}`}
    >
      <CardArt card={card} data={data} tones={tones} />
      <span className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-xl border lg:h-[var(--ca-tile)] lg:w-[var(--ca-tile)] ${tones.tile}`}>
        <Icon aria-hidden="true" className="h-[56%] w-[56%]" strokeWidth={1.6} />
      </span>
      {/* soft fade so the copy always reads over the art */}
      <div aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t ${tones.fade} to-transparent`} />
      <div className="relative z-10 mt-auto pl-1 pt-24 lg:pl-[calc(var(--ca-card-in)*0.25)]">
        <h3 className="text-[21px] font-semibold leading-tight tracking-[-0.01em] lg:text-[length:var(--ca-card-title)]" dangerouslySetInnerHTML={{ __html: typeset(card.title) }} />
        <span aria-hidden="true" className={`mt-3 block h-[2px] w-10 lg:mt-[var(--ca-card-div-mt)] ${tones.rule}`} />
        {card.text ? (
          <p
            className={`mt-3.5 max-w-[22em] text-[15.5px] leading-[1.65] lg:mt-[calc(var(--ca-card-div-mt)*1.5)] lg:text-[length:var(--ca-card-text)] lg:leading-[var(--ca-card-text-lh)] ${tones.muted}`}
            dangerouslySetInnerHTML={{ __html: typeset(card.text) }}
          />
        ) : null}
        <span className="mt-4 inline-flex items-center gap-4 text-[16px] font-semibold lg:mt-[calc(var(--ca-card-div-mt)*1.2)] lg:text-[length:var(--ca-card-cta)]">
          {cleanText(card.cta)}
          <ArrowRight aria-hidden="true" className="h-6 w-6 transition-transform group-hover:translate-x-1" strokeWidth={1.6} />
        </span>
      </div>
    </Link>
  );
}

/* ---------- Section ---------- */

export default function ClosingActionCards({ data }) {
  const { theme } = useTheme();
  if (!data?.cards?.length) return null;

  const isDark = theme === "dark";
  const tones = palette(isDark);
  const title = splitTitle(data.h2);
  const lines = cleanText(data.subHeadline).split("\n").filter(Boolean);
  const scene = data.sceneCar ? (
    <CarOnBackground
      src={data.sceneCar}
      isDark={isDark}
      className="absolute inset-0"
      bgClassName="object-cover object-[62%_70%]"
      carClassName="left-[30%] right-[2%] top-[2%] bottom-[8%]"
      sizes="(min-width: 1024px) 990px, 100vw"
    />
  ) : null;

  return (
    <section id="next-steps" className="model-close relative bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-[1546px] px-4 pb-12 pt-4 sm:px-6 lg:px-[var(--ca-px)] lg:pb-[calc(var(--ca-gap)*2.5)] lg:pt-[var(--ca-gap)]">
        <div className={`relative isolate overflow-hidden rounded-xl border pb-4 lg:pb-[var(--ca-pb)] ${tones.outer} ${tones.text}`}>
          {/* lg+: the car scene across the top right, fading into the card on its left and bottom */}
          {scene ? (
            <div aria-hidden="true" className="absolute right-0 top-0 -z-10 hidden h-[var(--ca-scene-h)] w-[min(var(--ca-scene-w),66%)] lg:block">
              {scene}
              <div className={`absolute inset-y-0 left-0 w-[34%] bg-gradient-to-r ${isDark ? "from-[rgba(14,16,17,1)]" : "from-white"} to-transparent`} />
              <div className={`absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t ${isDark ? "from-[rgba(14,16,17,1)]" : "from-white"} to-transparent`} />
            </div>
          ) : null}

          <div className="px-5 pt-7 sm:px-6 lg:px-[var(--ca-card-px)] lg:pt-[var(--ca-pt)]">
            <h2 className={`model-close-title ${tones.text}`}>
              <span className="block" dangerouslySetInnerHTML={{ __html: typeset(title.lead) }} />
              {title.accent ? <span className={`block ${tones.accent}`}>{title.accent}</span> : null}
            </h2>
            <span aria-hidden="true" className={`mt-4 block h-[2px] w-14 lg:mt-[var(--ca-div-mt)] ${tones.rule}`} />
            {lines.length ? (
              <p className={`mt-5 text-[16px] leading-[1.75] lg:mt-[var(--ca-desc-mt)] lg:text-[length:var(--ca-desc)] lg:leading-[var(--ca-desc-lh)] ${tones.muted}`}>
                {lines.map((line, index) => (
                  <span key={line} className="block" dangerouslySetInnerHTML={{ __html: typeset(line) + (index < lines.length - 1 ? " " : "") }} />
                ))}
              </p>
            ) : null}
          </div>

          {/* Phones / tablets: the scene as a band under the copy */}
          {scene ? <div aria-hidden="true" className="relative mt-5 aspect-[16/9] sm:aspect-[16/7] lg:hidden">{scene}</div> : null}

          <div className="mt-5 grid gap-4 px-4 sm:px-6 lg:mt-[var(--ca-cards-mt)] lg:grid-cols-3 lg:gap-[var(--ca-gap)] lg:px-[var(--ca-cards-px)]">
            {data.cards.map((card) => (
              <ActionCard key={card.title} card={card} data={data} tones={tones} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
