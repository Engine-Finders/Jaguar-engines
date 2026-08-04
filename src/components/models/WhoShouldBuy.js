export default function WhoShouldBuy({ data }) {
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
          {data.profiles?.map((row) => (
            <tr key={row.buyerProfile}>
              <td dangerouslySetInnerHTML={{ __html: row.buyerProfile }} />
              <td dangerouslySetInnerHTML={{ __html: row.rating }} />
              <td dangerouslySetInnerHTML={{ __html: row.verdict }} />
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
    </section>
  );
}
