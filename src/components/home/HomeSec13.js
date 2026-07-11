export default function HomeSec13({ data }) {
  return (
    <section className="bg-white px-3 py-3">
      <div className="mx-auto w-full max-w-8xl">
        <h2 className="mb-2 text-2xl font-bold text-black md:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="border border-gray-200">
          {data.items.map((item) => (
            <details
              key={item.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <summary className="cursor-pointer px-2 py-2 text-sm font-semibold text-black hover:bg-gray-50">
                Q{item.id}: {item.question}
              </summary>
              <p className="px-2 pb-2 text-xs text-gray-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
