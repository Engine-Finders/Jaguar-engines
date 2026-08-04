export default function CommonProblems({ data }) {
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
          {data.problems?.map((row) => (
            <tr key={row.id}>
              <td dangerouslySetInnerHTML={{ __html: row.id }} />
              <td dangerouslySetInnerHTML={{ __html: row.issue }} />
              <td dangerouslySetInnerHTML={{__html: row.description }} />
              <td>
                {row.severity?.icon} <span dangerouslySetInnerHTML={{ __html: row.severity?.label }} />
              </td>
              <td>
                {row.link && <a  href={row.link.href} dangerouslySetInnerHTML={{ __html: row.link.label }} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.urgencyKey?.length > 0 && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: "Urgency key" }} />
          <ul>
            {data.urgencyKey.map((item) => (
              <li key={item.label}>
                {item.icon} <span dangerouslySetInnerHTML={{ __html: item.label }} /> — <span dangerouslySetInnerHTML={{ __html: item.text }} />
              </li>
            ))}
          </ul>
        </>
      )}
      <hr />
    </section>
  );
}
