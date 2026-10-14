import {
  carModelFor,
  createCarPicker,
  engineImageFor,
  heroCarFor,
  iPaceStandInImage,
  landRoverImage,
  modelEngineImage,
} from "@/components/shared/carImage";

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

  if (out.hero) out.hero = { ...out.hero, model, heroCar: hero ? { src: hero.src, width: hero.width, height: hero.height } : null };

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
