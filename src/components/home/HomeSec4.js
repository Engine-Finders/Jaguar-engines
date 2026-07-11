import Image from "next/image";
import Link from "next/link";

const verdictClass = {
  best: "bg-yellow-100 text-yellow-900",
  safe: "bg-green-100 text-green-800",
  avoid: "bg-red-100 text-red-800",
  watch: "bg-orange-100 text-orange-800",
};

export default function HomeSec4({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl">
        {/* Header: text left, image right */}
        <div className="mb-3 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-black md:text-4xl">
              BMW Ownership Rankings
            </h2>
            <p className="text-sm text-gray-600">{data.subHeadline}</p>
          </div>
          <div className="relative h-20 w-28 shrink-0 md:h-28 md:w-48">
            <Image
              src={data.headerImage.src}
              alt={data.headerImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 112px, 192px"
            />
          </div>
        </div>

        {/* Rankings table */}
        <div className="mb-3 border border-gray-200">
          {/* Desktop header */}
          <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-[1.2fr_1fr_2fr_auto_auto] md:gap-2">
            {data.columns.map((col) => (
              <span key={col}>{col}</span>
            ))}
            <span />
          </div>

          {data.rankings.map((row) => (
            <Link
              key={row.ranking}
              href={row.href}
              className="block border-b border-gray-200 px-2 py-2 text-black last:border-b-0 hover:bg-gray-50 md:grid md:grid-cols-[1.2fr_1fr_2fr_auto_auto] md:items-center md:gap-2"
            >
              {/* Mobile: stacked | Desktop: columns */}
              <div className="mb-1 flex items-center gap-2 md:mb-0">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs text-white">
                  {row.icon}
                </span>
                <span className="text-sm font-semibold">{row.ranking}</span>
              </div>

              <p className="mb-1 text-sm font-semibold md:mb-0">
                <span className="md:hidden text-xs font-normal text-gray-500">
                  Winner:{" "}
                </span>
                {row.winner}
              </p>

              <p className="mb-1 text-xs text-gray-600 md:mb-0">{row.why}</p>

              <div className="flex items-center justify-between gap-2 md:contents">
                <span
                  className={`inline-block shrink-0 rounded px-1.5 py-0.5 text-xs ${verdictClass[row.verdict.type] || "bg-gray-100"}`}
                >
                  {row.verdict.icon} {row.verdict.text}
                </span>
                <span className="text-gray-400 md:justify-self-end">›</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Reference: Data Sources */}
        <div className="border border-gray-200">
          <h3 className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-black">
            {data.dataSources.title}
          </h3>
          <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-2">
            {data.dataSources.columns.map((col) => (
              <span key={col}>{col}</span>
            ))}
          </div>
          {data.dataSources.rows.map((row) => (
            <div
              key={row.claim}
              className="border-b border-gray-200 px-2 py-1.5 last:border-b-0 md:grid md:grid-cols-2 md:gap-2"
            >
              <p className="text-sm font-semibold text-black">{row.claim}</p>
              <p className="text-xs text-gray-600">{row.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
