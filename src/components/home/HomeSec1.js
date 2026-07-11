import Image from "next/image";
import Link from "next/link";

export default function HomeSec1({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto flex w-full max-w-8xl flex-col gap-3 md:flex-row md:items-center">
        {/* Image: first on mobile, right on desktop */}
        <div className="relative order-1 h-48 w-full md:order-2 md:h-72 md:w-1/2">
          <Image
            src={data.image.src}
            alt={data.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Text: second on mobile, left on desktop */}
        <div className="order-2 flex w-full flex-col gap-2 md:order-1 md:w-1/2">
          <h1 className="text-3xl font-bold text-black md:text-5xl">
            The UK&apos;s Most Trusted BMW Ownership Guide
          </h1>

          <p className="text-sm text-gray-700">{data.subHeadline}</p>

          <ul className="flex flex-col gap-2 border border-gray-200 bg-gray-50 p-2 md:flex-row md:items-start md:gap-3">
            {data.trustStrip.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm text-black md:flex-1 md:flex-col md:items-start">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          <Link
            href={data.cta.href}
            className="inline-block w-full bg-blue-700 px-3 py-2 text-center text-sm font-semibold text-white md:w-auto"
          >
            {data.cta.label} →
          </Link>
        </div>
      </div>
    </section>
  );
}
