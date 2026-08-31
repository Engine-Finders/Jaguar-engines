"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";
import GenerationSectionHeader from "./GenerationSectionHeader";
import { generationSectionBg, indexBadgeClass, splitCommonProblemsH2 } from "./generationSection";

function TieredCostTable({ tiers, isDark }) {
  if (!tiers?.length) return null;

  const specialistClass = isDark ? "text-[#67d99a]" : "text-[#13884a]";

  return (
    <div className="overflow-hidden rounded-md border border-[var(--color-border)]">
      {tiers.map((tier) => {
        const isCatastrophic = tier.tier.toLowerCase().includes("catastrophic");
        const toneClass = isCatastrophic ? "text-[#db2e2e]" : "text-[var(--color-primary)]";

        return (
          <div key={tier.tier} className="border-b border-[var(--color-border)] last:border-b-0">
            <div className="grid grid-cols-[1.6fr_1fr_1fr] items-stretch">
              <div className="flex items-center gap-1.5 border-b border-r border-[var(--color-border)]">
                <GenIcon name={isCatastrophic ? "warning" : "wrench"} className="h-3.5 w-3.5 shrink-0" />
                <p className={`text-[0.62rem] uppercase tracking-wide ${toneClass}`} dangerouslySetInnerHTML={{ __html: tier.tier }} />
              </div>
              <div className="flex items-center justify-center border-b border-r border-[var(--color-border)]">
                <p className="text-[0.62rem] uppercase tracking-wide text-[var(--color-text-soft)]">Dealer</p>
              </div>
              <div className="flex items-center justify-center border-b border-[var(--color-border)]">
                <p className="text-[0.62rem] uppercase tracking-wide text-[var(--color-text-soft)]">Specialist</p>
              </div>

              <div className="border-r border-[var(--color-border)]" />
              <div className="flex items-center justify-center border-r border-[var(--color-border)]">
                <p className="text-[0.62rem] text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: tier.dealer }} />
              </div>
              <div className="flex items-center justify-center">
                <p className={`text-[0.62rem] ${specialistClass}`} dangerouslySetInnerHTML={{ __html: tier.specialist }} />
              </div>
            </div>
            <div className="border-t border-[var(--color-border)]">
              <p className="text-[0.76rem] leading-[1.35] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: tier.work }} />
              {tier.note ? <p className="mt-0.5 text-[0.72rem] italic text-[var(--color-text-soft)]" dangerouslySetInnerHTML={{ __html: tier.note }} /> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function splitTitle(title = "") {
  const spaceIndex = title.indexOf(" ");
  if (spaceIndex === -1) return { code: title, name: "" };
  return { code: title.slice(0, spaceIndex), name: title.slice(spaceIndex + 1) };
}

function RiskBadge({ riskLevel }) {
  if (!riskLevel) return null;
  const isHigh = riskLevel.toLowerCase().includes("high");
  const toneClass = isHigh
    ? "border-[#db2e2e] text-[#db2e2e]"
    : "border-[#da7a12] text-[#da7a12]";

  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold ${toneClass}`}>
      <GenIcon name="warning" className="h-3 w-3" />
      {riskLevel}
    </span>
  );
}

function AccordionCard({ problem, isDark, isOpen, onToggle }) {
  return (
    <div className="glass-panel overflow-hidden rounded-md">
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="flex w-full gap-3 py-3 pr-3 text-left">
        <span className="relative h-20 w-20 shrink-0 overflow-hidden">
          <Image src="/e90/section6.webp" alt={problem.title} fill className="object-cover object-[center_20%] scale-125" sizes="80px" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[0.7rem] font-bold ${indexBadgeClass(isDark)}`}>
                {String(problem.id).padStart(2, "0")}
              </span>
              <p className="min-w-0 text-[0.88rem] font-bold leading-tight text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: problem.title }} />
            </div>
            <GenIcon
              name="chevronDown"
              className={`h-4 w-4 shrink-0 text-[var(--color-primary)] transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>

          <div className="mt-2 grid grid-cols-2 divide-x divide-[var(--color-border)] text-[0.7rem]">
            <div className="flex items-start gap-1.5 pr-2">
              <GenIcon name="car" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
              <span className="text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: problem.affectedModels }} />
            </div>
            <div className="flex items-start gap-1.5 pl-2">
              <GenIcon name="gauge" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
              <span className="text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: problem.typicalFailureMileage }} />
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <RiskBadge riskLevel={problem.riskLevel} />
            <span className="min-w-0 flex-1 truncate text-[0.7rem] leading-[1.3] text-[var(--color-text-soft)]" dangerouslySetInnerHTML={{ __html: problem.rootCause }} />
          </div>
        </div>
      </button>

      {isOpen ? (
        <div className="border-t border-[var(--color-border)]">
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-text-soft)]">
              Tiered Cost Table
            </p>
            <TieredCostTable tiers={problem.tieredCosts} isDark={isDark} />
          </div>

          {problem.recommendation ? (
            <div className="border-b border-[var(--color-border)] px-4 py-3">
              <p className="flex items-center gap-1.5 text-[0.76rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                <GenIcon name="shield" className="h-3.5 w-3.5" />
                Our Recommendation
              </p>
              <p className="mt-1 text-[0.8rem] leading-[1.45] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: problem.recommendation }} />
            </div>
          ) : null}

          {problem.cta ? (
            <div className="px-4 py-4">
              <a
                href="/quote"
                className="btn-cta flex h-11 w-full items-center rounded-md px-4"
              >
                <span className="flex-1 text-center text-[0.8rem] font-semibold" dangerouslySetInnerHTML={{ __html: problem.cta.label.replace(/\s*→\s*$/, "") }} />
                <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
              </a>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ProblemCard({ problem, isDark }) {
  const { code, name } = splitTitle(problem.title);

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden rounded-md">
      {/* Header: id badge + title left, image cropped to the card's top-right corner */}
      <div className="relative min-h-[140px] px-4 pb-3 pt-4">
        <div className="relative z-10 flex max-w-[62%] flex-col gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[0.8rem] font-bold ${indexBadgeClass(isDark)}`}>
                {String(problem.id).padStart(2, "0")}
              </span>
              <p className="text-[1rem] font-bold leading-tight text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: code }} />
            </div>
            {name ? <p className="mt-1 text-[1rem] font-bold leading-tight text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: name }} /> : null}
          </div>
          <div className="text-[0.8rem]">
            <p className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
              <GenIcon name="clock" className="h-3.5 w-3.5" />
              Affected models:
            </p>
            <p className="mt-0.5 text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: problem.affectedModels }} />
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-[42%] overflow-hidden rounded-bl-md">
          <div className="relative h-full min-h-[128px] w-full">
            <Image src="/e90/section6.webp" alt={problem.title} fill className="object-cover" sizes="180px" />
          </div>
        </div>
      </div>

      {/* Info list */}
      <div className="flex flex-col gap-2.5 px-4 py-3 text-[0.8rem]">
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
            <GenIcon name="clock" className="h-3.5 w-3.5" />
            Typical failure mileage:
          </p>
          <p className="mt-0.5 text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: problem.typicalFailureMileage }} />
        </div>
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
            <GenIcon name="wrench" className="h-3.5 w-3.5" />
            Root cause:
          </p>
          <p className="mt-0.5 leading-[1.45] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: problem.rootCause }} />
        </div>
      </div>

      {/* Tiered cost table */}
      <div className="border-t border-[var(--color-border)] px-4 py-3">
        <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-text-soft)]">
          Tiered Cost Table
        </p>
        <TieredCostTable tiers={problem.tieredCosts} isDark={isDark} />
      </div>

      {problem.recommendation ? (
        <div className="border-t border-[var(--color-border)] px-4 py-3">
          <p className="flex items-center gap-1.5 text-[0.76rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
            <GenIcon name="shield" className="h-3.5 w-3.5" />
            Our Recommendation
          </p>
          <p className="mt-1 w-full text-[0.8rem] leading-[1.45] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: problem.recommendation }} />
        </div>
      ) : null}

      {problem.cta ? (
        <div className="mt-auto border-t border-[var(--color-border)] px-4 py-4">
          <a
            href="/quote"
            className="btn-cta flex h-11 w-full items-center rounded-md px-4"
          >
            <span className="flex-1 text-center text-[0.8rem] font-semibold" dangerouslySetInnerHTML={{ __html: problem.cta.label.replace(/\s*→\s*$/, "") }} />
            <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default function CommonProblems({ data }) {
  const { theme } = useTheme();
  const [openId, setOpenId] = useState(null);
  if (!data) return null;

  const isDark = theme === "dark";
  const sectionBg = generationSectionBg(isDark, true);
  const title = splitCommonProblemsH2(data.h2 || "Common Problems");

  return (
    <section className={`w-full overflow-x-hidden text-[var(--color-text)] ${sectionBg}`}>
      <GenerationSectionHeader title={title} subHeadline={data.subHeadline} isDark={isDark} sectionBg={sectionBg} />

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5">
        {/* Mobile: accordion - one card open at a time */}
        <div className="flex flex-col gap-3 md:hidden">
          {data.problems?.map((problem) => (
            <AccordionCard
              key={problem.id}
              problem={problem}
              isDark={isDark}
              isOpen={problem.id === openId}
              onToggle={() => setOpenId(problem.id === openId ? null : problem.id)}
            />
          ))}
        </div>

        {/* Desktop: full grid, all cards visible */}
        <div className="hidden gap-3 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {data.problems?.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} isDark={isDark} />
          ))}
        </div>

        {data.trustStrip?.length > 0 || data.footerNote ? (
          <div className="glass-panel mt-4 overflow-hidden rounded-md md:mt-5">
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                <GenIcon name="shield" className="h-5 w-5" />
              </span>
              <p className="text-[1rem] font-bold leading-tight text-[var(--color-text)]">
                How confident are these ratings?
              </p>
            </div>

            {data.trustStrip?.map((item, index) => (
              <div
                key={item.title}
                className={`flex items-center gap-3 px-4 py-3.5 ${index > 0 ? "border-t border-[var(--color-border)]" : ""}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <GenIcon name={item.icon} className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[0.85rem] font-semibold text-[var(--color-text)]"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  />
                  <p
                    className="text-[0.76rem] leading-[1.35] text-[var(--color-text-muted)]"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                </div>
                <GenIcon name="chevron" className="h-4 w-4 shrink-0 text-[var(--color-text-soft)]" />
              </div>
            ))}

            {data.footerNote ? (
              <div className="flex items-center gap-3 border-t border-[var(--color-border)] px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <GenIcon name="tag" className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.85rem] font-semibold text-[var(--color-primary)]">Data Note</p>
                  <p
                    className="text-[0.76rem] leading-[1.35] text-[var(--color-text-muted)]"
                    dangerouslySetInnerHTML={{ __html: data.footerNote }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
