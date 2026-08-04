export default function BuyingChecklist({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: "Buying Checklist" }} />
      {data.intro && (
        <div dangerouslySetInnerHTML={{ __html: data.intro }} />
      )}
      {data.items?.length > 0 && (
        <ul>
          {data.items.map((item) => (
            <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      )}
      <hr />
    </section>
  );
}