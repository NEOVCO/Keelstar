-- COI demo seed — run after demo_org.sql and w9_demo.sql

INSERT INTO workflow_instances (id, organization_id, type, title, status, vendor_id, due_date, metadata, created_at, updated_at)
VALUES
  ('c1000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'coi_tracking', 'COI — Northline Supplies', 'review_needed', 'b0000001-0000-4000-8000-000000000001', (now() + interval '7 days'), '{"recipient_email":"ap@northline.test","submitted_at":"2026-06-20T10:00:00Z"}', now(), now()),
  ('c1000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'coi_tracking', 'COI — Harbor Equipment Co.', 'expiring_soon', 'b0000001-0000-4000-8000-000000000002', (now() + interval '14 days'), jsonb_build_object('recipient_email', 'insurance@harbor.test', 'approved_at', '2026-01-15T10:00:00Z', 'expiration_date', (now() + interval '25 days')::text, 'insured_name', 'Harbor Equipment Co.', 'policy_type', 'general_liability'), now(), now()),
  ('c1000001-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'coi_tracking', 'COI — Bright Oak Consulting', 'expired', 'b0000001-0000-4000-8000-000000000003', (now() - interval '30 days'), jsonb_build_object('recipient_email', 'ops@brightoak.test', 'approved_at', '2025-06-01T10:00:00Z', 'expiration_date', (now() - interval '10 days')::text, 'insured_name', 'Bright Oak Consulting', 'policy_type', 'professional_liability'), now(), now()),
  ('c1000001-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'coi_tracking', 'COI — Northline Supplies (renewal)', 'sent', 'b0000001-0000-4000-8000-000000000001', (now() + interval '14 days'), jsonb_build_object('recipient_email', 'ap@northline.test', 'sent_at', now()::text), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO documents (id, organization_id, title, document_type, status, workflow_instance_id, vendor_id, created_at, updated_at)
VALUES
  ('d1000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'COI — Northline Supplies', 'coi', 'review_needed', 'c1000001-0000-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', now(), now()),
  ('d1000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'COI — Harbor Equipment Co.', 'coi', 'expiring_soon', 'c1000001-0000-4000-8000-000000000002', 'b0000001-0000-4000-8000-000000000002', now(), now()),
  ('d1000001-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'COI — Bright Oak Consulting', 'coi', 'expired', 'c1000001-0000-4000-8000-000000000003', 'b0000001-0000-4000-8000-000000000003', now(), now()),
  ('d1000001-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'COI — Northline Supplies (renewal)', 'coi', 'pending', 'c1000001-0000-4000-8000-000000000004', 'b0000001-0000-4000-8000-000000000001', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO monitors (id, organization_id, name, monitor_type, target_type, target_id, workflow_instance_id, document_id, vendor_id, monitored_date, status, created_at, updated_at)
VALUES
  ('e1000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'COI expiration — Harbor', 'coi_expiration', 'document', 'd1000001-0000-4000-8000-000000000002', 'c1000001-0000-4000-8000-000000000002', 'd1000001-0000-4000-8000-000000000002', 'b0000001-0000-4000-8000-000000000002', (now() + interval '25 days'), 'active', now(), now()),
  ('e1000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'COI expiration — Bright Oak', 'coi_expiration', 'document', 'd1000001-0000-4000-8000-000000000003', 'c1000001-0000-4000-8000-000000000003', 'd1000001-0000-4000-8000-000000000003', 'b0000001-0000-4000-8000-000000000003', (now() - interval '10 days'), 'expired', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (organization_id, actor_type, actor_email, action, target_type, target_id, metadata, created_at)
VALUES
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'coi_request.created', 'workflow_instance', 'c1000001-0000-4000-8000-000000000001', '{}', now() - interval '2 days'),
  ('a0000000-0000-4000-8000-000000000001', 'external', 'ap@northline.test', 'coi_document.uploaded', 'document', 'd1000001-0000-4000-8000-000000000001', '{}', now() - interval '1 day'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'coi_document.approved', 'document', 'd1000001-0000-4000-8000-000000000002', '{}', now() - interval '30 days'),
  ('a0000000-0000-4000-8000-000000000001', 'system', null, 'coi_status.expiring_soon', 'workflow_instance', 'c1000001-0000-4000-8000-000000000002', '{}', now() - interval '5 days'),
  ('a0000000-0000-4000-8000-000000000001', 'system', null, 'coi_status.expired', 'workflow_instance', 'c1000001-0000-4000-8000-000000000003', '{}', now() - interval '10 days');
