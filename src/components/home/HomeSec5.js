import Image from "next/image";
import Link from "next/link";

export default function HomeSec5({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl">
        {/* Header: text left, images right */}
        <div className="mb-3 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-black md:text-4xl">
              Comparison Hub — Head-to-Head Verdicts
            </h2>
            <p className="text-sm text-gray-600">{data.subHeadline}</p>
          </div>
          <div className="flex shrink-0 gap-1">
            {data.headerImages.map((img) => (
              <div key={img.alt} className="relative h-16 w-20 md:h-24 md:w-32">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 2-col grid | Mobile: stacked */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {data.comparisons.map((item) => (
            <article
              key={item.id}
              className="relative border border-gray-200 p-2"
            >
              <span className="absolute left-2 top-2 z-10 bg-blue-700 px-1.5 py-0.5 text-xs font-semibold text-white">
                {item.id}
              </span>

              {/* Mobile: image on top | Desktop: image left of text */}
              <div className="flex flex-col gap-2 md:flex-row">
                <div className="relative mt-5 h-28 w-full shrink-0 md:mt-0 md:h-32 md:w-40">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 160px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-1 text-xs text-gray-700">
                    {item.vsLabels.map((label, i) => (
                      <span key={label} className="flex items-center gap-1">
                        {i > 0 && (
                          <span className="font-semibold text-gray-400">vs</span>
                        )}
                        <span>{label}</span>
                      </span>
                    ))}
                  </div>
                  <h3 className="text-sm font-bold text-black">{item.title}</h3>
                  <p className="mb-1 text-xs text-gray-600">{item.preview}</p>
                  <Link
                    href={item.link.href}
                    className="text-xs font-semibold text-blue-700"
                  >
                    {item.link.label}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-3 border border-blue-200 bg-blue-50 p-2 md:hidden">
          <p className="mb-2 text-sm text-black">{data.bottomCta.text}</p>
          <Link
            href={data.bottomCta.href}
            className="block bg-blue-700 px-3 py-2 text-center text-sm font-semibold text-white"
          >
            {data.bottomCta.buttonLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
