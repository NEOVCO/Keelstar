# Exclusion Monitoring — QA Checklist

## Security
- [ ] RLS on all screening tables
- [ ] User cannot read another org's subjects/runs/results
- [ ] Viewer cannot run screening

## Screening
- [ ] Ad hoc OIG run stores result
- [ ] SAM returns not_configured without API key
- [ ] Demo mode labeled in UI when EXCLUSION_DATA_MODE=demo
- [ ] Potential match requires review

## Review
- [ ] Clear/confirm requires review note
- [ ] Audit events on review

## Monitor
- [ ] Monthly monitor creates scheduled runs
- [ ] Worker does not duplicate same-day run
- [ ] Failed provider recorded on run

## Integration
- [ ] Vendor detail shows screening card
- [ ] Evidence CSV export works
- [ ] W-9/COI/Contract tests still pass
