-- Migration 012: Policy Acknowledgement — performance index only (no new tables)

CREATE INDEX IF NOT EXISTS idx_workflows_policy_ack
  ON workflow_instances(organization_id, status, updated_at DESC)
  WHERE type = 'policy_acknowledgement';

CREATE INDEX IF NOT EXISTS idx_reminders_policy_scheduled
  ON reminders(type, status, scheduled_at)
  WHERE type IN ('policy_reminder', 'policy_overdue') AND status = 'scheduled';
