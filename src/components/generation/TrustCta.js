"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";

const pointIcons = ["shield", "scale", "wrench"];

function TitleWithAccent({ title = "" }) {
  const markerIndex = title.indexOf(".uk");
  if (markerIndex === -1) return <span dangerouslySetInnerHTML={{ __html: title }} />;

  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: title.slice(0, markerIndex) }} />
      <span className="text-[var(--color-primary)]">.uk</span>
    </>
  );
}

export default function TrustCta({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const image = isDark ? "/e90/section11_dark.webp" : "/e90/section11_light.webp";
  const mobileImage = isDark ? "/e90/section11_mobile_dark.webp" : "/e90/section11_mobile_light.webp";
  const headingClass = isDark ? "text-white" : "text-[var(--color-text)]";
  const bodyTextClass = isDark ? "text-white/75" : "text-[var(--color-text-muted)]";
  const pointPanelClass = "glass-panel md:border-0 md:bg-transparent md:backdrop-blur-none";
  const ctaPanelClass = "glass-panel";
  const finalCtaTextClass = isDark ? "text-white/90" : "text-[var(--color-text)]";

  const trustPointsList = (
    <ul className="mt-6 flex flex-col gap-4">
      {data.trustPoints?.map((point, index) => (
        <li key={point.title} className={`flex items-start gap-3 rounded-md p-3 md:p-0 ${pointPanelClass}`}>
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] bg-transparent text-[var(--color-primary)]">
            <GenIcon name={point.icon || pointIcons[index % pointIcons.length]} className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className={`text-[0.95rem] font-semibold ${headingClass}`} dangerouslySetInnerHTML={{ __html: point.title }} />
            <p className={`text-[0.83rem] leading-[1.45] ${bodyTextClass}`} dangerouslySetInnerHTML={{ __html: point.text }} />
          </div>
        </li>
      ))}
    </ul>
  );

  const finalCtaBlock = data.finalCta || data.ctaButton ? (
    <div className={`mt-6 flex w-full flex-col items-start gap-4 rounded-md p-5 md:mt-auto md:flex-row md:items-center md:justify-between ${ctaPanelClass}`}>
      {data.finalCta ? (
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] text-[var(--color-primary)]">
            <GenIcon name="badge" className="h-4.5 w-4.5" />
          </span>
          <p className={`text-[0.88rem] leading-[1.45] ${finalCtaTextClass}`} dangerouslySetInnerHTML={{ __html: data.finalCta }} />
        </div>
      ) : null}
      {data.ctaButton ? (
        <a
          href="/quote"
          className="btn-cta flex w-full shrink-0 items-center justify-center gap-2 text-center rounded-md bg-[var(--color-primary)] px-5 py-3 text-[0.8rem] font-bold uppercase tracking-wide text-white shadow-[0_12px_28px_var(--color-shadow)] md:inline-flex md:w-auto md:whitespace-nowrap"
        >
          <span dangerouslySetInnerHTML={{ __html: data.ctaButton.label.replace(/\s*→\s*$/, "") }} />
          <GenIcon name="chevron" className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  ) : null;

  return (
    <section className="w-full bg-[var(--color-page)] text-[var(--color-text)]">
      {/* MOBILE: hero image up top in normal flow, seamlessly fading into the page background, content stacked below it */}
      <div className="py-8 md:hidden">
        <div className="relative -mb-px h-[260px] w-full overflow-hidden">
          <Image
            src={mobileImage}
            alt="BMW 3 Series E90 rear three-quarter view"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-[linear-gradient(180deg,transparent_40%,rgba(2,7,17,0.75)_75%,rgba(2,7,17,1)_97%)]"
                : "bg-[linear-gradient(180deg,transparent_40%,rgba(255,255,255,0.75)_75%,rgba(255,255,255,1)_97%)]"
            }`}
          />
          {/* Solid strip guarantees full opacity at the very edge - no sub-pixel seam from the gradient's asymptotic stop */}
          <div className="absolute inset-x-0 bottom-0 h-3 bg-[var(--color-page)]" />
        </div>

        <div className="px-4 pt-5">
          <h2 className="text-[2.15rem] font-bold leading-[1.1] tracking-normal">
            <TitleWithAccent title={data.h2} />
          </h2>
          <div className="mt-3">
            <MStripe />
          </div>

          {trustPointsList}
          {finalCtaBlock}
        </div>
      </div>

      {/* DESKTOP: full-bleed background image with content overlaid on top */}
      <div className="relative hidden w-full overflow-hidden md:block md:h-[420px] lg:h-[560px]">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt="BMW 3 Series E90 rear three-quarter view"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,17,0.9)_0%,rgba(2,7,17,0.55)_38%,transparent_75%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(2,7,17,0.65)_0%,transparent_28%)]" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.6)_38%,transparent_75%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.7)_0%,transparent_28%)]" />
            </>
          )}
        </div>

        <div className={`relative mx-auto flex h-full w-full max-w-8xl flex-col justify-start px-8 py-5 ${headingClass}`}>
          <div className="w-full max-w-[640px] md:max-w-[460px]">
            <h2 className={`text-[3rem] font-bold leading-[1.1] tracking-normal ${headingClass}`}>
              <TitleWithAccent title={data.h2} />
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>

            {trustPointsList}
          </div>

          {finalCtaBlock}
        </div>
      </div>
    </section>
  );
}
