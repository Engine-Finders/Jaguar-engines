# Canonical URL Setup (Next.js)

3-step setup so every page auto-generates `<link rel="canonical">` with no manual maintenance.

## 1. Root layout — metadataBase

In `src/app/layout.js`, add `metadataBase` to the static metadata export:

```js
export const metadata = {
  metadataBase: new URL("https://bmwengines.uk"),
  title: "...",
  description: "...",
};
```

This gives Next.js the base URL so relative canonicals (`/`) become absolute (`https://bmwengines.uk/`).

## 2. Every page — generateMetadata with canonical

Each `page.js` exports a `generateMetadata()` that returns `alternates.canonical`. If data files have a `meta.canonical` field, use it; otherwise auto-generate from route params.

### Home page (`page.js`):

```js
export function generateMetadata() {
  return {
    alternates: { canonical: "/" },
  };
}
```

### Dynamic routes (e.g. `[slug]/page.js`):

```js
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPageData(slug);
  const canonical = data?.meta?.canonical || `/${slug}`;

  return {
    title: data?.meta?.title,
    description: data?.meta?.description,
    alternates: { canonical },
  };
}
```

### Catch-all routes (e.g. `[...slug]/page.js`):

```js
export async function generateMetadata({ params }) {
  const { slug: segments } = await params; // e.g. ["1-series", "e87"]
  const data = await getPageData(segments);
  const canonical = data?.meta?.canonical || `/${segments.join("/")}`;

  return {
    title: data?.meta?.title,
    description: data?.meta?.description,
    alternates: { canonical },
  };
}
```

## 3. Data files (optional)

JSON data files can optionally override the canonical with a `meta.canonical` field:

```json
{
  "meta": {
    "title": "Page Title",
    "description": "Page description.",
    "canonical": "https://bmwengines.uk/some/path/"
  }
}
```

If `meta.canonical` is missing or empty, it falls back to auto-generated from route params.

## Result

Every page outputs:

```html
<link rel="canonical" href="https://bmwengines.uk/1-series/e87" />
```

— either from data or auto-generated. No per-page manual work needed.
