# Simple Signer — Module Spec

> Module slug: `simple-signer` · App slug: `signer` · Entitlement: `simple_signer` · Workflow type: `simple_signer`

## One-Sentence Job

Send a PDF for signature via secure magic link and store an executed copy with a full audit trail.

## MVP Scope

- Upload PDF document
- Signer from directory vendor or manual name/email
- Magic link to external signer
- Sign via checkbox + typed legal name (placeholder e-signature)
- Signed document version stored with timestamp
- Reminders while awaiting signature
- Evidence CSV export

## Exclusions

ESIGN/UETA certificates · witness/notary · bulk signing · template library · in-PDF signature rendering

## Shared Primitives

`workflow_instances` · `documents` · `document_versions` · `document_parsed_fields` · `tasks` · `external_participants` · `magic_links` · `reminders` · `notifications` · `audit_logs`

No new domain tables.

## Statuses

`draft` → `sent` → `opened` → `completed` (+ `overdue`, `cancelled`)
