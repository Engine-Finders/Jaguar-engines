/** Full navbar inventory: dynamic MODELS + ENGINES, plus every static public HTML page. */
import modelNavData from "@/components/shared/modelNavData.json";
import staticNavData from "@/components/shared/staticNavData.json";

const enginesGroups = [
  {
    title: "Petrol",
    links: [
      { label: "AJ-V6 Petrol", href: "/engine/aj-v6-petrol" },
      { label: "AJ-V8 4.0 / 4.2", href: "/engine/aj-v8-4-0-4-2" },
      { label: "AJ133", href: "/engine/aj133" },
      { label: "AJ20P6", href: "/engine/aj20p6" },
      { label: "AJ6 / AJ16", href: "/engine/aj6-aj16" },
      { label: "Ingenium 2.0 Petrol", href: "/engine/ingenium-20-petrol" },
      { label: "P510", href: "/engine/p510" },
      { label: "XK Straight Six", href: "/engine/xk-straight-six" },
      { label: "V12 HE", href: "/engine/v12-he" },
    ],
  },
  {
    title: "Diesel",
    links: [
      { label: "AJD-V6 Diesel", href: "/engine/ajd-v6-diesel" },
      { label: "306DT / 306PS", href: "/engine/306dt-306ps" },
      { label: "AJ20D6", href: "/engine/aj20d6" },
      { label: "AJD4 / 204DTD", href: "/engine/ajd4-204dtd" },
      { label: "Ingenium 2.0 Diesel", href: "/engine/ingenium-2-0-diesel" },
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
    groups: [
      { title: "Technical Library", links: staticNavData.technical },
    ],
  },
  {
    id: "research",
    label: "RESEARCH & COMPARE",
    kind: "columns",
    groups: [
      { title: "Compare", links: staticNavData.compare },
      { title: "Fitment Guide", links: staticNavData.fitment },
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
];
