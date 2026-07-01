-- Migration 008: OIG/SAM Exclusion Monitoring

-- ============================================================
-- SCREENING SUBJECTS
-- ============================================================

CREATE TABLE IF NOT EXISTS screening_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subject_type text NOT NULL CHECK (subject_type IN (
    'vendor', 'person', 'organization', 'contractor', 'employee', 'other'
  )),
  vendor_id uuid REFERENCES vendors(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  first_name text,
  last_name text,
  organization_name text,
  date_of_birth date,
  npi text,
  ein_last4 text,
  external_identifier text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN (
    'active', 'inactive', 'archived', 'monitoring', 'review_needed', 'matched', 'cleared'
  )),
  owner_id uuid,
  metadata jsonb DEFAULT '{}',
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_screening_subjects_org
  ON screening_subjects(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_screening_subjects_vendor
  ON screening_subjects(vendor_id) WHERE vendor_id IS NOT NULL;

-- ============================================================
-- SCREENING RUNS
-- ============================================================

CREATE TABLE IF NOT EXISTS screening_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  screening_subject_id uuid NOT NULL REFERENCES screening_subjects(id) ON DELETE CASCADE,
  workflow_instance_id uuid REFERENCES workflow_instances(id) ON DELETE SET NULL,
  monitor_id uuid REFERENCES monitors(id) ON DELETE SET NULL,
  run_type text NOT NULL CHECK (run_type IN ('ad_hoc', 'scheduled', 'manual_rerun')),
  sources text[] NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'running', 'completed', 'failed', 'cancelled'
  )),
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_screening_runs_subject
  ON screening_runs(screening_subject_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_screening_runs_org
  ON screening_runs(organization_id, created_at DESC);

-- ============================================================
-- SCREENING RESULTS
-- ============================================================

CREATE TABLE IF NOT EXISTS screening_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  screening_run_id uuid NOT NULL REFERENCES screening_runs(id) ON DELETE CASCADE,
  screening_subject_id uuid NOT NULL REFERENCES screening_subjects(id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('oig', 'sam')),
  result_status text NOT NULL CHECK (result_status IN (
    'no_match', 'potential_match', 'confirmed_match', 'failed', 'not_configured'
  )),
  match_count int NOT NULL DEFAULT 0,
  review_status text NOT NULL DEFAULT 'not_required' CHECK (review_status IN (
    'not_required', 'review_needed', 'cleared', 'confirmed', 'false_positive'
  )),
  reviewed_by uuid,
  reviewed_at timestamptz,
  review_notes text,
  raw_response jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_screening_results_run ON screening_results(screening_run_id);
CREATE INDEX IF NOT EXISTS idx_screening_results_subject ON screening_results(screening_subject_id);

-- ============================================================
-- SCREENING MATCHES
-- ============================================================

CREATE TABLE IF NOT EXISTS screening_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  screening_result_id uuid NOT NULL REFERENCES screening_results(id) ON DELETE CASCADE,
  source text NOT NULL,
  matched_name text,
  matched_identifier text,
  matched_program text,
  matched_date date,
  match_score numeric,
  match_reason text,
  raw_match jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_screening_matches_result ON screening_matches(screening_result_id);

-- ============================================================
-- MONITOR INDEX
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_monitors_exclusion_active
  ON monitors(organization_id, next_run_at)
  WHERE monitor_type = 'exclusion_monitoring' AND status = 'active';

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER tr_screening_subjects_updated_at
  BEFORE UPDATE ON screening_subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_screening_results_updated_at
  BEFORE UPDATE ON screening_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE screening_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY screening_subjects_select ON screening_subjects FOR SELECT
  USING (is_org_member(organization_id));

CREATE POLICY screening_subjects_insert ON screening_subjects FOR INSERT
  WITH CHECK (has_permission(organization_id, 'workflows.create'));

CREATE POLICY screening_subjects_update ON screening_subjects FOR UPDATE
  USING (has_permission(organization_id, 'workflows.update'));

CREATE POLICY screening_runs_select ON screening_runs FOR SELECT
  USING (is_org_member(organization_id));

CREATE POLICY screening_results_select ON screening_results FOR SELECT
  USING (is_org_member(organization_id));

CREATE POLICY screening_matches_select ON screening_matches FOR SELECT
  USING (is_org_member(organization_id));
