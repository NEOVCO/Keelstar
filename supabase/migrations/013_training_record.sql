-- Migration 013: Training Record Tracker — performance indexes only

CREATE INDEX IF NOT EXISTS idx_workflows_training_record
  ON workflow_instances(organization_id, status, updated_at DESC)
  WHERE type = 'training_record';

CREATE INDEX IF NOT EXISTS idx_monitors_training_active
  ON monitors(organization_id, next_run_at)
  WHERE monitor_type = 'training_expiration' AND status = 'active';
