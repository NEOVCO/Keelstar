-- Migration 005: COI Tracker — monitoring states, monitor extensions

-- ============================================================
-- EXTEND WORKFLOW STATUSES (COI monitoring)
-- ============================================================

ALTER TABLE workflow_instances DROP CONSTRAINT IF EXISTS workflow_instances_status_check;
ALTER TABLE workflow_instances ADD CONSTRAINT workflow_instances_status_check
  CHECK (status IN (
    'draft', 'active', 'completed', 'cancelled', 'failed',
    'sent', 'opened', 'submitted', 'review_needed', 'approved',
    'rejected', 'needs_correction', 'overdue',
    'active_monitoring', 'expiring_soon', 'expired'
  ));

-- ============================================================
-- EXTEND DOCUMENT STATUSES (COI expiration)
-- ============================================================

ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_status_check;
ALTER TABLE documents ADD CONSTRAINT documents_status_check
  CHECK (status IN (
    'active', 'archived', 'deleted',
    'pending', 'uploaded', 'review_needed', 'approved', 'rejected',
    'expiring_soon', 'expired'
  ));

-- ============================================================
-- EXTEND MONITORS (COI expiration)
-- ============================================================

ALTER TABLE monitors
  ADD COLUMN IF NOT EXISTS document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS vendor_id uuid REFERENCES vendors(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS monitored_date timestamptz;

ALTER TABLE monitors DROP CONSTRAINT IF EXISTS monitors_status_check;
ALTER TABLE monitors ADD CONSTRAINT monitors_status_check
  CHECK (status IN ('active', 'paused', 'completed', 'cancelled', 'failed', 'expired'));

CREATE INDEX IF NOT EXISTS idx_monitors_coi_active
  ON monitors(organization_id, next_run_at)
  WHERE monitor_type = 'coi_expiration' AND status = 'active';

CREATE INDEX IF NOT EXISTS idx_monitors_document
  ON monitors(document_id) WHERE document_id IS NOT NULL;

-- ============================================================
-- REMINDERS: allow COI expiration windows (metadata for internal)
-- Unique index on (workflow_instance_id, reminder_window) already exists
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_reminders_type_scheduled
  ON reminders(type, status, scheduled_at)
  WHERE status = 'scheduled';
