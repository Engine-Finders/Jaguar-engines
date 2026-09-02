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

export function splitEngineDatabaseH2(title = "") {
  const clean = String(title ?? "").trim();
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
  const marker = "Best & Worst";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[-–—]\s*$/, ""),
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
  const marker = "Ownership Economics";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[-–—]\s*$/, ""),
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
  const marker = "Common Problems";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[-–—]\s*$/, ""),
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
  const marker = "Engine Replacement Costs";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[-–—]\s*$/, ""),
      accent: clean.slice(index).trim(),
    };
  }

  const replacement = clean.indexOf("Replacement Costs");
  if (replacement !== -1) {
    return {
      main: clean.slice(0, replacement).trim().replace(/[-–—]\s*$/, ""),
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
  const marker = "Core Variants";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[-–—]\s*$/, ""),
      accent: clean.slice(index).trim(),
    };
  }

  const lineup = clean.indexOf("Diesel & Petrol");
  if (lineup !== -1) {
    return {
      main: clean.slice(0, lineup).trim().replace(/[-–—]\s*$/, ""),
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
  const marker = "Market Intelligence";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[-–—]\s*$/, ""),
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
  const marker = "Frequently Asked Questions";
  const index = clean.indexOf(marker);

  if (index !== -1) {
    return {
      main: clean.slice(0, index).trim().replace(/[-–—]\s*$/, ""),
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
  const trustMatch = clean.match(/^(.*?)(Trust\s+JaguarEngine\.uk.*)$/i);

  if (trustMatch) {
    return {
      main: trustMatch[1].trim().replace(/[-–—]\s*$/, ""),
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

const GENERATION_HERO_FALLBACK = {
  light: "/e90/hero_day.webp",
  dark: "/e90/hero_dark.webp",
  mobileLight: "/e90/hero_mobile_day.webp",
  mobileDark: "/e90/hero_mobile_dark.webp",
};

export function resolveGenerationHeroImage(heroData, isDark, { mobile = false } = {}) {
  const fallback = isDark
    ? mobile
      ? GENERATION_HERO_FALLBACK.mobileDark
      : GENERATION_HERO_FALLBACK.dark
    : mobile
      ? GENERATION_HERO_FALLBACK.mobileLight
      : GENERATION_HERO_FALLBACK.light;

  if (!heroData?.image) return fallback;

  if (mobile) {
    return (isDark ? heroData.image.mobileDark : heroData.image.mobileLight) || fallback;
  }

  return (isDark ? heroData.image.dark : heroData.image.light) || fallback;
}

export function resolveGenerationHeroAlt(heroData) {
  return heroData?.image?.alt || "";
}
