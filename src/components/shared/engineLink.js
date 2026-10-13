// Engine code / family text -> engine page (slugs from src/data/registery/engines/pages.json).
// First match wins, so the more specific patterns come first.
const ENGINE_PAGES = [
  [/aj[\s‑-]?v8/, "/engine/aj-v8-4-0-4-2"],
  [/\baj133\b|\b508pn\b|\b508ps\b/, "/engine/aj133"],
  [/\baj126\b|\b306ps\b/, "/engine/306dt-306ps"],
  [/ajd[\s‑-]?v6|tdv6|\b276dt\b|\b306dt\b|\bajv6d\b/, "/engine/ajd-v6-diesel"],
  [/aj[\s‑-]?v6/, "/engine/aj-v6-petrol"],
  [/\baj20d6\b/, "/engine/aj20d6"],
  [/\baj20p6\b/, "/engine/aj20p6"],
  [/\bp510\b/, "/engine/p510"],
  [/\bajd4\b|\b224dt\b/, "/engine/ajd4-204dtd"],
  [/ingenium.*diesel|\baj200d\b|\b204dtd\b/, "/engine/ingenium-2-0-diesel"],
  [/ingenium|\b204pt\b|\baj200p\b/, "/engine/ingenium-20-petrol"],
  [/\bv12\b/, "/engine/v12-he"],
  [/\baj6\b|\baj16\b/, "/engine/aj6-aj16"],
  [/\bxk6\b|straight[\s‑-]?six/, "/engine/xk-straight-six"],
];

/** Engine page for free text such as "AJ133" or "AJ200D Ingenium diesel"; the engine database otherwise. */
export function engineHrefFor(...hints) {
  const text = hints
    .filter(Boolean)
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .toLowerCase();
  return ENGINE_PAGES.find(([pattern]) => pattern.test(text))?.[1] || "/engine";
}
