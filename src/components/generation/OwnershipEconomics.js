"use client";

import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";
import GenerationSectionHeader from "./GenerationSectionHeader";
import {
  generationSectionBg,
  indexBadgeClass,
  splitOwnershipEconomicsH2,
  tableHeaderClass,
} from "./generationSection";
import HomeIcon from "@/components/home/homeIcons";

const verdictStyles = {
  warning: { icon: "warning", light: "text-[#d97517]", dark: "text-[#ffb05a]" },
  success: { icon: "check", light: "text-[#13884a]", dark: "text-[#67d99a]" },
  danger: { icon: "warning", light: "text-[#db2e2e]", dark: "text-[#ff8b90]" },
  info: { icon: "info", light: "text-[var(--color-primary)]", dark: "text-[var(--color-chrome-bright)]" },
};

function resolveVerdictType(verdict = "", explicitType) {
  if (explicitType && verdictStyles[explicitType]) return explicitType;

  const text = String(verdict).toLowerCase();
  if (
    text.includes("high risk") ||
    text.includes("most expensive") ||
    text.includes("avoid") ||
    text.includes("write-off") ||
    text.includes("scrap")
  ) {
    return "danger";
  }
  if (
    text.includes("solid choice") ||
    text.includes("best petrol") ||
    text.includes("best diesel") ||
    text.includes("best value") ||
    text.includes("manageable")
  ) {
    return "success";
  }
  if (
    text.includes("risk vs reward") ||
    text.includes("borderline") ||
    text.includes("attention") ||
    text.includes("enthusiast")
  ) {
    return "warning";
  }

  return "info";
}

function VerdictPill({ verdictType, text, isDark }) {
  const resolvedType = resolveVerdictType(text, verdictType);
  const style = verdictStyles[resolvedType] || verdictStyles.info;
  const toneClass = isDark ? style.dark : style.light;

  return (
    <span className={`inline-flex items-start gap-2 text-[0.78rem] font-semibold leading-[1.25] ${toneClass}`}>
      <GenIcon name={style.icon} className={`mt-0.5 h-4 w-4 shrink-0 ${toneClass}`} />
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </span>
  );
}

function DesktopRow({ row, isDark }) {
  const rowClass = isDark
    ? "bg-black text-white"
    : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]";

  return (
    <div
      className={`grid grid-cols-[118px_108px_1fr_130px_150px_1.4fr] items-center gap-px ${rowClass} border-b px-5 py-3 text-[0.85rem] ${borderBottom} last:border-b-0`}
    >
      <span className={`border-r pr-5 pl-3 font-semibold ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.engine }} />
      <span className={`border-r pr-3 pl-5 ${mutedText} ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.typicalMileage }} />
      <span className={`border-r px-4 ${mutedText} ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.commonMajorFailure }} />
      <span className={`border-r px-4 ${mutedText} ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.repairCostSpecialist }} />
      <span className={`border-r px-4 font-semibold ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.replacementCostRecon }} />
      <div className="pl-4">
        <VerdictPill verdictType={row.verdictType} text={row.ownershipVerdict} isDark={isDark} />
      </div>
    </div>
  );
}

const MOBILE_COLS = "grid-cols-[98px_98px_140px_110px_120px_220px]";

function MobileRow({ row, isDark }) {
  const rowClass = isDark
    ? "bg-black text-white"
    : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]";

  return (
    <div
      className={`grid ${MOBILE_COLS} items-center gap-px ${rowClass} border-b px-3 py-3 text-[0.72rem] leading-[1.3] ${borderBottom} last:border-b-0`}
    >
      <span className={`border-r pr-4 pl-2 font-semibold ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.engine }} />
      <span className={`border-r pr-2 pl-4 ${mutedText} ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.typicalMileage }} />
      <span className={`border-r px-3 ${mutedText} ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.commonMajorFailure }} />
      <span className={`border-r px-3 ${mutedText} ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.repairCostSpecialist }} />
      <span className={`border-r px-3 font-semibold ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.replacementCostRecon }} />
      <div className="pl-3">
        <VerdictPill verdictType={row.verdictType} text={row.ownershipVerdict} isDark={isDark} />
      </div>
    </div>
  );
}

const takeawayIcons = ["diamond", "chart", "trophy"];
const COLUMN_ICONS = ["engine", "gauge", "warning", "wrench", "refresh", "shield"];

export default function OwnershipEconomics({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const sectionBg = generationSectionBg(isDark, true);
  const title = splitOwnershipEconomicsH2(data.h2 || "Ownership Economics");
  const headerBg = tableHeaderClass(isDark);
  const headerDivider = isDark ? "border-[var(--color-page)]/20" : "border-white/25";
  const bodyWrapperBg = isDark ? "bg-black" : "bg-[var(--color-table-surface)]";

  return (
    <section className={`w-full overflow-x-hidden text-[var(--color-text)] ${sectionBg}`}>
      <GenerationSectionHeader title={title} subHeadline={data.subHeadline} isDark={isDark} sectionBg={sectionBg} />

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5">
        <div className="hidden overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:block">
          <div className={`grid grid-cols-[118px_108px_1fr_130px_150px_1.4fr] gap-px rounded-t-md ${headerBg} px-5 py-2.5 text-[0.82rem] font-semibold leading-[1.2]`}>
            {data.columns?.map((col, index) => (
              <span
                key={col}
                className={`flex items-center gap-2 border-r last:border-r-0 ${
                  index === 0 ? "pr-5 pl-3" : index === 1 ? "pr-3 pl-5" : "px-4"
                } ${headerDivider}`}
              >
                <GenIcon name={COLUMN_ICONS[index]} className="h-4 w-4 shrink-0" />
                {col}
              </span>
            ))}
          </div>
          <div className={bodyWrapperBg}>
            {data.rows?.map((row) => (
              <DesktopRow key={row.engine} row={row} isDark={isDark} />
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:hidden">
          <div className="min-w-[850px]">
            <div className={`grid ${MOBILE_COLS} gap-px ${headerBg} px-3 py-2.5 text-[0.7rem] font-semibold leading-[1.2]`}>
              {data.columns?.map((col, index) => (
                <span
                  key={col}
                  className={`flex items-center gap-1.5 border-r last:border-r-0 ${
                    index === 0 ? "pr-4 pl-2" : index === 1 ? "pr-2 pl-4" : "px-3"
                  } ${headerDivider}`}
                >
                  <GenIcon name={COLUMN_ICONS[index]} className="h-3.5 w-3.5 shrink-0" />
                  {col}
                </span>
              ))}
            </div>
            <div className={bodyWrapperBg}>
              {data.rows?.map((row) => (
                <MobileRow key={row.engine} row={row} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:mt-5 md:grid-cols-[0.85fr_1.15fr] md:gap-4">
          {data.economicsRule ? (
            <div className="glass-panel flex items-center gap-4 rounded-md border border-[var(--color-primary)] p-3.5">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]">
                <HomeIcon name="scale" isDark={!isDark} className="h-12 w-12 object-contain" />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]"
                  dangerouslySetInnerHTML={{ __html: data.economicsRule.title }}
                />
                <p
                  className="mt-2 text-[0.85rem] leading-[1.5] text-[var(--color-text)]"
                  dangerouslySetInnerHTML={{ __html: data.economicsRule.text }}
                />
                {data.economicsRule.highlight ? (
                  <p
                    className="mt-2 text-[0.9rem] font-bold text-[var(--color-primary)]"
                    dangerouslySetInnerHTML={{ __html: data.economicsRule.highlight }}
                  />
                ) : null}
              </div>
            </div>
          ) : null}

          {data.keyTakeaways?.length > 0 ? (
            <div className="glass-panel rounded-md p-3.5">
              <p className="text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                Key Takeaways
              </p>
              <ul className="mt-2.5 flex flex-col gap-2.5">
                {data.keyTakeaways.map((item, index) => (
                  <li key={item.question} className="flex items-start gap-3 border-t border-[var(--color-border)] pt-3 first:border-t-0 first:pt-0">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                      <GenIcon name={takeawayIcons[index % takeawayIcons.length]} className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.85rem] font-semibold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: item.question }} />
                      <p className="text-[0.8rem] leading-[1.4] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
