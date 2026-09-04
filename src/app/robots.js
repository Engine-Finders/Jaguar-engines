export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://jaguarengines.uk/sitemap.xml",
    host: "https://jaguarengines.uk",
  };
}
