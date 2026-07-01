# W-9 Collection — Implementation Plan

> Phased build order. Do not skip phases.

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 1 | Module documentation (this folder) | ✅ |
| 2 | Migration `003_w9_vendor_portal.sql` + RLS | ✅ |
| 3 | Shared helpers: `hashToken`, billing, analytics wrapper | ✅ |
| 4 | Vendor CRUD (`lib/vendors/`) | ✅ |
| 5 | W-9 request creation (`lib/w9/`) | ✅ |
| 6 | Magic links + `/external/w9/[token]` | ✅ |
| 7 | External upload API + storage path | ✅ |
| 8 | Internal review (approve/reject/correction) | ✅ |
| 9 | Reminder scheduling + worker | ✅ |
| 10 | Email templates (`lib/email/templates/`) | ✅ |
| 11 | Audit events wired | ✅ |
| 12 | Evidence export CSV | ✅ |
| 13 | Billing limits (`lib/billing/`) | ✅ |
| 14 | UI: vendors, workflow detail, review, module home | ✅ |
| 15 | Tests | ✅ |
| 16 | Seed data `supabase/seed/w9_demo.sql` | ✅ |
| 17 | Launch checklist ([QA_CHECKLIST.md](./QA_CHECKLIST.md)) | Pending manual QA |

## Dependencies

- Platform foundation: auth, org context, RBAC, audit, Supabase clients
- Resend for email (graceful no-op if key missing in dev)

## Reference pattern

Every future module copies: **docs folder → migration (if needed) → lib domain → API → UI → worker → tests → seed**
