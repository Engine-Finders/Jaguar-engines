import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");

/** App routes that must not be overridden by static HTML rewrites. */
const RESERVED = new Set(["quote"]);

function walkHtmlFiles(dir, relativeDir = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const rel = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...walkHtmlFiles(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith(".html")) {
      files.push(rel.replace(/\\/g, "/"));
    }
  }

  return files;
}

/** Build beforeFiles rewrites + canonical redirects for public/*.html assets. */
export function getPublicHtmlRoutes() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    return { rewrites: [], redirects: [] };
  }

  const rewrites = [];
  const redirects = [];

  for (const file of walkHtmlFiles(PUBLIC_DIR)) {
    const htmlPath = `/${file}`;
    const cleanPath = htmlPath.replace(/\.html$/, "");
    const slug = cleanPath.slice(1);

    if (!slug || RESERVED.has(slug.split("/")[0])) continue;

    rewrites.push({ source: cleanPath, destination: htmlPath });
    redirects.push({ source: htmlPath, destination: cleanPath, permanent: true });
  }

  return { rewrites, redirects };
}
