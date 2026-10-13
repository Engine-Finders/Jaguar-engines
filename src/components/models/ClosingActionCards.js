"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { sectionBody, sectionButton, sectionDescription } from "@/components/models/sectionTypography";

const cardThemes = [
  {
    accent: "var(--color-primary)",
    border: "border-blue-200",
    bg: "bg-[linear-gradient(135deg,#f7fbff_0%,#eef6ff_100%)]",
    image: "/model/Hero-bg-image.webp",
    imageClass: "object-cover object-[68%_70%]",
    cta: "Explore Now",
    icon: "generations",
  },
  {
    accent: "#078f58",
    border: "border-emerald-200",
    bg: "bg-[linear-gradient(135deg,#f8fffb_0%,#eefaf5_100%)]",
    image: "/engine.webp",
    imageClass: "object-contain object-right-bottom",
    cta: "Start Diagnosis",
    icon: "diagnosis",
  },
  {
    accent: "#ee8500",
    border: "border-orange-200",
    bg: "bg-[linear-gradient(135deg,#fffdf9_0%,#fff5e8_100%)]",
    cta: "Compare Specialists",
    icon: "vetted-specialist",
  },
];

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

function UkMapArt({ accent, isDark }) {
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
        fill={isDark ? "#3a3a38" : "#ead9bd"}
      />
      <path d="M33 105 16 121l22 8 17-12-22-12ZM72 189l-34 13 31 9 31-13-28-9Z" fill={isDark ? "#3a3a38" : "#ead9bd"} opacity="0.72" />
      {pins.map(([cx, cy]) => (
        <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
          <path d="M0-10c5.2 0 9 3.8 9 8.5C9 5-0 13-0 13S-9 5-9-1.5C-9-6.2-5.2-10 0-10Z" fill={accent} />
          <circle r="3" fill="white" />
        </g>
      ))}
    </svg>
  );
}

function ActionCard({ card, index, isDark }) {
  const theme = cardThemes[index] || cardThemes[0];
  const titleParts = splitCardTitle(card.title);

  return (
    <Link
      href={card.href || "#"}
      className={`group relative min-h-[190px] overflow-hidden rounded-md border p-3 transition-all duration-200 hover:-translate-y-0.5 md:min-h-[270px] md:p-5 lg:min-h-[270px] ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:border-white/25"
          : `${theme.border} ${theme.bg} shadow-[0_10px_28px_rgba(10,26,43,0.10)] hover:shadow-[0_16px_34px_rgba(10,26,43,0.16)]`
      }`}
      style={{ "--card-accent": theme.accent }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_34%,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.08)_56%,transparent_100%)]" />
      {theme.image ? (
        <Image
          src={theme.image}
          alt=""
          fill
          className={`opacity-45 mix-blend-multiply ${theme.imageClass}`}
          sizes="(min-width: 1024px) 31vw, 100vw"
        />
      ) : (
        <UkMapArt accent={theme.accent} isDark={isDark} />
      )}
      <div className="relative z-10 flex h-full max-w-[78%] flex-col items-start md:max-w-[74%] lg:max-w-[78%]">
        <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white/86 text-[var(--card-accent)] shadow-[0_12px_26px_rgba(10,26,43,0.10)] md:h-20 md:w-20">
          <HomeIcon name={theme.icon} isDark={false} className="h-9 w-9 md:h-14 md:w-14" />
        </span>
        <h3 className="mt-3 text-[18px] font-bold leading-[1.06] text-black dark:text-black md:mt-5 md:text-[26px] lg:text-[24px]">
          <span dangerouslySetInnerHTML={{ __html: titleParts.before }} />
          {titleParts.before ? <br className="md:hidden lg:block" /> : null}
          {titleParts.accent ? (
            <>
              {" "}
              <span className="text-[var(--card-accent)]" dangerouslySetInnerHTML={{ __html: titleParts.accent }} />
            </>
          ) : null}
          {titleParts.after ? (
            <>
              {" "}
              <span dangerouslySetInnerHTML={{ __html: titleParts.after }} />
            </>
          ) : null}
        </h3>
        <span className="mt-3 block h-1 w-10 rounded-full bg-[var(--card-accent)] md:mt-4 md:w-12" />
        {card.text ? (
          <p
            className={`mt-3 max-w-[360px] text-[var(--color-text)] ${sectionBody} md:mt-4 md:text-[17px]`}
            dangerouslySetInnerHTML={{ __html: cleanText(card.text) }}
          />
        ) : null}
        <span className={`mt-auto inline-flex items-center gap-3 pt-4 font-bold text-[var(--card-accent)] md:gap-5 md:pt-6 ${sectionButton}`}>
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
            <ActionCard key={card.title || card.href} card={card} index={index} isDark={isDark} />
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
