export default function EngineDatabase({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />
      {data.subHeadline && <div dangerouslySetInnerHTML={{ __html: data.subHeadline }} />}

      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            {data.columns?.map((col) => (
              <th key={col} dangerouslySetInnerHTML={{ __html: col }} />
            ))}
          </tr>
        </thead>
        <tbody>
          {data.engines?.map((row) => (
            <tr key={row.engineCode}>
              <td dangerouslySetInnerHTML={{ __html: row.engineCode }} />
              <td dangerouslySetInnerHTML={{ __html: row.family }} />
              <td dangerouslySetInnerHTML={{ __html: row.fuel }} />
              <td dangerouslySetInnerHTML={{ __html: row.displacement }} />
              <td dangerouslySetInnerHTML={{ __html: row.power }} />
              <td dangerouslySetInnerHTML={{ __html: row.years }} />
              <td dangerouslySetInnerHTML={{ __html: row.variants || row.model || "" }} />
              <td dangerouslySetInnerHTML={{ __html: row.reliability || "" }} />
              <td dangerouslySetInnerHTML={{ __html: row.enquiries || "" }} />
              <td dangerouslySetInnerHTML={{ __html: row.avgReconCost || row.avgRebuildCost || "" }} />
            </tr>
          ))}
        </tbody>
      </table>

      {data.confidenceScore?.text && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: data.confidenceScore.title || "Confidence Score" }} />
          <div dangerouslySetInnerHTML={{ __html: data.confidenceScore.text }} />
        </>
      )}

      {data.dataCorrections?.length > 0 && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: "Data notes" }} />
          <ul>
            {data.dataCorrections.map((note) => (
              <li key={note.slice(0, 48)} dangerouslySetInnerHTML={{ __html: note }} />
            ))}
          </ul>
        </>
      )}
      <hr />
    </section>
  );
}
