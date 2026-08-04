export default function FAQAccordion({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />
      {data.items?.map((item) => (
        <div key={item.id}>
          <h3>
            <span dangerouslySetInnerHTML={{ __html: `${item.id}. ` }} />
            <span dangerouslySetInnerHTML={{ __html: item.question }} />
          </h3>
          <div dangerouslySetInnerHTML={{ __html: item.answer }} />
        </div>
      ))}
      <hr />
    </section>
  );
}
