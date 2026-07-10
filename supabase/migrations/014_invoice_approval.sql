-- Migration 014: Invoice Approval Lite — performance indexes only

CREATE INDEX IF NOT EXISTS idx_workflows_invoice_approval
  ON workflow_instances(organization_id, status, updated_at DESC)
  WHERE type = 'invoice_approval';

CREATE INDEX IF NOT EXISTS idx_reminders_invoice_scheduled
  ON reminders(type, status, scheduled_at)
  WHERE type IN ('invoice_reminder', 'invoice_overdue') AND status = 'scheduled';
