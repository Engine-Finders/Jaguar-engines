/**
 * Resolve a local /cars image after registration lookup.
 * Uses the shared carImage catalog (same as home/model pages) once a model is detected.
 * Unknown model → Jaguar brand default (XJ), so a real F-Pace match looks different.
 */

import {
  carImageFor,
  carModelFor,
  iPaceStandInImage,
} from "@/components/shared/carImage";

/** Distinct from F-Pace so “default vs matched” is obvious when testing. */
const DEFAULT_JAGUAR_IMAGE =
  carImageFor("Jaguar XJ") ||
  "/cars/jaguar-xj-x351-xj-premium-luxury-saloon-2010-2015-new-polaris-white-x351-premium-45.webp";

/**
 * Compact DVLA-style labels: "F-PACE", "F PACE", "FPACE", "F‑PACE" → "fpace".
 * Longer tokens first so e-pace / f-pace win before short "xe"/"xf"/….
 */
const COMPACT_MODEL_KEYS = [
  { key: "e-pace", token: "epace" },
  { key: "f-pace", token: "fpace" },
  { key: "i-pace", token: "ipace" },
  { key: "f-type", token: "ftype" },
  { key: "s-type", token: "stype" },
  { key: "x-type", token: "xtype" },
  { key: "xe", token: "xe" },
  { key: "xf", token: "xf" },
  { key: "xk", token: "xk" },
  { key: "xj", token: "xj" },
];

function compact(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function vehicleText(vehicle = {}) {
  return [vehicle.brand || vehicle.make, vehicle.series, vehicle.model, vehicle.year]
    .filter(Boolean)
    .map(String)
    .join(" ")
    .trim();
}

/**
 * Detect Jaguar model key from API text (handles spaced, hyphenated, or glued names).
 * @returns {string|null}
 */
export function detectJaguarModelKey(vehicle = {}) {
  const text = vehicleText(vehicle);
  if (!text) return null;

  // Prefer the site-wide word-boundary matcher when it works (e.g. "F-Pace", "XF").
  const fromCatalog = carModelFor(text);
  if (fromCatalog) return fromCatalog;

  const hay = compact(text);
  for (const { key, token } of COMPACT_MODEL_KEYS) {
    if (hay.includes(token)) return key;
  }
  return null;
}

/**
 * @returns {{ src: string, tier: "model" | "brand", modelKey: string | null }}
 */
export function getVehicleImage(vehicle = {}) {
  const text = vehicleText(vehicle);
  const year = vehicle.year ? String(vehicle.year) : "";
  const modelKey = detectJaguarModelKey(vehicle);

  if (modelKey === "i-pace") {
    return { src: iPaceStandInImage(), tier: "model", modelKey };
  }

  if (modelKey) {
    // Pass model key + year + raw series so carImageFor can pick generation when possible.
    const src =
      carImageFor(modelKey, year, vehicle.series || vehicle.model || "") ||
      carImageFor(modelKey) ||
      null;
    if (src) {
      return { src, tier: "model", modelKey };
    }
  }

  // Last attempt: free-text through the catalog (covers odd API phrasing).
  const fromText = text ? carImageFor(text) : null;
  if (fromText) {
    return {
      src: fromText,
      tier: "model",
      modelKey: carModelFor(text) || modelKey,
    };
  }

  return { src: DEFAULT_JAGUAR_IMAGE, tier: "brand", modelKey: null };
}

export { DEFAULT_JAGUAR_IMAGE };
