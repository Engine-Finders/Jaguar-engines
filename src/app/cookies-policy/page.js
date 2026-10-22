import LegalPage from "@/components/shared/LegalPage";

export const metadata = {
  title: "Cookies Policy | Jaguar Engines UK",
  description: "How Jaguar Engines UK uses cookies and similar technologies.",
};

export default function CookiesPolicyPage() {
  return (
    <LegalPage title="Cookies Policy">
      <p>
        This Cookies Policy explains how jaguarengines.uk uses cookies and similar technologies.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help the
        site work properly and can provide basic usage information.
      </p>

      <h2>How we use cookies</h2>
      <p>We may use cookies to:</p>
      <ul>
        <li>Keep basic site preferences working (for example theme settings)</li>
        <li>Understand how visitors use the site so we can improve it</li>
        <li>Support essential site functions and security</li>
      </ul>

      <h2>Managing cookies</h2>
      <p>
        You can control or delete cookies through your browser settings. If you block some cookies,
        parts of the site may not work as expected.
      </p>

      <h2>Updates</h2>
      <p>
        We may update this Cookies Policy from time to time. The &quot;Last updated&quot; date at the
        top of this page will change when we do.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about cookies on this site, contact us via the Contact page on
        jaguarengines.uk.
      </p>
    </LegalPage>
  );
}
