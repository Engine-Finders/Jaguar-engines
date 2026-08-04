export default function RepairBuyOrReplace({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />

      {data.canItBeRepaired && (
        <>
          <h3
            dangerouslySetInnerHTML={{
              __html: data.canItBeRepaired.title,
            }}
          />

          <table border="1" cellPadding="4" cellSpacing="0">
            <thead>
              <tr>
                {data.canItBeRepaired.columns?.map((col) => (
                  <th key={col} dangerouslySetInnerHTML={{ __html: col }} />
                ))}
              </tr>
            </thead>
            <tbody>
              {data.canItBeRepaired.rows?.map((row) => (
                <tr key={row.problem}>
                  <td dangerouslySetInnerHTML={{ __html: row.problem }} />
                  <td dangerouslySetInnerHTML={{ __html: row.repairable }} />
                  <td dangerouslySetInnerHTML={{ __html: row.typicalCost }} />
                  <td
                    dangerouslySetInnerHTML={{
                      __html: row.whenItMakesSense,
                    }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {data.buyingChecks && (
        <>
          <h3
            dangerouslySetInnerHTML={{
              __html: data.buyingChecks.title,
            }}
          />

          {data.buyingChecks.buyIf?.length > 0 && (
            <>
              <h4 dangerouslySetInnerHTML={{ __html: "Buy if" }} />
              <ul>
                {data.buyingChecks.buyIf.map((item) => (
                  <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            </>
          )}

          {data.buyingChecks.avoidIf?.length > 0 && (
            <>
              <h4 dangerouslySetInnerHTML={{ __html: "Avoid if" }} />
              <ul>
                {data.buyingChecks.avoidIf.map((item) => (
                  <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            </>
          )}
        </>
      )}

      {data.closingVerdict && (
        <div dangerouslySetInnerHTML={{ __html: data.closingVerdict }} />
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