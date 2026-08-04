export default function EngineEvolution({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />
      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            {data.columns?.map((col) => (
              <th key={col} dangerouslySetInnerHTML={{ __html: col }} />
            ))}
          </tr>
        </thead>
        <tbody>
          {data.eras?.map((row) => (
            <tr key={row.era}>
              <td dangerouslySetInnerHTML={{ __html: row.era }} />
              <td dangerouslySetInnerHTML={{ __html: row.years }} />
              <td dangerouslySetInnerHTML={{ __html: row.keyEngines }} />
              <td dangerouslySetInnerHTML={{ __html: row.whyBmwChanged }} />
              <td dangerouslySetInnerHTML={{ __html: row.worthKnowing }} />
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
    </section>
  );
}
