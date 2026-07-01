# Keelstar Development Rules

> **This document is mandatory project law.** Every contributor, every AI agent, every future feature must follow these rules without exception. When in doubt, refer to [NORTH_STAR.md](./NORTH_STAR.md).

---

## Tenant Isolation

1. **Every tenant table must have `organization_id`.** No exceptions. If data belongs to an organization, it has `organization_id uuid NOT NULL REFERENCES organizations(id)`.

2. **Every tenant table must have RLS enabled.** `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` on every tenant-scoped table. No exceptions.

3. **Never query tenant data without organization context.** Every SELECT, INSERT, UPDATE, DELETE on tenant data must filter by or include `organization_id`. Use `requireOrganization()` in server code.

4. **Never trust client-provided `organization_id`.** Always verify the authenticated user is a member of the organization before using the ID.

---

## Storage & Documents

5. **Never expose storage files directly without signed URLs.** All Supabase Storage access uses time-limited signed URLs. No public bucket URLs.

6. **Every document update must create a new version.** Re-uploads increment `version_number` and create a new `document_versions` row. History is never overwritten.

7. **Sanitize filenames on upload.** Strip path traversal characters, limit length, preserve extension.

8. **Validate MIME types and file sizes on upload.** Reject files that exceed limits or have disallowed types.

---

## External Participants

9. **Never create external participant user accounts unless explicitly required later.** External participants exist in `external_participants` table only. They access tasks via magic links, not Supabase Auth accounts.

10. **Magic link tokens must be hashed before storage.** Store SHA-256 hash only. Raw token exists only in the URL sent via email.

---

## Audit & Compliance

11. **Never skip audit logging for important actions.** If it changes data, permissions, workflows, or external access, it gets an audit log entry. See [AUDIT_LOGGING.md](./AUDIT_LOGGING.md) for the action list.

12. **Every monitor/reminder action must be auditable.** Monitor runs, notification triggers, and reminder sends all produce audit entries.

13. **Audit logs are append-only.** Never UPDATE or DELETE audit_logs rows from application code.

---

## Architecture & Code Quality

14. **Never implement a product-specific primitive if a shared primitive can solve it.** Use `workflow_instances.metadata` jsonb before creating module-specific tables. Create dedicated tables only when shared primitives are genuinely insufficient.

15. **Do not hardcode module navigation in multiple places.** Module definitions live in `/lib/modules/modules.ts`. Navigation, settings, and marketing pages read from this single source.

16. **Do not duplicate permissions.** Permission definitions live in `/lib/rbac/permissions.ts`. Role mappings live in `/lib/rbac/roles.ts`. Database seed matches these files.

17. **Prefer simple, boring, maintainable architecture over clever abstractions.** A solo founder must understand the entire codebase. No premature optimization, no over-engineered patterns.

---

## Background Jobs & Email

18. **Every background job must be idempotent.** Safe to retry without duplicate side effects. Use `idempotency_key` on `background_jobs`.

19. **Every email send must be logged.** Creates `notifications` row, `email_events` row, and audit log entry.

20. **Emails must include organization name and must not leak sensitive data.** Professional, plain, enterprise-grade templates only.

---

## Security

21. **Validate all inputs with Zod.** No raw user input reaches the database or external APIs.

22. **Store secrets only in environment variables.** Never in code, never in client bundles, never in git.

23. **Do not log sensitive document contents.** Log metadata and actions, not file bytes or PII field values.

24. **Add rate limiting to sensitive endpoints.** Magic link validation, auth endpoints, file uploads.

25. **Include security headers on all responses.** CSP, HSTS, X-Frame-Options, X-Content-Type-Options.

---

## Testing

26. **Write tests for security-critical paths.** RBAC helpers, magic link validation, audit log creation, organization access checks, monitor idempotency.

27. **Integration tests must verify cross-tenant isolation.** Unauthorized users cannot access another organization's data.

---

## Module Development

28. **Every new module must define its configuration in `/lib/modules/modules.ts`.** Include id, name, slug, category, jobToBeDone, freeToolSlug, requiredEntitlement, and status.

29. **Every new module must follow Collect → Extract → Approve → Monitor → Notify → Audit.** If a module step doesn't fit this pattern, reconsider the design.

30. **Module-specific tables are a last resort.** Document the justification in the module's PRODUCT_MODULES.md section before creating dedicated tables.

---

## Deployment

31. **Environment variables documented in `.env.example`.** Every required variable must be listed with a comment explaining its purpose.

32. **Workers run as separate Render services.** Never run long-running background tasks in the web service process.

33. **Database migrations are forward-only.** Never modify a deployed migration. Create a new migration to change schema.

---

## Code Review Checklist

Before merging any PR, verify:

- [ ] All tenant tables have `organization_id` and RLS enabled
- [ ] Server actions/API routes call `requireOrganization()` or `requirePermission()`
- [ ] Important actions produce audit log entries
- [ ] No hardcoded organization IDs or permission strings outside `/lib/rbac/`
- [ ] No product-specific tables when shared primitives suffice
- [ ] Background jobs are idempotent
- [ ] Email sends are logged
- [ ] Inputs validated with Zod
- [ ] No secrets in code
- [ ] Tests cover security-critical paths

---

*Development Rules v1 — mandatory project law.*
