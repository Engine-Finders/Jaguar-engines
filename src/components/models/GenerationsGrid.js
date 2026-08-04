export default function GenerationsGrid({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />
      {data.subHeadline && <div dangerouslySetInnerHTML={{ __html: data.subHeadline }} />}

      {data.cards?.map((card) => (
        <div key={card.title}>
          <h3 dangerouslySetInnerHTML={{ __html: card.title }} />
          {card.badge && <div dangerouslySetInnerHTML={{ __html: card.badge }} />}
          {card.meta && <div dangerouslySetInnerHTML={{ __html: card.meta }} />}
          {card.rating && <div dangerouslySetInnerHTML={{ __html: card.rating }} />}
          {card.verdict && (
            <p>
              <strong dangerouslySetInnerHTML={{ __html: "Our Verdict:" }} /> <span dangerouslySetInnerHTML={{ __html: card.verdict }} />
            </p>
          )}
          {card.cta && (
            <p>
              <a
                href={card.cta.href}
                dangerouslySetInnerHTML={{ __html: card.cta.label }}
              />
            </p>
          )}
        </div>
      ))}

      {data.rangeTable && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: data.rangeTable.title }} />
          <table border="1" cellPadding="4" cellSpacing="0">
            <thead>
              <tr>
                {data.rangeTable.columns?.map((col) => (
                  <th key={col} dangerouslySetInnerHTML={{ __html: col }} />
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rangeTable.rows?.map((row) => (
                <tr key={row.model}>
                  <td dangerouslySetInnerHTML={{ __html: row.model }} />
                  <td dangerouslySetInnerHTML={{ __html: row.engineCode }} />
                  <td dangerouslySetInnerHTML={{ __html: row.power }} />
                  <td dangerouslySetInnerHTML={{ __html: row.induction }} />
                  <td dangerouslySetInnerHTML={{ __html: row.years }} />
                  <td dangerouslySetInnerHTML={{ __html: row.notes }} />
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {data.comparisonLink && (
        <p>
          <a
            href={data.comparisonLink.href}
            dangerouslySetInnerHTML={{ __html: data.comparisonLink.label }}
          />
        </p>
      )}
      <hr />
    </section>
  );
}
