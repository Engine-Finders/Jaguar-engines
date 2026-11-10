// Apply a text transform only to the text between HTML tags, never inside them, so typographic
// fixes (en / em dashes) cannot rewrite link addresses such as href='/engine/ajd4-204dtd'.
export function outsideTags(html = "", transform) {
  return String(html)
    .split(/(<[^>]*>)/g)
    .map((part) => (part.startsWith("<") ? part : transform(part)))
    .join("");
}

// Plain text of an HTML snippet (for link labels that must not contain nested links).
export function stripTags(html = "") {
  return String(html).replace(/<[^>]*>/g, "");
}
