# Vendor Packet Portal — Existing Implementation Review

> Inspected: 2026-06-30 · Before building vertical slice

---

## Existing routes

| Route | Status |
|-------|--------|
| `/app/apps/vendor-packets` | **Stub only** — falls through to generic `ModulePageShell` |
| `/external/vendor-packet/[token]` | **Not implemented** |
| `/api/vendor-packets/*` | **Not implemented** |

## Existing database

- `vendors` table (migration 003) — shared with W-9/COI ✓
- `workflow_instances`, `tasks`, `documents`, `magic_links`, `monitors`, `reminders` — shared primitives ✓
- No `vendor_packet_templates` table (deferred)
- No vendor-packet-specific migration

## Existing helpers/components

- `src/lib/modules/modules.ts` — module registered (`vendor_packet`, slug `vendor-packets`)
- Marketing/content references only (`products.ts`, `tools.ts`, `guides/`)
- **No** `src/lib/vendor-packets/` directory
- **No** vendor-packet components

## What can be reused

- W-9: `createRequest`, `sendRequest`, external participant + magic link pattern
- COI: multi-step review, `scheduleReminders`, `cancelReminders`, module page layout
- Contract: completion monitor in shared worker
- `vendors` table, vendor list at `/app/vendors`
- `createMagicLink` with `maxUses > 1` for multi-session portal

## What must be added

Full vertical slice: create packet → checklist tasks + documents → send portal link → external multi-item upload → track completion → incomplete monitor → reminders → audit → evidence export

## What must not be duplicated

- No separate vendor table
- No custom magic link system
- No per-item magic links (single portal link per packet)

## Risks to W-9/COI/Contract

- Reuse distinct `workflow_instances.type = vendor_packet`
- Magic link `purpose = vendor_packet_portal` (distinct from `w9_submit`, `coi_upload`)
- Reminder types: `vendor_packet_reminder`, `vendor_packet_overdue`
- Do not modify W-9/COI upload handlers
