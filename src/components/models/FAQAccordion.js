export default function FAQAccordion({ data }) {
  return (
    <section>
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );
}
