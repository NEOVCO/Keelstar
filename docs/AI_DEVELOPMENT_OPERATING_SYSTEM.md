# Keelstar AI Development Operating System

> **Purpose:** Keep every AI coding session tidy, consistent, secure, and aligned with product vision — even when the founder is non-technical.
>
> **Status:** Mandatory for all AI agents (Cursor, Claude, Copilot, etc.) working on this repository.
>
> **Rule:** If this document conflicts with a casual instruction in chat, **this document wins** unless the founder explicitly overrides it for that session.

---

## How to use this file

Paste this into any new AI session:

```
Read /docs/AI_DEVELOPMENT_OPERATING_SYSTEM.md first.
Follow it strictly for this entire session.
Do not start coding until you complete the required reading order.
```

Every AI session must end with the **Founder Report** (Section 13) and **Definition of Done checklist** (Section 10).

---

## 1. Required reading order (before any task)

Read in this order. Do not skip steps. Do not write code until Step 7 is complete.

| Step | Document | What you learn |
|------|----------|----------------|
| 1 | [DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md) | **Project law** — non-negotiable engineering rules |
| 2 | [NORTH_STAR.md](./NORTH_STAR.md) + [PRODUCT_MODULES.md](./PRODUCT_MODULES.md) | **Product brief** — what Keelstar is, is not, and which modules exist |
| 3 | [ARCHITECTURE.md](./ARCHITECTURE.md) | **System design** — Next.js, Supabase, workers, integrations |
| 4 | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | **Data model** — tables, RLS, indexes, tenant boundaries |
| 5 | [PRODUCT_EXPANSION_PLAYBOOK.md](./PRODUCT_EXPANSION_PLAYBOOK.md) §8 + app UI patterns | **UI/UX guidelines** — required pages, states, design principles |
| 6 | [RBAC.md](./RBAC.md) + [MAGIC_LINKS.md](./MAGIC_LINKS.md) + [AUDIT_LOGGING.md](./AUDIT_LOGGING.md) | **Security & permissions** — roles, external access, audit |
| 7 | Relevant vertical spec (if module work) | **Module contract** — see below |

### Document name mapping

The founder may refer to these aliases. Use the actual repo paths:

| Common alias | Actual file(s) |
|--------------|----------------|
| `PROJECT_RULES.md` | [DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md) |
| `PRODUCT_BRIEF.md` | [NORTH_STAR.md](./NORTH_STAR.md) + [PRODUCT_MODULES.md](./PRODUCT_MODULES.md) |
| `DATA_MODEL.md` | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) |
| `UI_UX_GUIDELINES.md` | [PRODUCT_EXPANSION_PLAYBOOK.md](./PRODUCT_EXPANSION_PLAYBOOK.md) §8 + existing Tailwind tokens in `tailwind.config.ts` |
| `SECURITY_AND_PERMISSIONS.md` | [RBAC.md](./RBAC.md) + [MAGIC_LINKS.md](./MAGIC_LINKS.md) + [AUDIT_LOGGING.md](./AUDIT_LOGGING.md) |
| Vertical slice spec | `/docs/modules/[module-slug]/MODULE_SPEC.md` |

### When to read additional docs

| Task type | Also read |
|-----------|-----------|
| New module or module feature | [PRODUCT_EXPANSION_PLAYBOOK.md](./PRODUCT_EXPANSION_PLAYBOOK.md) (full) |
| Platform foundation work | [TASKS_TO_COMPLETE.md](./TASKS_TO_COMPLETE.md) |
| Deployment / infra | [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) |
| Magic link / external flows | [MAGIC_LINKS.md](./MAGIC_LINKS.md) |
| Billing / Stripe | [ARCHITECTURE.md](./ARCHITECTURE.md) billing section + `src/lib/stripe/` |

### Vertical slice spec rule

**No module feature may be built without a module spec.**

Path: `/docs/modules/[module-slug]/MODULE_SPEC.md`

If the spec does not exist, the AI must **create a draft spec first** using the template in [PRODUCT_EXPANSION_PLAYBOOK.md](./PRODUCT_EXPANSION_PLAYBOOK.md) §5 — then wait for founder approval before implementing.

---

## 2. AI behavior rules

These rules are **strict**. Violating any rule is a session failure.

### Never

| Rule | Why |
|------|-----|
| **Make broad unrequested changes** | Scope creep breaks trust and introduces risk |
| **Refactor unrelated files** | Every changed file must trace to the task |
| **Invent product scope** | Product decisions belong to the founder + docs |
| **Create duplicate systems** | One auth path, one email path, one queue path |
| **Bypass tenant isolation** | `organization_id` + RLS on every tenant query |
| **Hardcode secrets** | Keys live in environment variables only |
| **Skip error states** | Empty, loading, error, success are mandatory |
| **Add dependencies without justification** | Each new package is maintenance debt |
| **Commit unless explicitly asked** | Founder controls git history |
| **Delete marketing pages or docs without approval** | Existing site is production-facing |
| **Create product-specific DB tables by default** | Shared primitives first ([PRODUCT_EXPANSION_PLAYBOOK.md](./PRODUCT_EXPANSION_PLAYBOOK.md) §6) |
| **Create external participant user accounts** | Magic links only |
| **Expose storage files publicly** | Signed URLs only |
| **Skip audit logging for important actions** | Compliance is core product value |
| **Hardcode module lists in multiple files** | Use `src/lib/modules/modules.ts` |

### Always

| Rule | How |
|------|-----|
| **Explain assumptions** | State what you inferred vs what was specified |
| **List changed files** | Every response with code changes includes a file list |
| **Scope narrowly** | Smallest diff that solves the request |
| **Match existing conventions** | Read surrounding code before writing |
| **Validate inputs with Zod** | All API routes and server actions |
| **Use `requireOrganization()` / `requirePermission()`** | All server-side tenant operations |
| **Flag high-risk changes** | See Section 11 (Change control) |
| **End with Founder Report** | See Section 13 |

---

## 3. Task execution process

For **every task**, follow these steps in order. Do not skip.

### Step 1 — Understand the request

- Restate the task in one sentence.
- Identify: bug fix, platform foundation, module feature, docs-only, or infra.
- If ambiguous, ask **one** focused clarifying question — not five.

### Step 2 — Check relevant docs

- Complete Section 1 reading order for this task type.
- Quote or reference the doc section that governs the work.

### Step 3 — Identify impacted areas

List explicitly:

- Routes / pages affected
- API routes affected
- Lib modules affected
- Database / migrations affected (yes/no)
- Workers affected
- Docs affected
- Tests affected

### Step 4 — Produce a short plan

Before writing code, output:

```
Plan (max 8 bullets):
1. ...
2. ...
Assumptions:
- ...
Out of scope for this task:
- ...
```

Wait for founder approval if the task touches Section 11 change-control areas.

### Step 5 — Implement narrowly

- One concern per change set.
- No drive-by refactors.
- No new abstractions unless repeated 3+ times already in codebase.

### Step 6 — Verify

- Run `npm test` if tests exist for changed area.
- Run `npm run build` if routes, types, or imports changed.
- If tests cannot run, provide **manual test steps** (Section 13).

### Step 7 — Update docs if needed

Update docs when you change:

- Architecture, schema, permissions, or module behavior
- Environment variables (always update `.env.example`)
- New module (create/update MODULE_SPEC.md)

Do **not** create docs the founder did not ask for.

### Step 8 — Summarize

End every coding session with Founder Report (Section 13) + Definition of Done (Section 10).

---

## 4. Folder and file discipline

All new code must go in the correct location. Do not invent parallel structures.

### App routes — `src/app/`

| Path | Purpose |
|------|---------|
| `src/app/(app)/` | Protected app (dashboard, documents, modules, settings) |
| `src/app/(auth)/` | Login, signup, onboarding |
| `src/app/external/[token]/` | Magic link external participant flows |
| `src/app/api/` | API route handlers |
| `src/app/tools/` | Free utility tools (marketing / lead gen) |
| `src/app/` (root) | Marketing site (existing — do not break) |

**Rules:**
- Route groups `(app)`, `(auth)` do not affect URLs.
- New module pages: `src/app/(app)/[slug]/` or use dynamic `[slug]` with registry in `modules.ts`.
- One `layout.tsx` per route group — do not nest unnecessary layouts.

### Components — `src/components/`

| Path | Purpose |
|------|---------|
| `src/components/ui/` | Reusable UI primitives (Button, Card, Badge, Input) |
| `src/components/layout/` | AppSidebar, AppShell, marketing Header/Footer |
| `src/components/forms/` | Form components including external participant forms |
| `src/components/workflows/` | Workflow and module-specific UI |
| `src/components/documents/` | Document upload, version list, parsed fields (when built) |
| `src/components/audit/` | Audit timeline, export (when built) |
| `src/components/billing/` | Subscription, entitlements (when built) |

**Rules:**
- Do not create `src/components/MyModule/` until 3+ components belong there.
- Prefer extending existing UI components over creating new primitives.
- Marketing components stay in existing locations — do not move without approval.

### Server actions / API routes

| Path | Purpose |
|------|---------|
| `src/app/api/[resource]/route.ts` | REST-style API handlers |
| `src/app/api/[resource]/[id]/route.ts` | Resource by ID |
| Server actions (future) | Co-locate in `src/lib/[domain]/actions.ts` if used |

**Rules:**
- Every API route: auth check → org context → permission check → Zod validation → handler → audit log.
- Use `handleApiError()` from `src/lib/errors/api.ts`.
- Return consistent shape: `{ success: true, data }` or `{ success: false, error, code }`.

### Database queries

| Path | Purpose |
|------|---------|
| `src/lib/supabase/server.ts` | User-scoped client (RLS applies) |
| `src/lib/supabase/service.ts` | Service role (workers, audit insert, webhooks only) |
| `src/lib/[domain]/` | Domain logic (documents, workflow, tenant, etc.) |
| `supabase/migrations/` | Forward-only SQL migrations |

**Rules:**
- App routes use server client — never service role in user-facing routes unless justified.
- All tenant queries include `organization_id` filter.
- No raw SQL in components or pages.

### Auth — `src/lib/supabase/`, `src/lib/tenant/`

| File | Purpose |
|------|---------|
| `src/lib/supabase/middleware.ts` | Session refresh, route protection |
| `src/lib/tenant/context.ts` | `requireOrganization()`, `requirePermission()`, org switcher cookie |
| `src/middleware.ts` | Next.js middleware entry |

**Rules:**
- Active org cookie: `keelstar_active_org`.
- Never assume one user = one organization.

### Permissions — `src/lib/rbac/`

| File | Purpose |
|------|---------|
| `permissions.ts` | Permission key constants — single source of truth |
| `roles.ts` | Role definitions and role→permission map |
| `types.ts` | Auth context types, `can()` helpers |

**Rules:**
- Never hardcode permission strings in pages — import from `permissions.ts`.
- New permissions require: DB seed update + `permissions.ts` + `roles.ts` + docs.

### Emails — `src/lib/email/`

| Path | Purpose |
|------|---------|
| `sendEmail.ts` | Send and queue helpers |
| `templates/` (target) | One file per template — migrate from inline when touched |

**Rules:**
- Every send creates notification + email_event + audit log.
- No direct Resend calls outside `sendEmail.ts`.

### Background jobs — `workers/` + `src/lib/`

| Path | Purpose |
|------|---------|
| `workers/document-processing/` | Document extraction worker |
| `workers/monitor-runner/` | Daily monitor cron |
| `workers/notification-sender/` | Email delivery worker |
| `workers/external-link-cleanup/` | Magic link expiry worker |
| `background_jobs` table | Job queue (MVP) |

**Rules:**
- Workers use service role client.
- Every job must be idempotent (`idempotency_key`).
- Workers are separate processes — no long-running jobs in Next.js web process.

### Shared utilities — `src/lib/utils/`, `src/lib/validation/`

| Path | Purpose |
|------|---------|
| `src/lib/utils/` | `cn()`, dates, slugify, sanitizeFilename |
| `src/lib/validation/schemas.ts` | Zod schemas for API inputs |
| `src/lib/errors/` | API errors, rate limiting |

### Types

- Co-locate types with domain modules (`src/lib/rbac/types.ts`).
- Generate Supabase types into `src/lib/supabase/database.types.ts` when CLI is set up.
- No giant global `types.ts` dump.

### Tests — `tests/`

| Path | Purpose |
|------|---------|
| `tests/platform.test.ts` | Unit tests (RBAC, magic links, audit, utils) |
| `tests/integration/` (target) | Supabase-backed integration tests |

**Rules:**
- Add unit tests for security-critical paths when touching RBAC, magic links, tenant isolation.
- Run `npm test` before declaring done.

### Module registry — `src/lib/modules/modules.ts`

**Single source of truth** for module metadata. All navigation, billing, and marketing module references read from here.

---

## 5. Product guardrails

### Current MVP scope (platform foundation)

**In scope — platform shared by all modules:**

- Multi-tenant organizations, members, RBAC
- Documents + versions + parsed fields + placeholder extraction
- Workflow instances, tasks, magic links
- Monitors, reminders, notifications (basic)
- Audit logging (append-only)
- Stripe webhook + entitlements (basic)
- App shell: dashboard, documents, workflows, tasks, monitors, audit, settings, billing
- Module shells for all 10 modules (UI placeholders)
- Background workers (document, monitor, notification, cleanup)
- Marketing site (existing — preserve)

**In scope — per module (not yet built):**

- End-to-end vertical slices per [PRODUCT_EXPANSION_PLAYBOOK.md](./PRODUCT_EXPANSION_PLAYBOOK.md)
- Each requires approved `MODULE_SPEC.md` first

### Explicitly out of scope (do not build unless founder explicitly requests)

| Feature | Why |
|---------|-----|
| Full ERP / accounting system | Keelstar is workflow slices, not ERP |
| Full HRIS | Policy + Training modules are the narrow slices |
| Full CLM | Contract Renewal + Risk Scanner are the narrow slices |
| Generic project management / kanban | Tasks drive compliance, not arbitrary PM |
| AI chatbot as product | AI assists extraction only |
| Real-time collaboration / chat | Not platform priority |
| Mobile native apps | Web-first; external flows must be mobile-friendly |
| Multi-region / microservices | Modular monolith until proven necessary |
| IRS TIN verification, 1099 filing | W-9 module exclusions |
| Live carrier verification API | COI module exclusions |
| DocuSign-level e-sign compliance | Simple Signer is lightweight |

Full per-module exclusions: [PRODUCT_MODULES.md](./PRODUCT_MODULES.md) and each `MODULE_SPEC.md`.

### Rules for adding new features

1. Feature must map to Collect → Extract → Approve → Monitor → Notify → Audit.
2. Feature must be in MVP scope of relevant `MODULE_SPEC.md` OR founder explicitly approves scope expansion.
3. Feature must reuse shared primitives (Section 6 of playbook).
4. Feature must not duplicate existing platform capability.
5. Update docs in same PR/session as code.

### Rules for changing existing workflows

1. State what behavior changes for existing users.
2. Flag as change-control (Section 11).
3. Prefer additive changes (new column, new status) over breaking changes.
4. Database changes require forward migration only.
5. Update MODULE_SPEC.md and audit event list if workflow steps change.

---

## 6. Security guardrails

Non-negotiable. Violation = stop and report to founder.

### Multi-tenant isolation

- Every tenant table has `organization_id NOT NULL`.
- RLS enabled on every tenant table.
- Every server handler calls `requireOrganization()` or equivalent.
- Never trust client-provided `organization_id` without membership verification.
- Integration tests must verify Org A cannot access Org B data.

### Role-based access

- Permissions defined in `src/lib/rbac/permissions.ts` only.
- Server-side enforcement required — client hiding is not security.
- External participants are not RBAC users — magic link scope only.

### External magic links

- Store SHA-256 hash only — never raw token in database.
- Default single-use, 7-day expiry.
- External pages: task only, no app navigation, no org data leak.
- Rate limit validation endpoints.
- See [MAGIC_LINKS.md](./MAGIC_LINKS.md).

### File access

- Private Supabase Storage bucket only.
- Signed URLs with short expiry (default 1 hour).
- Validate MIME type and size on upload (25 MB default).
- Sanitize filenames — no path traversal.
- Never log document contents.

### Audit logs

- Append-only — no UPDATE/DELETE on `audit_logs`.
- Important actions must call `createAuditLog()`.
- See [AUDIT_LOGGING.md](./AUDIT_LOGGING.md) for required events.

### Environment variables

- Secrets in `.env.local` / Render env — never in code or git.
- Update `.env.example` when adding new vars — no real values.
- Never commit `.env`, `.env.local`, or keys.

### Input validation

- Zod schemas for all API inputs in `src/lib/validation/schemas.ts`.
- Reject unknown fields where strictness matters.
- No raw user input in SQL or storage paths.

### Rate limiting

- Apply to: auth, magic link validation, file upload, invitation endpoints.
- Use `src/lib/errors/rate-limit.ts` (MVP in-memory; document if adding Redis).

### Sensitive data handling

- Do not log: passwords, tokens, document contents, TIN/SSN field values.
- Audit metadata may reference field keys, not PII values.
- Emails must not leak sensitive data — org name + task description only.

---

## 7. Database guardrails

### Migrations

| Rule | Detail |
|------|--------|
| **No schema change without migration** | SQL file in `supabase/migrations/` |
| **Forward-only** | Never edit a deployed migration — create new one |
| **Naming** | `NNN_descriptive_name.sql` (e.g. `004_w9_vendor_metadata.sql`) |
| **Destructive changes** | Explicit founder warning before DROP COLUMN/TABLE |
| **RLS included** | Every new tenant table has RLS policies in same or follow-up migration |

### Tenant ownership

- Every tenant table: `organization_id uuid NOT NULL REFERENCES organizations(id)`.
- System tables (roles, permissions, products) are exceptions — document if adding new system table.

### Naming conventions

| Element | Convention | Example |
|---------|------------|---------|
| Tables | snake_case, plural | `workflow_instances` |
| Columns | snake_case | `organization_id`, `created_at` |
| Enums / status | snake_case strings | `'pending'`, `'in_progress'` |
| Indexes | `idx_[table]_[columns]` | `idx_documents_org` |
| Foreign keys | `[table]_[col]_fkey` | auto-generated OK |

### Indexing expectations

- Index all foreign keys used in queries.
- Index `(organization_id)` on every tenant table.
- Index common filters: `(organization_id, status)`, `(organization_id, created_at DESC)`.
- Partial indexes for worker polls: `WHERE status = 'pending'`.

### Audit log expectations

- Audit tables are insert-only for app code.
- New features must add audit events to MODULE_SPEC §17 before implementation.

---

## 8. UI/UX guardrails

### Design system

- Use existing Tailwind tokens from `tailwind.config.ts` (colors: `bg`, `surface`, `ink`, `accent`, etc.).
- Use components from `src/components/ui/` — do not introduce new UI libraries without approval.
- Typography: existing scale (`text-h1`, `text-body-sm`, `text-caption`, etc.).
- Inspiration level: Stripe, Linear, Mercury — not generic AI SaaS templates.

### No new visual style without approval

- No new color palettes, fonts, or illustration styles.
- No gradients, glassmorphism, or "AI slop" aesthetics.
- shadcn/ui components OK if installed via existing pattern — match current tokens.

### Required states (every data-fetching screen)

| State | Required UI |
|-------|-------------|
| **Empty** | Message + primary CTA |
| **Loading** | Skeleton or spinner — never blank screen |
| **Error** | Human-readable message + recovery action |
| **Success** | Confirmation for destructive/create actions |

### Responsive behavior

- App shell: desktop-first sidebar layout.
- External magic link pages: **mobile-first** (vendors sign on phones).
- Marketing pages: preserve existing responsive behavior.

### Accessibility basics

- Semantic HTML (`button` not `div` for clicks).
- Form labels on all inputs.
- Focus states visible (existing ring styles).
- External flows: readable without color-only status indicators.

### Consistent wording

| Use | Avoid |
|-----|-------|
| Organization | Tenant, workspace (in UI) |
| Workflow | Process, pipeline (unless module-specific) |
| Document | File (in app UI; "file" OK in upload copy) |
| Monitor | Cron, job (in user-facing UI) |
| Module | Product, app (either is OK; pick one per screen) |

Tone: professional, plain, concise. No hype, no emoji in app UI.

---

## 9. Vertical slice rules

Every new module (or major module feature) must be built **end-to-end** — not UI-only or API-only stubs.

### Required layers

| Layer | Must include |
|-------|--------------|
| **Database** | Uses shared tables + metadata; migration only if MODULE_SPEC §11 justifies |
| **Permissions** | MODULE_SPEC §13 matrix enforced server-side |
| **UI** | Module home, list, detail, create flow minimum |
| **Business logic** | Service functions in `src/lib/[domain]/` |
| **Email/notification** | If module sends emails — template + logging |
| **Audit log** | Every action in MODULE_SPEC §17 wired |
| **Tests / manual QA** | MODULE_SPEC §26 checklist completed |

### Build order

Follow [PRODUCT_EXPANSION_PLAYBOOK.md](./PRODUCT_EXPANSION_PLAYBOOK.md) §20:

1. Module spec approved
2. Backend + permissions
3. UI wired to real API
4. External flow (if applicable)
5. Monitors + reminders
6. QA checklist

**Do not ship UI shells that look done but call no real APIs.**

---

## 10. Definition of Done

**Copy this checklist into the end of every AI coding response** that involves code changes. Mark each item ✅ or N/A with one-line reason.

```
## Definition of Done

- [ ] Task matches requested scope — no unrequested changes
- [ ] Relevant docs read before implementation
- [ ] Tenant isolation preserved (organization_id + RLS + server checks)
- [ ] Permissions enforced server-side where applicable
- [ ] Inputs validated with Zod where applicable
- [ ] Error, empty, and loading states handled (UI tasks)
- [ ] Audit events added for important actions (if applicable)
- [ ] No secrets, PII, or document contents in logs
- [ ] No new dependencies without stated justification
- [ ] `npm test` run (result: pass / fail / N/A)
- [ ] `npm run build` run if routes/types changed (result: pass / fail / N/A)
- [ ] Docs updated if behavior/schema/permissions changed
- [ ] Changed files listed in Founder Report
- [ ] Manual test steps provided (if automated tests N/A)
- [ ] Change-control flags stated (if any — Section 11)
```

---

## 11. Change control

The AI **must stop and explicitly flag** before implementing when a request affects any of these areas. Ask founder to confirm.

| Area | Flag message template |
|------|----------------------|
| **Architecture** | "This changes platform architecture: [describe]. Confirm before proceeding." |
| **Database schema** | "This requires a new migration affecting [tables]. Destructive: yes/no. Confirm." |
| **Auth** | "This changes authentication/session flow: [describe]. Confirm." |
| **Permissions** | "This adds/changes roles or permissions: [list]. Confirm." |
| **Billing** | "This affects Stripe, entitlements, or pricing: [describe]. Confirm." |
| **External user access** | "This changes magic link or external participant behavior: [describe]. Confirm." |
| **File storage** | "This changes storage paths, bucket policy, or upload limits: [describe]. Confirm." |
| **Production data** | "This migration/backfill affects live data. Confirm and plan rollback." |

For flagged changes: produce plan first, wait for approval, then implement.

---

## 12. Anti-mess rules

Prevent codebase decay. AI sessions are the primary contributors — enforce discipline.

### Duplicated components

- Before creating a component, search `src/components/` for existing similar UI.
- Extract to shared component only after 3rd duplication — not on first reuse.

### Multiple competing patterns

- One way to send email (`sendEmail.ts`).
- One way to audit (`createAuditLog.ts`).
- One way to check permissions (`requirePermission()`).
- One module registry (`modules.ts`).
- Do not introduce parallel patterns "because it's cleaner" mid-session.

### Abandoned files

- Do not create placeholder files with TODO that are never wired up in same session.
- If creating a route, it must render real content or intentional empty state — not `return null`.

### Inconsistent naming

- Follow Section 7 naming conventions.
- Module slugs match `modules.ts` (`w9`, `coi`, `contracts` — not mixed).
- API routes: plural nouns (`/api/documents`, not `/api/document`).

### Dead code

- Do not comment out large blocks — delete if truly unused (founder approval if unsure).
- Do not leave unused imports or exports.

### Over-engineering

- No abstract factories for single use cases.
- No premature microservices.
- No event bus unless worker queue proves insufficient.
- Prefer boring, readable code over clever abstractions.

### Premature abstraction

- Rule of three: duplicate twice, abstract on third occurrence.
- `metadata jsonb` before new tables.
- Shared workflow engine before module-specific workflow tables.

---

## 13. Founder-friendly output format

**Every AI coding response must end with this report.** Plain English. No jargon without explanation.

```
---
## Founder Report

### What changed
[1–3 sentences: what the codebase does differently now]

### Why it changed
[1–2 sentences: connects to product goal or bug fix]

### Files changed
- path/to/file.ts — [one line: what changed]
- path/to/other.tsx — [one line: what changed]

### What to test
1. [Step-by-step: go to X, click Y, expect Z]
2. [...]

### Risks and assumptions
- Risk: [what could go wrong]
- Assumption: [what I guessed that you should verify]

### Docs updated
- [file] / None

### Change-control flags
- [Architecture / Schema / Auth / etc.] — [yes/no, details]

### Definition of Done
[Copy checklist from Section 10 with ✅ or N/A]
---
```

### Language rules for founder report

- Explain acronyms first time (RLS = row-level security, blocks cross-company data leaks).
- Say "company workspace" not just "organization" if clearer in context.
- Say "vendor upload link" not "magic link token validation endpoint" unless technical detail requested.
- Be honest about partial completion — do not claim "done" if QA items remain.

---

## Quick reference card

```
READ FIRST:  DEVELOPMENT_RULES → NORTH_STAR → ARCHITECTURE → DATABASE_SCHEMA
             → PLAYBOOK §8 → RBAC + MAGIC_LINKS + AUDIT
             → MODULE_SPEC (if module work)

NEVER:       broad changes | skip RLS | hardcode secrets | invent scope
             | duplicate systems | skip error states | commit unasked

ALWAYS:      narrow diff | list files | audit important actions
             | Zod validation | requireOrganization() | Founder Report

MODULE WORK: MODULE_SPEC approved → end-to-end slice → QA checklist

END EVERY SESSION WITH: Founder Report + Definition of Done
```

---

*AI Development Operating System v1 — Keelstar. Paste into every new AI session.*
