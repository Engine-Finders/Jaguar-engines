import Image from "next/image";
import Link from "next/link";

const verdictClass = {
  scrap: "text-red-700",
  safe: "text-green-700",
  watch: "text-orange-700",
};

export default function HomeSec6({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl">
        {/* Header: text left, image right */}
        <div className="mb-3 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-black md:text-4xl">
              The Ownership Economics Centre
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

        {/* Desktop: matrix + sidebar | Mobile: stacked */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start">
          {/* Decision Matrix */}
          <div className="min-w-0 flex-1 border border-gray-200">
            <h3 className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold uppercase text-blue-700">
              The Decision Matrix
            </h3>

            <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-[1.4fr_1fr_1fr_1.6fr_auto] md:gap-2">
              {data.matrix.columns.map((col) => (
                <span key={col}>{col}</span>
              ))}
              <span />
            </div>

            {data.matrix.rows.map((row) => (
              <Link
                key={row.model}
                href={row.href}
                className="block border-b border-gray-200 px-2 py-2 text-black last:border-b-0 hover:bg-gray-50 md:grid md:grid-cols-[1.4fr_1fr_1fr_1.6fr_auto] md:items-start md:gap-2"
              >
                <div className="mb-1 flex items-center gap-2 md:mb-0">
                  <div className="relative h-10 w-14 shrink-0">
                    <Image
                      src={row.image.src}
                      alt={row.image.alt}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <span className="text-sm font-semibold">{row.model}</span>
                </div>

                <p className="mb-1 text-xs md:mb-0">
                  <span className="md:hidden text-gray-500">Value: </span>
                  {row.vehicleValue}
                </p>

                <p className="mb-1 text-xs md:mb-0">
                  <span className="md:hidden text-gray-500">Recon: </span>
                  {row.replacementCost}
                </p>

                <p
                  className={`mb-1 text-xs md:mb-0 ${verdictClass[row.verdict.type] || ""}`}
                >
                  {row.verdict.icon} {row.verdict.text}
                </p>

                <span className="hidden text-gray-400 md:block">›</span>
              </Link>
            ))}
          </div>

          {/* Sidebar: rule + links (desktop) / below on mobile */}
          <div className="flex w-full flex-col gap-2 md:w-72 md:shrink-0">
            <div className="flex items-start gap-2 border border-blue-200 bg-blue-50 p-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold uppercase text-blue-700">
                  {data.ruleOfThumb.title}
                </h3>
                <p className="text-xs text-gray-700">{data.ruleOfThumb.text}</p>
              </div>
              <div className="shrink-0 text-center">
                <p className="text-2xl font-bold text-blue-700">
                  {data.ruleOfThumb.percent}
                </p>
                <p className="text-[10px] font-semibold text-blue-700">
                  {data.ruleOfThumb.percentLabel}
                </p>
              </div>
            </div>

            <div className="border border-gray-200">
              <h3 className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 text-sm font-bold uppercase text-blue-700">
                Deeper Analysis Links
              </h3>
              <ul>
                {data.deeperLinks.map((link) => (
                  <li key={link.id} className="border-b border-gray-200 last:border-b-0">
                    <Link
                      href={link.href}
                      className="flex items-start gap-2 px-2 py-1.5 text-black hover:bg-gray-50"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs text-white">
                        {link.id}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-blue-700">
                          {link.label}
                        </p>
                        <p className="text-xs text-gray-600">{link.purpose}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
