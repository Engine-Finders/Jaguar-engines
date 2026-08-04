export default function ClosingActionCards({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />
      {data.cards?.map((card) => (
        <p key={card.title}>
          {card.icon} <strong dangerouslySetInnerHTML={{ __html: card.title }} /> — <span dangerouslySetInnerHTML={{ __html: card.text }} />{" "}
          <a
            href={card.href}
            dangerouslySetInnerHTML={{ __html: card.href }}
          />
        </p>
      ))}
      {data.footerNote && <div dangerouslySetInnerHTML={{ __html: data.footerNote }} />}
      <hr />
    </section>
  );
}
