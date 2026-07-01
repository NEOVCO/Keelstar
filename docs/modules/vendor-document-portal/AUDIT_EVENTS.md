# W-9 Collection — Audit Events

All events written to `audit_logs` via `createAuditLog()`.

## Standard fields

| Field | Description |
|-------|-------------|
| `organization_id` | Tenant |
| `actor_type` | `user` \| `external` \| `system` |
| `actor_id` | UUID or null |
| `actor_email` | When available |
| `action` | Event key below |
| `target_type` | Entity type |
| `target_id` | Entity UUID |
| `metadata` | JSON context |
| `ip_address` | When available |
| `user_agent` | When available |
| `correlation_id` | Request/workflow correlation |

## Event catalog

| Action | target_type | When |
|--------|-------------|------|
| `organization.created` | organization | Onboarding |
| `member.invited` | organization_member | Invite sent |
| `vendor.created` | vendor | Vendor created |
| `vendor.updated` | vendor | Vendor edited |
| `vendor.archived` | vendor | Vendor archived |
| `w9_request.created` | workflow_instance | Request drafted |
| `w9_request.sent` | workflow_instance | Email sent |
| `magic_link.created` | magic_link | Link generated |
| `magic_link.opened` | magic_link | External page load |
| `magic_link.used` | magic_link | Upload submitted |
| `magic_link.revoked` | magic_link | Manual revoke |
| `magic_link.expired` | magic_link | Expiry check |
| `email.sent` | email_event | Any email |
| `document.uploaded` | document | Version created |
| `document.version_created` | document_version | New version |
| `document.review_started` | document | Review opened |
| `document.approved` | document | Approved |
| `document.rejected` | document | Rejected |
| `correction.requested` | workflow_instance | Correction flow |
| `reminder.created` | reminder | Scheduled |
| `reminder.sent` | reminder | Worker sent |
| `reminder.cancelled` | reminder | Request done |
| `evidence.exported` | evidence_export | CSV export |
| `billing.limit_reached` | organization | Limit hit |
| `billing.checkout_started` | organization | Upgrade click |
| `subscription.updated` | subscription | Stripe webhook |

## Metadata examples

```json
// w9_request.sent
{ "vendor_id": "...", "vendor_email": "...", "due_date": "..." }

// document.uploaded
{ "filename": "w9.pdf", "version_number": 1, "size_bytes": 102400 }

// correction.requested
{ "reason": "TIN illegible", "new_magic_link_id": "..." }
```
