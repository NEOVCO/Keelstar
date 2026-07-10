# Transactional email & Supabase auth (production)

This guide wires **Resend** (app emails + Supabase auth emails) and **Supabase redirect URLs** so signup confirmation, password reset, invites, W-9/COI requests, and reminders work end-to-end in production.

---

## 1. Resend domain & sender

### Verify a sending domain

1. Open [Resend → Domains](https://resend.com/domains) and add **`keelstar.com`** (recommended) or use an already-verified domain.
2. Add the DNS records Resend provides (SPF, DKIM, optional DMARC).
3. Wait until the domain shows **Verified**.

### Environment variables (Render + local prod)

```bash
RESEND_API_KEY=re_...
EMAIL_FROM=Keelstar <no-reply@mail.keelstar.com>
```

> **Domain:** Use the dedicated Resend domain `mail.keelstar.com` (sender `no-reply@mail.keelstar.com`).

### Health check

After deploy, `GET /api/health` returns email configuration status:

```json
{
  "email": {
    "configured": true,
    "from": "Keelstar <no-reply@keelstar.com>",
    "warnings": []
  }
}
```

---

## 2. Route Supabase auth emails through Resend (SMTP)

Supabase sends **signup confirmation** and **password reset** emails. By default they use Supabase’s mailer. For production, use Resend SMTP:

1. Supabase Dashboard → **Project Settings → Authentication → SMTP**
2. Enable custom SMTP:

| Field | Value |
|-------|--------|
| Host | `smtp.resend.com` |
| Port | `465` (SSL) or `587` (TLS) |
| Username | `resend` |
| Password | Your `RESEND_API_KEY` |
| Sender email | Same as `EMAIL_FROM` (must be on a verified domain) |
| Sender name | `Keelstar` |

3. Save and send a test email from the dashboard.

---

## 3. Supabase URL configuration

Dashboard → **Authentication → URL configuration**

| Setting | Production value |
|---------|------------------|
| **Site URL** | `https://www.keelstar.com` |
| **Redirect URLs** | Add all URLs below |

### Required redirect URLs

The app uses PKCE: auth links land on `/auth/callback`, which exchanges the code and redirects to `next`.

```
https://www.keelstar.com/auth/callback
https://www.keelstar.com/auth/callback?next=%2Fonboarding
https://www.keelstar.com/auth/callback?next=%2Freset-password
https://www.keelstar.com/auth/callback?next=%2Fapp
https://keelstar.com/auth/callback
https://keelstar.com/auth/callback?next=%2Fonboarding
https://keelstar.com/auth/callback?next=%2Freset-password
```

For **invite signup with email confirmation**, Supabase also redirects to paths like:

```
https://www.keelstar.com/auth/callback?next=%2Finvite%2F<token>
```

Easiest approach: add a wildcard (if your Supabase plan supports it):

```
https://www.keelstar.com/**
```

Local development:

```
http://localhost:3000/auth/callback
http://localhost:3000/**
```

Canonical list is also exported in code: `src/lib/auth/urls.ts` → `SUPABASE_REDIRECT_URLS`.

### App URL env vars (Render `keelstar-web` + workers)

```bash
APP_URL=https://www.keelstar.com
NEXT_PUBLIC_APP_URL=https://www.keelstar.com
MARKETING_URL=https://www.keelstar.com
```

---

## 4. Supabase email templates (optional branding)

Dashboard → **Authentication → Email templates**

Replace the default HTML with branded copy. Suggested subjects:

| Template | Subject |
|----------|---------|
| Confirm signup | `Confirm your Keelstar account` |
| Reset password | `Reset your Keelstar password` |
| Magic link | `Sign in to Keelstar` |
| Invite user | `You've been invited to Keelstar` |

Use `{{ .ConfirmationURL }}` in the body — Supabase injects the link (which should point at `/auth/callback` via your redirect settings).

Minimal confirm-signup body example:

```html
<h2>Confirm your email</h2>
<p>Click below to activate your Keelstar account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm email</a></p>
<p>If you didn't create an account, you can ignore this email.</p>
```

---

## 5. Auth flows (how the app uses redirects)

| Flow | Trigger | Redirect after email click |
|------|---------|----------------------------|
| Signup | `/signup` | `/auth/callback?next=/onboarding` |
| Password reset | `/forgot-password` | `/auth/callback?next=/reset-password` |
| Invite (new user) | `/invite/[token]` signup | `/auth/callback?next=/invite/[token]` → auto-accept |
| Org invite email | Members panel | `/invite/[token]` (Resend, not Supabase) |

Code helpers: `src/lib/auth/urls.ts`.

---

## 6. Background workers (required for reminders & queued mail)

| Service | Render type | Command | Purpose |
|---------|-------------|---------|---------|
| `keelstar-background-worker` | Background Worker | `npm run worker:background` | Queued emails (30s) + document jobs (60s) |
| `keelstar-daily-cron` | Cron (`0 6 * * *` UTC) | `npm run worker:daily` | Cleanup, monitors, reminders |

Both need: `RESEND_API_KEY`, `EMAIL_FROM`, Supabase keys, `APP_URL`.

Defined in `render.yaml` (optimized 3-service layout). Create/sync services in Render before launch.

**Note:** W-9/COI **initial requests** send immediately via `sendEmail()` in API routes. **Reminders/overdue** and **queued** notifications need workers.

---

## 7. Production smoke test checklist

- [ ] Resend domain verified; `EMAIL_FROM` matches verified domain
- [ ] Supabase SMTP test email received
- [ ] Signup → confirmation email → lands on `/onboarding`
- [ ] Forgot password → email → lands on `/reset-password` with session
- [ ] Invite member → Resend email → `/invite/[token]` → join org
- [ ] Send W-9 request → vendor receives email with magic link
- [ ] `GET /api/health` shows `email.configured: true`
- [ ] `keelstar-background-worker` and `keelstar-daily-cron` configured on Render

---

## 8. Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Auth link goes to localhost | `APP_URL` / Site URL not set to production domain |
| “Invalid redirect URL” | URL missing from Supabase Redirect URLs list |
| Reset password shows “Open the reset link…” | Link didn’t go through `/auth/callback` (old `redirectTo`); redeploy and request a new reset |
| Emails not sent | `RESEND_API_KEY` missing on service, or domain not verified |
| Queued emails stuck pending | `keelstar-background-worker` not running |
| Reminders never fire | `keelstar-daily-cron` not deployed |
