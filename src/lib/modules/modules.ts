import {
  FileText,
  Shield,
  Calendar,
  Search,
  Ban,
  Package,
  BookOpen,
  GraduationCap,
  Receipt,
  PenLine,
  type LucideIcon,
} from "lucide-react";

export type ModuleCategory =
  | "vendor_compliance"
  | "contracts"
  | "hr"
  | "finance"
  | "compliance"
  | "documents";

export type ModuleStatus = "active" | "coming_soon" | "beta" | "planned";

export type ProductModule = {
  id: string;
  name: string;
  slug: string;
  category: ModuleCategory | string;
  jobToBeDone: string;
  freeToolSlug: string | null;
  freeUtility: string | null;
  paidWorkflowDescription: string;
  requiredEntitlement: string;
  icon: LucideIcon;
  primaryEntities: string[];
  status: ModuleStatus;
  workflowType: string;
  primaryAction: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  routes: { app: string; new?: string };
  crossSell: string[];
};

function appRoute(slug: string) {
  return `/app/apps/${slug}`;
}

export const MODULES: ProductModule[] = [
  {
    id: "w9_collector",
    name: "W-9 Collector",
    slug: "w9",
    category: "vendor_compliance",
    jobToBeDone: "Collect signed W-9 forms from vendors without email chaos.",
    freeToolSlug: "w9-request-link-generator",
    freeUtility: "w9-request-link-generator",
    paidWorkflowDescription: "Automated W-9 collection with tracking, extraction, and compliance monitoring.",
    requiredEntitlement: "w9_collector",
    icon: FileText,
    primaryEntities: ["workflow_instances", "documents", "external_participants"],
    status: "active",
    workflowType: "w9_collection",
    primaryAction: "Request W-9",
    emptyStateTitle: "Collect your first W-9",
    emptyStateDescription: "Send a secure link to a vendor and track the submission without email threads.",
    routes: { app: appRoute("w9"), new: "/app/vendors/new" },
    crossSell: ["coi", "vendor-packets"],
  },
  {
    id: "coi_tracker",
    name: "COI Tracker",
    slug: "coi",
    category: "vendor_compliance",
    jobToBeDone: "Track certificates of insurance and ensure coverage never lapses.",
    freeToolSlug: "coi-analyzer",
    freeUtility: "coi-analyzer",
    paidWorkflowDescription: "Automated COI collection, extraction, and expiration monitoring.",
    requiredEntitlement: "coi_tracker",
    icon: Shield,
    primaryEntities: ["workflow_instances", "documents", "monitors"],
    status: "active",
    workflowType: "coi_tracking",
    primaryAction: "Request COI",
    emptyStateTitle: "Track your first certificate of insurance",
    emptyStateDescription:
      "Request a COI from a vendor, review the certificate, and get reminders before coverage expires.",
    routes: { app: appRoute("coi"), new: "/app/vendors" },
    crossSell: ["vendor-packets", "exclusions"],
  },
  {
    id: "contract_renewal",
    name: "Contract Renewal Tracker",
    slug: "contracts",
    category: "contracts",
    jobToBeDone: "Never miss a contract renewal deadline or auto-renewal window.",
    freeToolSlug: "contract-renewal-extractor",
    freeUtility: "contract-renewal-extractor",
    paidWorkflowDescription: "Track all contracts with renewal monitoring and stakeholder notifications.",
    requiredEntitlement: "contract_renewal",
    icon: Calendar,
    primaryEntities: ["workflow_instances", "documents", "monitors"],
    status: "active",
    workflowType: "contract_renewal",
    primaryAction: "Upload contract",
    emptyStateTitle: "Track your first contract renewal",
    emptyStateDescription:
      "Upload a contract, confirm renewal dates, and get reminders before notice windows close.",
    routes: { app: appRoute("contracts"), new: "/app/apps/contracts" },
    crossSell: ["contracts-risk"],
  },
  {
    id: "contract_risk_scanner",
    name: "Contract Risk Scanner",
    slug: "contracts-risk",
    category: "contracts",
    jobToBeDone: "Identify risky clauses in contracts before signing.",
    freeToolSlug: null,
    freeUtility: null,
    paidWorkflowDescription: "Automated contract review with risk flagging and review tasks.",
    requiredEntitlement: "contract_risk_scanner",
    icon: Search,
    primaryEntities: ["workflow_instances", "documents", "document_parsed_fields"],
    status: "beta",
    workflowType: "contract_risk_scan",
    primaryAction: "Scan contract",
    emptyStateTitle: "Scan your first contract",
    emptyStateDescription: "Upload a contract to flag risks before signing. Not legal advice.",
    routes: { app: appRoute("contracts-risk") },
    crossSell: ["contracts"],
  },
  {
    id: "exclusion_monitor",
    name: "Exclusion Monitor",
    slug: "exclusions",
    category: "compliance",
    jobToBeDone: "Monitor vendor and employee names against OIG/SAM exclusion lists.",
    freeToolSlug: "oig-search",
    freeUtility: "oig-search",
    paidWorkflowDescription: "Scheduled exclusion checks with match alerts and audit trail.",
    requiredEntitlement: "exclusion_monitor",
    icon: Ban,
    primaryEntities: ["monitors", "monitor_runs"],
    status: "active",
    workflowType: "exclusion_monitoring",
    primaryAction: "Run exclusion check",
    emptyStateTitle: "Monitor exclusion lists",
    emptyStateDescription: "Run and schedule checks against OIG/SAM exclusion lists.",
    routes: { app: appRoute("exclusions") },
    crossSell: ["coi"],
  },
  {
    id: "vendor_packet",
    name: "Vendor Packet Portal",
    slug: "vendor-packets",
    category: "vendor_compliance",
    jobToBeDone: "Collect all required vendor onboarding documents in one place.",
    freeToolSlug: null,
    freeUtility: null,
    paidWorkflowDescription: "Multi-document vendor onboarding portal with completion tracking.",
    requiredEntitlement: "vendor_packet",
    icon: Package,
    primaryEntities: ["workflow_instances", "documents", "magic_links"],
    status: "active",
    workflowType: "vendor_packet",
    primaryAction: "Send vendor packet",
    emptyStateTitle: "Send your first vendor packet",
    emptyStateDescription:
      "Collect W-9, COI, and other onboarding documents through one secure portal link.",
    routes: { app: appRoute("vendor-packets") },
    crossSell: ["w9", "coi"],
  },
  {
    id: "policy_acknowledgement",
    name: "Policy Acknowledgement Tracker",
    slug: "policies",
    category: "hr",
    jobToBeDone: "Ensure every employee acknowledges company policies with proof.",
    freeToolSlug: null,
    freeUtility: null,
    paidWorkflowDescription: "Policy distribution, acknowledgement tracking, and overdue monitoring.",
    requiredEntitlement: "policy_acknowledgement",
    icon: BookOpen,
    primaryEntities: ["workflow_instances", "tasks", "monitors"],
    status: "active",
    workflowType: "policy_acknowledgement",
    primaryAction: "Send acknowledgement request",
    emptyStateTitle: "Track policy acknowledgements",
    emptyStateDescription: "Prove employees received and acknowledged company policies.",
    routes: { app: appRoute("policies") },
    crossSell: ["training"],
  },
  {
    id: "training_record",
    name: "Training Record Tracker",
    slug: "training",
    category: "hr",
    jobToBeDone: "Track employee training certifications and expiration dates.",
    freeToolSlug: null,
    freeUtility: null,
    paidWorkflowDescription: "Training record management with certification expiration monitoring.",
    requiredEntitlement: "training_record",
    icon: GraduationCap,
    primaryEntities: ["workflow_instances", "documents", "monitors"],
    status: "active",
    workflowType: "training_record",
    primaryAction: "Add training record",
    emptyStateTitle: "Track training records",
    emptyStateDescription: "Upload certificates and monitor expiration dates.",
    routes: { app: appRoute("training") },
    crossSell: ["policies"],
  },
  {
    id: "invoice_approval",
    name: "Invoice Approval Lite",
    slug: "invoices",
    category: "finance",
    jobToBeDone: "Route invoices through a simple approval chain without enterprise AP software.",
    freeToolSlug: null,
    freeUtility: null,
    paidWorkflowDescription: "Invoice upload, extraction, approval routing, and overdue monitoring.",
    requiredEntitlement: "invoice_approval",
    icon: Receipt,
    primaryEntities: ["workflow_instances", "documents", "tasks"],
    status: "active",
    workflowType: "invoice_approval",
    primaryAction: "Submit for approval",
    emptyStateTitle: "Approve invoices faster",
    emptyStateDescription: "Upload invoices and route them through a simple approval chain.",
    routes: { app: appRoute("invoices") },
    crossSell: [],
  },
  {
    id: "simple_signer",
    name: "Simple Signer",
    slug: "signer",
    category: "documents",
    jobToBeDone: "Get documents signed quickly without DocuSign complexity.",
    freeToolSlug: "pdf-signer",
    freeUtility: "pdf-signer",
    paidWorkflowDescription: "Send documents for signature via magic link with audit trail.",
    requiredEntitlement: "simple_signer",
    icon: PenLine,
    primaryEntities: ["workflow_instances", "documents", "magic_links"],
    status: "active",
    workflowType: "simple_signer",
    primaryAction: "Send for signature",
    emptyStateTitle: "Send your first document",
    emptyStateDescription: "Send a PDF for signature via secure magic link.",
    routes: { app: appRoute("signer") },
    crossSell: [],
  },
];

export function getModuleBySlug(slug: string): ProductModule | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getModuleByEntitlement(key: string): ProductModule | undefined {
  return MODULES.find((m) => m.requiredEntitlement === key);
}

export function getActiveModules(): ProductModule[] {
  return MODULES.filter((m) => m.status === "active" || m.status === "beta");
}

export const FREE_TOOLS = MODULES.filter((m) => m.freeToolSlug).map((m) => ({
  slug: m.freeToolSlug!,
  moduleName: m.name,
  moduleSlug: m.slug,
  jobToBeDone: m.jobToBeDone,
}));
