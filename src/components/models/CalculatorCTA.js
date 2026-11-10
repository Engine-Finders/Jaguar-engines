"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Calculator, ChartColumnIncreasing, CircleCheck, FileSearch, Info, ShieldCheck, Target } from "@/components/models/brandIcons";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import CarOnBackground from "@/components/shared/CarOnBackground";
import { carImageFor } from "@/components/shared/carImage";
import { outsideTags } from "@/components/models/outsideTags";

/*
 * Model page "Can I Repair My Engine — or Should I Replace It?" (section 11), built from the 1536px
 * reference. Left: title (second half in the silver accent), two intro paragraphs and "the smarter way to
 * decide" note; right: the model's car in Jaguar's scene, fading into the page. Then two path cards (know
 * your engine → calculator; not sure → identify first) and the closing "Stop guessing" bar.
 * Sizes come from the --cc-* tokens in globals.css. All copy comes from data.calculatorCta.
 */

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replace(/\s+/g, " ")
    .trim();
}

// Ranges take an en dash; " - " an em dash; hyphenated names ("E-Pace", "pre-selected") never break.
function typeset(text = "") {
  return outsideTags(cleanText(text), (part) =>
    part.replace(/(\d)\s*-\s*(£?\d)/g, "$1–$2").replace(/\s-\s/g, " — ").replace(/([A-Za-z])-([A-Za-z])/g, "$1\u2011$2"),
  );
}

// "Can I Repair My E-Pace Engine - or Should I Replace It?" -> "Can I Repair My E-Pace Engine —" / "or " + accent
function splitTitle(title = "") {
  const match = cleanText(title).match(/^(.*?)\s+[-–—]\s+(or)\s+(.*)$/i);
  if (!match) return { lead: cleanText(title), or: "", accent: "" };
  return { lead: `${match[1]} —`, or: match[2], accent: match[3] };
}

// Intro in two paragraphs, split before the sentence that points to the calculator (reference layout).
function introParagraphs(intro = "") {
  const sentences = typeset(intro).match(/[^.!?]+[.!?]+/g) || [typeset(intro)];
  if (sentences.length < 2) return sentences;
  const cut = Math.max(1, sentences.findIndex((sentence, index) => index > 0 && /calculator|economics/i.test(sentence)));
  return [sentences.slice(0, cut).join(" ").trim(), sentences.slice(cut).join(" ").trim()];
}

function palette(isDark) {
  return isDark
    ? {
        text: "text-white",
        muted: "text-white/[0.75]",
        accent: "bg-[linear-gradient(180deg,#e4e4e1_0%,#9a9a97_100%)] bg-clip-text text-transparent",
        card: "border-white/[0.16] bg-[rgba(14,16,17,0.92)]",
        soft: "bg-white/[0.05]",
        circle: "bg-white/[0.07] text-white",
        badge: "bg-[#ececea] text-[#111210]",
        rule: "border-white/[0.12]",
        primary: "btn-cta",
        outline: "border-white/[0.35] text-white hover:border-white/70",
        dot: "bg-[#ececea] text-[#111210]",
      }
    : {
        text: "text-[#111210]",
        muted: "text-[#2c2d2b]",
        accent: "bg-[linear-gradient(180deg,#8a8b87_0%,#6b6c68_100%)] bg-clip-text text-transparent",
        card: "border-[#e8e8e5] bg-white shadow-[0_6px_20px_rgba(16,18,16,0.05)]",
        soft: "bg-[#f4f4f3]",
        circle: "bg-[#f1f1ef] text-[#111210]",
        badge: "bg-[#1a1b1a] text-white",
        rule: "border-[#e8e8e5]",
        primary: "bg-[linear-gradient(180deg,#2c2d2b_0%,#141514_100%)] text-white hover:shadow-[0_10px_24px_rgba(16,18,16,0.25)]",
        outline: "border-[#8f908c] text-[#111210] hover:border-[#111210]",
        dot: "bg-[#111210] text-white",
      };
}

const FEATURE_ICONS = { check: CircleCheck, chart: ChartColumnIncreasing, shield: ShieldCheck };

/* ---------- Pieces ---------- */

function PathCard({ path, index, tones, isDark }) {
  if (!path) return null;
  const primary = index === 0;
  const button = path.button || {};
  return (
    <article className={`flex flex-col rounded-xl border px-4 py-5 lg:px-[var(--cc-path-px)] lg:py-[var(--cc-path-py)] ${tones.card} ${tones.text}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className={`inline-flex rounded-[5px] px-2 py-1 text-[12px] font-medium uppercase leading-none lg:text-[length:var(--cc-badge)] ${tones.badge}`}>
            {cleanText(path.badge)}
          </span>
          <h3
            className="mt-3 max-w-[9.6em] font-heading text-[27px] font-semibold leading-[1.08] tracking-[-0.01em] lg:text-[length:var(--cc-path-title)]"
            dangerouslySetInnerHTML={{ __html: typeset(path.title) }}
          />
          <p className={`mt-2 max-w-[22em] text-[15px] leading-[1.55] lg:text-[length:var(--cc-path-text)] ${tones.muted}`} dangerouslySetInnerHTML={{ __html: typeset(path.text) }} />
        </div>
        <span
          className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full sm:h-24 sm:w-24 lg:h-[var(--cc-path-circle)] lg:w-[var(--cc-path-circle)] ${tones.circle}`}
        >
          {primary ? (
            <span className="relative block h-[55%] w-[55%]">
              <HomeIcon name="engine" isDark={isDark} className="-m-[25%] h-[150%] w-[150%]" />
            </span>
          ) : (
            <FileSearch aria-hidden="true" className="h-[48%] w-[48%]" strokeWidth={1.3} />
          )}
        </span>
      </div>

      {button.href ? (
        <Link
          href={button.href}
          className={`mt-5 flex min-h-[64px] items-center gap-4 rounded-lg px-4 transition-shadow lg:mt-[calc(var(--cc-path-py)*0.9)] lg:min-h-[var(--cc-btn-h)] lg:px-[calc(var(--cc-path-px)*1.2)] ${
            primary ? tones.primary : `border ${tones.outline}`
          }`}
        >
          {primary ? (
            <Calculator tone="current" aria-hidden="true" className="h-8 w-8 shrink-0 lg:h-[var(--cc-btn-icon)] lg:w-[var(--cc-btn-icon)]" strokeWidth={1.4} />
          ) : (
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full lg:h-[calc(var(--cc-btn-icon)*1.5)] lg:w-[calc(var(--cc-btn-icon)*1.5)] ${tones.circle}`}>
              <HomeIcon name="engine" isDark={isDark} className="h-[90%] w-[90%]" />
            </span>
          )}
          <span className="min-w-0 flex-1 lg:pl-[calc(var(--cc-path-px)*0.5)]">
            <span className="block text-[15.5px] font-medium leading-snug lg:text-[length:var(--cc-btn)]">{cleanText(button.label)}</span>
            {button.sub ? <span className="mt-0.5 block text-[13px] font-normal leading-snug opacity-85 lg:text-[length:var(--cc-btn-sub)]">{cleanText(button.sub)}</span> : null}
          </span>
          <ArrowRight aria-hidden="true" className="h-6 w-6 shrink-0" strokeWidth={1.5} />
        </Link>
      ) : null}

      {path.features?.length ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-0 lg:mt-[calc(var(--cc-path-py)*1.4)]">
          {path.features.map((feature, featureIndex) => {
            const Icon = FEATURE_ICONS[feature.icon] || CircleCheck;
            return (
              <li key={feature.title} className={`flex items-start gap-3 sm:px-3 sm:first:pl-0 ${featureIndex > 0 ? `sm:border-l ${tones.rule}` : ""}`}>
                <Icon aria-hidden="true" className="h-7 w-7 shrink-0 lg:h-[var(--cc-feat-icon)] lg:w-[var(--cc-feat-icon)]" strokeWidth={1.4} />
                <span className="min-w-0 text-[13px] leading-snug lg:text-[length:var(--cc-feat)]">
                  <span className="block font-medium">{cleanText(feature.title)}</span>
                  <span className={`block ${tones.muted}`}>{cleanText(feature.text)}</span>
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}

      {path.note?.lead || path.note?.text ? (
        <div className={`mt-4 flex items-start gap-3.5 rounded-lg px-3.5 py-3 lg:mt-[calc(var(--cc-path-py)*1.05)] lg:items-center ${tones.soft}`}>
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full lg:h-[var(--cc-info)] lg:w-[var(--cc-info)] ${tones.dot}`}>
            <Info tone="current" aria-hidden="true" className="h-[62%] w-[62%]" strokeWidth={2.2} />
          </span>
          <p className="text-[13.5px] leading-snug lg:text-[length:var(--cc-feat)]">
            {path.note.lead ? <strong className="block font-semibold">{cleanText(path.note.lead)}</strong> : null}
            {path.note.text ? <span className={tones.muted}>{cleanText(path.note.text)}</span> : null}
          </p>
        </div>
      ) : null}
    </article>
  );
}

// The reference composition: car three-quarter front-left, filling ~62% of the frame width, on the floor.
function CarScene({ scene, car, isDark, sizes }) {
  if (scene) return <Image src={scene.src} alt="" fill sizes={sizes} className="object-cover" />;
  return (
    <CarOnBackground
      src={car}
      isDark={isDark}
      className="absolute inset-0"
      bgClassName="object-cover object-[62%_72%]"
      carClassName="left-[8%] right-[1%] top-[2%] bottom-[13%]"
      sizes={sizes}
    />
  );
}

/* ---------- Section ---------- */

export default function CalculatorCTA({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const tones = palette(isDark);
  const title = splitTitle(data.h2);
  const paragraphs = introParagraphs(data.intro);
  const scene = data.scenes?.[isDark ? "dark" : "light"] || null;
  const car = scene ? null : data.image || carImageFor(data.h2);
  const closing = data.closing;

  return (
    <section id="repair-or-replace" className="model-calc relative isolate overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      {/* lg+: the car scene top-right of the header (reference frame 1564x856), fading into the copy and page */}
      {scene || car ? (
        <div aria-hidden="true" className="absolute right-0 top-0 -z-10 hidden aspect-[1564/856] w-[min(58%,900px)] lg:block">
          <CarScene scene={scene} car={car} isDark={isDark} sizes="(min-width: 1024px) 900px, 100vw" />
          <div className="absolute inset-y-0 left-0 w-[30%] bg-[linear-gradient(90deg,var(--color-page)_0%,color-mix(in_srgb,var(--color-page)_55%,transparent)_45%,transparent_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)]" />
          <div className="absolute inset-x-0 top-0 h-[6%] bg-[linear-gradient(180deg,var(--color-page)_0%,transparent_100%)]" />
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[1546px] px-4 pb-12 pt-10 sm:px-6 lg:px-[var(--cc-px)] lg:pb-[var(--cc-pb)] lg:pt-[var(--cc-pt)]">
        <div className="lg:max-w-[52%]">
          <h2 className={`model-calc-title ${tones.text}`}>
            <span className="lg:block" dangerouslySetInnerHTML={{ __html: `${title.lead} ` }} />
            {title.or ? (
              <span>
                {title.or} <span className={tones.accent} dangerouslySetInnerHTML={{ __html: title.accent }} />
              </span>
            ) : null}
          </h2>
          <div className={`mt-3 max-w-[520px] space-y-3 text-[15px] leading-[1.6] lg:mt-[var(--cc-desc-mt)] lg:space-y-[var(--cc-p-gap)] lg:text-[length:var(--cc-desc)] lg:leading-[var(--cc-desc-lh)] ${tones.muted}`}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 30)} dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}
          </div>
        </div>

        {/* Phones / tablets: the same scene as a full-bleed band under the copy */}
        {scene || car ? (
          <div aria-hidden="true" className="relative -mx-4 mt-5 aspect-[1564/856] sm:-mx-6 lg:hidden">
            <CarScene scene={scene} car={car} isDark={isDark} sizes="100vw" />
            <div className="absolute inset-x-0 bottom-0 h-[12%] bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)]" />
          </div>
        ) : null}

        {data.smartNote?.text ? (
          <div
            className={`relative z-10 mt-4 flex items-center gap-4 rounded-xl border px-4 py-3.5 lg:mt-[var(--cc-note-mt)] lg:min-h-[var(--cc-note-h)] lg:w-[var(--cc-note-w)] lg:gap-[calc(var(--cc-note-px)*0.95)] lg:px-[var(--cc-note-px)] lg:py-2 ${tones.card} ${tones.text}`}
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full lg:h-[var(--cc-note-icon)] lg:w-[var(--cc-note-icon)] ${tones.circle}`}>
              <Calculator aria-hidden="true" className="h-[58%] w-[58%]" strokeWidth={1.4} />
            </span>
            <p className={`text-[14px] leading-[1.55] lg:text-[length:var(--cc-note)] ${tones.muted}`}>
              <strong className={`font-semibold ${tones.text}`}>{cleanText(data.smartNote.lead)}</strong> {cleanText(data.smartNote.text)}
            </p>
          </div>
        ) : null}

        <div className="relative z-10 mt-5 grid gap-4 lg:mt-[var(--cc-paths-mt)] lg:grid-cols-[minmax(0,694fr)_minmax(0,709fr)] lg:gap-[var(--cc-paths-gap)]">
          {(data.paths || []).slice(0, 2).map((path, index) => (
            <PathCard key={path.badge || index} path={path} index={index} tones={tones} isDark={isDark} />
          ))}
        </div>

        {closing?.title ? (
          <div
            className={`mt-4 flex flex-col gap-4 rounded-xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:mt-[var(--cc-close-mt)] lg:min-h-[var(--cc-close-h)] lg:px-[var(--cc-path-px)] lg:py-2 ${tones.card} ${tones.text}`}
          >
            <div className="flex items-center gap-4 lg:gap-[calc(var(--cc-path-px)*0.8)]">
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full lg:h-[var(--cc-close-mark)] lg:w-[var(--cc-close-mark)] ${tones.dot}`}>
                <Target tone="current" aria-hidden="true" className="h-[56%] w-[56%]" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="text-[16.5px] font-semibold leading-snug lg:text-[length:var(--cc-close-title)]">{cleanText(closing.title)}</p>
                <p className={`mt-1 max-w-[560px] text-[13.5px] leading-[1.6] lg:text-[length:var(--cc-close-text)] ${tones.muted}`} dangerouslySetInnerHTML={{ __html: typeset(closing.text) }} />
              </div>
            </div>
            {closing.button?.href ? (
              <Link
                href={closing.button.href}
                className={`inline-flex min-h-[52px] shrink-0 items-center justify-center gap-6 rounded-lg px-6 text-[16px] !font-medium lg:min-h-[var(--cc-close-btn-h)] lg:min-w-[332px] lg:justify-between lg:px-[calc(var(--cc-path-px)*1.4)] lg:text-[length:var(--cc-close-btn)] ${tones.primary}`}
              >
                {cleanText(closing.button.label)}
                <ArrowRight aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} />
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
