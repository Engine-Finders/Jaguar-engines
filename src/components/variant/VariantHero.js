export default function VariantHero({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      {data.tagPill && (
        <div dangerouslySetInnerHTML={{ __html: data.tagPill }} />
      )}

      <h1 dangerouslySetInnerHTML={{ __html: data.h1 }} />

      {data.subHeadline && (
        <div dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
      )}

      {data.trustBadges?.length > 0 && (
        <ul>
          {data.trustBadges.map((badge) => (
            <li key={badge} dangerouslySetInnerHTML={{ __html: badge }} />
          ))}
        </ul>
      )}

      {data.priceAnchor && (
        <div dangerouslySetInnerHTML={{ __html: data.priceAnchor }} />
      )}

      {data.registrationInput && (
        <p>
          <span
            dangerouslySetInnerHTML={{
              __html: data.registrationInput.flag,
            }}
          />{" "}
          <span
            dangerouslySetInnerHTML={{
              __html: data.registrationInput.placeholder,
            }}
          />

          {data.registrationInput.cta && (
            <>
              {" — "}
              <a
                href={data.registrationInput.cta.href}
                dangerouslySetInnerHTML={{
                  __html: data.registrationInput.cta.label,
                }}
              />
            </>
          )}
        </p>
      )}

      {data.ticker && (
        <div dangerouslySetInnerHTML={{ __html: data.ticker }} />
      )}

      <hr />
    </section>
  );
}