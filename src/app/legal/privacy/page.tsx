import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How we collect, use, and protect information when you use this platform.",
  path: "/legal/privacy/",
});

const EFFECTIVE_DATE = "July 7, 2026";

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Privacy", href: "/legal/privacy/" }]} />
      <div className="max-w-reading">
        <Eyebrow className="mb-3">Legal</Eyebrow>
        <h1 className="text-h1">Privacy Policy</h1>
        <p className="mt-2 text-body-sm text-secondary">Effective date: {EFFECTIVE_DATE}</p>

        <div className="prose-keel mt-8">
          <p>
            This Privacy Policy describes how information is collected, used, disclosed, and safeguarded when you
            access or use this website and related online services (collectively, the &ldquo;Service&rdquo;). By using
            the Service, you acknowledge this Policy. If you do not agree, do not use the Service.
          </p>

          <h2>1. Roles and scope</h2>
          <p>
            For account, billing, and platform operation data, we act as a controller or business, as applicable under
            privacy law. For documents, vendor records, workflow content, and other materials you or your organization
            upload or generate through the Service (&ldquo;Customer Content&rdquo;), we generally act as a processor or
            service provider on your instructions. You are responsible for providing any required notices and obtaining
            any required consents from your users, vendors, employees, and other individuals whose data you submit.
          </p>

          <h2>2. Information we collect</h2>
          <ul>
            <li>
              <strong>Account and profile data:</strong> name, email address, authentication credentials, organization
              affiliation, role assignments, and preferences you provide.
            </li>
            <li>
              <strong>Customer Content:</strong> files, metadata, form responses, signatures, comments, audit events,
              and workflow records you or your invitees submit.
            </li>
            <li>
              <strong>Billing data:</strong> subscription status, plan selections, and payment-related identifiers
              processed by our payment provider. We do not store full payment card numbers on our servers.
            </li>
            <li>
              <strong>Technical and usage data:</strong> IP address, device and browser type, log files, timestamps,
              pages viewed, feature usage, error reports, and security signals.
            </li>
            <li>
              <strong>Communications:</strong> support requests, feedback, and messages you send to us.
            </li>
            <li>
              <strong>Information from third parties:</strong> identity verification, fraud prevention, email delivery,
              analytics, hosting, and integration partners, as configured for the Service.
            </li>
          </ul>

          <h2>3. How we use information</h2>
          <p>We use information to:</p>
          <ul>
            <li>provide, operate, maintain, secure, and improve the Service;</li>
            <li>authenticate users, enforce access controls, and prevent abuse;</li>
            <li>process transactions and manage subscriptions;</li>
            <li>send transactional, security, and service-related communications;</li>
            <li>generate logs, audit trails, and operational metrics;</li>
            <li>comply with law, respond to lawful requests, and protect rights and safety;</li>
            <li>develop new features and fix defects, including through automated processing of uploaded content where enabled.</li>
          </ul>
          <p>
            We do not sell personal information. We do not use Customer Content to train generalized public machine
            learning models unless you separately opt in to a feature that expressly states otherwise.
          </p>

          <h2>4. Legal bases (where applicable)</h2>
          <p>
            Where required, we rely on contract performance, legitimate interests (such as security, fraud prevention,
            and product improvement), legal obligation, and consent where appropriate.
          </p>

          <h2>5. How we share information</h2>
          <p>We may share information with:</p>
          <ul>
            <li>
              <strong>Service providers and subprocessors</strong> that host infrastructure, deliver email, process
              payments, provide analytics, or otherwise support the Service under contractual confidentiality and
              security obligations;
            </li>
            <li>
              <strong>Your organization and authorized users</strong> according to your workspace permissions;
            </li>
            <li>
              <strong>External recipients you direct</strong> through magic links, vendor portals, signature requests,
              or similar workflow features;
            </li>
            <li>
              <strong>Professional advisers, auditors, and potential transaction parties</strong> under confidentiality
              obligations;
            </li>
            <li>
              <strong>Law enforcement or regulators</strong> when required by law or when we believe disclosure is
              necessary to protect rights, safety, or the integrity of the Service.
            </li>
          </ul>
          <p>We may also share aggregated or de-identified information that cannot reasonably identify you.</p>

          <h2>6. International transfers</h2>
          <p>
            Information may be processed in countries other than your own. Where required, we implement appropriate
            safeguards for cross-border transfers.
          </p>

          <h2>7. Retention</h2>
          <p>
            We retain information for as long as needed to provide the Service, comply with legal obligations, resolve
            disputes, enforce agreements, and maintain security. Retention periods may vary by data category and your
            organization&apos;s settings. You may request deletion subject to applicable law and technical limitations.
          </p>

          <h2>8. Security</h2>
          <p>
            We implement administrative, technical, and organizational measures designed to protect information.
            However, no method of transmission or storage is completely secure. You are responsible for safeguarding
            your credentials and configuring access within your organization appropriately.
          </p>

          <h2>9. Your rights and choices</h2>
          <p>
            Depending on your location, you may have rights to access, correct, delete, restrict, object to processing,
            or receive a portable copy of personal information, and to withdraw consent where processing is consent-based.
            Organization administrators may control much of the data in a workspace. To exercise rights, contact us using
            the details below. We may need to verify your request and may deny requests where permitted by law.
          </p>

          <h2>10. Cookies and similar technologies</h2>
          <p>
            We use cookies, local storage, and similar technologies for authentication, security, preferences, and
            analytics. You can control cookies through browser settings; disabling some cookies may impair functionality.
          </p>

          <h2>11. Children</h2>
          <p>
            The Service is not directed to children under 16, and we do not knowingly collect personal information from
            children. If you believe a child has provided information, contact us and we will take appropriate steps.
          </p>

          <h2>12. Third-party sites and integrations</h2>
          <p>
            The Service may link to or integrate with third-party services. Their privacy practices are governed by
            their own policies. We are not responsible for third-party practices.
          </p>

          <h2>13. Changes to this Policy</h2>
          <p>
            We may update this Policy from time to time. Material changes will be posted on this page with an updated
            effective date. Continued use after changes become effective constitutes acceptance of the revised Policy.
          </p>

          <h2>14. Contact</h2>
          <p>
            Privacy questions or requests:{" "}
            <a href={`mailto:${site.contactEmail}`} className="text-accent hover:underline">
              {site.contactEmail}
            </a>
            .
          </p>

          <p className="text-caption">
            This Policy is provided for operational transparency. It is not legal advice. Consider independent counsel
            review for your jurisdiction and use case.
          </p>
        </div>
      </div>
    </Container>
  );
}
