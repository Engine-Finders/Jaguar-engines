"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { sectionBody, sectionButton, sectionDescription } from "@/components/models/sectionTypography";

// Monochrome cards, as in the reference: search, diagnose and specialists, each with its own art.
const cardThemes = [
  { cta: "Explore Now", icon: "search", art: "lineup" },
  { cta: "Start Diagnosis", icon: "diagnose", art: "engine" },
  { cta: "Compare Specialists", icon: "vetted-specialist", art: "map" },
];

const DIAGNOSIS_STEPS = ["Symptoms", "Engine Code", "Mileage", "History"];

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("â†’", "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const marker = "a Decision?";
  const index = clean.indexOf(marker);

  if (index === -1) return { before: clean, accent: "" };

  return {
    before: clean.slice(0, index).trim(),
    accent: clean.slice(index).trim(),
  };
}

function splitCardTitle(title = "") {
  const clean = cleanText(title);
  const diagnoseMatch = clean.match(/^(Diagnose)\s+(My\s+.+)$/i);
  if (diagnoseMatch) {
    return { before: diagnoseMatch[1], accent: diagnoseMatch[2], after: "" };
  }

  const exploreMatch = clean.match(/^(Explore)\s+(.+?)\s+(Generations)$/i);
  if (exploreMatch) {
    return { before: exploreMatch[1], accent: exploreMatch[2], after: exploreMatch[3] };
  }

  const compareMatch = clean.match(/^(Compare)\s+(.+)$/i);
  if (compareMatch) {
    return { before: compareMatch[1], accent: compareMatch[2], after: "" };
  }

  return { before: clean, accent: "", after: "" };
}

function ArrowIcon({ className = "h-6 w-6" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function UkMapArt({ isDark }) {
  const pin = isDark ? "#e6e6e4" : "#111111";
  const pins = [
    [56, 24],
    [66, 39],
    [58, 51],
    [72, 58],
    [50, 66],
    [64, 72],
    [76, 76],
  ];

  return (
    <svg aria-hidden="true" viewBox="0 0 180 220" className="absolute bottom-3 right-3 h-[82%] w-[48%] opacity-80 md:right-8 md:w-[44%]">
      <path
        d="M80 10 65 24l9 15-18 12 10 17-16 13 20 13-11 20 22 8-16 28 28 8 10 31 24-17 25 13-2-31 20-11-19-21 10-28-20-16 4-28-28-1-10-28-27 8Z"
        fill={isDark ? "#3a3a38" : "#e2e2e0"}
      />
      <path d="M33 105 16 121l22 8 17-12-22-12ZM72 189l-34 13 31 9 31-13-28-9Z" fill={isDark ? "#3a3a38" : "#e2e2e0"} opacity="0.72" />
      {pins.map(([cx, cy]) => (
        <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
          <path d="M0-10c5.2 0 9 3.8 9 8.5C9 5-0 13-0 13S-9 5-9-1.5C-9-6.2-5.2-10 0-10Z" fill={pin} />
          <circle r="3" fill={isDark ? "#1a1a1a" : "white"} />
        </g>
      ))}
    </svg>
  );
}

function DiagnosisList({ isDark }) {
  return (
    <div
      className={`rounded-md border px-2.5 py-2 text-[11px] leading-none shadow-[0_8px_18px_rgba(0,0,0,0.08)] ${
        isDark ? "border-white/12 bg-[#1b1b1b] text-white/80" : "border-[#e4e4e2] bg-white text-[#222]"
      }`}
    >
      <p className={`mb-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${isDark ? "text-white/50" : "text-[#8a8a88]"}`}>
        Diagnosis
      </p>
      <ul className="space-y-1.5">
        {DIAGNOSIS_STEPS.map((step) => (
          <li key={step} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={`flex h-3 w-3 items-center justify-center rounded-[2px] text-[8px] ${
                isDark ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              {"\u2713"}
            </span>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CardArt({ art, heroCar, engineImage, isDark }) {
  if (art === "lineup" && heroCar) {
    // The same picture as this model's hero.
    return (
      <div className="pointer-events-none absolute right-3 top-4 w-[62%] md:right-4 md:top-5">
        <Image src={heroCar.src} alt="" width={heroCar.width} height={heroCar.height} className="h-auto w-full" sizes="(min-width: 768px) 20vw, 60vw" />
      </div>
    );
  }
  if (art === "engine" && engineImage) {
    return (
      <div className="pointer-events-none absolute right-2 top-3 flex w-[66%] items-start gap-2 md:right-3 md:top-4">
        <div className="mt-1 hidden shrink-0 sm:block">
          <DiagnosisList isDark={isDark} />
        </div>
        <div className="relative aspect-square min-w-0 flex-1">
          <Image src={engineImage} alt="" fill className="object-contain object-top" sizes="(min-width: 768px) 16vw, 40vw" />
        </div>
      </div>
    );
  }
  if (art === "map") return <UkMapArt isDark={isDark} />;
  return null;
}

function ActionCard({ card, index, heroCar, engineImage, isDark }) {
  const theme = cardThemes[index] || cardThemes[0];
  const titleParts = splitCardTitle(card.title);
  const title = [titleParts.before, titleParts.accent, titleParts.after].filter(Boolean).join(" ");

  return (
    <Link
      href={card.href || "#"}
      className={`group relative min-h-[230px] overflow-hidden rounded-md border p-4 transition-all duration-200 hover:-translate-y-0.5 md:min-h-[300px] md:p-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:border-white/25"
          : "border-[#e4e4e2] bg-white shadow-[0_10px_28px_rgba(16,18,16,0.08)] hover:shadow-[0_16px_34px_rgba(16,18,16,0.14)]"
      }`}
    >
      <CardArt art={theme.art} heroCar={heroCar} engineImage={engineImage} isDark={isDark} />
      <div className="relative z-10 flex h-full flex-col items-start">
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-md shadow-[0_10px_24px_rgba(16,18,16,0.12)] md:h-20 md:w-20 ${
            isDark ? "bg-[#1b1b1b]" : "bg-white"
          }`}
        >
          <HomeIcon name={theme.icon} isDark={isDark} className="h-16 w-16 md:h-20 md:w-20" />
        </span>
        <h3
          className={`mt-auto pt-16 text-[20px] font-bold leading-[1.1] md:pt-20 md:text-[24px] ${isDark ? "text-white" : "text-black"}`}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <span className={`mt-3 block h-[3px] w-10 md:w-12 ${isDark ? "bg-white" : "bg-black"}`} />
        {card.text ? (
          <p
            className={`mt-3 max-w-[360px] ${sectionBody} md:text-[17px] ${isDark ? "text-white/80" : "text-[var(--color-text)]"}`}
            dangerouslySetInnerHTML={{ __html: cleanText(card.text) }}
          />
        ) : null}
        <span className={`mt-4 inline-flex items-center gap-3 font-bold md:gap-4 ${sectionButton} ${isDark ? "text-white" : "text-black"}`}>
          {theme.cta}
          <ArrowIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 md:h-6 md:w-6" />
        </span>
      </div>
    </Link>
  );
}

export default function ClosingActionCards({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data) return null;

  const title = splitTitle(data.h2);
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[#ececea]";

  return (
    <section className={`overflow-x-hidden ${sectionBg}`}>
      <div className={`relative overflow-hidden ${sectionBg}`}>
        <div className="absolute inset-y-0 right-0 w-[62%] md:w-[48%]">
          <Image
            src="/home-image/sec2-bg.webp"
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

        <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-5 md:px-6 md:pb-3.5 md:pt-7 lg:px-8">
          <div className="max-w-[620px]">
            <p
              className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
              }`}
            >
              Next Steps
            </p>
            <h2
              className={`mt-1.5 text-[1.55rem] font-bold leading-[1.02] sm:text-[1.85rem] md:text-[2.35rem] md:leading-[0.98] lg:text-[2.5rem] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: title.before }} />
              {title.accent ? (
                <>
                  <br />
                  <span className="text-[var(--color-chrome-bright)]" dangerouslySetInnerHTML={{ __html: title.accent }} />
                </>
              ) : null}
            </h2>
            <div className="mt-2.5">
              <MStripe />
            </div>
            <p
              className={`mt-2 max-w-[500px] ${sectionDescription} md:text-[17px] ${
                isDark ? "text-white/75" : "text-[var(--color-text-muted)]"
              }`}
            >
              Everything you need to choose with confidence.
              <br />
              Data. Honesty. Specialists. All in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-8xl px-4 pb-5 pt-2 md:px-6 md:pb-6 md:pt-2.5 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {(data.cards || []).map((card, index) => (
            <ActionCard
              key={card.title || card.href}
              card={card}
              index={index}
              heroCar={data.heroCar}
              engineImage={data.engineImage}
              isDark={isDark}
            />
          ))}
        </div>
        {data.footerNote ? (
          <p
            className={`mt-4 text-center text-[0.82rem] ${isDark ? "text-white/60" : "text-[var(--color-text-muted)]"}`}
            dangerouslySetInnerHTML={{ __html: cleanText(data.footerNote) }}
          />
        ) : null}
      </div>
    </section>
  );
}
