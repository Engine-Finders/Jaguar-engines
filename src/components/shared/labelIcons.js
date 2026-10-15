// Icon key (homeIcons.js) for a piece of copy, so a label gets the icon that matches what it
// says instead of whichever icon sits at its position in a list. First matching rule wins.

function pick(rules, text, fallback) {
  const value = String(text ?? "").replace(/<[^>]*>/g, " ").toLowerCase();
  const rule = rules.find(([pattern]) => pattern.test(value));
  return rule ? rule[1] : fallback;
}

// Pre-purchase checks ("Cold Start - listen for rattle", "MOT History", ...).
const CHECK_RULES = [
  [/cold start|hot start/, "cold-start"],
  [/tappet/, "tappet"],
  [/noise|rattle|listen/, "hearing"],
  [/\bmot\b/, "calendar"],
  [/recall/, "check-watch"],
  [/warranty/, "shield"],
  [/warning light|misfire|\bcodes?\b|\becu\b|software/, "know-engine"],
  [/adblue/, "adblue"],
  [/\bdpf\b/, "dpf"],
  [/\begr\b/, "egr"],
  [/smoke|smell|running rich/, "smoke-check"],
  [/oil leak/, "oil-leak"],
  [/oil pressure|temperature gauge/, "diagnosis"],
  [/oil|dipstick|sludge/, "oil-consumption"],
  [/coolant|overheat|temperature/, "cooling-temp"],
  [/water pump|cooling|radiator|valley pipe/, "cooling"],
  [/turbo|boost|charge air|supercharg/, "turbo"],
  [/injector|hpfp|fuel/, "injector"],
  [/timing|tensioner|chain|belt/, "chain"],
  [/vvt|vct|valve/, "valve"],
  [/head gasket/, "head-gasket"],
  [/compression|nikasil|block type/, "compression"],
  [/crankshaft/, "crankshaft"],
  [/transfer case/, "transfer-box"],
  [/transmission|gearbox/, "gearbox"],
  [/hv battery|electric range|ev mode|mhev/, "ev"],
  [/battery|charging/, "battery"],
  [/electric|ignition/, "electrical"],
  [/air suspension/, "suspension"],
  [/steering/, "chassis"],
  [/rust|corrosion|sill|body|windscreen|seal/, "vehicle"],
  [/exhaust|inlet|vacuum/, "exhaust"],
  [/idle|running|performance|power|acceleration|response/, "diagnosis"],
  [/history/, "history"],
  [/engine|model year/, "engine"],
];

export function checkIconFor(text) {
  return pick(CHECK_RULES, text, "symptoms");
}

// Market intelligence figures ("Most Common Failure", "Peak Enquiry Season", ...).
const MARKET_RULES = [
  [/failure|problem|fault/, "fire"],
  [/mileage/, "diagnosis"],
  [/cost|price|£/, "pound-shield"],
  [/engine code|powertrain|engine/, "engine-codes-book"],
  [/season|peak|month/, "peak"],
  [/region|location|demand|area/, "location"],
  [/variant|model/, "car"],
  [/enquir|request/, "enquiries"],
];

export function marketIconFor(text) {
  return pick(MARKET_RULES, text, "real-inquiries");
}

// Technical specification rows ("Displacement", "Compression Ratio", ...).
const SPEC_RULES = [
  [/^cylinders?$|cylinder (count|layout)/, "cylinders"],
  [/compression/, "compression"],
  [/bore|stroke/, "piston"],
  [/fuel system|injection/, "injector"],
  [/turbo|supercharg|aspiration|induction/, "turbo"],
  [/valv|vvt|camshaft/, "valve"],
  [/timing/, "chain"],
  [/transmission|gearbox/, "gearbox"],
  [/drive|drivetrain/, "transfer-box"],
  [/oil/, "oil-consumption"],
  [/coolant/, "cooling-temp"],
  [/battery|electric|motor|range|mhev|system power|system torque/, "ev"],
  [/co2|euro|emission|\bdpf\b/, "exhaust"],
  [/economy|mpg/, "fuel"],
  [/ignition/, "electrical"],
  [/lifespan|production/, "history"],
  [/engine weight/, "engine"],
  [/weight|body/, "vehicle"],
  [/torque|power|speed|0.{1,3}6[02]|redline/, "diagnosis"],
  [/head/, "head-gasket"],
  [/block|construction|material/, "engine"],
];

export function specIconFor(text) {
  return pick(SPEC_RULES, text, "engine");
}

// Buyer profiles ("Daily Commuter", "Towing & Working Use", ...).
const BUYER_RULES = [
  [/family/, "best-family"],
  [/commut|daily/, "commuter"],
  [/tow|working/, "towing"],
  [/budget/, "pound-shield"],
  [/enthusiast|weekend/, "heart"],
  [/performance|sports/, "diagnosis"],
  [/first.?time premium|premium/, "premium"],
  [/first.?time/, "like"],
  [/collector|keeper|long.?term/, "history"],
];

export function buyerIconFor(text) {
  return pick(BUYER_RULES, text, "car");
}
