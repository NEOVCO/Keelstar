import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { createInAppNotification } from "@/lib/notifications/create";
import { assertUsageLimit, incrementUsage } from "@/lib/billing/checkUsageLimit";
import { trackEvent } from "@/lib/analytics/track";
import { extractTextFromVersion } from "@/lib/documents/textExtract";
import { scanWithHeuristics } from "./riskPatterns";
import { isOpenAiConfigured, scanWithOpenAi } from "./openaiScan";
import {
  CONTRACT_RISK_WORKFLOW_TYPE,
  CONTRACT_RISK_DOCUMENT_TYPE,
  type RiskFlag,
} from "./constants";

async function persistRiskFlags(
  organizationId: string,
  documentVersionId: string,
  flags: RiskFlag[],
  summary: string,
  scanSource: "ai" | "regex" | "ai+regex"
) {
  const supabase = createServiceClient();

  await supabase
    .from("document_parsed_fields")
    .delete()
    .eq("document_version_id", documentVersionId)
    .like("field_key", "risk_%");

  const rows = [
    {
      field_key: "risk_summary",
      field_value: summary,
      field_type: "text",
    },
    {
      field_key: "risk_flag_count",
      field_value: String(flags.length),
      field_type: "number",
    },
    {
      field_key: "risk_scan_source",
      field_value: scanSource,
      field_type: "text",
    },
    ...flags.flatMap((flag, i) => [
      {
        field_key: `risk_${i + 1}_category`,
        field_value: flag.category,
        field_type: "text",
      },
      {
        field_key: `risk_${i + 1}_severity`,
        field_value: flag.severity,
        field_type: "text",
      },
      {
        field_key: `risk_${i + 1}_excerpt`,
        field_value: flag.excerpt,
        field_type: "text",
      },
      {
        field_key: `risk_${i + 1}_recommendation`,
        field_value: flag.recommendation,
        field_type: "text",
      },
      {
        field_key: `risk_${i + 1}_source`,
        field_value: flag.source,
        field_type: "text",
      },
    ]),
  ];

  for (const row of rows) {
    await supabase.from("document_parsed_fields").insert({
      organization_id: organizationId,
      document_version_id: documentVersionId,
      field_key: row.field_key,
      field_value: row.field_value,
      field_type: row.field_type,
      extraction_source: scanSource === "regex" ? "regex" : "ai",
      confidence: scanSource === "regex" ? 0.75 : 0.85,
    });
  }
}

function mergeFlags(aiFlags: RiskFlag[], regexFlags: RiskFlag[]): RiskFlag[] {
  const merged = [...aiFlags];
  const seen = new Set(aiFlags.map((f) => `${f.category}:${f.excerpt.slice(0, 40).toLowerCase()}`));

  for (const flag of regexFlags) {
    const key = `${flag.category}:${flag.excerpt.slice(0, 40).toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(flag);
  }

  return merged.slice(0, 12);
}

export async function runContractRiskScan(workflowId: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const supabase = createServiceClient();

  await assertUsageLimit(ctx.organization.id, "contract_risk_scans", ctx.user.id);

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", CONTRACT_RISK_WORKFLOW_TYPE)
    .single();

  if (!workflow) throw new Error("Risk scan not found");
  if (!["uploaded", "review_needed", "draft"].includes(workflow.status)) {
    throw new Error("Risk scan cannot be run in its current status");
  }

  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", CONTRACT_RISK_DOCUMENT_TYPE)
    .maybeSingle();

  if (!document?.current_version_id) {
    throw new Error("Upload a contract document before running the scan");
  }

  const { data: version } = await supabase
    .from("document_versions")
    .select("id, mime_type, storage_path, filename")
    .eq("id", document.current_version_id)
    .single();

  if (!version?.storage_path) throw new Error("Document file not found");

  await supabase.from("workflow_instances").update({ status: "processing" }).eq("id", workflowId);
  await supabase.from("document_versions").update({ status: "processing" }).eq("id", version.id);

  let text = "";
  try {
    const extraction = await extractTextFromVersion({
      mimeType: version.mime_type,
      storagePath: version.storage_path,
      filename: version.filename,
    });
    text = extraction.text;
  } catch {
    text = "";
  }

  if (!text.trim()) {
    await supabase.from("workflow_instances").update({ status: "uploaded" }).eq("id", workflowId);
    throw new Error("Could not extract text from this document. Try a text-based PDF.");
  }

  const regexFlags = scanWithHeuristics(text);
  let aiFlags: RiskFlag[] = [];
  let summary = "Heuristic risk scan complete.";
  let scanSource: "ai" | "regex" | "ai+regex" = "regex";

  if (isOpenAiConfigured()) {
    try {
      const aiResult = await scanWithOpenAi(text);
      aiFlags = aiResult.flags;
      summary = aiResult.summary;
      scanSource = regexFlags.length ? "ai+regex" : "ai";
    } catch (err) {
      console.error("[contract-risk] OpenAI scan failed, using heuristics:", err);
      summary = "Heuristic risk scan complete (AI unavailable).";
    }
  }

  const flags = mergeFlags(aiFlags, regexFlags);
  if (!flags.length) {
    summary = "No significant risk patterns detected. Manual review still recommended.";
  }

  await persistRiskFlags(ctx.organization.id, version.id, flags, summary, scanSource);

  const highCount = flags.filter((f) => f.severity === "high").length;
  const scannedAt = new Date().toISOString();

  const { data: existingTask } = await supabase
    .from("tasks")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .in("status", ["pending", "in_progress"])
    .maybeSingle();

  if (existingTask) {
    await supabase
      .from("tasks")
      .update({
        title: `Review risk scan: ${workflow.title}`,
        status: "pending",
        description: `${flags.length} flag(s) found (${highCount} high severity). ${summary}`,
      })
      .eq("id", existingTask.id);
  } else {
    await supabase.from("tasks").insert({
      organization_id: ctx.organization.id,
      workflow_instance_id: workflowId,
      title: `Review risk scan: ${workflow.title}`,
      description: `${flags.length} flag(s) found (${highCount} high severity). ${summary}`,
      status: "pending",
      assignee_type: "member",
      assignee_member_id: null,
    });
  }

  await supabase
    .from("workflow_instances")
    .update({
      status: "review_needed",
      metadata: {
        ...(workflow.metadata as object),
        risk_summary: summary,
        risk_flag_count: flags.length,
        risk_high_count: highCount,
        risk_scan_source: scanSource,
        scanned_at: scannedAt,
        risk_flags: flags,
      },
    })
    .eq("id", workflowId);

  await supabase.from("document_versions").update({ status: "parsed" }).eq("id", version.id);
  await supabase.from("documents").update({ status: "review_needed" }).eq("id", document.id);

  await incrementUsage(ctx.organization.id, "contract_risk_scans");

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract_risk.scanned",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { flagCount: flags.length, highCount, scanSource },
  });

  if (ctx.user.email) {
    await createInAppNotification({
      organizationId: ctx.organization.id,
      recipientEmail: ctx.user.email,
      title: `Risk scan ready: ${workflow.title}`,
      body: `${flags.length} flag(s) — ${summary}`,
      href: `/app/workflows/${workflowId}`,
      templateKey: "contract_risk_scan_complete",
    }).catch(() => {});
  }

  trackEvent("contract_risk_scanned", { workflowId, flagCount: flags.length, scanSource });

  return { flagCount: flags.length, highCount, summary, scanSource, flags };
}

export function parseRiskFlagsFromMetadata(metadata: Record<string, unknown>): RiskFlag[] {
  const stored = metadata.risk_flags;
  if (Array.isArray(stored)) {
    return stored as RiskFlag[];
  }
  return [];
}
