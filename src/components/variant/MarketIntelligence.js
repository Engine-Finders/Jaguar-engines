export default function MarketIntelligence({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: "Market Intelligence" }} />

      {data.items?.length > 0 && (
        <ul>
          {data.items.map((item) => (
            <li key={item.label}>
              <strong
                dangerouslySetInnerHTML={{ __html: `${item.label}:` }}
              />
              {" "}
              <span
                dangerouslySetInnerHTML={{ __html: item.value }}
              />
            </li>
          ))}
        </ul>
      )}

      <hr />
    </section>
  );
}