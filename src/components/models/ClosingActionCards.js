import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { sectionBody, sectionButton, sectionDescription, sectionH2 } from "@/components/models/sectionTypography";

const cardThemes = [
  {
    accent: "var(--color-primary)",
    border: "border-blue-200",
    bg: "bg-[linear-gradient(135deg,#f7fbff_0%,#eef6ff_100%)]",
    image: "/model/Hero-bg-image.webp",
    imageClass: "object-cover object-[68%_70%]",
    cta: "Explore Now",
    icon: "search",
  },
  {
    accent: "#078f58",
    border: "border-emerald-200",
    bg: "bg-[linear-gradient(135deg,#f8fffb_0%,#eefaf5_100%)]",
    image: "/e90/engine.webp",
    imageClass: "object-contain object-right-bottom",
    cta: "Start Diagnosis",
    icon: "stethoscope",
  },
  {
    accent: "#ee8500",
    border: "border-orange-200",
    bg: "bg-[linear-gradient(135deg,#fffdf9_0%,#fff5e8_100%)]",
    cta: "Compare Specialists",
    icon: "handshake",
  },
];

function cleanText(text = "") {
  return text
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

function ArrowIcon({ className = "h-7 w-7" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function CardIcon({ name }) {
  const paths = {
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    stethoscope: (
      <>
        <path d="M6 3v5a4 4 0 0 0 8 0V3" />
        <path d="M10 12v2a5 5 0 0 0 10 0v-1.5" />
        <circle cx="20" cy="10" r="2" />
        <path d="M4 3h4M12 3h4" />
      </>
    ),
    handshake: (
      <>
        <path d="m8 12 2.4-2.4a2 2 0 0 1 2.8 0l.8.8a2 2 0 0 0 2.8 0L18 9" />
        <path d="m5 13 5 5a2 2 0 0 0 2.8 0l.3-.3.7.7a2 2 0 0 0 2.8 0l2.4-2.4" />
        <path d="m2 9 4-4 4 4-4 4-4-4ZM14 6l4-4 4 4-4 4-4-4Z" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-14 w-14 md:h-16 md:w-16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || paths.search}
    </svg>
  );
}

function UkMapArt({ accent }) {
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
        fill="#ead9bd"
      />
      <path d="M33 105 16 121l22 8 17-12-22-12ZM72 189l-34 13 31 9 31-13-28-9Z" fill="#ead9bd" opacity="0.72" />
      {pins.map(([cx, cy]) => (
        <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
          <path d="M0-10c5.2 0 9 3.8 9 8.5C9 5-0 13-0 13S-9 5-9-1.5C-9-6.2-5.2-10 0-10Z" fill={accent} />
          <circle r="3" fill="white" />
        </g>
      ))}
    </svg>
  );
}

function ActionCard({ card, index }) {
  const theme = cardThemes[index] || cardThemes[0];
  const titleParts = [
    { before: "Explore", accent: "3 Series", after: "Generations" },
    { before: "Diagnose", accent: "My 3 Series", after: "" },
    { before: "Compare", accent: "UK Specialists", after: "" },
  ][index] || { before: cleanText(card.title), accent: "", after: "" };

  return (
    <Link
      href={card.href || "#"}
      className={`group relative min-h-[250px] overflow-hidden rounded-md border ${theme.border} ${theme.bg} p-4 shadow-[0_10px_28px_rgba(10,26,43,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(10,26,43,0.16)] md:min-h-[270px] md:p-5 lg:min-h-[270px]`}
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
        <UkMapArt accent={theme.accent} />
      )}
      <div className="relative z-10 flex h-full max-w-[70%] flex-col items-start md:max-w-[74%] lg:max-w-[78%]">
        <span className="flex h-16 w-16 items-center justify-center rounded-md bg-white/86 text-[var(--card-accent)] shadow-[0_12px_26px_rgba(10,26,43,0.10)] md:h-20 md:w-20">
          <CardIcon name={theme.icon} />
        </span>
        <h3 className="mt-5 text-[24px] font-bold leading-[1.06] text-black dark:text-black md:text-[26px] lg:text-[24px]">
          <span dangerouslySetInnerHTML={{ __html: titleParts.before }} />
          {titleParts.before ? <br className="md:hidden lg:block" /> : null}
          {titleParts.accent ? (
            <>
              {" "}
              <span className="text-[var(--card-accent)]" dangerouslySetInnerHTML={{ __html: titleParts.accent }} />
            </>
          ) : null}
          {titleParts.after ? <> <span dangerouslySetInnerHTML={{ __html: titleParts.after }} /></> : null}
        </h3>
        <span className="mt-4 block h-1 w-12 rounded-full bg-[var(--card-accent)]" />
        <p className={`mt-4 max-w-[360px] text-[var(--color-text)] ${sectionBody} md:text-[17px]`} dangerouslySetInnerHTML={{ __html: cleanText(card.text) }} />
        <span className={`mt-auto inline-flex items-center gap-5 pt-6 font-bold text-[var(--card-accent)] ${sectionButton}`}>
          {theme.cta}
          <ArrowIcon className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function ClosingActionCards({ data }) {
  if (!data) return null;

  const title = splitTitle(data.h2);

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)] pt-2 text-[var(--color-text)]">
      <div className="relative overflow-hidden rounded-md bg-[var(--color-surface-raised)]">
        <Image
          src="/model/Hero-bg-image.webp"
          alt=""
          fill
          className="hidden object-cover object-center md:block"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--color-page) 0%, var(--color-hero-fade) 34%, var(--color-hero-overlay) 54%, rgba(255,255,255,0.12) 74%, rgba(255,255,255,0) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 56% 50%, var(--color-hero-overlay) 0%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0) 60%)",
          }}
        />
        <div className="relative z-10 max-w-[620px] px-4 py-4 md:px-6 md:py-6">
          <h2 className="max-w-[570px] text-[29px] font-bold leading-[1.08] tracking-normal text-[var(--color-text)] md:text-[45px]">
            <span dangerouslySetInnerHTML={{ __html: title.before }} />
            {title.accent ? (
              <>
                <br />
                <span className="text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: title.accent }} />
              </>
            ) : null}
          </h2>
          <div className="mt-4">
            <MStripe />
          </div>
          <p className={`mt-4 max-w-[500px] text-[var(--color-text)] ${sectionDescription} md:text-[17px]`}>
            Everything you need to choose with confidence.
            <br />
            Data. Honesty. Specialists. All in one place.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(data.cards || []).map((card, index) => (
          <ActionCard key={card.title || card.href} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}
