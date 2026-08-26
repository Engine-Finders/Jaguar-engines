"use client";

import Image from "next/image";

// Semantic icon keys -> filename (same filename in both /Jaguar Black and /Jaguar Silver).
const FILES = {
  "real-inquiries": "Real Inquiries Icon-01.png",
  "vetted-specialist": "Vetted Specialist Icon-01.png",
  "vetted-specialist-2": "Vetted specialist Icon 2-01.png",
  "expert-verified": "Expert Verified Icon-01.png",
  "generation-honest-rated": "Generation Honest Rated Icon-01.png",
  "engine-finders": "Part of Engine finders Icon-01.png",
  "genuine-failure-data": "Genuine Failure Data Icon-01.png",
  "repair-vs-replace": "Hones repair vs replace icon-01.png",
  independent: "100% independent icon-01.png",
  "oem-references": "Oem references Icon-01.png",
  symptoms: "Symptoms Icon-01.png",
  vehicle: "Vehicle Icon-01.png",
  diagnosis: "Meter Icon-01.png",
  "real-data": "Real data icon-01.png",
  "specific-knowledge": "Specific knowledge icon-01.png",
  "honest-verdict": "Scale Icon-01.png",
  "ipace-note": "Ipace note icon-01.png",
  note: "Note Icon-01.png",
  // Verdict icons (HomeSec2)
  "safe-buy": "Safe buy icon-01.png",
  "check-watch": "Check Watch-01.png",
  "flagship-choice": "Flagship choice icon-01.png",
  "best-family": "Best Family Icon-01.png",
  "high-demand": "High demand icon-01.png",
  "top-choice": "Top choice-01.png",
  "niche-style": "Niche style icon-01.png",
  ev: "Ev Icon-01.png",
  fire: "Expensive failure icon-01.png",
  // HomeSec3 semantic aliases
  chart: "Real Inquiries Icon-01.png",
  wrench: "Vetted Specialist Icon-01.png",
  book: "Oem references Icon-01.png",
  shield: "Genuine Failure Data Icon-01.png",
  clipboard: "Specific knowledge icon-01.png",
  users: "Vetted Specialist Icon-01.png",
  scales: "Scale Icon-01.png",
  // HomeSec4 ranking + verdict
  engine: "Engine icon-01.png",
  car: "Vehicle Icon-01.png",
  tag: "Value icon-01.png",
  flame: "Expensive failure icon-01.png",
  warning: "Check Watch-01.png",
  "best-family-icon": "Best Family Icon-01.png",
  "long-term": "Best Long term Icon-01.png",
  clock: "Best Long term Icon-01.png",
  check: "Check-01.png",
  x: "Check Watch-01.png",
  // HomeSec5 comparison + data note
  fuel: "Petrol Icon-01.png",
  crown: "Flagship choice icon-01.png",
  info: "Note Icon-01.png",
  // HomeSec6 economics
  "market-value": "Value icon-01.png",
  "verified-enquiries": "Real Inquiries Icon-01.png",
  "honest-advice": "Genuine Failure Data Icon-01.png",
  link: "Knowledge centre icon-01.png",
  calculator: "Calculator icon-01.png",
  repair: "Hones repair vs replace icon-01.png",
  scrap: "Expensive failure icon-01.png",
  "scope-decision": "Scope decision Icon-01.png",
  trend: "Trend icon-01.png",
  value: "Value icon-01.png",
  database: "Database Icon-01.png",
  // HomeSec7 engine families
  droplet: "Petrol Icon-01.png",
  pump: "Petrol Icon-01.png",
  bulb: "Not sure icon-01.png",
  star: "Top choice-01.png",
  // HomeSec9 failure database
  gear: "Engine icon-01.png",
  suspension: "Air suspension knowledge Icon-01.png",
  drivetrain: "Drivetrain failures icon-01.png",
  electrical: "Electric failures icon-01.png",
  gearbox: "Gearbox problem  Icon-01.png",
  ingenium: "Ingenium Icon-01.png",
  trophy: "Top choice-01.png",
  amg: "Amg icon-01.png",
  knowledge: "Knowledge centre icon-01.png",
  // HomeSec10 market intelligence
  refresh: "Live Feed icon-01.png",
  globe: "Trend icon-01.png",
  pound: "Value icon-01.png",
  pulse: "Market Insight Icon-01.png",
  live: "Live Feed icon-01.png",
  "most-enquired": "Most Enquired Icon-01.png",
  chain: "Timing Chain-01.png",
  pin: "Uk focused Icon-01.png",
  "premium-style": "Niche style icon-01.png",
  "safest-buy": "Top choice-01.png",
  "best-used": "Best Used buy icon-01.png",
  residuals: "Value icon-01.png",
  // HomeSec11
  timeline: "Generation Honest Rated Icon-01.png",
  insight: "Market Insight Icon-01.png",
  // Model / ownership pages
  cart: "Best Used buy icon-01.png",
  alert: "Check Watch-01.png",
  scale: "Scale Icon-01.png",
  ranking: "Flagship choice icon-01.png",
  quote: "Quote Icon-01.png",
  "most-enquired-stat": "Most Enquired Icon-01.png",
  generations: "Generation Honest Rated Icon-01.png",
  "engine-codes": "Database Icon-01.png",
};

// Silver folder uses a few different filenames
const SILVER_FILES = {
  "Top choice-01.png": "Top choice.png",
};

export default function HomeIcon({ name, isDark, className = "h-5 w-5" }) {
  const file = FILES[name];
  if (!file) return null;

  const folder = isDark ? "Jaguar Silver" : "Jaguar Black";
  const resolved = isDark ? SILVER_FILES[file] || file : file;
  const src = `/${encodeURIComponent(folder)}/${encodeURIComponent(resolved)}`;

  return (
    <Image
      src={src}
      alt=""
      width={48}
      height={48}
      className={className}
      unoptimized
    />
  );
}
