"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "../generation/GenIcons";

const ITEM_ICONS = ["warning", "gauge", "dollar", "tag", "clock", "chart"];
const UK_REGIONS_GEO = "/320d/uk-regions-topo.json";

// England's 9 electoral regions (used as a stand-in for Government Office
// Regions — free boundary file, see martinjc/UK-GeoJSON). Any region not
// explicitly called out in the data rolls up into the "Other Regions" share.
const NAMED_REGIONS = ["London", "South East", "North West"];

function parseRegionalDemand(value = "") {
  const tagMatch = value.match(/\s*\[([^\]]+)\]\s*$/);
  const tag = tagMatch ? tagMatch[1] : "";
  const clean = tagMatch ? value.slice(0, tagMatch.index) : value;
  const regions = clean
    .split(",")
    .map((part) => {
      const match = part.trim().match(/^(.*?)\s*\(([^)]+)\)$/);
      return match ? { name: match[1].trim(), share: match[2].trim() } : { name: part.trim(), share: "" };
    })
    .filter((region) => region.name);
  return { regions, tag };
}

// Bubble positions approximate where each named region sits on the England map,
// so the label doesn't have to be squeezed inside the (often narrow) region shape.
const BUBBLE_POSITION = {
  London: "right-[10%] top-[58%]",
  "South East": "right-0 top-[74%]",
  "North West": "left-0 top-[22%]",
  "Other Regions": "left-[6%] bottom-0",
};

// Connector line endpoints (percent of the map container) — start is the edge
// of each bubble facing the map, end is roughly where that region sits on it.
const CONNECTOR_LINE = {
  London: { x1: 78, y1: 62, x2: 61, y2: 56 },
  "South East": { x1: 88, y1: 76, x2: 66, y2: 68 },
  "North West": { x1: 12, y1: 26, x2: 36, y2: 22 },
  "Other Regions": { x1: 18, y1: 92, x2: 42, y2: 78 },
};

// Splits a combined metric string like "N47 rear timing chain - approximately 65% of
// pre-2016 320d enquiries [PATTERN DATA]" into a headline stat ("65%"), an optional
// title line ("N47 rear timing chain"), descriptive subtext, and the trailing tag.
function parseMetric(value = "") {
  const tagMatch = value.match(/\s*\[([^\]]+)\]\s*$/);
  const tag = tagMatch ? tagMatch[1] : "";
  const clean = (tagMatch ? value.slice(0, tagMatch.index) : value).trim();

  const numberLead = /^(?:approximately\s+)?(£[\d,.]+|[\d,.]+%|[\d,.]+)\s*(.*)$/i;

  const dashIndex = clean.indexOf(" - ");
  if (dashIndex !== -1) {
    const left = clean.slice(0, dashIndex).trim();
    const right = clean.slice(dashIndex + 3).trim();
    const rightMatch = right.match(numberLead);
    if (rightMatch) {
      return { title: left, stat: rightMatch[1], subtext: rightMatch[2].trim(), tag };
    }
    return { title: "", stat: left, subtext: right, tag };
  }

  const leadMatch = clean.match(numberLead);
  if (leadMatch && /^[\d£]/.test(clean)) {
    return { title: "", stat: leadMatch[1], subtext: leadMatch[2].trim(), tag };
  }
  return { title: "", stat: clean, subtext: "", tag };
}

function regionShare(regions, name) {
  const match = regions.find((region) => region.name === name);
  if (!match) return 0;
  const num = parseFloat(match.share);
  return Number.isNaN(num) ? 0 : num;
}

function fillForRegionGeoName(geoName, regions) {
  const isNamed = NAMED_REGIONS.includes(geoName);
  const share = isNamed ? regionShare(regions, geoName) : regionShare(regions, "Other Regions") / 6;
  // 0-25% share maps to a light-to-strong primary blue fill.
  const intensity = Math.min(share / 25, 1);
  const alpha = 0.18 + intensity * 0.65;
  return `rgba(11, 103, 220, ${alpha.toFixed(2)})`;
}

function RegionalDemandMap({ regions }) {
  const otherShare = regionShare(regions, "Other Regions");
  const bubbleRegions = [
    ...regions.filter((region) => NAMED_REGIONS.includes(region.name)),
    ...(otherShare ? [{ name: "Other Regions", share: `${otherShare}%` }] : []),
  ];

  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-[0.85rem] font-bold uppercase tracking-wide text-[var(--color-text)]">Regional Demand Breakdown</p>
      <div className="relative mt-4 min-h-[320px] w-full flex-1">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-1.8, 52.7], scale: 3200 }}
          className="absolute inset-0 h-full w-full"
        >
          <Geographies geography={UK_REGIONS_GEO}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.EER13NM;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillForRegionGeoName(name, regions)}
                    stroke="var(--color-surface)"
                    strokeWidth={0.75}
                    style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-[5] h-full w-full">
          {bubbleRegions.map((region) => {
            const line = CONNECTOR_LINE[region.name];
            if (!line) return null;
            const midX = (line.x1 + line.x2) / 2;
            const midY = Math.min(line.y1, line.y2) - 6;
            return (
              <path
                key={region.name}
                d={`M ${line.x1} ${line.y1} Q ${midX} ${midY} ${line.x2} ${line.y2}`}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="0.6"
                strokeLinecap="round"
                opacity="0.55"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {bubbleRegions.map((region) => (
          <div
            key={region.name}
            className={`absolute flex aspect-square h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-surface)] p-1 text-center shadow-[0_8px_20px_var(--color-shadow)] md:h-20 md:w-20 md:p-1.5 ${BUBBLE_POSITION[region.name] || ""}`}
          >
            <span className="text-[0.68rem] font-bold leading-none text-[var(--color-primary)] md:text-[0.95rem]">{region.share}</span>
            <span className="mt-1 text-[0.48rem] leading-[1.1] text-[var(--color-text-muted)] md:text-[0.6rem]">{region.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketIntelligence({ data }) {
  if (!data) return null;

  const items = data.items || [];
  const regionalItem = items.find((item) => item.label === "Regional Demand");
  const { regions, tag } = regionalItem ? parseRegionalDemand(regionalItem.value) : { regions: [], tag: "" };

  return (
    <section className="w-full border-t border-[var(--color-border)] bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="text-[2.15rem] font-bold leading-[1.1] tracking-normal md:text-[3rem]">
              Market Intelligence
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>

            {items.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
                {items.map((item, index) => {
                  if (item.label === "Regional Demand") {
                    return (
                      <div key={item.label} className="glass-panel flex flex-col gap-2 rounded-md p-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                            <GenIcon name="chart" className="h-4.5 w-4.5" />
                          </span>
                          <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">{item.label}</p>
                        </div>
                        <div className="flex flex-col">
                          {regions.map((region) => (
                            <div key={region.name} className="flex items-center justify-between border-t border-[var(--color-border)] py-1.5 first:border-t-0 first:pt-0">
                              <span className="text-[0.78rem] text-[var(--color-text-muted)]">{region.name}</span>
                              <span className="text-[0.8rem] font-semibold text-[var(--color-text)]">{region.share}</span>
                            </div>
                          ))}
                        </div>
                        {tag ? <p className="text-[0.62rem] font-semibold uppercase tracking-wide text-[var(--color-text-soft)]">{tag}</p> : null}
                      </div>
                    );
                  }
                  const { title, stat, subtext, tag: metricTag } = parseMetric(item.value);
                  return (
                    <div key={item.label} className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                          <GenIcon name={ITEM_ICONS[index % ITEM_ICONS.length]} className="h-5 w-5" />
                        </span>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <p className="text-[0.7rem] font-medium text-[var(--color-text-soft)]">{item.label}</p>
                          {title ? <p className="text-[0.8rem] font-bold leading-tight text-[var(--color-text)]">{title}</p> : null}
                        </div>
                      </div>

                      <p className="mt-4 text-[16px] font-extrabold leading-none text-[var(--color-primary)] md:text-[18px]">{stat}</p>

                      <div className="mt-2 flex flex-col gap-1">
                        {subtext ? <p className="text-[0.72rem] text-[var(--color-text-muted)]">{subtext}</p> : null}
                        {metricTag ? (
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">[{metricTag}]</p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          {regions.length > 0 ? (
            <div className="lg:col-span-4 lg:h-full">
              <RegionalDemandMap regions={regions} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
