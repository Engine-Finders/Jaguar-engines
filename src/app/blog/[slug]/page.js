import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, resolvePostImage } from "@/lib/cms";
import { blogConfig } from "@/lib/blog.config";
import { EngineQuoteWidget } from "@/components/blog/EngineQuoteWidget";
import { RelatedGuidesWidget } from "@/components/blog/RelatedGuidesWidget";
import "../blog.css";

export const revalidate = 3600;

export async function generateMetadata(props) {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return { title: `${params.slug.replace(/-/g, " ")} | ${blogConfig.siteName}` };
  }

  const metaTitle = post.seoMetadata?.metaTitle || `${post.title} | ${blogConfig.siteName}`;
  const metaDescription = post.seoMetadata?.metaDescription || post.excerpt;
  const canonicalUrl =
    post.canonicalUrl ||
    post.seoMetadata?.canonicalUrl ||
    `${blogConfig.siteUrl}/blog/${params.slug}`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: post.seoMetadata?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: post.seoMetadata?.ogTitle || metaTitle,
      description: post.seoMetadata?.ogDescription || metaDescription,
      url: canonicalUrl,
      type: "article",
      images: post.featuredImage?.url ? [{ url: post.featuredImage.url }] : undefined,
    },
  };
}

export default async function ArticlePage(props) {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) notFound();

  const { copy, theme } = blogConfig;
  const articleHtml = post.html || "<p>Article content is loading...</p>";
  const featuredImageUrl = resolvePostImage(post);
  const featuredImageAlt = post.featuredImage?.alt || post.seoMetadata?.featuredImage?.altText || post.title;

  return (
    <div
      className="cms-blog-root mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      style={{
        "--blog-primary": theme.primaryColor,
        "--blog-primary-hover": theme.primaryHover,
        "--blog-accent": theme.accentColor,
        "--blog-accent-hover": theme.accentHover,
        "--blog-font": theme.fontFamily,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* JSON-LD Schema */}
      {post.jsonLdScript ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: post.jsonLdScript }}
        />
      ) : post.jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.jsonLd) }}
        />
      ) : null}

      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-xs text-slate-500">
        <Link href="/" className="hover:underline hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:underline hover:text-slate-900">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium">{post.title}</span>
      </nav>

      {/* 12-Column Responsive Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        {/* Left Column: Article (8 cols) */}
        <article className="lg:col-span-8 min-w-0">
          <header className="mb-8 space-y-4">
            <h1 className="cms-article-title text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 border-y border-slate-200 py-3">
              <span>By <strong className="text-slate-900 font-semibold">{post.author?.name || blogConfig.defaultAuthor}</strong></span>
              <span>•</span>
              <span>{post.readingTimeMinutes || 4} min read</span>
              {post.publishedAt && (
                <>
                  <span>•</span>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={featuredImageUrl}
                alt={featuredImageAlt}
                className="w-full h-auto object-cover max-h-[480px]"
                loading="eager"
              />
            </div>
          )}

          {/* Rendered Semantic HTML */}
          <div
            className="cms-content prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: articleHtml }}
          />

          {/* Bottom Conversion CTA */}
          {copy.bottomCta?.enabled && (
            <div
              className="mt-12 rounded-2xl p-8 text-center text-white shadow-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #071827 0%, ${theme.primaryColor} 100%)`,
                borderColor: theme.primaryColor,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(to right, ${theme.accentColor}, ${theme.primaryColor})`,
                }}
              />
              <h3 className="text-2xl font-black">{copy.bottomCta.title}</h3>
              <p className="mt-2 text-sm text-slate-200 max-w-xl mx-auto">
                {copy.bottomCta.subtitle}
              </p>
              <div className="mt-6">
                <a
                  href={copy.bottomCta.buttonHref || "#sidebar-reg-input"}
                  className="inline-flex items-center rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition"
                  style={{ backgroundColor: theme.widgetButtonBg }}
                >
                  {copy.bottomCta.buttonText}
                </a>
              </div>
            </div>
          )}
        </article>

        {/* Right Sticky Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          <EngineQuoteWidget siteName={blogConfig.siteName} />
          <RelatedGuidesWidget currentSlug={params.slug} title={copy.relatedGuidesTitle || "Related Guides"} />
        </aside>
      </div>
    </div>
  );
}
