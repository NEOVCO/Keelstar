/**
 * W-9 vertical slice E2E smoke test (service role + domain libs).
 * Usage: npm run test:e2e-w9
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnv();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const steps: string[] = [];
  const fail = (msg: string) => {
    console.error("FAIL:", msg);
    process.exit(1);
  };

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name")
    .ilike("name", "%acme%")
    .limit(1)
    .maybeSingle();
  if (!org) fail("No demo organization found — run seed.sql");

  const { data: adminList } = await supabase.auth.admin.listUsers();
  const user = adminList.users.find((u) => u.email === "admin@keelstar.test");
  if (!user) fail("admin@keelstar.test not found");

  const vendorName = `E2E Vendor ${Date.now()}`;
  const vendorEmail = `e2e+${Date.now()}@example.com`;

  const { data: vendor, error: vendorErr } = await supabase
    .from("vendors")
    .insert({
      organization_id: org.id,
      name: vendorName,
      email: vendorEmail,
      created_by: user.id,
    })
    .select("id")
    .single();
  if (vendorErr) fail(`Create vendor: ${vendorErr.message}`);
  steps.push(`vendor ${vendor!.id}`);

  const due = new Date();
  due.setDate(due.getDate() + 14);

  const { data: workflow, error: wfErr } = await supabase
    .from("workflow_instances")
    .insert({
      organization_id: org.id,
      type: "w9_collection",
      title: `W-9 — ${vendorName}`,
      status: "draft",
      vendor_id: vendor!.id,
      owner_id: user.id,
      created_by: user.id,
      due_date: due.toISOString(),
      metadata: { recipient_email: vendorEmail, requester_name: user.email },
    })
    .select("id")
    .single();
  if (wfErr) fail(`Create workflow: ${wfErr.message}`);

  const { data: document, error: docErr } = await supabase
    .from("documents")
    .insert({
      organization_id: org.id,
      title: `W-9 — ${vendorName}`,
      document_type: "w9",
      status: "pending",
      workflow_instance_id: workflow!.id,
      vendor_id: vendor!.id,
      created_by: user.id,
    })
    .select("id")
    .single();
  if (docErr) fail(`Create document: ${docErr.message}`);

  const { data: task, error: taskErr } = await supabase
    .from("tasks")
    .insert({
      organization_id: org.id,
      workflow_instance_id: workflow!.id,
      title: "Upload W-9",
      status: "pending",
      assignee_type: "external",
      due_date: due.toISOString(),
    })
    .select("id")
    .single();
  if (taskErr) fail(`Create task: ${taskErr.message}`);

  const { sendW9RequestEmail } = await import("../src/lib/w9/sendRequest");
  const sendResult = await sendW9RequestEmail(workflow!.id, {
    skipAuth: true,
    userId: user.id,
  });
  steps.push(`sent ${sendResult.magicLinkUrl}`);

  const token = sendResult.magicLinkUrl.split("/").pop()!;

  const { uploadExternalW9 } = await import("../src/lib/w9/uploadExternal");
  const pdf = Buffer.from("%PDF-1.4 e2e test w9\n");
  const uploadResult = await uploadExternalW9(token, {
    filename: "e2e-w9.pdf",
    mimeType: "application/pdf",
    sizeBytes: pdf.length,
    buffer: pdf,
  });
  steps.push(`upload ${uploadResult.versionId}`);

  const { processDocumentVersion } = await import("../src/lib/documents/extraction");
  await processDocumentVersion(uploadResult.versionId);
  steps.push("extraction");

  const { data: wfAfterUpload } = await supabase
    .from("workflow_instances")
    .select("status")
    .eq("id", workflow!.id)
    .single();
  if (!["submitted", "review_needed"].includes(wfAfterUpload?.status ?? "")) {
    fail(`Expected submitted/review_needed after upload, got ${wfAfterUpload?.status}`);
  }

  const approvedAt = new Date().toISOString();
  await supabase
    .from("workflow_instances")
    .update({ status: "completed", completed_at: approvedAt })
    .eq("id", workflow!.id);
  await supabase.from("documents").update({ status: "approved" }).eq("id", document!.id);
  steps.push("approved");

  const { data: finalWf } = await supabase
    .from("workflow_instances")
    .select("status")
    .eq("id", workflow!.id)
    .single();

  if (!["completed", "approved"].includes(finalWf?.status ?? "")) {
    fail(`Expected completed/approved, got ${finalWf?.status}`);
  }

  const { data: fields } = await supabase
    .from("document_parsed_fields")
    .select("id")
    .eq("document_version_id", uploadResult.versionId);
  if (!fields?.length) fail("No parsed fields after extraction");

  console.log("W-9 E2E PASS");
  for (const s of steps) console.log(" -", s);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
