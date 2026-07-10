import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "Terms governing access to and use of this platform.",
  path: "/legal/terms/",
});

const EFFECTIVE_DATE = "July 7, 2026";

export default function TermsPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Terms", href: "/legal/terms/" }]} />
      <div className="max-w-reading">
        <Eyebrow className="mb-3">Legal</Eyebrow>
        <h1 className="text-h1">Terms of Service</h1>
        <p className="mt-2 text-body-sm text-secondary">Effective date: {EFFECTIVE_DATE}</p>

        <div className="prose-keel mt-8">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern access to and use of this website and related online
            services (collectively, the &ldquo;Service&rdquo;). The Service is operated by the entity that makes it
            available (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By creating an account, clicking to
            accept, or using the Service, you agree to these Terms on behalf of yourself and, if applicable, the
            organization you represent (&ldquo;you&rdquo; or &ldquo;Customer&rdquo;). If you do not agree, do not use
            the Service.
          </p>

          <h2>1. Eligibility and accounts</h2>
          <p>
            You must be at least 18 years old and able to form a binding contract. You are responsible for all activity
            under your account and for maintaining the confidentiality of credentials. Notify us promptly of unauthorized
            use. We may suspend or terminate accounts for violation of these Terms, risk to the Service, or non-payment.
          </p>

          <h2>2. The Service</h2>
          <p>
            The Service provides workflow, document, notification, monitoring, and related operational tools. Features
            may change, be added, or removed at any time. Beta, preview, or experimental features are provided as-is and
            may be discontinued without notice.
          </p>
          <p>
            <strong>No professional advice.</strong> The Service does not provide legal, tax, accounting, insurance,
            compliance, or other professional advice. Outputs, reminders, extraction results, screening matches, and
            alerts are informational only. You are solely responsible for evaluating results and meeting your legal and
            contractual obligations.
          </p>

          <h2>3. Customer Content and license</h2>
          <p>
            You retain ownership of content you submit (&ldquo;Customer Content&rdquo;). You grant us a worldwide,
            non-exclusive, royalty-free license to host, copy, transmit, display, process, and otherwise use Customer
            Content solely to provide, secure, and improve the Service, comply with law, and as otherwise instructed by
            you through the Service&apos;s functionality. You represent that you have all rights necessary to submit
            Customer Content and to grant this license.
          </p>

          <h2>4. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>violate law or third-party rights;</li>
            <li>upload malware, attempt unauthorized access, probe or scan systems, or interfere with the Service;</li>
            <li>reverse engineer or circumvent security or usage limits except where prohibited restrictions do not apply;</li>
            <li>use the Service to send spam or unlawful communications;</li>
            <li>misrepresent identity or submit false exclusion, compliance, or eligibility information;</li>
            <li>resell or provide the Service to third parties except as expressly permitted by your plan;</li>
            <li>use the Service in a manner that could harm us, other users, or infrastructure.</li>
          </ul>
          <p>We may investigate violations and cooperate with authorities as required.</p>

          <h2>5. Organizations, invitees, and third parties</h2>
          <p>
            If you use the Service on behalf of an organization, that organization is responsible for its users&apos;
            actions and configurations. If you receive a magic link, portal invitation, or similar access from a Customer,
            you agree to use it only for its intended purpose. Customers control how long such links remain valid and
            what data is collected.
          </p>

          <h2>6. Fees and billing</h2>
          <p>
            Paid plans are billed according to the pricing and billing interval shown at purchase or in your account.
            Fees are non-refundable except where required by law or expressly stated. You authorize us and our payment
            processor to charge applicable fees, taxes, and renewals until cancellation. Failure to pay may result in
            suspension or termination. Price changes apply to future billing periods with reasonable notice where required.
          </p>

          <h2>7. Confidentiality</h2>
          <p>
            Each party may receive non-public information from the other. The receiving party will use reasonable care to
            protect it and use it only for purposes of the relationship, except for information that is public, already
            known, independently developed, or rightfully received from a third party without restriction.
          </p>

          <h2>8. Privacy</h2>
          <p>
            Our collection and use of personal information is described in the{" "}
            <a href="/legal/privacy/" className="text-accent hover:underline">
              Privacy Policy
            </a>
            , which is incorporated by reference.
          </p>

          <h2>9. Third-party services</h2>
          <p>
            The Service may integrate with or rely on third-party providers (including hosting, email, payments, analytics,
            government data sources, and AI services). Those services are subject to their own terms. We are not
            responsible for third-party outages, changes, or acts.
          </p>

          <h2>10. Disclaimers</h2>
          <p>
            THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE.&rdquo; TO THE MAXIMUM EXTENT PERMITTED
            BY LAW, WE DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND ANY WARRANTIES ARISING FROM COURSE OF DEALING
            OR USAGE. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR THAT DATA WILL NOT
            BE LOST. AUTOMATED EXTRACTION, SCREENING, AND MONITORING MAY PRODUCE INCOMPLETE OR INACCURATE RESULTS.
          </p>

          <h2>11. Limitation of liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER WE NOR OUR SUPPLIERS, LICENSORS, OR AFFILIATES WILL BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST
            PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY. OUR TOTAL
            AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS WILL NOT EXCEED
            THE GREATER OF (A) THE AMOUNTS YOU PAID US FOR THE SERVICE IN THE TWELVE (12) MONTHS BEFORE THE EVENT GIVING
            RISE TO LIABILITY OR (B) ONE HUNDRED U.S. DOLLARS (US$100). SOME JURISDICTIONS DO NOT ALLOW CERTAIN
            LIMITATIONS; IN THOSE CASES, OUR LIABILITY IS LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
          </p>

          <h2>12. Indemnification</h2>
          <p>
            You will defend, indemnify, and hold harmless us and our officers, directors, employees, contractors, and
            agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable
            attorneys&apos; fees) arising from: (a) your Customer Content; (b) your use of the Service; (c) your
            violation of these Terms or law; or (d) any dispute between you and your users, vendors, employees, or other
            third parties. We may assume exclusive defense and control of any matter subject to indemnification, and you
            will cooperate.
          </p>

          <h2>13. Suspension and termination</h2>
          <p>
            You may stop using the Service at any time. We may suspend or terminate access immediately for breach,
            security risk, abuse, non-payment, or to comply with law. Upon termination, your right to use the Service
            ends. Provisions that by nature should survive will survive, including ownership, disclaimers, limitation of
            liability, indemnification, and governing law.
          </p>

          <h2>14. Export and sanctions</h2>
          <p>
            You may not use the Service in violation of export control or sanctions laws. You represent that you are not
            located in, under the control of, or a national or resident of any embargoed jurisdiction or prohibited party
            list.
          </p>

          <h2>15. Governing law and disputes</h2>
          <p>
            These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict-of-law rules,
            except where mandatory consumer protections in your jurisdiction apply. Except for claims that may be brought
            in small claims court or for injunctive relief relating to intellectual property or misuse, any dispute will
            be resolved by binding arbitration on an individual basis, and not as a class or representative action, under
            the rules of the American Arbitration Association. Either party may seek injunctive relief in a court of
            competent jurisdiction to prevent unauthorized use or disclosure.
          </p>

          <h2>16. Changes</h2>
          <p>
            We may modify these Terms by posting an updated version and changing the effective date. Material changes may
            also be notified through the Service or by email where appropriate. Continued use after the effective date
            constitutes acceptance.
          </p>

          <h2>17. General</h2>
          <p>
            These Terms are the entire agreement regarding the Service and supersede prior agreements on that subject.
            If any provision is unenforceable, the remainder remains in effect. Our failure to enforce a provision is
            not a waiver. You may not assign these Terms without our consent; we may assign them in connection with a
            merger, acquisition, or asset sale. Notices to you may be provided electronically through the Service or to
            your account email.
          </p>

          <h2>18. Contact</h2>
          <p>
            Questions about these Terms:{" "}
            <a href={`mailto:${site.contactEmail}`} className="text-accent hover:underline">
              {site.contactEmail}
            </a>
            .
          </p>

          <p className="text-caption">
            These Terms are provided for operational use of the Service. They are not a substitute for advice from
            qualified legal counsel tailored to your situation.
          </p>
        </div>
      </div>
    </Container>
  );
}
