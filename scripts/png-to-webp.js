/**
 * Convert PNGs to WebP without quality loss (lossless).
 * Usage: node scripts/png-to-webp.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");

const JOBS = [
  // Navbar / footer / favicon source
  {
    from: path.join(ROOT, "public", "png", "Icon.png"),
    to: path.join(ROOT, "public", "jaguar-logo.webp"),
  },
  // WhatsApp / social Open Graph share image
  {
    from: path.join(ROOT, "public", "png", "123.PNG"),
    to: path.join(ROOT, "public", "og-share.webp"),
  },
];

async function convert({ from, to }) {
  if (!fs.existsSync(from)) {
    throw new Error(`Missing source: ${from}`);
  }
  await sharp(from).webp({ lossless: true }).toFile(to);
  const src = fs.statSync(from).size;
  const out = fs.statSync(to).size;
  console.log(`${path.relative(ROOT, from)} → ${path.relative(ROOT, to)} (${src} → ${out} bytes)`);
}

(async () => {
  for (const job of JOBS) {
    await convert(job);
  }
  console.log("Done.");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
