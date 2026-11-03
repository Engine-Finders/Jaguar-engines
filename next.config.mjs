import { getPublicHtmlRoutes } from "./scripts/public-html-routes.mjs";

const { rewrites: publicHtmlRewrites, redirects: publicHtmlRedirects } = getPublicHtmlRoutes();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Avoid trailing-slash 301 → 404 chains for Googlebot
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      ...publicHtmlRedirects,
      // Legacy / dead paths → live routes (Jaguar clone of BMW recovery redirects)
      { source: "/models/:series/:chassis", destination: "/:series/:chassis", permanent: true },
      { source: "/failures/:slug*", destination: "/", permanent: true },
      { source: "/quotes", destination: "/quote", permanent: true },
      { source: "/fault-diagnostic-calculator", destination: "/", permanent: true },
      { source: "/images/:path*", destination: "/jaguar-logo.png", permanent: true },
    ];
  },
  async rewrites() {
    return {
      // Serve public/*.html at clean URLs before App Router catch-all routes run.
      beforeFiles: publicHtmlRewrites,
    };
  },
};

export default nextConfig;
