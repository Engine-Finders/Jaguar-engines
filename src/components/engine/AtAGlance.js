export default function AtAGlance({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: "At a Glance" }} />
      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            <th dangerouslySetInnerHTML={{ __html: "Metric" }} />
            <th dangerouslySetInnerHTML={{ __html: "Value" }} />
          </tr>
        </thead>
        <tbody>
          {data.rows?.map((row) => (
            <tr key={row.metric}>
              <td dangerouslySetInnerHTML={{ __html: row.metric }} />
              <td dangerouslySetInnerHTML={{ __html: row.value }} />
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
    </section>
  );
}