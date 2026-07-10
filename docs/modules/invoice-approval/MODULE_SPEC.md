# Invoice Approval Lite — Module Spec

> Module slug: `invoice-approval` · App slug: `invoices` · Entitlement: `invoice_approval` · Workflow type: `invoice_approval`

## One-Sentence Job

Upload invoices, route them to an internal approver, and maintain an audit trail without enterprise AP software.

## MVP Scope

- Optional directory vendor link + manual vendor name
- Invoice PDF upload
- Manual fields: vendor name, invoice number, amount, due date
- Single internal approver (org member task)
- Email + in-app notification to approver
- Approve / reject with reason
- Overdue reminders while awaiting approval
- Evidence CSV export

## Exclusions

Payment processing · ERP integration · GL coding · multi-step approval chains · OCR/AI extraction

## Shared Primitives

`workflow_instances` · `documents` · `document_parsed_fields` · `tasks` · `reminders` · `notifications` · `audit_logs`

No new domain tables.
