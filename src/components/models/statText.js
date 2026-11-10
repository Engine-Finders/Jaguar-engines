// Shared parsing for the model-page stat strips (hero trust strip, ownership verdict summary).
const VERIFIED = /\[?JAG-VERIFIED\]?/;

/**
 * "140+ Enquiries (2025) [JAG-VERIFIED]" -> { value: "140+", label: "Enquiries (2025)", verified: true }
 * "Part of Engine Finders"               -> { prefix: "Part of", label: "Engine Finders" }
 */
export function splitStat(item) {
  const text = String(item?.label || "").trim();
  const verified = VERIFIED.test(text);
  const main = text.replace(VERIFIED, "").replace(/\s+[-–—]\s*$/, "").trim();
  const [first, ...rest] = main.split(" ");

  if (/\d/.test(first)) return { value: first, label: rest.join(" "), verified };
  const prefix = main.match(/^(Part of)\s+(.*)$/i);
  if (prefix) return { prefix: prefix[1], label: prefix[2], verified };
  return { label: main, verified };
}
