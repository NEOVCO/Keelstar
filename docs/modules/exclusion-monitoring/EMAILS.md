# Exclusion Monitoring — Emails

## exclusion-potential-match-alert
**Trigger:** Screening completes with `potential_match`  
**Subject:** Potential exclusion match found for [Subject]  
**Body:** Source, match count, CTA to result detail. Minimal PII.

## exclusion-monitor-failed
**Trigger:** Scheduled run fails  
**Subject:** Exclusion screening failed for [Subject]

## exclusion-monthly-clear-summary
**Trigger:** Scheduled run completes with `no_match` (optional digest)

All sends create email event + `exclusion_alert.sent` audit when applicable.
