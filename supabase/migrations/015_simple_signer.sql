-- Migration 015: Simple Signer — workflow indexes

CREATE INDEX IF NOT EXISTS idx_workflows_simple_signer
  ON workflow_instances(organization_id, status, updated_at DESC)
  WHERE type = 'simple_signer';

CREATE INDEX IF NOT EXISTS idx_reminders_signer_scheduled
  ON reminders(type, status, scheduled_at)
  WHERE type IN ('signer_reminder', 'signer_overdue') AND status = 'scheduled';
