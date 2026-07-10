import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { sendEmail } from "@/lib/email/sendEmail";
import { createInAppNotification } from "@/lib/notifications/create";
import { assertUsageLimit, incrementUsage } from "@/lib/billing/checkUsageLimit";
import { trackEvent } from "@/lib/analytics/track";
import { getInvoiceFieldsForWorkflow } from "./saveFields";
import { getMemberEmail } from "./memberEmail";
import { scheduleInvoiceApprovalReminders } from "./scheduleReminders";
import { invoiceApprovalRequestEmail } from "@/lib/email/templates/invoices";
import { INVOICE_REQUIRED_FIELDS, INVOICE_WORKFLOW_TYPE } from "./constants";

export async function submitInvoiceForApproval(workflowId: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const supabase = createServiceClient();

  await assertUsageLimit(ctx.organization.id, "invoice_submissions", ctx.user.id);

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", INVOICE_WORKFLOW_TYPE)
    .single();

  if (error || !workflow) throw new Error("Invoice not found");
  if (!["review_needed", "draft", "rejected"].includes(workflow.status)) {
    throw new Error("Invoice cannot be submitted in its current status");
  }

  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", "invoice")
    .maybeSingle();

  if (!document?.current_version_id) {
    throw new Error("Upload an invoice document before submitting for approval");
  }

  const fields = await getInvoiceFieldsForWorkflow(workflowId, ctx.organization.id);
  const fieldMap = Object.fromEntries(fields.map((f) => [f.field_key, f.field_value ?? ""]));
  const metadata = workflow.metadata as Record<string, string | null>;

  for (const required of INVOICE_REQUIRED_FIELDS) {
    const value = fieldMap[required] ?? metadata[required];
    if (!value?.trim()) {
      throw new Error(`Required field missing: ${required.replace(/_/g, " ")}`);
    }
  }

  const approverMemberId = metadata.approver_member_id;
  if (!approverMemberId) throw new Error("Approver not configured");

  const approverEmail = await getMemberEmail(ctx.organization.id, approverMemberId);
  if (!approverEmail) throw new Error("Approver email not found");

  const approvalDue = workflow.due_date ? new Date(workflow.due_date) : new Date();

  const { data: existingTask } = await supabase
    .from("tasks")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .in("status", ["pending", "in_progress", "overdue"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let taskId = existingTask?.id;

  if (taskId) {
    await supabase
      .from("tasks")
      .update({
        assignee_type: "member",
        assignee_member_id: approverMemberId,
        status: "pending",
        due_date: approvalDue.toISOString(),
        title: `Approve: ${workflow.title}`,
      })
      .eq("id", taskId);
  } else {
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .insert({
        organization_id: ctx.organization.id,
        workflow_instance_id: workflowId,
        title: `Approve: ${workflow.title}`,
        description: `Invoice approval requested by ${ctx.user.email}`,
        status: "pending",
        assignee_type: "member",
        assignee_member_id: approverMemberId,
        due_date: approvalDue.toISOString(),
      })
      .select("id")
      .single();
    if (taskError) throw new Error(taskError.message);
    taskId = task.id;
  }

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", ctx.organization.id)
    .single();

  const workflowUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/app/workflows/${workflowId}`;
  const vendorName = fieldMap.vendor_name ?? metadata.vendor_name ?? "Vendor";
  const amount = fieldMap.invoice_amount ?? metadata.invoice_amount ?? "—";

  const emailContent = invoiceApprovalRequestEmail({
    organizationName: org?.name ?? "Organization",
    vendorName,
    invoiceAmount: amount,
    approvalDueDate: approvalDue.toLocaleDateString(),
    requesterName: ctx.user.email,
    workflowUrl,
  });

  await sendEmail({
    organizationId: ctx.organization.id,
    to: approverEmail,
    templateKey: emailContent.templateKey,
    subject: emailContent.subject,
    variables: {
      organizationName: org?.name ?? "",
      vendorName,
      invoiceAmount: amount,
      approvalDueDate: approvalDue.toISOString(),
      workflowUrl,
      requesterName: ctx.user.email ?? "",
    },
    recipientType: "member",
    recipientId: approverMemberId,
  });

  await createInAppNotification({
    organizationId: ctx.organization.id,
    recipientEmail: approverEmail,
    title: `Invoice approval: ${vendorName}`,
    body: `Amount ${amount} — approval due ${approvalDue.toLocaleDateString()}`,
    href: `/app/workflows/${workflowId}`,
    templateKey: "invoice_approval_requested",
  });

  const submittedAt = new Date().toISOString();
  await supabase
    .from("workflow_instances")
    .update({
      status: "submitted",
      metadata: {
        ...metadata,
        submitted_at: submittedAt,
        invoice_amount: amount,
        vendor_name: vendorName,
      },
    })
    .eq("id", workflowId);

  await scheduleInvoiceApprovalReminders(
    workflowId,
    ctx.organization.id,
    approverEmail,
    approvalDue
  );
  await incrementUsage(ctx.organization.id, "invoice_submissions");

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "invoice.submitted_for_approval",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { approverEmail, taskId },
  });

  trackEvent("invoice_approval_requested", { workflowId });

  return { taskId, approverEmail };
}
