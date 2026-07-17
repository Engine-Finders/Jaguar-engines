import Image from "next/image";
import Link from "next/link";

const verdictClass = {
  watch: "text-orange-700",
  safe: "text-green-700",
  best: "text-blue-700",
  avoid: "text-red-700",
  solid: "text-blue-700",
};

export default function HomeSec7({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl">
        {/* Header: text left, image right */}
        <div className="mb-2 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-black md:text-4xl">
              Jaguar Engine Families — The Pillars
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

        {/* Trust strip — mobile shows it; desktop optional row */}
        <ul className="mb-3 flex flex-col gap-1 border border-gray-200 bg-gray-50 p-2 md:flex-row md:gap-3">
          {data.trustStrip.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-1 text-xs text-black md:flex-1"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        {/* Engine table */}
        <div className="mb-2 border border-gray-200">
          <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-[1fr_0.7fr_0.8fr_1.1fr_2fr_auto] md:gap-2">
            {data.columns.map((col) => (
              <span key={col}>{col}</span>
            ))}
            <span />
          </div>

          {data.engines.map((row) => (
            <Link
              key={row.code}
              href={row.href}
              className="block border-b border-gray-200 px-2 py-2 text-black last:border-b-0 hover:bg-gray-50 md:grid md:grid-cols-[1fr_0.7fr_0.8fr_1.1fr_2fr_auto] md:items-start md:gap-2"
            >
              <div className="mb-1 md:mb-0">
                <p className="text-sm font-bold">{row.code}</p>
                <p className="text-xs text-blue-700">{row.spec}</p>
              </div>

              <p className="mb-1 text-xs md:mb-0">
                {row.fuelIcon} {row.fuel}
              </p>

              <p className="mb-1 text-xs text-gray-600 md:mb-0">{row.years}</p>

              <div className="mb-1 md:mb-0">
                <p className="text-sm font-semibold">{row.enquiries}</p>
                <p className="text-xs text-blue-700">{row.sourceTag}</p>
              </div>

              <div className="flex items-start justify-between gap-2 md:contents">
                <p className={`text-xs ${verdictClass[row.verdict.type] || ""}`}>
                  <span className="font-semibold">
                    {row.verdict.icon} {row.verdict.label}
                  </span>{" "}
                  — {row.verdict.text}
                </p>
                <span className="text-gray-400 md:justify-self-end">›</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Legend */}
        <Link
          href={data.legend.href}
          className="flex items-center gap-2 border border-gray-200 p-2 text-black hover:bg-gray-50"
        >
          <span className="text-lg">💡</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{data.legend.title}</p>
            <p className="text-xs text-gray-600">{data.legend.text}</p>
          </div>
          <span className="text-gray-400">›</span>
        </Link>
      </div>
    </section>
  );
}
