export default function OwnershipVerdict({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.h2 }} />
      {data.metrics?.map((row) => (
        <p key={row.metric}>
          <strong dangerouslySetInnerHTML={{ __html: row.metric }} />: <span dangerouslySetInnerHTML={{ __html: row.ourCall }} />
        </p>
      ))}
      {data.oneLineVerdict && (
        <p>
          <strong dangerouslySetInnerHTML={{ __html: "One-line verdict:" }} /> <span dangerouslySetInnerHTML={{ __html: data.oneLineVerdict }} />
        </p>
      )}
      <hr />
    </section>
  );
}
