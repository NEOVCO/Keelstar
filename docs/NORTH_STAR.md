# Keelstar North Star

> **This document is the guiding constitution for every architectural, product, and engineering decision on Keelstar. When in doubt, return here.**

---

## What Keelstar Is

Keelstar is a **multi-product B2B SaaS platform** that hosts many focused workflow applications under one shared foundation. Each app solves one recurring business workflow very well — W-9 collection, COI tracking, contract renewals, exclusion monitoring, vendor packets, policy acknowledgements, training records, invoice approvals, simple signing, and future document/compliance/approval workflows.

Keelstar is **one platform, many apps**. Users belong to organizations. Organizations subscribe to modules. Every module reuses the same shared primitives: organizations, users, roles, documents, versions, parsed fields, workflows, tasks, monitors, reminders, notifications, audit logs, external links, billing, and permissions.

Every product follows the same lifecycle pattern:

```
Collect → Extract → Approve → Monitor → Notify → Audit
```

---

## What Keelstar Is Not

- **Not an all-in-one bloated enterprise suite.** We do not build a monolithic ERP. We build focused apps that share infrastructure.
- **Not a document storage product.** Documents are inputs to workflows, not the product itself.
- **Not a generic project management tool.** Tasks exist to drive compliance workflows, not arbitrary kanban boards.
- **Not an AI-first gimmick.** Extraction and scanning may use AI where it adds value, but the product is operational workflow automation, not chatbots.
- **Not a consumer app.** Keelstar is B2B, organization-first, audit-first, and enterprise-grade in tone and reliability.
- **Not a free-for-all file sharing service.** Every document, link, and action is scoped, permissioned, and audited.

---

## Product Philosophy

1. **One job, done well.** Each module has a single clear job-to-be-done. If a feature does not serve that job, it does not belong in the module.
2. **Shared primitives over duplication.** Never build product-specific infrastructure when a shared primitive can solve it.
3. **Monitoring is the business model.** Free tools attract users. Paid workflows automate collection, approval, monitoring, and reminders. The value is ongoing compliance visibility, not one-time document handling.
4. **External participants are first-class.** Vendors, contractors, and signers interact via secure magic links — no account required.
5. **Audit everything important.** If an action matters for compliance, it must be logged, exportable, and tamper-evident.
6. **Boring architecture wins.** Prefer a modular monolith plus background workers over premature microservices. A solo founder must be able to understand the entire system.

---

## Multi-Tenant Principles

- **Organization is the tenant boundary.** All tenant data is scoped to `organization_id`. There is no global tenant data accessible to org members.
- **Users can belong to multiple organizations.** Never assume one user = one org. Active organization context is always explicit.
- **No cross-tenant data leakage.** Every query, API call, storage path, and audit log must include organization context.
- **RLS is mandatory.** Row Level Security is enabled on every tenant-scoped table. Application-level checks are additive, not replacements.
- **Entitlements gate modules.** Organizations enable product modules via subscription entitlements, not hardcoded feature flags scattered through the codebase.

---

## Organization-First Architecture

```
User → Organization Membership → Role → Permissions → Module Entitlements → Workflows
```

- Users authenticate globally (Supabase Auth).
- All authorization decisions require organization context.
- Roles and permissions are organization-scoped.
- Module access is determined by entitlements on the organization.
- Workflows, documents, tasks, and monitors all belong to an organization.

---

## Shared Primitives

Every module must compose from these building blocks:

| Primitive | Purpose |
|-----------|---------|
| **Organizations** | Tenant boundary, billing entity, settings container |
| **Users & Members** | Internal actors with org membership |
| **Roles & Permissions** | Organization-scoped RBAC |
| **Documents & Versions** | Immutable document history with metadata |
| **Parsed Fields** | Extracted/overrideable key-value data from documents |
| **Workflows & Tasks** | Generic workflow engine with typed instances |
| **External Participants** | Non-account holders who interact via magic links |
| **Magic Links** | Secure, scoped, auditable external access tokens |
| **Monitors & Reminders** | Scheduled checks and deadline notifications |
| **Notifications & Email** | Delivery layer for all outbound communication |
| **Audit Logs** | Append-only record of all important actions |
| **Billing & Entitlements** | Stripe subscriptions and module access control |
| **Background Jobs** | Idempotent async processing via workers |

---

## Security Principles

1. **Defense in depth.** RLS + server-side permission checks + input validation + signed URLs.
2. **Never trust client-provided organization_id.** Always verify membership server-side.
3. **Never expose storage files publicly.** Signed URLs only, with expiration.
4. **Never create external participant accounts** unless explicitly required later.
5. **Secrets in environment variables only.** Never in code, never in client bundles.
6. **Validate all inputs with Zod.** No raw user input reaches the database.
7. **Rate limit sensitive endpoints.** Magic link validation, auth, uploads.
8. **Security headers on all responses.** CSP, HSTS, X-Frame-Options, etc.
9. **Do not log sensitive document contents.** Log metadata and actions, not file bytes.

---

## Audit-First Mindset

- Every important action produces an audit log entry.
- Audit logs are **append-only** — never updated or deleted by normal users.
- Audit logs are **tenant-scoped** and exportable by admins/managers.
- Audit entries include: actor, actor type, action, target, timestamp, IP, user agent, metadata, correlation ID, organization ID.
- If you cannot audit it, reconsider whether the feature belongs in Keelstar.

---

## Document-First Mindset

- Documents are versioned. Re-upload creates a new version; history is preserved.
- Every upload creates audit events.
- Parsed fields are generic (key/value with type, confidence, source).
- User overrides of parsed values are audited.
- Storage paths follow: `organizations/{org_id}/documents/{doc_id}/versions/{version}/{filename}`.
- Document status lifecycle: `uploaded → processing → parsed | failed`.

---

## Monitoring-First Business Model

```
Free Tool (lead gen) → Paid Workflow (automation) → Monitor (retention) → Notify (engagement)
```

- **Free tools** solve a single task once (generate a W-9 request, analyze a COI, extract renewal dates).
- **Paid workflows** automate recurring collection, approval chains, and tracking.
- **Monitors** watch deadlines and compliance status continuously.
- **Notifications** drive action before things become problems.

This is how Keelstar creates recurring value and justifies subscription pricing per module.

---

## External Magic-Link Participant Philosophy

- External participants (vendors, contractors, signers) **never get normal accounts**.
- They access exactly one scoped task via a secure, hashed, expiring token.
- Magic links are single-use by default; multi-session links are explicit opt-in.
- External routes show only the specific task — no app navigation, no org data beyond what is required.
- Every magic link creation, use, and revocation is audited.
- Resend and revocation are first-class operations.

---

## Development Rules (Summary)

Every future feature **must** follow these rules. Full details in `/docs/DEVELOPMENT_RULES.md`.

1. Every tenant table must have `organization_id`.
2. Every tenant table must have RLS enabled.
3. Never query tenant data without organization context.
4. Never expose storage files without signed URLs.
5. Never create external participant user accounts unless explicitly required.
6. Never skip audit logging for important actions.
7. Never implement a product-specific primitive if a shared primitive can solve it.
8. Every background job must be idempotent.
9. Every email send must be logged.
10. Every document update must create a new version.
11. Every monitor/reminder action must be auditable.
12. Prefer simple, boring, maintainable architecture over clever abstractions.

---

## Decision Framework

When building any feature, ask:

1. Does this serve one focused workflow job-to-be-done?
2. Can an existing shared primitive handle this?
3. Is it organization-scoped with RLS?
4. Is the action audited?
5. Does it follow Collect → Extract → Approve → Monitor → Notify → Audit?
6. Can a solo founder understand and maintain this in six months?

If any answer is "no," stop and redesign before writing code.

---

*Last updated: platform foundation v1. Keelstar is one shared SaaS platform made of many focused apps.*
