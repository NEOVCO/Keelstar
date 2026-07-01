-- Keelstar Platform Foundation
-- Migration 002: RLS helper functions and policies

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION is_org_member(org_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
      AND user_id = auth.uid()
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION has_permission(org_id uuid, permission_key text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM organization_members om
    JOIN member_roles mr ON mr.member_id = om.id
    JOIN role_permissions rp ON rp.role_id = mr.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE om.organization_id = org_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
      AND p.key = permission_key
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_member_id(org_id uuid)
RETURNS uuid AS $$
  SELECT id FROM organization_members
  WHERE organization_id = org_id AND user_id = auth.uid() AND status = 'active'
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- ENABLE RLS ON ALL TENANT TABLES
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_parsed_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitor_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_jobs ENABLE ROW LEVEL SECURITY;

-- roles, permissions, role_permissions, products, webhook_events are system tables (no RLS)

-- ============================================================
-- ORGANIZATIONS
-- ============================================================

CREATE POLICY org_select ON organizations FOR SELECT
  USING (is_org_member(id));

CREATE POLICY org_insert ON organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY org_update ON organizations FOR UPDATE
  USING (has_permission(id, 'organization.manage'));

-- ============================================================
-- ORGANIZATION MEMBERS
-- ============================================================

CREATE POLICY org_members_select ON organization_members FOR SELECT
  USING (is_org_member(organization_id));

CREATE POLICY org_members_insert ON organization_members FOR INSERT
  WITH CHECK (has_permission(organization_id, 'members.invite') OR auth.uid() = user_id);

CREATE POLICY org_members_update ON organization_members FOR UPDATE
  USING (has_permission(organization_id, 'members.manage'));

-- ============================================================
-- MEMBER ROLES
-- ============================================================

CREATE POLICY member_roles_select ON member_roles FOR SELECT
  USING (is_org_member(organization_id));

CREATE POLICY member_roles_insert ON member_roles FOR INSERT
  WITH CHECK (has_permission(organization_id, 'members.manage'));

CREATE POLICY member_roles_delete ON member_roles FOR DELETE
  USING (has_permission(organization_id, 'members.manage'));

-- ============================================================
-- ORGANIZATION INVITATIONS
-- ============================================================

CREATE POLICY org_invitations_select ON organization_invitations FOR SELECT
  USING (is_org_member(organization_id));

CREATE POLICY org_invitations_insert ON organization_invitations FOR INSERT
  WITH CHECK (has_permission(organization_id, 'members.invite'));

CREATE POLICY org_invitations_update ON organization_invitations FOR UPDATE
  USING (has_permission(organization_id, 'members.manage'));

-- ============================================================
-- DOCUMENTS
-- ============================================================

CREATE POLICY documents_select ON documents FOR SELECT
  USING (has_permission(organization_id, 'documents.view'));

CREATE POLICY documents_insert ON documents FOR INSERT
  WITH CHECK (has_permission(organization_id, 'documents.create'));

CREATE POLICY documents_update ON documents FOR UPDATE
  USING (has_permission(organization_id, 'documents.update'));

CREATE POLICY documents_delete ON documents FOR DELETE
  USING (has_permission(organization_id, 'documents.delete'));

-- ============================================================
-- DOCUMENT VERSIONS
-- ============================================================

CREATE POLICY doc_versions_select ON document_versions FOR SELECT
  USING (has_permission(organization_id, 'documents.view'));

CREATE POLICY doc_versions_insert ON document_versions FOR INSERT
  WITH CHECK (has_permission(organization_id, 'documents.create'));

CREATE POLICY doc_versions_update ON document_versions FOR UPDATE
  USING (has_permission(organization_id, 'documents.update'));

-- ============================================================
-- DOCUMENT PARSED FIELDS
-- ============================================================

CREATE POLICY parsed_fields_select ON document_parsed_fields FOR SELECT
  USING (has_permission(organization_id, 'documents.view'));

CREATE POLICY parsed_fields_insert ON document_parsed_fields FOR INSERT
  WITH CHECK (has_permission(organization_id, 'documents.create'));

CREATE POLICY parsed_fields_update ON document_parsed_fields FOR UPDATE
  USING (has_permission(organization_id, 'documents.update'));

-- ============================================================
-- DOCUMENT EVENTS
-- ============================================================

CREATE POLICY doc_events_select ON document_events FOR SELECT
  USING (has_permission(organization_id, 'documents.view'));

CREATE POLICY doc_events_insert ON document_events FOR INSERT
  WITH CHECK (is_org_member(organization_id));

-- ============================================================
-- WORKFLOW TEMPLATES
-- ============================================================

CREATE POLICY wf_templates_select ON workflow_templates FOR SELECT
  USING (organization_id IS NULL OR is_org_member(organization_id));

CREATE POLICY wf_templates_insert ON workflow_templates FOR INSERT
  WITH CHECK (organization_id IS NULL OR has_permission(organization_id, 'workflows.create'));

-- ============================================================
-- WORKFLOW INSTANCES
-- ============================================================

CREATE POLICY wf_instances_select ON workflow_instances FOR SELECT
  USING (has_permission(organization_id, 'workflows.view'));

CREATE POLICY wf_instances_insert ON workflow_instances FOR INSERT
  WITH CHECK (has_permission(organization_id, 'workflows.create'));

CREATE POLICY wf_instances_update ON workflow_instances FOR UPDATE
  USING (has_permission(organization_id, 'workflows.update'));

-- ============================================================
-- WORKFLOW STEPS
-- ============================================================

CREATE POLICY wf_steps_select ON workflow_steps FOR SELECT
  USING (has_permission(organization_id, 'workflows.view'));

CREATE POLICY wf_steps_insert ON workflow_steps FOR INSERT
  WITH CHECK (has_permission(organization_id, 'workflows.create'));

CREATE POLICY wf_steps_update ON workflow_steps FOR UPDATE
  USING (has_permission(organization_id, 'workflows.update'));

-- ============================================================
-- TASKS
-- ============================================================

CREATE POLICY tasks_select ON tasks FOR SELECT
  USING (has_permission(organization_id, 'workflows.view'));

CREATE POLICY tasks_insert ON tasks FOR INSERT
  WITH CHECK (has_permission(organization_id, 'workflows.create'));

CREATE POLICY tasks_update ON tasks FOR UPDATE
  USING (has_permission(organization_id, 'workflows.update'));

-- ============================================================
-- TASK ASSIGNMENTS
-- ============================================================

CREATE POLICY task_assignments_select ON task_assignments FOR SELECT
  USING (has_permission(organization_id, 'workflows.view'));

CREATE POLICY task_assignments_insert ON task_assignments FOR INSERT
  WITH CHECK (has_permission(organization_id, 'workflows.create'));

-- ============================================================
-- EXTERNAL PARTICIPANTS
-- ============================================================

CREATE POLICY external_select ON external_participants FOR SELECT
  USING (has_permission(organization_id, 'workflows.view'));

CREATE POLICY external_insert ON external_participants FOR INSERT
  WITH CHECK (has_permission(organization_id, 'workflows.create'));

-- ============================================================
-- MAGIC LINKS (internal users can create; service role validates)
-- ============================================================

CREATE POLICY magic_links_select ON magic_links FOR SELECT
  USING (has_permission(organization_id, 'workflows.view'));

CREATE POLICY magic_links_insert ON magic_links FOR INSERT
  WITH CHECK (has_permission(organization_id, 'workflows.create'));

CREATE POLICY magic_links_update ON magic_links FOR UPDATE
  USING (has_permission(organization_id, 'workflows.update'));

-- ============================================================
-- MONITORS
-- ============================================================

CREATE POLICY monitors_select ON monitors FOR SELECT
  USING (has_permission(organization_id, 'monitors.view'));

CREATE POLICY monitors_insert ON monitors FOR INSERT
  WITH CHECK (has_permission(organization_id, 'monitors.manage'));

CREATE POLICY monitors_update ON monitors FOR UPDATE
  USING (has_permission(organization_id, 'monitors.manage'));

CREATE POLICY monitors_delete ON monitors FOR DELETE
  USING (has_permission(organization_id, 'monitors.manage'));

-- ============================================================
-- MONITOR RUNS
-- ============================================================

CREATE POLICY monitor_runs_select ON monitor_runs FOR SELECT
  USING (has_permission(organization_id, 'monitors.view'));

CREATE POLICY monitor_runs_insert ON monitor_runs FOR INSERT
  WITH CHECK (is_org_member(organization_id));

-- ============================================================
-- REMINDER RULES
-- ============================================================

CREATE POLICY reminder_rules_select ON reminder_rules FOR SELECT
  USING (has_permission(organization_id, 'monitors.view'));

CREATE POLICY reminder_rules_insert ON reminder_rules FOR INSERT
  WITH CHECK (has_permission(organization_id, 'monitors.manage'));

CREATE POLICY reminder_rules_update ON reminder_rules FOR UPDATE
  USING (has_permission(organization_id, 'monitors.manage'));

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE POLICY notifications_select ON notifications FOR SELECT
  USING (is_org_member(organization_id));

CREATE POLICY notifications_insert ON notifications FOR INSERT
  WITH CHECK (is_org_member(organization_id));

CREATE POLICY notifications_update ON notifications FOR UPDATE
  USING (is_org_member(organization_id));

-- ============================================================
-- EMAIL EVENTS
-- ============================================================

CREATE POLICY email_events_select ON email_events FOR SELECT
  USING (is_org_member(organization_id));

CREATE POLICY email_events_insert ON email_events FOR INSERT
  WITH CHECK (is_org_member(organization_id));

-- ============================================================
-- AUDIT LOGS (append-only for users)
-- ============================================================

CREATE POLICY audit_logs_select ON audit_logs FOR SELECT
  USING (has_permission(organization_id, 'audit.view'));

CREATE POLICY audit_logs_insert ON audit_logs FOR INSERT
  WITH CHECK (is_org_member(organization_id));

-- No UPDATE or DELETE policies — append-only

-- ============================================================
-- SUBSCRIPTIONS & ENTITLEMENTS
-- ============================================================

CREATE POLICY subscriptions_select ON subscriptions FOR SELECT
  USING (has_permission(organization_id, 'billing.manage') OR is_org_member(organization_id));

CREATE POLICY entitlements_select ON organization_entitlements FOR SELECT
  USING (is_org_member(organization_id));

-- ============================================================
-- BACKGROUND JOBS
-- ============================================================

CREATE POLICY bg_jobs_select ON background_jobs FOR SELECT
  USING (organization_id IS NULL OR is_org_member(organization_id));

CREATE POLICY bg_jobs_insert ON background_jobs FOR INSERT
  WITH CHECK (organization_id IS NULL OR is_org_member(organization_id));

-- ============================================================
-- STORAGE BUCKET (documents)
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  26214400, -- 25MB
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY storage_documents_select ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND is_org_member((storage.foldername(name))[1]::uuid)
  );

CREATE POLICY storage_documents_insert ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND has_permission((storage.foldername(name))[1]::uuid, 'documents.create')
  );

CREATE POLICY storage_documents_delete ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND has_permission((storage.foldername(name))[1]::uuid, 'documents.delete')
  );
