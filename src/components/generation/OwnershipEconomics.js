export default function OwnershipEconomics({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />

      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            {data.columns.length > 0 && data.columns.map((col) => (
              <th key={col} dangerouslySetInnerHTML={{ __html: col }} />
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.length > 0 && data.rows.map((row) => (
            <tr key={row.engine}>
              <td dangerouslySetInnerHTML={{ __html: row.engine }} />
              <td dangerouslySetInnerHTML={{ __html: row.typicalMileage }} />
              <td dangerouslySetInnerHTML={{ __html: row.commonMajorFailure }} />
              <td dangerouslySetInnerHTML={{ __html: row.repairCostSpecialist }} />
              <td dangerouslySetInnerHTML={{ __html: row.replacementCostRecon }} />
              <td dangerouslySetInnerHTML={{ __html: row.ownershipVerdict }} />
            </tr>
          ))}
        </tbody>
      </table>

      {data.economicsRule && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: data.economicsRule.title }} />
          <div dangerouslySetInnerHTML={{ __html: data.economicsRule.text }} />
        </>
      )}

      {data.keyTakeaways.length > 0 && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: "Key takeaways" }} />
          <ul>
            {data.keyTakeaways.map((item) => (
              <li key={item.question}>
                <strong dangerouslySetInnerHTML={{ __html: item.question }} /> — <span dangerouslySetInnerHTML={{ __html: item.answer }} />
              </li>
            ))}
          </ul>
        </>
      )}
      <hr />
    </section>
  );
}
