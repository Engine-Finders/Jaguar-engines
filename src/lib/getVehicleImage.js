/**
 * Pick a local /cars image from registration lookup text (make + model/series).
 * Model match only — no generation/variant scoring. Fallback = brand default.
 */

const DEFAULT_JAGUAR_IMAGE =
  "/cars/jaguar-f-pace-x761-300-sport-suv-2018-2020-special-yulong-white-f-pace-300-sport-45.webp";

/** Preferred 45° image per Jaguar model (filenames under public/cars). */
const MODEL_IMAGES = {
  "e-pace":
    "/cars/jaguar-e-pace-x540-300-sport-black-compact-suv-2023-2024-special-ostuni-white-e-pace-300-black-45.webp",
  "f-pace":
    "/cars/jaguar-f-pace-x761-300-sport-suv-2018-2020-special-yulong-white-f-pace-300-sport-45.webp",
  "i-pace": "/cars/jaguar-i-pace-stand-in-black-blank-plate-45.webp",
  "f-type":
    "/cars/jaguar-f-type-x152-400-sport-coupe-coupe-2017-2018-special-yulong-white-f-type-400-sport-45.webp",
  "s-type":
    "/cars/jaguar-s-type-x200-3-0-v6-se-saloon-1999-2002-new-platinum-silver-x200-30-se-2-45.webp",
  "x-type":
    "/cars/jaguar-x-type-x400-2-0-v6-se-saloon-2001-2004-new-zircon-x-type-20-2-45.webp",
  xe: "/cars/jaguar-xe-x760-20t-prestige-saloon-2015-2017-group-glacier-white-xe-20t-45.webp",
  xf: "/cars/jaguar-xf-x250-lci-premium-luxury-saloon-2011-2015-new-polaris-white-xf-lci-premium-45.webp",
  xk: "/cars/jaguar-xk-x150-xk-convertible-convertible-2006-2011-new-polaris-white-x150-cab-45.webp",
  xj: "/cars/jaguar-xj-x351-xj-premium-luxury-saloon-2010-2015-new-polaris-white-x351-premium-45.webp",
};

/** Longest / most specific first so "e-pace" wins over "pace". */
const MODEL_PATTERNS = [
  { key: "e-pace", re: /\be[\s\-]?pace\b/i },
  { key: "f-pace", re: /\bf[\s\-]?pace\b/i },
  { key: "i-pace", re: /\bi[\s\-]?pace\b/i },
  { key: "f-type", re: /\bf[\s\-]?type\b/i },
  { key: "s-type", re: /\bs[\s\-]?type\b/i },
  { key: "x-type", re: /\bx[\s\-]?type\b/i },
  { key: "xe", re: /\bxe\b/i },
  { key: "xf", re: /\bxf\b/i },
  { key: "xk", re: /\bxk\b/i },
  { key: "xj", re: /\bxj\b/i },
];

function normalizeText(...parts) {
  return parts
    .filter(Boolean)
    .map((p) => String(p).trim())
    .join(" ")
    .replace(/[_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isJaguarBrand(brand = "") {
  const b = String(brand).toLowerCase().replace(/[^a-z0-9]/g, "");
  return !b || b === "jaguar" || b.includes("jaguar");
}

/**
 * Detect Jaguar model key from API text (brand + series/model).
 * @returns {string|null} e.g. "f-pace"
 */
export function detectJaguarModelKey({ brand = "", series = "", model = "" } = {}) {
  const haystack = normalizeText(brand, series, model);
  if (!haystack) return null;

  for (const { key, re } of MODEL_PATTERNS) {
    if (re.test(haystack)) return key;
  }
  return null;
}

/**
 * Resolve local car image for a looked-up vehicle.
 * @returns {{ src: string, tier: "model" | "brand", modelKey: string | null }}
 */
export function getVehicleImage(vehicle = {}) {
  const brand = vehicle.brand || vehicle.make || "";
  const series = vehicle.series || vehicle.model || "";
  const model = vehicle.model || "";

  const modelKey = detectJaguarModelKey({ brand, series, model });

  if (modelKey && MODEL_IMAGES[modelKey]) {
    return { src: MODEL_IMAGES[modelKey], tier: "model", modelKey };
  }

  // Wrong brand or unknown model → default Jaguar brand image
  if (isJaguarBrand(brand) || modelKey) {
    return { src: DEFAULT_JAGUAR_IMAGE, tier: "brand", modelKey: modelKey || null };
  }

  return { src: DEFAULT_JAGUAR_IMAGE, tier: "brand", modelKey: null };
}

export { DEFAULT_JAGUAR_IMAGE, MODEL_IMAGES };
