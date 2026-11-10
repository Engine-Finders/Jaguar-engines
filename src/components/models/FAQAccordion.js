"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { FileText, NumberGlyph } from "@/components/models/brandIcons";
import { useTheme } from "@/components/shared/themeProvider";
import { outsideTags } from "@/components/models/outsideTags";

/*
 * Model page FAQ (section 13), built from the 1536px reference: one card under the trust card, the title,
 * the questions in two columns (numbered black tile, question, chevron; each opens its answer), and the
 * "head-to-head comparison" bar. Phones: one column. Sizes share the --tr-* tokens with TrustBlock.
 */

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replace(/\s+/g, " ")
    .trim();
}

function typeset(text = "") {
  return outsideTags(cleanText(text), (part) =>
    part.replace(/(\d)\s*-\s*(£?\d)/g, "$1–$2").replace(/\s-\s/g, " — ").replace(/([A-Za-z])-([A-Za-z])/g, "$1‑$2"),
  );
}

// Old tool paths in the copy -> the live tool pages.
const TOOL_PATHS = { "/fault-diagnostic-calculator": "/tools/diagnostic-wizard" };

// Answers: "→ /path" becomes a real link (built before typesetting, so the address keeps its hyphens);
// [SOURCE] tags are set small; the old safe-verdict span is kept as bold.
function formatAnswer(text = "") {
  const links = [];
  const withTokens = cleanText(text).replace(/(?:Use our [^.→]*?)?\s*→\s*(\/[\w/-]+)\.?/g, (match, href) => {
    const label = /calculator/.test(match + href) ? "our diagnostic calculator" : "the guide";
    links.push(`<a href="${TOOL_PATHS[href] || href}" class="font-semibold underline underline-offset-2">Open ${label} →</a>`);
    return ` @@LINK${links.length - 1}@@`;
  });
  return typeset(withTokens)
    .replace(/\[([A-Z][A-Z‑-]+)\]/g, '<span class="whitespace-nowrap text-[0.85em] tracking-[0.02em] opacity-75">[$1]</span>')
    .replace(/<span class=["']safe-verdict["']>([\s\S]*?)<\/span>/gi, '<strong class="font-semibold">$1</strong>')
    .replace(/@@LINK(\d+)@@/g, (_, index) => links[Number(index)]);
}

function palette(isDark) {
  return isDark
    ? {
        text: "text-white",
        muted: "text-white/[0.75]",
        card: "border-white/[0.16] bg-[rgba(14,16,17,0.92)]",
        item: "border-white/[0.14] bg-white/[0.02] hover:border-white/[0.3]",
        open: "border-white/[0.32]",
        num: "bg-[#ececea] text-[#111210]",
        bar: "bg-white/[0.05]",
        tile: "border-white/[0.2] bg-white/[0.04]",
        btn: "btn-cta",
      }
    : {
        text: "text-[#111210]",
        muted: "text-[#2c2d2b]",
        card: "border-[#e8e8e5] bg-white shadow-[0_6px_20px_rgba(16,18,16,0.05)]",
        item: "border-[#e6e6e3] bg-white hover:border-[#c9cac6]",
        open: "border-[#b5b6b1]",
        num: "bg-[#111210] text-white",
        bar: "bg-[#f4f4f2]",
        tile: "border-[#d6d6d3] bg-white",
        btn: "bg-[linear-gradient(180deg,#2c2d2b_0%,#141514_100%)] text-white hover:shadow-[0_10px_24px_rgba(16,18,16,0.25)]",
      };
}

function FaqItem({ item, index, open, onToggle, tones }) {
  const id = `faq-answer-${index}`;
  return (
    <li className={`rounded-lg border transition-colors ${open ? tones.open : tones.item}`}>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="flex min-h-[48px] w-full items-center gap-3.5 px-3 py-2 text-left lg:min-h-[var(--tr-q-h)] lg:gap-[calc(var(--tr-num)*0.8)] lg:px-[calc(var(--tr-num)*0.55)] lg:py-1"
        >
          {index < 10 ? (
            // Brand number disc (black in light, silver in dark), 1-10
            <NumberGlyph value={index + 1} className="h-[26px] w-[26px] lg:h-[calc(var(--tr-num)*1.08)] lg:w-[calc(var(--tr-num)*1.08)]" />
          ) : (
            <span
              className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[12.5px] font-semibold lg:h-[calc(var(--tr-num)*1.08)] lg:w-[calc(var(--tr-num)*1.08)] ${tones.num}`}
            >
              {index + 1}
            </span>
          )}
          <span className="min-w-0 flex-1 text-[14.5px] font-medium leading-snug lg:text-[length:var(--tr-q)]" dangerouslySetInnerHTML={{ __html: typeset(item.question) }} />
          <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={1.6} />
        </button>
      </h3>
      {open ? (
        <div
          id={id}
          className={`px-3 pb-3.5 pl-[50px] text-[14px] leading-[1.6] lg:pl-[calc(var(--tr-num)*2.35)] lg:text-[length:calc(var(--tr-q)*0.95)] ${tones.muted}`}
          dangerouslySetInnerHTML={{ __html: formatAnswer(item.answer) }}
        />
      ) : null}
    </li>
  );
}

export default function FAQAccordion({ data }) {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState(-1);
  const items = (data?.items || []).filter((item) => cleanText(item.question) && cleanText(item.answer));
  if (!items.length) return null;

  const isDark = theme === "dark";
  const tones = palette(isDark);
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];
  const comparison = data.comparison;

  return (
    <section id="faq" className="model-trust relative bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-[1546px] px-4 pb-12 pt-4 sm:px-6 lg:px-[var(--tr-px)] lg:pb-[calc(var(--tr-gap)*3)] lg:pt-[var(--tr-gap)]">
        <div className={`rounded-xl border px-4 pb-4 pt-6 sm:px-6 lg:px-[var(--tr-card-px)] lg:pb-[var(--tr-bar-px)] lg:pt-[var(--tr-faq-pt)] ${tones.card} ${tones.text}`}>
          <h2 className={`model-faq-title ${tones.text}`} dangerouslySetInnerHTML={{ __html: typeset(data.h2) }} />

          <div className="mt-4 grid gap-[var(--tr-q-gap,6px)] lg:mt-[var(--tr-faq-mt)] lg:grid-cols-2 lg:gap-x-[var(--tr-q-col-gap)]">
            {columns.map((column, columnIndex) => (
              <ul key={columnIndex} className="grid content-start gap-1.5 lg:gap-[var(--tr-q-gap)]">
                {column.map((item, itemIndex) => {
                  const index = columnIndex * half + itemIndex;
                  return (
                    <FaqItem
                      key={item.id || item.question}
                      item={item}
                      index={index}
                      open={openIndex === index}
                      onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                      tones={tones}
                    />
                  );
                })}
              </ul>
            ))}
          </div>

          {comparison?.title ? (
            <div
              className={`mt-4 flex flex-col gap-4 rounded-lg px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:mt-[var(--tr-bar-mt)] lg:min-h-[var(--tr-bar-h)] lg:px-[var(--tr-bar-px)] lg:py-2 ${tones.bar}`}
            >
              <div className="flex items-center gap-4">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${tones.tile}`}>
                  <FileText aria-hidden="true" className="h-[55%] w-[55%]" strokeWidth={1.4} />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold leading-snug lg:text-[length:var(--tr-bar-title)]">{cleanText(comparison.title)}</p>
                  <p className={`mt-0.5 text-[13px] leading-snug lg:text-[length:var(--tr-bar-text)] ${tones.muted}`} dangerouslySetInnerHTML={{ __html: typeset(comparison.text) }} />
                </div>
              </div>
              {comparison.button?.href ? (
                <Link
                  href={comparison.button.href}
                  className={`inline-flex min-h-[46px] w-full shrink-0 items-center justify-center gap-5 rounded-md px-6 text-[15.5px] sm:w-auto !font-medium lg:min-h-[var(--tr-bar-btn-h)] lg:min-w-[290px] lg:text-[length:var(--tr-bar-btn)] ${tones.btn}`}
                >
                  {cleanText(comparison.button.label)}
                  <ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
