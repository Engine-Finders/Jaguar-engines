export default function BestWorstEngines({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: "Best & Worst Engines" }} />
      {data.items?.map((item) => (
        <div key={item.slot}>
          <h3 dangerouslySetInnerHTML={{ __html: item.slot }} />
          <p>
            <strong dangerouslySetInnerHTML={{ __html: item.engine }} />
          </p>
          <div dangerouslySetInnerHTML={{ __html: item.quote }} />
          {item.whoItsFor && <p>Who it&apos;s for: <span dangerouslySetInnerHTML={{ __html: item.whoItsFor }} /></p>}
          {item.modelWideNote && <div dangerouslySetInnerHTML={{ __html: item.modelWideNote }} />}
          {item.checkBFlag && <p>Check B flag: true</p>}
        </div>
      ))}
      <hr />
    </section>
  );
}