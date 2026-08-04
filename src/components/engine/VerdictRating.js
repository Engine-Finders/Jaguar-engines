export default function VerdictRating({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: "Verdict & Rating" }} />
      {data.starRating && <p>Rating: <span dangerouslySetInnerHTML={{ __html: data.starRating }} /></p>}
      {data.confidence && <div dangerouslySetInnerHTML={{ __html: data.confidence }} />}
      {data.scoreNote && <div dangerouslySetInnerHTML={{ __html: data.scoreNote }} />}

      {data.scoreBreakdown && (
        <table border="1" cellPadding="4" cellSpacing="0">
          <thead>
            <tr>
              {data.scoreBreakdown.columns?.map((col) => (
                <th key={col} dangerouslySetInnerHTML={{ __html: col }} />
              ))}
            </tr>
          </thead>
          <tbody>
            {data.scoreBreakdown.rows?.map((row) => (
              <tr key={row.dimension}>
                <td dangerouslySetInnerHTML={{ __html: row.dimension }} />
                <td dangerouslySetInnerHTML={{ __html: row.score }} />
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data.oneLineVerdict && <div dangerouslySetInnerHTML={{ __html: data.oneLineVerdict }} />}
      {data.bestFor && <p>Best for: <span dangerouslySetInnerHTML={{ __html: data.bestFor }} /></p>}
      {data.avoidIf && <p>Avoid if: <span dangerouslySetInnerHTML={{ __html: data.avoidIf }} /></p>}
      <hr />
    </section>
  );
}
