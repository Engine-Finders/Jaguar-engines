export default function EraMap({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.title }} />

      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            {data.columns?.map((col) => (
              <th key={col} dangerouslySetInnerHTML={{ __html: col }} />
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows?.map((row) => (
            <tr key={row.generation}>
              <td dangerouslySetInnerHTML={{ __html: row.generation }} />
              <td dangerouslySetInnerHTML={{ __html: row.years }} />
              <td dangerouslySetInnerHTML={{ __html: row.engineCode }} />
              <td dangerouslySetInnerHTML={{ __html: row.reliability }} />
              <td dangerouslySetInnerHTML={{ __html: row.reconCost }} />
              <td dangerouslySetInnerHTML={{ __html: row.eraNote }} />
            </tr>
          ))}
        </tbody>
      </table>

      {data.sourceNote && (
        <div dangerouslySetInnerHTML={{ __html: data.sourceNote }} />
      )}
      {data.dataNote && (
        <div dangerouslySetInnerHTML={{ __html: data.dataNote }} />
      )}
      <hr />
    </section>
  );
}