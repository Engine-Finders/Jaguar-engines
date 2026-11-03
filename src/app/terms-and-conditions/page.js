import LegalPage from "@/components/shared/LegalPage";

export const metadata = {
  title: "Terms and Conditions | Jaguar Engines UK",
  description: "Terms and conditions for using Jaguar Engines UK.",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPage title="Terms and Conditions">
      <p>
        By using jaguarengines.uk (&quot;the Site&quot;), you agree to these Terms and Conditions.
        If you do not agree, please do not use the Site.
      </p>

      <h2>About this site</h2>
      <p>
        Jaguar Engines UK provides independent editorial information, tools, and enquiry forms
        related to Jaguar engines and ownership. We are not affiliated with Jaguar Land Rover.
      </p>

      <h2>Information only</h2>
      <p>
        Content on this Site is for general guidance only. It is not professional mechanical,
        legal, or financial advice. Always confirm details with a qualified specialist before
        making repair or purchase decisions.
      </p>

      <h2>Quotes and enquiries</h2>
      <p>
        When you submit a quote or contact form, you confirm that the information you provide is
        accurate and that we may use it to respond to your request and share it with relevant
        partners where needed to help fulfil the enquiry.
      </p>

      <h2>Accuracy</h2>
      <p>
        We aim to keep information useful and up to date, but we do not guarantee that all content
        is complete, current, or error-free.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for any loss or damage arising
        from your use of the Site or reliance on its content.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Site after changes means
        you accept the updated Terms.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these Terms, contact us via the Contact page on jaguarengines.uk.
      </p>
    </LegalPage>
  );
}
