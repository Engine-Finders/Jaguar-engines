"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { sectionBody, sectionButton, sectionDescription } from "@/components/models/sectionTypography";

const ICON_LG = "h-12 w-12 md:h-14 md:w-14";
const ICON_XL = "h-14 w-14 md:h-16 md:w-16";

function cleanText(text = "") {
  return String(text ?? "")
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
  return match ? match[1] : "Jaguar";
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
  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];

  return {
    first: sentences[0]?.trim() || clean,
    second: sentences.slice(1).join(" ").trim(),
  };
}

function CircleIcon({ name, isDark, large = false, compact = false }) {
  const circleClass = large
    ? "h-[4.75rem] w-[4.75rem] md:h-[5.5rem] md:w-[5.5rem]"
    : compact
      ? "h-8 w-8 md:h-9 md:w-9"
      : "h-12 w-12 md:h-14 md:w-14";

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${
        isDark ? "bg-white/10" : "bg-[#ececeb]"
      } ${circleClass}`}
    >
      <HomeIcon
        name={name}
        isDark={isDark}
        className={
          large
            ? "h-16 w-16 md:h-20 md:w-20"
            : compact
              ? "h-6 w-6 md:h-7 md:w-7"
              : ICON_LG
        }
      />
    </span>
  );
}

function Feature({ icon, title, text, isDark }) {
  return (
    <li className="flex min-w-0 items-start gap-2.5 pr-3 last:pr-0 md:gap-3 md:pr-4">
      <span className="mt-0.5 shrink-0">
        <HomeIcon name={icon} isDark={isDark} className="h-8 w-8 md:h-9 md:w-9" />
      </span>
      <span className="min-w-0">
        <strong
          className={`block text-[13px] leading-tight md:text-[14px] ${isDark ? "text-white" : "text-black"}`}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <span className={`mt-0.5 block text-[12px] leading-[1.2] md:text-[13px] ${isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}`}>
          {text}
        </span>
      </span>
    </li>
  );
}

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function PrimaryPath({ path, modelName, isDark }) {
  return (
    <article
      className={`rounded-xl border p-3.5 md:p-4 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_24px_rgba(16,18,16,0.06)]"
      }`}
    >
      <span
        className={`inline-flex rounded px-2 py-1 text-[12px] font-bold uppercase leading-none md:px-2.5 md:py-1 md:text-[13px] ${
          isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
        }`}
      >
        Path 1
      </span>
      <div className="mt-3.5 grid grid-cols-[auto_1fr] items-center gap-3.5 md:grid-cols-[1fr_auto] md:items-start">
        <div className="order-2 md:order-1">
          <h3 className={`text-[1.55rem] font-bold leading-[1.06] md:text-[2rem] ${isDark ? "text-white" : "text-black"}`}>
            <span className="text-[var(--color-chrome-bright)]">Know</span> your engine?
          </h3>
          <p className={`mt-2 max-w-[420px] ${sectionDescription} ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
            Launch the Jaguar diagnostic calculator with <span dangerouslySetInnerHTML={{ __html: modelName }} /> pre-selected.
          </p>
        </div>
        <CircleIcon name="engine-codes" isDark={isDark} large className="order-1 md:order-2" />
      </div>

      <Link
        href={path?.href || "/fault-diagnostic-calculator"}
        className={`mt-3.5 flex min-h-12 items-center justify-between gap-2.5 rounded-md px-3.5 py-2.5 font-bold transition-all duration-200 md:min-h-[3.25rem] bg-black text-white hover:bg-[var(--color-chrome-bright)] hover:text-black ${sectionButton}`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <HomeIcon name="calculator" isDark={true} className="h-8 w-8 shrink-0" />
          <span className="min-w-0">
            <span className="block leading-tight">Launch Jaguar Diagnostic Calculator</span>
            <span className={`mt-0.5 block text-[12px] font-normal leading-tight md:text-[13px] ${isDark ? "text-white/75" : "text-white/80"}`}>
              <span dangerouslySetInnerHTML={{ __html: modelName }} /> pre-selected
            </span>
          </span>
        </span>
        <ArrowIcon className="h-5 w-5 shrink-0" />
      </Link>

      <ul className="mt-4 grid grid-cols-3 gap-2.5">
        <Feature icon="check" title={`${modelName} pre-selected`} text="All generations covered" isDark={isDark} />
        <Feature icon="chart" title="Real UK cost data" text="Used, recon & rebuilt" isDark={isDark} />
        <Feature icon="scale" title="Instant verdict" text="Repair vs replace" isDark={isDark} />
      </ul>
    </article>
  );
}

function SecondaryPath({ path, isDark }) {
  return (
    <article
      className={`rounded-xl border p-3.5 md:p-4 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_24px_rgba(16,18,16,0.06)]"
      }`}
    >
      <span
        className={`inline-flex rounded px-2 py-1 text-[12px] font-bold uppercase leading-none md:px-2.5 md:py-1 md:text-[13px] ${
          isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-black text-white"
        }`}
      >
        Path 2
      </span>
      <div className="mt-3.5 grid grid-cols-[auto_1fr] items-center gap-3.5 md:grid-cols-[1fr_auto] md:items-start">
        <div className="order-2 md:order-1">
          <h3 className={`max-w-[420px] text-[1.55rem] font-bold leading-[1.06] md:text-[2rem] ${isDark ? "text-white" : "text-black"}`}>
            <span className="text-[var(--color-chrome-bright)]">Not sure</span> which engine you have?
          </h3>
          <p className={`mt-2 ${sectionDescription} ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
            We&apos;ll identify it first.
          </p>
        </div>
        <CircleIcon name="bulb" isDark={isDark} large className="order-1 md:order-2" />
      </div>

      <Link
        href={path?.href || "#"}
        className={`mt-3 flex min-h-12 items-center justify-between gap-2.5 rounded-md px-3.5 py-2.5 font-bold transition-all duration-200 md:mt-3 md:min-h-[3rem] ${
          isDark
            ? "bg-black text-white hover:bg-[var(--color-chrome-bright)] hover:text-black"
            : "border-[#d8d8d6] text-black hover:border-[var(--color-chrome)] hover:bg-[#f6f6f5]"
        } ${sectionButton}`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <HomeIcon name="diagnosis" isDark={isDark} className="h-8 w-8 shrink-0" />
          <span className="min-w-0">
            <span className="block leading-tight">Identify My Engine First</span>
            <span className={`mt-0.5 block text-[12px] font-normal leading-tight md:text-[13px] ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}>
              Then launch the diagnostic calculator
            </span>
          </span>
        </span>
        <ArrowIcon className="h-5 w-5 shrink-0" />
      </Link>

      <div
        className={`mt-2 flex items-start gap-2 rounded-md p-2.5 md:mt-2 md:p-3 ${
          isDark ? "bg-white/[0.04]" : "bg-[#f3f3f2]"
        }`}
      >
        <CircleIcon name="info" isDark={isDark} compact />
        <p className={`min-w-0 leading-[1.4] text-[var(--color-text)] ${sectionBody}`}>
          <strong className={`font-bold ${isDark ? "text-white" : "text-black"}`}>
            Identification is the first step inside the tool.
          </strong>
          <br />
          <span className={isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}>
            We&apos;ll pinpoint your exact engine code before running the diagnostics.
          </span>
        </p>
      </div>
    </article>
  );
}

function SmartDecision({ isDark }) {
  return (
    <div
      className={`flex max-w-[620px] gap-3.5 rounded-xl border p-3.5 md:p-4 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[#e8e8e6] bg-white shadow-[0_8px_22px_rgba(16,18,16,0.05)]"
      }`}
    >
      <HomeIcon name="calculator" isDark={isDark} className="h-9 w-9 shrink-0 md:h-11 md:w-11" />
      <p className={`${sectionBody} md:text-[17px] ${isDark ? "text-white/85" : "text-[var(--color-text)]"}`}>
        <strong className={`font-bold ${isDark ? "text-[var(--color-chrome-bright)]" : "text-black"}`}>
          The smarter way to decide:
        </strong>{" "}
        Get a personalised repair-vs-replace verdict using real UK cost data.
      </p>
    </div>
  );
}

export default function CalculatorCTA({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data) return null;

  const title = splitTitle(data.h2);
  const intro = introParts(data.intro);
  const modelName = modelNameFromTitle(data.h2);
  const paths = data.paths || [];
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[var(--color-page)]";

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
                : "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(243,243,241,0.88)_34%,rgba(243,243,241,0.18)_100%)]"
            }
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-5 md:px-6 md:pb-3.5 md:pt-7 lg:px-8">
          <div className="max-w-[820px]">
            <p
              className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
              }`}
            >
              Diagnostic Calculator
            </p>
            <h2
              className={`mt-1.5 text-[1.55rem] font-bold leading-[1.02] sm:text-[1.85rem] md:text-[2.35rem] md:leading-[0.98] lg:text-[2.5rem] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: title.before }} />
              {title.accent ? (
                <>
                  {" "}
                  <span className="text-[var(--color-chrome-bright)]" dangerouslySetInnerHTML={{ __html: title.accent }} />
                </>
              ) : null}
            </h2>
            <div className="mt-2.5">
              <MStripe />
            </div>
            {data.intro ? (
              <div className={`mt-2 max-w-[700px] md:mt-2.5 ${sectionDescription} ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}>
                <p dangerouslySetInnerHTML={{ __html: intro.first }} />
                {intro.second ? <p className="mt-1.5" dangerouslySetInnerHTML={{ __html: intro.second }} /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-8xl px-4 pb-5 pt-2 md:px-6 md:pb-6 md:pt-2.5 lg:px-8">
        <div className="lg:hidden">
          <SmartDecision isDark={isDark} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:mt-5">
          <PrimaryPath path={paths[0]} modelName={modelName} isDark={isDark} />
          <SecondaryPath path={paths[1]} isDark={isDark} />
        </div>

        <div
          className={`mt-5 flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between md:p-5 ${
            isDark
              ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
              : "border-[#e8e8e6] bg-white shadow-[0_8px_24px_rgba(16,18,16,0.06)]"
          }`}
        >
          <div className="flex gap-4">
            <span
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full md:h-[4.5rem] md:w-[4.5rem] ${
                isDark ? "bg-white/10" : "bg-[#ececeb]"
              }`}
            >
              <HomeIcon name="scope-decision" isDark={isDark} className={ICON_XL} />
            </span>
            <div className="max-w-[700px]">
              <h3 className={`text-[20px] font-bold leading-tight md:text-[22px] ${isDark ? "text-white" : "text-black"}`}>
                Stop guessing. Get the right answer.
              </h3>
              <p className={`mt-2 ${sectionDescription} ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}>
                Our calculator compares real repair and replacement costs against your car&apos;s value - so you know the financially smarter move.
              </p>
            </div>
          </div>
          <Link
            href={paths[0]?.href || "/fault-diagnostic-calculator"}
            className={`inline-flex min-h-14 shrink-0 items-center justify-center gap-4 rounded-md bg-black px-5 py-3.5 font-bold text-white transition-all duration-200 hover:bg-[var(--color-chrome-bright)] hover:text-black md:min-w-[360px] ${sectionButton}`}
          >
            Start Your Verdict Now
            <ArrowIcon className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}
