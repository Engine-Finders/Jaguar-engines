import Image from "next/image";
import Link from "next/link";

const severityClass = {
  catastrophic: "text-red-700",
  immediate: "text-orange-700",
  monitor: "text-yellow-700",
  low: "text-green-700",
};

function FailureTable({ block }) {
  return (
    <div className="mb-3 border border-gray-200">
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <span>{block.icon}</span>
        <h3 className="text-sm font-bold uppercase text-blue-700">
          {block.title}
        </h3>
      </div>

      <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-[auto_1fr_2fr_auto_auto] md:gap-2">
        {block.columns.map((col) => (
          <span key={col}>{col}</span>
        ))}
      </div>

      {block.rows.map((row) => (
        <div
          key={row.id}
          className="border-b border-gray-200 px-2 py-2 last:border-b-0 md:grid md:grid-cols-[auto_1fr_2fr_auto_auto] md:items-start md:gap-2"
        >
          <span className="mb-1 text-sm font-bold text-blue-700 md:mb-0">
            {row.id}
          </span>
          <p className="mb-1 text-sm font-semibold text-black md:mb-0">
            {row.title}
          </p>
          <p className="mb-1 text-xs text-gray-600 md:mb-0">{row.description}</p>
          <p
            className={`mb-1 text-xs font-semibold md:mb-0 ${severityClass[row.severity.type] || ""}`}
          >
            {row.severity.icon} {row.severity.label}
          </p>
          <Link
            href={row.link.href}
            className="text-xs font-semibold text-blue-700"
          >
            {row.link.label}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function HomeSec9({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl">
        <div className="mb-3 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-black md:text-4xl">
              The Jaguar Failure Database
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

        <FailureTable block={data.engineFailures} />
        <FailureTable block={data.warningSigns} />

        <div className="border border-gray-200 p-2">
          <p className="mb-1 text-sm font-bold uppercase text-blue-700">
            Urgency Key
          </p>
          <ul className="flex flex-col gap-1 md:flex-row md:flex-wrap md:gap-3">
            {data.urgencyKey.map((item) => (
              <li key={item.label} className="text-xs text-black">
                {item.icon}{" "}
                <span className="font-semibold">{item.label}</span> — {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
