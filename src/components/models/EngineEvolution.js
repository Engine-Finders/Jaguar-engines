"use client";

import { useState } from "react";
import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { sectionDescription, sectionTableText, tableHeaderClass } from "@/components/models/sectionTypography";

const RIGHT_IMAGE = "/home-image/right.webp";

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Ã‚Â£", "\u00a3")
    .replaceAll("Â£", "\u00a3")
    .replaceAll("Ã¢â‚¬â€œ", "\u2013")
    .replaceAll("â€“", "\u2013")
    .replaceAll("Ã¢â‚¬â€", "\u2014")
    .replaceAll("â€”", "\u2014")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const dashIndex = clean.lastIndexOf(" - ");
  if (dashIndex !== -1) {
    return {
      main: clean.slice(0, dashIndex).trim(),
      accent: clean.slice(dashIndex + 3).trim(),
    };
  }

  const match = clean.match(/^(.*?)(\d{4}\s+to\s+Today)$/i);
  return {
    main: match ? match[1].trim() : clean,
    accent: match ? match[2] : "",
  };
}

function eraParts(era = "") {
  const clean = cleanText(era);
  const [lead, detail = ""] = clean.split(/\s+\u2014\s+| - /);
  return { lead: lead || clean, detail };
}

function engineList(value = "") {
  return cleanText(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildStats(eras = []) {
  const years = eras.map((era) => cleanText(era.years)).filter(Boolean);
  const engineCount = eras.reduce((count, era) => count + engineList(era.keyEngines).length, 0);
  const firstYear = years[0]?.match(/\d{4}/)?.[0] || "";
  const lastYear = years[years.length - 1] || "";

  return [
    {
      title: `${eras.length || 1} Era${eras.length === 1 ? "" : "s"}`,
      text: firstYear ? `${firstYear} to Present` : "Tracked generations",
      icon: "generations",
    },
    {
      title: `${engineCount || "—"} Key Engines`,
      text: "Across the timeline",
      icon: "engine",
    },
    {
      title: "Hardware Revisions",
      text: lastYear || "Facelift & updates",
      icon: "timeline",
    },
    {
      title: "Buyer Focused",
      text: "What changed & why",
      icon: "insight",
    },
  ];
}

function Stats({ eras, isDark }) {
  const items = buildStats(eras);

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-border)] shadow-[0_8px_24px_var(--color-shadow)] md:grid-cols-4 md:gap-0">
      {items.map((item) => (
        <div
          key={item.title}
          className="flex flex-col items-center justify-center bg-[var(--color-surface-raised)] px-1.5 py-2.5 text-center md:px-4 md:py-3.5"
        >
          <span className="flex h-10 w-10 items-center justify-center md:h-14 md:w-14">
            <HomeIcon name={item.icon} isDark={isDark} className="h-8 w-8 object-contain md:h-11 md:w-11" />
          </span>
          <strong className="mt-1.5 text-[12px] leading-tight text-[var(--color-text)] md:text-[15px]">
            {item.title}
          </strong>
          <span className="mt-0.5 text-[11px] leading-tight text-[var(--color-text-muted)] md:text-[13px]">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
}

function EngineList({ engines }) {
  const items = engineList(engines);

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 px-2">
      {items.map((engine) => (
        <strong
          key={engine}
          className={`text-center ${sectionTableText} text-[var(--color-text)]`}
          dangerouslySetInnerHTML={{ __html: engine }}
        />
      ))}
    </div>
  );
}

function DesktopTable({ eras, columns, isDark }) {
  return (
    <div className="hidden overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_8px_24px_var(--color-shadow)] md:block">
      <div className={`grid grid-cols-[19%_10%_26%_22%_23%] text-[14px] font-bold md:text-[15px] ${tableHeaderClass(isDark)}`}>
        {(columns || []).map((column) => (
          <div key={column} className="border-r border-white/20 px-4 py-2.5 last:border-r-0 md:px-5 md:py-3">
            {column}
          </div>
        ))}
      </div>
      {eras.map((era) => {
        const title = eraParts(era.era);

        return (
          <div
            key={era.era}
            className="grid grid-cols-[19%_10%_26%_22%_23%] border-t border-[var(--color-border)] text-[var(--color-text)]"
          >
            <div className="border-r border-[var(--color-border)] px-4 py-3 md:px-5 md:py-4">
              <h3 className="text-[17px] font-bold leading-tight text-[var(--color-text)] md:text-[19px]">
                <span dangerouslySetInnerHTML={{ __html: title.lead }} />
                {title.detail ? (
                  <>
                    <br />
                    <span
                      className="text-[var(--color-chrome-bright)]"
                      dangerouslySetInnerHTML={{ __html: title.detail }}
                    />
                  </>
                ) : null}
              </h3>
              <div className="relative mt-2 h-[72px] w-full overflow-hidden rounded-md md:h-[88px]">
                <Image src={RIGHT_IMAGE} alt="" fill className="object-cover object-center" sizes="220px" />
              </div>
            </div>
            <div
              className={`flex items-center justify-center border-r border-[var(--color-border)] px-3 py-3.5 font-heading text-[1.05rem] font-semibold md:px-4 md:py-4 ${sectionTableText}`}
            >
              {cleanText(era.years)}
            </div>
            <div className="flex items-center justify-center border-r border-[var(--color-border)] px-3 py-3.5 md:px-4 md:py-4">
              <EngineList engines={era.keyEngines} />
            </div>
            <p
              className={`border-r border-[var(--color-border)] px-4 py-4 leading-[1.45] text-[var(--color-text)] md:px-6 md:py-5 ${sectionTableText}`}
              dangerouslySetInnerHTML={{ __html: cleanText(era.whyBmwChanged) }}
            />
            <div className="flex gap-3 px-4 py-4 md:px-6 md:py-5">
              <span
                className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  isDark ? "bg-white/10" : "bg-[#ececeb]"
                }`}
              >
                <HomeIcon name="note" isDark={isDark} className="h-7 w-7 object-contain" />
              </span>
              <p
                className={`${sectionTableText} leading-[1.45] text-[var(--color-text)]`}
                dangerouslySetInnerHTML={{ __html: cleanText(era.worthKnowing) }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MobileDetailRow({ label, icon, children, isDark, bordered = true }) {
  return (
    <div
      className={`overflow-hidden p-3 ${bordered ? "border-b border-[var(--color-border)] last:border-b-0" : ""}`}
    >
      <HomeIcon
        name={icon}
        isDark={isDark}
        className="float-left mr-2.5 mb-1 h-7 w-7 object-contain"
      />
      <p className={`leading-[1.45] ${sectionTableText} text-[var(--color-text)]`}>
        <strong className="font-bold">{label}</strong>{" "}
        {children}
      </p>
    </div>
  );
}

function MobileAccordion({ eras, isDark }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3 md:hidden">
      {eras.map((era, index) => {
        const open = index === openIndex;
        const title = eraParts(era.era);

        return (
          <article
            key={era.era}
            className={`rounded-md border bg-[var(--color-surface-raised)] ${
              open ? "border-[var(--color-chrome)]" : "border-[var(--color-border)]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : index)}
              className="flex w-full items-center gap-4 p-4 text-left"
            >
              <span className="relative h-[64px] w-[96px] shrink-0 overflow-hidden rounded-md">
                <Image src={RIGHT_IMAGE} alt="" fill className="object-cover object-center" sizes="96px" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-[18px] leading-tight text-[var(--color-text)]">
                  {title.lead}
                  {title.detail ? ` - ${title.detail}` : ""}
                </strong>
                <span
                  className={`mt-1 block ${sectionTableText} text-[var(--color-text-muted)]`}
                  dangerouslySetInnerHTML={{ __html: cleanText(era.years) }}
                />
              </span>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  open
                    ? isDark
                      ? "bg-[var(--color-chrome)] text-[var(--color-page)]"
                      : "bg-black text-white"
                    : isDark
                      ? "bg-white/10"
                      : "bg-[#ececeb]"
                }`}
              >
                <HomeIcon
                  name={open ? "note" : "insight"}
                  isDark={open ? !isDark : isDark}
                  className="h-6 w-6 object-contain"
                />
              </span>
            </button>

            {open ? (
              <div className="mx-3 mb-3 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] md:mx-4 md:mb-4">
                <MobileDetailRow label="Key Engines" icon="engine" isDark={isDark}>
                  <span dangerouslySetInnerHTML={{ __html: cleanText(era.keyEngines) }} />
                </MobileDetailRow>
                <MobileDetailRow label="Why It Changed" icon="timeline" isDark={isDark}>
                  <span dangerouslySetInnerHTML={{ __html: cleanText(era.whyBmwChanged) }} />
                </MobileDetailRow>
                <MobileDetailRow label="Worth Knowing" icon="note" isDark={isDark} bordered={false}>
                  <span dangerouslySetInnerHTML={{ __html: cleanText(era.worthKnowing) }} />
                </MobileDetailRow>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export default function EngineEvolution({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const eras = data.eras || [];
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[var(--color-page)]";

  return (
    <section className={`overflow-x-hidden ${sectionBg} text-[var(--color-text)]`}>
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
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_600px] md:items-start">
            <div>
              <h2 className="max-w-[760px] text-[29px] font-bold leading-[1.08] tracking-normal md:text-[45px]">
                <span dangerouslySetInnerHTML={{ __html: title.main }} />
                {title.accent ? (
                  <>
                    <br />
                    <span
                      className="text-[var(--color-chrome-bright)]"
                      dangerouslySetInnerHTML={{ __html: title.accent }}
                    />
                  </>
                ) : null}
              </h2>
              <div className="mt-3">
                <MStripe />
              </div>
              <p className={`mt-3 max-w-[660px] ${sectionDescription} text-[var(--color-text-muted)]`}>
                {data.subHeadline
                  ? cleanText(data.subHeadline)
                  : "Follow each era of this model's engines — what launched, what was revised, and what buyers need to know before committing."}
              </p>
            </div>
            <Stats eras={eras} isDark={isDark} />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-8xl px-4 pb-5 pt-2 md:px-6 md:pb-6 md:pt-2.5 lg:px-8">
        <div className="mt-2">
          <DesktopTable eras={eras} columns={data.columns} isDark={isDark} />
          <MobileAccordion eras={eras} isDark={isDark} />
        </div>

        <div className="mt-3 flex max-w-[780px] items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2.5 text-[14px] text-[var(--color-text-muted)] md:px-5 md:py-3 md:text-[15px]">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              isDark ? "bg-white/10" : "bg-[#ececeb]"
            }`}
          >
            <HomeIcon name="database" isDark={isDark} className="h-6 w-6 object-contain" />
          </span>
          <p>
            Engine reliability insights and failure patterns are based on verified UK enquiry data.{" "}
            <span className="text-[var(--color-chrome-bright)]">[JAG-VERIFIED]</span>
          </p>
        </div>
      </div>
    </section>
  );
}
