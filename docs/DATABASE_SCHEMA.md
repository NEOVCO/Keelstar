# Keelstar Database Schema

> All tables use UUID primary keys. Every tenant-scoped table includes `organization_id`, `created_at`, `updated_at`. RLS is enabled on all tenant tables.

---

## Core Identity & Tenancy

### organizations

The tenant boundary. Every piece of business data belongs to an organization.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text NOT NULL | Display name |
| slug | text UNIQUE NOT NULL | URL-safe identifier |
| stripe_customer_id | text | Stripe Customer ID |
| settings | jsonb DEFAULT '{}' | Org-level settings |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `slug`, `stripe_customer_id`

---

### organization_members

Links users to organizations.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| user_id | uuid FK → auth.users | |
| status | text | `active`, `suspended`, `removed` |
| invited_email | text | Email used for invitation |
| joined_at | timestamptz | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `(organization_id, user_id)` UNIQUE, `user_id`

**RLS**: Members can see other members in their org. Only admins+ can modify.

---

### roles

System-defined roles. Not tenant-scoped (shared across platform).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| key | text UNIQUE NOT NULL | `owner`, `admin`, `manager`, `member`, `viewer` |
| name | text NOT NULL | Display name |
| description | text | |
| is_system | boolean DEFAULT true | Cannot be deleted |
| created_at | timestamptz | |

---

### permissions

System-defined permissions. Not tenant-scoped.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| key | text UNIQUE NOT NULL | e.g. `documents.create` |
| name | text NOT NULL | Display name |
| description | text | |
| group_key | text | Permission group for UI grouping |
| created_at | timestamptz | |

---

### role_permissions

Maps roles to permissions.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| role_id | uuid FK → roles | |
| permission_id | uuid FK → permissions | |

**Indexes**: `(role_id, permission_id)` UNIQUE

---

### member_roles

Assigns roles to organization members.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| member_id | uuid FK → organization_members | |
| role_id | uuid FK → roles | |
| assigned_by | uuid | User who assigned |
| created_at | timestamptz | |

**Indexes**: `(member_id, role_id)` UNIQUE, `organization_id`

**RLS**: Org-scoped. Admins+ can assign roles.

---

### organization_invitations

Pending invitations to join an organization.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| email | text NOT NULL | Invitee email |
| role_id | uuid FK → roles | Role to assign on accept |
| invited_by | uuid NOT NULL | Inviter user ID |
| token_hash | text NOT NULL | Hashed invitation token |
| status | text | `pending`, `accepted`, `expired`, `revoked` |
| expires_at | timestamptz NOT NULL | |
| accepted_at | timestamptz | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `token_hash`, `(organization_id, email)`, `status`

---

## Documents

### documents

Logical document entity. Versions are tracked separately.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| title | text NOT NULL | |
| document_type | text | Module-specific type hint |
| status | text | `active`, `archived`, `deleted` |
| metadata | jsonb DEFAULT '{}' | Flexible metadata |
| created_by | uuid | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `organization_id`, `(organization_id, document_type)`, `(organization_id, status)`

---

### document_versions

Immutable version history for documents.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| document_id | uuid FK → documents | |
| version_number | integer NOT NULL | Auto-incremented per document |
| filename | text NOT NULL | Sanitized original filename |
| mime_type | text NOT NULL | |
| size_bytes | bigint NOT NULL | |
| checksum | text | SHA-256 hash |
| storage_path | text NOT NULL | Supabase Storage path |
| source | text | `internal_upload`, `external_upload`, `email`, `api` |
| status | text | `uploaded`, `processing`, `parsed`, `failed` |
| uploaded_by | uuid | Internal user ID (null for external) |
| error_message | text | If status = failed |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `(document_id, version_number)` UNIQUE, `organization_id`, `(organization_id, status)`

---

### document_parsed_fields

Generic extracted/overrideable fields from document versions.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| document_version_id | uuid FK → document_versions | |
| field_key | text NOT NULL | e.g. `vendor_name`, `expiration_date` |
| field_value | text | Stored as text, typed via field_type |
| field_type | text | `text`, `number`, `date`, `boolean`, `currency`, `json` |
| confidence | numeric(5,4) | 0.0000 to 1.0000 |
| extraction_source | text | `manual`, `regex`, `ai`, `ocr`, `system` |
| is_override | boolean DEFAULT false | User manually corrected |
| overridden_by | uuid | User who overrode |
| overridden_at | timestamptz | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `(document_version_id, field_key)`, `organization_id`

---

### document_events

Timeline of document-related events.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| document_id | uuid FK → documents | |
| document_version_id | uuid FK → document_versions | Nullable |
| event_type | text NOT NULL | `uploaded`, `parsed`, `override`, `archived` |
| actor_id | uuid | |
| actor_type | text | `user`, `external`, `system` |
| metadata | jsonb DEFAULT '{}' | |
| created_at | timestamptz | |

**Indexes**: `document_id`, `organization_id`

---

## Workflows

### workflow_templates

Reusable workflow definitions per module type.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | Null for system templates |
| module_type | text NOT NULL | e.g. `w9_collection`, `coi_tracking` |
| name | text NOT NULL | |
| description | text | |
| steps_config | jsonb NOT NULL | Step definitions |
| is_system | boolean DEFAULT false | Platform-provided template |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `module_type`, `organization_id`

---

### workflow_instances

Running workflow instances.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| template_id | uuid FK → workflow_templates | Nullable |
| type | text NOT NULL | Module workflow type |
| title | text NOT NULL | |
| status | text | `draft`, `active`, `completed`, `cancelled`, `failed` |
| owner_id | uuid | Responsible user |
| due_date | timestamptz | |
| metadata | jsonb DEFAULT '{}' | Module-specific data |
| related_document_ids | uuid[] | Linked documents |
| created_by | uuid | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `organization_id`, `(organization_id, type)`, `(organization_id, status)`, `due_date`

---

### workflow_steps

Steps within a workflow instance.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| workflow_instance_id | uuid FK → workflow_instances | |
| step_order | integer NOT NULL | |
| name | text NOT NULL | |
| step_type | text | `collect`, `review`, `approve`, `notify`, `monitor` |
| status | text | `pending`, `active`, `completed`, `skipped`, `failed` |
| config | jsonb DEFAULT '{}' | Step-specific config |
| completed_at | timestamptz | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `(workflow_instance_id, step_order)`, `organization_id`

---

### tasks

Actionable items within workflows.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| workflow_instance_id | uuid FK → workflow_instances | |
| workflow_step_id | uuid FK → workflow_steps | Nullable |
| title | text NOT NULL | |
| description | text | |
| status | text | `pending`, `in_progress`, `completed`, `cancelled`, `overdue` |
| assignee_type | text | `member`, `external` |
| assignee_member_id | uuid FK → organization_members | Nullable |
| assignee_external_id | uuid FK → external_participants | Nullable |
| due_date | timestamptz | |
| completed_at | timestamptz | |
| completed_by_type | text | `user`, `external`, `system` |
| completed_by_id | uuid | |
| metadata | jsonb DEFAULT '{}' | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `organization_id`, `(organization_id, status)`, `workflow_instance_id`, `due_date`

---

### task_assignments

Assignment history for tasks.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| task_id | uuid FK → tasks | |
| assignee_type | text | `member`, `external` |
| assignee_id | uuid NOT NULL | Member or external participant ID |
| assigned_by | uuid | |
| assigned_at | timestamptz DEFAULT now() | |
| created_at | timestamptz | |

**Indexes**: `task_id`, `organization_id`

---

## External Access

### external_participants

Non-account holders who interact via magic links.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| email | text NOT NULL | |
| name | text | |
| company | text | |
| metadata | jsonb DEFAULT '{}' | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `(organization_id, email)`, `organization_id`

---

### magic_links

Secure tokens for external participant access.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| external_participant_id | uuid FK → external_participants | |
| workflow_instance_id | uuid FK → workflow_instances | |
| task_id | uuid FK → tasks | |
| token_hash | text UNIQUE NOT NULL | SHA-256 hash |
| purpose | text NOT NULL | e.g. `w9_submit`, `coi_upload`, `sign_document` |
| expires_at | timestamptz NOT NULL | |
| max_uses | integer DEFAULT 1 | 1 = single-use |
| use_count | integer DEFAULT 0 | |
| used_at | timestamptz | First use timestamp |
| revoked_at | timestamptz | |
| revoked_by | uuid | |
| created_by | uuid | Internal user who created |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `token_hash`, `(organization_id, task_id)`, `expires_at`, `(expires_at) WHERE revoked_at IS NULL`

---

## Monitoring

### monitors

Scheduled monitoring rules.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| name | text NOT NULL | |
| monitor_type | text NOT NULL | e.g. `coi_expiration`, `contract_renewal` |
| target_type | text | Entity type being monitored |
| target_id | uuid | Entity ID |
| workflow_instance_id | uuid FK → workflow_instances | Nullable |
| config | jsonb DEFAULT '{}' | Monitor-specific config |
| status | text | `active`, `paused`, `completed`, `cancelled` |
| next_run_at | timestamptz | |
| last_run_at | timestamptz | |
| created_by | uuid | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `organization_id`, `(organization_id, status)`, `next_run_at WHERE status = 'active'`

---

### monitor_runs

Log of every monitor execution.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| monitor_id | uuid FK → monitors | |
| status | text | `success`, `failure`, `skipped` |
| result | jsonb DEFAULT '{}' | Run output |
| error_message | text | |
| started_at | timestamptz | |
| completed_at | timestamptz | |
| created_at | timestamptz | |

**Indexes**: `monitor_id`, `(monitor_id, started_at)`, `organization_id`

---

### reminder_rules

Timing rules for reminders associated with monitors.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| monitor_id | uuid FK → monitors | |
| days_before | integer NOT NULL | Days before deadline to remind |
| reminder_type | text | `email`, `in_app` |
| is_active | boolean DEFAULT true | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `monitor_id`, `organization_id`

---

## Notifications

### notifications

All notification records (email and in-app).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| recipient_type | text | `member`, `external` |
| recipient_id | uuid | Member or external participant ID |
| recipient_email | text NOT NULL | |
| channel | text | `email`, `in_app` |
| template_key | text NOT NULL | Template identifier |
| subject | text | |
| status | text | `pending`, `sent`, `failed`, `cancelled` |
| metadata | jsonb DEFAULT '{}' | Template variables |
| sent_at | timestamptz | |
| retry_count | integer DEFAULT 0 | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `organization_id`, `(status) WHERE status = 'pending'`, `recipient_email`

---

### email_events

Detailed email delivery tracking.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| notification_id | uuid FK → notifications | |
| resend_id | text | Resend message ID |
| status | text | `sent`, `delivered`, `bounced`, `failed` |
| error_message | text | |
| sent_at | timestamptz | |
| created_at | timestamptz | |

**Indexes**: `notification_id`, `organization_id`, `resend_id`

---

## Audit

### audit_logs

Append-only audit trail. See [AUDIT_LOGGING.md](./AUDIT_LOGGING.md).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| actor_type | text NOT NULL | `user`, `external`, `system` |
| actor_id | uuid | |
| actor_email | text | |
| action | text NOT NULL | e.g. `document.created` |
| target_type | text | Entity type |
| target_id | uuid | Entity ID |
| metadata | jsonb DEFAULT '{}' | |
| correlation_id | uuid | Request trace ID |
| ip_address | inet | |
| user_agent | text | |
| created_at | timestamptz DEFAULT now() | Immutable |

**Indexes**: `organization_id`, `(organization_id, created_at DESC)`, `(organization_id, action)`, `correlation_id`

**RLS**: Readable by members with `audit.view`. INSERT only (no UPDATE/DELETE for normal users).

---

## Billing

### products

Platform product/module definitions.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| key | text UNIQUE NOT NULL | e.g. `w9_collector`, `coi_tracker` |
| name | text NOT NULL | |
| description | text | |
| stripe_product_id | text | |
| stripe_price_id | text | |
| is_active | boolean DEFAULT true | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

### subscriptions

Organization subscription records.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| stripe_subscription_id | text UNIQUE | |
| stripe_customer_id | text | |
| status | text | `active`, `past_due`, `cancelled`, `trialing` |
| current_period_start | timestamptz | |
| current_period_end | timestamptz | |
| cancel_at | timestamptz | |
| metadata | jsonb DEFAULT '{}' | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `organization_id`, `stripe_subscription_id`

---

### organization_entitlements

Module access per organization.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| product_id | uuid FK → products | |
| is_enabled | boolean DEFAULT true | |
| enabled_at | timestamptz | |
| disabled_at | timestamptz | |
| source | text | `subscription`, `trial`, `manual` |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `(organization_id, product_id)` UNIQUE, `organization_id`

---

## System

### background_jobs

Simple job queue (MVP). Future: BullMQ/Redis.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| organization_id | uuid FK → organizations | Nullable for system jobs |
| job_type | text NOT NULL | e.g. `document_processing`, `notification_send` |
| payload | jsonb NOT NULL | Job-specific data |
| status | text | `pending`, `processing`, `completed`, `failed` |
| priority | integer DEFAULT 0 | Higher = sooner |
| attempts | integer DEFAULT 0 | |
| max_attempts | integer DEFAULT 3 | |
| error_message | text | |
| scheduled_at | timestamptz DEFAULT now() | |
| started_at | timestamptz | |
| completed_at | timestamptz | |
| idempotency_key | text UNIQUE | Prevent duplicate processing |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `(status, scheduled_at) WHERE status = 'pending'`, `job_type`, `idempotency_key`, `organization_id`

---

### webhook_events

Stripe and other webhook event log.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| source | text NOT NULL | `stripe`, etc. |
| event_id | text UNIQUE NOT NULL | External event ID |
| event_type | text NOT NULL | |
| payload | jsonb NOT NULL | Raw event data |
| status | text | `received`, `processed`, `failed` |
| error_message | text | |
| processed_at | timestamptz | |
| created_at | timestamptz | |

**Indexes**: `event_id`, `(source, event_type)`, `status`

---

## RLS Helper Functions

```sql
-- Returns the authenticated user's ID
auth.uid()

-- Check if current user is a member of the given organization
is_org_member(org_id uuid) → boolean

-- Check if current user has a specific permission in the organization
has_permission(org_id uuid, permission_key text) → boolean
```

## RLS Policy Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| organizations | is_org_member | authenticated (create own) | has_permission('organization.manage') | has_permission('organization.manage') |
| organization_members | is_org_member | has_permission('members.invite') | has_permission('members.manage') | has_permission('members.manage') |
| documents | has_permission('documents.view') | has_permission('documents.create') | has_permission('documents.update') | has_permission('documents.delete') |
| document_versions | has_permission('documents.view') | has_permission('documents.create') | service role only | none |
| workflow_instances | has_permission('workflows.view') | has_permission('workflows.create') | has_permission('workflows.update') | has_permission('workflows.update') |
| tasks | has_permission('workflows.view') | has_permission('workflows.create') | has_permission('workflows.update') | has_permission('workflows.update') |
| monitors | has_permission('monitors.view') | has_permission('monitors.manage') | has_permission('monitors.manage') | has_permission('monitors.manage') |
| audit_logs | has_permission('audit.view') | authenticated (insert only) | none | none |
| magic_links | service role only | has_permission('workflows.create') | service role only | has_permission('workflows.update') |
| notifications | is_org_member (own) | system/service role | system/service role | none |
| subscriptions | has_permission('billing.manage') | service role | service role | none |
| background_jobs | service role only | service role / authenticated | service role only | none |

---

*Schema v1 — platform foundation.*
