"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";

const factIcons = ["car", "arrow", "arrow", "car"];
const factIconCircled = [false, true, true, false];

// Highlight numeric figures and [TAG] markers inline within a sentence.
function HighlightedLine({ text = "" }) {
  const parts = text.split(/(\[[^\]]+\]|\b\d[\d,.]*\b)/g).filter(Boolean);
  return parts.map((part, i) => {
    const isTag = /^\[[^\]]+\]$/.test(part);
    const isNumber = /^\d[\d,.]*$/.test(part);
    if (isTag || isNumber) {
      return (
        <span key={i} className="font-semibold text-[var(--color-primary)]">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function parseKeyFacts(keyFacts) {
  if (Array.isArray(keyFacts)) return keyFacts;
  if (typeof keyFacts !== "string" || !keyFacts.trim()) return [];

  return keyFacts
    .split(" • ")
    .map((chunk) => chunk.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .map((chunk) => {
      const separatorIndex = chunk.indexOf(":");
      if (separatorIndex === -1) return { label: chunk, value: "" };
      return {
        label: chunk.slice(0, separatorIndex).trim(),
        value: chunk.slice(separatorIndex + 1).trim(),
      };
    });
}

export default function Overview({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const image = isDark ? "/e90/overview_dark - Copy.webp" : "/e90/overview_light.webp";
  const keyFacts = parseKeyFacts(data.keyFacts);

  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyTextClass = isDark ? "text-white/80" : "text-[var(--color-text-muted)]";
  const cardDividerClass = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const factLabelClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const factValueClass = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const marketLineClass = isDark ? "text-white/85" : "text-[var(--color-text)]";

  // Split the intro into up-to-two paragraphs by sentence boundary
  const introParts = data.intro
    ? (() => {
        const text = data.intro.trim();
        const match = text.match(/^(.+?[.!?])(?:\s+)(.+)$/);
        if (match) return [match[1], match[2]];
        return [text];
      })()
    : [];

  const factItem = (fact, index) => (
    <div className="flex min-w-0 flex-1 items-start gap-2 px-1">
      {factIconCircled[index % factIconCircled.length] ? (
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] text-[var(--color-primary)]">
          <GenIcon name={factIcons[index % factIcons.length]} className="h-3 w-3" />
        </span>
      ) : (
        <span className="mt-0.5 shrink-0 text-[var(--color-primary)]">
          <GenIcon name={factIcons[index % factIcons.length]} className="h-4 w-4" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className={`text-[0.8rem] font-semibold leading-[1.25] ${factLabelClass}`} dangerouslySetInnerHTML={{ __html: fact.label }} />
        <p className={`mt-0.5 text-[0.74rem] leading-[1.3] ${factValueClass}`} dangerouslySetInnerHTML={{ __html: fact.value }} />
      </div>
    </div>
  );

  const keyFactsBlockMobile = keyFacts.length > 0 ? (
    <div className="glass-panel mt-4 rounded-lg p-3">
      <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
        Key Facts
      </p>
      <div className="mt-2 flex flex-col">
        {Array.from({ length: Math.ceil(keyFacts.length / 2) }, (_, row) => {
          const pair = keyFacts.slice(row * 2, row * 2 + 2);
          return (
            <div
              key={row}
              className={`flex items-stretch py-2 first:pt-2 ${row > 0 ? `border-t ${cardDividerClass}` : ""}`}
            >
              {pair.map((fact, i) => {
                const index = row * 2 + i;
                return (
                  <div key={fact.label} className="flex flex-1 items-stretch">
                    {i > 0 ? (
                      <span
                        aria-hidden="true"
                        className={`mx-2 my-1 w-px shrink-0 self-center ${isDark ? "bg-white/15" : "bg-[var(--color-border)]"}`}
                        style={{ height: "70%" }}
                      />
                    ) : null}
                    {factItem(fact, index)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  ) : null;

  const keyFactsBlockDesktop = keyFacts.length > 0 ? (
    <div className="glass-panel mt-4 rounded-lg p-3">
      <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
        Key Facts
      </p>
      <div className="mt-2 grid grid-cols-4">
        {keyFacts.map((fact, index) => (
          <div
            key={fact.label}
            className={`flex items-start gap-2 border-l py-0 pl-3 first:border-l-0 first:pl-0 ${cardDividerClass}`}
          >
            {factIconCircled[index % factIconCircled.length] ? (
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] text-[var(--color-primary)]">
                <GenIcon name={factIcons[index % factIcons.length]} className="h-3 w-3" />
              </span>
            ) : (
              <span className="mt-0.5 shrink-0 text-[var(--color-primary)]">
                <GenIcon name={factIcons[index % factIcons.length]} className="h-4 w-4" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className={`text-[0.8rem] font-semibold leading-[1.25] ${factLabelClass}`} dangerouslySetInnerHTML={{ __html: fact.label }} />
              <p className={`mt-0.5 text-[0.74rem] leading-[1.3] ${factValueClass}`} dangerouslySetInnerHTML={{ __html: fact.value }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  const marketIntelligenceBlockMobile = data.marketIntelligenceLine ? (
    <div className="glass-panel relative mt-2.5 flex items-center gap-3 rounded-lg p-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
        <GenIcon name="target" className="h-5.5 w-5.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          Market Intelligence
        </p>
        <p className={`mt-1 text-[0.8rem] leading-[1.4] ${marketLineClass}`}>
          <HighlightedLine text={data.marketIntelligenceLine} />
        </p>
      </div>
    </div>
  ) : null;

  const marketIntelligenceBlockDesktop = data.marketIntelligenceLine ? (
    <div className="glass-panel relative mt-2.5 flex items-start gap-3 rounded-lg p-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
        <GenIcon name="target" className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          Market Intelligence
        </p>
        <p className={`mt-1 text-[0.8rem] leading-[1.4] ${marketLineClass}`}>
          <HighlightedLine text={data.marketIntelligenceLine} />
        </p>
      </div>
    </div>
  ) : null;

  const mobileImage = isDark ? "/e90/overview_mobile_dark.webp" : "/e90/overview_mobile_light.webp";

  return (
    <section className={`w-full bg-[var(--color-page)] ${headingClass}`}>
      {/* MOBILE: hero image up top in normal flow, content stacked below it (not overlaid) */}
      <div className="md:hidden">
        <div className="relative -mb-px h-[260px] w-full overflow-hidden">
          <Image
            src={mobileImage}
            alt={data.image?.alt || "BMW 3 Series E90"}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-[linear-gradient(180deg,transparent_40%,rgba(2,7,17,0.75)_75%,rgba(2,7,17,1)_97%)]"
                : "bg-[linear-gradient(180deg,transparent_40%,rgba(255,255,255,0.75)_75%,rgba(255,255,255,1)_97%)]"
            }`}
          />
          {/* Solid strip guarantees full opacity at the very edge - no sub-pixel seam from the gradient's asymptotic stop */}
          <div className="absolute inset-x-0 bottom-0 h-3 bg-[var(--color-page)]" />
        </div>

        <div className="px-4 pb-7 pt-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
            Overview
          </p>
          <h2
            className="mt-1.5 text-[2.15rem] font-bold leading-[1.1] tracking-normal"
            dangerouslySetInnerHTML={{ __html: data.h2 }}
          />

          <div className="mt-2.5">
            <MStripe />
          </div>

          {introParts.length > 0 ? (
            <div className={`mt-4 flex flex-col gap-3 text-[0.9rem] leading-[1.5] ${bodyTextClass}`}>
              {introParts.map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
              ))}
            </div>
          ) : null}

          {keyFactsBlockMobile}
          {marketIntelligenceBlockMobile}
        </div>
      </div>

      {/* DESKTOP: full-bleed background image with content overlaid on top */}
      <div className={`relative hidden overflow-hidden px-10 md:block md:h-[500px] lg:h-[520px]`}>
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={data.image?.alt || "BMW 3 Series E90"}
            fill
            className="object-cover object-[20%_55%]"
            sizes="100vw"
            priority
          />
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_58%,transparent_0%,transparent_30%,rgba(2,7,17,0.45)_58%,rgba(2,7,17,0.85)_85%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_28%,rgba(2,7,17,0.92)_40%,rgba(2,7,17,1)_50%,rgba(2,7,17,1)_100%)]" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_58%,transparent_0%,transparent_30%,rgba(255,255,255,0.5)_58%,rgba(255,255,255,0.92)_85%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_28%,rgba(255,255,255,0.94)_40%,rgba(255,255,255,1)_50%,rgba(255,255,255,1)_100%)]" />
            </>
          )}
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-8xl px-4 md:px-8">
          <div className="grid h-full w-full grid-cols-[0.6fr_1fr] items-center gap-0">
            <div aria-hidden="true" />

            <div className="flex flex-col justify-center pl-8">
              <h2
                className="text-[3rem] font-bold leading-[1.1] tracking-normal"
                dangerouslySetInnerHTML={{ __html: data.h2 }}
              />

              <div className="mt-2.5">
                <MStripe />
              </div>

              {introParts.length > 0 ? (
                <div className={`mt-4 flex flex-col gap-3 text-[1.05rem] leading-[1.55] ${bodyTextClass}`}>
                  {introParts.map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                  ))}
                </div>
              ) : null}

              {keyFactsBlockDesktop}
              {marketIntelligenceBlockDesktop}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
