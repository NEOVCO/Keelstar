-- Keelstar W-9 Vendor Document Portal
-- Migration 003: vendors, reminders, evidence exports, W-9 extensions

-- ============================================================
-- EXTEND WORKFLOW INSTANCES
-- ============================================================

ALTER TABLE workflow_instances DROP CONSTRAINT IF EXISTS workflow_instances_status_check;
ALTER TABLE workflow_instances ADD CONSTRAINT workflow_instances_status_check
  CHECK (status IN (
    'draft', 'active', 'completed', 'cancelled', 'failed',
    'sent', 'opened', 'submitted', 'review_needed', 'approved',
    'rejected', 'needs_correction', 'overdue'
  ));

ALTER TABLE workflow_instances
  ADD COLUMN IF NOT EXISTS vendor_id uuid,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- ============================================================
-- EXTEND DOCUMENTS
-- ============================================================

ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_status_check;
ALTER TABLE documents ADD CONSTRAINT documents_status_check
  CHECK (status IN (
    'active', 'archived', 'deleted',
    'pending', 'uploaded', 'review_needed', 'approved', 'rejected'
  ));

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS workflow_instance_id uuid REFERENCES workflow_instances(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS vendor_id uuid,
  ADD COLUMN IF NOT EXISTS current_version_id uuid;

-- ============================================================
-- EXTEND DOCUMENT VERSIONS
-- ============================================================

ALTER TABLE document_versions
  ADD COLUMN IF NOT EXISTS uploaded_by_type text CHECK (uploaded_by_type IN ('user', 'external', 'system')),
  ADD COLUMN IF NOT EXISTS uploaded_by_email text,
  ADD COLUMN IF NOT EXISTS storage_bucket text DEFAULT 'documents';

-- ============================================================
-- EXTEND MAGIC LINKS
-- ============================================================

ALTER TABLE magic_links
  ADD COLUMN IF NOT EXISTS vendor_id uuid,
  ADD COLUMN IF NOT EXISTS external_email text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'used', 'expired', 'revoked', 'completed'));

-- ============================================================
-- VENDORS
-- ============================================================

CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  metadata jsonb DEFAULT '{}',
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendors_org_status ON vendors(organization_id, status);

ALTER TABLE workflow_instances
  ADD CONSTRAINT workflow_instances_vendor_id_fkey
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL;

ALTER TABLE documents
  ADD CONSTRAINT documents_vendor_id_fkey
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL;

ALTER TABLE magic_links
  ADD CONSTRAINT magic_links_vendor_id_fkey
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL;

-- ============================================================
-- REMINDERS
-- ============================================================

CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  workflow_instance_id uuid NOT NULL REFERENCES workflow_instances(id) ON DELETE CASCADE,
  type text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  sent_at timestamptz,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'cancelled', 'failed')),
  reminder_window text,
  recipient_email text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reminders_due ON reminders(organization_id, status, scheduled_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_reminders_window_unique
  ON reminders(workflow_instance_id, reminder_window)
  WHERE status IN ('scheduled', 'sent');

-- ============================================================
-- EVIDENCE EXPORTS
-- ============================================================

CREATE TABLE IF NOT EXISTS evidence_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  workflow_instance_id uuid NOT NULL REFERENCES workflow_instances(id) ON DELETE CASCADE,
  exported_by uuid,
  format text NOT NULL DEFAULT 'csv',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidence_exports_org ON evidence_exports(organization_id, created_at DESC);

-- ============================================================
-- USAGE TRACKING
-- ============================================================

CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  metric_key text NOT NULL,
  period_start date NOT NULL,
  count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (organization_id, metric_key, period_start)
);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_org ON usage_tracking(organization_id, metric_key, period_start);

-- ============================================================
-- ADDITIONAL INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_workflows_vendor ON workflow_instances(organization_id, vendor_id);
CREATE INDEX IF NOT EXISTS idx_documents_workflow ON documents(organization_id, workflow_instance_id);
CREATE INDEX IF NOT EXISTS idx_magic_links_workflow ON magic_links(organization_id, workflow_instance_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER tr_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_reminders_updated_at BEFORE UPDATE ON reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_usage_tracking_updated_at BEFORE UPDATE ON usage_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY vendors_select ON vendors FOR SELECT
  USING (is_org_member(organization_id));

CREATE POLICY vendors_insert ON vendors FOR INSERT
  WITH CHECK (has_permission(organization_id, 'workflows.create'));

CREATE POLICY vendors_update ON vendors FOR UPDATE
  USING (has_permission(organization_id, 'workflows.update'));

CREATE POLICY reminders_select ON reminders FOR SELECT
  USING (is_org_member(organization_id));

CREATE POLICY evidence_exports_select ON evidence_exports FOR SELECT
  USING (has_permission(organization_id, 'audit.view'));

CREATE POLICY usage_tracking_select ON usage_tracking FOR SELECT
  USING (is_org_member(organization_id));
