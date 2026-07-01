-- Exclusion Monitoring demo seed — run after demo_org.sql and migration 008
-- Acme Operations (a0000000-0000-4000-8000-000000000001)


-- SCREENING SUBJECTS
INSERT INTO screening_subjects (
  id, organization_id, subject_type, vendor_id, display_name,
  first_name, last_name, organization_name, status, metadata, created_at, updated_at
) VALUES
  ('f1000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'vendor', 'b0000001-0000-4000-8000-000000000001', 'Northline Supplies', NULL, NULL, 'Northline Supplies', 'cleared', '{"demo": true}'::jsonb, now() - interval '14 days', now() - interval '14 days'),
  ('f1000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'person', NULL, 'Jane Doe', 'Jane', 'Doe', NULL, 'review_needed', '{"demo": true}'::jsonb, now() - interval '10 days', now() - interval '10 days'),
  ('f1000001-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'vendor', 'b0000001-0000-4000-8000-000000000002', 'Harbor Equipment Co.', NULL, NULL, 'Harbor Equipment Co.', 'monitoring', '{"demo": true}'::jsonb, now() - interval '21 days', now() - interval '2 days'),
  ('f1000001-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'person', NULL, 'John Smith', 'John', 'Smith', NULL, 'cleared', '{"demo": true}'::jsonb, now() - interval '7 days', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;


-- WORKFLOWS
INSERT INTO workflow_instances (
  id, organization_id, type, title, status, vendor_id, metadata, created_at, updated_at
) VALUES
  ('f5000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'exclusion_screening', 'Exclusion — Northline Supplies', 'completed', 'b0000001-0000-4000-8000-000000000001', '{"demo": true, "sources": ["oig"], "run_type": "ad_hoc"}'::jsonb, now() - interval '14 days', now() - interval '14 days'),
  ('f5000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'exclusion_screening', 'Exclusion — Jane Doe', 'active', NULL, '{"demo": true, "sources": ["oig", "sam"], "run_type": "ad_hoc"}'::jsonb, now() - interval '10 days', now() - interval '10 days'),
  ('f5000001-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'exclusion_screening', 'Exclusion — John Smith', 'completed', NULL, '{"demo": true, "sources": ["oig"], "run_type": "ad_hoc"}'::jsonb, now() - interval '7 days', now() - interval '5 days'),
  ('f5000001-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'exclusion_screening', 'Exclusion — Harbor Equipment Co.', 'active', 'b0000001-0000-4000-8000-000000000002', '{"demo": true, "sources": ["oig"], "run_type": "scheduled"}'::jsonb, now() - interval '2 days', now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- SCREENING RUNS
INSERT INTO screening_runs (
  id, organization_id, screening_subject_id, workflow_instance_id, monitor_id,
  run_type, sources, status, started_at, completed_at, metadata, created_at
) VALUES
  ('f2000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'f1000001-0000-4000-8000-000000000001', 'f5000001-0000-4000-8000-000000000001', NULL, 'ad_hoc', ARRAY['oig']::text[], 'completed', now() - interval '14 days', now() - interval '14 days', '{"demo": true}'::jsonb, now() - interval '14 days'),
  ('f2000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'f1000001-0000-4000-8000-000000000002', 'f5000001-0000-4000-8000-000000000002', NULL, 'ad_hoc', ARRAY['oig', 'sam']::text[], 'completed', now() - interval '10 days', now() - interval '10 days', '{"demo": true}'::jsonb, now() - interval '10 days'),
  ('f2000001-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'f1000001-0000-4000-8000-000000000003', 'f5000001-0000-4000-8000-000000000004', 'f6000001-0000-4000-8000-000000000001', 'scheduled', ARRAY['oig']::text[], 'completed', now() - interval '2 days', now() - interval '2 days', '{"demo": true}'::jsonb, now() - interval '2 days'),
  ('f2000001-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'f1000001-0000-4000-8000-000000000004', 'f5000001-0000-4000-8000-000000000003', NULL, 'ad_hoc', ARRAY['oig']::text[], 'completed', now() - interval '7 days', now() - interval '7 days', '{"demo": true}'::jsonb, now() - interval '7 days')
ON CONFLICT (id) DO NOTHING;


-- SCREENING RESULTS
INSERT INTO screening_results (
  id, organization_id, screening_run_id, screening_subject_id,
  source, result_status, match_count, review_status,
  reviewed_at, review_notes, raw_response, created_at, updated_at
) VALUES
  ('f3000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'f2000001-0000-4000-8000-000000000001', 'f1000001-0000-4000-8000-000000000001', 'oig', 'no_match', 0, 'not_required', NULL, NULL, '{"demo": true, "mode": "demo"}'::jsonb, now() - interval '14 days', now() - interval '14 days'),
  ('f3000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'f2000001-0000-4000-8000-000000000002', 'f1000001-0000-4000-8000-000000000002', 'oig', 'potential_match', 1, 'review_needed', NULL, NULL, '{"demo": true, "mode": "demo", "matchCount": 1}'::jsonb, now() - interval '10 days', now() - interval '10 days'),
  ('f3000001-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'f2000001-0000-4000-8000-000000000002', 'f1000001-0000-4000-8000-000000000002', 'sam', 'not_configured', 0, 'not_required', NULL, NULL, '{"demo": true, "reason": "sam_api_key_not_configured"}'::jsonb, now() - interval '10 days', now() - interval '10 days'),
  ('f3000001-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'f2000001-0000-4000-8000-000000000003', 'f1000001-0000-4000-8000-000000000003', 'oig', 'no_match', 0, 'not_required', NULL, NULL, '{"demo": true, "mode": "demo"}'::jsonb, now() - interval '2 days', now() - interval '2 days'),
  ('f3000001-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'f2000001-0000-4000-8000-000000000004', 'f1000001-0000-4000-8000-000000000004', 'oig', 'potential_match', 1, 'false_positive', now() - interval '5 days', 'Name similarity only — verified different individual; not the excluded party.', '{"demo": true, "mode": "demo", "matchCount": 1}'::jsonb, now() - interval '7 days', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- SCREENING MATCHES
INSERT INTO screening_matches (
  id, organization_id, screening_result_id, source,
  matched_name, matched_identifier, matched_program, matched_date,
  match_score, match_reason, raw_match, created_at
) VALUES
  ('f4000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'f3000001-0000-4000-8000-000000000002', 'oig', 'JANE DOE', NULL, 'Medicare/Medicaid', '2023-11-01'::date, 1, 'Normalized name match: "Jane Doe" ↔ "JANE DOE"', '{"demo": true, "name": "JANE DOE", "exclusionDate": "2023-11-01", "program": "Medicare/Medicaid"}'::jsonb, now() - interval '10 days'),
  ('f4000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'f3000001-0000-4000-8000-000000000005', 'oig', 'JOHN SMITH', NULL, 'Medicare/Medicaid', '2021-04-12'::date, 0.82, 'Partial name match on demo LEIE record (cleared as false positive)', '{"demo": true, "name": "JOHN SMITH", "exclusionDate": "2021-04-12", "program": "Medicare/Medicaid"}'::jsonb, now() - interval '7 days')
ON CONFLICT (id) DO NOTHING;


-- EXCLUSION MONITOR
INSERT INTO monitors (
  id, organization_id, name, monitor_type, target_type, target_id,
  workflow_instance_id, vendor_id, config, status, next_run_at, last_run_at,
  created_at, updated_at
) VALUES (
  'f6000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Exclusion monitoring — Harbor Equipment Co.',
  'exclusion_monitoring', 'screening_subject', 'f1000001-0000-4000-8000-000000000003',
  NULL, 'b0000001-0000-4000-8000-000000000002',
  jsonb_build_object('demo', true, 'screening_subject_id', 'f1000001-0000-4000-8000-000000000003', 'sources', jsonb_build_array('oig')),
  'active', now() + interval '28 days', now() - interval '2 days',
  now() - interval '21 days', now() - interval '2 days'
)
ON CONFLICT (id) DO NOTHING;

-- AUDIT LOGS
INSERT INTO audit_logs (
  organization_id, actor_type, actor_email, action, target_type, target_id, metadata, created_at
) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_subject.created', 'screening_subject', 'f1000001-0000-4000-8000-000000000001', '{"demo": true}'::jsonb, now() - interval '14 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_subject.created', 'screening_subject', 'f1000001-0000-4000-8000-000000000002', '{"demo": true}'::jsonb, now() - interval '10 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_subject.created', 'screening_subject', 'f1000001-0000-4000-8000-000000000003', '{"demo": true}'::jsonb, now() - interval '21 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_subject.created', 'screening_subject', 'f1000001-0000-4000-8000-000000000004', '{"demo": true}'::jsonb, now() - interval '7 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_check.started', 'screening_run', 'f2000001-0000-4000-8000-000000000001', '{"demo": true}'::jsonb, now() - interval '14 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_check.completed', 'screening_run', 'f2000001-0000-4000-8000-000000000001', '{"demo": true, "hasPotentialMatch": false}'::jsonb, now() - interval '14 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_result.no_match', 'screening_result', 'f3000001-0000-4000-8000-000000000001', '{"demo": true, "source": "oig"}'::jsonb, now() - interval '14 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_check.started', 'screening_run', 'f2000001-0000-4000-8000-000000000002', '{"demo": true}'::jsonb, now() - interval '10 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_check.completed', 'screening_run', 'f2000001-0000-4000-8000-000000000002', '{"demo": true, "hasPotentialMatch": true}'::jsonb, now() - interval '10 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_result.potential_match', 'screening_result', 'f3000001-0000-4000-8000-000000000002', '{"demo": true, "source": "oig"}'::jsonb, now() - interval '10 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_result.not_configured', 'screening_result', 'f3000001-0000-4000-8000-000000000003', '{"demo": true, "source": "sam"}'::jsonb, now() - interval '10 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_monitor.created', 'monitor', 'f6000001-0000-4000-8000-000000000001', '{"demo": true, "screeningSubjectId": "f1000001-0000-4000-8000-000000000003"}'::jsonb, now() - interval '21 days'),
  ('a0000000-0000-4000-8000-000000000001', 'system', NULL, 'exclusion_check.started', 'screening_run', 'f2000001-0000-4000-8000-000000000003', '{"demo": true, "runType": "scheduled"}'::jsonb, now() - interval '2 days'),
  ('a0000000-0000-4000-8000-000000000001', 'system', NULL, 'exclusion_check.completed', 'screening_run', 'f2000001-0000-4000-8000-000000000003', '{"demo": true, "hasPotentialMatch": false}'::jsonb, now() - interval '2 days'),
  ('a0000000-0000-4000-8000-000000000001', 'system', NULL, 'exclusion_result.no_match', 'screening_result', 'f3000001-0000-4000-8000-000000000004', '{"demo": true, "source": "oig"}'::jsonb, now() - interval '2 days'),
  ('a0000000-0000-4000-8000-000000000001', 'system', NULL, 'exclusion_monitor.run', 'monitor', 'f6000001-0000-4000-8000-000000000001', '{"demo": true}'::jsonb, now() - interval '2 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_check.started', 'screening_run', 'f2000001-0000-4000-8000-000000000004', '{"demo": true}'::jsonb, now() - interval '7 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_check.completed', 'screening_run', 'f2000001-0000-4000-8000-000000000004', '{"demo": true, "hasPotentialMatch": true}'::jsonb, now() - interval '7 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_result.potential_match', 'screening_result', 'f3000001-0000-4000-8000-000000000005', '{"demo": true, "source": "oig"}'::jsonb, now() - interval '7 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'exclusion_match.cleared', 'screening_result', 'f3000001-0000-4000-8000-000000000005', '{"demo": true, "reviewStatus": "false_positive"}'::jsonb, now() - interval '5 days');
