export default function TrustBlock({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />
      {data.signals?.map((item) => (
        <p key={item.title}>
          {item.icon} <strong dangerouslySetInnerHTML={{ __html: item.title }} /> — <span dangerouslySetInnerHTML={{ __html: item.text }} />
        </p>
      ))}
      <hr />
    </section>
  );
}
