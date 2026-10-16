import Link from "next/link";
import { getBlogPosts } from "@/lib/cms";

export async function RelatedGuidesWidget({
  currentSlug,
  title = "Related Guides",
  limit = 5,
}) {
  const { items } = await getBlogPosts(1, 10);

  const relatedPosts = items
    .filter((post) => !currentSlug || post.slug !== currentSlug)
    .slice(0, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
        <h3 className="text-base font-bold tracking-tight text-slate-900">
          {title}
        </h3>
        <Link
          href="/blog"
          className="text-xs font-bold text-slate-800 hover:text-black hover:underline flex items-center gap-0.5"
        >
          <span>View all</span>
          <span className="text-sm leading-none">»</span>
        </Link>
      </div>

      {/* Guide Cards */}
      <div className="space-y-2.5">
        {relatedPosts.map((post) => {
          const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          const imageUrl =
            post.seoMetadata?.featuredImage?.url ||
            post.seoMetadata?.ogImage ||
            "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=300&q=80";

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-3 rounded-xl border border-stone-200/70 bg-stone-50/50 p-2.5 transition duration-200 hover:border-stone-400/50 hover:bg-stone-100/60"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-200">
                <img
                  src={imageUrl}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                <div>
                  <h4 className="text-xs font-bold leading-snug text-slate-900 line-clamp-2 group-hover:text-black transition">
                    {post.title}
                  </h4>
                  <p className="text-[10px] text-stone-400 mt-1">
                    {formattedDate}
                  </p>
                </div>
                <div className="mt-1">
                  <span className="text-[11px] font-bold text-slate-800 group-hover:underline flex items-center gap-0.5">
                    <span>Read Guide</span>
                    <span className="text-xs leading-none">»</span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
