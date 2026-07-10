-- Migration 016: Contract Risk Scanner — performance indexes

CREATE INDEX IF NOT EXISTS idx_workflows_contract_risk_scan
  ON workflow_instances(organization_id, status, updated_at DESC)
  WHERE type = 'contract_risk_scan';
