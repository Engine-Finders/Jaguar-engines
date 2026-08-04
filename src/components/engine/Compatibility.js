export default function Compatibility({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: "Compatibility" }} />
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
            <tr key={`${row.model}-${row.generation}`}>
              <td dangerouslySetInnerHTML={{ __html: row.model }} />
              <td dangerouslySetInnerHTML={{ __html: row.generation }} />
              <td dangerouslySetInnerHTML={{ __html: row.variantBadge }} />
              <td dangerouslySetInnerHTML={{ __html: row.years }} />
            </tr>
          ))}
        </tbody>
      </table>
      {data.crossBrandNote && (
        <div dangerouslySetInnerHTML={{ __html: data.crossBrandNote }} />
      )}
      <hr />
    </section>
  );
}