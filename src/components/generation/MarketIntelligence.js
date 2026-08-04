export default function MarketIntelligence({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: "Market Intelligence" }} />

      {data.mostRequestedEngines?.length > 0 && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: "Most requested engines" }} />
          <ul>
            {data.mostRequestedEngines.map((item) => (
              <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </>
      )}

      {data.mostRequestedVariants?.length > 0 && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: "Most requested variants" }} />
          <ul>
            {data.mostRequestedVariants.map((item) => (
              <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </>
      )}

      {data.averageReplacementCost && (
        <p>Average replacement cost: <span dangerouslySetInnerHTML={{ __html: data.averageReplacementCost }} /></p>
      )}

      {data.mostCommonFailures?.length > 0 && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: "Most common failures" }} />
          <ul>
            {data.mostCommonFailures.map((item) => (
              <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </>
      )}

      {data.liveFeed?.length > 0 && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: "Live feed" }} />
          <table border="1" cellPadding="4" cellSpacing="0">
            <thead>
              <tr>
                <th dangerouslySetInnerHTML={{ __html: "Vehicle" }} />
                <th dangerouslySetInnerHTML={{ __html: "Location" }} />
                <th dangerouslySetInnerHTML={{ __html: "Issue" }} />
                <th dangerouslySetInnerHTML={{ __html: "Enquiries" }} />
                <th dangerouslySetInnerHTML={{ __html: "Updated" }} />
              </tr>
            </thead>
            <tbody>
              {data.liveFeed.map((row) => (
                <tr key={`${row.vehicle}-${row.location}-${row.issue}`}>
                  <td dangerouslySetInnerHTML={{ __html: row.vehicle }} />
                  <td dangerouslySetInnerHTML={{ __html: row.location }} />
                  <td dangerouslySetInnerHTML={{ __html: row.issue }} />
                  <td dangerouslySetInnerHTML={{ __html: row.enquiries }} />
                  <td dangerouslySetInnerHTML={{ __html: row.updated }} />
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <hr />
    </section>
  );
}
