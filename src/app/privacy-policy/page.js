import LegalPage from "@/components/shared/LegalPage";

export const metadata = {
  title: "Privacy Policy | Jaguar Engines UK",
  description:
    "How Jaguar Engines UK collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This Privacy Policy explains how Jaguar Engines UK (&quot;we&quot;,
        &quot;us&quot;) handles personal information when you use
        jaguarengines.uk.
      </p>

      <h2>Who we are</h2>
      <p>
        jaguarengines.uk is operated by <strong>PRESTIGE AUTO ENGINEERING LTD</strong>.
      </p>
      <p>
        Registered address: Unit A5 Windsor Road Commercial Estate, Ramsden Heath,
        Billericay, United Kingdom, CM11 1QE.
      </p>
      <p>Company number: 17406830</p>

      <h2>Information we collect</h2>
      <p>
        We may collect information you provide through forms on this site,
        including:
      </p>
      <ul>
        <li>Name, email address, phone number, and postcode</li>
        <li>
          Vehicle details such as registration (VRM), make, model, fuel type,
          and engine capacity
        </li>
        <li>Any message or notes you submit with a quote request</li>
      </ul>

      <h2>How we use your information</h2>
      <p>We use this information to:</p>
      <ul>
        <li>Respond to quote and enquiry requests</li>
        <li>
          Provide engine guidance and specialist introductions where relevant
        </li>
        <li>Improve our website and services</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We may share enquiry details with trusted partners or specialists needed
        to fulfil your request. We do not sell your personal information.
        Specialists may use your information only to handle your enquiry and
        provide the requested service, not for unrelated marketing or sharing
        with third parties except where legally required.
      </p>

      <h2>Data retention</h2>
      <p>
        We retain enquiry data for up to 3 years from your last interaction to
        handle complaints, disputes and legal claims. After this period, we
        delete or anonymise it unless the law requires longer retention.
        Suppliers may retain data under their own policies, and anonymised data
        may be kept indefinitely for analytics.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal
        information by contacting us through the details on this website.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, contact PRESTIGE AUTO ENGINEERING LTD at Unit A5
        Windsor Road Commercial Estate, Ramsden Heath, Billericay, United Kingdom,
        CM11 1QE, or via the Contact page on jaguarengines.uk.
      </p>
    </LegalPage>
  );
}
