export default function ReplacementCosts({ data }) {
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
  {data.rows?.map((row) => (
    <tr key={`${row.component}-${row.componentCode}`}>
      <td dangerouslySetInnerHTML={{ __html: row.variant || row.component || "" }} />
      <td dangerouslySetInnerHTML={{ __html: row.engineCode || row.componentCode || "" }} />
      <td dangerouslySetInnerHTML={{ __html: row.usedSupply || "" }} />
      <td dangerouslySetInnerHTML={{ __html: row.reconditionedSupply || "" }} />
      <td dangerouslySetInnerHTML={{ __html: row.rebuiltSupply || row.newSupply || "" }} />
      <td dangerouslySetInnerHTML={{ __html: row.labourHours || "" }} />
    </tr>
  ))}
</tbody>
      </table>

      {data.note && <div dangerouslySetInnerHTML={{ __html: data.note }} />}
      <hr />
    </section>
  );
}
