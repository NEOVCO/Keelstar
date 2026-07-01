# Keelstar — Tasks to Complete

> This document tracks every gap between the original platform foundation prompt and what is currently implemented. It is the authoritative backlog for finishing the shared platform before building product-specific logic.
>
> **Already done:** See [README.md](./README.md) and [TODO.md](./TODO.md). This file focuses on incomplete foundation work only — not future product MVPs.

---

## How to use this document

- Tasks are grouped by area and ordered roughly by dependency (infra → API → UI → integrations → tests).
- Each task includes: what was requested, what exists today, what is missing, acceptance criteria, and relevant files.
- Mark tasks complete by checking the box and adding a completion date inline.

---

## 1. API routes (critical gap)

The prompt specified a full `/api` surface. Only a subset exists today.

### 1.1 `/api/documents` — document upload and retrieval

**Requested:** API routes for document management under `/api/documents`.

**Exists today:**
- `src/lib/documents/upload.ts` — server-side upload helper with validation, storage path, audit logging, background job enqueue
- `src/lib/documents/extraction.ts` — placeholder extraction pipeline
- `src/app/(app)/documents/page.tsx` — read-only list UI with non-functional "Upload document" button

**Missing:**
- `POST /api/documents` — accept multipart file upload, call `uploadDocument()`, return `{ documentId, versionId }`
- `GET /api/documents` — list documents for active organization (paginated)
- `GET /api/documents/[id]` — document detail with versions
- `GET /api/documents/[id]/versions/[versionId]/download` — generate signed URL (never expose raw storage path)
- `POST /api/documents/[id]/versions` — re-upload creating a new version (see task 2.1)
- `PATCH /api/documents/[id]/parsed-fields/[fieldId]` — override parsed field with audit

**Acceptance criteria:**
- [ ] All routes call `requireOrganization()` or `requirePermission()` appropriately
- [ ] All inputs validated with Zod (`uploadDocumentSchema` and new schemas)
- [ ] Upload rejects invalid MIME types and files over 25MB
- [ ] Every upload creates audit entries: `document.created`, `document.version_created`
- [ ] Field override creates audit entry: `document.field_overridden`
- [ ] Client never receives permanent storage URLs — signed URLs only, short expiry

**Files to create/modify:**
- `src/app/api/documents/route.ts`
- `src/app/api/documents/[id]/route.ts`
- `src/app/api/documents/[id]/versions/route.ts`
- `src/app/api/documents/[id]/parsed-fields/[fieldId]/route.ts`
- `src/lib/validation/schemas.ts` (extend)
- `src/app/(app)/documents/page.tsx` (wire upload button)

---

### 1.2 `/api/workflows` — workflow instance management

**Requested:** API routes for workflow CRUD under `/api/workflows`.

**Exists today:**
- Database tables: `workflow_templates`, `workflow_instances`, `workflow_steps`
- `workflow_templates` seeded with system templates per module type
- `createWorkflowSchema` in `src/lib/validation/schemas.ts`
- Module shell pages with non-functional "Create workflow" buttons
- `src/app/(app)/workflows/page.tsx` — read-only list

**Missing:**
- `src/lib/workflow/` module — no dedicated workflow service layer
- `POST /api/workflows` — create instance from template or module type, create initial steps from `steps_config`, audit `workflow.created`
- `GET /api/workflows` — list instances for organization (filter by type, status)
- `GET /api/workflows/[id]` — instance detail with steps and related tasks
- `PATCH /api/workflows/[id]` — update status, metadata, due date; audit `workflow.status_changed`
- `POST /api/workflows/[id]/cancel` — cancel workflow and revoke associated magic links

**Acceptance criteria:**
- [ ] Creating a workflow validates module entitlement via `hasEntitlement(organizationId, productKey)`
- [ ] Workflow type must match a known value from `src/lib/modules/modules.ts` (`workflowType` field)
- [ ] Initial steps created from matching system template's `steps_config`
- [ ] Status transitions audited
- [ ] Organization scoping enforced on every query

**Files to create:**
- `src/lib/workflow/createWorkflow.ts`
- `src/lib/workflow/updateWorkflow.ts`
- `src/lib/workflow/types.ts`
- `src/app/api/workflows/route.ts`
- `src/app/api/workflows/[id]/route.ts`

---

### 1.3 `/api/tasks` — task management and assignment

**Requested:** API routes for tasks under `/api/tasks`.

**Exists today:**
- Database tables: `tasks`, `task_assignments`
- `src/app/(app)/tasks/page.tsx` — read-only list
- `POST /api/external/complete` — external participant task completion via magic link

**Missing:**
- `src/lib/workflow/tasks.ts` or equivalent task service
- `POST /api/tasks` — create task within a workflow, optionally assign to member or external participant
- `GET /api/tasks` — list tasks (filter by status, workflow, assignee)
- `GET /api/tasks/[id]` — task detail
- `PATCH /api/tasks/[id]` — update status, assignee, due date; audit `task.assigned`, `task.completed`
- `POST /api/tasks/[id]/assign-external` — create `external_participant`, create magic link, queue notification email

**Acceptance criteria:**
- [ ] Assigning external participant creates `external_participants` row, `magic_links` row, and queues email
- [ ] Internal assignment creates `task_assignments` history row
- [ ] Task completion audits `task.completed` with actor type `user` or `external`
- [ ] Overdue status can be set by monitor worker (see task 4.2)

**Files to create:**
- `src/lib/workflow/tasks.ts`
- `src/app/api/tasks/route.ts`
- `src/app/api/tasks/[id]/route.ts`
- `src/app/api/tasks/[id]/assign-external/route.ts`

---

### 1.4 `/api/monitors` — monitor and reminder rule management

**Requested:** API routes for monitors under `/api/monitors`.

**Exists today:**
- Database tables: `monitors`, `monitor_runs`, `reminder_rules`
- `src/lib/monitoring/runMonitors.ts` — basic daily runner used by worker
- `src/app/(app)/monitors/page.tsx` — read-only list with non-functional "Create monitor" button

**Missing:**
- `POST /api/monitors` — create monitor with optional reminder rules; set `next_run_at`; audit `monitor.created`
- `GET /api/monitors` — list monitors for organization
- `GET /api/monitors/[id]` — monitor detail with run history
- `PATCH /api/monitors/[id]` — pause, resume, update config; audit `monitor.updated`, `monitor.paused`
- `DELETE /api/monitors/[id]` — soft cancel; audit `monitor.cancelled`
- `POST /api/monitors/[id]/reminder-rules` — add/update reminder rules

**Acceptance criteria:**
- [ ] Requires `monitors.manage` permission for write operations
- [ ] Requires `monitors.view` for read operations
- [ ] Monitor creation sets sensible default `next_run_at` (e.g. tomorrow 06:00 UTC)
- [ ] Reminder rules support multiple `days_before` values per monitor

**Files to create:**
- `src/lib/monitoring/createMonitor.ts`
- `src/app/api/monitors/route.ts`
- `src/app/api/monitors/[id]/route.ts`

---

### 1.5 `/api/notifications` — notification history and resend

**Requested:** API routes for notifications under `/api/notifications`.

**Exists today:**
- `src/lib/email/sendEmail.ts` — send and queue helpers
- Database tables: `notifications`, `email_events`
- Notification sender worker polls pending notifications

**Missing:**
- `GET /api/notifications` — list notifications for organization (filter by status, recipient)
- `GET /api/notifications/[id]` — notification detail with email events
- `POST /api/notifications/[id]/retry` — retry failed notification (increment retry, re-queue)

**Acceptance criteria:**
- [ ] List scoped to active organization
- [ ] Retry respects max 3 attempts (matches worker logic)
- [ ] Retry creates new audit entry

**Files to create:**
- `src/app/api/notifications/route.ts`
- `src/app/api/notifications/[id]/route.ts`

---

### 1.6 `/api/audit` — audit log read and export

**Requested:** API routes for audit under `/api/audit`, including export.

**Exists today:**
- `src/lib/audit/createAuditLog.ts` — write path complete
- `src/app/(app)/audit/page.tsx` — read-only table (last 100 entries)
- Export endpoint documented in `AUDIT_LOGGING.md` but not implemented

**Missing:**
- `GET /api/audit` — paginated audit log with filters (action, actor, date range, target type)
- `GET /api/audit/export?format=csv|json&from=&to=` — export for compliance review
- Audit entry for export itself: `audit.exported`

**Acceptance criteria:**
- [ ] Requires `audit.view` permission
- [ ] Export capped at reasonable limit (e.g. 10,000 rows) with date range required
- [ ] CSV columns: timestamp, action, actor_type, actor_email, target_type, target_id, correlation_id
- [ ] Export action audited with metadata: `{ format, from, to, rowCount }`
- [ ] Audit logs remain append-only — no UPDATE/DELETE endpoints

**Files to create:**
- `src/lib/audit/exportAuditLog.ts`
- `src/app/api/audit/route.ts`
- `src/app/api/audit/export/route.ts`

---

### 1.7 `/api/auth` — complete auth surface

**Requested:** Auth routes under `/api/auth`.

**Exists today:**
- `POST /api/auth/signout` — signs out and redirects to `/login`
- Client-side signup/login via Supabase client in `(auth)/login` and `(auth)/signup` pages
- Middleware session refresh in `src/lib/supabase/middleware.ts`

**Missing:**
- `GET /auth/callback` — Supabase OAuth/email confirmation callback route (required for email confirmation and future OAuth providers)
- `POST /api/auth/forgot-password` — trigger password reset email
- `POST /api/auth/reset-password` — complete password reset
- Session refresh error handling and redirect to login with message

**Acceptance criteria:**
- [ ] `/auth/callback` uses `@supabase/ssr` cookie exchange pattern
- [ ] Callback redirect URL configured in Supabase dashboard matches `APP_URL/auth/callback`
- [ ] Password reset flow documented in onboarding docs

**Files to create:**
- `src/app/auth/callback/route.ts`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`

---

### 1.8 `/api/organizations` — member invitations

**Requested:** Organization management including invitations.

**Exists today:**
- `POST /api/organizations` — create organization, assign owner role, enable all entitlements, audit
- `POST /api/organizations/switch` — switch active organization cookie
- Database table: `organization_invitations`

**Missing:**
- `GET /api/organizations/members` — list members with roles
- `POST /api/organizations/invitations` — invite member by email with role; hash token; send invitation email; audit `member.invited`
- `POST /api/organizations/invitations/accept` — accept invitation via token
- `PATCH /api/organizations/members/[id]/role` — change member role; audit `member.role_changed`
- `DELETE /api/organizations/members/[id]` — remove member; audit `member.removed`
- `GET /api/organizations/invitations` — list pending invitations

**Acceptance criteria:**
- [ ] Invitation token stored hashed (same pattern as magic links)
- [ ] Invitation email uses `invitation` template
- [ ] Accept flow adds `organization_members` row and `member_roles` row
- [ ] Cannot remove last owner from organization
- [ ] Role changes require `members.manage` permission

**Files to create:**
- `src/lib/tenant/invitations.ts`
- `src/app/api/organizations/members/route.ts`
- `src/app/api/organizations/members/[id]/route.ts`
- `src/app/api/organizations/invitations/route.ts`
- `src/app/invite/[token]/page.tsx` (accept UI)

---

## 2. Document system gaps

### 2.1 Document re-upload and version increment

**Requested:** "Re-upload creates a new document_versions row, increments version number, preserves history."

**Exists today:**
- `uploadDocument()` in `src/lib/documents/upload.ts` always creates version 1
- `document_versions` table supports multiple versions per document with `UNIQUE (document_id, version_number)`

**Missing:**
- `uploadDocumentVersion(documentId, file)` function that:
  1. Queries current max `version_number` for document
  2. Increments to `version_number + 1`
  3. Uploads to storage at new path
  4. Creates new `document_versions` row
  5. Enqueues new `document_processing` background job
  6. Audits `document.version_created`
- API route: `POST /api/documents/[id]/versions`
- UI: re-upload button on document detail page (does not exist yet)

**Acceptance criteria:**
- [ ] Previous versions remain accessible via signed URLs
- [ ] Version history never overwritten
- [ ] Each version gets independent extraction and parsed fields

**Files to create/modify:**
- `src/lib/documents/upload.ts` — add `uploadDocumentVersion()`
- `src/app/api/documents/[id]/versions/route.ts`
- `src/app/(app)/documents/[id]/page.tsx` (document detail page — does not exist)

---

### 2.2 Document detail page

**Requested:** Documents page with version history, parsed fields, and status.

**Exists today:**
- List page only at `/documents`

**Missing:**
- `/documents/[id]` page showing:
  - Document metadata
  - Version history table (version number, filename, status, uploaded by, date)
  - Parsed fields for latest version with override UI
  - Download button (signed URL)
  - Re-upload button
  - Related workflow links

**Acceptance criteria:**
- [ ] Requires `documents.view` to view, `documents.update` to override fields
- [ ] Override triggers audit and marks field `is_override: true`

---

### 2.3 Storage abstraction layer

**Requested:** Architecture in `/lib/storage/` that can later move to S3-compatible storage.

**Exists today:**
- Storage logic embedded in `src/lib/documents/upload.ts` (`getSignedUrl`, path building)

**Missing:**
- `src/lib/storage/client.ts` — abstract interface:
  ```typescript
  upload(path, buffer, options): Promise<void>
  getSignedUrl(path, expiresIn): Promise<string>
  delete(path): Promise<void>
  ```
- `src/lib/storage/supabase.ts` — Supabase Storage implementation
- `src/lib/storage/types.ts` — shared types
- Comment stub for future `s3.ts` implementation

**Acceptance criteria:**
- [ ] All document code uses storage abstraction, not direct Supabase calls
- [ ] Path convention unchanged: `organizations/{org_id}/documents/{doc_id}/versions/{version}/{filename}`

---

## 3. Magic links gaps

### 3.1 `resendMagicLink.ts`

**Requested:** `src/lib/magic-links/resendMagicLink.ts` — revoke old link, create new, send email.

**Exists today:**
- `createMagicLink.ts`, `validateMagicLink.ts`, `revokeMagicLink.ts`
- Documented in `MAGIC_LINKS.md` with resend flow and 5-resend limit

**Missing:**
- `src/lib/magic-links/resendMagicLink.ts` implementing:
  1. Count existing links for task (enforce max 5 resends)
  2. Revoke current active link
  3. Create new link with fresh expiration
  4. Queue `magic_link_task_request` email
  5. Audit both `magic_link.revoked` and `magic_link.created`
- API route: `POST /api/tasks/[id]/resend-link`
- UI button on task detail and workflow detail pages

**Acceptance criteria:**
- [ ] Resend limit enforced server-side
- [ ] Old link immediately invalid after resend
- [ ] Email includes organization name, task title, expiration

---

### 3.2 Module-specific external participant forms

**Requested:** External route shows task-specific UI (W-9 upload, COI upload, signature, etc.).

**Exists today:**
- `/external/[token]` with generic `ExternalTaskForm` — single "Complete task" button, no file upload

**Missing:**
- Form components per purpose:
  - `W9SubmitForm` — file upload for W-9 PDF
  - `CoiUploadForm` — file upload for COI certificate
  - `SignatureForm` — typed name + agreement checkbox
  - `AcknowledgementForm` — policy acknowledgement checkbox
  - `GenericUploadForm` — fallback file upload
- Route logic to render form based on `magic_links.purpose`
- External upload flow: upload to storage with `source: 'external_upload'`, link to workflow

**Acceptance criteria:**
- [ ] External uploads create document + version under organization
- [ ] No app navigation exposed to external participant
- [ ] Completion marks task done and consumes magic link (if single-use)

**Files to create:**
- `src/components/forms/external/W9SubmitForm.tsx`
- `src/components/forms/external/CoiUploadForm.tsx`
- `src/components/forms/external/SignatureForm.tsx`
- `src/components/forms/external/AcknowledgementForm.tsx`
- `src/app/api/external/upload/route.ts`

---

## 4. Workflow engine gaps

### 4.1 Workflow service layer

**Requested:** Generic workflow engine with typed instances, steps, and tasks.

**Exists today:**
- Database schema complete
- System templates seeded
- No service layer connecting templates → instances → steps → tasks

**Missing:**
- `src/lib/workflow/createWorkflow.ts`:
  - Load system template by `module_type`
  - Create `workflow_instances` row
  - Create `workflow_steps` from template `steps_config`
  - Create initial tasks for first active step
  - Audit `workflow.created`
- `src/lib/workflow/advanceWorkflow.ts`:
  - Mark current step completed
  - Activate next step
  - Create tasks for next step
  - Audit `workflow.status_changed`
- `src/lib/workflow/types.ts` — TypeScript types for workflow types, statuses, step configs

**Acceptance criteria:**
- [ ] All 10 module workflow types supported (from `modules.ts` `workflowType`)
- [ ] Metadata jsonb used for module-specific data (no product-specific tables)
- [ ] Every status change audited

---

### 4.2 Wire "Create workflow" buttons on module pages

**Requested:** Module pages with functional "Create workflow" button.

**Exists today:**
- `ModulePageShell` renders `<Button>Create workflow</Button>` with no action
- Same on `/workflows` page

**Missing:**
- Create workflow modal or dedicated `/workflows/new?type=w9_collection` page
- Form fields: title, due date (optional), module-specific metadata
- Submit calls `POST /api/workflows`
- Redirect to workflow detail on success

**Acceptance criteria:**
- [ ] Entitlement check before showing create button
- [ ] Module type pre-selected based on current module page
- [ ] Success redirects to `/workflows/[id]`

---

### 4.3 Workflow detail page

**Missing entirely.**

**Should include:**
- Workflow title, status, type, due date, owner
- Step progression visual (pending → active → completed)
- Task list per step
- Related documents
- Monitor status
- Audit activity for this workflow
- Actions: cancel, assign external participant, create monitor

**Files to create:**
- `src/app/(app)/workflows/[id]/page.tsx`
- `src/components/workflows/WorkflowDetail.tsx`
- `src/components/workflows/StepProgress.tsx`

---

## 5. Monitoring and notification gaps

### 5.1 Monitor runner — production logic

**Requested:** Worker finds due monitors, evaluates conditions, creates notifications, is idempotent.

**Exists today:**
- `runDueMonitors()` in `src/lib/monitoring/runMonitors.ts` — basic skeleton
- Creates `monitor_runs` row
- Queues generic monitor alert if `recipientEmail` in config
- Idempotency: skips if run already exists for same day

**Missing:**
- Monitor type-specific evaluators:
  - `coi_expiration` — check parsed field `expiration_date` against reminder rules
  - `contract_renewal` — check `renewal_date` from workflow metadata
  - `training_expiry` — check certification expiration
  - `policy_overdue` — check uncompleted acknowledgement tasks
  - `invoice_overdue` — check pending approval tasks past due date
  - `exclusion_recheck` — schedule periodic recheck
  - `vendor_packet_incomplete` — check document checklist completion
- Overdue task status updates (`tasks.status = 'overdue'`)
- Notification content tailored per monitor type (not generic message)
- Proper `next_run_at` calculation based on monitor config (not always +1 day)

**Acceptance criteria:**
- [ ] Each monitor run audited as `monitor.run`
- [ ] Failed runs logged in `monitor_runs.error_message`, worker continues
- [ ] Reminder rules respected: send at 90, 60, 30, 7 days before (configurable)
- [ ] Idempotent: same monitor + same day = skip

**Files to create:**
- `src/lib/monitoring/evaluators/coiExpiration.ts`
- `src/lib/monitoring/evaluators/contractRenewal.ts`
- `src/lib/monitoring/evaluators/genericOverdue.ts`
- `src/lib/monitoring/evaluators/index.ts`

---

### 5.2 Email templates as separate files

**Requested:** Email templates in `/lib/email/templates/` — magic link, reminder, overdue, task completed, document submitted, monitor alert, invitation.

**Exists today:**
- Inline template renderers in `src/lib/email/sendEmail.ts` (`TEMPLATES` object)

**Missing:**
- Separate template files:
  - `src/lib/email/templates/magic-link-task-request.ts`
  - `src/lib/email/templates/reminder.ts`
  - `src/lib/email/templates/overdue-reminder.ts`
  - `src/lib/email/templates/task-completed.ts`
  - `src/lib/email/templates/document-submitted.ts`
  - `src/lib/email/templates/monitor-alert.ts`
  - `src/lib/email/templates/invitation.ts`
- `src/lib/email/templates/base.ts` — shared HTML wrapper (organization name footer, Keelstar branding)
- `src/lib/email/templates/index.ts` — registry mapping `template_key` → renderer

**Acceptance criteria:**
- [ ] All templates professional, plain, enterprise-grade (no marketing fluff)
- [ ] Organization name included in every template
- [ ] No sensitive document content in email body
- [ ] Templates render both HTML and plain-text fallback

---

### 5.3 Notification service layer

**Requested:** `/lib/notifications/` module.

**Exists today:**
- Email send logic in `src/lib/email/sendEmail.ts`

**Missing:**
- `src/lib/notifications/createNotification.ts` — create in-app + email notification records
- `src/lib/notifications/markSent.ts` — update status after worker send
- `src/lib/notifications/retry.ts` — retry failed notifications
- Separation: email is a channel, notifications is the platform primitive

---

## 6. Stripe and billing gaps

### 6.1 Stripe Checkout integration

**Requested:** Create Stripe customer per organization, subscriptions, entitlements, module gating.

**Exists today:**
- `getOrCreateStripeCustomer()` in `src/lib/stripe/index.ts`
- Webhook handler for subscription events
- `organization_entitlements` table and billing page display
- Demo org has all entitlements enabled via seed

**Missing:**
- Stripe Products and Prices created in Stripe dashboard matching `products` table keys
- `products.stripe_product_id` and `products.stripe_price_id` populated in seed or migration
- `POST /api/stripe/checkout` — create Checkout Session for module subscription
- `POST /api/stripe/portal` — create Billing Portal session for payment method management
- Billing page "Manage subscription" and "Start trial" buttons wired to above routes
- Entitlement sync on webhook: enable/disable `organization_entitlements` based on subscription items
- Module pages and API routes enforce entitlements (hide nav + reject API calls)

**Acceptance criteria:**
- [ ] Checkout creates Stripe Customer if not exists
- [ ] Successful checkout enables entitlements for purchased modules
- [ ] Cancellation disables entitlements at period end
- [ ] `billing.subscription_updated` audited on every webhook state change
- [ ] Requires `billing.manage` permission (Owner only)

**Files to create:**
- `src/lib/stripe/checkout.ts`
- `src/lib/stripe/portal.ts`
- `src/lib/stripe/syncEntitlements.ts`
- `src/app/api/stripe/checkout/route.ts`
- `src/app/api/stripe/portal/route.ts`
- `src/lib/tenant/entitlements.ts` — `requireEntitlement(orgId, productKey)` helper

---

## 7. Auth and RBAC gaps

### 7.1 `can(user, organization, permissionKey)` signature

**Requested:** `can(user, organization, permissionKey)` helper.

**Exists today:**
- `can(permissions: PermissionKey[], permissionKey: PermissionKey)` in `src/lib/rbac/types.ts`
- Permission resolution happens in `requireOrganization()` which loads permissions array

**Missing:**
- Async helper matching requested signature:
  ```typescript
  async function can(userId: string, organizationId: string, permissionKey: PermissionKey): Promise<boolean>
  ```
- Should query `member_roles` → `role_permissions` → `permissions` for the user in that org
- Keep existing sync `can(permissions[], key)` for use after `requireOrganization()`

**Files to modify:**
- `src/lib/rbac/types.ts` or new `src/lib/rbac/can.ts`

---

### 7.2 `current_organization_id()` SQL function

**Requested:** Helper function `current_organization_id()` in Postgres.

**Exists today:**
- `is_org_member(org_id)` and `has_permission(org_id, key)` in migration `002_rls_policies.sql`
- Active org stored in cookie, not in JWT

**Missing:**
- Decision required: JWT claim vs cookie vs session variable
- If JWT claim approach: set `organization_id` claim on session switch via Supabase custom claims or app_metadata
- If session variable: set via `SET LOCAL app.organization_id = ...` at start of each request (requires connection pooling consideration)
- Document chosen approach in `ARCHITECTURE.md`

**Note:** Cookie-based approach (current) works for Next.js server routes but cannot be used in RLS directly. This task requires an architectural decision before implementation.

---

### 7.3 Member management UI

**Requested:** Invite members, manage roles.

**Exists today:**
- Settings page shows org name and user's roles
- `organization_invitations` table exists
- No invite UI or member list

**Missing:**
- Settings → Members tab:
  - Member list with roles
  - Invite form (email + role selector)
  - Pending invitations list with revoke
  - Role change dropdown (requires `members.manage`)
  - Remove member action
- Invite accept page at `/invite/[token]`

---

## 8. Audit logging gaps

### 8.1 Wire day-one actions to real flows

**Requested:** Audit these actions from day one.

**Exists today — wired:**
- `organization.created` — on org create API
- `magic_link.created`, `magic_link.used`, `magic_link.revoked`, `magic_link.expired` — magic link lib + cleanup worker
- `task.completed` — external complete API
- `document.created`, `document.version_created`, `document.parsed` — upload + extraction
- `notification.sent` / `notification.failed` — email send
- `billing.subscription_updated` — Stripe webhook
- `monitor.run` — monitor runner (basic)

**Not yet wired (need API/flow implementation first):**
- [ ] `organization.updated`, `organization.settings_changed`
- [ ] `member.invited`, `member.joined`, `member.removed`, `member.role_changed`, `member.suspended`
- [ ] `document.updated`, `document.archived`, `document.field_overridden`
- [ ] `workflow.created`, `workflow.updated`, `workflow.status_changed`, `workflow.completed`, `workflow.cancelled`
- [ ] `task.created`, `task.assigned`, `task.cancelled`, `task.overdue`
- [ ] `monitor.created`, `monitor.updated`, `monitor.paused`, `monitor.cancelled`
- [ ] `notification.created`
- [ ] `billing.subscription_created`, `billing.subscription_cancelled`, `billing.entitlement_changed`
- [ ] `audit.exported`

**Acceptance criteria:**
- [ ] Every API route that mutates data calls `createAuditLog()` or `withAudit()`
- [ ] Worker actions use `actorType: 'system'`
- [ ] External actions use `actorType: 'external'`

---

## 9. Integrations not wired

### 9.1 Sentry error tracking

**Requested:** `@sentry/nextjs` with client, server, and edge configs.

**Exists today:**
- `SENTRY_DSN` in `.env.example`
- Mentioned in `ARCHITECTURE.md` and `RENDER_DEPLOYMENT.md`

**Missing:**
- Install `@sentry/nextjs`
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `next.config.mjs` — wrap with `withSentryConfig`
- PII scrubbing rules (never send document contents, emails in breadcrumbs)
- Source map upload in production build

**Acceptance criteria:**
- [ ] Unhandled errors in API routes appear in Sentry
- [ ] User ID and organization ID attached as context (not PII)
- [ ] Development mode does not send events (or sends to separate project)

---

### 9.2 PostHog analytics

**Requested:** Client-side `posthog-js` and server-side `posthog-node`.

**Exists today:**
- `POSTHOG_KEY` in `.env.example`
- Google Analytics and Microsoft Clarity on marketing site (pre-existing)

**Missing:**
- Install `posthog-js` and `posthog-node`
- `src/lib/analytics/posthog-client.ts` — browser init
- `src/lib/analytics/posthog-server.ts` — server event helper
- `src/components/analytics/PostHogProvider.tsx` — client provider in app layout
- Key events to track (platform-level):
  - `organization_created`
  - `workflow_created`
  - `document_uploaded`
  - `magic_link_sent`
  - `task_completed`
  - `subscription_started`
- Organization group analytics: `posthog.group('organization', orgId)`

**Acceptance criteria:**
- [ ] PostHog only initialized when `POSTHOG_KEY` is set
- [ ] No PII in event properties
- [ ] App layout includes provider; marketing site optionally separate

---

## 10. UI and UX gaps

### 10.1 App shell breadcrumbs

**Requested:** Breadcrumbs in enterprise SaaS UI.

**Exists today:**
- `Breadcrumbs` component in `src/components/sections.tsx` — used on marketing pages only
- App pages have no breadcrumbs

**Missing:**
- App-specific breadcrumb component or reuse existing
- Breadcrumbs on: document detail, workflow detail, module pages, settings sub-pages
- Pattern: `Dashboard > Workflows > W-9 Collection #123`

---

### 10.2 Dedicated component directories

**Requested:**
```
/components/documents
/components/workflows
/components/audit
/components/billing
```

**Exists today:**
- `components/workflows/ModulePageShell.tsx`
- `components/forms/ExternalTaskForm.tsx`
- Generic UI in `components/ui/`

**Missing components (create as pages get built):**
- `components/documents/DocumentList.tsx`
- `components/documents/DocumentUpload.tsx`
- `components/documents/VersionHistory.tsx`
- `components/documents/ParsedFieldsEditor.tsx`
- `components/workflows/WorkflowList.tsx`
- `components/workflows/WorkflowDetail.tsx`
- `components/workflows/CreateWorkflowModal.tsx`
- `components/workflows/StepProgress.tsx`
- `components/audit/AuditLogTable.tsx`
- `components/audit/AuditExportButton.tsx`
- `components/billing/SubscriptionCard.tsx`
- `components/billing/EntitlementList.tsx`
- `components/billing/CheckoutButton.tsx`

---

### 10.3 shadcn/ui installation

**Requested:** "Use shadcn/ui if useful."

**Exists today:**
- Hand-rolled components in `components/ui/` (Button, Card, Badge, Input, EmptyState) styled with existing Tailwind tokens

**Missing (optional but recommended for consistency):**
- Run `npx shadcn@latest init` with existing Tailwind config
- Replace hand-rolled components with shadcn equivalents: Dialog, Select, DropdownMenu, Tabs, Tooltip, Avatar
- `components.json` config file

**Note:** Current hand-rolled components work and match design tokens. This is a quality upgrade, not a blocker.

---

## 11. Free tool placeholder pages

**Requested:** Placeholder free tool pages at specific paths with clean UI and conversion CTAs.

**Prompt paths:**
- `/tools/w9-request`
- `/tools/coi-analyzer`
- `/tools/contract-renewal-extractor`
- `/tools/oig-search`
- `/tools/pdf-signer`

**Exists today:**
- Marketing tools at `/tools/[slug]` with different slugs:
  - `w9-request-generator` (not `w9-request`)
  - `acord-analyzer` / `coi-expiration-extractor` (not `coi-analyzer`)
  - `contract-renewal-extractor` ✓ (matches)
  - `oig-search` ✓ (matches)
  - `pdf-signer` ✓ (matches)
- Existing tools have full marketing UI with CTAs to paid products

**Missing:**
- Align `modules.ts` `freeToolSlug` values with actual tool slugs OR create redirects:
  - `/tools/w9-request` → redirect to `/tools/w9-request-generator` or rename slug
  - `/tools/coi-analyzer` → redirect to `/tools/acord-analyzer` or create alias
- Ensure every module's `freeToolSlug` in `modules.ts` resolves to a live page
- Add platform CTA on each free tool: "Automate this with [Module Name] →" linking to `/signup` or module page

**Files to modify:**
- `src/lib/modules/modules.ts` — align slugs
- `next.config.mjs` — redirects for alias paths (optional)
- Free tool pages — add Keelstar platform conversion CTA banner

---

## 12. Project structure gaps

### 12.1 `(marketing)` route group

**Requested:** Marketing site under `/app/(marketing)`.

**Exists today:**
- Marketing pages at `src/app/` root level (pre-existing site)
- App pages in `src/app/(app)/`
- Auth pages in `src/app/(auth)/`

**Missing:**
- Optional refactor: move marketing pages into `src/app/(marketing)/` route group with marketing layout (Header + Footer)
- Separate layout from app shell (no sidebar on marketing)
- Currently works because root `layout.tsx` includes Header/Footer and `(app)/layout.tsx` replaces with sidebar

**Note:** This is organizational cleanup. Functionally correct today because route groups already separate layouts. Low priority unless you want cleaner folder structure.

---

### 12.2 `supabase/policies/` directory

**Requested:** RLS policies in `/supabase/policies/`.

**Exists today:**
- All policies in `supabase/migrations/002_rls_policies.sql`

**Missing:**
- Optional split: extract policies to `supabase/policies/*.sql` for readability
- Or document that policies live in migrations (current approach is valid for Supabase CLI workflow)

---

### 12.3 Demo user in seed

**Requested:** Demo user placeholder in seed data.

**Exists today:**
- Demo organization: `00000000-0000-0000-0000-000000000001` with all entitlements
- No auth.users row (Supabase Auth manages users separately)

**Missing:**
- Document in seed README that demo user must be created via Supabase Auth dashboard or CLI:
  ```bash
  supabase auth admin create-user --email demo@keelstar.com --password demo-password
  ```
- Seed script addition (if using service role): insert into `organization_members` linking demo user to demo org
- Optional: `supabase/seed/demo-user.sql` that assumes a known user UUID

**Note:** Cannot seed `auth.users` via regular SQL migration in hosted Supabase without service role API call.

---

## 13. Testing gaps

### 13.1 Integration tests (entirely missing)

**Requested:**
- User creates organization
- User uploads document
- External participant completes task
- Monitor creates reminder
- Unauthorized user cannot access another organization's data

**Exists today:**
- `tests/platform.test.ts` — 12 unit tests only
- `vitest.config.ts` configured

**Missing:**
- `tests/integration/` directory
- Test setup with Supabase local (`supabase start`) or test project
- `tests/integration/setup.ts` — create test client, seed test org, create test user
- Individual test files:

**`tests/integration/organization.test.ts`**
- [ ] Authenticated user creates organization → becomes owner
- [ ] Organization has all trial entitlements
- [ ] Audit log contains `organization.created`
- [ ] Second organization can be created by same user

**`tests/integration/documents.test.ts`**
- [ ] Upload document → creates document + version rows
- [ ] Background job enqueued for processing
- [ ] Document appears in org-scoped list
- [ ] User from different org cannot read document (RLS)

**`tests/integration/external-participant.test.ts`**
- [ ] Create workflow + task + magic link
- [ ] Valid token returns task data
- [ ] Expired token rejected
- [ ] Complete task → task status `completed`, link use count incremented
- [ ] Single-use link rejected on second use

**`tests/integration/monitor.test.ts`**
- [ ] Create monitor with reminder rule
- [ ] Run monitor runner → creates monitor_run
- [ ] Notification queued
- [ ] Second run same day is idempotent (skipped)

**`tests/integration/tenant-isolation.test.ts`**
- [ ] User A in Org A cannot query Org B documents
- [ ] User A cannot switch to Org B without membership
- [ ] API returns 403 for cross-tenant access attempts

**Acceptance criteria:**
- [ ] Tests run via `npm run test:integration` (separate from unit tests)
- [ ] CI runs against Supabase local Docker
- [ ] Tests clean up after themselves

**Files to create:**
- `tests/integration/setup.ts`
- `tests/integration/helpers.ts`
- `tests/integration/*.test.ts`
- Update `package.json` with `test:integration` script

---

### 13.2 Additional unit tests

**Missing unit tests for:**
- [ ] `createAuditLog()` — mock Supabase, verify insert shape
- [ ] `validateMagicLink()` — all rejection reasons (expired, revoked, max uses, not found)
- [ ] `uploadDocument()` — validation rejects bad MIME type and oversized files
- [ ] `sanitizeFilename()` — path traversal attempts
- [ ] `rateLimit()` — enforces limit
- [ ] `handleStripeWebhook()` — idempotency (skip already processed events)
- [ ] `runDueMonitors()` — idempotency skip logic

---

## 14. Security hardening gaps

### 14.1 Rate limiting on all sensitive endpoints

**Requested:** Rate limiting structure on auth, magic link validation, uploads.

**Exists today:**
- `src/lib/errors/rate-limit.ts` — in-memory rate limiter
- Applied only on `POST /api/external/complete`

**Missing:**
- Apply rate limiting to:
  - `POST /api/external/complete` ✓ (done)
  - `GET /external/[token]` page loads (via middleware or API)
  - `POST /api/auth/*` routes
  - `POST /api/documents` (upload)
  - `POST /api/organizations/invitations`
  - Magic link validation endpoint (when extracted from page to API)
- Document that in-memory limiter is MVP; Redis-backed limiter is future (noted in ARCHITECTURE.md)

---

### 14.2 Entitlement enforcement middleware

**Missing:**
- `requireEntitlement(orgId, productKey)` helper in `src/lib/tenant/entitlements.ts`
- Module API routes check entitlement before executing
- Module pages show upgrade CTA when entitlement missing (instead of full shell)

---

### 14.3 CSP header

**Exists today:**
- `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`

**Missing:**
- Content-Security-Policy header tuned for Next.js + Supabase + Stripe + PostHog domains
- Document allowed domains in `SECURITY.md` or `ARCHITECTURE.md`

---

## 15. Marketing / app coexistence

### 15.1 `/workflows` route conflict resolution

**Issue:** Prompt assigned `/workflows` to the protected app. Marketing site had `/workflows/page.tsx` (hub) which was deleted to resolve build conflict.

**Missing:**
- Restore marketing workflows hub at a new path (e.g. `/workflow-guides` or `/use-cases`) OR redirect `/workflows` index to app when authenticated and marketing hub when not
- Individual marketing workflow pages at `/workflows/[slug]` still exist and work
- Add redirect or nav link update so marketing site doesn't have broken "Workflows" hub link

**Files to check:**
- `src/components/layout/Header.tsx` — nav links
- `src/app/sitemap.ts` — sitemap entries

---

## 16. Suggested implementation order

For a solo founder, tackle in this sequence:

```
Phase A — Core API (enables everything else)
  1.1  /api/documents (+ 2.1 re-upload, 2.2 detail page)
  1.2  /api/workflows (+ 4.1 service layer, 4.2 create button, 4.3 detail page)
  1.3  /api/tasks (+ 3.1 resend magic link, 3.2 external forms)
  1.8  /api/organizations invitations (+ 7.3 member UI)

Phase B — Monitoring & comms
  1.4  /api/monitors
  5.1  Monitor evaluators (production logic)
  5.2  Email templates as files
  1.5  /api/notifications

Phase C — Billing & gating
  6.1  Stripe Checkout + entitlement sync
  14.2 Entitlement enforcement

Phase D — Audit & compliance
  1.6  /api/audit export
  8.1  Wire remaining audit actions

Phase E — Integrations
  9.1  Sentry
  9.2  PostHog
  1.7  Auth callback + password reset

Phase F — Quality
  13.1 Integration tests
  13.2 Additional unit tests
  10.1–10.3 UI polish
  11   Free tool slug alignment
  15.1 Marketing route fix
```

---

## 17. Reference: original prompt deliverables checklist

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Complete code implementation | ⚠️ Foundation done, gaps above |
| 2 | All documentation files | ✅ Complete |
| 3 | Supabase migrations | ✅ Complete |
| 4 | RLS policies | ✅ Complete (in migration, not separate folder) |
| 5 | Initial app shell | ✅ Complete |
| 6 | Initial worker structure | ✅ Complete |
| 7 | Initial module configuration | ✅ Complete |
| 8 | Render deployment documentation | ✅ Complete |
| 9 | Clear TODO list | ✅ TODO.md + this file |
| 10 | Run locally / deploy explanation | ✅ docs/README.md |

---

*Last updated: platform foundation audit. Treat [DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md) as law when completing every task above.*
