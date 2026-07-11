import Image from "next/image";

export default function HomeSec11({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl">
        <div className="mb-3 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-black md:text-4xl">
              BMW Engine History — Six Decades of Engineering
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

        <div className="mb-2 border border-gray-200">
          <div className="hidden bg-blue-700 px-2 py-1 text-xs font-semibold text-white md:grid md:grid-cols-3 md:gap-2">
            {data.columns.map((col) => (
              <span key={col}>{col}</span>
            ))}
          </div>

          {data.eras.map((row) => (
            <div
              key={row.era}
              className="border-b border-gray-200 px-2 py-2 last:border-b-0 md:grid md:grid-cols-3 md:gap-2"
            >
              <p className="text-sm font-bold text-black">{row.era}</p>
              <p className="text-xs text-gray-700">
                <span className="md:hidden text-gray-500">Engines: </span>
                {row.engines}
              </p>
              <p className="text-xs text-gray-700">
                <span className="md:hidden text-gray-500">Models: </span>
                {row.models}
              </p>
            </div>
          ))}
        </div>

        <div className="border border-blue-200 bg-blue-50 p-2">
          <p className="text-sm font-bold text-blue-700">Key Takeaway</p>
          <p className="text-xs text-gray-700">{data.keyTakeaway}</p>
        </div>
      </div>
    </section>
  );
}
