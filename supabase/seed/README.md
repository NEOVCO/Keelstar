# Demo seed data

Load platform seed first, then module demos in order:

```bash
# Against local Supabase (adjust connection for remote)
psql "$DATABASE_URL" -f supabase/seed/seed.sql
psql "$DATABASE_URL" -f supabase/seed/demo_org.sql
psql "$DATABASE_URL" -f supabase/seed/w9_demo.sql
psql "$DATABASE_URL" -f supabase/seed/coi_demo.sql
psql "$DATABASE_URL" -f supabase/seed/contracts_demo.sql
```

**Org:** `Acme Operations` (`acme-operations`, id `a0000000-…`)

| Seed file | Workflows | States covered |
|-----------|-----------|----------------|
| `w9_demo.sql` | 4 W-9 requests | sent, submitted, completed, overdue |
| `coi_demo.sql` | 4 COI requests | review_needed, expiring_soon, expired, sent |
| `contracts_demo.sql` | 5 contracts | draft, review_needed, active_monitoring, expiring_soon, expired |

Link `admin@keelstar.test` to the demo org via onboarding or `organization_members` before using the app UI.
