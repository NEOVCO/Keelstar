#!/usr/bin/env bash
# Send a test email via Resend to verify domain + API key.
# Usage: ./scripts/email-probe.sh you@example.com

set -euo pipefail

TO="${1:-}"
if [[ -z "$TO" ]]; then
  echo "Usage: $0 <recipient-email>"
  exit 1
fi

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ -z "${RESEND_API_KEY:-}" ]]; then
  echo "RESEND_API_KEY is not set"
  exit 1
fi

FROM="${EMAIL_FROM:-Keelstar <no-reply@mail.keelstar.com>}"

curl -sS -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer ${RESEND_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg from "$FROM" --arg to "$TO" '{
    from: $from,
    to: [$to],
    subject: "Keelstar email probe",
    html: "<p>If you received this, Resend is configured correctly.</p>"
  }')" | jq .
