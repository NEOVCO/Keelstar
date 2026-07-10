import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { sendEmail } from "@/lib/email/sendEmail";
import { createInAppNotification } from "@/lib/notifications/create";
import { trackEvent } from "@/lib/analytics/track";
import { cancelInvoiceReminders } from "./scheduleReminders";
import {
  invoiceApprovedEmail,
  invoiceRejectedEmail,
} from "@/lib/email/templates/invoices";
import { INVOICE_WORKFLOW_TYPE } from "./constants";

async function getPendingApprovalTask(workflowId: string, organizationId: string) {
  const supabase = createServiceClient();
  const { data: task } = await supabase
    .from("tasks")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .eq("organization_id", organizationId)
    .in("status", ["pending", "in_progress", "overdue"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return task;
}

export async function approveInvoice(workflowId: string, notes?: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", INVOICE_WORKFLOW_TYPE)
    .single();

  if (!workflow) throw new Error("Invoice not found");
  if (!["submitted", "overdue", "review_needed"].includes(workflow.status)) {
    throw new Error("Invoice is not awaiting approval");
  }

  const task = await getPendingApprovalTask(workflowId, ctx.organization.id);
  const approvedAt = new Date().toISOString();

  if (task) {
    await supabase
      .from("tasks")
      .update({
        status: "completed",
        completed_at: approvedAt,
        completed_by_type: "user",
        completed_by_id: ctx.user.id,
      })
      .eq("id", task.id);
  }

  await cancelInvoiceReminders(workflowId, ctx.organization.id);

  const metadata = workflow.metadata as Record<string, string | null>;
  await supabase
    .from("workflow_instances")
    .update({
      status: "approved",
      completed_at: approvedAt,
      metadata: {
        ...metadata,
        approved_at: approvedAt,
        approved_by: ctx.user.email,
        approval_notes: notes ?? null,
      },
    })
    .eq("id", workflowId);

  await supabase
    .from("documents")
    .update({ status: "approved" })
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", "invoice");

  await notifySubmitter(workflow, "approved", notes);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "invoice.approved",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { notes },
  });

  trackEvent("invoice_approved", { workflowId });
  return { success: true };
}

export async function rejectInvoice(workflowId: string, reason: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const supabase = createServiceClient();

  if (!reason?.trim()) throw new Error("Rejection reason is required");

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", INVOICE_WORKFLOW_TYPE)
    .single();

  if (!workflow) throw new Error("Invoice not found");
  if (!["submitted", "overdue", "review_needed"].includes(workflow.status)) {
    throw new Error("Invoice is not awaiting approval");
  }

  const task = await getPendingApprovalTask(workflowId, ctx.organization.id);
  const rejectedAt = new Date().toISOString();

  if (task) {
    await supabase
      .from("tasks")
      .update({
        status: "completed",
        completed_at: rejectedAt,
        completed_by_type: "user",
        completed_by_id: ctx.user.id,
        metadata: { outcome: "rejected", reason },
      })
      .eq("id", task.id);
  }

  await cancelInvoiceReminders(workflowId, ctx.organization.id);

  const metadata = workflow.metadata as Record<string, string | null>;
  await supabase
    .from("workflow_instances")
    .update({
      status: "rejected",
      metadata: {
        ...metadata,
        rejected_at: rejectedAt,
        rejected_by: ctx.user.email,
        rejection_reason: reason,
      },
    })
    .eq("id", workflowId);

  await notifySubmitter(workflow, "rejected", reason);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "invoice.rejected",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { reason },
  });

  trackEvent("invoice_rejected", { workflowId });
  return { success: true };
}

async function notifySubmitter(
  workflow: { id: string; organization_id: string; created_by: string | null; metadata: unknown; title: string },
  outcome: "approved" | "rejected",
  detail?: string
) {
  const supabase = createServiceClient();
  const metadata = workflow.metadata as Record<string, string | null>;
  const submitterId = workflow.created_by;
  if (!submitterId) return;

  const {
    data: { user },
  } = await supabase.auth.admin.getUserById(submitterId);
  const submitterEmail = user?.email ?? metadata.submitted_by;
  if (!submitterEmail) return;

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", workflow.organization_id)
    .single();

  const workflowUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/app/workflows/${workflow.id}`;
  const vendorName = metadata.vendor_name ?? "Vendor";
  const amount = metadata.invoice_amount ?? "—";

  const emailContent =
    outcome === "approved"
      ? invoiceApprovedEmail({
          organizationName: org?.name ?? "",
          vendorName,
          invoiceAmount: amount,
          workflowUrl,
        })
      : invoiceRejectedEmail({
          organizationName: org?.name ?? "",
          vendorName,
          invoiceAmount: amount,
          rejectionReason: detail,
          workflowUrl,
        });

  await sendEmail({
    organizationId: workflow.organization_id,
    to: submitterEmail,
    templateKey: emailContent.templateKey,
    subject: emailContent.subject,
    variables: {
      organizationName: org?.name ?? "",
      vendorName,
      invoiceAmount: amount,
      workflowUrl,
      rejectionReason: detail ?? "",
    },
    recipientType: "member",
    recipientId: submitterId,
  }).catch(() => {});

  await createInAppNotification({
    organizationId: workflow.organization_id,
    recipientEmail: submitterEmail,
    title: outcome === "approved" ? `Invoice approved: ${vendorName}` : `Invoice rejected: ${vendorName}`,
    body: detail,
    href: `/app/workflows/${workflow.id}`,
    templateKey: outcome === "approved" ? "invoice_approved" : "invoice_rejected",
  }).catch(() => {});
}

export async function cancelInvoice(workflowId: string, reason?: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("id, metadata")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!workflow) throw new Error("Invoice not found");

  await cancelInvoiceReminders(workflowId, ctx.organization.id);

  await supabase
    .from("tasks")
    .update({ status: "cancelled" })
    .eq("workflow_instance_id", workflowId)
    .in("status", ["pending", "in_progress", "overdue"]);

  await supabase
    .from("workflow_instances")
    .update({
      status: "cancelled",
      metadata: {
        ...(workflow.metadata as object),
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason ?? null,
      },
    })
    .eq("id", workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "invoice.cancelled",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { reason },
  });

  return { success: true };
}
