# Keelstar UX — Mobile & Responsive

---

## Priority by audience

### Internal app (mobile)

Users should be able to:

- Approve tasks
- Upload documents
- Check reminders / expiring items
- View dashboard attention panel
- Complete quick reviews (field confirmation)
- Sign documents (Simple Signer internal preview)

Not required on mobile: bulk operations, complex monitor builder, full audit export config.

### External (mobile) — **critical**

- Upload document
- Fill minimal forms
- Sign
- Acknowledge policy

External flows must be designed mobile-first.

---

## Layout rules

| Element | Desktop | Mobile |
|---------|---------|--------|
| Sidebar | Fixed 240px | Drawer overlay |
| Top bar | Full | Hamburger + title |
| Tables | Full table | Card list |
| Object page | Main + right rail | Stacked; rail below |
| Extraction review | Two column | Preview above fields |
| Primary CTA | Header or panel | Sticky bottom bar |
| Forms | Two column where safe | Single column |
| Touch targets | 36px min | **44px min** |
| Modals | Centered | Full-screen sheet on `< sm` |

---

## Breakpoints

Use Tailwind defaults: `sm` 640, `md` 768, `lg` 1024.

**Object layout splits at `lg`**, not `md`.

---

## Dashboard mobile

Single column. Order: Attention → Inbox link → Expiring → Activity.

---

## Testing checklist

- [ ] External W-9 upload on iPhone Safari
- [ ] Inbox task approve on mobile
- [ ] Sidebar drawer does not trap scroll
- [ ] Sticky CTA does not cover form fields

---

*Accessibility: [UX_ACCESSIBILITY.md](./UX_ACCESSIBILITY.md)*
