"use client";

import { useState } from "react";
import MStripe from "@/components/reusableComponents/MStripe";
import { sectionDescription, sectionH2, sectionTableText } from "@/components/models/sectionTypography";

const carImages = [
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=560&q=85",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=560&q=85",
  "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=560&q=85",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=560&q=85",
  "https://images.unsplash.com/photo-1617814076668-cccd5e772c97?auto=format&fit=crop&w=560&q=85",
  "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=560&q=85",
];

const statItems = [
  { title: "7 Generations", text: "1975 to Present", icon: "shieldPound" },
  { title: "25+ Engine Families", text: "From M10 to B58", icon: "gear" },
  { title: "50 Years of Engineering", text: "Performance & Innovation", icon: "chart" },
  { title: "Built for Drivers", text: "Reliability + Dynamics", icon: "award" },
];

function cleanText(text = "") {
  return String(text)
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
  const match = clean.match(/^(.*?)(\d{4}\s+to\s+Today)$/);
  return {
    main: match ? match[1].trim() : clean,
    accent: match ? match[2] : "",
  };
}

function eraParts(era = "") {
  const clean = cleanText(era);
  const [lead, detail = ""] = clean.split(/\s+\u2014\s+/);
  return { lead, detail };
}

function engineList(value = "") {
  return cleanText(value).split(",").map((item) => item.trim()).filter(Boolean);
}

function Icon({ type, className = "h-10 w-10" }) {
  const paths = {
    shieldPound: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm2.5 5.5A3 3 0 0 0 9 10v5m-2 0h7m-6-3h5" />,
    gear: <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0-5 1.3 2.2 2.5.7 2.2-1.2 1.8 3.1-1.9 1.7.1 2.6 1.8 1.8-1.8 3.1-2.4-.8-2.3 1.3L12 21l-1.3-2.5-2.3-1.3-2.4.8-1.8-3.1L6 13.1l.1-2.6-1.9-1.7L6 5.7l2.2 1.2 2.5-.7L12 3Z" />,
    chart: <path d="M5 19V9m5 10v-6m5 6V5m5 14H3m14-14h3v3" />,
    award: <path d="M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-3 0-1.5 7 4.5-2 4.5 2L15 14" />,
    engine: <path d="M3 12h3m12 0h3M7 9h10v6H7V9Zm2-3h6m-3 0V3M5 15v3m14-3v3M9 18h6" />,
    why: <path d="M12 4a8 8 0 1 0 7.4 5M12 8v5l3 2m4-11v5h-5" />,
    info: <path d="M12 17v-6m0-4h.01M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z" />,
    file: <path d="M6 3h9l4 4v14H6V3Zm9 0v5h5M9 13h7M9 17h7" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    chevronUp: <path d="m6 15 6-6 6 6" />,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      {paths[type] || paths.info}
    </svg>
  );
}

function Stats() {
  return (
      <div className="grid grid-cols-4 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_8px_24px_var(--color-shadow)]">
      {statItems.map((item) => (
        <div key={item.title} className="flex flex-col items-center justify-center border-r border-[var(--color-border)] px-1.5 py-3 text-center last:border-r-0 md:px-4 md:py-3.5">
          <span className="text-[var(--color-primary)]">
            <Icon type={item.icon} className="h-8 w-8 md:h-9 md:w-9" />
          </span>
          <strong className="mt-1.5 text-[13px] leading-tight text-[var(--color-text)] md:text-[15px]">{item.title}</strong>
          <span className="mt-0.5 text-[12px] leading-tight text-[var(--color-text-muted)] md:text-[13px]">{item.text}</span>
        </div>
      ))}
    </div>
  );
}

function EngineBadges({ engines }) {
  const items = engineList(engines);

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {items.map((engine) => (
        <div key={engine} className="flex min-w-[68px] flex-col items-center">
          <span className="flex h-14 w-16 items-center justify-center rounded-md bg-[var(--color-page-soft)] text-[var(--color-primary)] md:h-16 md:w-20">
            <Icon type="engine" className="h-8 w-8" />
          </span>
          <strong className="mt-1 text-[15px] text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: engine }} />
        </div>
      ))}
    </div>
  );
}

function DesktopTable({ eras, columns }) {
  return (
      <div className="hidden overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_8px_24px_var(--color-shadow)] md:block">
      <div className="grid grid-cols-[19%_10%_26%_22%_23%] bg-[var(--color-primary-strong)] text-[14px] font-bold text-white md:text-[15px]">
        {(columns || []).map((column) => (
          <div key={column} className="border-r border-white/20 px-4 py-2.5 last:border-r-0 md:px-5 md:py-3">
            {column}
          </div>
        ))}
      </div>
      {eras.map((era, index) => {
        const title = eraParts(era.era);

        return (
          <div key={era.era} className="grid grid-cols-[19%_10%_26%_22%_23%] border-t border-[var(--color-border)] text-[var(--color-text)]">
            <div className="border-r border-[var(--color-border)] px-4 py-3 md:px-5 md:py-4">
              <h3 className="text-[17px] font-bold leading-tight text-[var(--color-primary)] md:text-[19px]">
                <span dangerouslySetInnerHTML={{ __html: title.lead }} />
                {title.detail ? (
                  <>
                    <br />
                    <span dangerouslySetInnerHTML={{ __html: title.detail }} />
                  </>
                ) : null}
              </h3>
              <img src={carImages[index] || carImages[0]} alt="" className="mt-2 h-[66px] w-full object-cover object-center md:h-[78px]" loading="lazy" />
            </div>
            <div className={`flex items-center justify-center border-r border-[var(--color-border)] px-3 py-3.5 ${sectionTableText} font-bold md:px-4 md:py-4`}>{cleanText(era.years)}</div>
            <div className="flex items-center justify-center border-r border-[var(--color-border)] px-3 py-3.5 md:px-4 md:py-4">
              <EngineBadges engines={era.keyEngines} />
            </div>
            <p className={`border-r border-[var(--color-border)] px-4 py-4 ${sectionTableText} leading-[1.45] text-[var(--color-text)] md:px-6 md:py-5`} dangerouslySetInnerHTML={{ __html: cleanText(era.whyBmwChanged) }} />
            <div className="flex gap-3 px-4 py-4 md:px-6 md:py-5">
              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] text-[var(--color-primary)]">
                <Icon type="info" className="h-5 w-5" />
              </span>
              <p className={`${sectionTableText} leading-[1.45] text-[var(--color-text)]`} dangerouslySetInnerHTML={{ __html: cleanText(era.worthKnowing) }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MobileAccordion({ eras }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3 md:hidden">
      {eras.map((era, index) => {
        const open = index === openIndex;
        const title = eraParts(era.era);

        return (
          <article key={era.era} className={`rounded-md border bg-[var(--color-surface-raised)] ${open ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"}`}>
            <button type="button" onClick={() => setOpenIndex(open ? -1 : index)} className="flex w-full items-center gap-4 p-4 text-left">
              <img src={carImages[index] || carImages[0]} alt="" className="h-[60px] w-[94px] shrink-0 object-cover object-center md:h-[72px] md:w-[110px]" loading="lazy" />
              <span className="min-w-0 flex-1">
                <strong className="block text-[18px] leading-tight text-[var(--color-primary)] md:text-[20px]">{title.lead}{title.detail ? ` - ${title.detail}` : ""}</strong>
                <span className={`mt-1 block ${sectionTableText} text-[var(--color-text-muted)]`} dangerouslySetInnerHTML={{ __html: cleanText(era.years) }} />
              </span>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${open ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"}`}>
                <Icon type={open ? "chevronUp" : "chevron"} className="h-6 w-6" />
              </span>
            </button>

            {open ? (
              <div className="mx-4 mb-4 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
                <div className="grid grid-cols-[36%_64%] border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-3 border-r border-[var(--color-border)] p-4 font-bold">
                    <span className="text-[var(--color-primary)]"><Icon type="engine" className="h-8 w-8" /></span>
                    Key Engines
                  </div>
                  <div className={`p-4 ${sectionTableText} text-[var(--color-text)]`} dangerouslySetInnerHTML={{ __html: cleanText(era.keyEngines) }} />
                </div>
                <div className="grid grid-cols-[36%_64%] border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-3 border-r border-[var(--color-border)] p-4 font-bold">
                    <span className="text-[var(--color-primary)]"><Icon type="why" className="h-8 w-8" /></span>
                    Why BMW Changed
                  </div>
                  <div className={`p-4 ${sectionTableText} leading-[1.45] text-[var(--color-text)]`} dangerouslySetInnerHTML={{ __html: cleanText(era.whyBmwChanged) }} />
                </div>
                <div className="grid grid-cols-[36%_64%]">
                  <div className="flex items-center gap-3 border-r border-[var(--color-border)] p-4 font-bold">
                    <span className="text-[var(--color-primary)]"><Icon type="info" className="h-8 w-8" /></span>
                    Worth Knowing
                  </div>
                  <div className={`p-4 ${sectionTableText} leading-[1.45] text-[var(--color-text)]`} dangerouslySetInnerHTML={{ __html: cleanText(era.worthKnowing) }} />
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export default function EngineEvolution({ data }) {
  if (!data) return null;

  const title = splitTitle(data.h2);
  const eras = data.eras || [];

  return (
    <section className="bg-[var(--color-page)] py-6 text-[var(--color-text)]">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_600px] md:items-start">
        <div>
        <h2 className="max-w-[760px] text-[29px] font-bold leading-[1.08] tracking-normal md:text-[45px]">
            <span dangerouslySetInnerHTML={{ __html: title.main }} />
            {title.accent ? <span className="text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: title.accent }} /> : null}
          </h2>
          <div className="mt-3">
            <MStripe />
          </div>
          <p className={`mt-3 max-w-[660px] ${sectionDescription} text-[var(--color-text-muted)]`}>
            From the original M10 to today&apos;s advanced B-series, explore how engineering, emissions and performance shaped every generation of 3 Series engines.
          </p>
        </div>
        <Stats />
      </div>

      <div className="mt-6">
        <DesktopTable eras={eras} columns={data.columns} />
        <MobileAccordion eras={eras} />
      </div>

      <div className="mt-3 flex max-w-[780px] items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2.5 text-[14px] text-[var(--color-text-muted)] md:px-5 md:py-3 md:text-[15px]">
        <span className="shrink-0 text-[var(--color-primary)]">
          <Icon type="file" className="h-6 w-6 md:h-7 md:w-7" />
        </span>
        <p>
          All engine reliability insights and failure patterns are based on 826+ verified enquiries in 2025. Data covers the UK market.{" "}
          <span className="text-[var(--color-primary)]">[BMW-VERIFIED]</span>
        </p>
      </div>
    </section>
  );
}
