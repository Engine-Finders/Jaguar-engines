// src/lib/cms.js

import { blogConfig } from "./blog.config";

const RAW_CMS_URL = process.env.CMS_API_URL || "https://cms.enginefinders.co.uk";
const CMS_API_URL = RAW_CMS_URL.replace(/\/api\/v1\/?$/, "");
const CMS_SITE_SLUG = process.env.CMS_SITE_SLUG || blogConfig.siteSlug;

/**
 * Decodes HTML entities and strips HTML tags from excerpts
 */
export function cleanExcerpt(rawText, maxLength = 140) {
  if (!rawText) return "";
  const stripped = rawText.replace(/<[^>]*>/g, "");
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&apos;": "'",
    "&#8217;": "’",
    "&#8216;": "‘",
    "&#8220;": "“",
    "&#8221;": "”",
    "&#8211;": "–",
    "&#8212;": "—",
    "&nbsp;": " ",
    "&hellip;": "…",
    "&#8230;": "…",
  };
  const decoded = stripped.replace(/&[^;]+;/g, (m) => entities[m] || m);
  if (decoded.length <= maxLength) return decoded;
  return `${decoded.slice(0, maxLength).trim()}...`;
}

/**
 * Resolves post thumbnail with safe fallback
 */
export function resolvePostImage(post, fallback) {
  return (
    post?.featuredImage?.url ||
    post?.seoMetadata?.featuredImage?.url ||
    post?.seoMetadata?.ogImage ||
    fallback ||
    blogConfig.theme.fallbackThumbnail
  );
}

/**
 * Fetches paginated published blog posts for BMW Engines UK
 */
export async function getBlogPosts(page = 1, limit = 9) {
  try {
    const res = await fetch(
      `${CMS_API_URL}/api/v1/sites/${CMS_SITE_SLUG}/posts?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn(`[CMS API] returned status ${res.status}`);
      return { items: [], total: 0 };
    }

    const data = await res.json();
    return { items: data.items || [], total: data.total || 0 };
  } catch (error) {
    console.error("[CMS API] Failed to fetch blog posts from CMS:", error);
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
        cache: "no-store",
      }
    );

    if (!res.ok) {
      if (res.status !== 404) {
        console.warn(`[CMS API] single post returned status ${res.status}`);
      }
      return null;
    }

    const data = await res.json();
    return data.post || null;
  } catch (error) {
    console.error(`[CMS API] Failed to fetch post "${slug}" from CMS:`, error);
    return null;
  }
}
