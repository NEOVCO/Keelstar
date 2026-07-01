# W-9 Collection — QA Checklist

## Security & tenancy

- [ ] RLS: user cannot read another org's vendors
- [ ] RLS: user cannot read another org's workflow_instances
- [ ] RLS: viewer cannot insert vendors
- [ ] Storage bucket is private (not public)
- [ ] Signed URLs expire appropriately
- [ ] Magic link raw token never stored in DB
- [ ] Expired magic link rejected
- [ ] Revoked magic link rejected

## Vendor CRUD

- [ ] Create vendor with name + email
- [ ] List vendors scoped to org
- [ ] Edit vendor
- [ ] Archive vendor hides from default list

## W-9 request flow

- [ ] Create request sets due date default 14 days
- [ ] Send creates magic link + email event
- [ ] Block duplicate active request (with confirm override)
- [ ] Request status transitions correct

## External flow

- [ ] `/external/w9/[token]` loads org context
- [ ] Upload PDF accepted
- [ ] Upload PNG/JPEG accepted
- [ ] Upload >10MB rejected
- [ ] Wrong MIME rejected
- [ ] Completion page shown
- [ ] Mobile responsive upload

## Internal review

- [ ] Submitted W-9 visible to members
- [ ] Manager can approve → completed
- [ ] Manager can reject with reason → needs_correction
- [ ] Correction email sent
- [ ] Document version history shown

## Magic links

- [ ] Resend creates new link / re-sends email
- [ ] Revoke stops access immediately
- [ ] Rate limit on manual resend (non-admin)

## Reminders

- [ ] 3 reminders scheduled on send
- [ ] Worker sends due reminders
- [ ] Reminders cancelled on completion
- [ ] No duplicate sends for same window

## Audit

- [ ] All major actions create audit_logs
- [ ] Audit visible at `/audit`
- [ ] Vendor detail shows activity timeline

## Evidence export

- [ ] CSV downloads with metadata
- [ ] Audit events included
- [ ] Signed document URLs work

## Billing

- [ ] 6th vendor blocked on free
- [ ] 6th monthly request blocked on free
- [ ] Upgrade modal shown
- [ ] `billing.limit_reached` audited

## Observability

- [ ] PostHog events fire (or no-op safely)
- [ ] Sentry captures email failures

## UI/UX

- [ ] Desktop layout correct
- [ ] Mobile layout correct
- [ ] Empty states present
- [ ] Professional tone, no playful copy
- [ ] Keyboard accessible forms

## Seed

- [ ] `w9_demo.sql` runs without error
- [ ] Demo org has 3 vendors, 4 request states

## Tests

- [ ] `npm test` passes
- [ ] `npm run build` passes
