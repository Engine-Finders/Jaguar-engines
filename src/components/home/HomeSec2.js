import Image from "next/image";
import Link from "next/link";

const verdictClass = {
  warning: "bg-orange-100 text-orange-800",
  success: "bg-green-100 text-green-800",
  trophy: "bg-blue-100 text-blue-800",
  diamond: "bg-purple-100 text-purple-800",
  danger: "bg-red-100 text-red-800",
  crown: "bg-yellow-100 text-yellow-800",
  fire: "bg-orange-100 text-orange-900",
};

function ModelRow({ item, desktop }) {
  return (
    <Link
      href={item.href}
      className="flex items-center gap-2 border-b border-gray-200 py-1.5 text-black hover:bg-gray-50"
    >
      <div className="relative h-10 w-14 shrink-0">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>

      {desktop ? (
        <>
          <span className="w-24 shrink-0 text-sm font-semibold">{item.model}</span>
          <span className="min-w-0 flex-1 truncate text-xs text-gray-600">
            {item.generations}
          </span>
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-xs ${verdictClass[item.verdict.type] || "bg-gray-100"}`}
          >
            {item.verdict.icon} {item.verdict.text}
          </span>
        </>
      ) : (
        <>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{item.model}</p>
            <p className="truncate text-xs text-gray-600">{item.generations}</p>
            <span
              className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-xs ${verdictClass[item.verdict.type] || "bg-gray-100"}`}
            >
              {item.verdict.icon} {item.verdict.text}
            </span>
          </div>
        </>
      )}

      <span className="shrink-0 text-gray-400">›</span>
    </Link>
  );
}

function ColumnHeader({ columns }) {
  return (
    <div className="flex items-center gap-2 bg-blue-700 px-2 py-1 text-xs font-semibold text-white">
      <span className="w-14 shrink-0" />
      <span className="w-24 shrink-0">{columns[0]}</span>
      <span className="flex-1">{columns[1]}</span>
      <span className="shrink-0">{columns[2]}</span>
      <span className="w-3" />
    </div>
  );
}

export default function HomeSec2({ data }) {
  const mid = Math.ceil(data.models.length / 2);
  const left = data.models.slice(0, mid);
  const right = data.models.slice(mid);

  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl">
        {/* Header: text left, image right */}
        <div className="mb-3 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-black md:text-4xl">
              Find Your Vehicle
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

        {/* Mobile: search + filters */}
        <div className="mb-2 md:hidden">
          <input
            type="search"
            placeholder={data.searchPlaceholder}
            className="mb-2 w-full border border-gray-300 px-2 py-1.5 text-sm"
            readOnly
          />
          <div className="flex flex-wrap gap-1">
            {data.filters.map((filter, i) => (
              <span
                key={filter.value}
                className={`rounded border px-2 py-0.5 text-xs ${
                  i === 0
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                {filter.label}
              </span>
            ))}
          </div>
        </div>

        {/* Desktop: 2-column tables */}
        <div className="hidden gap-3 md:grid md:grid-cols-2">
          {[left, right].map((col, i) => (
            <div key={i} className="border border-gray-200">
              <ColumnHeader columns={data.columns} />
              {col.map((item) => (
                <ModelRow key={item.model} item={item} desktop />
              ))}
            </div>
          ))}
        </div>

        {/* Mobile: single stacked list */}
        <div className="border border-gray-200 md:hidden">
          {data.models.map((item) => (
            <ModelRow key={item.model} item={item} desktop={false} />
          ))}
        </div>

        {/* Mobile: view all + CTA */}
        <div className="mt-2 md:hidden">
          <Link
            href={data.viewAll.href}
            className="mb-2 block text-center text-sm text-blue-700"
          >
            {data.viewAll.label} ({data.models.length}) ↓
          </Link>
          <div className="border border-blue-200 bg-blue-50 p-2">
            <p className="text-sm font-semibold text-black">{data.cta.title}</p>
            <p className="mb-2 text-xs text-gray-600">{data.cta.text}</p>
            <Link
              href={data.cta.href}
              className="block bg-blue-700 px-3 py-2 text-center text-sm font-semibold text-white"
            >
              {data.cta.buttonLabel} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
