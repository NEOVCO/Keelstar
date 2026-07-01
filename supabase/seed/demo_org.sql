-- Acme Operations demo org — shared by W-9, COI, and Contract module seeds
-- Run after seed.sql

INSERT INTO organizations (id, name, slug, settings)
VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'Acme Operations',
  'acme-operations',
  '{"demo": true}'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO organization_entitlements (organization_id, product_id, is_enabled, source)
SELECT 'a0000000-0000-4000-8000-000000000001', id, true, 'trial'
FROM products
ON CONFLICT (organization_id, product_id) DO NOTHING;

-- Demo vendors (shared across modules)
INSERT INTO vendors (id, organization_id, name, email, status) VALUES
  ('b0000001-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Northline Supplies', 'ap@northline.test', 'active'),
  ('b0000001-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Harbor Equipment Co.', 'insurance@harbor.test', 'active'),
  ('b0000001-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'Bright Oak Consulting', 'ops@brightoak.test', 'active')
ON CONFLICT (id) DO NOTHING;
