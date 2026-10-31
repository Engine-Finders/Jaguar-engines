import Link from "next/link";
import { getBlogPosts } from "@/lib/cms";
import { EngineQuoteWidget } from "@/components/blog/EngineQuoteWidget";
import { RelatedGuidesWidget } from "@/components/blog/RelatedGuidesWidget";
import "./blog.css";

export const metadata = {
  title: "BMW Engine Guides & Advice | BMW Engines UK",
  description: "Comprehensive BMW engine diagnostic guides, common failure solutions, timing chain advice, and replacement engine buying tips.",
  alternates: {
    canonical: "https://bmwengines.uk/blog",
  },
};

export const revalidate = 3600;

export default async function BlogPage(props) {
  const searchParams = await props.searchParams;
  const currentPage = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const postsPerPage = 9;

  const { items: posts, total } = await getBlogPosts(currentPage, postsPerPage);
  const totalPages = Math.ceil(total / postsPerPage) || 1;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-xs text-slate-500">
        <Link href="/" className="hover:underline hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium">Blog</span>
      </nav>

      {/* Header Banner */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          BMW Engines UK <span className="text-[#075fd8]">Knowledge & Guides</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl">
          Expert failure diagnosis, engine replacement costs, timing chain guidance, and technical specifications for all BMW series.
        </p>
      </header>

      {/* 12-Column Responsive Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        {/* Main Content (8 cols) */}
        <div className="lg:col-span-8 min-w-0">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
              <p className="text-base font-bold text-slate-900">No guides published yet</p>
              <p className="mt-1 text-xs text-slate-500">BMW technical articles and diagnostic guides published from the CMS will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {posts.map((post) => {
                const imageUrl =
                  post.seoMetadata?.featuredImage?.url ||
                  post.seoMetadata?.ogImage ||
                  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80";

                const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

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
                        <h3 className="text-sm sm:text-base font-bold leading-snug text-slate-900 line-clamp-3 group-hover:text-[#075fd8] transition">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#075fd8] hover:underline"
                        >
                          <span>Read Guide</span>
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
                      ? "bg-[#075fd8] font-bold text-white shadow-sm"
                      : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
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
          <EngineQuoteWidget siteName="BMW Engines UK" />
          <RelatedGuidesWidget title="Recent Guides" limit={5} />
        </aside>
      </div>
    </div>
  );
}
