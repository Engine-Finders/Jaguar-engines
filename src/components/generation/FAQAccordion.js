"use client";

import { useState } from "react";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";
import GenerationSectionHeader from "./GenerationSectionHeader";
import { generationSectionBg, indexBadgeClass, splitFaqH2 } from "./generationSection";

function FAQItem({ item, isOpen, onToggle, isDark }) {
  return (
    <div className="glass-panel overflow-hidden rounded-md">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[0.85rem] font-bold ${indexBadgeClass(isDark)}`}>
          {item.id}
        </span>
        <span className="flex-1 text-[0.92rem] font-semibold leading-snug text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: item.question }} />
        <GenIcon
          name="chevronDown"
          className={`h-4 w-4 shrink-0 transition-transform ${isDark ? "text-white/55" : "text-[#8a8a88]"} ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen ? (
        <p className="px-5 pb-4 pl-[60px] text-[0.85rem] leading-[1.55] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.answer }} />
      ) : null}
    </div>
  );
}

export default function FAQAccordion({ data }) {
  const { theme } = useTheme();
  const [openId, setOpenId] = useState(null);
  if (!data) return null;

  const isDark = theme === "dark";
  const sectionBg = generationSectionBg(isDark, true);
  const title = splitFaqH2(data.h2 || "Frequently Asked Questions");
  const items = data.items || [];
  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);

  return (
    <section className={`w-full overflow-x-hidden text-[var(--color-text)] ${sectionBg}`}>
      <GenerationSectionHeader title={title} subHeadline={data.subHeadline} isDark={isDark} sectionBg={sectionBg} />

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-5">
          <div className="flex flex-col gap-3">
            {left.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                isDark={isDark}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {right.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                isDark={isDark}
              />
            ))}
          </div>
        </div>

        {data.disclaimer ? (
          <p className="mt-4 text-[0.74rem] leading-[1.5] text-[var(--color-text-soft)] md:mt-5" dangerouslySetInnerHTML={{ __html: data.disclaimer }} />
        ) : null}
      </div>
    </section>
  );
}
