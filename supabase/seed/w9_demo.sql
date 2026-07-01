-- W-9 Vendor Document Portal demo seed
-- Run after demo_org.sql

INSERT INTO workflow_instances (id, organization_id, type, title, status, vendor_id, due_date, metadata) VALUES
  ('c0000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'w9_collection', 'W-9 — Northline Supplies', 'sent', 'b0000001-0000-4000-8000-000000000001', now() + interval '10 days', '{"sent_at": "2026-06-20T10:00:00Z", "recipient_email": "ap@northline.test"}'),
  ('c0000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'w9_collection', 'W-9 — Bright Oak Consulting', 'submitted', 'b0000001-0000-4000-8000-000000000003', now() + interval '5 days', '{"sent_at": "2026-06-15T10:00:00Z", "submitted_at": "2026-06-22T14:00:00Z", "recipient_email": "ops@brightoak.test"}'),
  ('c0000001-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'w9_collection', 'W-9 — Harbor Equipment Co.', 'completed', 'b0000001-0000-4000-8000-000000000002', now() - interval '30 days', '{"sent_at": "2026-05-01T10:00:00Z", "submitted_at": "2026-05-10T10:00:00Z", "approved_at": "2026-05-12T10:00:00Z", "recipient_email": "insurance@harbor.test"}'),
  ('c0000001-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'w9_collection', 'W-9 — Northline Supplies (prior)', 'overdue', 'b0000001-0000-4000-8000-000000000001', now() - interval '7 days', '{"sent_at": "2026-06-01T10:00:00Z", "recipient_email": "ap@northline.test"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO documents (id, organization_id, title, document_type, status, workflow_instance_id, vendor_id) VALUES
  ('d0000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'W-9 — Bright Oak Consulting', 'w9', 'review_needed', 'c0000001-0000-4000-8000-000000000002', 'b0000001-0000-4000-8000-000000000003'),
  ('d0000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'W-9 — Harbor Equipment Co.', 'w9', 'approved', 'c0000001-0000-4000-8000-000000000003', 'b0000001-0000-4000-8000-000000000002')
ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (organization_id, actor_type, action, target_type, target_id, metadata) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'user', 'vendor.created', 'vendor', 'b0000001-0000-4000-8000-000000000001', '{"name": "Northline Supplies"}'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'w9_request.created', 'workflow_instance', 'c0000001-0000-4000-8000-000000000001', '{}'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'w9_request.sent', 'workflow_instance', 'c0000001-0000-4000-8000-000000000001', '{}'),
  ('a0000000-0000-4000-8000-000000000001', 'external', 'document.uploaded', 'document', 'd0000001-0000-4000-8000-000000000002', '{"filename": "w9.pdf"}'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'document.approved', 'document', 'd0000001-0000-4000-8000-000000000002', '{}');
