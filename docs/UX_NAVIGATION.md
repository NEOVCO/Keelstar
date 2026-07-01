# Keelstar UX — Navigation

> Sidebar, top bar, command menu, breadcrumbs, and create flows.

---

## Sidebar structure

```
WORKSPACE
  Home
  Inbox
  Workflows
  Documents
  Monitors
RECORDS
  Vendors
  People
  Reports
  Audit Log
APPS
  W-9 Collector
  COI Tracker
  … (from modules.ts)
ADMIN
  Settings
  Billing
```

Configuration source: `src/lib/navigation/app-nav.ts` — **never hardcode in components**.

---

## Sidebar behavior

| Behavior | Spec |
|----------|------|
| Width | 240px expanded; 64px icon-only collapsed |
| Collapse | Toggle at bottom; persist in `localStorage` |
| Active item | `bg-accent-subtle text-accent font-medium` |
| Hover | `bg-sunken` |
| Groups | `text-overline` labels; not collapsible in v1 |
| Locked app | `opacity-60` + lock icon; click → billing or upgrade modal |
| Scroll | Independent scroll for Apps list if > 8 items |

Mobile (`< md`): sidebar becomes **drawer** overlay; hamburger in top bar.

---

## Top bar

Height `56px`, border-bottom, contains (left → right):

| Element | Behavior |
|---------|----------|
| Mobile menu | Opens sidebar drawer |
| Breadcrumbs | Detail pages only (hidden on home) |
| Spacer | `flex-1` |
| Org switcher | Dropdown; switches `keelstar_active_org` cookie |
| Global search | Opens command menu; shows `⌘K` hint |
| Create | `+` dropdown — see Create menu |
| Notifications | Bell; badge count for actionable items |
| User menu | Profile, org settings, sign out |

---

## Global Create menu

| Action | Route / behavior |
|--------|------------------|
| Upload document | `/app/documents?action=upload` |
| Start workflow | Modal: pick module → create flow |
| Request document | Module picker → external request wizard |
| Create monitor | `/app/monitors/new` |
| Invite member | `/app/settings/members?invite=1` |
| Add vendor | `/app/vendors/new` |
| Add person | `/app/people/new` |

One primary create path per context: on Vendors page, “Add vendor” is page CTA; global create duplicates for discoverability.

---

## Command menu (Cmd+K)

**Sections:**

1. **Quick actions** — Upload, Start workflow, Invite member
2. **Go to** — Documents, Workflows, Settings, …
3. **Search results** — Fuzzy match on title, vendor name, document name

**Keyboard:**

- `↑↓` navigate
- `Enter` execute
- `Esc` close

Implementation: `src/components/navigation/CommandMenu.tsx`

---

## Breadcrumbs

**Required on:** all `[id]` detail pages, settings sub-pages, module app pages.

**Pattern:** `Home > {Section} > {Object name}`

- `Home` → `/app`
- Section → list route
- Current page not linked

Truncation: middle segments collapse with `…` on narrow screens.

Component: `src/components/navigation/Breadcrumbs.tsx`

---

## Deep linking

- All list filters sync to URL query params (`?status=review_needed`)
- Shareable workflow/document URLs
- External tokens are opaque; no internal IDs in external URLs

---

## Sign out

POST `/api/auth/signout` from user menu. Never GET from in-app links except explicit “sign out everywhere”.

---

## Notifications panel

| Type | Example |
|------|---------|
| Action required | Document needs review |
| Waiting | Vendor has not submitted |
| System | Export ready |
| Monitor | COI expires in 30 days |

Click → navigate to object. Mark read on visit.

---

*IA routes defined in [UX_INFORMATION_ARCHITECTURE.md](./UX_INFORMATION_ARCHITECTURE.md).*
