/**
 * COI vertical slice E2E smoke test (service role + domain libs).
 * Usage: npm run test:e2e-coi
 */
import {
  loadEnv,
  createServiceSupabase,
  getDemoOrg,
  getAdminUser,
  testPdfBuffer,
  fail,
} from "./e2e-env";

loadEnv();

const supabase = createServiceSupabase();

async function main() {
  const steps: string[] = [];

  const org = await getDemoOrg(supabase);
  if (!org) fail("No demo organization found — run supabase/seed/demo_org.sql");

  const user = await getAdminUser(supabase);
  if (!user) fail("admin@keelstar.test not found");

  const vendorName = `E2E COI Vendor ${Date.now()}`;
  const vendorEmail = `e2e-coi+${Date.now()}@example.com`;

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
      type: "coi_tracking",
      title: `COI — ${vendorName}`,
      status: "draft",
      vendor_id: vendor!.id,
      owner_id: user.id,
      created_by: user.id,
      due_date: due.toISOString(),
      metadata: { recipient_email: vendorEmail },
    })
    .select("id")
    .single();
  if (wfErr) fail(`Create workflow: ${wfErr.message}`);

  const { data: document, error: docErr } = await supabase
    .from("documents")
    .insert({
      organization_id: org.id,
      title: `COI — ${vendorName}`,
      document_type: "coi",
      status: "pending",
      workflow_instance_id: workflow!.id,
      vendor_id: vendor!.id,
      created_by: user.id,
    })
    .select("id")
    .single();
  if (docErr) fail(`Create document: ${docErr.message}`);

  const { error: taskErr } = await supabase.from("tasks").insert({
    organization_id: org.id,
    workflow_instance_id: workflow!.id,
    title: "Upload COI",
    status: "pending",
    assignee_type: "external",
    due_date: due.toISOString(),
  });
  if (taskErr) fail(`Create task: ${taskErr.message}`);

  const { sendCoiRequestEmail } = await import("../src/lib/coi/sendRequest");
  const sendResult = await sendCoiRequestEmail(workflow!.id, {
    skipAuth: true,
    userId: user.id,
  });
  steps.push(`sent ${sendResult.magicLinkUrl}`);

  const token = sendResult.magicLinkUrl.split("/").pop()!;

  const { uploadExternalCoi } = await import("../src/lib/coi/uploadExternal");
  const pdf = testPdfBuffer("coi");
  const uploadResult = await uploadExternalCoi(token, {
    filename: "e2e-coi.pdf",
    mimeType: "application/pdf",
    sizeBytes: pdf.length,
    buffer: pdf,
  });
  steps.push(`upload ${uploadResult.versionId}`);

  const { data: wfAfterUpload } = await supabase
    .from("workflow_instances")
    .select("status")
    .eq("id", workflow!.id)
    .single();
  if (!["submitted", "review_needed"].includes(wfAfterUpload?.status ?? "")) {
    fail(`Expected submitted/review_needed after upload, got ${wfAfterUpload?.status}`);
  }

  const expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 1);

  const { createCoiExpirationMonitor } = await import("../src/lib/coi/expirationMonitor");
  await createCoiExpirationMonitor(
    workflow!.id,
    org.id,
    document!.id,
    vendor!.id,
    expiration,
    user.id
  );

  await supabase
    .from("workflow_instances")
    .update({
      status: "active_monitoring",
      metadata: {
        recipient_email: vendorEmail,
        expiration_date: expiration.toISOString().slice(0, 10),
        insured_name: vendorName,
        policy_type: "general_liability",
        approved_at: new Date().toISOString(),
      },
    })
    .eq("id", workflow!.id);

  await supabase.from("documents").update({ status: "active_monitoring" }).eq("id", document!.id);
  steps.push("approved + monitoring");

  const { data: monitor } = await supabase
    .from("monitors")
    .select("id, status")
    .eq("workflow_instance_id", workflow!.id)
    .eq("monitor_type", "coi_expiration")
    .maybeSingle();
  if (!monitor) fail("COI expiration monitor not created");

  console.log("COI E2E PASS");
  for (const s of steps) console.log(" -", s);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
