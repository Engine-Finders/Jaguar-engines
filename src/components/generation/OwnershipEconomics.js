"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "./GenIcons";

const verdictStyles = {
  warning: { icon: "warning", light: "text-[#d97517]", dark: "text-[#ffb05a]" },
  success: { icon: "check", light: "text-[#13884a]", dark: "text-[#67d99a]" },
  danger: { icon: "warning", light: "text-[#db2e2e]", dark: "text-[#ff8b90]" },
  info: { icon: "info", light: "text-[var(--color-primary)]", dark: "text-[var(--color-text)]" },
};

function VerdictPill({ verdictType, text, isDark }) {
  const style = verdictStyles[verdictType] || verdictStyles.info;
  const iconColor = isDark ? style.dark : style.light;
  const textColor = isDark ? "text-white" : "text-black";

  return (
    <span className={`inline-flex items-start gap-2 text-[0.78rem] leading-[1.25] ${textColor}`}>
      <GenIcon name={style.icon} className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} />
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
      className={`grid grid-cols-[110px_100px_1fr_130px_150px_1.4fr] items-center gap-px ${rowClass} px-5 py-3.5 text-[0.85rem] border-b ${borderBottom} last:border-b-0`}
    >
      <span className={`px-3 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.engine }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.typicalMileage }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.commonMajorFailure }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.repairCostSpecialist }} />
      <span className={`px-3 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.replacementCostRecon }} />
      <div className="pl-3">
        <VerdictPill verdictType={row.verdictType} text={row.ownershipVerdict} isDark={isDark} />
      </div>
    </div>
  );
}

const MOBILE_COLS = "grid-cols-[90px_90px_140px_110px_120px_220px]";

function MobileRow({ row, isDark }) {
  const rowClass = isDark
    ? "bg-black text-white"
    : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]";

  return (
    <div
      className={`grid ${MOBILE_COLS} items-center gap-px ${rowClass} px-3 py-3 text-[0.72rem] leading-[1.3] border-b ${borderBottom} last:border-b-0`}
    >
      <span className={`px-2 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.engine }} />
      <span className={`px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.typicalMileage }} />
      <span className={`px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.commonMajorFailure }} />
      <span className={`px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.repairCostSpecialist }} />
      <span className={`px-2 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.replacementCostRecon }} />
      <div className="pl-2">
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
  const headerBg = isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]";
  const headerDivider = isDark ? "border-white/20" : "border-white/25";
  const bodyWrapperBg = isDark ? "bg-black" : "bg-[var(--color-table-surface)]";
  const headerImage = isDark ? "/e90/engine_replacement_dark.webp" : "/e90/engine_replacement_light.webp";
  const headerImageMobile = isDark ? "/e90/engine_replacement_mobile_dark.webp" : "/e90/engine_replacement_mobile_light.webp";
  const headerHeadingClass = isDark ? "text-white" : "text-[var(--color-text)]";

  return (
    <section className="w-full bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 hidden md:block">
          <Image src={headerImage} alt="" fill className="object-cover" sizes="100vw" priority />
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,17,0.9)_0%,rgba(2,7,11,0.72)_32%,transparent_60%)]" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(0deg,rgba(2,7,17,0.65)_0%,transparent_100%)]" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.72)_32%,transparent_60%)]" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(0deg,rgba(255,255,255,0.65)_0%,transparent_100%)]" />
            </>
          )}
        </div>

        <div className="relative -mb-px h-[200px] w-full overflow-hidden md:hidden">
          <Image src={headerImageMobile} alt="" fill className="object-cover" sizes="100vw" priority />
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-[linear-gradient(180deg,transparent_55%,rgba(2,7,17,1)_97%)]"
                : "bg-[linear-gradient(180deg,transparent_55%,rgba(255,255,255,1)_97%)]"
            }`}
          />
          {/* Solid strip guarantees full opacity at the very edge - no sub-pixel seam from the gradient's asymptotic stop */}
          <div className="absolute inset-x-0 bottom-0 h-3 bg-[var(--color-page)]" />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-4 py-6 md:px-8 md:py-10">
          <h2
            className={`max-w-[720px] text-[2.15rem] font-bold leading-[1.1] tracking-normal md:text-[3rem] ${headerHeadingClass}`}
            dangerouslySetInnerHTML={{ __html: data.h2 }}
          />
          <div className="mt-3">
            <MStripe />
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">

        <div className="mt-6 hidden overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:block">
          <div className={`grid grid-cols-[110px_100px_1fr_130px_150px_1.4fr] gap-px ${headerBg} px-5 py-3 text-[0.82rem] font-semibold text-white`}>
            {data.columns?.map((col, index) => (
              <span key={col} className={`flex items-center gap-2 px-3 border-r ${headerDivider} last:border-r-0`}>
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

        <div className="mt-6 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:hidden">
          <div className="min-w-[850px]">
            <div className={`grid ${MOBILE_COLS} gap-px ${headerBg} px-3 py-2.5 text-[0.7rem] font-semibold leading-[1.2] text-white`}>
              {data.columns?.map((col, index) => (
                <span key={col} className={`flex items-center gap-1.5 px-2 border-r ${headerDivider} last:border-r-0`}>
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

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[0.85fr_1.15fr]">
          {data.economicsRule ? (
            <div className="flex items-center gap-4 rounded-md border border-[var(--color-primary)] bg-[var(--color-primary-soft)] p-3.5">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                <GenIcon name="scale" className="h-10 w-10" />
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
