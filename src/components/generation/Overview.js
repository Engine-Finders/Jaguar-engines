export default function Overview({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />
      {data.intro && <div dangerouslySetInnerHTML={{ __html: data.intro }} />}
      {data.keyFacts && <div dangerouslySetInnerHTML={{ __html: data.keyFacts }} />}
      {data.marketIntelligenceLine && <div dangerouslySetInnerHTML={{ __html: data.marketIntelligenceLine }} />}
      <hr />
    </section>
  );
}