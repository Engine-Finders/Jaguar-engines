"use client";

import { useTheme } from "@/components/shared/themeProvider";
import CarOnBackground from "@/components/shared/CarOnBackground";
import CoreVariants from "./CoreVariants";
import MarketIntelligence, { MarketIntelligenceSidebar } from "./MarketIntelligence";
import { generationSectionBg } from "./generationSection";

// This generation's side-view photo (set server-side) on Jaguar's own background.
function SidebarCarImage({ image, isDark, className = "" }) {
  return (
    <CarOnBackground
      src={image}
      isDark={isDark}
      className={`relative min-h-[320px] rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_10px_28px_var(--color-shadow)] ${className}`.trim()}
      carClassName="inset-x-[6%] bottom-[10%] top-[30%]"
      sizes="(max-width: 1280px) 90vw, 520px"
    />
  );
}

export default function CoreVariantsMarketGroup({ coreVariants, marketIntelligence }) {
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
          {coreVariants ? <SidebarCarImage image={coreVariants.image} isDark={isDark} className="mb-5" /> : null}
          {marketIntelligence ? <MarketIntelligence data={marketIntelligence} grouped /> : null}
        </div>

        {/* Desktop: core variants + car photo, then market intel + live feed */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start lg:gap-6 lg:pb-6">
          {coreVariants ? (
            <CoreVariants data={coreVariants} grouped className="lg:col-start-1 lg:row-start-1" />
          ) : null}

          {coreVariants ? (
            <SidebarCarImage image={coreVariants.image} isDark={isDark} className="lg:col-start-2 lg:row-start-1" />
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
