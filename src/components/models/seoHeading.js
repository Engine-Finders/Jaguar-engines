/*
 * Two-tone split for the approved SEO section headings (model pages): the first part in the text colour,
 * the rest in the silver accent. Works on the plain heading text (no HTML).
 *
 *   "Jaguar E-Pace Engine Codes: Specifications & Reliability"  -> "Jaguar E-Pace Engine Codes:" | "Specifications & Reliability"
 *   "Which Jaguar XE Should You Buy? Engine & Ownership Considerations" -> "Which Jaguar XE Should You Buy?" | "Engine & …"
 *   "Jaguar XF Engine Replacement Costs - By Generation"      -> "Jaguar XF Engine Replacement Costs –" | "By Generation"
 *   "Jaguar E-Pace Engine Reliability & Ownership Verdict"    -> "Jaguar E-Pace" | "Engine Reliability & Ownership Verdict"
 *
 * The two parts are always rendered with a space between them, so the heading text reads correctly.
 */
export function splitHeading(text = "") {
  const clean = String(text ?? "").replace(/\s+/g, " ").trim();

  const colon = clean.indexOf(": ");
  if (colon > 0) return { lead: clean.slice(0, colon + 1), accent: clean.slice(colon + 2) };

  const question = clean.indexOf("? ");
  if (question > 0) return { lead: clean.slice(0, question + 1), accent: clean.slice(question + 2) };

  const dash = clean.match(/^(.*?)\s+[-–—]\s+(.*)$/);
  if (dash) return { lead: `${dash[1]}\u00a0–`, accent: dash[2] };

  const engine = clean.search(/\sEngine\s/);
  if (engine > 0) return { lead: clean.slice(0, engine), accent: clean.slice(engine + 1) };

  return { lead: clean, accent: "" };
}

/** "Jaguar E-Pace Engine Problems: …" / "Which Jaguar XE Should You Buy? …" -> "E-Pace" / "XE". */
export function modelFromHeading(text = "") {
  const clean = String(text ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const which = clean.match(/^Which\s+(?:Jaguar\s+)?(.+?)\s+Should You Buy\?/i);
  if (which) return which[1];
  const lead = clean.replace(/^(?:Common|Why|How the)\s+/i, "").replace(/^Jaguar\s+/i, "");
  return lead.split(/\s+(?:Engines?|Drive Unit|Generations|at a Glance|Frequently|Owners|-|–|—)(?:\s|:|$)/i)[0].trim();
}
