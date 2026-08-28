"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "../generation/GenIcons";
import { variantSectionBg, splitSectionH2 } from "./variantSection";

function splitHeadline(headline = "") {
  const cleaned = headline.replace(/\s*→\s*$/, "");
  const qIndex = cleaned.indexOf("? ");
  if (qIndex === -1) return { title: cleaned, subtitle: "" };
  return { title: cleaned.slice(0, qIndex + 1), subtitle: cleaned.slice(qIndex + 2) };
}

export default function QuotesCta({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const image = isDark ? "/320d/compare_dark.webp" : "/320d/compare_light.webp";
  const { title, subtitle } = splitHeadline(data.headline);
  const headlineParts = splitSectionH2(title);
  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyTextClass = isDark ? "text-white/80" : "text-[var(--color-text-muted)]";

  return (
    <section className={`w-full overflow-x-hidden py-5 md:py-6 ${variantSectionBg(isDark, true)}`}>
      <div className="mx-auto w-full max-w-8xl px-4 md:px-8">
      {/* Mobile: no background photo, plain surface card. Desktop: unchanged full-bleed photo card. */}
      <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:bg-[var(--color-page)] md:p-10">
        <div className="absolute inset-0 hidden md:block">
          <Image src={image} alt="BMW 320d" fill className="object-cover object-right" sizes="100vw" />
          {isDark ? (
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,12,12,0.95)_0%,rgba(11,12,12,0.75)_45%,rgba(11,12,12,0.15)_85%)]" />
          ) : null}
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-3 md:max-w-[55%]">
            <div>
              <h2 className={`text-[1.6rem] font-bold leading-[1.15] md:text-[2.1rem] ${headingClass}`}>
                {headlineParts.before ? <span dangerouslySetInnerHTML={{ __html: headlineParts.before }} /> : null}
                {headlineParts.accent ? (
                  <>
                    {headlineParts.before ? " " : null}
                    <span className="text-[var(--color-chrome-bright)]" dangerouslySetInnerHTML={{ __html: headlineParts.accent }} />
                  </>
                ) : null}
              </h2>
              {subtitle ? (
                <p className={`mt-1 flex items-center gap-1.5 text-[0.95rem] font-semibold leading-[1.3] text-[var(--color-primary)] md:text-[1.1rem]`}>
                  {subtitle}
                  <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
                </p>
              ) : null}
            </div>

            {data.supportingLine ? (
              <p className={`text-[0.88rem] leading-[1.5] ${bodyTextClass}`} dangerouslySetInnerHTML={{ __html: data.supportingLine }} />
            ) : null}

            {data.button ? (
              <a
                href="/quote"
                className="btn-cta mt-1 flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#189454] px-4 py-2.5 text-center text-[0.76rem] font-bold text-white no-underline shadow-[0_12px_28px_rgba(0,0,0,0.35)] md:w-fit md:px-6 md:py-3.5 md:text-[0.85rem]"
              >
                {data.button.label.replace(/\s*→\s*$/, "")}
                <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
