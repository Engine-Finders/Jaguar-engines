import LegalPage from "@/components/shared/LegalPage";

export const metadata = {
  title: "Privacy Policy | Jaguar Engines UK",
  description: "How Jaguar Engines UK collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This Privacy Policy explains how Jaguar Engines UK (&quot;we&quot;, &quot;us&quot;) handles personal
        information when you use jaguarengines.uk.
      </p>

      <h2>Information we collect</h2>
      <p>We may collect information you provide through forms on this site, including:</p>
      <ul>
        <li>Name, email address, phone number, and postcode</li>
        <li>Vehicle details such as registration (VRM), make, model, fuel type, and engine capacity</li>
        <li>Any message or notes you submit with a quote request</li>
      </ul>

      <h2>How we use your information</h2>
      <p>We use this information to:</p>
      <ul>
        <li>Respond to quote and enquiry requests</li>
        <li>Provide engine guidance and specialist introductions where relevant</li>
        <li>Improve our website and services</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We may share enquiry details with trusted partners or specialists needed to fulfil your
        request. We do not sell your personal information.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep enquiry information only as long as needed for the purpose it was collected, or as
        required by law.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal information by
        contacting us through the details on this website.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, contact us via the Contact page on jaguarengines.uk.
      </p>
    </LegalPage>
  );
}
