export type DocPage = { slug: string; title: string; intro: string; body: string[] };
export type DocSection = { label: string; pages: DocPage[] };

const d = (slug: string, title: string, intro: string, body: string[]): DocPage => ({ slug, title, intro, body });

export const docsNav: DocSection[] = [
  {
    label: "Getting started",
    pages: [
      d("getting-started", "Getting started", "Set up Keelstar and run your first monitored workflow in minutes.", [
        "Create your workspace, invite your team, and pick the first application you want to adopt. There's no implementation project — you'll be live the same day.",
        "Start with a single workflow such as W-9 Collector or COI Tracker. Once it's running, add more applications from the same workspace.",
        "Every workflow shares the same audit logging, permissions, notifications, and exports, so what you learn on the first applies to the rest.",
      ]),
      d("account", "Account", "Manage your profile, sign-in, and notification preferences.", ["Update your name and email, manage sign-in, and choose how you receive reminders and notifications."]),
      d("organizations", "Organizations", "Workspaces, members, and structure.", ["Organizations group your members and workflows. Invite members, set roles, and structure access to match your team."]),
      d("permissions", "Permissions", "Role-based access across workflows.", ["Permissions are role-based and applied consistently across every application, so granting or revoking access is one auditable decision."]),
      d("billing", "Billing", "Plans, invoices, and seats.", ["Manage your plan, seats, and invoices. Pricing is per workflow, so you only pay for what you use."]),
    ],
  },
  {
    label: "Platform",
    pages: [
      d("file-uploads", "File uploads", "Supported formats and limits.", ["Upload PDFs and common document formats. Files are validated on upload and stored with version history."]),
      d("notifications", "Notifications", "Reminders that fire before deadlines.", ["Configure who is notified, through which channels, and how far ahead of each deadline."]),
      d("audit-logs", "Audit logs", "Built into every workflow.", ["Every action is recorded with an actor and timestamp. Export the log as evidence whenever it's needed."]),
      d("search", "Search", "Find anything across your workspace.", ["Search across documents, records, and workflows from one place."]),
    ],
  },
  {
    label: "Applications",
    pages: [
      d("w9-collector", "W-9 Collector", "Collect and monitor W-9s.", ["Request W-9s, validate them on submission, and monitor for re-collection when they go stale."]),
      d("coi-tracker", "COI Tracker", "Track certificates of insurance.", ["Collect certificates, extract expiration and coverage details, and get reminders before anything lapses."]),
      d("vendor-packet", "Vendor Packet", "Collect every vendor document.", ["Bundle required documents into one onboarding flow and track what's outstanding."]),
      d("exclusion-monitor", "Exclusion Monitor", "Screen against exclusion lists.", ["Screen vendors and employees against OIG, OFAC, and SAM, on a schedule, with dated evidence."]),
      d("contract-renewal-tracker", "Contract Renewal Tracker", "Monitor renewals and notice periods.", ["Extract renewal and notice dates, calculate the decision deadline, and get reminded in time."]),
      d("contract-risk-scanner", "Contract Risk Scanner", "Review contract risk.", ["Surface the clauses that carry commercial risk and produce a consistent review."]),
      d("simple-signer", "Simple Signer", "Send documents for signature.", ["Send documents for signature and keep the executed copy with its audit trail."]),
      d("policy-acknowledgement-tracker", "Policy Acknowledgement Tracker", "Collect acknowledgements.", ["Distribute policies, collect acknowledgements, and keep version history."]),
      d("training-record-tracker", "Training Record Tracker", "Track certifications.", ["Record training and certifications and monitor expirations."]),
      d("invoice-approval", "Invoice Approval", "Route approvals.", ["Route invoices through your approval matrix and keep the audit trail."]),
    ],
  },
];

export const allDocs = docsNav.flatMap((s) => s.pages);
export function getDoc(slug: string) {
  return allDocs.find((p) => p.slug === slug);
}
