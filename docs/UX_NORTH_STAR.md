# Keelstar UX North Star

> Mandatory reference for all product, design, and engineering work on the Keelstar application.

---

## Keelstar UX Promise

Keelstar helps teams control recurring document, compliance, and approval work without spreadsheets, inbox chasing, or shared-drive chaos.

Every screen should help users answer at least one of these questions:

| Question | Typical surface |
|----------|-----------------|
| What needs attention? | Home, Inbox, Attention panels |
| What is waiting on someone else? | Inbox, Waiting on Others |
| What is expiring soon? | Monitors, Expiring Soon |
| What has been completed? | Workflows, Audit, Reports |
| What evidence do we have? | Document detail, Evidence export |
| What should happen next? | Next Action panel, workflow stepper |

If a screen does not help answer one of these, it does not belong in the protected app.

---

## UX Personality

### Keelstar should feel

- **Serious** — compliance and money are at stake
- **Calm** — reduce anxiety; no alarmist UI unless truly critical
- **Precise** — exact statuses, dates, owners, versions
- **Trustworthy** — audit trails, clear external branding, no dark patterns
- **Premium** — restrained polish like Stripe, Linear, Mercury
- **Enterprise-ready** — permissions, org context, exportable evidence
- **Operational** — tables, filters, bulk actions over vanity charts
- **Clear** — one primary purpose per screen
- **Structured** — predictable object pages and workflow patterns
- **Fast** — time-to-value under 10 minutes for first workflow

### Keelstar should not feel

- Playful, consumer-like, or gamified
- Gimmicky (gradients, mascots, celebration confetti)
- Generic AI SaaS (purple glow, “unlock potential” copy)
- Bloated (decorative charts, fake metrics)
- Salesy (aggressive upsell on every screen)
- Confusing (product-only nav with no shared objects)
- AI-generated slop (lorem ipsum, vague empty states)

---

## UX Commandments

1. **Every screen must have a clear primary purpose.** One headline, one primary CTA.
2. **Every workflow must show a next action.** If nothing is required, say “No action needed” explicitly.
3. **Every object must have status, owner, due date, and history** where relevant.
4. **Every document must be versioned.** Never overwrite without history.
5. **Every AI/extraction result must be reviewable and correctable.** Show confidence; allow override.
6. **Every important action must be auditable.** Approve, reject, send, revoke, export — all logged.
7. **External participants must never be forced to create accounts.** Magic links only.
8. **Monitoring is recurring value.** Reminders and deadlines visible on home, objects, and monitors.
9. **Empty states must teach and guide.** Title + one sentence + primary CTA + optional secondary.
10. **Error states must help recovery.** Explain what happened; offer the fix.
11. **Permissions must be visible** when they block an action (disabled button + tooltip, not silent failure).
12. **Cross-sell must be contextual, not aggressive.** Suggest COI after W-9; never interrupt review flows.
13. **Tables must be excellent.** Search, filters, sort, row actions — this is an ops product.
14. **Reduce anxiety around compliance and documents.** Calm copy; clear evidence; no fear-mongering.
15. **Do not create product-specific UI patterns** when a shared pattern works.

---

## Design references (tone, not copy)

| Reference | What to borrow |
|-----------|----------------|
| Stripe Dashboard | Calm density, trust, tables |
| Linear | Sidebar, command menu, focus |
| Mercury | Professional fintech calm |
| Vercel | Typography, spacing discipline |
| Notion | Object pages, timelines (restrained) |
| Ramp | Operational clarity |

---

## Success metrics (UX)

- Time to first external request sent: **< 10 minutes**
- Time to find “what needs my attention”: **< 5 seconds** from home
- Zero account creation for external participants
- All primary flows completable on mobile (external) or readable (internal quick actions)

---

## Relationship to other docs

| Doc | Role |
|-----|------|
| [UX_INFORMATION_ARCHITECTURE.md](./UX_INFORMATION_ARCHITECTURE.md) | Routes and IA |
| [UX_DESIGN_SYSTEM.md](./UX_DESIGN_SYSTEM.md) | Visual and component specs |
| [UX_IMPLEMENTATION_RULES.md](./UX_IMPLEMENTATION_RULES.md) | Engineering guardrails |
| [PRODUCT_EXPANSION_PLAYBOOK.md](./PRODUCT_EXPANSION_PLAYBOOK.md) §8 | Module-level UX rules |

---

*Last updated: foundation release. All app work must align with this document.*
