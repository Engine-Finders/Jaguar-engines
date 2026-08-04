export default function EditorialPullQuote({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: data.title }} />
      <blockquote>
        <div dangerouslySetInnerHTML={{ __html: data.quote }} />
      </blockquote>
      <hr />
    </section>
  );
}
