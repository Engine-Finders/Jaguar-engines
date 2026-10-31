// src/lib/blog.config.js
/**
 * Site-specific configuration for Headless CMS Blog & Lead Quote integration.
 * Tailored for Jaguar Engines UK.
 */

export const blogConfig = {
  // 1. Site Identity
  siteName: "Jaguar Engines UK",
  siteSlug: process.env.CMS_SITE_SLUG || "jaguarengines",
  siteDomain: "jaguarengines.uk",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://jaguarengines.uk").replace(/\/$/, ""),
  defaultAuthor: "Jaguar Technical Specialist",

  // 2. Headings & UI Copy
  copy: {
    metaTitle: "Jaguar Engines UK | Guides & Diagnostic Advice",
    metaDescription: "Expert failure diagnosis, engine replacement costs, timing chain guidance, and technical specifications for all Jaguar models.",
    blogTitlePrefix: "Jaguar Engines UK",
    blogTitleAccent: "Knowledge & Guides",
    blogSubtitle: "Expert failure diagnosis, engine replacement costs, timing chain guidance, and technical specifications for all Jaguar models.",
    emptyTitle: "No guides published yet",
    emptySubtitle: "Jaguar Engines UK technical articles and diagnostic guides published from the CMS will appear here.",
    readMoreText: "Read Guide",
    widgetTitle: "Instant Jaguar Engine Quote",
    widgetSubtitle: "Enter your registration or request a callback from our Jaguar engine specialists.",
    widgetSubmitText: "Request Free Quote",
    widgetSuccessTitle: "Quote Request Received!",
    widgetSuccessSubtitle: "Our Jaguar Engines UK specialists will check stock and contact you shortly with the best pricing.",
    recentGuidesTitle: "Recent Guides",
    relatedGuidesTitle: "Related Guides",
    bottomCta: {
      enabled: true,
      badge: "Jaguar Engine Network",
      title: "Need a Replacement Jaguar Engine?",
      subtitle: "Get an instant quote for reconditioned or tested low-mileage Jaguar engines with full warranty coverage.",
      buttonText: "Get Free Jaguar Engine Quote »",
      buttonHref: "#sidebar-reg-input",
    },
  },

  // 3. Theme Colors
  theme: {
    fontFamily: "Arial, Helvetica, sans-serif",
    primaryColor: "#111210",
    primaryHover: "#2a2b28",
    accentColor: "#90908d",
    accentHover: "#777774",
    widgetBg: "#111210",
    widgetBorder: "#222320",
    widgetButtonBg: "#90908d",
    widgetButtonHover: "#777774",
    ukBadgeBg: "#003399",
    fallbackThumbnail: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
  },
};
