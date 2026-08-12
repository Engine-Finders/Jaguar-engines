const fs = require("fs");
const path = require("path");

const urls = `
https://bmwengines.uk/1-series
https://bmwengines.uk/1-series/114d
https://bmwengines.uk/1-series/114i
https://bmwengines.uk/1-series/116d
https://bmwengines.uk/1-series/116i
https://bmwengines.uk/1-series/118d
https://bmwengines.uk/1-series/118i
https://bmwengines.uk/1-series/120
https://bmwengines.uk/1-series/120d
https://bmwengines.uk/1-series/120i
https://bmwengines.uk/1-series/123d
https://bmwengines.uk/1-series/125d
https://bmwengines.uk/1-series/125i
https://bmwengines.uk/1-series/128ti
https://bmwengines.uk/1-series/130i
https://bmwengines.uk/1-series/135i
https://bmwengines.uk/1-series/e81
https://bmwengines.uk/1-series/e82
https://bmwengines.uk/1-series/e87
https://bmwengines.uk/1-series/e88
https://bmwengines.uk/1-series/f20
https://bmwengines.uk/1-series/f21
https://bmwengines.uk/1-series/f40
https://bmwengines.uk/1-series/f70
https://bmwengines.uk/1-series/m135i
https://bmwengines.uk/1-series/m140i
https://bmwengines.uk/2-series
https://bmwengines.uk/2-series/214d
https://bmwengines.uk/2-series/216d
https://bmwengines.uk/2-series/216i
https://bmwengines.uk/2-series/218d
https://bmwengines.uk/2-series/218i
https://bmwengines.uk/2-series/220d
https://bmwengines.uk/2-series/220i
https://bmwengines.uk/2-series/223i
https://bmwengines.uk/2-series/225xe
https://bmwengines.uk/2-series/230i
https://bmwengines.uk/2-series/e10
https://bmwengines.uk/2-series/f22
https://bmwengines.uk/2-series/f23
https://bmwengines.uk/2-series/f44
https://bmwengines.uk/2-series/f45
https://bmwengines.uk/2-series/f46
https://bmwengines.uk/2-series/f74
https://bmwengines.uk/2-series/g42
https://bmwengines.uk/2-series/m235i
https://bmwengines.uk/2-series/m240i
https://bmwengines.uk/2-series/u06
https://bmwengines.uk/2002
https://bmwengines.uk/2002/variants
https://bmwengines.uk/3-series
https://bmwengines.uk/3-series/316
https://bmwengines.uk/3-series/316d
https://bmwengines.uk/3-series/316i
https://bmwengines.uk/3-series/318d
https://bmwengines.uk/3-series/318i
https://bmwengines.uk/3-series/318is
https://bmwengines.uk/3-series/318tds
https://bmwengines.uk/3-series/318ti
https://bmwengines.uk/3-series/320d
https://bmwengines.uk/3-series/320e
https://bmwengines.uk/3-series/320i
https://bmwengines.uk/3-series/320si
https://bmwengines.uk/3-series/323i
https://bmwengines.uk/3-series/324d
https://bmwengines.uk/3-series/325d
https://bmwengines.uk/3-series/325e
https://bmwengines.uk/3-series/325i
https://bmwengines.uk/3-series/328i
https://bmwengines.uk/3-series/330d
https://bmwengines.uk/3-series/330e
https://bmwengines.uk/3-series/330i
https://bmwengines.uk/3-series/335d
https://bmwengines.uk/3-series/335i
https://bmwengines.uk/3-series/340i
https://bmwengines.uk/3-series/activehybrid3
https://bmwengines.uk/3-series/e21
https://bmwengines.uk/3-series/e30
https://bmwengines.uk/3-series/e36
https://bmwengines.uk/3-series/e36-compact
https://bmwengines.uk/3-series/e46
https://bmwengines.uk/3-series/e46-compact
https://bmwengines.uk/3-series/e90
https://bmwengines.uk/3-series/e91
https://bmwengines.uk/3-series/e92
https://bmwengines.uk/3-series/e93
https://bmwengines.uk/3-series/f30
https://bmwengines.uk/3-series/f31
https://bmwengines.uk/3-series/f34
https://bmwengines.uk/3-series/g20
https://bmwengines.uk/3-series/g21
https://bmwengines.uk/3-series/m340d
https://bmwengines.uk/3-series/m340i
https://bmwengines.uk/4-series
https://bmwengines.uk/4-series/418d
https://bmwengines.uk/4-series/418i
https://bmwengines.uk/4-series/420d
https://bmwengines.uk/4-series/420i
https://bmwengines.uk/4-series/425d
https://bmwengines.uk/4-series/428i
https://bmwengines.uk/4-series/430d
https://bmwengines.uk/4-series/430i
https://bmwengines.uk/4-series/435d
https://bmwengines.uk/4-series/435i
https://bmwengines.uk/4-series/440i
https://bmwengines.uk/4-series/f32
https://bmwengines.uk/4-series/f33
https://bmwengines.uk/4-series/f36
https://bmwengines.uk/4-series/g22
https://bmwengines.uk/4-series/g23
https://bmwengines.uk/4-series/g26
https://bmwengines.uk/4-series/m440d
https://bmwengines.uk/4-series/m440i
https://bmwengines.uk/5-series
https://bmwengines.uk/5-series/518d
https://bmwengines.uk/5-series/518i
https://bmwengines.uk/5-series/520d
https://bmwengines.uk/5-series/520e
https://bmwengines.uk/5-series/520i
https://bmwengines.uk/5-series/523i
https://bmwengines.uk/5-series/524td-524d
https://bmwengines.uk/5-series/525d
https://bmwengines.uk/5-series/525e
https://bmwengines.uk/5-series/525i
https://bmwengines.uk/5-series/525td
https://bmwengines.uk/5-series/528i
https://bmwengines.uk/5-series/530d
https://bmwengines.uk/5-series/530e
https://bmwengines.uk/5-series/530i
https://bmwengines.uk/5-series/535d
https://bmwengines.uk/5-series/535i
https://bmwengines.uk/5-series/540d
https://bmwengines.uk/5-series/540i
https://bmwengines.uk/5-series/545e
https://bmwengines.uk/5-series/545i
https://bmwengines.uk/5-series/550i
https://bmwengines.uk/5-series/e12
https://bmwengines.uk/5-series/e28
https://bmwengines.uk/5-series/e34
https://bmwengines.uk/5-series/e39
https://bmwengines.uk/5-series/e60
https://bmwengines.uk/5-series/e61
https://bmwengines.uk/5-series/f07
https://bmwengines.uk/5-series/f10
https://bmwengines.uk/5-series/f11
https://bmwengines.uk/5-series/g30
https://bmwengines.uk/5-series/g31
https://bmwengines.uk/5-series/g60
https://bmwengines.uk/5-series/g61
https://bmwengines.uk/5-series/m550d
https://bmwengines.uk/5-series/m550i
https://bmwengines.uk/6-series
https://bmwengines.uk/6-series/620d
https://bmwengines.uk/6-series/628-635csi
https://bmwengines.uk/6-series/630d
https://bmwengines.uk/6-series/630i
https://bmwengines.uk/6-series/635d
https://bmwengines.uk/6-series/640d
https://bmwengines.uk/6-series/640i
https://bmwengines.uk/6-series/645ci
https://bmwengines.uk/6-series/650i
https://bmwengines.uk/6-series/e24
https://bmwengines.uk/6-series/e63
https://bmwengines.uk/6-series/e64
https://bmwengines.uk/6-series/f06
https://bmwengines.uk/6-series/f12
https://bmwengines.uk/6-series/f13
https://bmwengines.uk/6-series/g32
https://bmwengines.uk/7-series
https://bmwengines.uk/7-series/725tds
https://bmwengines.uk/7-series/728i
https://bmwengines.uk/7-series/730d
https://bmwengines.uk/7-series/730i
https://bmwengines.uk/7-series/735i
https://bmwengines.uk/7-series/740d
https://bmwengines.uk/7-series/740i
https://bmwengines.uk/7-series/745e
https://bmwengines.uk/7-series/745i
https://bmwengines.uk/7-series/750e
https://bmwengines.uk/7-series/750i
https://bmwengines.uk/7-series/760i
https://bmwengines.uk/7-series/e23
https://bmwengines.uk/7-series/e32
https://bmwengines.uk/7-series/e38
https://bmwengines.uk/7-series/e65-e66
https://bmwengines.uk/7-series/f01-f02
https://bmwengines.uk/7-series/g11-g12
https://bmwengines.uk/7-series/g70
https://bmwengines.uk/8-series
https://bmwengines.uk/8-series/840ci
https://bmwengines.uk/8-series/840d
https://bmwengines.uk/8-series/840i
https://bmwengines.uk/8-series/850csi
https://bmwengines.uk/8-series/850i-850ci
https://bmwengines.uk/8-series/e31
https://bmwengines.uk/8-series/g14
https://bmwengines.uk/8-series/g15
https://bmwengines.uk/8-series/g16
https://bmwengines.uk/8-series/m850i
https://bmwengines.uk/i-series-electric-motors
https://bmwengines.uk/m1
https://bmwengines.uk/m1/35
https://bmwengines.uk/m1/e26
https://bmwengines.uk/m2
https://bmwengines.uk/m2/f87
https://bmwengines.uk/m2/g87
https://bmwengines.uk/m3
https://bmwengines.uk/m3/e30
https://bmwengines.uk/m3/e36
https://bmwengines.uk/m3/e46
https://bmwengines.uk/m3/e90-e92-e93
https://bmwengines.uk/m3/f80
https://bmwengines.uk/m3/g80-g81
https://bmwengines.uk/m4
https://bmwengines.uk/m4/f82-f83
https://bmwengines.uk/m4/g82-g83
https://bmwengines.uk/m5
https://bmwengines.uk/m5/e28
https://bmwengines.uk/m5/e34
https://bmwengines.uk/m5/e39
https://bmwengines.uk/m5/e60-e61
https://bmwengines.uk/m5/f10
https://bmwengines.uk/m5/f90
https://bmwengines.uk/m5/g90-g99
https://bmwengines.uk/m6
https://bmwengines.uk/m6/e24
https://bmwengines.uk/m6/e63-e64
https://bmwengines.uk/m6/f06-f12-f13
https://bmwengines.uk/m8
https://bmwengines.uk/m8/f91-f92-f93
https://bmwengines.uk/x1
https://bmwengines.uk/x1/16d
https://bmwengines.uk/x1/18d
https://bmwengines.uk/x1/18i
https://bmwengines.uk/x1/20d
https://bmwengines.uk/x1/20i
https://bmwengines.uk/x1/23d
https://bmwengines.uk/x1/23i
https://bmwengines.uk/x1/25d
https://bmwengines.uk/x1/25e-30e
https://bmwengines.uk/x1/28i
https://bmwengines.uk/x1/28i-xdrive
https://bmwengines.uk/x1/e84
https://bmwengines.uk/x1/f48
https://bmwengines.uk/x1/u11
https://bmwengines.uk/x2
https://bmwengines.uk/x2/18d
https://bmwengines.uk/x2/18i
https://bmwengines.uk/x2/20d
https://bmwengines.uk/x2/20i
https://bmwengines.uk/x2/f39
https://bmwengines.uk/x2/m35i
https://bmwengines.uk/x2/u10
https://bmwengines.uk/x2/xdrive25e
https://bmwengines.uk/x3
https://bmwengines.uk/x3/18d
https://bmwengines.uk/x3/20d
https://bmwengines.uk/x3/20d-xdrive
https://bmwengines.uk/x3/20i
https://bmwengines.uk/x3/28i
https://bmwengines.uk/x3/30d
https://bmwengines.uk/x3/30d-30sd
https://bmwengines.uk/x3/30e
https://bmwengines.uk/x3/30e-xdrive
https://bmwengines.uk/x3/30i
https://bmwengines.uk/x3/35d
https://bmwengines.uk/x3/35i
https://bmwengines.uk/x3/e83
https://bmwengines.uk/x3/e83-petrol
https://bmwengines.uk/x3/f25
https://bmwengines.uk/x3/g01
https://bmwengines.uk/x3/g45
https://bmwengines.uk/x3/m40i
https://bmwengines.uk/x4
https://bmwengines.uk/x4/20d
https://bmwengines.uk/x4/20i
https://bmwengines.uk/x4/30d
https://bmwengines.uk/x4/35d
https://bmwengines.uk/x4/f26
https://bmwengines.uk/x4/g02
https://bmwengines.uk/x4/m40d
https://bmwengines.uk/x4/m40i
https://bmwengines.uk/x5
https://bmwengines.uk/x5/25d
https://bmwengines.uk/x5/30i
https://bmwengines.uk/x5/30sd-35d
https://bmwengines.uk/x5/30si
https://bmwengines.uk/x5/40i
https://bmwengines.uk/x5/44i
https://bmwengines.uk/x5/46is-48is
https://bmwengines.uk/x5/e53
https://bmwengines.uk/x5/e70
https://bmwengines.uk/x5/f15
https://bmwengines.uk/x5/g05
https://bmwengines.uk/x5/m50d
https://bmwengines.uk/x5/m50i-m60i
https://bmwengines.uk/x5/x5-m
https://bmwengines.uk/x5/xdrive30d
https://bmwengines.uk/x5/xdrive35i
https://bmwengines.uk/x5/xdrive40d
https://bmwengines.uk/x5/xdrive40e
https://bmwengines.uk/x5/xdrive45e
https://bmwengines.uk/x5/xdrive50e
https://bmwengines.uk/x5/xdrive50i
https://bmwengines.uk/x6
https://bmwengines.uk/x6/35i-40i
https://bmwengines.uk/x6/e71
https://bmwengines.uk/x6/f16
https://bmwengines.uk/x6/g06
https://bmwengines.uk/x6/m50d
https://bmwengines.uk/x6/m50i-m60i
https://bmwengines.uk/x6/x6-m
https://bmwengines.uk/x6/xdrive30d
https://bmwengines.uk/x6/xdrive35d-40d
https://bmwengines.uk/x6/xdrive50i
https://bmwengines.uk/x7
https://bmwengines.uk/x7/40i
https://bmwengines.uk/x7/g07
https://bmwengines.uk/x7/m50d
https://bmwengines.uk/x7/m50i-m60i
https://bmwengines.uk/x7/xdrive30d
https://bmwengines.uk/x7/xdrive40d
https://bmwengines.uk/xm
https://bmwengines.uk/z-series
https://bmwengines.uk/z-series/z1
https://bmwengines.uk/z-series/z1-25
https://bmwengines.uk/z-series/z3-18-19
https://bmwengines.uk/z-series/z3-20-22i
https://bmwengines.uk/z-series/z3-28-30i
https://bmwengines.uk/z-series/z3-e36-7
https://bmwengines.uk/z-series/z3-e36-8
https://bmwengines.uk/z-series/z3-m
https://bmwengines.uk/z-series/z4-18i-20i
https://bmwengines.uk/z-series/z4-20i-22i
https://bmwengines.uk/z-series/z4-23i
https://bmwengines.uk/z-series/z4-25i-25si
https://bmwengines.uk/z-series/z4-30i-30si
https://bmwengines.uk/z-series/z4-e85
https://bmwengines.uk/z-series/z4-e86
https://bmwengines.uk/z-series/z4-e89
https://bmwengines.uk/z-series/z4-g29
https://bmwengines.uk/z-series/z4-m40i
https://bmwengines.uk/z-series/z4-sdrive28i-30i
https://bmwengines.uk/z-series/z4-sdrive35i-35is
https://bmwengines.uk/z-series/z4-z4m
https://bmwengines.uk/z-series/z8-49
https://bmwengines.uk/z-series/z8-e52
`.trim().split(/\n+/).map((u) => u.trim()).filter(Boolean);

function isGenerationSlug(slug) {
  if (!slug) return false;
  if (slug === "variants") return false;
  // chassis codes: e81, f20, g42, u06, e65-e66, f01-f02, e90-e92-e93, e36-compact, e83-petrol
  if (/^(e|f|g|u)\d/i.test(slug)) return true;
  if (/-(e|f|g|u)\d/i.test(slug)) return true; // z3-e36-7, z4-e85, z4-g29, z8-e52
  return false;
}

function labelFromSlug(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bE(\d)/g, "E$1")
    .replace(/\bF(\d)/g, "F$1")
    .replace(/\bG(\d)/g, "G$1")
    .replace(/\bU(\d)/g, "U$1")
    .replace(/\bM(\d)/g, "M$1")
    .replace(/\bXdrive/gi, "xDrive")
    .replace(/\bSdrive/gi, "sDrive");
}

const modelMeta = {
  "1-series": { label: "1 Series", group: "Saloons & Tourers" },
  "2-series": { label: "2 Series", group: "Saloons & Tourers" },
  "3-series": { label: "3 Series", group: "Saloons & Tourers" },
  "4-series": { label: "4 Series", group: "Saloons & Tourers" },
  "5-series": { label: "5 Series", group: "Saloons & Tourers" },
  "6-series": { label: "6 Series", group: "Saloons & Tourers" },
  "7-series": { label: "7 Series", group: "Saloons & Tourers" },
  "8-series": { label: "8 Series", group: "Saloons & Tourers" },
  x1: { label: "X1", group: "SUV (X)" },
  x2: { label: "X2", group: "SUV (X)" },
  x3: { label: "X3", group: "SUV (X)" },
  x4: { label: "X4", group: "SUV (X)" },
  x5: { label: "X5", group: "SUV (X)" },
  x6: { label: "X6", group: "SUV (X)" },
  x7: { label: "X7", group: "SUV (X)" },
  m1: { label: "M1", group: "M Performance" },
  m2: { label: "M2", group: "M Performance" },
  m3: { label: "M3", group: "M Performance" },
  m4: { label: "M4", group: "M Performance" },
  m5: { label: "M5", group: "M Performance" },
  m6: { label: "M6", group: "M Performance" },
  m8: { label: "M8", group: "M Performance" },
  "z-series": { label: "Z Series", group: "Other" },
  "2002": { label: "2002", group: "Other" },
  "i-series-electric-motors": { label: "i Series", group: "Other" },
  xm: { label: "XM", group: "Other" },
};

const models = {};

for (const url of urls) {
  const pathname = url.replace("https://bmwengines.uk", "") || "/";
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) continue;
  const root = parts[0];
  if (!modelMeta[root]) continue;

  if (!models[root]) {
    models[root] = {
      label: modelMeta[root].label,
      href: `/${root}`,
      group: modelMeta[root].group,
      variants: [],
      generations: [],
    };
  }

  if (parts.length === 1) continue;
  const child = parts[1];
  const item = { label: labelFromSlug(child), href: `/${root}/${child}` };
  if (isGenerationSlug(child)) models[root].generations.push(item);
  else models[root].variants.push(item);
}

const groupOrder = ["Saloons & Tourers", "SUV (X)", "M Performance", "Other"];
const groups = groupOrder.map((title) => ({
  title,
  items: Object.values(models)
    .filter((m) => m.group === title)
    .map(({ group, ...rest }) => ({
      ...rest,
      variantCount: rest.variants.length,
      generationCount: rest.generations.length,
    })),
}));

const outPath = path.join("E:/4 WEBS/bmw-web-1/src/components/shared/modelNavData.json");
fs.writeFileSync(outPath, JSON.stringify({ groups }, null, 2));
console.log("Wrote", outPath);
for (const g of groups) {
  console.log(g.title, g.items.map((i) => `${i.label}:${i.variants.length}v/${i.generations.length}g`).join(", "));
}
