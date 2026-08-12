/** Full navbar inventory: dynamic MODELS + ENGINES, plus every static public HTML page. */
import modelNavData from "@/components/shared/modelNavData.json";
import staticNavData from "@/components/shared/staticNavData.json";

const enginesGroups = [
  {
    title: "Modern (B-series)",
    links: [
      { label: "B37/B47", href: "/engine/b37-b47" },
      { label: "B38/B48", href: "/engine/b38-b48" },
      { label: "B57/B58", href: "/engine/b57-b58" },
    ],
  },
  {
    title: "N-series",
    links: [
      { label: "N13/N20", href: "/engine/n13-n20" },
      { label: "N40/N42/N43/N45/N46", href: "/engine/n40-n42-n43-n45-n46" },
      { label: "N47", href: "/engine/n47" },
      { label: "N52/N53", href: "/engine/n52-n53" },
      { label: "N54/N55", href: "/engine/n54-n55" },
      { label: "N57", href: "/engine/n57" },
      { label: "N62/N63", href: "/engine/n62-n63" },
      { label: "N73/N74", href: "/engine/n73-n74" },
    ],
  },
  {
    title: "M-series (classic)",
    links: [
      { label: "M10", href: "/engine/m10" },
      { label: "M20", href: "/engine/m20" },
      { label: "M21", href: "/engine/m21" },
      { label: "M30", href: "/engine/m30" },
      { label: "M40/M42/M43/M44", href: "/engine/m40-m42-m43-m44" },
      { label: "M47", href: "/engine/m47" },
      { label: "M50/M52/M54", href: "/engine/m50-m52-m54" },
      { label: "M57", href: "/engine/m57" },
      { label: "M60/M62", href: "/engine/m60-m62" },
      { label: "M70/M73", href: "/engine/m70-m73" },
      { label: "M88/S38", href: "/engine/m88-s38" },
    ],
  },
  {
    title: "S-series (M Division)",
    links: [
      { label: "S14", href: "/engine/s14" },
      { label: "S50/S52/S54", href: "/engine/s50-s52-s54" },
      { label: "S55", href: "/engine/s55" },
      { label: "S62", href: "/engine/s62" },
      { label: "S63/S65", href: "/engine/s63-s65" },
      { label: "S70/S85", href: "/engine/s70-s85" },
    ],
  },
];

const guidesGroups = [
  {
    title: "Buying & Ranking",
    links: [
      { label: "BMW Engines Ranked Worst to Best", href: "/blog/bmw-engines-ranked-worst-to-best" },
      { label: "Best BMW Diesel Engines", href: "/blog/best-bmw-diesel-engines" },
      { label: "Best BMW Petrol Engines", href: "/blog/best-bmw-petrol-engines" },
      { label: "Most Reliable BMW Engine", href: "/blog/most-reliable-bmw-engine" },
      { label: "BMW Engines to Avoid", href: "/blog/bmw-engines-to-avoid" },
      { label: "Best BMW 3 Series Engines", href: "/blog/best-bmw-3-series-engines" },
    ],
  },
  {
    title: "Ownership",
    links: [
      { label: "How Long Do BMW Diesel Engines Last", href: "/blog/how-long-do-bmw-diesel-engines-last" },
      { label: "High Mileage BMW Maintenance Schedule", href: "/blog/high-mileage-bmw-maintenance-schedule" },
      { label: "Cheapest BMW to Maintain", href: "/blog/cheapest-bmw-to-maintain" },
      { label: "Best BMW for High Mileage", href: "/blog/best-bmw-for-high-mileage" },
      { label: "BMW Engine Lifespan by Generation", href: "/blog/bmw-engine-lifespan-by-generation" },
    ],
  },
  {
    title: "Problems Explained",
    links: [
      { label: "N47 Timing Chain Failure Timeline", href: "/blog/n47-timing-chain-failure-timeline" },
      { label: "N54 HPFP Failure Timeline", href: "/blog/n54-hpfp-failure-timeline" },
      { label: "N63 Oil Consumption Timeline", href: "/blog/n63-oil-consumption-timeline" },
      { label: "Are BMW Diesels Unreliable?", href: "/blog/are-bmw-diesels-unreliable" },
      { label: "Do All N47 Engines Have Timing Chain Problems?", href: "/blog/do-all-n47-engines-have-timing-chain-problems" },
    ],
  },
];

export const navMenus = [
  {
    id: "models",
    label: "MODELS",
    kind: "models",
    groups: modelNavData.groups.map((group) => ({
      title: group.title,
      items: group.items.map(({ variantCount, generationCount, ...item }) => item),
    })),
  },
  {
    id: "engines",
    label: "ENGINES",
    kind: "columns",
    groups: enginesGroups,
  },
  {
    id: "problems",
    label: "PROBLEMS & SYMPTOMS",
    kind: "columns",
    groups: [
      { title: "Common Failures", links: staticNavData.failures },
      { title: "Symptoms", links: staticNavData.symptoms },
      { title: "Warning Lights", links: staticNavData.warningLights },
      { title: "Fault Codes", links: staticNavData.faultCodes },
    ],
  },
  {
    id: "guides",
    label: "GUIDES",
    kind: "columns",
    groups: guidesGroups,
  },
  {
    id: "research",
    label: "RESEARCH & COMPARE",
    kind: "columns",
    groups: [
      { title: "Compare", links: staticNavData.compare },
      { title: "Fitment Guide", links: staticNavData.fitment },
      { title: "Technical Library", links: staticNavData.technical },
      { title: "Case Studies", links: staticNavData.caseStudies },
      { title: "Recalls", links: staticNavData.recalls },
      { title: "Ownership Economics", links: staticNavData.economics },
    ],
  },
  {
    id: "data-tools",
    label: "DATA & TOOLS",
    kind: "columns",
    groups: [
      { title: "Data & Reports", links: staticNavData.data },
      { title: "Tools", links: staticNavData.tools },
      { title: "About", links: staticNavData.about },
      { title: "Contact", links: staticNavData.contact },
      { title: "Engine Pages", links: staticNavData.engine },
    ],
  },
  {
    id: "blog",
    label: "BLOG",
    kind: "link",
    href: "/blog",
  },
];
