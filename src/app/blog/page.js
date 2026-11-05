import Link from "next/link";
import { getBlogPosts, cleanExcerpt, resolvePostImage } from "@/lib/cms";
import { blogConfig } from "@/lib/blog.config";
import { EngineQuoteWidget } from "@/components/blog/EngineQuoteWidget";
import { RelatedGuidesWidget } from "@/components/blog/RelatedGuidesWidget";
import "./blog.css";

export const metadata = {
  title: blogConfig.copy.metaTitle,
  description: blogConfig.copy.metaDescription,
  alternates: {
    canonical: `${blogConfig.siteUrl}/blog`,
  },
};

export const revalidate = 3600;

export default async function BlogPage(props) {
  const searchParams = await props.searchParams;
  const currentPage = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const postsPerPage = 9;

  const { items: posts, total } = await getBlogPosts(currentPage, postsPerPage);
  const totalPages = Math.ceil(total / postsPerPage) || 1;

  const { copy, theme } = blogConfig;

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
      {/* Breadcrumbs */}
      <nav className="mb-4 text-xs text-slate-500">
        <Link href="/" className="hover:underline hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium">Blog</span>
      </nav>

      {/* Header Banner */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          {copy.blogTitlePrefix}{" "}
          <span style={{ color: theme.accentColor }}>{copy.blogTitleAccent}</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl">
          {copy.blogSubtitle}
        </p>
      </header>

      {/* 12-Column Responsive Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        {/* Main Content (8 cols) */}
        <div className="lg:col-span-8 min-w-0">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
              <p className="text-base font-bold text-slate-900">{copy.emptyTitle}</p>
              <p className="mt-1 text-xs text-slate-500">{copy.emptySubtitle}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {posts.map((post) => {
                const imageUrl = resolvePostImage(post);
                const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const excerpt = cleanExcerpt(post.excerpt);

                return (
                  <article
                    key={post.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md hover:border-slate-300"
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 block"
                    >
                      <img
                        src={imageUrl}
                        alt={post.seoMetadata?.featuredImage?.altText || post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold leading-snug text-slate-900 line-clamp-3 group-hover:text-[var(--blog-primary)] transition">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {excerpt}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold hover:underline"
                          style={{ color: theme.accentColor }}
                        >
                          <span>{copy.readMoreText || "Read Guide"}</span>
                          <span className="text-sm leading-none">»</span>
                        </Link>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2 border-t border-slate-200 pt-6 text-xs font-semibold text-slate-700">
              {currentPage > 1 ? (
                <Link
                  href={`/blog?page=${currentPage - 1}`}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 transition"
                >
                  « Prev
                </Link>
              ) : (
                <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-slate-300 cursor-not-allowed">
                  « Prev
                </span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/blog?page=${pageNum}`}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    pageNum === currentPage
                      ? "font-bold text-white shadow-sm"
                      : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                  style={pageNum === currentPage ? { backgroundColor: theme.primaryColor } : undefined}
                >
                  {pageNum}
                </Link>
              ))}

              {currentPage < totalPages ? (
                <Link
                  href={`/blog?page=${currentPage + 1}`}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 transition"
                >
                  Next »
                </Link>
              ) : (
                <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-slate-300 cursor-not-allowed">
                  Next »
                </span>
              )}
            </div>
          )}
        </div>

        {/* Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          <EngineQuoteWidget siteName={blogConfig.siteName} />
          <RelatedGuidesWidget title={copy.recentGuidesTitle || "Recent Guides"} limit={5} />
        </aside>
      </div>
    </div>
  );
}
