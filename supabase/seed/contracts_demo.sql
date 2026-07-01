-- Contract Renewal Tracker demo seed — run after demo_org.sql

INSERT INTO workflow_instances (id, organization_id, type, title, status, due_date, metadata, created_at, updated_at)
VALUES
  ('c2000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'contract_renewal', 'Cloud Hosting Agreement — Northline Supplies', 'renewal_monitoring', (now() + interval '180 days'), jsonb_build_object('contract_name', 'Cloud Hosting Agreement — Northline Supplies', 'counterparty', 'Northline Supplies', 'contract_type', 'subscription', 'renewal_date', (now() + interval '180 days')::date::text, 'notice_period_days', 60, 'latest_notice_date', (now() + interval '120 days')::date::text, 'auto_renewal', true), now(), now()),
  ('c2000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'contract_renewal', 'Office Lease — Harbor Equipment Co.', 'notice_window_open', (now() + interval '75 days'), jsonb_build_object('contract_name', 'Office Lease — Harbor Equipment Co.', 'counterparty', 'Harbor Equipment Co.', 'contract_type', 'lease', 'renewal_date', (now() + interval '75 days')::date::text, 'notice_period_days', 90, 'latest_notice_date', (now() + interval '15 days')::date::text, 'auto_renewal', true), now(), now()),
  ('c2000001-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'contract_renewal', 'CRM Subscription Agreement — Bright Oak Consulting', 'renewal_approaching', (now() + interval '20 days'), jsonb_build_object('contract_name', 'CRM Subscription Agreement — Bright Oak Consulting', 'counterparty', 'Bright Oak Consulting', 'contract_type', 'subscription', 'renewal_date', (now() + interval '20 days')::date::text, 'notice_period_days', 30, 'latest_notice_date', (now() - interval '10 days')::date::text, 'auto_renewal', true), now(), now()),
  ('c2000001-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'contract_renewal', 'Cleaning Services MSA — Clearpath Facilities', 'auto_renew_risk', (now() + interval '45 days'), jsonb_build_object('contract_name', 'Cleaning Services MSA — Clearpath Facilities', 'counterparty', 'Clearpath Facilities', 'contract_type', 'msa', 'renewal_date', (now() + interval '45 days')::date::text, 'notice_period_days', 60, 'latest_notice_date', (now() - interval '5 days')::date::text, 'auto_renewal', true), now(), now()),
  ('c2000001-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'contract_renewal', 'Legacy SaaS Agreement — OldVendor Ltd', 'expired', (now() - interval '14 days'), jsonb_build_object('contract_name', 'Legacy SaaS Agreement — OldVendor Ltd', 'counterparty', 'OldVendor Ltd', 'contract_type', 'vendor_agreement', 'renewal_date', (now() - interval '14 days')::date::text, 'notice_period_days', 30), now(), now()),
  ('c2000001-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000001', 'contract_renewal', 'NDA — Partner Co', 'draft', null, '{"contract_name":"NDA — Partner Co","counterparty":"Partner Co","contract_type":"nda"}', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO documents (id, organization_id, title, document_type, status, workflow_instance_id, created_at, updated_at)
VALUES
  ('d2000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Cloud Hosting Agreement — Northline Supplies', 'contract', 'renewal_monitoring', 'c2000001-0000-4000-8000-000000000001', now(), now()),
  ('d2000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Office Lease — Harbor Equipment Co.', 'contract', 'notice_window_open', 'c2000001-0000-4000-8000-000000000002', now(), now()),
  ('d2000001-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'CRM Subscription Agreement — Bright Oak Consulting', 'contract', 'renewal_approaching', 'c2000001-0000-4000-8000-000000000003', now(), now()),
  ('d2000001-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'Cleaning Services MSA — Clearpath Facilities', 'contract', 'auto_renew_risk', 'c2000001-0000-4000-8000-000000000004', now(), now()),
  ('d2000001-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'Legacy SaaS Agreement — OldVendor Ltd', 'contract', 'expired', 'c2000001-0000-4000-8000-000000000005', now(), now()),
  ('d2000001-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000001', 'NDA — Partner Co', 'contract', 'pending', 'c2000001-0000-4000-8000-000000000006', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO monitors (id, organization_id, name, monitor_type, target_type, target_id, workflow_instance_id, document_id, monitored_date, status, created_at, updated_at)
VALUES
  ('e2000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Renewal — Northline', 'contract_renewal', 'document', 'd2000001-0000-4000-8000-000000000001', 'c2000001-0000-4000-8000-000000000001', 'd2000001-0000-4000-8000-000000000001', (now() + interval '180 days'), 'active', now(), now()),
  ('e2000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Renewal — Harbor Lease', 'contract_renewal', 'document', 'd2000001-0000-4000-8000-000000000002', 'c2000001-0000-4000-8000-000000000002', 'd2000001-0000-4000-8000-000000000002', (now() + interval '75 days'), 'active', now(), now()),
  ('e2000001-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'Renewal — Bright Oak CRM', 'contract_renewal', 'document', 'd2000001-0000-4000-8000-000000000003', 'c2000001-0000-4000-8000-000000000003', 'd2000001-0000-4000-8000-000000000003', (now() + interval '20 days'), 'active', now(), now()),
  ('e2000001-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'Renewal — Clearpath MSA', 'contract_renewal', 'document', 'd2000001-0000-4000-8000-000000000004', 'c2000001-0000-4000-8000-000000000004', 'd2000001-0000-4000-8000-000000000004', (now() + interval '45 days'), 'active', now(), now()),
  ('e2000001-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'Renewal — OldVendor', 'contract_renewal', 'document', 'd2000001-0000-4000-8000-000000000005', 'c2000001-0000-4000-8000-000000000005', 'd2000001-0000-4000-8000-000000000005', (now() - interval '14 days'), 'expired', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO reminders (id, organization_id, workflow_instance_id, type, scheduled_at, status, reminder_window, recipient_email, metadata, created_at, updated_at)
VALUES
  ('f2000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'c2000001-0000-4000-8000-000000000002', 'contract_notice_internal', (now() + interval '7 days'), 'scheduled', 'notice_7d', 'admin@keelstar.test', '{"category":"contract_notice"}', now(), now()),
  ('f2000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'c2000001-0000-4000-8000-000000000003', 'contract_renewal_internal', (now() + interval '14 days'), 'scheduled', 'renew_14d', 'admin@keelstar.test', '{"category":"contract_renewal"}', now(), now()),
  ('f2000001-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'c2000001-0000-4000-8000-000000000004', 'contract_notice_internal', (now() - interval '3 days'), 'sent', 'notice_0d', 'admin@keelstar.test', '{"category":"contract_notice"}', now() - interval '3 days', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (organization_id, actor_type, actor_email, action, target_type, target_id, metadata, created_at)
VALUES
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'contract.created', 'workflow_instance', 'c2000001-0000-4000-8000-000000000001', '{}', now() - interval '90 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'contract.uploaded', 'document', 'd2000001-0000-4000-8000-000000000001', '{}', now() - interval '89 days'),
  ('a0000000-0000-4000-8000-000000000001', 'user', 'admin@keelstar.test', 'contract.monitor_created', 'workflow_instance', 'c2000001-0000-4000-8000-000000000001', '{}', now() - interval '88 days'),
  ('a0000000-0000-4000-8000-000000000001', 'system', null, 'contract.notice_window_opened', 'workflow_instance', 'c2000001-0000-4000-8000-000000000002', '{}', now() - interval '5 days'),
  ('a0000000-0000-4000-8000-000000000001', 'system', null, 'contract.auto_renew_risk_detected', 'workflow_instance', 'c2000001-0000-4000-8000-000000000004', '{}', now() - interval '5 days'),
  ('a0000000-0000-4000-8000-000000000001', 'system', null, 'contract.expired', 'workflow_instance', 'c2000001-0000-4000-8000-000000000005', '{}', now() - interval '14 days');
