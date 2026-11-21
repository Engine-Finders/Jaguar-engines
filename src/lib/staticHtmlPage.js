import fs from "fs";
import path from "path";

/*
 * Essential (static) pages: the hand-written HTML guides in public/ (symptoms, fault codes, warning lights,
 * technical, tools, …). Same approach as the BMW site: each page is read on the server, its own nav,
 * footer and scripts are dropped, and it is rendered inside the normal site layout (Navbar + Footer) by
 * StaticHtmlViewer, with the homepage-style hero (reg plate + CTA that opens the lead form).
 */

const PUBLIC_DIR = path.join(process.cwd(), "public");
const SITE = "https://jaguarengines.uk";

// Image / asset folders in public/ (no pages inside).
const SKIP_DIRS = new Set([
  "assets",
  "cars",
  "engines",
  "generation",
  "hero",
  "home-image",
  "model",
  "320d",
  "e90",
  "Jaguar Black",
  "Jaguar Silver",
]);

// App routes that must never be shadowed by a static page.
const RESERVED = new Set(["quote", "leads", "blog", "api", "privacy-policy", "terms-and-conditions", "cookies-policy"]);

/** All static page slugs (as segment arrays) for generateStaticParams. */
export function getAllStaticHtmlSlugs() {
  if (!fs.existsSync(PUBLIC_DIR)) return [];
  const slugs = [];

  function walk(dir, rel = "") {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const currentRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (!rel && SKIP_DIRS.has(entry.name)) continue;
        walk(path.join(dir, entry.name), currentRel);
      } else if (entry.name.endsWith(".html")) {
        // Empty files are not pages (they 404 instead of serving a blank page).
        if (fs.statSync(path.join(dir, entry.name)).size === 0) continue;
        const clean = currentRel.replace(/\.html$/, "");
        if (clean === "index" || RESERVED.has(clean.split("/")[0])) continue;
        slugs.push(clean.split("/"));
      }
    }
  }

  walk(PUBLIC_DIR);
  return slugs;
}

// Interactive widget placed inside the old hero (value checker, VIN decoder): from its input row to the
// end of the hero copy, with the div tags rebalanced. Returned so it can stay on the page.
function heroWidget(headerHtml) {
  const start = headerHtml.search(/<div\s+class=["'][^"']*\btool-input-row\b/i);
  if (start < 0) return "";
  let end = headerHtml.search(/<div\s+class=["'][^"']*\b(?:hero-rule|stat-strip|stat-strip-light)\b/i);
  if (end < start) end = headerHtml.length;
  let block = headerHtml.slice(start, end).trim();
  const opens = (block.match(/<div\b/gi) || []).length;
  let extra = (block.match(/<\/div>/gi) || []).length - opens;
  while (extra > 0 && /<\/div>\s*$/i.test(block)) {
    block = block.replace(/<\/div>\s*$/i, "").trim();
    extra -= 1;
  }
  return block;
}

// The balanced <div …>…</div> block starting at `start` (div tags counted).
function divBlock(html, start) {
  const tag = /<\/?div\b[^>]*>/gi;
  tag.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tag.exec(html)) !== null) {
    depth += match[0][1] === "/" ? -1 : 1;
    if (depth === 0) return html.slice(start, tag.lastIndex);
  }
  return "";
}

// Comparison pages open with a "204DTD | AJ126" split panel (its own H2s) above the title: kept in the content.
function heroComparePanel(headerHtml) {
  const start = headerHtml.search(/<div\s+class=["'][^"']*\bhero-inner\b/i);
  if (start < 0) return "";
  const block = divBlock(headerHtml, start);
  return /<h2\b/i.test(block) && !/<h1\b/i.test(block) ? block : "";
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", ndash: "\u2013", mdash: "\u2014", pound: "\u00a3", rsquo: "\u2019", lsquo: "\u2018", rdquo: "\u201d", ldquo: "\u201c", hellip: "\u2026" };

// Head values are HTML-encoded in the files; Next.js encodes metadata again, so decode them first.
function decodeEntities(text) {
  if (!text) return text;
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, name) => {
    if (name[0] === "#") {
      const code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return ENTITIES[name.toLowerCase()] ?? whole;
  });
}

// A few pages were copied from the Land Rover site and still point at its domain: their URLs point here
// instead, and their share images (Land Rover files, not on this site) fall back to the site's share image.
const LR_DOMAIN = /https?:\/\/(?:www\.)?landroverengine\.uk/g;
const ownSite = (value) => value?.replace(LR_DOMAIN, SITE);
const shareImage = (url) => (url && /landroverengine\.uk/i.test(url) ? "/og-share.webp" : url);

function attr(html, pattern) {
  const match = html.match(pattern);
  return match ? decodeEntities(match[match.length - 1]?.trim()) : undefined;
}

/** Reads and splits one static page (by slug segments): metadata, hero, body. Null when there is none. */
export async function getStaticHtmlPage(slugSegments) {
  if (!slugSegments?.length) return null;
  if (RESERVED.has(slugSegments[0])) return null;
  if (slugSegments.some((segment) => segment.includes("..") || segment.includes("\\"))) return null;

  const rel = slugSegments.join("/");
  let targetPath = path.join(PUBLIC_DIR, `${rel}.html`);
  if (!targetPath.startsWith(PUBLIC_DIR)) return null;
  if (!fs.existsSync(targetPath)) {
    targetPath = path.join(PUBLIC_DIR, rel, "index.html");
    if (!fs.existsSync(targetPath)) return null;
  }

  const fileHtml = fs.readFileSync(targetPath, "utf8");
  if (!fileHtml.trim()) return null;
  // HTML comments never render (some pages keep a commented-out JSON-LD block), so drop them first.
  const rawHtml = fileHtml.replace(/<!--[\s\S]*?-->/g, "");

  // --- 1. Head metadata (kept exactly as the page declares it) ---
  const title = attr(rawHtml, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description =
    attr(rawHtml, /<meta\s+name=["']description["']\s+content=(["'])([\s\S]*?)\1/i) ||
    attr(rawHtml, /<meta\s+content=(["'])([\s\S]*?)\1\s+name=["']description["']/i);
  const canonical = ownSite(
    attr(rawHtml, /<link\s+rel=["']canonical["']\s+href=(["'])([\s\S]*?)\1/i) ||
      attr(rawHtml, /<link\s+href=(["'])([\s\S]*?)\1\s+rel=["']canonical["']/i) ||
      `${SITE}/${rel}`,
  );

  const ogTitle = attr(rawHtml, /<meta\s+property=["']og:title["']\s+content=(["'])([\s\S]*?)\1/i);
  const ogDesc = attr(rawHtml, /<meta\s+property=["']og:description["']\s+content=(["'])([\s\S]*?)\1/i);
  const ogImage = shareImage(attr(rawHtml, /<meta\s+property=["']og:image["']\s+content=(["'])([\s\S]*?)\1/i));
  const ogUrl = ownSite(attr(rawHtml, /<meta\s+property=["']og:url["']\s+content=(["'])([\s\S]*?)\1/i));
  const twTitle = attr(rawHtml, /<meta\s+name=["']twitter:title["']\s+content=(["'])([\s\S]*?)\1/i);
  const twDesc = attr(rawHtml, /<meta\s+name=["']twitter:description["']\s+content=(["'])([\s\S]*?)\1/i);
  const twImage = shareImage(attr(rawHtml, /<meta\s+name=["']twitter:image["']\s+content=(["'])([\s\S]*?)\1/i));

  // JSON-LD structured data, as written in the page
  const jsonLd = [];
  const jsonLdRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let jsonMatch;
  while ((jsonMatch = jsonLdRegex.exec(rawHtml)) !== null) {
    const jsonStr = jsonMatch[1].trim();
    if (jsonStr) jsonLd.push(ownSite(jsonStr));
  }

  // --- 2. Body: drop the page's own nav, footer and scripts (the site layout provides them) ---
  let body = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? rawHtml;

  // Inline page scripts (the interactive tools: calculators, VIN decoder, …) are kept and run by the viewer
  // after the content mounts. External scripts (the old effects.js) are not needed in the site layout.
  const scripts = [];
  const inlineRegex = /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi;
  let inline;
  while ((inline = inlineRegex.exec(body)) !== null) {
    if (inline[1].trim()) scripts.push(inline[1]);
  }

  body = body
    .replace(/<nav\s+class=["'][^"']*site-nav[^"']*["'][\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");

  // --- 3. Hero (eyebrow, H1, sub, stats, image) and the rest of the page ---
  const hero = { breadcrumb: "", eyebrow: "", h1: "", h1Plain: "", sub: "", subHtml: "", stats: [], image: "" };
  let bodyContent = body.trim();

  const headerMatch = body.match(/<header[^>]*class=["'][^"']*\bhero\b[^"']*["'][^>]*>([\s\S]*?)<\/header>/i);
  if (headerMatch) {
    const headerHtml = headerMatch[1];
    // The breadcrumb above the hero moves into the new hero; anything else before it is kept in the body.
    const before = body.slice(0, body.indexOf(headerMatch[0]));
    const crumb = before.match(/<div\s+class=["'][^"']*\bbreadcrumb\b[^"']*["'][^>]*>[\s\S]*?<\/div>/i);
    if (crumb) hero.breadcrumb = crumb[0];
    bodyContent = body.replace(headerMatch[0], "").replace(crumb ? crumb[0] : "", "").trim();
    // A tool widget that lived in the old hero stays, first thing in the page content.
    const widget = heroWidget(headerHtml);
    if (widget) bodyContent = `<div class="tool-panel tool-panel--hero">${widget}</div>${bodyContent}`;
    const compare = heroComparePanel(headerHtml);
    if (compare) bodyContent = `<div class="compare-vs">${compare}</div>${bodyContent}`;

    const eyebrow = headerHtml.match(/class=["'][^"']*(?:eyebrow|hero__eyebrow|hero-eyebrow|severity-badge)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|p|div)>/i);
    if (eyebrow) hero.eyebrow = decodeEntities(eyebrow[1].replace(/<[^>]+>/g, "").trim());

    const h1 = headerHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1) {
      hero.h1 = h1[1].trim();
      hero.h1Plain = decodeEntities(hero.h1.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
    }

    const sub = headerHtml.match(/<p\s+class=["'][^"']*(?:\bsub\b|hero__subheadline|lead)[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
    if (sub) {
      hero.sub = decodeEntities(sub[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
      // Inline markup kept (links, emphasis); anything else is reduced to its text.
      hero.subHtml = sub[1]
        .replace(/<(?!\/?(?:a|strong|em|b|i|br)\b)[^>]+>/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    const stats = [];
    const statRegex =
      /<div\s+class=["'][^"']*stat-(?:cell|item)[^"']*["'][^>]*>[\s\S]*?<(?:div|span)\s+class=["'][^"']*stat-num(?:ber)?[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|span)>[\s\S]*?<(?:div|span)\s+class=["'][^"']*stat-label[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|span)>/gi;
    let stat;
    while ((stat = statRegex.exec(headerHtml)) !== null) {
      stats.push({
        figure: decodeEntities(stat[1].replace(/<[^>]+>/g, "").trim()),
        label: decodeEntities(stat[2].replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()),
      });
    }
    hero.stats = stats;

    // The page's own hero image when it exists in public/; otherwise the viewer uses the site's hero car.
    const src = headerHtml.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
    if (src && fs.existsSync(path.join(PUBLIC_DIR, src.replace(/^\//, "")))) hero.image = src;
  }

  // Images whose file is not in public/ (old hero art never added) would only 404: drop them.
  bodyContent = bodyContent.replace(/<img\b[^>]*\bsrc=["'](\/[^"']+)["'][^>]*>/gi, (tag, src) => {
    let file = src.split(/[?#]/)[0];
    try {
      file = decodeURIComponent(file);
    } catch {
      return tag;
    }
    return fs.existsSync(path.join(PUBLIC_DIR, file.replace(/^\//, ""))) ? tag : "";
  });

  return {
    metadata: {
      title: title || undefined,
      description: description || undefined,
      alternates: { canonical },
      openGraph: {
        title: ogTitle || title,
        description: ogDesc || description,
        url: ogUrl || canonical,
        images: ogImage ? [{ url: ogImage }] : undefined,
        siteName: "JaguarEngines.uk",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: twTitle || title,
        description: twDesc || description,
        images: twImage ? [twImage] : undefined,
      },
    },
    hero,
    bodyContent,
    jsonLd,
    scripts,
  };
}
