import Image from "next/image";

const riskClass = {
  catastrophic: "bg-red-100 text-red-800",
  immediate: "bg-orange-100 text-orange-800",
  monitor: "bg-yellow-100 text-yellow-800",
};

export default function HomeSec10({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl">
        {/* Header */}
        <div className="mb-2 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-black md:text-4xl">
              BMW Market Intelligence — What 24,650+ UK Owners Told Us in 2025
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

        {/* Stats */}
        <ul className="mb-3 flex flex-col gap-1 border border-gray-200 bg-gray-50 p-2 md:flex-row md:gap-3">
          {data.stats.map((stat) => (
            <li
              key={stat.label}
              className="flex items-center gap-1 text-xs font-semibold text-black md:flex-1"
            >
              <span>{stat.icon}</span>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>

        {/* Desktop: 3-col grid | Mobile: stacked */}
        <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-3">
          {/* Engines */}
          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-blue-700">
              {data.engines.icon} {data.engines.title}
            </div>
            <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-[auto_1fr_1fr_1fr] md:gap-1">
              {data.engines.columns.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            {data.engines.rows.map((row) => (
              <div
                key={row.code}
                className="border-b border-gray-200 px-2 py-1.5 text-xs last:border-b-0 md:grid md:grid-cols-[auto_1fr_1fr_1fr] md:gap-1"
              >
                <span className="font-semibold">{row.rank}</span>
                <span className="font-semibold">{row.code}</span>
                <span className="text-gray-600">{row.label}</span>
                <span className="text-blue-700">{row.enquiries}</span>
              </div>
            ))}
          </div>

          {/* Models */}
          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-blue-700">
              {data.models.icon} {data.models.title}
            </div>
            <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-[auto_1fr_1fr] md:gap-1">
              {data.models.columns.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            {data.models.rows.map((row) => (
              <div
                key={row.model}
                className="border-b border-gray-200 px-2 py-1.5 text-xs last:border-b-0 md:grid md:grid-cols-[auto_1fr_1fr] md:gap-1"
              >
                <span className="font-semibold">{row.rank}</span>
                <span>{row.model}</span>
                <span className="text-blue-700">{row.enquiries}</span>
              </div>
            ))}
          </div>

          {/* Replacement costs */}
          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-blue-700">
              {data.replacementCosts.icon} {data.replacementCosts.title}
            </div>
            <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-2 md:gap-1">
              {data.replacementCosts.columns.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            {data.replacementCosts.rows.map((row) => (
              <div
                key={row.code}
                className="border-b border-gray-200 px-2 py-1.5 text-xs last:border-b-0 md:grid md:grid-cols-2 md:gap-1"
              >
                <span className="font-semibold">{row.code}</span>
                <span className="text-blue-700">{row.cost}</span>
              </div>
            ))}
          </div>

          {/* Failures */}
          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-blue-700">
              {data.failures.icon} {data.failures.title}
            </div>
            <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-[auto_1fr_auto] md:gap-1">
              {data.failures.columns.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            {data.failures.rows.map((row) => (
              <div
                key={row.rank}
                className="border-b border-gray-200 px-2 py-1.5 text-xs last:border-b-0 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-1"
              >
                <span className="font-semibold">{row.rank}</span>
                <span>{row.failure}</span>
                <span
                  className={`inline-block rounded px-1.5 py-0.5 ${riskClass[row.risk.type] || "bg-gray-100"}`}
                >
                  {row.risk.icon} {row.risk.label}
                </span>
              </div>
            ))}
          </div>

          {/* Regional demand */}
          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-blue-700">
              {data.regionalDemand.icon} {data.regionalDemand.title}
            </div>
            {data.regionalDemand.rows.map((row) => (
              <div
                key={row.region}
                className="flex justify-between border-b border-gray-200 px-2 py-1.5 text-xs last:border-b-0"
              >
                <span className="font-semibold">{row.region}</span>
                <span className="text-blue-700">{row.percentage}</span>
              </div>
            ))}
          </div>

          {/* Live feed */}
          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-blue-700">
              {data.liveFeed.icon} {data.liveFeed.title}
            </div>
            {data.liveFeed.rows.map((row) => (
              <div
                key={`${row.vehicle}-${row.timestamp}`}
                className="border-b border-gray-200 px-2 py-1.5 text-xs last:border-b-0"
              >
                <p className="font-semibold">{row.vehicle}</p>
                <p className="text-gray-600">
                  {row.location} · {row.issue} · {row.timestamp}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">{data.liveFeed.footer}</p>
      </div>
    </section>
  );
}
