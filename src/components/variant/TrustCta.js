"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "../generation/GenIcons";

const pointIcons = ["shield", "scale", "truck"];

// Generic trust guarantees, not tied to page-specific copy — same 5 columns
// regardless of which variant page this renders on.
const TICKER_ITEMS = [
  { icon: "tag", title: "100% Free", text: "No hidden fees" },
  { icon: "check", title: "No Obligation", text: "Get quotes with zero pressure" },
  { icon: "users", title: "UK Specialists", text: "20+ vetted experts" },
  { icon: "shield", title: "12-Month Warranty", text: "As standard" },
  { icon: "truck", title: "Nationwide Delivery", text: "Supply & fit available" },
];

export default function TrustCta({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const image = isDark ? "/320d/trust_dark.webp" : "/320d/trust_light.webp";
  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyTextClass = isDark ? "text-white/80" : "text-[var(--color-text-muted)]";

  return (
    <section className="w-full bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <h2 className="max-w-[720px] text-[2.15rem] font-bold leading-[1.1] tracking-normal md:text-[3rem]">{data.h2}</h2>
        <div className="mt-3">
          <MStripe />
        </div>

        {data.trustPoints?.length > 0 ? (
          <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {data.trustPoints.map((point, index) => (
              <li key={point.title} className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                  <GenIcon name={point.icon || pointIcons[index % pointIcons.length]} className="h-5.5 w-5.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[1.02rem] font-bold leading-snug text-[var(--color-text)]">{point.title}</p>
                  <p className="mt-2.5 text-[0.85rem] leading-relaxed text-[var(--color-text-muted)] md:text-[0.9rem]" dangerouslySetInnerHTML={{ __html: point.text }} />
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {data.finalCta || data.ctaButton ? (
          <div className="relative mt-6 overflow-hidden rounded-xl border border-[var(--color-border)]">
            <div className="absolute inset-0">
              <Image src={image} alt="BMW 320d" fill className="object-cover" sizes="100vw" />
            </div>

            <div className="relative flex w-full flex-col items-center gap-4 p-5 text-center md:min-h-[200px] md:flex-row md:justify-center md:p-8">
              <div className="flex max-w-[520px] flex-col items-center gap-3">
                {data.finalCta ? (
                  <p className={`text-[1rem] font-bold leading-[1.4] md:text-[1.2rem] ${headingClass}`} dangerouslySetInnerHTML={{ __html: data.finalCta }} />
                ) : null}
                {data.ctaButton ? (
                  <a
                    href="/quote"
                    className="btn-cta flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#189454] px-4 py-2.5 text-center text-[0.74rem] font-bold text-white no-underline shadow-[0_12px_28px_rgba(0,0,0,0.35)] md:w-auto md:px-6 md:py-3 md:text-[0.8rem]"
                  >
                    {data.ctaButton.label.replace(/\s*→\s*$/, "")}
                    <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          {/* Mobile: 2-per-row with a floating vertical divider between columns and a horizontal divider between rows */}
          <div className="flex flex-col lg:hidden">
            {Array.from({ length: Math.ceil(TICKER_ITEMS.length / 2) }, (_, row) => {
              const pair = TICKER_ITEMS.slice(row * 2, row * 2 + 2);
              return (
                <div
                  key={row}
                  className={`flex items-stretch py-2.5 first:pt-0 last:pb-0 ${row > 0 ? "border-t border-[var(--color-border)]" : ""}`}
                >
                  {pair.map((item, i) => (
                    <div key={item.title} className="flex flex-1 items-stretch">
                      {i > 0 ? (
                        <span aria-hidden="true" className="mx-3 my-1 w-px shrink-0 self-center bg-[var(--color-border)]" style={{ height: "70%" }} />
                      ) : null}
                      <div className="flex flex-1 items-center gap-2.5">
                        <GenIcon name={item.icon} className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
                        <div className="min-w-0">
                          <p className="text-[0.8rem] font-semibold leading-tight text-[var(--color-text)]">{item.title}</p>
                          <p className="text-[0.7rem] leading-tight text-[var(--color-text-muted)]">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Desktop: single row, floating vertical dividers between every item */}
          <div className="hidden lg:flex lg:items-stretch">
            {TICKER_ITEMS.map((item, index) => (
              <div key={item.title} className="flex flex-1 items-stretch">
                {index > 0 ? (
                  <span aria-hidden="true" className="mx-3 my-1 w-px shrink-0 self-center bg-[var(--color-border)]" style={{ height: "70%" }} />
                ) : null}
                <div className="flex items-center gap-2.5">
                  <GenIcon name={item.icon} className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
                  <div className="min-w-0">
                    <p className="text-[0.8rem] font-semibold leading-tight text-[var(--color-text)]">{item.title}</p>
                    <p className="text-[0.7rem] leading-tight text-[var(--color-text-muted)]">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
