# Contract Renewal Tracker — QA Checklist

## Security & tenancy

- [ ] RLS: user cannot read another org's contract workflow_instances
- [ ] RLS: user cannot read another org's documents
- [ ] RLS: viewer cannot create contract records
- [ ] Storage bucket is private (not public)
- [ ] Signed URLs expire appropriately (1h on export)
- [ ] No external routes expose contract data without auth
- [ ] Upload requires authenticated org member

## Contract record flow

- [ ] Create record sets status `draft` with linked document `pending`
- [ ] Create checks `contract_active_records` limit
- [ ] Optional `vendor_id` validated against org
- [ ] `contract.created` audit logged

## Internal upload

- [ ] PDF upload accepted
- [ ] PNG/JPEG accepted
- [ ] DOC/DOCX accepted
- [ ] Upload >25MB rejected
- [ ] Wrong MIME rejected
- [ ] Upload transitions to `review_needed`
- [ ] Document version history shown on detail page
- [ ] Upload blocked if workflow `completed`/`cancelled`

## Field entry & activation

- [ ] Manager can save fields to `document_parsed_fields`
- [ ] `renewal_date` required before activate
- [ ] Notice deadline computed and displayed correctly
- [ ] Activate creates `contract_renewal` monitor
- [ ] Activate transitions to `active_monitoring` (or `expiring_soon`/`expired` if applicable)
- [ ] Metadata synced from parsed fields on activate
- [ ] Member cannot activate monitoring

## Monitoring

- [ ] Monitor created with `monitored_date` = renewal_date
- [ ] Daily worker updates `expiring_soon` at ≤30 days
- [ ] Daily worker updates `expired` past renewal date
- [ ] Monitor status set to `expired` when renewal passes
- [ ] Prior monitor completed when new version re-activated
- [ ] Document status mirrors workflow monitoring status

## Reminders

- [ ] Renewal reminders NOT scheduled on free tier
- [ ] Renewal reminders scheduled on paid tier (4 windows: 90/60/30/0)
- [ ] `contract-renewal-monitor` sends internal renewal emails
- [ ] Reminders cancelled on complete / cancel
- [ ] Reminders rescheduled when renewal_date changes
- [ ] No duplicate sends for same window
- [ ] Email includes notice deadline when set

## No external surface (MVP)

- [ ] No magic link routes under `/external/contracts`
- [ ] No `magic_links` rows created for contract module
- [ ] No `external_participants` or external `tasks`

## Audit

- [ ] All major actions create audit_logs (see [AUDIT_EVENTS.md](./AUDIT_EVENTS.md))
- [ ] Audit visible on workflow detail timeline
- [ ] All actions logged with `actor_type: user` or `system`

## Evidence export

- [ ] CSV downloads with contract fields and notice deadline
- [ ] Reminders section included
- [ ] Audit events section included
- [ ] Signed document URLs work
- [ ] `contract_evidence.exported` audited
- [ ] Viewer cannot export

## Billing

- [ ] 4th active contract record blocked on free
- [ ] Upgrade modal shown
- [ ] `billing.limit_reached` audited
- [ ] Paid entitlement unlocks reminder scheduling

## API routes

- [ ] `POST /api/contracts` — create record
- [ ] `POST /api/contracts/[id]/upload` — internal upload
- [ ] `PATCH /api/contracts/[id]` — fields, activate, complete, cancel, export
- [ ] All routes return 403 without `contract_renewal` entitlement (where applicable)

## Observability

- [ ] PostHog contract events fire (or no-op safely in dev)
- [ ] Sentry captures email failures
- [ ] Worker logs summary counts on completion

## UI/UX

- [ ] Module home at `/app/apps/contracts` shows contract-specific empty state
- [ ] List view shows status badges (`active_monitoring`, `expiring_soon`, `expired`)
- [ ] `ContractFieldsForm` renders all field keys
- [ ] Notice deadline callout visible when `termination_notice_days` set
- [ ] Auto-renewal warning styling when `auto_renewal` true and approaching notice deadline
- [ ] Desktop layout correct
- [ ] Mobile layout correct
- [ ] Empty states present
- [ ] Professional tone, no playful copy
- [ ] Cross-sell to Contract Risk Scanner shown contextually

## Workers

- [ ] `npm run worker:contract-monitor` updates statuses and sends renewal reminders
- [ ] Worker idempotent on re-run

## Tests & build

- [ ] `npm test` passes (contract unit tests if present)
- [ ] `npm run build` passes
- [ ] Migration `006_contract_renewal.sql` applies cleanly

## Reference slice criteria

- [ ] No `contracts` table — data in shared primitives only
- [ ] Follows same 12-file doc structure as `docs/modules/coi-tracker/`
- [ ] Registered in `src/lib/modules/modules.ts`
- [ ] Collect → Extract (manual) → Approve (activate) → Monitor → Notify → Audit lifecycle complete
- [ ] Internal-only variant documented (no magic links) as third reference slice
