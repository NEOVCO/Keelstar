-- Migration 007: Vendor Packet Portal indexes

CREATE INDEX IF NOT EXISTS idx_monitors_vendor_packet_active
  ON monitors(organization_id, next_run_at)
  WHERE monitor_type = 'vendor_packet_incomplete' AND status = 'active';

CREATE INDEX IF NOT EXISTS idx_workflows_vendor_packet
  ON workflow_instances(organization_id, vendor_id, status)
  WHERE type = 'vendor_packet';
