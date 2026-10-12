import carImages from "@/data/shared/carImages.json";

// Model name patterns, matched case-insensitively against free text such as
// "Jaguar F‑Pace", "XF X250 (AJ126)" or "XJ8 / XJR". XJS, I-Pace and engine names
// like "XK6" deliberately match nothing (no photo for them).
const MODEL_PATTERNS = [
  ["f-pace", /\bf[\s-]?pace\b/],
  ["e-pace", /\be[\s-]?pace\b/],
  ["f-type", /\bf[\s-]?type\b/],
  ["s-type", /\bs[\s-]?type\b/],
  ["x-type", /\bx[\s-]?type\b/],
  ["xe", /\bxe\b/],
  ["xf", /\bxf(?:r|r-s)?\b/],
  ["xj", /\bxj(?:6|8|12|r|r575|40|50)?\b/],
  ["xk", /\bxk(?:8|r|r-s)?\b/],
];

const GENERATION_PATTERN = /\b(x\d{3}|xj40|series\s+(?:iii|ii|i|[123]))\b/;
const YEAR_PATTERN = /\b(19[5-9]\d|20[0-3]\d)\b/;

// Names that pin a generation when no chassis code is given, and the closest photo
// for generations we have no photo of.
const NAME_GENERATION = [
  [/\bxk8\b/, "x100"],
  [/\bxfr\b/, "x250"],
];
// Engine-only or brand-only labels (e.g. comparison cards "AJ126 V6 vs AJ133 V8") get the
// car each engine is best known in, so every slot still shows a 45-degree Jaguar.
const ENGINE_CAR = [
  [/\baj126\b/, "xf x250"],
  [/\baj133\b/, "xj x351"],
  [/\bajd-?v6\b/, "xf x250 lci"],
  [/\bingenium\b/, "xe"],
  [/^jaguar$/, "f-pace"],
];

const GENERATION_ALIAS = {
  "series 1": "series i",
  "series 2": "series ii",
  "series 3": "series ii",
  "series iii": "series ii",
};

function normalise(text) {
  return text
    .toLowerCase()
    .replace(/[‐-―]/g, "-")
    .replace(/\s+/g, " ");
}

function findModel(text) {
  let best = null;
  for (const [model, pattern] of MODEL_PATTERNS) {
    const match = text.match(pattern);
    if (match && (!best || match.index < best.index)) best = { model, index: match.index };
  }
  return best?.model || null;
}

// Latest generation of `model` that had started by `year` (photos have no exact match
// for era labels such as "Ford-Era V6s, 2008-2015").
function generationForYear(model, year) {
  let best = null;
  for (const [key, start] of Object.entries(carImages.generationStart)) {
    const [keyModel, generation] = key.split("|");
    if (keyModel !== model || generation.endsWith(" lci") || start > year) continue;
    if (!best || start > best.start) best = { generation, start };
  }
  return best?.generation || null;
}

/**
 * 45-degree front-view photo for a Jaguar described by free text, e.g.
 * carImageFor("XF", "X250") or carImageFor("Jaguar F-Pace").
 * Picks the exact generation when one is mentioned, else the model's default photo.
 * Returns null when nothing matches, so callers can keep their own fallback.
 */
export function carImageFor(...hints) {
  let text = normalise(hints.filter(Boolean).join(" ").trim());
  if (!text) return null;
  if (!findModel(text) && !GENERATION_PATTERN.test(text)) {
    text = ENGINE_CAR.find(([pattern]) => pattern.test(text))?.[1] || text;
  }

  const code = text.match(GENERATION_PATTERN)?.[1] || NAME_GENERATION.find(([p]) => p.test(text))?.[1];
  let generation = code ? GENERATION_ALIAS[code] || code : null;
  const model = findModel(text) || (generation && carImages.generationModel[generation]) || null;
  if (!model) return null;

  const year = text.match(YEAR_PATTERN)?.[1];
  if (!generation && year) generation = generationForYear(model, Number(year));

  const { generations, generationStart } = carImages;
  const faceliftKey = `${model}|${generation} lci`;
  const isFacelift =
    /\blci\b/.test(text) || (year && generationStart[faceliftKey] && Number(year) >= generationStart[faceliftKey]);
  const facelift = generation && isFacelift && generations[faceliftKey];
  const file = facelift || (generation && generations[`${model}|${generation}`]) || carImages.models[model];
  return file ? `${carImages.basePath}${file}` : null;
}
