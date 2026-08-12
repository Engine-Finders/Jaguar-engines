import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { sectionBody, sectionButton, sectionDescription } from "@/components/models/sectionTypography";

const iconPaths = {
  calculator: (
    <>
      <path d="M6 3h12v18H6V3Zm3 4h6M9 11h.01M12 11h.01M15 11h.01M9 15h.01M12 15h.01M15 15h.01M9 18h.01M12 18h.01M15 18h.01" />
    </>
  ),
  engineSearch: (
    <>
      <path d="M4 12h3m10 0h3M7 9h7.5a3.5 3.5 0 0 1 0 7H7V9Zm2-3h5m-2 0V3M6 16v3m10-3v3" />
      <path d="m17 17 4 4" />
      <circle cx="14" cy="13" r="4" />
    </>
  ),
  documentSearch: (
    <>
      <path d="M7 3h7l4 4v14H7V3Zm7 0v5h5M10 11h5M10 15h2" />
      <circle cx="14" cy="16" r="3" />
      <path d="m16.5 18.5 3 3" />
    </>
  ),
  engineQuestion: (
    <>
      <path d="M4 12h3m10 0h3M7 9h10v7H7V9Zm2-3h6m-3 0V3M6 16v3m12-3v3" />
      <path d="M12 14v-.4c0-.8.7-1.1 1.2-1.5.4-.3.8-.7.8-1.3 0-1-1-1.7-2-1.7s-1.8.5-2.2 1.3M12 16.8h.01" />
    </>
  ),
  check: <path d="M21 11a9 9 0 1 1-2.6-6.4M21 4 12 13l-3-3" />,
  chart: <path d="M5 19V9m5 10V5m5 14v-7m5 7H3" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />,
  info: <path d="M12 17v-6m0-4h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />,
  target: <path d="M12 21a9 9 0 1 0-9-9m14 0a5 5 0 1 1-5-5m8-3-4 4m4-4h-4m4 0v4" />,
};

function cleanText(text = "") {
  return text
    .replaceAll("Ãƒâ€šÃ‚Â£", "\u00a3")
    .replaceAll("Ã‚Â£", "\u00a3")
    .replaceAll("Ã¢â‚¬â€œ", "-")
    .replaceAll("Ã¢â‚¬â€", "-")
    .replaceAll("Ã¢â€ â€™", "->")
    .replace(/\s+-\s+/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function modelNameFromTitle(title = "") {
  const clean = cleanText(title);
  const match = clean.match(/My\s+(.+?)\s+Engine/i);
  return match ? match[1] : "BMW";
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const marker = "or Should I Replace It?";
  const index = clean.indexOf(marker);

  if (index === -1) {
    return { before: clean, accent: "" };
  }

  return {
    before: clean.slice(0, index).trim(),
    accent: marker,
  };
}

function introParts(intro = "") {
  const clean = cleanText(intro);
  const marker = " On the ";
  const markerIndex = clean.indexOf(marker);

  if (markerIndex !== -1) {
    return {
      first: clean.slice(0, markerIndex).trim(),
      second: clean.slice(markerIndex + 1).trim(),
    };
  }

  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];

  return {
    first: sentences[0]?.trim() || clean,
    second: sentences.slice(1).join(" ").trim(),
  };
}

function Icon({ name, className = "h-8 w-8", stroke = 2 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.calculator}
    </svg>
  );
}

function CircleIcon({ name, large = false, className = "" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] ${large ? "h-28 w-28 md:h-36 md:w-36" : "h-12 w-12"} ${className}`}>
      <Icon name={name} className={large ? "h-16 w-16 md:h-20 md:w-20" : "h-7 w-7"} />
    </span>
  );
}

function Feature({ icon, title, text }) {
  return (
      <li className="flex min-w-0 items-start gap-2.5 pr-3 last:pr-0 md:gap-3 md:pr-4">
      <span className="mt-0.5 shrink-0 text-[var(--color-primary)]">
        <Icon name={icon} className="h-7 w-7 md:h-8 md:w-8" stroke={2.2} />
      </span>
      <span className="min-w-0">
        <strong className="block text-[13px] leading-tight text-[var(--color-text)] md:text-[14px]" dangerouslySetInnerHTML={{ __html: title }} />
        <span className="mt-0.5 block text-[12px] leading-[1.2] text-[var(--color-text-muted)] md:text-[13px]">{text}</span>
      </span>
    </li>
  );
}

function ArrowIcon({ className = "h-7 w-7" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function PrimaryPath({ path, modelName }) {
  return (
    <article className="rounded-md bg-[var(--color-surface-raised)] p-3.5 shadow-[0_10px_28px_var(--color-shadow)] md:p-4">
      <span className="inline-flex rounded bg-[var(--color-primary)] px-2 py-1 text-[12px] font-bold uppercase leading-none text-white md:px-2.5 md:py-1 md:text-[13px]">Path 1</span>
      <div className="mt-3.5 grid grid-cols-[auto_1fr] items-center gap-3.5 md:grid-cols-[1fr_auto] md:items-start">
        <div className="order-2 md:order-1">
          <h3 className="text-[30px] font-bold leading-[1.06] text-[var(--color-text)] md:text-[42px]">
            <span className="text-[var(--color-primary)]">Know</span> your engine?
          </h3>
          <p className={`mt-2 max-w-[420px] text-[var(--color-text-muted)] ${sectionDescription}`}>
            Launch the BMW diagnostic calculator with <span dangerouslySetInnerHTML={{ __html: modelName }} /> pre-selected.
          </p>
        </div>
        <CircleIcon name="engineSearch" large className="order-1 md:order-2" />
      </div>

      <Link href={path?.href || "/fault-diagnostic-calculator"} className={`mt-3.5 flex min-h-12 items-center justify-between gap-2.5 rounded-md bg-[var(--color-primary)] px-3.5 py-2.5 font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] transition-all duration-200 hover:text-black hover:shadow-[0_18px_36px_rgba(0,0,0,0.24)] ${sectionButton}`}>
        <span className="flex min-w-0 items-center gap-2.5">
          <Icon name="calculator" className="h-8 w-8 shrink-0" />
          <span className="min-w-0">
            <span className="block leading-tight">Launch BMW Diagnostic Calculator</span>
            <span className="mt-0.5 block text-[12px] font-normal leading-tight md:text-[13px]"><span dangerouslySetInnerHTML={{ __html: modelName }} /> pre-selected</span>
          </span>
        </span>
        <ArrowIcon className="h-5 w-5 shrink-0" />
      </Link>

      <ul className="mt-4 grid grid-cols-3 gap-2.5">
        <Feature icon="check" title={`${modelName} pre-selected`} text="All generations covered" />
        <Feature icon="chart" title="Real UK cost data" text="Used, recon & rebuilt" />
        <Feature icon="shield" title="Instant verdict" text="Repair vs replace" />
      </ul>
    </article>
  );
}

function SecondaryPath({ path }) {
  const note = cleanText(path?.label || "").includes("identification is the first step")
    ? "Identification is the first step inside the tool."
    : "Identification is the first step inside the tool.";

  return (
    <article className="rounded-md bg-[var(--color-surface-raised)] p-3.5 shadow-[0_10px_28px_var(--color-shadow)] md:p-4">
      <span className="inline-flex rounded bg-[var(--color-primary)] px-2 py-1 text-[12px] font-bold uppercase leading-none text-white md:px-2.5 md:py-1 md:text-[13px]">Path 2</span>
      <div className="mt-3.5 grid grid-cols-[auto_1fr] items-center gap-3.5 md:grid-cols-[1fr_auto] md:items-start">
        <div className="order-2 md:order-1">
          <h3 className="max-w-[420px] text-[30px] font-bold leading-[1.06] text-[var(--color-text)] md:text-[42px]">
            <span className="text-[var(--color-primary)]">Not sure</span> which engine you have?
          </h3>
          <p className={`mt-2 text-[var(--color-text-muted)] ${sectionDescription}`}>We&apos;ll identify it first.</p>
        </div>
        <CircleIcon name="documentSearch" large className="order-1 md:order-2" />
      </div>

      <Link href={path?.href || "#"} className={`mt-3.5 flex min-h-12 items-center justify-between gap-2.5 rounded-md px-3.5 py-2.5 font-bold text-[var(--color-primary)] transition-all duration-200 hover:text-black hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)] ${sectionButton}`}>
        <span className="flex min-w-0 items-center gap-2.5">
          <Icon name="engineQuestion" className="h-8 w-8 shrink-0" />
          <span className="min-w-0">
            <span className="block leading-tight">Identify My Engine First</span>
            <span className="mt-0.5 block text-[12px] font-normal leading-tight text-[var(--color-text-muted)] md:text-[13px]">Then launch the diagnostic calculator</span>
          </span>
        </span>
        <ArrowIcon className="h-5 w-5 shrink-0" />
      </Link>

      <div className="mt-4 flex gap-3 rounded-md bg-[var(--color-page-soft)] p-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
          <Icon name="info" className="h-5 w-5" />
        </span>
        <p className={`text-[var(--color-text)] ${sectionBody}`}>
          <strong className="font-bold" dangerouslySetInnerHTML={{ __html: note }} />
          <br />
          <span className="text-[var(--color-text-muted)]">We&apos;ll pinpoint your exact engine code before running the diagnostics.</span>
        </p>
      </div>
    </article>
  );
}

function SmartDecision() {
  return (
    <div className="flex max-w-[620px] gap-3.5 rounded-md bg-[var(--color-page-soft)] p-3.5 shadow-[0_8px_22px_var(--color-shadow)] md:p-4">
      <span className="shrink-0 text-[var(--color-primary)]">
        <Icon name="calculator" className="h-9 w-9 md:h-11 md:w-11" stroke={2.2} />
      </span>
      <p className={`text-[var(--color-text)] ${sectionBody} md:text-[17px]`}>
        <strong className="font-bold text-[var(--color-primary)]">The smarter way to decide:</strong> Get a personalised repair-vs-replace verdict using real UK cost data.
      </p>
    </div>
  );
}

export default function CalculatorCTA({ data }) {
  if (!data) return null;

  const title = splitTitle(data.h2);
  const intro = introParts(data.intro);
  const modelName = modelNameFromTitle(data.h2);
  const paths = data.paths || [];

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)] py-6 text-[var(--color-text)] md:py-8">
      <div className="relative overflow-hidden rounded-md bg-[var(--color-surface-raised)]">
        <Image
          src="/model/Hero-bg-image.webp"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--color-hero-fade) 0%, var(--color-hero-fade) 32%, var(--color-hero-overlay) 52%, rgba(255,255,255,0.18) 68%, rgba(255,255,255,0) 86%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 58% 50%, var(--color-hero-overlay) 0%, rgba(255,255,255,0.22) 24%, rgba(255,255,255,0) 58%)",
          }}
        />
        <div className="relative z-10 px-4 py-5 lg:px-6 lg:py-6">
          <div className="max-w-[820px]">
            <h2 className="max-w-[820px] text-[29px] font-bold leading-[1.08] tracking-normal text-[var(--color-text)] md:text-[45px]">
              <span dangerouslySetInnerHTML={{ __html: title.before }} />
              {title.accent ? (
                <>
                  {" "}
                  <span className="text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: title.accent }} />
                </>
              ) : null}
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>
            {data.intro ? (
              <div className={`mt-3 max-w-[700px] text-[var(--color-text-muted)] ${sectionDescription}`}>
                <p dangerouslySetInnerHTML={{ __html: intro.first }} />
                {intro.second ? <p className="mt-1.5" dangerouslySetInnerHTML={{ __html: intro.second }} /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 lg:hidden">
        <SmartDecision />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <PrimaryPath path={paths[0]} modelName={modelName} />
        <SecondaryPath path={paths[1]} />
      </div>

      <div className="mt-5 flex flex-col gap-4 rounded-md bg-[linear-gradient(120deg,#020b1f_0%,#06265a_100%)] p-4 text-white shadow-[0_12px_32px_var(--color-shadow)] md:flex-row md:items-center md:justify-between md:p-5">
        <div className="flex gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[rgba(7,95,216,0.22)] text-white shadow-[0_0_28px_rgba(36,132,255,0.35)]">
            <Icon name="target" className="h-10 w-10" />
          </span>
          <div className="max-w-[700px]">
            <h3 className="text-[20px] font-bold leading-tight md:text-[22px]">Stop guessing. Get the right answer.</h3>
            <p className={`mt-2 text-white/90 ${sectionDescription}`}>
              Our calculator compares real repair and replacement costs against your car&apos;s value - so you know the financially smarter move.
            </p>
          </div>
        </div>
        <Link href={paths[0]?.href || "/fault-diagnostic-calculator"} className={`inline-flex min-h-14 shrink-0 items-center justify-center gap-4 rounded-md bg-[var(--color-primary)] px-5 py-3.5 font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.28)] transition-all duration-200 hover:text-black md:min-w-[360px] ${sectionButton}`}>
          Start Your Verdict Now
          <ArrowIcon className="h-6 w-6" />
        </Link>
      </div>
    </section>
  );
}
