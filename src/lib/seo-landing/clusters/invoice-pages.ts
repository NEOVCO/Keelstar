import type { SeoPageSpec } from "../create-page";

export const invoicePageSpecs: SeoPageSpec[] = [
  {
    "slug": "invoice-approval-workflow",
    "cluster": "invoice",
    "metaTitle": "Invoice Approval Workflow | Keelstar",
    "metaDescription": "Invoice approval workflow with routing rules, overdue visibility, and audit history for AP controls.",
    "breadcrumb": "Invoice approval workflow",
    "h1": "Invoice approval workflow without forwarding chains",
    "hero": "Route vendor invoices to the right approvers by amount, department, or vendor and record every decision.",
    "problem": "Approvals happen over email forwards that auditors cannot reconstruct.",
    "problemBullets": [
      "Approvers lose context on invoice history",
      "No single view of invoices awaiting action",
      "Rejections lack structured reasons",
      "Compliance status is not checked at approval"
    ],
    "relatedSlugs": [
      "invoice-approval-software",
      "accounts-payable-invoice-approval",
      "overdue-invoice-approval-tracking"
    ],
    "eyebrow": "Invoice approval",
    "whoItsFor": [
      "AP managers reducing invoice approval bottlenecks",
      "Controllers strengthening invoice approval controls",
      "Department heads who approve vendor spend",
      "Organizations tying payment to vendor compliance status"
    ],
    "checklist": [
      "Approval rules reflect amount and department thresholds",
      "Overdue approvals are visible on a single dashboard",
      "Rejected invoices capture a reason code",
      "Approved invoices link to vendor compliance status",
      "Approval history exports for control testing"
    ],
    "sections": [
      {
        "title": "Operationalize invoice approval workflow",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for invoice approval workflow without forwarding chains. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
        ],
        "eyebrow": "Workflow"
      },
      {
        "title": "Controls auditors expect",
        "paragraphs": [
          "Every action is timestamped so you can show who requested documentation, when it arrived, and what changed on re-collection."
        ],
        "eyebrow": "Audit readiness",
        "bullets": [
          "Branded outbound requests with reminder cadence",
          "Validation before documents enter the vendor file",
          "Exportable history for tax, insurance, or payer reviews"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Do vendors need a Keelstar account?",
        "a": "Vendors and employees typically complete tasks through secure links. Your internal team manages workflows inside Keelstar."
      },
      {
        "q": "Can we export evidence for audits?",
        "a": "Yes. Request history, submissions, approvals, and screening results export with timestamps."
      },
      {
        "q": "How fast can we go live?",
        "a": "Most teams start with one workflow and expand to the full vendor packet as they onboard more modules."
      },
      {
        "q": "Does Keelstar send reminders automatically?",
        "a": "You control reminder cadence. Keelstar nudges non-responders until they submit or you escalate."
      },
      {
        "q": "Is Keelstar only for invoice approval?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  },
  {
    "slug": "invoice-approval-software",
    "cluster": "invoice",
    "metaTitle": "Invoice Approval Software | Keelstar",
    "metaDescription": "Invoice approval software for AP teams who need controls, reminders, and exportable approval logs.",
    "breadcrumb": "Invoice approval software",
    "h1": "Invoice approval software with exportable controls evidence",
    "hero": "Replace informal sign-offs with tracked approvals tied to vendor records and optional compliance holds.",
    "problem": "Spreadsheet approval logs are updated after invoices are already paid.",
    "problemBullets": [
      "Approval logs are maintained after the fact",
      "Segregation of duties is hard to demonstrate",
      "Approvers are not reminded when queues age",
      "Vendor master mismatches are caught late"
    ],
    "relatedSlugs": [
      "invoice-approval-workflow",
      "accounts-payable-invoice-approval",
      "overdue-invoice-approval-tracking"
    ],
    "eyebrow": "Invoice approval",
    "whoItsFor": [
      "AP managers reducing invoice approval bottlenecks",
      "Controllers strengthening invoice approval controls",
      "Department heads who approve vendor spend",
      "Organizations tying payment to vendor compliance status"
    ],
    "checklist": [
      "Approval rules reflect amount and department thresholds",
      "Overdue approvals are visible on a single dashboard",
      "Rejected invoices capture a reason code",
      "Approved invoices link to vendor compliance status",
      "Approval history exports for control testing"
    ],
    "sections": [
      {
        "title": "Operationalize invoice approval software",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for invoice approval software with exportable controls evidence. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
        ],
        "eyebrow": "Workflow"
      },
      {
        "title": "Controls auditors expect",
        "paragraphs": [
          "Every action is timestamped so you can show who requested documentation, when it arrived, and what changed on re-collection."
        ],
        "eyebrow": "Audit readiness",
        "bullets": [
          "Branded outbound requests with reminder cadence",
          "Validation before documents enter the vendor file",
          "Exportable history for tax, insurance, or payer reviews"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Do vendors need a Keelstar account?",
        "a": "Vendors and employees typically complete tasks through secure links. Your internal team manages workflows inside Keelstar."
      },
      {
        "q": "Can we export evidence for audits?",
        "a": "Yes. Request history, submissions, approvals, and screening results export with timestamps."
      },
      {
        "q": "How fast can we go live?",
        "a": "Most teams start with one workflow and expand to the full vendor packet as they onboard more modules."
      },
      {
        "q": "Does Keelstar send reminders automatically?",
        "a": "You control reminder cadence. Keelstar nudges non-responders until they submit or you escalate."
      },
      {
        "q": "Is Keelstar only for invoice approval?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  },
  {
    "slug": "accounts-payable-invoice-approval",
    "cluster": "invoice",
    "metaTitle": "Accounts Payable Invoice Approval | Keelstar",
    "metaDescription": "Accounts payable invoice approval with policy-based routing and visibility into bottlenecks.",
    "breadcrumb": "AP invoice approval",
    "h1": "Accounts payable invoice approval with clear bottlenecks",
    "hero": "Give controllers a live queue of invoices awaiting approval and how long each has been waiting.",
    "problem": "Controllers learn about approval delays when vendors call about late payment.",
    "problemBullets": [
      "Queues are invisible outside AP clerks",
      "Policy thresholds are applied inconsistently",
      "Emergency payments bypass controls without logs",
      "Month-end close is delayed by stuck approvals"
    ],
    "relatedSlugs": [
      "invoice-approval-software",
      "invoice-approval-workflow",
      "overdue-invoice-approval-tracking"
    ],
    "eyebrow": "Invoice approval",
    "whoItsFor": [
      "AP managers reducing invoice approval bottlenecks",
      "Controllers strengthening invoice approval controls",
      "Department heads who approve vendor spend",
      "Organizations tying payment to vendor compliance status"
    ],
    "checklist": [
      "Approval rules reflect amount and department thresholds",
      "Overdue approvals are visible on a single dashboard",
      "Rejected invoices capture a reason code",
      "Approved invoices link to vendor compliance status",
      "Approval history exports for control testing"
    ],
    "sections": [
      {
        "title": "Operationalize ap invoice approval",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for accounts payable invoice approval with clear bottlenecks. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
        ],
        "eyebrow": "Workflow"
      },
      {
        "title": "Controls auditors expect",
        "paragraphs": [
          "Every action is timestamped so you can show who requested documentation, when it arrived, and what changed on re-collection."
        ],
        "eyebrow": "Audit readiness",
        "bullets": [
          "Branded outbound requests with reminder cadence",
          "Validation before documents enter the vendor file",
          "Exportable history for tax, insurance, or payer reviews"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Do vendors need a Keelstar account?",
        "a": "Vendors and employees typically complete tasks through secure links. Your internal team manages workflows inside Keelstar."
      },
      {
        "q": "Can we export evidence for audits?",
        "a": "Yes. Request history, submissions, approvals, and screening results export with timestamps."
      },
      {
        "q": "How fast can we go live?",
        "a": "Most teams start with one workflow and expand to the full vendor packet as they onboard more modules."
      },
      {
        "q": "Does Keelstar send reminders automatically?",
        "a": "You control reminder cadence. Keelstar nudges non-responders until they submit or you escalate."
      },
      {
        "q": "Is Keelstar only for invoice approval?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  },
  {
    "slug": "overdue-invoice-approval-tracking",
    "cluster": "invoice",
    "metaTitle": "Overdue Invoice Approval Tracking | Keelstar",
    "metaDescription": "Overdue invoice approval tracking so managers escalate stuck invoices before payment dates slip.",
    "breadcrumb": "Overdue invoice approval tracking",
    "h1": "Track overdue invoice approvals before vendors escalate",
    "hero": "Highlight invoices sitting with approvers past your SLA and send reminders before relationships suffer.",
    "problem": "Invoices age in approver inboxes with no escalation path or metric.",
    "problemBullets": [
      "No SLA for approval turnaround",
      "Executives cannot see aging approval inventory",
      "Vendors escalate to leadership before AP notices",
      "Discount capture is lost on time-sensitive invoices"
    ],
    "relatedSlugs": [
      "accounts-payable-invoice-approval",
      "invoice-approval-workflow",
      "invoice-approval-software"
    ],
    "eyebrow": "Invoice approval",
    "whoItsFor": [
      "AP managers reducing invoice approval bottlenecks",
      "Controllers strengthening invoice approval controls",
      "Department heads who approve vendor spend",
      "Organizations tying payment to vendor compliance status"
    ],
    "checklist": [
      "Approval rules reflect amount and department thresholds",
      "Overdue approvals are visible on a single dashboard",
      "Rejected invoices capture a reason code",
      "Approved invoices link to vendor compliance status",
      "Approval history exports for control testing"
    ],
    "sections": [
      {
        "title": "Operationalize overdue invoice approval tracking",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for track overdue invoice approvals before vendors escalate. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
        ],
        "eyebrow": "Workflow"
      },
      {
        "title": "Controls auditors expect",
        "paragraphs": [
          "Every action is timestamped so you can show who requested documentation, when it arrived, and what changed on re-collection."
        ],
        "eyebrow": "Audit readiness",
        "bullets": [
          "Branded outbound requests with reminder cadence",
          "Validation before documents enter the vendor file",
          "Exportable history for tax, insurance, or payer reviews"
        ]
      }
    ],
    "faqs": [
      {
        "q": "Do vendors need a Keelstar account?",
        "a": "Vendors and employees typically complete tasks through secure links. Your internal team manages workflows inside Keelstar."
      },
      {
        "q": "Can we export evidence for audits?",
        "a": "Yes. Request history, submissions, approvals, and screening results export with timestamps."
      },
      {
        "q": "How fast can we go live?",
        "a": "Most teams start with one workflow and expand to the full vendor packet as they onboard more modules."
      },
      {
        "q": "Does Keelstar send reminders automatically?",
        "a": "You control reminder cadence. Keelstar nudges non-responders until they submit or you escalate."
      },
      {
        "q": "Is Keelstar only for invoice approval?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  }
];
