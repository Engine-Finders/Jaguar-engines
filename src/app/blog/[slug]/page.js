import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug } from "@/lib/cms";
import { EngineQuoteWidget } from "@/components/blog/EngineQuoteWidget";
import { RelatedGuidesWidget } from "@/components/blog/RelatedGuidesWidget";
import "../blog.css";

export const revalidate = 3600;

export async function generateMetadata(props) {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return { title: `${params.slug.replace(/-/g, " ")} | Jaguar Engines UK` };
  }

  return {
    title: post.seoMetadata?.metaTitle || `${post.title} | Jaguar Engines UK`,
    description: post.seoMetadata?.metaDescription || post.excerpt,
    alternates: {
      canonical: post.canonicalUrl || post.seoMetadata?.canonicalUrl || `https://jaguarengines.uk/blog/${params.slug}`,
    },
    robots: post.seoMetadata?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export default async function ArticlePage(props) {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) notFound();

  const articleHtml = post.html || "<p>Article content is loading...</p>";
  const featuredImageUrl = post.featuredImage?.url || post.seoMetadata?.featuredImage?.url;
  const featuredImageAlt = post.featuredImage?.alt || post.seoMetadata?.featuredImage?.altText || post.title;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 border-y border-stone-200 py-3">
              <span>By <strong className="text-slate-900 font-semibold">{post.author?.name || "Jaguar Technical Editors"}</strong></span>
              <span>•</span>
              <span>{post.readingTimeMinutes || 4} min read</span>
              <span>•</span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
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
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#111210] to-[#292b29] p-8 text-center text-white shadow-xl relative overflow-hidden border border-stone-700">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b7b8b3] via-white to-[#90908d]" />
            <h3 className="cms-article-title text-2xl font-black">Need a Replacement Jaguar Engine?</h3>
            <p className="mt-2 text-sm text-stone-300 max-w-xl mx-auto">
              Get an instant quote for reconditioned or tested low-mileage Jaguar engines with full warranty coverage.
            </p>
            <div className="mt-6">
              <a
                href="#top"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-md hover:bg-stone-100 transition"
              >
                Get Free Jaguar Engine Quote »
              </a>
            </div>
          </div>
        </article>

        {/* Right Sticky Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          <EngineQuoteWidget siteName="Jaguar Engines UK" />
          <RelatedGuidesWidget currentSlug={params.slug} />
        </aside>
      </div>
    </div>
  );
}
