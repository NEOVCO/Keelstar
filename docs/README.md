# Keelstar Platform

Multi-product B2B SaaS platform for focused compliance and workflow apps.

**Start here:** [NORTH_STAR.md](./NORTH_STAR.md) · **AI sessions:** [AI_DEVELOPMENT_OPERATING_SYSTEM.md](./AI_DEVELOPMENT_OPERATING_SYSTEM.md)

## Documentation

| Document | Purpose |
|----------|---------|
| [AI_DEVELOPMENT_OPERATING_SYSTEM.md](./AI_DEVELOPMENT_OPERATING_SYSTEM.md) | **Mandatory for AI coding sessions** |
| [NORTH_STAR.md](./NORTH_STAR.md) | Guiding constitution |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | All tables and RLS |
| [RBAC.md](./RBAC.md) | Roles and permissions |
| [AUDIT_LOGGING.md](./AUDIT_LOGGING.md) | Audit philosophy |
| [MAGIC_LINKS.md](./MAGIC_LINKS.md) | External participant flows |
| [PRODUCT_MODULES.md](./PRODUCT_MODULES.md) | Module specifications |
| [PRODUCT_EXPANSION_PLAYBOOK.md](./PRODUCT_EXPANSION_PLAYBOOK.md) | Mandatory manual for building new modules |
| [DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md) | Mandatory project law |
| [TASKS_TO_COMPLETE.md](./TASKS_TO_COMPLETE.md) | Platform foundation backlog |
| [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) | Deployment guide |
| [TODO.md](./TODO.md) | Future implementation checklist |

## Quick Start (Local)

```bash
# Install
npm install

# Configure environment
cp .env.example .env.local
# Fill in Supabase, Stripe, Resend credentials

# Apply database migrations (Supabase CLI)
supabase db push
# Or run SQL files in supabase/migrations/ via Supabase Dashboard

# Seed roles, permissions, products
# Run supabase/seed/seed.sql

# Start dev server
npm run dev

# Run workers (separate terminals)
npm run worker:documents
npm run worker:notifications
npm run worker:monitors   # cron — run once daily
npm run worker:cleanup    # cron — run once daily

# Run tests
npm test
```

## App Routes

| Route | Purpose |
|-------|---------|
| `/login`, `/signup` | Authentication |
| `/onboarding` | Create organization |
| `/dashboard` | App home |
| `/documents`, `/workflows`, `/tasks`, `/monitors` | Platform primitives |
| `/audit`, `/settings`, `/billing` | Admin |
| `/w9`, `/coi`, `/contracts`, … | Module shells |
| `/external/[token]` | Magic link external flows |
| `/tools/*` | Free utility tools (marketing) |

## Stack

Next.js 14 · Supabase (Auth, Postgres, Storage) · Tailwind · Render · Stripe · Resend · Sentry · PostHog
