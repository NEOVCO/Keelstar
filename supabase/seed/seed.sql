-- Keelstar Platform Foundation
-- Migration 003: Seed data

-- ============================================================
-- ROLES
-- ============================================================

INSERT INTO roles (key, name, description, is_system) VALUES
  ('owner', 'Owner', 'Full control including billing and ownership transfer', true),
  ('admin', 'Admin', 'Manage members, settings, and all modules', true),
  ('manager', 'Manager', 'Create and manage workflows, approve tasks, view audit logs', true),
  ('member', 'Member', 'Create documents and participate in workflows', true),
  ('viewer', 'Viewer', 'Read-only access to documents, workflows, and monitors', true);

-- ============================================================
-- PERMISSIONS
-- ============================================================

INSERT INTO permissions (key, name, description, group_key) VALUES
  ('organization.manage', 'Manage Organization', 'Update organization settings and details', 'organization'),
  ('settings.manage', 'Manage Settings', 'Update organization settings', 'organization'),
  ('members.invite', 'Invite Members', 'Send invitations to join the organization', 'members'),
  ('members.manage', 'Manage Members', 'Update roles and remove members', 'members'),
  ('documents.view', 'View Documents', 'View documents and versions', 'documents'),
  ('documents.create', 'Create Documents', 'Upload and create documents', 'documents'),
  ('documents.update', 'Update Documents', 'Update document metadata and parsed fields', 'documents'),
  ('documents.delete', 'Delete Documents', 'Archive and delete documents', 'documents'),
  ('workflows.view', 'View Workflows', 'View workflows and tasks', 'workflows'),
  ('workflows.create', 'Create Workflows', 'Create new workflow instances', 'workflows'),
  ('workflows.update', 'Update Workflows', 'Update workflow status and tasks', 'workflows'),
  ('workflows.approve', 'Approve Workflows', 'Approve workflow steps and tasks', 'workflows'),
  ('monitors.view', 'View Monitors', 'View monitors and run history', 'monitors'),
  ('monitors.manage', 'Manage Monitors', 'Create and configure monitors', 'monitors'),
  ('notifications.view', 'View Notifications', 'View notification history', 'notifications'),
  ('audit.view', 'View Audit Logs', 'View and export audit logs', 'audit'),
  ('billing.manage', 'Manage Billing', 'Manage subscriptions and payment methods', 'billing');

-- ============================================================
-- ROLE PERMISSIONS
-- ============================================================

-- Owner: all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.key = 'owner';

-- Admin: all except billing.manage
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.key = 'admin' AND p.key != 'billing.manage';

-- Manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.key = 'manager' AND p.key IN (
  'documents.view', 'documents.create', 'documents.update', 'documents.delete',
  'workflows.view', 'workflows.create', 'workflows.update', 'workflows.approve',
  'monitors.view', 'monitors.manage',
  'notifications.view', 'audit.view'
);

-- Member
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.key = 'member' AND p.key IN (
  'documents.view', 'documents.create', 'documents.update',
  'workflows.view', 'workflows.create', 'workflows.update',
  'monitors.view', 'notifications.view'
);

-- Viewer
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.key = 'viewer' AND p.key IN (
  'documents.view', 'workflows.view', 'monitors.view', 'notifications.view'
);

-- ============================================================
-- PRODUCTS (MODULES)
-- ============================================================

INSERT INTO products (key, name, description, is_active) VALUES
  ('w9_collector', 'W-9 Collector', 'Collect signed W-9 forms from vendors', true),
  ('coi_tracker', 'COI Tracker', 'Track certificates of insurance', true),
  ('contract_renewal', 'Contract Renewal Tracker', 'Never miss a contract renewal deadline', true),
  ('contract_risk_scanner', 'Contract Risk Scanner', 'Identify risky clauses in contracts', true),
  ('exclusion_monitor', 'Exclusion Monitor', 'Monitor names against exclusion lists', true),
  ('vendor_packet', 'Vendor Packet Portal', 'Collect vendor onboarding documents', true),
  ('policy_acknowledgement', 'Policy Acknowledgement Tracker', 'Track employee policy acknowledgements', true),
  ('training_record', 'Training Record Tracker', 'Track training certifications', true),
  ('invoice_approval', 'Invoice Approval Lite', 'Simple invoice approval workflows', true),
  ('simple_signer', 'Simple Signer', 'Get documents signed quickly', true);

-- ============================================================
-- WORKFLOW TEMPLATES (SYSTEM)
-- ============================================================

INSERT INTO workflow_templates (organization_id, module_type, name, description, steps_config, is_system) VALUES
  (NULL, 'w9_collection', 'W-9 Collection', 'Collect W-9 from a vendor', '[{"order":1,"name":"Request W-9","type":"collect"},{"order":2,"name":"Review Submission","type":"review"},{"order":3,"name":"Monitor Compliance","type":"monitor"}]', true),
  (NULL, 'coi_tracking', 'COI Tracking', 'Track certificate of insurance', '[{"order":1,"name":"Request COI","type":"collect"},{"order":2,"name":"Review Coverage","type":"review"},{"order":3,"name":"Monitor Expiration","type":"monitor"}]', true),
  (NULL, 'contract_renewal', 'Contract Renewal', 'Track contract renewal dates', '[{"order":1,"name":"Upload Contract","type":"collect"},{"order":2,"name":"Extract Dates","type":"review"},{"order":3,"name":"Monitor Renewal","type":"monitor"}]', true),
  (NULL, 'contract_risk_scan', 'Contract Risk Scan', 'Scan contract for risk clauses', '[{"order":1,"name":"Upload Contract","type":"collect"},{"order":2,"name":"Risk Review","type":"review"},{"order":3,"name":"Approve","type":"approve"}]', true),
  (NULL, 'exclusion_monitoring', 'Exclusion Monitoring', 'Monitor names against exclusion lists', '[{"order":1,"name":"Add Names","type":"collect"},{"order":2,"name":"Run Check","type":"review"},{"order":3,"name":"Monitor Schedule","type":"monitor"}]', true),
  (NULL, 'vendor_packet', 'Vendor Packet', 'Collect vendor onboarding documents', '[{"order":1,"name":"Send Packet","type":"collect"},{"order":2,"name":"Review Documents","type":"review"},{"order":3,"name":"Monitor Completion","type":"monitor"}]', true),
  (NULL, 'policy_acknowledgement', 'Policy Acknowledgement', 'Track policy acknowledgements', '[{"order":1,"name":"Distribute Policy","type":"collect"},{"order":2,"name":"Track Acknowledgements","type":"review"},{"order":3,"name":"Monitor Overdue","type":"monitor"}]', true),
  (NULL, 'training_record', 'Training Record', 'Track training certifications', '[{"order":1,"name":"Add Record","type":"collect"},{"order":2,"name":"Verify Completion","type":"review"},{"order":3,"name":"Monitor Expiration","type":"monitor"}]', true),
  (NULL, 'invoice_approval', 'Invoice Approval', 'Route invoices for approval', '[{"order":1,"name":"Submit Invoice","type":"collect"},{"order":2,"name":"Review & Approve","type":"approve"},{"order":3,"name":"Monitor Overdue","type":"monitor"}]', true),
  (NULL, 'simple_signer', 'Simple Signer', 'Send document for signature', '[{"order":1,"name":"Send for Signature","type":"collect"},{"order":2,"name":"Verify Signature","type":"review"}]', true);

-- Demo organization (placeholder — real user assignment happens on first login)
INSERT INTO organizations (id, name, slug, settings) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo Organization', 'demo-org', '{"is_demo": true}');

-- Enable all modules for demo org
INSERT INTO organization_entitlements (organization_id, product_id, is_enabled, source)
SELECT '00000000-0000-0000-0000-000000000001', id, true, 'trial' FROM products;
