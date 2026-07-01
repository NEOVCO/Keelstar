/**
 * Contract Renewal vertical slice E2E smoke test (service role + domain libs).
 * Usage: npm run test:e2e-contracts
 */
import { createHash } from "crypto";
import {
  loadEnv,
  createServiceSupabase,
  getDemoOrg,
  getAdminUser,
  testPdfBuffer,
  fail,
} from "./e2e-env";
import { buildContractStoragePath } from "../src/lib/contracts/uploadContract";

loadEnv();

const supabase = createServiceSupabase();

async function main() {
  const steps: string[] = [];

  const org = await getDemoOrg(supabase);
  if (!org) fail("No demo organization found — run supabase/seed/demo_org.sql");

  const user = await getAdminUser(supabase);
  if (!user) fail("admin@keelstar.test not found");

  const contractName = `E2E Contract ${Date.now()}`;
  const counterparty = "E2E Counterparty LLC";

  const { data: workflow, error: wfErr } = await supabase
    .from("workflow_instances")
    .insert({
      organization_id: org.id,
      type: "contract_renewal",
      title: contractName,
      status: "draft",
      owner_id: user.id,
      created_by: user.id,
      metadata: { contract_name: contractName, counterparty },
    })
    .select("id")
    .single();
  if (wfErr) fail(`Create workflow: ${wfErr.message}`);
  steps.push(`workflow ${workflow!.id}`);

  const { data: document, error: docErr } = await supabase
    .from("documents")
    .insert({
      organization_id: org.id,
      title: contractName,
      document_type: "contract",
      status: "pending",
      workflow_instance_id: workflow!.id,
      created_by: user.id,
    })
    .select("id")
    .single();
  if (docErr) fail(`Create document: ${docErr.message}`);

  const pdf = testPdfBuffer("contract");
  const filename = "e2e-contract.pdf";
  const storagePath = buildContractStoragePath(org.id, workflow!.id, document!.id, 1, filename);
  const checksum = createHash("sha256").update(pdf).digest("hex");

  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(storagePath, pdf, { contentType: "application/pdf", upsert: false });
  if (storageError) fail(`Storage upload: ${storageError.message}`);

  const { data: version, error: versionErr } = await supabase
    .from("document_versions")
    .insert({
      document_id: document!.id,
      version_number: 1,
      storage_path: storagePath,
      filename,
      mime_type: "application/pdf",
      size_bytes: pdf.length,
      checksum,
      uploaded_by: user.id,
    })
    .select("id")
    .single();
  if (versionErr) fail(`Version insert: ${versionErr.message}`);
  steps.push(`upload ${version!.id}`);

  await supabase
    .from("workflow_instances")
    .update({ status: "review_needed" })
    .eq("id", workflow!.id);
  await supabase.from("documents").update({ status: "review_needed" }).eq("id", document!.id);

  const renewal = new Date();
  renewal.setMonth(renewal.getMonth() + 6);
  const renewalStr = renewal.toISOString().slice(0, 10);

  await supabase.from("document_parsed_fields").insert([
    {
      document_id: document!.id,
      document_version_id: version!.id,
      field_key: "contract_name",
      field_value: contractName,
      source: "manual",
    },
    {
      document_id: document!.id,
      document_version_id: version!.id,
      field_key: "counterparty",
      field_value: counterparty,
      source: "manual",
    },
    {
      document_id: document!.id,
      document_version_id: version!.id,
      field_key: "renewal_date",
      field_value: renewalStr,
      source: "manual",
    },
  ]);

  const { createContractRenewalMonitor } = await import("../src/lib/contracts/renewalMonitor");
  await createContractRenewalMonitor(
    workflow!.id,
    org.id,
    document!.id,
    renewal,
    user.id,
    contractName
  );

  await supabase
    .from("workflow_instances")
    .update({
      status: "active_monitoring",
      due_date: renewal.toISOString(),
      metadata: {
        contract_name: contractName,
        counterparty,
        renewal_date: renewalStr,
        approved_at: new Date().toISOString(),
      },
    })
    .eq("id", workflow!.id);
  await supabase.from("documents").update({ status: "active_monitoring" }).eq("id", document!.id);
  steps.push("activated monitoring");

  const { data: monitor } = await supabase
    .from("monitors")
    .select("id")
    .eq("workflow_instance_id", workflow!.id)
    .eq("monitor_type", "contract_renewal")
    .maybeSingle();
  if (!monitor) fail("Contract renewal monitor not created");

  console.log("Contract E2E PASS");
  for (const s of steps) console.log(" -", s);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
