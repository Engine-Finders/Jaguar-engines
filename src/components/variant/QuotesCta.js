export default function QuotesCta({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.headline }} />

      {data.supportingLine && (
        <div dangerouslySetInnerHTML={{ __html: data.supportingLine }} />
      )}

      {data.button && (
        <p>
          <a
            href={data.button.href}
            dangerouslySetInnerHTML={{ __html: data.button.label }}
          />
        </p>
      )}

      <hr />
    </section>
  );
}