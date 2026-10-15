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
  "series 3": "series iii",
};

// Photo views, in the order a section falls back to when a model runs out of unused photos.
const VIEWS = ["45", "side", "front"];

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
 * Photo pool key ("xf|x260", "xe|x760 lci", ...) for a Jaguar described by free text,
 * or null when the text names no Jaguar we have photos of.
 */
export function carKeyFor(...hints) {
  let text = normalise(hints.filter((hint) => typeof hint === "string" && hint).join(" ").trim());
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

  const { pools, generationStart } = carImages;
  const faceliftKey = `${model}|${generation} lci`;
  const isFacelift =
    /\blci\b/.test(text) || (year && generationStart[faceliftKey] && Number(year) >= generationStart[faceliftKey]);
  if (generation && isFacelift && pools[faceliftKey]) return faceliftKey;
  if (generation && pools[`${model}|${generation}`]) return `${model}|${generation}`;
  return `${model}|${carImages.defaultGeneration[model]}`;
}

function photoPath(file) {
  return `${carImages.basePath}${file}`;
}

// Pools are model|generation -> view -> [file, colour]; colours were checked from the pixels.
const COLOUR = new Map();
const POOL_FILES = {};
for (const [key, views] of Object.entries(carImages.pools)) {
  POOL_FILES[key] = {};
  for (const [view, entries] of Object.entries(views)) {
    POOL_FILES[key][view] = entries.map(([file, colour]) => {
      COLOUR.set(file, colour);
      return file;
    });
  }
}

function colourOf(file) {
  return COLOUR.get(file) || "other";
}

/**
 * 45-degree front-view photo for a Jaguar described by free text, e.g.
 * carImageFor("XF", "X250") or carImageFor("Jaguar F-Pace").
 * Picks the exact generation when one is mentioned, else the model's default photo.
 * Returns null when nothing matches, so callers can keep their own fallback.
 */
export function carImageFor(...hints) {
  const key = carKeyFor(...hints);
  const file = key && POOL_FILES[key]?.["45"]?.[0];
  return file ? photoPath(file) : null;
}

/**
 * Model key ("xf", "f-pace", ...) for free text such as a hero tag pill, or null.
 */
export function carModelFor(...hints) {
  return findModel(normalise(hints.filter(Boolean).join(" ")));
}

/**
 * Hero overlay (model photo or generation line-up, transparent background) for a model key,
 * plus the photos it is made of so the rest of the page can avoid showing them again.
 */
export function heroCarFor(model) {
  return carImages.heroes[model] || null;
}

/**
 * Hero overlay for one generation ("xf|x250", from carKeyFor): a 45-degree cut-out at 20-25 KB,
 * plus `car`, the pool photo it was made from, so the rest of the page can avoid it.
 */
export function generationHeroFor(key) {
  return (key && carImages.generationHeroes[key]) || null;
}

/** Jaguar's own hero background (no car) for the current theme. */
export function heroBackground(isDark) {
  return isDark ? carImages.background.dark : carImages.background.light;
}

// Engine names as written in copy -> engine photo key (cut out, transparent).
// First matching rule wins, so the most specific codes come first (P300e before P300,
// 508PN/508PS before AJ133, AJD/276DT before the generic "Ingenium").
const ENGINE_PATTERNS = [
  [/\bp300e\b|\bphev\b|\baj150p?\b|plug-in hybrid/, "aj150p-hybrid"],
  [/\b508pn\b/, "508pn"],
  [/\b508ps\b(?!.*\bpre[\s\u2011-]?2013\b)|\bxjr ?575\b|\baj133 gen ?2\b/, "aj133-gen-2"],
  [/\b508ps\b/, "aj133"],
  [/\baj133\b/, "aj133"],
  [/\baj126\b|\b306ps\b/, "aj126"],
  [/\bajd-?v6\b|\bajd\b|\b306dt\b|\b276dt\b|\btdv6\b|\btdvi\b|\bajtdv6\b/, "ajd-v6"],
  [/\baj20p6\b|\baj300p\b/, "aj300p"],
  [/\baj20d6\b|\baj300d?\b/, "aj300d"],
  [/\b224dt\b/, "224dt"],
  [/\baj200p\b|\bpt204\b|\b204pt\b|\baj20p4\b|\bingenium petrol\b|\bp(?:200|250|300)\b/, "ingenium-petrol"],
  [/\baj200d\b|\b204dtd\b|\b204dth\b|\baj20d4\b|\bd(?:150|165|180|200|240)\b|\bingenium\b/, "ingenium-diesel"],
  [/\baj30\b/, "aj30"],
  [/\baj25\b/, "aj25"],
  [/\baj2[67]s?\b/, "aj27"],
  [/\baj-?v8\b|\baj3[34]s?\b|\baj8ft\b/, "aj-v8"],
  [/\baj-?v6\b/, "aj-v6"],
];

/** Photo of the engine named in free text ("AJ126 V6", "Ingenium", "AJD-V6"), or null. */
export function engineImageFor(text) {
  const clean = normalise(String(text || "").replace(/<[^>]*>/g, " "));
  const key = ENGINE_PATTERNS.find(([pattern]) => pattern.test(clean))?.[1];
  return key ? carImages.engines[key] : null;
}

/** The engine photo that best represents a model (e.g. the E-Pace's AJ200P Ingenium petrol). */
export function modelEngineImage(model) {
  const key = carImages.modelEngine[model];
  return key ? carImages.engines[key] : null;
}

/**
 * Card photo for the I-Pace, which has no photo of its own: a black Jaguar SUV with a blank plate.
 */
export function iPaceStandInImage() {
  return carImages.iPaceStandIn;
}

/** Land Rover photo for brand-vs-brand comparisons. */
export function landRoverImage() {
  return carImages.landRover;
}

// Other photo pools of the same model, nearest generation (by start year) first.
function siblingKeys(key) {
  const [model] = key.split("|");
  const start = (k) => carImages.generationStart[k] ?? Infinity;
  return Object.keys(POOL_FILES)
    .filter((k) => k !== key && k.split("|")[0] === model)
    .sort((a, b) => Math.abs(start(a) - start(key)) - Math.abs(start(b) - start(key)));
}

/**
 * Hands out car photos for one page so no photo is shown twice. Each section asks for all
 * its photos at once and gets one view (45-degree, side, front) for the whole section, so
 * rows stay consistent; colours rotate through black, grey, white, silver and dark blue.
 * When a model has fewer photos than the page needs, the least-used photo is repeated.
 */
export function createCarPicker(alreadyUsed = [], { siblings = false } = {}) {
  const used = new Map();
  const colourCount = new Map();

  const take = (file) => {
    used.set(file, (used.get(file) || 0) + 1);
    const colour = colourOf(file);
    colourCount.set(colour, (colourCount.get(colour) || 0) + 1);
    return photoPath(file);
  };
  alreadyUsed.forEach(take);

  // Of the unused photos, the one whose colour the page has shown least so far.
  const leastShownColour = (files) =>
    files.reduce((best, file) =>
      (colourCount.get(colourOf(file)) || 0) < (colourCount.get(colourOf(best)) || 0) ? file : best
    );

  return function pickSection(hintList, { view = "45" } = {}) {
    const keys = hintList.map((hints) => carKeyFor(...[].concat(hints)));
    const need = {};
    keys.forEach((key) => {
      if (key) need[key] = (need[key] || 0) + 1;
    });

    const order = [view, ...VIEWS.filter((v) => v !== view)];
    const free = (key, v) => (POOL_FILES[key]?.[v] || []).filter((file) => !used.has(file));
    const sectionView =
      order.find((v) => Object.entries(need).every(([key, count]) => free(key, v).length >= count)) || view;

    // Rows of one section get different colours first; across the page, the least-shown colour wins.
    const sectionColours = new Set();
    const takeForSection = (files) => {
      let fresh = files.filter((file) => !sectionColours.has(colourOf(file)));
      if (!fresh.length) {
        // Every colour this model comes in is already in the section: start the rotation again.
        sectionColours.clear();
        fresh = files;
      }
      const file = leastShownColour(fresh);
      sectionColours.add(colourOf(file));
      return take(file);
    };

    return keys.map((key) => {
      if (!key) return null;
      for (const v of [sectionView, ...order.filter((o) => o !== sectionView)]) {
        const files = free(key, v);
        if (files.length) return takeForSection(files);
      }
      // `siblings`: out of photos of this generation, use the nearest generation of the same model
      // rather than showing a photo twice.
      for (const sibling of siblings ? siblingKeys(key) : []) {
        for (const v of order) {
          const files = free(sibling, v);
          if (files.length) return takeForSection(files);
        }
      }
      const pool = POOL_FILES[key]?.[sectionView] || POOL_FILES[key]?.["45"] || [];
      if (!pool.length) return null;
      const leastUsed = [...pool].sort((a, b) => (used.get(a) || 0) - (used.get(b) || 0))[0];
      return take(leastUsed);
    });
  };
}
