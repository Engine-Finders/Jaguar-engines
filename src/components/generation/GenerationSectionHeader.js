"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { sectionDescription, sectionH2 } from "./generationSection";

const HEADER_IMAGE = "/home-image/sec2-bg.webp";

export default function GenerationSectionHeader({ title, subHeadline, isDark, sectionBg, showHeaderImage = true }) {
  const lightGradient = sectionBg?.includes("ececea")
    ? "absolute inset-0 bg-[linear-gradient(90deg,#ececea_0%,rgba(236,236,234,0.88)_34%,rgba(236,236,234,0.18)_100%)]"
    : "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(243,243,241,0.88)_34%,rgba(243,243,241,0.18)_100%)]";

  return (
    <div className={`relative overflow-hidden ${sectionBg}`}>
      {showHeaderImage ? (
        <div className="absolute inset-y-0 right-0 w-[62%] md:w-[48%]">
          <Image
            src={HEADER_IMAGE}
            alt=""
            fill
            className="object-cover object-right"
            sizes="(max-width: 768px) 62vw, 48vw"
          />
          <div
            className={
              isDark
                ? "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(11,12,12,0.82)_34%,rgba(11,12,12,0.18)_100%)]"
                : lightGradient
            }
          />
        </div>
      ) : null}
      <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-5 md:px-8 md:pb-4 md:pt-6">
        <div className="max-w-[650px]">
          <h2 className={`font-bold tracking-normal text-[var(--color-text)] ${sectionH2}`}>
            {title.main ? <span dangerouslySetInnerHTML={{ __html: title.main }} /> : null}
            {title.accent ? (
              <>
                {title.main ? <br /> : null}
                <span
                  className="text-[var(--color-chrome-bright)]"
                  dangerouslySetInnerHTML={{ __html: title.accent }}
                />
              </>
            ) : null}
          </h2>
          <div className="mt-2.5">
            <MStripe />
          </div>
          {subHeadline ? (
            <p
              className={`mt-2.5 max-w-[610px] text-[var(--color-text-muted)] ${sectionDescription}`}
              dangerouslySetInnerHTML={{ __html: subHeadline }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
