import type { SeoPageSpec } from "../create-page";

export const w9PageSpecs: SeoPageSpec[] = [
  {
    "slug": "w9-request-from-vendor",
    "cluster": "w9",
    "eyebrow": "W-9 collection",
    "metaTitle": "Request a W-9 From a Vendor | Keelstar",
    "metaDescription": "Send a tracked W-9 request link, validate IRS fields on submission, and keep a dated audit record before you pay the vendor.",
    "breadcrumb": "Request W-9 from vendor",
    "h1": "Request a W-9 from a vendor without email chaos",
    "hero": "Keelstar sends a secure Form W-9 request your vendor completes in a browser. Required fields are validated on submission so AP never files an incomplete tax record.",
    "problem": "Finance teams still ask for W-9s over generic email. Attachments get lost, legal names do not match payment records, and nobody can prove when the form was collected.",
    "problemBullets": [
      "Untracked email requests stall when vendors ignore one-off messages",
      "Unsigned or partial W-9s slip into shared drives without validation",
      "No single list shows which active vendors still lack a current W-9",
      "Auditors ask for request dates and versions AP cannot reconstruct"
    ],
    "sections": [
      {
        "title": "Why a tracked request beats a PDF attachment",
        "paragraphs": [
          "A secure request link tells you exactly who was asked, when they opened it, and when they submitted. Vendors do not need a Keelstar login—only a browser session to complete the IRS form."
        ],
        "eyebrow": "Outbound collection"
      },
      {
        "title": "Tie W-9 collection to payment readiness",
        "paragraphs": [
          "Block or flag invoices when the vendor record lacks a validated W-9. AP sees status on the vendor profile instead of searching inboxes before each 1099 season."
        ],
        "bullets": [
          "Branded request email with your organization name",
          "Field validation before the W-9 is accepted",
          "Automatic reminders until submission or escalation"
        ]
      },
      {
        "title": "Evidence finance can export",
        "paragraphs": [
          "Every request, reminder, and download is timestamped. Export the W-9 packet with its history when tax, audit, or vendor management asks for proof of due diligence."
        ],
        "eyebrow": "Audit trail"
      }
    ],
    "whoItsFor": [
      "Accounts payable managers preparing for 1099 season",
      "Vendor onboarding specialists collecting tax IDs at setup",
      "Controllers who need backup withholding documentation",
      "Healthcare and government contractors with strict vendor files"
    ],
    "checklist": [
      "Every active vendor has a validated W-9 on file",
      "Legal name and TIN were checked before first payment",
      "Reminders run automatically for non-responders",
      "Stale forms are flagged for re-collection before year-end",
      "Request and submission history is exportable"
    ],
    "faqs": [
      {
        "q": "Do vendors need a Keelstar account?",
        "a": "No. Vendors complete the W-9 through a secure link in their browser. Your team manages collection and monitoring inside Keelstar."
      },
      {
        "q": "Can we request W-9s in bulk?",
        "a": "Yes. Upload or paste a vendor list and Keelstar sends individual tracked requests with shared reminder rules."
      },
      {
        "q": "What fields are validated?",
        "a": "Keelstar checks required IRS fields—including legal name, tax classification, address, and TIN format—before accepting the submission."
      },
      {
        "q": "How do reminders work?",
        "a": "You set the cadence. Keelstar emails non-responders until they submit, escalate, or you close the request."
      },
      {
        "q": "Does this replace our W-9 PDF workflow?",
        "a": "It replaces untracked email PDFs with validated, versioned records tied to each vendor profile."
      }
    ],
    "relatedSlugs": [
      "collect-w9-online",
      "w9-reminder-automation",
      "w9-validation-before-payment"
    ]
  },
  {
    "slug": "collect-w9-online",
    "cluster": "w9",
    "metaTitle": "Collect W-9 Online | Keelstar",
    "metaDescription": "Collect W-9 forms online with a secure vendor link, field validation, and reminders until every submission is complete.",
    "breadcrumb": "Collect W-9 online",
    "h1": "Collect W-9 forms online with validated submissions",
    "hero": "Give vendors a secure browser form instead of email attachments. Keelstar validates IRS fields and stores each W-9 with version history.",
    "problem": "Teams email blank W-9 PDFs and hope vendors return complete forms. Online collection without validation recreates the same 1099 risk in a web form.",
    "problemBullets": [
      "Vendors print, scan, or photograph W-9s with missing signatures",
      "No validation means AP still accepts blank TIN fields",
      "Email threads do not show who has not responded",
      "Records are not tied to the vendor profile in your ERP"
    ],
    "relatedSlugs": [
      "collect-w9-online",
      "w9-reminder-automation",
      "w9-collection-software"
    ],
    "eyebrow": "W-9 collection",
    "whoItsFor": [
      "Accounts payable managers preparing for 1099 season",
      "Vendor onboarding specialists collecting tax IDs at setup",
      "Controllers who need backup withholding documentation",
      "Operations teams coordinating hundreds of vendor records"
    ],
    "checklist": [
      "Every active vendor has a validated W-9 on file",
      "Legal name and TIN were checked before first payment",
      "Reminders run automatically for non-responders",
      "Stale forms are flagged for re-collection",
      "Request and submission history is exportable"
    ],
    "sections": [
      {
        "title": "Operationalize collect w-9 online",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for collect w-9 forms online with validated submissions. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
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
        "q": "Is Keelstar only for w-9 collection?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  },
  {
    "slug": "vendor-w9-management",
    "cluster": "w9",
    "metaTitle": "Vendor W-9 Management | Keelstar",
    "metaDescription": "Manage vendor W-9 records in one workspace with status dashboards, reminders, and exportable audit history.",
    "breadcrumb": "Vendor W-9 management",
    "h1": "Manage every vendor W-9 from one workspace",
    "hero": "See which vendors lack a current W-9, send reminders in bulk, and export a complete tax file history without spreadsheet tabs.",
    "problem": "W-9 status lives in spreadsheets that drift from the vendor master. AP discovers gaps only when a payment or 1099 is due.",
    "problemBullets": [
      "Multiple versions of the same vendor W-9 in shared folders",
      "No owner for re-collection after entity name changes",
      "Bulk reminders are manual mail-merge projects",
      "Auditors cannot get a single export of request history"
    ],
    "relatedSlugs": [
      "w9-request-from-vendor",
      "w9-version-control",
      "stale-w9-alerts"
    ],
    "eyebrow": "W-9 collection",
    "whoItsFor": [
      "Accounts payable managers preparing for 1099 season",
      "Vendor onboarding specialists collecting tax IDs at setup",
      "Controllers who need backup withholding documentation",
      "Operations teams coordinating hundreds of vendor records"
    ],
    "checklist": [
      "Every active vendor has a validated W-9 on file",
      "Legal name and TIN were checked before first payment",
      "Reminders run automatically for non-responders",
      "Stale forms are flagged for re-collection",
      "Request and submission history is exportable"
    ],
    "sections": [
      {
        "title": "Operationalize vendor w-9 management",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for manage every vendor w-9 from one workspace. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
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
        "q": "Is Keelstar only for w-9 collection?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  },
  {
    "slug": "w9-collection-software",
    "cluster": "w9",
    "metaTitle": "W-9 Collection Software | Keelstar",
    "metaDescription": "W-9 collection software with secure vendor links, validation, reminders, and audit exports for AP and tax teams.",
    "breadcrumb": "W-9 collection software",
    "h1": "W-9 collection software built for AP audit trails",
    "hero": "Replace inbox chasing with software that requests, validates, and monitors W-9s on every vendor profile.",
    "problem": "Spreadsheet trackers and shared folders are not software—they cannot validate fields or prove when a vendor was asked.",
    "problemBullets": [
      "No central queue of outstanding W-9 requests",
      "Validation rules differ by whoever opens the attachment",
      "Reminder work falls on AP admins each quarter",
      "1099 projects restart from zero every January"
    ],
    "relatedSlugs": [
      "w9-request-from-vendor",
      "bulk-w9-request",
      "stale-w9-alerts"
    ],
    "eyebrow": "W-9 collection",
    "whoItsFor": [
      "Accounts payable managers preparing for 1099 season",
      "Vendor onboarding specialists collecting tax IDs at setup",
      "Controllers who need backup withholding documentation",
      "Operations teams coordinating hundreds of vendor records"
    ],
    "checklist": [
      "Every active vendor has a validated W-9 on file",
      "Legal name and TIN were checked before first payment",
      "Reminders run automatically for non-responders",
      "Stale forms are flagged for re-collection",
      "Request and submission history is exportable"
    ],
    "sections": [
      {
        "title": "Operationalize w-9 collection software",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for w-9 collection software built for ap audit trails. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
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
        "q": "Is Keelstar only for w-9 collection?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  },
  {
    "slug": "w9-reminder-automation",
    "cluster": "w9",
    "metaTitle": "W-9 Reminder Automation | Keelstar",
    "metaDescription": "Automate W-9 reminders until vendors submit or your team escalates—with timestamps on every nudge.",
    "breadcrumb": "W-9 reminder automation",
    "h1": "Automate W-9 reminders until vendors respond",
    "hero": "Set reminder cadence once. Keelstar emails non-responders, logs each nudge, and surfaces vendors who still block payment readiness.",
    "problem": "Manual follow-ups depend on someone remembering to forward the same email. Vendors learn they can ignore the first request.",
    "problemBullets": [
      "Reminder history is not saved in AP inboxes",
      "Managers cannot see which vendors are overdue",
      "Escalation rules live in tribal knowledge",
      "Year-end volume overwhelms small AP teams"
    ],
    "relatedSlugs": [
      "collect-w9-online",
      "w9-request-from-vendor",
      "bulk-w9-request"
    ],
    "eyebrow": "W-9 collection",
    "whoItsFor": [
      "Accounts payable managers preparing for 1099 season",
      "Vendor onboarding specialists collecting tax IDs at setup",
      "Controllers who need backup withholding documentation",
      "Operations teams coordinating hundreds of vendor records"
    ],
    "checklist": [
      "Every active vendor has a validated W-9 on file",
      "Legal name and TIN were checked before first payment",
      "Reminders run automatically for non-responders",
      "Stale forms are flagged for re-collection",
      "Request and submission history is exportable"
    ],
    "sections": [
      {
        "title": "Operationalize w-9 reminder automation",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for automate w-9 reminders until vendors respond. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
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
        "q": "Is Keelstar only for w-9 collection?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  },
  {
    "slug": "bulk-w9-request",
    "cluster": "w9",
    "metaTitle": "Bulk W-9 Request | Keelstar",
    "metaDescription": "Send bulk W-9 requests from a vendor list with individual secure links and shared reminder rules.",
    "breadcrumb": "Bulk W-9 request",
    "h1": "Send bulk W-9 requests from your vendor list",
    "hero": "Paste or upload vendors and launch tracked W-9 requests in one action. Each vendor gets their own link; your team gets one status board.",
    "problem": "Mail-merge W-9 blasts look personal but provide no per-vendor status. AP still tracks responses manually.",
    "problemBullets": [
      "One bounced email invalidates the whole mail merge batch",
      "No per-vendor validation on return",
      "Duplicate requests when two admins run parallel lists",
      "Cannot export who responded for auditors"
    ],
    "relatedSlugs": [
      "w9-collection-software",
      "w9-reminder-automation",
      "vendor-w9-management"
    ],
    "eyebrow": "W-9 collection",
    "whoItsFor": [
      "Accounts payable managers preparing for 1099 season",
      "Vendor onboarding specialists collecting tax IDs at setup",
      "Controllers who need backup withholding documentation",
      "Operations teams coordinating hundreds of vendor records"
    ],
    "checklist": [
      "Every active vendor has a validated W-9 on file",
      "Legal name and TIN were checked before first payment",
      "Reminders run automatically for non-responders",
      "Stale forms are flagged for re-collection",
      "Request and submission history is exportable"
    ],
    "sections": [
      {
        "title": "Operationalize bulk w-9 request",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for send bulk w-9 requests from your vendor list. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
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
        "q": "Is Keelstar only for w-9 collection?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  },
  {
    "slug": "w9-validation-before-payment",
    "cluster": "w9",
    "metaTitle": "W-9 Validation Before Payment | Keelstar",
    "metaDescription": "Validate W-9 fields before payment and flag vendors missing current tax documentation.",
    "breadcrumb": "W-9 validation before payment",
    "h1": "Validate W-9s before you release payment",
    "hero": "Keelstar checks required IRS fields at submission and shows AP which vendors are not payment-ready because tax documentation is missing or stale.",
    "problem": "Payment systems rarely know if the W-9 on file is complete. Backup withholding issues surface after money has left the account.",
    "problemBullets": [
      "Invoices approve while W-9 status is unknown",
      "TIN typos are discovered during 1099 filing",
      "Entity changes do not trigger re-collection",
      "Finance learns about gaps from IRS notices, not software"
    ],
    "relatedSlugs": [
      "w9-request-from-vendor",
      "stale-w9-alerts",
      "vendor-tax-document-collection"
    ],
    "eyebrow": "W-9 collection",
    "whoItsFor": [
      "Accounts payable managers preparing for 1099 season",
      "Vendor onboarding specialists collecting tax IDs at setup",
      "Controllers who need backup withholding documentation",
      "Operations teams coordinating hundreds of vendor records"
    ],
    "checklist": [
      "Every active vendor has a validated W-9 on file",
      "Legal name and TIN were checked before first payment",
      "Reminders run automatically for non-responders",
      "Stale forms are flagged for re-collection",
      "Request and submission history is exportable"
    ],
    "sections": [
      {
        "title": "Operationalize w-9 validation before payment",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for validate w-9s before you release payment. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
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
        "q": "Is Keelstar only for w-9 collection?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  },
  {
    "slug": "vendor-tax-document-collection",
    "cluster": "w9",
    "metaTitle": "Vendor Tax Document Collection | Keelstar",
    "metaDescription": "Collect vendor tax documents beyond a single form—W-9, withholding certificates, and re-certifications with audit history.",
    "breadcrumb": "Vendor tax document collection",
    "h1": "Collect vendor tax documents with one compliance record",
    "hero": "Centralize W-9 and related tax paperwork on the vendor profile so AP and tax share the same source of truth.",
    "problem": "Tax documents arrive as ad-hoc attachments with no link to the vendor master record or payment holds.",
    "problemBullets": [
      "State withholding forms live outside the W-9 folder",
      "Re-certification after mergers is manual",
      "Auditors request packets assembled by hand",
      "No reminder cycle for expiring tax certifications"
    ],
    "relatedSlugs": [
      "w9-version-control",
      "w9-validation-before-payment",
      "vendor-w9-management"
    ],
    "eyebrow": "W-9 collection",
    "whoItsFor": [
      "Accounts payable managers preparing for 1099 season",
      "Vendor onboarding specialists collecting tax IDs at setup",
      "Controllers who need backup withholding documentation",
      "Operations teams coordinating hundreds of vendor records"
    ],
    "checklist": [
      "Every active vendor has a validated W-9 on file",
      "Legal name and TIN were checked before first payment",
      "Reminders run automatically for non-responders",
      "Stale forms are flagged for re-collection",
      "Request and submission history is exportable"
    ],
    "sections": [
      {
        "title": "Operationalize vendor tax document collection",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for collect vendor tax documents with one compliance record. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
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
        "q": "Is Keelstar only for w-9 collection?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  },
  {
    "slug": "w9-version-control",
    "cluster": "w9",
    "metaTitle": "W-9 Version Control | Keelstar",
    "metaDescription": "Keep W-9 version control when vendors change legal names, entities, or TINs—with history on the vendor profile.",
    "breadcrumb": "W-9 version control",
    "h1": "W-9 version control when vendor details change",
    "hero": "Store every submitted W-9 with timestamps. When a vendor updates their information, prior versions remain available for tax and audit questions.",
    "problem": "Teams overwrite old W-9 files in shared drives, losing proof of what was on file when payments were made.",
    "problemBullets": [
      "Only the latest PDF is kept with no history",
      "1099 corrections cannot reference prior versions",
      "Merger-related entity changes erase old records",
      "Auditors ask what was on file at payment date"
    ],
    "relatedSlugs": [
      "vendor-tax-document-collection",
      "stale-w9-alerts",
      "w9-validation-before-payment"
    ],
    "eyebrow": "W-9 collection",
    "whoItsFor": [
      "Accounts payable managers preparing for 1099 season",
      "Vendor onboarding specialists collecting tax IDs at setup",
      "Controllers who need backup withholding documentation",
      "Operations teams coordinating hundreds of vendor records"
    ],
    "checklist": [
      "Every active vendor has a validated W-9 on file",
      "Legal name and TIN were checked before first payment",
      "Reminders run automatically for non-responders",
      "Stale forms are flagged for re-collection",
      "Request and submission history is exportable"
    ],
    "sections": [
      {
        "title": "Operationalize w-9 version control",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for w-9 version control when vendor details change. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
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
        "q": "Is Keelstar only for w-9 collection?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  },
  {
    "slug": "stale-w9-alerts",
    "cluster": "w9",
    "metaTitle": "Stale W-9 Alerts | Keelstar",
    "metaDescription": "Get stale W-9 alerts before year-end and payment runs so AP re-collects outdated tax forms proactively.",
    "breadcrumb": "Stale W-9 alerts",
    "h1": "Stale W-9 alerts before year-end crunch",
    "hero": "Define how long a W-9 stays current. Keelstar flags stale records and launches re-collection so January is not a fire drill.",
    "problem": "Without age rules, W-9s sit for years while vendor legal names and TINs change in the ERP silently.",
    "problemBullets": [
      "No policy for when to refresh W-9s",
      "Stale records are invisible until 1099 season",
      "Re-collection is a one-time project not a monitor",
      "Payment continues against outdated tax data"
    ],
    "relatedSlugs": [
      "w9-version-control",
      "w9-reminder-automation",
      "bulk-w9-request"
    ],
    "eyebrow": "W-9 collection",
    "whoItsFor": [
      "Accounts payable managers preparing for 1099 season",
      "Vendor onboarding specialists collecting tax IDs at setup",
      "Controllers who need backup withholding documentation",
      "Operations teams coordinating hundreds of vendor records"
    ],
    "checklist": [
      "Every active vendor has a validated W-9 on file",
      "Legal name and TIN were checked before first payment",
      "Reminders run automatically for non-responders",
      "Stale forms are flagged for re-collection",
      "Request and submission history is exportable"
    ],
    "sections": [
      {
        "title": "Operationalize stale w-9 alerts",
        "paragraphs": [
          "Keelstar gives your team a repeatable workflow for stale w-9 alerts before year-end crunch. Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."
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
        "q": "Is Keelstar only for w-9 collection?",
        "a": "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."
      }
    ]
  }
];
