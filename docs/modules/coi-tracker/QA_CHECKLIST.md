# COI Tracker — QA Checklist

## Security & tenancy

- [ ] RLS: user cannot read another org's COI workflow_instances
- [ ] RLS: user cannot read another org's documents
- [ ] RLS: viewer cannot create COI requests
- [ ] Storage bucket is private (not public)
- [ ] Signed URLs expire appropriately (1h on export)
- [ ] Magic link raw token never stored in DB (SHA-256 hash only)
- [ ] Expired magic link rejected on upload
- [ ] Revoked magic link rejected on upload
- [ ] External route has no org navigation or unrelated data exposure

## Vendor integration

- [ ] COI request requires existing vendor with email
- [ ] Vendor scoped to org
- [ ] Block duplicate active request (with replace override option)

## COI request flow

- [ ] Create request sets due date default 14 days
- [ ] Create creates workflow + document + task in `draft`
- [ ] Send creates magic link (`purpose = coi_upload`) + email event
- [ ] Send transitions status to `sent`
- [ ] Usage incremented on send (`coi_requests`)
- [ ] Active record limit checked on create

## External flow

- [ ] `/external/coi/[token]` loads org context
- [ ] Upload PDF accepted
- [ ] Upload PNG/JPEG accepted
- [ ] Upload >10MB rejected
- [ ] Wrong MIME rejected
- [ ] Completion state shown after upload
- [ ] Mobile responsive upload
- [ ] Upload blocked if workflow already in monitoring/completed state

## Field entry & review

- [ ] Manager can save COI fields to `document_parsed_fields`
- [ ] Invalid `policy_type` rejected
- [ ] Approve requires `insured_name`, `policy_type`, `expiration_date`
- [ ] Approve creates `coi_expiration` monitor
- [ ] Approve transitions to `active_monitoring` (or `expiring_soon`/`expired` if applicable)
- [ ] Manager can reject with reason → `needs_correction`
- [ ] Correction email sent when `resendLink: true`
- [ ] Document version history shown on detail page

## Monitoring

- [ ] Monitor created with correct `monitored_date` = expiration
- [ ] Daily worker updates `expiring_soon` at ≤30 days
- [ ] Daily worker updates `expired` past expiration date
- [ ] Monitor status set to `expired` when certificate lapses
- [ ] Prior vendor monitor completed when new COI approved
- [ ] Document status mirrors workflow monitoring status

## Magic links

- [ ] Resend creates new link / re-sends email
- [ ] Revoke stops access immediately
- [ ] Rate limit on manual resend (non-admin): 1/24h
- [ ] Magic link expires after 14 days

## Reminders

- [ ] Request reminders NOT scheduled on free tier
- [ ] Request reminders scheduled on paid tier (3 windows)
- [ ] `reminder-sender` sends `coi_reminder` and `coi_overdue`
- [ ] Expiration reminders NOT scheduled on free tier
- [ ] Expiration reminders scheduled on paid tier (5 windows)
- [ ] `coi-expiration-monitor` sends internal expiration emails
- [ ] Reminders cancelled on approve / terminal status
- [ ] No duplicate sends for same window

## Audit

- [ ] All major actions create audit_logs (see [AUDIT_EVENTS.md](./AUDIT_EVENTS.md))
- [ ] Audit visible on workflow detail timeline
- [ ] External actions logged with `actor_type: external`

## Evidence export

- [ ] CSV downloads with coverage fields
- [ ] Reminders section included
- [ ] Audit events section included
- [ ] Signed document URLs work
- [ ] `coi_evidence.exported` audited
- [ ] Viewer cannot export

## Billing

- [ ] 4th active COI record blocked on free
- [ ] 4th monthly request blocked on free
- [ ] Upgrade modal shown
- [ ] `billing.limit_reached` audited
- [ ] Paid entitlement unlocks reminder scheduling

## API routes

- [ ] `POST /api/coi/requests` — create + optional send
- [ ] `PATCH /api/coi/requests/[id]` — approve, reject, fields, resend, revoke, export
- [ ] `POST /api/external/coi/upload` — external upload with token
- [ ] All routes return 403 without `coi_tracker` entitlement (where applicable)

## Observability

- [ ] PostHog COI events fire (or no-op safely in dev)
- [ ] Sentry captures email failures
- [ ] Workers log summary counts on completion

## UI/UX

- [ ] Module home at `/app/apps/coi` shows COI-specific empty state
- [ ] `CoiModulePage` lists workflows with status badges
- [ ] `CoiFieldsForm` renders all field keys
- [ ] `CoiWorkflowReviewActions` shows approve/reject for Manager+
- [ ] Desktop layout correct
- [ ] Mobile layout correct (especially external flow)
- [ ] Empty states present
- [ ] Professional tone, no playful copy
- [ ] Cross-sell to W-9 shown contextually

## Workers

- [ ] `npm run worker:reminders` processes COI request reminders
- [ ] `npm run worker:coi-monitor` updates statuses and sends expiration reminders
- [ ] Workers idempotent on re-run

## Tests & build

- [ ] `npm test` passes (COI unit tests if present)
- [ ] `npm run build` passes
- [ ] Migration `005_coi_tracker.sql` applies cleanly

## Reference slice criteria

- [ ] No `coi_certificates` table — data in shared primitives only
- [ ] Follows same doc structure as `docs/modules/vendor-document-portal/`
- [ ] Registered in `src/lib/modules/modules.ts`
- [ ] Collect → Extract (manual) → Approve → Monitor → Notify → Audit lifecycle complete
