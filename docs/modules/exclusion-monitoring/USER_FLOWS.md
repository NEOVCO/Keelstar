# Exclusion Monitoring — User Flows

## Flow 1 — Ad hoc screening
Module → Run check → select vendor or manual entry → choose sources → run → view result → export.

## Flow 2 — Review potential match
Result detail → compare subject vs match → clear (false positive) or confirm → required note → audit.

## Flow 3 — Monthly monitor
Subject/result → Monitor monthly → worker runs on schedule → alert on potential match.

## Flow 4 — Scheduled run (worker)
Daily job → due monitors → screening run → store results → notify owner if review needed.

## Flow 5 — Evidence export
Subject or result → Export CSV → audit `exclusion_evidence.exported`.

See MODULE_SPEC.md for field-level detail.
