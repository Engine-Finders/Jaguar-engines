"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";
import HomeIcon from "@/components/home/homeIcons";
import GenerationSectionHeader from "./GenerationSectionHeader";
import {
  generationSectionBg,
  primaryBadgeClass,
  splitTrustCtaH2,
} from "./generationSection";

const pointHomeIcons = ["genuine-failure-data", "honest-verdict", "uk-wide-delivery"];

function trustCardClass(isDark) {
  return [
    "glass-panel",
    "flex flex-col gap-2.5 overflow-hidden rounded-md p-4 backdrop-blur-xl backdrop-saturate-150 md:p-5",
    isDark
      ? "border-white/15 bg-[rgba(20,21,21,0.62)] shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
      : "border-[var(--color-glass-border)] bg-[rgba(255,255,255,0.58)] shadow-[0_12px_32px_rgba(17,18,16,0.1)]",
  ].join(" ");
}

export default function TrustCta({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const sectionBg = generationSectionBg(isDark, true);
  const title = splitTrustCtaH2(data.h2 || "Trust JaguarEngine.uk");
  const image = isDark ? "/320d/trust_dark.webp" : "/320d/trust_light.webp";

  return (
    <section className={`w-full overflow-x-hidden text-[var(--color-text)] ${sectionBg}`}>
      <GenerationSectionHeader title={title} subHeadline={data.subHeadline} isDark={isDark} sectionBg={sectionBg} />

      <div className="relative mx-auto w-full max-w-8xl px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5">
        {data.trustPoints?.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {data.trustPoints.map((point, index) => (
              <li key={point.title} className={trustCardClass(isDark)}>
                <div className="flex items-start gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${primaryBadgeClass(isDark)}`}>
                    <HomeIcon
                      name={pointHomeIcons[index % pointHomeIcons.length]}
                      isDark={!isDark}
                      className="h-6 w-6 object-contain"
                    />
                  </span>
                  <p className="min-w-0 flex-1 pt-1 text-[0.92rem] font-bold leading-snug text-[var(--color-text)] md:text-[0.95rem]" dangerouslySetInnerHTML={{ __html: point.title }} />
                </div>
                <p className="text-[0.83rem] leading-[1.45] text-[var(--color-text-muted)] md:text-[0.88rem]" dangerouslySetInnerHTML={{ __html: point.text }} />
              </li>
            ))}
          </ul>
        ) : null}

        {data.finalCta || data.ctaButton ? (
          <div className="relative mt-4 overflow-hidden rounded-md border border-[var(--color-glass-border)] md:mt-5">
            <div className="absolute inset-0 min-h-full">
              <Image src={image} alt="" fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 1280px" />
            </div>

            <div className="relative flex min-h-[180px] w-full items-center justify-center p-4 text-center sm:p-5 md:min-h-[200px] md:p-8">
              <div
                className={`glass-panel flex w-full max-w-[680px] flex-col items-center gap-3 overflow-hidden rounded-md border p-4 backdrop-blur-xl backdrop-saturate-150 sm:p-5 ${
                  isDark
                    ? "border-white/15 bg-[rgba(20,21,21,0.72)] shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
                    : "border-[var(--color-glass-border)] bg-[rgba(255,255,255,0.72)] shadow-[0_12px_32px_rgba(17,18,16,0.12)]"
                }`}
              >
                {data.finalCta ? (
                  <p
                    className={`w-full text-pretty text-[0.88rem] font-bold leading-[1.45] sm:text-[0.95rem] md:text-[1.1rem] md:leading-[1.4] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}
                    dangerouslySetInnerHTML={{ __html: data.finalCta }}
                  />
                ) : null}
                {data.ctaButton ? (
                  <a
                    href="/quote"
                    className="btn-cta flex w-full max-w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-[0.72rem] font-bold leading-snug shadow-[0_12px_28px_var(--color-shadow)] sm:text-[0.78rem] md:w-auto md:max-w-none md:whitespace-nowrap md:px-7 md:text-[0.8rem]"
                  >
                    <span className="min-w-0 text-center" dangerouslySetInnerHTML={{ __html: data.ctaButton.label.replace(/\s*→\s*$/, "") }} />
                    <GenIcon name="arrow" className="h-4 w-4 shrink-0" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
