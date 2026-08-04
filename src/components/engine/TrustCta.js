export default function TrustCta({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: "Why Owners Trust Us" }} />
      {data.trustPoints?.length > 0 && (
        <ul>
          {data.trustPoints.map((point) => (
            <li key={point} dangerouslySetInnerHTML={{ __html: point }} />
          ))}
        </ul>
      )}
      {data.finalCta && <div dangerouslySetInnerHTML={{ __html: data.finalCta }} />}
      {data.ctaButton && (
        <p>
          <a
            href={data.ctaButton.href}
            dangerouslySetInnerHTML={{ __html: data.ctaButton.label }}
          />
        </p>
      )}
      <hr />
    </section>
  );
}