import Image from "next/image";

export default function HomeSec12({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl">
        <div className="mb-3 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-black md:text-4xl">
              Why Jaguar Owners Trust This Site
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

        {/* Desktop: 4-col | Mobile: stacked */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
          {data.signals.map((item) => (
            <article key={item.id} className="border border-gray-200 p-2">
              <div className="mb-1 flex items-center gap-2">
                <span className="bg-blue-700 px-1.5 py-0.5 text-xs font-semibold text-white">
                  {item.id}
                </span>
                <span className="text-lg">{item.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-black">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
