# Keelstar Platform — Future Implementation TODO

> Platform foundation is complete. These items remain for product-specific implementation.

## Infrastructure

- [ ] Run Supabase migrations against production project
- [ ] Configure Supabase Auth redirect URLs for production
- [ ] Set up Render services per RENDER_DEPLOYMENT.md
- [ ] Configure Resend domain and DNS
- [ ] Configure Stripe products/prices matching `products` table
- [ ] Enable Sentry source map upload in CI
- [ ] Configure PostHog project and client initialization
- [ ] Generate TypeScript types: `supabase gen types typescript`

## Auth & Onboarding

- [ ] Email confirmation flow UI
- [ ] Password reset flow
- [ ] Organization invitation accept flow (`/invite/[token]`)
- [ ] Member management UI (invite, role change, remove)

## Documents

- [ ] Document upload UI with drag-and-drop
- [ ] Document detail page with version history
- [ ] Parsed fields display and override UI
- [ ] Signed URL download button
- [ ] Plug in OCR/AI extraction pipeline (replace placeholder in `extractDocumentFields`)

## Workflows & Tasks

- [ ] Create workflow wizard per module type
- [ ] Workflow detail page with step progression
- [ ] Task assignment UI (internal member + external participant)
- [ ] Task detail page with action buttons
- [ ] Workflow status transitions with approval gates

## Magic Links

- [ ] Send magic link email on task creation
- [ ] Module-specific external participant forms (W-9 upload, COI upload, signature)
- [ ] Resend magic link UI
- [ ] Revoke magic link UI

## Monitors & Notifications

- [ ] Create monitor UI per module type
- [ ] Reminder rule configuration UI
- [ ] In-app notification center
- [ ] Email template polish (HTML versions)

## Billing

- [ ] Stripe Checkout integration for module subscriptions
- [ ] Billing portal link for payment method management
- [ ] Entitlement gating in module pages and API routes
- [ ] Trial expiration handling

## Product Modules (MVP per module)

### W-9 Collector
- [ ] W-9 collection workflow creation
- [ ] Vendor magic link upload form
- [ ] TIN/name/address extraction (AI)
- [ ] Missing W-9 monitor

### COI Tracker
- [ ] COI tracking workflow creation
- [ ] COI upload via magic link
- [ ] Expiration date extraction
- [ ] 30/60/90 day expiration monitors

### Contract Renewal Tracker
- [ ] Contract upload and date extraction
- [ ] Renewal date monitors with reminders

### Contract Risk Scanner
- [ ] Risk clause pattern matching
- [ ] Review task assignment

### Exclusion Monitor
- [ ] Name roster management
- [ ] OIG/SAM API integration
- [ ] Match alert notifications

### Vendor Packet Portal
- [ ] Checklist template configuration
- [ ] Multi-document magic link portal
- [ ] Completion tracking

### Policy Acknowledgement Tracker
- [ ] Policy distribution workflow
- [ ] Employee acknowledgement via magic link
- [ ] Overdue monitor

### Training Record Tracker
- [ ] Training record creation
- [ ] Certification expiration monitoring

### Invoice Approval Lite
- [ ] Invoice upload and amount extraction
- [ ] Approval chain routing
- [ ] Overdue approval monitor

### Simple Signer
- [ ] Document send for signature
- [ ] Signature capture (checkbox + typed name for MVP)
- [ ] Signed version storage

## Free Tools (Lead Gen)

- [ ] `/tools/w9-request` — enhance with platform CTA
- [ ] `/tools/coi-analyzer` — enhance with platform CTA
- [ ] `/tools/contract-renewal-extractor` — build tool
- [ ] `/tools/oig-search` — build tool
- [ ] `/tools/pdf-signer` — build tool

## Testing

- [ ] Integration tests with Supabase local (organization creation, document upload)
- [ ] E2E tests for auth flow, external participant flow
- [ ] Cross-tenant isolation integration tests

## Security Hardening

- [ ] Redis-backed rate limiting
- [ ] CSP header tuning
- [ ] File upload virus scanning (future)
- [ ] Audit log export endpoint

## Scalability (Future)

- [ ] Migrate background_jobs to BullMQ + Redis
- [ ] Migrate storage to S3-compatible backend
- [ ] Add Meilisearch for document/workflow search
- [ ] Supabase Realtime for live task updates
