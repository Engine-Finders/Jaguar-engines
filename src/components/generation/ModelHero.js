export default function ModelHero({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      {data.tagPill && <div dangerouslySetInnerHTML={{ __html: data.tagPill }} />}
      <h1 dangerouslySetInnerHTML={{ __html: data.h1 }} />
      {data.subHeadline && <div dangerouslySetInnerHTML={{ __html: data.subHeadline }} />}

      {data.trustStrip?.length > 0 && (
        <ul>
          {data.trustStrip.map((item) => (
            <li key={item.label}>
              {item.icon} <span dangerouslySetInnerHTML={{ __html: item.label }} />
            </li>
          ))}
        </ul>
      )}

      {data.primaryCta && (
        <p>
          <a
            href={data.primaryCta.href}
            dangerouslySetInnerHTML={{ __html: data.primaryCta.label }}
          />
        </p>
      )}

      {data.dataIntegrityNote && <div dangerouslySetInnerHTML={{ __html: data.dataIntegrityNote }} />}
      <hr />
    </section>
  );
}