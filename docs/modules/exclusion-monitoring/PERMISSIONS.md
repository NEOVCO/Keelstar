# Exclusion Monitoring — Permissions

Maps to existing RBAC:

| Action | Permission |
|--------|------------|
| View module / results | `workflows.view` |
| Run screening | `workflows.create` |
| Review matches | `workflows.approve` |
| Create/pause monitor | `monitors.manage` |
| Export evidence | `audit.view` |

Owner/Admin: full. Manager: run, review, monitor, export. Member: run + view. Viewer: view only.
