import genPages from "@/data/registery/generations/pages.json";
import varPages from "@/data/registery/variants/pages.json";
import modelPages from "@/data/registery/models/pages.json";
import enginePages from "@/data/registery/engines/pages.json";

const BASE_URL = "https://jaguarengines.uk";

// Engine URLs come from the registry slugs (the route's source of truth), not data file names.
function getEngineUrls() {
    return enginePages.map((p) => ({
        url: `${BASE_URL}/engine/${p.slug}`,
        lastModified: new Date(),
    }));
}

export default function sitemap() {
    return [
        { url: `${BASE_URL}`, lastModified: new Date() },

        // Models - single segment: /e-pace
        ...modelPages.map(p => ({
            url: `${BASE_URL}/${p.slug}`,
            lastModified: new Date(),
        })),

        // Generations - two segments: /f-pace/x761
        ...genPages.map(p => ({
            url: p.parent
                ? `${BASE_URL}/${p.parent}/${p.slug}`
                : `${BASE_URL}/${p.slug}`,
            lastModified: new Date(),
        })),

        // Engines: /engine/aj-v6-petrol
        ...getEngineUrls(),

        // Variants - two segments: /e-pace/d150
        ...varPages.map(p => ({
            url: `${BASE_URL}/${p.parent}/${p.slug}`,
            lastModified: new Date(),
        })),
    ];
}