export const site = {
  name: "Keelstar",
  domain: "keelstar.com",
  url: "https://keelstar.com",
  appUrl: "https://app.keelstar.com",
  statusUrl: "https://status.keelstar.com",
  category: "Operational Workflow Platform",
  tagline: "Operational workflows, without the enterprise suite.",
  description:
    "Keelstar is the operational workflow platform for collecting, approving, monitoring, and auditing the business documents that keep companies running.",
  email: "hello@keelstar.com",
  securityEmail: "security@keelstar.com",
};

export type NavLink = { label: string; href: string; desc?: string; badge?: string };
export type NavGroup = { label: string; links: NavLink[] };

export const productsMenu: NavGroup[] = [
  {
    label: "Vendor Compliance",
    links: [
      { label: "W-9 Collector", href: "/products/w9-collector/", desc: "Collect W-9s without email chains." },
      { label: "COI Tracker", href: "/products/coi-tracker/", desc: "Track certificates before they expire." },
      { label: "Vendor Packet", href: "/products/vendor-packet/", desc: "Every vendor document in one flow." },
      { label: "Exclusion Monitor", href: "/products/exclusion-monitor/", desc: "Monitor exclusion lists with an audit record." },
    ],
  },
  {
    label: "Contract Operations",
    links: [
      { label: "Contract Renewal Tracker", href: "/products/contract-renewal-tracker/", desc: "Catch renewals before notice periods pass." },
      { label: "Contract Risk Scanner", href: "/products/contract-risk-scanner/", desc: "Flag commercial risk in clauses." },
      { label: "Simple Signer", href: "/products/simple-signer/", desc: "Send for signature, no enterprise suite." },
    ],
  },
  {
    label: "HR Compliance",
    links: [
      { label: "Policy Acknowledgement Tracker", href: "/products/policy-acknowledgement-tracker/", desc: "Collect acknowledgements, keep versions." },
      { label: "Training Record Tracker", href: "/products/training-record-tracker/", desc: "Track training and certification expirations." },
    ],
  },
  {
    label: "Finance Operations",
    links: [{ label: "Invoice Approval", href: "/products/invoice-approval/", desc: "Route approvals, keep the audit trail." }],
  },
  {
    label: "Platform",
    links: [
      { label: "Shared platform", href: "/products/platform/", desc: "One platform, many applications." },
      { label: "Audit logs", href: "/products/platform/#audit", desc: "Built into every workflow." },
      { label: "Notifications", href: "/products/platform/#notifications", desc: "Reminders that actually fire." },
      { label: "API", href: "/api/", desc: "Build on Keelstar." },
    ],
  },
];

export const workflowsMenu: NavGroup[] = [
  { label: "Collect", links: [{ label: "Collect W-9s", href: "/workflows/collect-w9s/" }, { label: "Request tax documents", href: "/workflows/request-tax-documents-from-vendors/" }, { label: "Vendor onboarding packets", href: "/workflows/build-vendor-onboarding-packets/" }] },
  { label: "Extract", links: [{ label: "Review ACORD certificates", href: "/workflows/review-acord-certificates/" }, { label: "Monitor contract renewals", href: "/workflows/monitor-contract-renewals/" }, { label: "Track notice periods", href: "/workflows/track-contract-notice-periods/" }] },
  { label: "Approve", links: [{ label: "Route invoice approvals", href: "/workflows/route-invoice-approvals/" }, { label: "Send for signature", href: "/workflows/send-documents-for-signature/" }, { label: "Track overdue approvals", href: "/workflows/track-overdue-approvals/" }] },
  { label: "Monitor", links: [{ label: "Track COI expirations", href: "/workflows/track-coi-expirations/" }, { label: "Screen against exclusion lists", href: "/workflows/screen-vendors-against-exclusion-lists/" }, { label: "Monitor certification expirations", href: "/workflows/monitor-certification-expirations/" }] },
  { label: "Audit", links: [{ label: "Build audit trails", href: "/workflows/build-audit-trails/" }, { label: "Export compliance evidence", href: "/workflows/export-compliance-evidence/" }, { label: "Replace spreadsheets", href: "/workflows/replace-spreadsheets-with-operational-workflows/" }] },
];

export const industriesMenu: NavLink[] = [
  { label: "Healthcare", href: "/industries/healthcare/" },
  { label: "Construction", href: "/industries/construction/" },
  { label: "Staffing", href: "/industries/staffing/" },
  { label: "Logistics", href: "/industries/logistics/" },
  { label: "Manufacturing", href: "/industries/manufacturing/" },
  { label: "Facilities Services", href: "/industries/facilities-services/" },
  { label: "Property Management", href: "/industries/property-management/" },
  { label: "Professional Services", href: "/industries/professional-services/" },
  { label: "Nonprofit", href: "/industries/nonprofit/" },
  { label: "Multi-site Retail", href: "/industries/multi-site-retail/" },
];

export const resourcesMenu: NavGroup[] = [
  {
    label: "Get started",
    links: [
      { label: "Free tools", href: "/tools/", desc: "Use them with no account." },
      { label: "Templates", href: "/templates/", desc: "Start from a proven structure." },
      { label: "Quick guides", href: "/guides/", desc: "Answers in under a minute." },
    ],
  },
  {
    label: "Learn",
    links: [
      { label: "Guides", href: "/guides/" },
      { label: "Glossary", href: "/glossary/" },
      { label: "Comparisons", href: "/compare/" },
      { label: "Updates", href: "/updates/" },
    ],
  },
  {
    label: "Product help",
    links: [
      { label: "Documentation", href: "/docs/" },
      { label: "Help Center", href: "/help/" },
      { label: "API", href: "/api/" },
      { label: "Security", href: "/security/" },
      { label: "Trust", href: "/trust/" },
      { label: "Status", href: "https://status.keelstar.com" },
    ],
  },
];

export const primaryNav = [
  { label: "Products", key: "products" },
  { label: "Workflows", key: "workflows" },
  { label: "Industries", key: "industries" },
  { label: "Resources", key: "resources" },
  { label: "Pricing", href: "/pricing/", key: "pricing" },
] as const;

export const footerGroups: NavGroup[] = [
  {
    label: "Products",
    links: [
      { label: "W-9 Collector", href: "/products/w9-collector/" },
      { label: "COI Tracker", href: "/products/coi-tracker/" },
      { label: "Vendor Packet", href: "/products/vendor-packet/" },
      { label: "Exclusion Monitor", href: "/products/exclusion-monitor/" },
      { label: "Contract Renewal Tracker", href: "/products/contract-renewal-tracker/" },
      { label: "Invoice Approval", href: "/products/invoice-approval/" },
      { label: "All products", href: "/products/" },
    ],
  },
  {
    label: "Workflows",
    links: [
      { label: "Collect W-9s", href: "/workflows/collect-w9s/" },
      { label: "Track COI expirations", href: "/workflows/track-coi-expirations/" },
      { label: "Monitor contract renewals", href: "/workflows/monitor-contract-renewals/" },
      { label: "Route invoice approvals", href: "/workflows/route-invoice-approvals/" },
      { label: "Build audit trails", href: "/workflows/build-audit-trails/" },
      { label: "All workflows", href: "/workflows/" },
    ],
  },
  {
    label: "Industries",
    links: [
      { label: "Healthcare", href: "/industries/healthcare/" },
      { label: "Construction", href: "/industries/construction/" },
      { label: "Staffing", href: "/industries/staffing/" },
      { label: "Property Management", href: "/industries/property-management/" },
      { label: "All industries", href: "/industries/" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Free tools", href: "/tools/" },
      { label: "Templates", href: "/templates/" },
      { label: "Guides", href: "/guides/" },
      { label: "Glossary", href: "/glossary/" },
      { label: "Comparisons", href: "/compare/" },
    ],
  },
  {
    label: "Developers",
    links: [
      { label: "Documentation", href: "/docs/" },
      { label: "API", href: "/api/" },
      { label: "Help Center", href: "/help/" },
      { label: "Status", href: "https://status.keelstar.com" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Updates", href: "/updates/" },
      { label: "Security", href: "/security/" },
      { label: "Trust", href: "/trust/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy/" },
      { label: "Terms", href: "/legal/terms/" },
      { label: "Security", href: "/security/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
];
