export default function ReplacementCosts({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />
      {data.subHeadline && <div dangerouslySetInnerHTML={{ __html: data.subHeadline }} />}

      {data.tables?.map((table) => (
        <div key={table.title}>
          <h3 dangerouslySetInnerHTML={{ __html: table.title }} />
          <table border="1" cellPadding="4" cellSpacing="0">
            <thead>
              <tr>
                {table.columns?.map((col) => (
                  <th key={col} dangerouslySetInnerHTML={{ __html: col }} />
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows?.map((row) => (
                <tr key={row.model}>
                  <td dangerouslySetInnerHTML={{ __html: row.model }} />
                  <td dangerouslySetInnerHTML={{ __html: row.engineCode }} />
                  <td dangerouslySetInnerHTML={{ __html: row.usedSupply }} />
                  <td dangerouslySetInnerHTML={{ __html: row.reconditionedSupply }} />
                  <td dangerouslySetInnerHTML={{ __html: row.rebuiltSupply }} />
                  <td dangerouslySetInnerHTML={{ __html: row.labourHours }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {data.figuresNote && <div dangerouslySetInnerHTML={{ __html: data.figuresNote }} />}
      {data.labourEstimate && <div dangerouslySetInnerHTML={{ __html: data.labourEstimate }} />}

      {data.economicsBox && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: data.economicsBox.title }} />
          <div dangerouslySetInnerHTML={{ __html: data.economicsBox.text }} />
        </>
      )}
      <hr />
    </section>
  );
}
