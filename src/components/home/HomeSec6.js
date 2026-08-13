"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const iconPaths = {
  chart: <path d="M4 19V9m5 10V5m5 14v-7m5 7H3" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.5 1.5L15 10" />,
  link: <path d="M10 13a5 5 0 0 0 7.1 0l1.4-1.4a5 5 0 0 0-7.1-7.1l-.8.8M14 11a5 5 0 0 0-7.1 0l-1.4 1.4a5 5 0 0 0 7.1 7.1l.8-.8" />,
  wrench: <path d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  file: <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Zm0 0v6h6M8 13h8M8 17h8M8 9h2" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  check: <path d="m5 12 4 4L19 6" />,
  x: <path d="M8 8l8 8M16 8l-8 8" />,
  warning: <path d="M12 8v5m0 4h.01M10 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L14 4.9a2 2 0 0 0-3.48 0Z" />,
};

const statusConfig = {
  scrap: {
    label: "Scrap",
    icon: "x",
    circle: "bg-[#ed1c24] text-white",
    pill: "bg-[#ffe4e4] text-[#ed1c24]",
  },
  safe: {
    label: "Safe",
    icon: "check",
    circle: "bg-[#20a84a] text-white",
    pill: "bg-[#dff7e6] text-[#1c8b3d]",
  },
  watch: {
    label: "Watch",
    icon: "warning",
    circle: "bg-[#f7a51b] text-white",
    pill: "bg-[#fff1d9] text-[#e18a00]",
  },
};

const trustItems = [
  {
    icon: "chart",
    title: "Real UK Market Values",
    text: "Live third-party pricing data.",
  },
  {
    icon: "file",
    title: "BMW-Verified Enquiries",
    text: "Based on 24,650+ real enquiries.",
  },
  {
    icon: "wrench",
    title: "20+ Vetted Specialists",
    text: "Trusted by thousands of owners.",
  },
  {
    icon: "shield",
    title: "Honest Advice",
    text: "We tell you the truth, not what you want to hear.",
  },
];

const comparisonHeroImages = {
  light: {
    src: "/hero-day.webp",
    alt: "BMW comparison hub cars",
  },
  dark: {
    src: "/Hero-dark.webp",
    alt: "BMW comparison hub cars in a dark garage",
  },
};

function cleanText(value = "") {
  return value
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "-")
    .replaceAll("â€”", "-")
    .replaceAll("â†’", "")
    .replaceAll("â€º", "")
    .replaceAll("âœ…", "")
    .replaceAll("ðŸ”´", "")
    .replaceAll("âš ï¸", "")
    .trim();
}

function stripTags(value = "") {
  return cleanText(value).replace(/<[^>]*>/g, "").trim();
}

/** Convert anchors to spans so HTML can sit inside a parent <Link>/<a> without hydration issues. */
function unlinkHtml(value = "") {
  return cleanText(value).replace(
    /<a\b[^>]*>([\s\S]*?)<\/a>/gi,
    '<span class="font-semibold text-[var(--color-primary)]">$1</span>'
  );
}

function Icon({ name, className = "h-5 w-5", strokeWidth = 2 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.chart}
    </svg>
  );
}

function modelParts(model = "") {
  const plain = stripTags(model);
  const withEngine = plain.match(/^(.+?)\s+([A-Z][\w-]*)\s+\((.+)\)$/);
  if (withEngine) {
    const engineHtml = (model.match(/\(([\s\S]+)\)$/) || [])[1] || withEngine[3];
    return {
      family: withEngine[1],
      generation: withEngine[2],
      engine: engineHtml,
    };
  }

  const noEngine = plain.match(/^(.+?)\s+([A-Z][\w-]*)$/);
  if (noEngine) {
    return { family: noEngine[1], generation: noEngine[2], engine: "" };
  }

  return { family: plain || model, generation: "", engine: "" };
}

function ValueBlock({ value, className = "" }) {
  const cleaned = cleanText(value);
  const parts = cleaned.match(/^(.+?)\s+\[(.+)\]$/);

  return (
    <p className={`text-[0.63rem] font-semibold leading-[1.35] md:text-[0.8rem] md:leading-[1.45] ${className}`}>
      <span className="block">{parts ? parts[1] : cleaned}</span>
      {parts ? <span className="block text-[0.52rem] uppercase opacity-85 md:text-[0.68rem]">[{parts[2]}]</span> : null}
    </p>
  );
}

function VerdictMark({ type, showLabel = false }) {
  const status = statusConfig[type] || statusConfig.watch;

  return (
    <span className="inline-flex items-center gap-2">
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${status.circle}`}>
        <Icon name={status.icon} className="h-3.5 w-3.5" strokeWidth={2.6} />
      </span>
      {showLabel ? <span className={`rounded-md px-2 py-0.5 text-[0.72rem] font-bold ${status.pill}`}>{status.label}</span> : null}
    </span>
  );
}

function MatrixRow({ row, isDark }) {
  const parts = modelParts(row.model);
  const verdictText = cleanText(row.verdict.text);

  return (
    <Link
      href={row.href}
      className={`grid grid-cols-[92px_92px_minmax(100px,1fr)_10px] items-center border-b px-1 py-4 last:border-b-0 md:grid-cols-[112px_minmax(140px,1fr)_minmax(165px,1fr)_minmax(165px,1fr)_minmax(175px,1.12fr)] md:px-5 md:py-2.5 ${
        isDark ? "border-[#223a51] text-white hover:bg-[rgba(22,51,74,0.42)]" : "border-[#e3e8ef] text-[#071827] hover:bg-[#f8fbff]"
      }`}
    >
      <div className="flex min-w-0 flex-col items-center gap-2 pr-2 text-center md:contents">
        <div className="relative h-11 w-16 md:h-11 md:w-20">
          <Image src={row.image.src} alt={row.image.alt} fill className="object-contain" sizes="100px" />
        </div>

        <div className="min-w-0 md:pr-3 md:text-left">
          <p className="text-[0.82rem] font-bold leading-[1.16] md:text-[0.9rem]">{parts.family}</p>
          {parts.generation ? <p className="text-[0.82rem] font-bold leading-[1.16] md:text-[0.86rem]">{parts.generation}</p> : null}
          {parts.engine ? (
            <p
              className={`mt-1 text-[0.62rem] leading-[1.15] md:text-[0.68rem] ${isDark ? "text-white/74" : "text-[#172b4a]"}`}
              dangerouslySetInnerHTML={{ __html: `(${unlinkHtml(parts.engine)})` }}
            />
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 md:contents">
        <ValueBlock value={row.vehicleValue} className={isDark ? "text-white/92" : "text-[#061638]"} />
        <ValueBlock value={row.replacementCost} className={isDark ? "text-white/92" : "text-[#061638]"} />
      </div>

      <div className="min-w-0">
        <div className="mb-2 md:mb-1">
          <VerdictMark type={row.verdict.type} showLabel />
        </div>
        <p className={`text-[0.7rem] font-medium leading-[1.35] md:text-[0.68rem] ${isDark ? "text-white/80" : "text-[#071827]"}`} dangerouslySetInnerHTML={{ __html: unlinkHtml(verdictText) }} />
      </div>

      <span className="justify-self-end text-[var(--color-primary)] md:hidden">
        <Icon name="chevron" />
      </span>
    </Link>
  );
}

function DecisionMatrix({ data, isDark }) {
  return (
    <div className={`overflow-hidden rounded-md border shadow-[0_16px_36px_rgba(10,26,43,0.08)] ${isDark ? "border-[#223a51] bg-[rgba(7,23,36,0.9)]" : "border-[#dfe5ed] bg-white"}`}>
      <div className={`flex items-center gap-3 border-b px-4 py-4 md:px-5 md:py-4 ${isDark ? "border-[#223a51]" : "border-[#dfe5ed]"}`}>
        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${isDark ? "bg-[#0c2748] text-[#7fb0ff]" : "bg-[#eef5ff] text-[var(--color-primary)]"}`}>
          <Icon name="chart" className="h-5 w-5" />
        </span>
        <h3 className="text-[1rem] font-bold uppercase text-[var(--color-primary)] md:text-[#071827]">The Decision Matrix</h3>
      </div>

      <div className={`hidden grid-cols-[112px_minmax(140px,1fr)_minmax(165px,1fr)_minmax(165px,1fr)_minmax(175px,1.12fr)] border-b px-5 py-3 text-[0.66rem] font-bold uppercase md:grid ${isDark ? "border-[#223a51] text-white/78" : "border-[#e3e8ef] text-[#071827]"}`}>
        <span />
        {data.matrix.columns.map((col) => (
          <span key={col}>{col}</span>
        ))}
      </div>

      <div className={`grid grid-cols-[92px_92px_minmax(100px,1fr)_10px] border-b px-1 py-3 text-center text-[0.62rem] font-bold uppercase leading-[1.18] md:hidden ${isDark ? "border-[#223a51] text-white/75" : "border-[#e3e8ef] text-[#061638]"}`}>
        <span>{data.matrix.columns[0]}</span>
        <span>
          Typical Vehicle Value
          <br />
          Replacement Cost
          <br />
          <span className="opacity-75">[Recon]</span>
        </span>
        <span>Verdict</span>
        <span />
      </div>

      <div>
        {data.matrix.rows.map((row) => (
          <MatrixRow key={stripTags(row.model) || row.href} row={row} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}

function RuleCard({ data, isDark }) {
  const [mainText, sourceText] = cleanText(data.ruleOfThumb.text).split("This is our BMW-specific threshold,");

  return (
    <div className={`rounded-md border p-5 shadow-[0_16px_36px_rgba(10,26,43,0.08)] md:min-h-[260px] md:p-6 ${isDark ? "border-[#223a51] bg-[rgba(7,23,36,0.9)]" : "border-[#dfe5ed] bg-white"}`}>
      <div className="md:hidden">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_10px_22px_rgba(7,95,216,0.28)]">
            <Icon name="shield" className="h-7 w-7" />
          </span>
          <h3 className={`min-w-0 flex-1 pt-1 text-[0.98rem] font-bold uppercase ${isDark ? "text-white" : "text-[#071827]"}`}>{data.ruleOfThumb.title}</h3>
        </div>

        <div className="mt-5">
          <div className="relative">
            <span className={`absolute -left-1 -top-4 text-5xl font-bold leading-none ${isDark ? "text-white/14" : "text-[#b6c2d1]"}`}>&quot;</span>
            <p className={`relative text-[0.88rem] font-medium leading-[1.5] ${isDark ? "text-white/84" : "text-[#071827]"}`}>
              {mainText}
            </p>
            {sourceText ? <p className={`mt-4 text-[0.72rem] leading-[1.45] ${isDark ? "text-white/68" : "text-[#27384a]"}`}>This is our BMW-specific threshold,{sourceText}</p> : null}
          </div>

          <div className="relative mt-5 text-center">
            <span className={`absolute inset-0 -z-0 mx-auto h-28 w-28 rounded-full ${isDark ? "bg-[#0c2748]" : "bg-[#eef5ff]"}`} />
            <p className="relative text-[4.2rem] font-bold leading-none text-[var(--color-primary)]">{data.ruleOfThumb.percent}</p>
            <p className="relative mt-1 text-[0.95rem] font-bold uppercase text-[var(--color-primary)]">{data.ruleOfThumb.percentLabel}</p>
          </div>
        </div>
      </div>

      <div className="hidden items-start gap-4 md:flex">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_10px_22px_rgba(7,95,216,0.28)]">
          <Icon name="shield" className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={`text-[0.98rem] font-bold uppercase ${isDark ? "text-white" : "text-[#071827]"}`}>{data.ruleOfThumb.title}</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1fr)_120px] md:items-center">
            <div className="relative">
              <span className={`absolute -left-1 -top-4 text-5xl font-bold leading-none ${isDark ? "text-white/14" : "text-[#b6c2d1]"}`}>&quot;</span>
              <p className={`relative text-[0.88rem] font-medium leading-[1.5] md:text-[0.9rem] ${isDark ? "text-white/84" : "text-[#071827]"}`}>
                {mainText}
              </p>
              {sourceText ? <p className={`mt-4 text-[0.72rem] leading-[1.45] ${isDark ? "text-white/68" : "text-[#27384a]"}`}>This is our BMW-specific threshold,{sourceText}</p> : null}
            </div>
            <div className="relative text-center">
              <span className={`absolute inset-0 -z-0 mx-auto h-28 w-28 rounded-full ${isDark ? "bg-[#0c2748]" : "bg-[#eef5ff]"}`} />
              <p className="relative text-[4.2rem] font-bold leading-none text-[var(--color-primary)] md:text-[3.75rem]">{data.ruleOfThumb.percent}</p>
              <p className="relative mt-1 text-[0.95rem] font-bold uppercase text-[var(--color-primary)] md:hidden">{data.ruleOfThumb.percentLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinksCard({ links, isDark }) {
  return (
    <div className={`overflow-hidden rounded-md border shadow-[0_16px_36px_rgba(10,26,43,0.08)] ${isDark ? "border-[#223a51] bg-[rgba(7,23,36,0.9)]" : "border-[#dfe5ed] bg-white"}`}>
      <div className="flex items-center gap-4 px-5 py-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
          <Icon name="link" className="h-5 w-5" />
        </span>
        <h3 className={`text-[0.95rem] font-bold uppercase ${isDark ? "text-white" : "text-[#071827]"}`}>Deeper Analysis Links</h3>
      </div>
      <ul>
        {links.map((link) => (
          <li key={link.id} className={`border-t ${isDark ? "border-[#223a51]" : "border-[#e3e8ef]"}`}>
            <Link href={link.href} className={`flex items-center gap-4 px-5 py-3 text-[0.9rem] font-medium ${isDark ? "text-white hover:bg-[rgba(22,51,74,0.42)]" : "text-[#071827] hover:bg-[#f8fbff]"}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.78rem] font-bold ${isDark ? "bg-[#0c2748] text-[#7fb0ff]" : "bg-[#eaf2ff] text-[var(--color-primary)]"}`}>{link.id}</span>
              <span className="min-w-0 flex-1">{cleanText(link.label)}</span>
              <span className="text-[var(--color-primary)]">
                <Icon name="arrow" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrustStrip({ isDark }) {
  return (
    <ul className={`hidden overflow-hidden rounded-md border shadow-[0_16px_36px_rgba(10,26,43,0.08)] md:grid md:grid-cols-4 ${isDark ? "border-[#223a51] bg-[rgba(7,23,36,0.9)]" : "border-[#dfe5ed] bg-white"}`}>
      {trustItems.map((item) => (
        <li key={item.title} className={`flex items-center gap-5 border-r px-8 py-4 last:border-r-0 ${isDark ? "border-[#223a51]" : "border-[#e3e8ef]"}`}>
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${isDark ? "border-[#29445e] bg-[#0c2748] text-[#7fb0ff]" : "border-[#dbe7f7] bg-white text-[var(--color-primary)]"}`}>
            <Icon name={item.icon} className="h-8 w-8" />
          </span>
          <span>
            <strong className={`block text-[0.95rem] ${isDark ? "text-white" : "text-[#071827]"}`}>{item.title}</strong>
            <span className={`mt-1 block text-[0.76rem] leading-[1.35] ${isDark ? "text-white/72" : "text-[#27384a]"}`}>{item.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function MobileCta({ isDark }) {
  return (
    <div className={`flex items-center gap-5 rounded-md border p-5 shadow-[0_16px_36px_rgba(10,26,43,0.08)] md:hidden ${isDark ? "border-[#223a51] bg-[rgba(7,23,36,0.9)]" : "border-[#dfe5ed] bg-[#f2f7ff]"}`}>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_10px_22px_rgba(7,95,216,0.28)]">
        <Icon name="shield" className="h-8 w-8" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-[0.94rem] font-bold ${isDark ? "text-white" : "text-[#071827]"}`}>Honest. Data-Backed. Unbiased.</p>
        <p className={`mt-1 text-[0.74rem] leading-[1.45] ${isDark ? "text-white/76" : "text-[#27384a]"}`}>We tell you the truth - even when it means walking away. That&apos;s the Engine Finders promise.</p>
      </div>
      <Link href="/quote" className="btn-cta hidden shrink-0 items-center gap-4 rounded-md bg-[var(--color-primary)] px-6 py-4 text-[0.9rem] font-bold text-white sm:flex">
        Start Your Research
        <Icon name="arrow" />
      </Link>
    </div>
  );
}

export default function HomeSec6({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const heroImage = isDark ? comparisonHeroImages.dark : comparisonHeroImages.light;

  return (
    <section className={`relative overflow-hidden px-3 py-6 md:py-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 h-[335px] md:h-[330px]">
        <Image src={heroImage.src} alt={heroImage.alt} fill className="object-cover object-[78%_center]" priority={false} sizes="100vw" />
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,11,0.98)_0%,rgba(2,7,11,0.82)_42%,rgba(2,7,11,0.24)_76%)]" : "absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.9)_44%,rgba(255,255,255,0.22)_76%)]"} />
        <div className={isDark ? "absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,#02070b_0%,transparent_100%)]" : "absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,white_0%,transparent_100%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="max-w-[710px] pt-2 md:pt-7">
          <h2 className={`text-[2.4rem] font-bold leading-[1.02] tracking-normal md:text-[3.6rem] ${isDark ? "text-white" : "text-[#071827]"}`}>The Ownership Economics Centre</h2>
          <div className="mt-4">
            <MStripe />
          </div>
          <p className={`mt-4 max-w-[620px] text-[0.9rem] leading-[1.55] md:text-[1.02rem] ${isDark ? "text-white/80" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }} />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_450px] md:items-start">
          <div className="overflow-x-auto pb-1 md:overflow-visible md:pb-0">
            <DecisionMatrix data={data} isDark={isDark} />
          </div>

          <div className="grid gap-4">
            <RuleCard data={data} isDark={isDark} />
            <LinksCard links={data.deeperLinks} isDark={isDark} />
          </div>
        </div>

        <div className="mt-4">
          <TrustStrip isDark={isDark} />
        </div>

        <div className="mt-5">
          <MobileCta isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
