export default function EngineCodes({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: "Engine Codes" }} />

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
            <tr key={row.engineCode}>
              <td dangerouslySetInnerHTML={{ __html: row.engineCode }} />
              <td dangerouslySetInnerHTML={{ __html: row.years }} />
              <td dangerouslySetInnerHTML={{ __html: row.power }} />
              <td dangerouslySetInnerHTML={{ __html: row.enquiries }} />
              <td dangerouslySetInnerHTML={{ __html: row.avgReconCost }} />
            </tr>
          ))}
        </tbody>
      </table>

      {data.matchNote && (
        <div dangerouslySetInnerHTML={{ __html: data.matchNote }} />
      )}

      {data.technicalSpecs && (
        <>
          <h3
            dangerouslySetInnerHTML={{
              __html: data.technicalSpecs.title,
            }}
          />
          <ul>
            {data.technicalSpecs.items?.map((item) => (
              <li key={item.label}>
                <span dangerouslySetInnerHTML={{ __html: `${item.label}: ` }} />
                <span dangerouslySetInnerHTML={{ __html: item.value }} />
              </li>
            ))}
          </ul>
        </>
      )}

      {data.cta && (
        <p>
          <a
            href={data.cta.href}
            dangerouslySetInnerHTML={{ __html: data.cta.label }}
          />
        </p>
      )}
      <hr />
    </section>
  );
}