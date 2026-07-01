# Keelstar UX — Implementation Rules

> **Mandatory** for all engineers and agents building Keelstar UI.

---

## Before coding

1. Read [UX_NORTH_STAR.md](./UX_NORTH_STAR.md)
2. Read the doc for the surface you are building (dashboard, tables, external, etc.)
3. Check [UX_INFORMATION_ARCHITECTURE.md](./UX_INFORMATION_ARCHITECTURE.md) for routes
4. Check [UX_DESIGN_SYSTEM.md](./UX_DESIGN_SYSTEM.md) for tokens and components

---

## Architecture rules

| Rule | Detail |
|------|--------|
| Module config | Single source: `src/lib/modules/modules.ts` |
| Navigation | Single source: `src/lib/navigation/app-nav.ts` |
| Statuses | Single source: `src/lib/statuses/` |
| Mock data | `src/lib/mock-data/` until Supabase wired |
| No duplicate nav | Never hardcode app lists in pages |

---

## Component rules

| Pattern | Shared component |
|---------|------------------|
| List page | `DataTable` + `TableToolbar` |
| Object detail | `ObjectHeader` + layout grid |
| Workflow | `WorkflowStepper` + `NextActionPanel` |
| External | `ExternalLayout` |
| Empty | `EmptyState` with CTA |
| Error | `ErrorState` with recovery |
| Status | `StatusBadge` from status lib |

**Do not** create module-specific table or empty state components unless spec justifies deviation.

---

## Page rules

- Every list page: search + filters + sort (toolbar)
- Every detail page: breadcrumbs + status + primary action
- Every document page: version context + audit snippet
- Every monitor page: next run + schedule visible
- Every workflow page: next action visible
- One primary CTA per screen region

---

## Copy rules

**Use:** “Request W-9”, “Review extracted fields”, “Export evidence”, “Waiting on vendor”, “Expires in 14 days”

**Never:** “Unlock potential”, “Transform with AI”, “Revolutionize”, “Supercharge”, lorem ipsum

---

## Visual rules

- No decorative charts without real data
- No fake metrics, logos, or testimonials in app
- No gradients or purple AI aesthetic
- Use design tokens only — no random hex in components
- Icons: Lucide, restrained

---

## Route rules

- Protected app lives under `/app/*`
- External under `/external/*`
- Legacy routes redirect — do not maintain duplicate pages

---

## Backend integration

When connecting Supabase:

1. Replace mock imports with server queries
2. Keep UI components unchanged where possible
3. Preserve URL filter params
4. Add `// TODO(backend):` only where contract unclear

---

## PR checklist

- [ ] Matches relevant UX doc
- [ ] Uses shared components
- [ ] Empty state with CTA
- [ ] Error recovery path
- [ ] Keyboard accessible
- [ ] Mobile layout considered
- [ ] Status badges from shared lib
- [ ] No hardcoded module metadata

---

## Document index

| File | Topic |
|------|-------|
| UX_NORTH_STAR | Philosophy |
| UX_INFORMATION_ARCHITECTURE | Routes |
| UX_DESIGN_SYSTEM | Visual |
| UX_NAVIGATION | Shell |
| UX_DASHBOARD | Home |
| UX_OBJECT_MODEL | Detail pages |
| UX_WORKFLOW_PATTERN | Workflows |
| UX_PRODUCT_FLOWS | Per module |
| UX_EXTERNAL_MAGIC_LINKS | External |
| UX_DOCUMENT_EXTRACTION | Documents |
| UX_MONITORING_REMINDERS | Monitors |
| UX_AUDIT_EVIDENCE | Audit |
| UX_EMPTY_STATES | Empty |
| UX_ERROR_STATES | Errors |
| UX_TABLES_SEARCH | Tables |
| UX_ONBOARDING | Onboarding |
| UX_MOBILE_RESPONSIVE | Responsive |
| UX_ACCESSIBILITY | A11y |
| UX_ANALYTICS_EVENTS | Analytics |

---

*Violations of these rules should be caught in code review.*
