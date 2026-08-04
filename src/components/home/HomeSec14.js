import Link from "next/link";

export default function HomeSec14({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl border border-blue-200 bg-blue-50 p-3">
        <h2
          className="text-2xl font-bold text-black md:text-3xl"
          dangerouslySetInnerHTML={{ __html: data.title }}
        />

        <div
          className="mb-3 text-sm text-gray-600"
          dangerouslySetInnerHTML={{ __html: data.subHeadline }}
        />

        <div className="flex flex-col gap-2 md:flex-row">
          <Link
            href={data.primaryCta.href}
            className="bg-blue-700 px-3 py-2 text-center text-sm font-semibold text-white"
            dangerouslySetInnerHTML={{ __html: data.primaryCta.label }}
          />

          <Link
            href={data.secondaryCta.href}
            className="border border-blue-700 px-3 py-2 text-center text-sm font-semibold text-blue-700"
            dangerouslySetInnerHTML={{ __html: data.secondaryCta.label }}
          />
        </div>
      </div>
    </section>
  );
}