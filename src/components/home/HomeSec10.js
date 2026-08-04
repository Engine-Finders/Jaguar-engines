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
        <div className="mb-2 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-black md:text-4xl">
              Jaguar Market Intelligence
            </h2>
            <div
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
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

        <ul className="mb-3 flex flex-col gap-1 border border-gray-200 bg-gray-50 p-2 md:flex-row md:gap-3">
          {data.stats.map((stat) => (
            <li
              key={stat.label}
              className="flex items-center gap-1 text-xs font-semibold text-black md:flex-1"
            >
              <span dangerouslySetInnerHTML={{ __html: stat.icon }} />
              <span dangerouslySetInnerHTML={{ __html: stat.label }} />
            </li>
          ))}
        </ul>

        <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-blue-700">
              {data.engines.icon}{" "}
              <span dangerouslySetInnerHTML={{ __html: data.engines.title }} />
            </div>

            <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-[auto_1fr_1fr_1fr] md:gap-1">
              {data.engines.columns.map((c) => (
                <span key={c} dangerouslySetInnerHTML={{ __html: c }} />
              ))}
            </div>

            {data.engines.rows.map((row) => (
              <div
                key={row.code}
                className="border-b border-gray-200 px-2 py-1.5 text-xs last:border-b-0 md:grid md:grid-cols-[auto_1fr_1fr_1fr] md:gap-1"
              >
                <span
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: row.rank }}
                />
                <span
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: row.code }}
                />
                <span
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: row.label }}
                />
                <span
                  className="text-blue-700"
                  dangerouslySetInnerHTML={{ __html: row.enquiries }}
                />
              </div>
            ))}
          </div>

          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-blue-700">
              {data.models.icon}{" "}
              <span dangerouslySetInnerHTML={{ __html: data.models.title }} />
            </div>

            <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-[auto_1fr_1fr] md:gap-1">
              {data.models.columns.map((c) => (
                <span key={c} dangerouslySetInnerHTML={{ __html: c }} />
              ))}
            </div>

            {data.models.rows.map((row) => (
              <div
                key={row.model}
                className="border-b border-gray-200 px-2 py-1.5 text-xs last:border-b-0 md:grid md:grid-cols-[auto_1fr_1fr] md:gap-1"
              >
                <span
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: row.rank }}
                />
                <span dangerouslySetInnerHTML={{ __html: row.model }} />
                <span
                  className="text-blue-700"
                  dangerouslySetInnerHTML={{ __html: row.enquiries }}
                />
              </div>
            ))}
          </div>

          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-blue-700">
              {data.replacementCosts.icon}{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: data.replacementCosts.title,
                }}
              />
            </div>

            <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-2 md:gap-1">
              {data.replacementCosts.columns.map((c) => (
                <span key={c} dangerouslySetInnerHTML={{ __html: c }} />
              ))}
            </div>

            {data.replacementCosts.rows.map((row) => (
              <div
                key={row.code}
                className="border-b border-gray-200 px-2 py-1.5 text-xs last:border-b-0 md:grid md:grid-cols-2 md:gap-1"
              >
                <span
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: row.code }}
                />
                <span
                  className="text-blue-700"
                  dangerouslySetInnerHTML={{ __html: row.cost }}
                />
              </div>
            ))}
          </div>

          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-blue-700">
              {data.failures.icon}{" "}
              <span dangerouslySetInnerHTML={{ __html: data.failures.title }} />
            </div>

            <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-[auto_1fr_auto] md:gap-1">
              {data.failures.columns.map((c) => (
                <span key={c} dangerouslySetInnerHTML={{ __html: c }} />
              ))}
            </div>

            {data.failures.rows.map((row) => (
              <div
                key={row.rank}
                className="border-b border-gray-200 px-2 py-1.5 text-xs last:border-b-0 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-1"
              >
                <span
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: row.rank }}
                />
                <span dangerouslySetInnerHTML={{ __html: row.failure }} />
                <span
                  className={`inline-block rounded px-1.5 py-0.5 ${
                    riskClass[row.risk.type] || "bg-gray-100"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: `${row.risk.icon} ${row.risk.label}`,
                  }}
                />
              </div>
            ))}
          </div>

          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-blue-700">
              {data.regionalDemand.icon}{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: data.regionalDemand.title,
                }}
              />
            </div>

            {data.regionalDemand.rows.map((row) => (
              <div
                key={row.region}
                className="flex justify-between border-b border-gray-200 px-2 py-1.5 text-xs last:border-b-0"
              >
                <span
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: row.region }}
                />
                <span
                  className="text-blue-700"
                  dangerouslySetInnerHTML={{ __html: row.percentage }}
                />
              </div>
            ))}
          </div>

          <div className="border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold text-blue-700">
              {data.liveFeed.icon}{" "}
              <span dangerouslySetInnerHTML={{ __html: data.liveFeed.title }} />
            </div>

            {data.liveFeed.rows.map((row) => (
              <div
                key={`${row.vehicle}-${row.timestamp}`}
                className="border-b border-gray-200 px-2 py-1.5 text-xs last:border-b-0"
              >
                <p
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: row.vehicle }}
                />
                <p
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: `${row.location} · ${row.issue} · ${row.timestamp}`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <p
          className="text-center text-xs text-gray-500"
          dangerouslySetInnerHTML={{ __html: data.liveFeed.footer }}
        />
      </div>
    </section>
  );
}