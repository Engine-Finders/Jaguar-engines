export {
  sectionH2,
  sectionDescription,
  tableHeaderClass,
} from "@/components/models/sectionTypography";

export function generationSectionBg(isDark, tinted = false) {
  if (isDark) return "bg-[var(--color-page)]";
  return tinted ? "bg-[#ececea]" : "bg-[var(--color-page)]";
}

export function primaryBadgeClass(isDark) {
  return isDark
    ? "bg-[var(--color-primary)] text-[var(--color-page)]"
    : "bg-[var(--color-primary)] text-white";
}

export function indexBadgeClass(isDark) {
  return isDark
    ? "bg-[var(--color-chrome)] text-[var(--color-page)]"
    : "bg-black text-white";
}

// Approved SEO headings: "… Engine Codes: Specs, …" / "… Engine Repair or Replacement? Costs …" / "… Petrol & Diesel
// Engine Variants" / "… Engine & Replacement FAQs" / "… Engine Suppliers & Specialist Quote Options". Returns null for
// the older wordings, so pages still on them keep their existing split.
export function splitSeoHeading(clean = "") {
  const colon = clean.indexOf(": ");
  if (colon > 0) return { main: clean.slice(0, colon + 1), accent: clean.slice(colon + 2) };
  const question = clean.indexOf("? ");
  if (question > 0) return { main: clean.slice(0, question + 1), accent: clean.slice(question + 2) };
  const tail = clean.match(/^(.*?)\s+((?:Petrol|Diesel|Engine)\b.*(?:Engine Variants|Powertrain Options|FAQs|Quote Options|Replacement Options))$/);
  if (tail) return { main: tail[1], accent: tail[2] };
  return null;
}

export function splitEngineDatabaseH2(title = "") {
  const clean = String(title ?? "").trim();
  const seo = splitSeoHeading(clean);
  if (seo) return seo;
  const marker = "The Complete Database";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim(),
      accent: clean.slice(index).trim(),
    };
  }

  const dash = clean.indexOf(" - ");
  if (dash !== -1) {
    return {
      main: clean.slice(0, dash).trim(),
      accent: clean.slice(dash + 3).trim(),
    };
  }

  return { main: clean, accent: "" };
}

export function splitBestWorstEnginesH2(title = "") {
  const clean = String(title ?? "").trim();
  const seo = splitSeoHeading(clean);
  if (seo) return seo;
  const marker = "Best & Worst";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[--]\s*$/, ""),
      accent: clean.slice(index).trim(),
    };
  }

  const dash = clean.indexOf(" - ");
  if (dash !== -1) {
    return {
      main: clean.slice(0, dash).trim(),
      accent: clean.slice(dash + 3).trim(),
    };
  }

  return { main: "", accent: clean };
}

export function splitOwnershipEconomicsH2(title = "") {
  const clean = String(title ?? "").trim();
  const seo = splitSeoHeading(clean);
  if (seo) return seo;
  const marker = "Ownership Economics";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[--]\s*$/, ""),
      accent: clean.slice(index).trim(),
    };
  }

  const dash = clean.indexOf(" - ");
  if (dash !== -1) {
    return {
      main: clean.slice(0, dash).trim(),
      accent: clean.slice(dash + 3).trim(),
    };
  }

  return { main: "", accent: clean };
}

export function splitCommonProblemsH2(title = "") {
  const clean = String(title ?? "").trim();
  const seo = splitSeoHeading(clean);
  if (seo) return seo;
  const marker = "Common Problems";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[--]\s*$/, ""),
      accent: clean.slice(index).trim(),
    };
  }

  const dash = clean.indexOf(" - ");
  if (dash !== -1) {
    return {
      main: clean.slice(0, dash).trim(),
      accent: clean.slice(dash + 3).trim(),
    };
  }

  return { main: "", accent: clean };
}

export function splitReplacementCostsH2(title = "") {
  const clean = String(title ?? "").trim();
  const seo = splitSeoHeading(clean);
  if (seo) return seo;
  const marker = "Engine Replacement Costs";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[--]\s*$/, ""),
      accent: clean.slice(index).trim(),
    };
  }

  const replacement = clean.indexOf("Replacement Costs");
  if (replacement !== -1) {
    return {
      main: clean.slice(0, replacement).trim().replace(/[--]\s*$/, ""),
      accent: clean.slice(replacement).trim(),
    };
  }

  const dash = clean.indexOf(" - ");
  if (dash !== -1) {
    return {
      main: clean.slice(0, dash).trim(),
      accent: clean.slice(dash + 3).trim(),
    };
  }

  return { main: "", accent: clean };
}

export function splitCoreVariantsH2(title = "") {
  const clean = String(title ?? "").trim();
  const seo = splitSeoHeading(clean);
  if (seo) return seo;
  const marker = "Core Variants";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[--]\s*$/, ""),
      accent: clean.slice(index).trim(),
    };
  }

  const lineup = clean.indexOf("Diesel & Petrol");
  if (lineup !== -1) {
    return {
      main: clean.slice(0, lineup).trim().replace(/[--]\s*$/, ""),
      accent: clean.slice(lineup).trim(),
    };
  }

  const dash = clean.indexOf(" - ");
  if (dash !== -1) {
    return {
      main: clean.slice(0, dash).trim(),
      accent: clean.slice(dash + 3).trim(),
    };
  }

  return { main: "", accent: clean };
}

export function splitMarketIntelligenceH2(title = "") {
  const clean = String(title ?? "").trim();
  const seo = splitSeoHeading(clean);
  if (seo) return seo;
  const marker = "Market Intelligence";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[--]\s*$/, ""),
      accent: clean.slice(index).trim(),
    };
  }

  const dash = clean.indexOf(" - ");
  if (dash !== -1) {
    return {
      main: clean.slice(0, dash).trim(),
      accent: clean.slice(dash + 3).trim(),
    };
  }

  return { main: "", accent: clean || "Market Intelligence" };
}

export function splitFaqH2(title = "") {
  const clean = String(title ?? "").trim();
  const seo = splitSeoHeading(clean);
  if (seo) return seo;
  const marker = "Frequently Asked Questions";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[--]\s*$/, ""),
      accent: clean.slice(index).trim(),
    };
  }

  if (/^FAQ$/i.test(clean)) {
    return { main: "", accent: clean };
  }

  const dash = clean.indexOf(" - ");
  if (dash !== -1) {
    return {
      main: clean.slice(0, dash).trim(),
      accent: clean.slice(dash + 3).trim(),
    };
  }

  return { main: "", accent: clean || "Frequently Asked Questions" };
}

export function splitTrustCtaH2(title = "") {
  const clean = String(title ?? "").trim();
  const seo = splitSeoHeading(clean);
  if (seo) return seo;
  const trustMatch = clean.match(/^(.*?)(Trust\s+JaguarEngine\.uk.*)$/i);

  if (trustMatch) {
    return {
      main: trustMatch[1].trim().replace(/[--]\s*$/, ""),
      accent: trustMatch[2].trim(),
    };
  }

  const dash = clean.indexOf(" - ");
  if (dash !== -1) {
    return {
      main: clean.slice(0, dash).trim(),
      accent: clean.slice(dash + 3).trim(),
    };
  }

  return { main: "", accent: clean };
}

export function splitGenerationHeroH1(h1 = "") {
  const clean = String(h1 ?? "").trim();
  const seo = splitSeoHeading(clean);
  if (seo) return { before: seo.main, accent: seo.accent };
  const guideIndex = clean.indexOf("The Complete UK Guide");

  if (guideIndex !== -1) {
    return {
      before: clean.slice(0, guideIndex).trim(),
      accent: clean.slice(guideIndex).trim(),
    };
  }

  const dash = clean.indexOf(" - ");
  if (dash !== -1) {
    return {
      before: clean.slice(0, dash).trim(),
      accent: clean.slice(dash + 3).trim(),
    };
  }

  return { before: clean, accent: "" };
}
