# Exclusion Monitoring — Data Model

## screening_subjects

Tenant-scoped party to screen. Optional `vendor_id`. Name fields for ad hoc entry.

Key columns: `organization_id`, `subject_type`, `vendor_id`, `display_name`, `first_name`, `last_name`, `organization_name`, `date_of_birth`, `npi`, `status`, `owner_id`, `metadata`.

## screening_runs

One execution against one or more sources.

Key columns: `screening_subject_id`, `workflow_instance_id`, `monitor_id`, `run_type` (ad_hoc | scheduled | manual_rerun), `sources[]`, `status`, timestamps.

## screening_results

Per-source outcome for a run.

Key columns: `source` (oig | sam), `result_status`, `match_count`, `review_status`, `reviewed_by`, `review_notes`, `raw_response`.

## screening_matches

Individual match rows when `potential_match`.

Key columns: `matched_name`, `matched_identifier`, `matched_program`, `match_score`, `raw_match`.

## monitors

`monitor_type = exclusion_monitoring`, `config.screening_subject_id`, `next_run_at` monthly.

## workflow_instances

`type = exclusion_screening` links ad hoc runs for audit timeline.
