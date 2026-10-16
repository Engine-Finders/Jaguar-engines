// src/lib/cms.js

const RAW_CMS_URL = process.env.CMS_API_URL || "https://cms.enginefinders.co.uk";
const CMS_API_URL = RAW_CMS_URL.replace(/\/api\/v1\/?$/, "");
const CMS_SITE_SLUG = process.env.CMS_SITE_SLUG || "jaguarengines";

/**
 * Fetches paginated published blog posts for Jaguar Engines UK
 */
export async function getBlogPosts(page = 1, limit = 12) {
  try {
    const res = await fetch(
      `${CMS_API_URL}/api/v1/sites/${CMS_SITE_SLUG}/posts?page=${page}&limit=${limit}`,
      {
        next: { tags: ["cms-posts"], revalidate: 3600 },
      }
    );

    if (!res.ok) {
      console.warn(`CMS API returned status ${res.status}`);
      return { items: [], total: 0 };
    }

    const data = await res.json();
    return { items: data.items || [], total: data.total || 0 };
  } catch (error) {
    console.error("Failed to fetch blog posts from CMS:", error);
    return { items: [], total: 0 };
  }
}

/**
 * Fetches a single published blog post by slug
 */
export async function getBlogPostBySlug(slug) {
  try {
    const res = await fetch(
      `${CMS_API_URL}/api/v1/sites/${CMS_SITE_SLUG}/posts/${encodeURIComponent(slug)}`,
      {
        next: { tags: ["cms-posts", `post-${slug}`], revalidate: 3600 },
      }
    );

    if (!res.ok) {
      if (res.status !== 404) {
        console.warn(`CMS API single post returned status ${res.status}`);
      }
      return null;
    }

    const data = await res.json();
    return data.post || null;
  } catch (error) {
    console.error(`Failed to fetch post "${slug}" from CMS:`, error);
    return null;
  }
}
