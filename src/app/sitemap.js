import fs from "fs";
import path from "path";

const BASE_URL = "https://jaguarengines.uk";

function getUrls(folder, routePrefix = "") {
    const dir = path.join(process.cwd(), "src/data", folder);

    return fs.readdirSync(dir).map(file => {
        const slug = file.replace(".json", "");

        return {
            url: `${BASE_URL}${routePrefix}/${slug}`,
            lastModified: new Date(),
        };
    });
}

export default function sitemap() {
    return [
        {url: `${BASE_URL}`, lastModified: new Date()},
        ...getUrls("models"),
        ...getUrls("generations"),
        ...getUrls("engines", "/engine"),
        ...getUrls("variants"),
    ];
}