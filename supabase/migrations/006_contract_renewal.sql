-- Migration 006: Contract Renewal Tracker indexes

CREATE INDEX IF NOT EXISTS idx_monitors_contract_renewal_active
  ON monitors(organization_id, next_run_at)
  WHERE monitor_type = 'contract_renewal' AND status = 'active';
