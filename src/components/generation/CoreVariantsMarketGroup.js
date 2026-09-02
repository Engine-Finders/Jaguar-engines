"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import CoreVariants from "./CoreVariants";
import MarketIntelligence, { MarketIntelligenceSidebar } from "./MarketIntelligence";
import { generationSectionBg, resolveGenerationHeroAlt, resolveGenerationHeroImage } from "./generationSection";

function HeroSidebarImage({ hero, isDark, className = "" }) {
  const src = resolveGenerationHeroImage(hero, isDark);
  const alt = resolveGenerationHeroAlt(hero);

  return (
    <div
      className={`relative min-h-[320px] overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_10px_28px_var(--color-shadow)] ${className}`.trim()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-[68%_center]"
        sizes="(max-width: 1280px) 40vw, 420px"
      />
    </div>
  );
}

export default function CoreVariantsMarketGroup({ coreVariants, marketIntelligence, hero }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sectionBg = generationSectionBg(isDark, true);

  if (!coreVariants && !marketIntelligence) return null;

  return (
    <div className={`w-full overflow-x-hidden text-[var(--color-text)] ${sectionBg}`}>
      <div className="mx-auto w-full max-w-8xl px-4 md:px-8">
        {/* Mobile / tablet: stacked sections */}
        <div className="flex flex-col gap-0 pb-6 lg:hidden">
          {coreVariants ? <CoreVariants data={coreVariants} grouped /> : null}
          {coreVariants ? <HeroSidebarImage hero={hero} isDark={isDark} className="mb-5" /> : null}
          {marketIntelligence ? <MarketIntelligence data={marketIntelligence} grouped /> : null}
        </div>

        {/* Desktop: core variants + hero image, then market intel + live feed */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start lg:gap-6 lg:pb-6">
          {coreVariants ? (
            <CoreVariants data={coreVariants} grouped className="lg:col-start-1 lg:row-start-1" />
          ) : null}

          {coreVariants ? (
            <HeroSidebarImage hero={hero} isDark={isDark} className="lg:col-start-2 lg:row-start-1" />
          ) : null}

          {marketIntelligence ? (
            <MarketIntelligence
              data={marketIntelligence}
              grouped
              hideSidebar
              className="lg:col-start-1 lg:row-start-2"
            />
          ) : null}

          {marketIntelligence?.liveFeed?.length ? (
            <div className="lg:col-start-2 lg:row-start-2 lg:self-start">
              <MarketIntelligenceSidebar data={marketIntelligence} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
