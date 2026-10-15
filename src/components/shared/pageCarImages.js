import {
  carKeyFor,
  carModelFor,
  createCarPicker,
  engineImageFor,
  generationHeroFor,
  heroCarFor,
  iPaceStandInImage,
  landRoverImage,
  modelEngineImage,
} from "@/components/shared/carImage";
import carImages from "@/data/shared/carImages.json";

// Server-side: give every car slot on a page its own photo before the page renders, so
// the same picture never shows twice on one page and colours vary from row to row.
// Sections are filled in page order; components keep `image` when it is set.

function stripTags(text = "") {
  return String(text ?? "").replace(/<[^>]*>/g, " ");
}

function assign(items, pick, hintsFor, options) {
  if (!items?.length) return items;
  const images = pick(items.map(hintsFor), options);
  return items.map((item, index) => ({ ...item, image: images[index] || null }));
}

/** Model page (/e-pace, /xf, ...): hero line-up, then each section's car photos. */
export function withModelPageImages(data) {
  if (!data) return data;
  const model = carModelFor(data.hero?.tagPill, data.hero?.h1);
  // The I-Pace has no photo of its own; its hero uses a stand-in black Jaguar with a blank plate.
  const isIPace = !model && /\bi[\s\u2010-\u2015-]?pace\b/i.test(`${data.hero?.tagPill} ${data.hero?.h1}`);
  const hero = model ? heroCarFor(model) : isIPace ? heroCarFor("i-pace") : null;
  const pick = createCarPicker(hero?.cars || []);
  const out = { ...data };

  if (out.hero) {
    out.hero = {
      ...out.hero,
      model,
      heroCar: hero ? { src: hero.src, width: hero.width, height: hero.height } : null,
      heroScene: hero?.scene || null,
    };
  }

  if (out.ownershipVerdict) {
    const [image] = pick([[out.ownershipVerdict.h2]]);
    out.ownershipVerdict = { ...out.ownershipVerdict, image };
  }

  if (out.generations?.cards) {
    const { h2 } = out.generations;
    out.generations = { ...out.generations, cards: assign(out.generations.cards, pick, (card) => [card.title, h2]) };
  }

  if (out.editorialPullQuote) {
    const quote = out.editorialPullQuote;
    const [image] = pick([[quote.title, quote.quote]], { view: "side" });
    out.editorialPullQuote = { ...quote, image };
  }

  if (out.replacementCosts?.tables) {
    const { h2 } = out.replacementCosts;
    out.replacementCosts = {
      ...out.replacementCosts,
      tables: assign(out.replacementCosts.tables, pick, (table) => [table.title, h2]),
    };
  }

  if (out.engineEvolution?.eras) {
    const { h2 } = out.engineEvolution;
    out.engineEvolution = {
      ...out.engineEvolution,
      eras: assign(out.engineEvolution.eras, pick, (era) => [era.era, era.years, h2]),
    };
  }

  if (out.whoShouldBuy?.profiles) {
    const { h2 } = out.whoShouldBuy;
    out.whoShouldBuy = {
      ...out.whoShouldBuy,
      profiles: assign(out.whoShouldBuy.profiles, pick, (row) => [h2, stripTags(row.verdict)]),
    };
  }

  if (out.calculatorCta) {
    const [image] = pick([[out.calculatorCta.h2]]);
    out.calculatorCta = { ...out.calculatorCta, image };
  }

  if (out.closingActionCards) {
    out.closingActionCards = {
      ...out.closingActionCards,
      heroCar: hero ? { src: hero.src, width: hero.width, height: hero.height } : null,
      engineImage: modelEngineImage(model),
    };
  }

  return out;
}

const I_PACE = /\bi[\s‐-―-]?pace\b/i;

// Hero for a generation or variant page: that generation's car standing in Jaguar's own scene
// (light and dark), or, for the I-Pace (no photo of its own), the client's I-Pace scene.
// `used` is the pool photo it shows, so the rest of the page avoids it.
function generationHero(key, model) {
  const photo = generationHeroFor(key);
  if (photo) return { heroScene: photo.scene, used: [photo.car] };
  return { heroScene: heroCarFor(model)?.scene || null, used: [] };
}

// Ford Duratorq diesels (X-Type) have no photo; some copy labels them with Ingenium codes (AJ20D4).
const NO_ENGINE_PHOTO = /duratorq|\bzsd\b/i;

// First engine photo matching any of the texts (engine codes, titles), or null when none does.
function firstEngineImage(...texts) {
  for (const text of texts) {
    const image = text && !NO_ENGINE_PHOTO.test(text) ? engineImageFor(stripTags(text)) : null;
    if (image) return image;
  }
  return null;
}

// A bare "Ingenium" reads as the diesel; on a petrol-only page it is the petrol Ingenium.
function forFuel(image, text) {
  const isPetrol = /\bpetrol\b/i.test(text) && !/\bdiesel\b/i.test(text);
  return isPetrol && image === engineImageFor("ingenium") ? engineImageFor("ingenium petrol") : image;
}

/** Generation page (/xf/x250, ...): that generation's photos, none shown twice. */
export function withGenerationPageImages(data) {
  if (!data) return data;
  const hints = [stripTags(data.hero?.tagPill), stripTags(data.hero?.h1)];
  const key = carKeyFor(...hints);
  const model = carModelFor(...hints) || (I_PACE.test(hints.join(" ")) ? "i-pace" : null);
  const { used, ...hero } = generationHero(key, model);
  const pick = createCarPicker(used, { siblings: true });
  const out = { ...data };

  if (out.hero) out.hero = { ...out.hero, ...hero };

  if (out.overview) {
    const [image] = pick([hints]);
    out.overview = { ...out.overview, image: image || (model === "i-pace" ? iPaceStandInImage() : null) };
  }

  if (out.coreVariants) {
    const [image] = pick([hints], { view: "side" });
    out.coreVariants = { ...out.coreVariants, image };
  }

  // Engine photo per problem card: the engine it names, else this generation's engine of the same size
  // ("5.0 V8 ..." -> its 5.0 engine), else the generation's first engine. Non-engine problems get none.
  if (out.commonProblems?.problems) {
    const engines = (out.engineDatabase?.engines || []).map((row) => {
      const text = `${row.engineCode} ${row.family}`;
      return {
        photo: firstEngineImage(text),
        size: String(row.displacement || row.family || "").match(/\d\.\d/)?.[0],
      };
    });
    const engineImageForProblem = (problem) => {
      const text = stripTags(`${problem.title} ${problem.affectedModels}`);
      if (/non[\s-]?engine/i.test(text)) return null;
      const named = firstEngineImage(text);
      if (named) return named;
      const sameSize = engines.filter((engine) => engine.size && text.includes(engine.size));
      if (sameSize.length) return sameSize.find((engine) => engine.photo)?.photo || null;
      return engines[0]?.photo || null;
    };
    out.commonProblems = {
      ...out.commonProblems,
      problems: out.commonProblems.problems.map((problem) => ({ ...problem, image: engineImageForProblem(problem) })),
    };
  }

  // Closing block: the model's line-up scene (unless the hero already shows it).
  if (out.trustCta) {
    const scene = heroCarFor(model)?.scene;
    out.trustCta = { ...out.trustCta, image: scene && scene !== hero.heroScene ? scene.src : null };
  }

  return out;
}

/** Variant page (/xf/27d, ...): hero, era map and banners get photos of that car, none shown twice. */
export function withVariantPageImages(data) {
  if (!data) return data;
  const pill = stripTags(data.hero?.tagPill);
  const firstEra = data.eraMap?.rows?.[0] || {};
  const hints = [pill, stripTags(firstEra.generation), stripTags(firstEra.years)];
  const key = carKeyFor(...hints);
  const model = carModelFor(pill) || (I_PACE.test(pill) ? "i-pace" : null);
  const { used, ...hero } = generationHero(key, model);
  const pick = createCarPicker(used, { siblings: true });
  // "Jaguar XF 2.7d • 2008–2015 • ..." -> "XF 2.7d", for copy such as "Every XF 2.7d has a story".
  const vehicle = pill.split("•")[0].replace(/^\s*Jaguar\s+/i, "").trim() || "Jaguar";
  const engineCodes = (data.engineCodes?.rows || []).map((row) => row.engineCode);
  const eraEngines = (data.eraMap?.rows || []).map((row) => row.engineCode);
  const engineText = stripTags([pill, ...engineCodes, ...eraEngines].join(" "));
  const noEnginePhoto = NO_ENGINE_PHOTO.test(engineText);
  const engineImage = noEnginePhoto ? null : forFuel(firstEngineImage(pill, ...engineCodes, ...eraEngines), engineText);
  const modelName = model ? model.toUpperCase() : "";
  const out = { ...data };

  if (out.hero) out.hero = { ...out.hero, ...hero, vehicle };

  if (out.eraMap?.rows) {
    const images = pick(out.eraMap.rows.map((row) => [stripTags(row.generation), modelName, stripTags(row.years)]));
    out.eraMap = { ...out.eraMap, vehicle, rows: out.eraMap.rows.map((row, index) => ({ ...row, image: images[index] })) };
  }

  if (out.quotesCta) {
    const [image] = pick([hints]);
    out.quotesCta = { ...out.quotesCta, image, vehicle };
  }

  if (out.repairBuyOrReplace) {
    const [image] = pick([hints], { view: "side" });
    out.repairBuyOrReplace = { ...out.repairBuyOrReplace, image, engineImage, vehicle };
  }

  if (out.buyingChecklist) {
    const [image] = pick([hints]);
    out.buyingChecklist = { ...out.buyingChecklist, image, vehicle };
  }

  if (out.engineCodes?.rows) {
    out.engineCodes = {
      ...out.engineCodes,
      engineImage,
      rows: out.engineCodes.rows.map((row) => ({
        ...row,
        image: noEnginePhoto ? null : forFuel(firstEngineImage(row.engineCode), engineText) || engineImage,
      })),
    };
  }

  if (out.trustCta) {
    const [image] = pick([hints]);
    out.trustCta = { ...out.trustCta, image, engineImage, vehicle };
  }

  return out;
}

/**
 * Engine page (/engine/aj133, ...): that engine's photo for every engine slot, or null when there is
 * none (XK6, AJ6/AJ16, V12); the hero then shows the generation the engine is best known in.
 * Compatible models get a car photo each, none shown twice: `cardImage` for the desktop card of
 * the row's model, `image` for the row in the mobile list (only one of the two lists shows).
 */
export function enginePageImages(slug, engineLabel, compatibility) {
  const page = carImages.enginePages[slug];
  const engineImage = page ? carImages.engines[page.engine] || null : firstEngineImage(engineLabel);
  const car = !engineImage && page?.car ? generationHeroFor(page.car) : null;
  const heroCar = car ? { src: car.src, width: car.width, height: car.height } : null;
  if (!compatibility?.rows) return { engineImage, heroCar, compatibility };

  const used = car ? [car.car] : [];
  const rows = compatibility.rows;
  const modelOf = (row) => stripTags(row.model).replace(/[‐-―]/g, "-").replace(/\s+/g, " ").trim();
  // Desktop cards: one per model, pictured by the last generation listed for it (as the card shows).
  const models = [...new Set(rows.map(modelOf))];
  const lastRow = (model) => rows.filter((row) => modelOf(row) === model).at(-1);
  const cardPhotos = createCarPicker(used, { siblings: true })(models.map((model) => [model, stripTags(lastRow(model).generation)]));
  const cardImage = Object.fromEntries(models.map((model, index) => [model, cardPhotos[index]]));
  const rowPhotos = createCarPicker(used, { siblings: true })(
    rows.map((row) => [stripTags(row.model), stripTags(row.generation), stripTags(row.years)])
  );

  return {
    engineImage,
    heroCar,
    compatibility: {
      ...compatibility,
      rows: rows.map((row, index) => ({ ...row, image: rowPhotos[index], cardImage: cardImage[modelOf(row)] })),
    },
  };
}

/** Home page: every section with car photos, in page order, after the hero XF. */
export function withHomeImages(sections, heroCars = []) {
  const pick = createCarPicker(heroCars);
  const out = { ...sections };

  const sec2 = out.homeSec2;
  if (sec2?.categories) {
    const all = sec2.categories.flatMap((category) => category.models || []);
    const name = (item) => (typeof item.model === "string" ? item.model : (item.model || []).map((m) => m.name).join(" "));
    const images = pick(all.map((item) => [name(item)]));
    let index = 0;
    out.homeSec2 = {
      ...sec2,
      categories: sec2.categories.map((category) => ({
        ...category,
        models: (category.models || []).map((item) => ({ ...item, photo: images[index++] || standIn(name(item)) })),
      })),
    };
  }

  const sec5 = out.homeSec5;
  if (sec5?.comparisons) {
    // Engines get engine photos, "Land Rover" a Land Rover; the rest are Jaguars with
    // different colours on each side of a card.
    const sides = sec5.comparisons.flatMap((item) => [item.left || {}, item.right || {}]);
    const special = sides.map((side) =>
      /land\s*rover/i.test(side.label || "") ? landRoverImage() : engineImageFor(side.label)
    );
    const carSlots = sides.map((side, index) => (special[index] ? null : [side.label]));
    const picked = pick(carSlots.filter(Boolean));
    let next = 0;
    const images = carSlots.map((slot, index) => special[index] || (slot ? picked[next++] : null));
    out.homeSec5 = {
      ...sec5,
      comparisons: sec5.comparisons.map((item, index) => ({
        ...item,
        left: { ...item.left, photo: images[index * 2] },
        right: { ...item.right, photo: images[index * 2 + 1] },
      })),
    };
  }

  const sec6 = out.homeSec6;
  if (sec6?.matrix?.rows) {
    out.homeSec6 = {
      ...sec6,
      matrix: { ...sec6.matrix, rows: assignPhotos(sec6.matrix.rows, pick, (row) => [stripTags(row.model)]) },
    };
  }

  // Live enquiry feed: side views, so it reads differently from the 45-degree tables above.
  const sec10 = out.homeSec10;
  if (sec10?.liveFeed?.rows) {
    out.homeSec10 = {
      ...sec10,
      liveFeed: { ...sec10.liveFeed, rows: assignPhotos(sec10.liveFeed.rows, pick, (row) => [row.vehicle], { view: "side" }) },
    };
  }

  const sec11 = out.homeSec11;
  if (sec11?.categories) {
    const all = sec11.categories.flatMap((category) => category.models || []);
    const images = pick(all.map((model) => [model.name]));
    let index = 0;
    out.homeSec11 = {
      ...sec11,
      categories: sec11.categories.map((category) => ({
        ...category,
        models: (category.models || []).map((model) => ({ ...model, photo: images[index++] || standIn(model.name) })),
      })),
    };
    if (sec11.exampleVerdict?.model) {
      const [photo] = pick([[sec11.exampleVerdict.model]], { view: "side" });
      out.homeSec11.exampleVerdict = { ...sec11.exampleVerdict, photo };
    }
  }

  return out;
}

// Models with no photo of their own (the I-Pace) get a stand-in so their card is not empty.
function standIn(name = "") {
  return /\bi[\s\u2010-\u2015-]?pace\b/i.test(name) ? iPaceStandInImage() : null;
}

function assignPhotos(rows, pick, hintsFor, options) {
  const images = pick(rows.map(hintsFor), options);
  return rows.map((row, index) => ({ ...row, photo: images[index] || null }));
}
