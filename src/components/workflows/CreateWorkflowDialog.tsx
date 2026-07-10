"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UsageLimitAlert } from "@/components/billing/UsageLimitAlert";
import { CcSenderOption } from "@/components/email/CcSenderOption";
import { MODULES } from "@/lib/modules/modules";
import { W9_WORKFLOW_TYPE } from "@/lib/w9/constants";
import { PACKET_CHECKLIST_ITEMS } from "@/lib/vendor-packets/constants";
import { recordTypeFromMetadata, vendorRecordToSubjectType } from "@/lib/vendors/types";
import { isWorkforceVendor } from "@/lib/vendors/workforce";
import {
  defaultTitleForParty,
  getWorkflowCreateMode,
  OPERATIONAL_WORKFLOW_TYPE,
  usesAutoTitle,
  type WorkflowCreateMode,
} from "@/lib/workflow/createFormConfig";

type PartyOption = {
  id: string;
  name: string;
  email?: string | null;
  metadata?: unknown;
};

function dueDateIso(date: string): string | undefined {
  if (!date) return undefined;
  const due = new Date(date);
  due.setHours(23, 59, 59, 999);
  return due.toISOString();
}

function directoryParties(parties: PartyOption[]) {
  return parties.filter((p) => !isWorkforceVendor(p) || recordTypeFromMetadata(p.metadata) === "contractor");
}

function peopleParties(parties: PartyOption[]) {
  return parties.filter((p) => isWorkforceVendor(p));
}

function partiesForMode(mode: WorkflowCreateMode, parties: PartyOption[]) {
  switch (mode) {
    case "people_request":
      return peopleParties(parties);
    case "directory_request":
    case "vendor_packet":
      return directoryParties(parties);
    case "exclusion":
      return parties;
    default:
      return parties;
  }
}

function modeHint(mode: WorkflowCreateMode): string {
  switch (mode) {
    case "directory_request":
      return "Select someone from your directory and where to send the request.";
    case "vendor_packet":
      return "Choose a directory entry, checklist items, and recipient email.";
    case "contract":
      return "Name the contract and counterparty to start renewal tracking.";
    case "people_request":
      return "Select an employee or contractor from your People roster.";
    case "exclusion":
      return "Run an OIG exclusion check for a directory or people record.";
    default:
      return "Create a lightweight operational workflow with a review task.";
  }
}

export function CreateWorkflowDialog({
  defaultOpen = false,
  defaultType,
  senderEmail,
}: {
  defaultOpen?: boolean;
  defaultType?: string;
  senderEmail?: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);
  const [parties, setParties] = useState<PartyOption[]>([]);
  const [loadingParties, setLoadingParties] = useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] = useState(defaultType ?? OPERATIONAL_WORKFLOW_TYPE);
  const [partyId, setPartyId] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [contractName, setContractName] = useState("");
  const [ccMe, setCcMe] = useState(false);
  const [sendImmediately, setSendImmediately] = useState(true);
  const [createMonitor, setCreateMonitor] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    w9: true,
    coi: true,
    msa: false,
    banking: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitError, setLimitError] = useState<string | null>(null);

  const workflowTypes = useMemo(
    () => [
      { value: OPERATIONAL_WORKFLOW_TYPE, label: "Operational workflow" },
      ...MODULES.filter((m) => m.status === "active").map((m) => ({
        value: m.workflowType,
        label: m.name,
      })),
    ],
    []
  );

  const mode = getWorkflowCreateMode(type);
  const selectableParties = useMemo(() => partiesForMode(mode, parties), [mode, parties]);
  const selectedParty = selectableParties.find((p) => p.id === partyId);

  const loadParties = useCallback(async () => {
    setLoadingParties(true);
    try {
      const res = await fetch("/api/vendors");
      const json = await res.json();
      if (json.success) setParties(json.data.vendors ?? []);
    } finally {
      setLoadingParties(false);
    }
  }, []);

  useEffect(() => {
    if (open) void loadParties();
  }, [open, loadParties]);

  useEffect(() => {
    if (selectedParty) {
      setRecipientEmail(selectedParty.email ?? "");
      if (usesAutoTitle(mode)) {
        setTitle(defaultTitleForParty(type, selectedParty.name));
      }
    }
  }, [selectedParty, mode, type]);

  useEffect(() => {
    setPartyId("");
    setRecipientEmail("");
    setError(null);
    setLimitError(null);
  }, [type]);

  function close() {
    setOpen(false);
    setError(null);
    setLimitError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLimitError(null);

    try {
      let workflowId: string | undefined;

      if (mode === "directory_request") {
        if (!partyId) throw new Error("Select a party from your directory");
        const endpoint = type === W9_WORKFLOW_TYPE ? "/api/w9/requests" : "/api/coi/requests";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendorId: partyId,
            recipientEmail: recipientEmail || undefined,
            dueDate: dueDateIso(dueDate),
            message: message || undefined,
            sendImmediately,
            ccMe: ccMe || undefined,
          }),
        });
        const json = await res.json();
        if (!json.success) {
          if (res.status === 402) setLimitError(json.error ?? "Usage limit reached");
          else throw new Error(json.error ?? "Failed to create request");
          return;
        }
        workflowId = json.data.workflow.id as string;
      } else if (mode === "vendor_packet") {
        if (!partyId) throw new Error("Select a directory entry");
        const checklistKeys = Object.entries(checklist)
          .filter(([, on]) => on)
          .map(([key]) => key);
        if (!checklistKeys.length) throw new Error("Select at least one checklist item");

        const res = await fetch("/api/vendor-packets/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendorId: partyId,
            recipientEmail: recipientEmail || undefined,
            dueDate: dueDateIso(dueDate),
            message: message || undefined,
            checklistKeys,
            sendImmediately,
            ccMe: ccMe || undefined,
          }),
        });
        const json = await res.json();
        if (!json.success) {
          if (res.status === 402) setLimitError(json.error ?? "Usage limit reached");
          else throw new Error(json.error ?? "Failed to create vendor packet");
          return;
        }
        workflowId = json.data.workflow.id as string;
      } else if (mode === "contract") {
        const res = await fetch("/api/contracts/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contractName: contractName || title,
            counterparty: counterparty || selectedParty?.name || undefined,
            vendorId: partyId || undefined,
            notes: description || undefined,
          }),
        });
        const json = await res.json();
        if (!json.success) {
          if (res.status === 402) setLimitError(json.error ?? "Usage limit reached");
          else throw new Error(json.error ?? "Failed to create contract workflow");
          return;
        }
        workflowId = json.data.workflow.id as string;
      } else if (mode === "exclusion") {
        if (!partyId || !selectedParty) throw new Error("Select a person or directory entry");
        const recordType = recordTypeFromMetadata(selectedParty.metadata);
        const res = await fetch("/api/exclusions/screen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subjectType: vendorRecordToSubjectType(recordType),
            vendorId: partyId,
            displayName: selectedParty.name,
            firstName: (selectedParty.metadata as { first_name?: string })?.first_name,
            lastName: (selectedParty.metadata as { last_name?: string })?.last_name,
            npi: (selectedParty.metadata as { npi?: string })?.npi,
            createMonthlyMonitor: createMonitor,
            saveSubject: true,
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error ?? "Screening failed");
        const resultId = json.data?.resultIds?.[0] as string | undefined;
        close();
        router.push(resultId ? `/app/exclusions/results/${resultId}` : "/app/apps/exclusions");
        router.refresh();
        return;
      } else {
        const resolvedTitle =
          mode === "people_request" && selectedParty
            ? defaultTitleForParty(type, selectedParty.name)
            : title;

        if (!resolvedTitle.trim()) throw new Error("Title is required");
        if (mode === "people_request" && !partyId) {
          throw new Error("Select a person from your roster");
        }

        const res = await fetch("/api/workflows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            title: resolvedTitle,
            dueDate: dueDateIso(dueDate),
            vendorId: partyId || undefined,
            description: description || message || undefined,
            metadata:
              mode === "people_request" && recipientEmail
                ? { recipient_email: recipientEmail }
                : undefined,
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error ?? "Failed to create workflow");
        workflowId = json.data.workflow.id as string;
      }

      if (!workflowId) throw new Error("Workflow was not created");
      close();
      router.push(`/app/workflows/${workflowId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workflow");
    } finally {
      setLoading(false);
    }
  }

  const submitLabel =
    mode === "exclusion"
      ? "Run check"
      : mode === "directory_request" || mode === "vendor_packet"
        ? sendImmediately
          ? "Create and send"
          : "Create draft"
        : "Create workflow";

  const partyLabel =
    mode === "people_request" || mode === "exclusion"
      ? "Person"
      : mode === "contract"
        ? "Linked directory entry (optional)"
        : "Directory party";

  const addPartyHref =
    mode === "people_request" ? "/app/people/new" : "/app/vendors/new";

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="secondary">
        New workflow
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-surface p-6 shadow-lg">
        <h2 className="text-body font-medium text-primary">Create workflow</h2>
        <p className="mt-1 text-body-sm text-secondary">{modeHint(mode)}</p>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="text-caption text-secondary">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
            >
              {workflowTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {mode === "contract" && (
            <>
              <div>
                <label className="text-caption text-secondary">Contract name</label>
                <Input
                  value={contractName}
                  onChange={(e) => {
                    setContractName(e.target.value);
                    setTitle(e.target.value);
                  }}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-caption text-secondary">Counterparty</label>
                <Input
                  value={counterparty}
                  onChange={(e) => setCounterparty(e.target.value)}
                  placeholder="Company or person name"
                  className="mt-1"
                />
              </div>
            </>
          )}

          {mode === "generic" && (
            <div>
              <label className="text-caption text-secondary">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
            </div>
          )}

          {mode !== "contract" && mode !== "generic" && (
            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <label className="text-caption text-secondary">{partyLabel}</label>
                <Link href={addPartyHref} className="text-caption text-accent hover:underline">
                  Add new
                </Link>
              </div>
              <select
                value={partyId}
                onChange={(e) => setPartyId(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
              >
                <option value="">
                  {loadingParties ? "Loading…" : `Select ${partyLabel.toLowerCase()}`}
                </option>
                {selectableParties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.email ? ` (${p.email})` : ""}
                  </option>
                ))}
              </select>
              {!loadingParties && selectableParties.length === 0 && (
                <p className="mt-1 text-caption text-tertiary">
                  No records yet.{" "}
                  <Link href={addPartyHref} className="text-accent hover:underline">
                    Add one first
                  </Link>
                  .
                </p>
              )}
            </div>
          )}

          {mode === "generic" && (
            <div>
              <label className="text-caption text-secondary">Link to record (optional)</label>
              <select
                value={partyId}
                onChange={(e) => setPartyId(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
              >
                <option value="">None</option>
                {parties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === "contract" && (
            <div>
              <label className="text-caption text-secondary">{partyLabel}</label>
              <select
                value={partyId}
                onChange={(e) => {
                  setPartyId(e.target.value);
                  const p = parties.find((x) => x.id === e.target.value);
                  if (p && !counterparty) setCounterparty(p.name);
                }}
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
              >
                <option value="">None</option>
                {directoryParties(parties).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(mode === "directory_request" ||
            mode === "vendor_packet" ||
            mode === "people_request") && (
            <div>
              <label className="text-caption text-secondary">Recipient email</label>
              <Input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required={mode !== "people_request"}
                className="mt-1"
              />
            </div>
          )}

          {mode !== "exclusion" && (
            <div>
              <label className="text-caption text-secondary">Due date (optional)</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {(mode === "directory_request" || mode === "vendor_packet") && (
            <div>
              <label className="text-caption text-secondary">Message (optional)</label>
              <Input value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1" />
            </div>
          )}

          {mode === "vendor_packet" && (
            <div>
              <p className="mb-2 text-caption text-secondary">Checklist items</p>
              <div className="space-y-2">
                {PACKET_CHECKLIST_ITEMS.map((item) => (
                  <label key={item.key} className="flex items-center gap-2 text-body-sm text-secondary">
                    <input
                      type="checkbox"
                      checked={checklist[item.key] ?? false}
                      onChange={(e) =>
                        setChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {(mode === "generic" || mode === "people_request" || mode === "contract") && (
            <div>
              <label className="text-caption text-secondary">Notes (optional)</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {mode === "exclusion" && (
            <label className="flex items-center gap-2 text-body-sm text-secondary">
              <input
                type="checkbox"
                checked={createMonitor}
                onChange={(e) => setCreateMonitor(e.target.checked)}
              />
              Create monthly monitor
            </label>
          )}

          {(mode === "directory_request" || mode === "vendor_packet") && (
            <>
              <label className="flex items-center gap-2 text-body-sm text-secondary">
                <input
                  type="checkbox"
                  checked={sendImmediately}
                  onChange={(e) => setSendImmediately(e.target.checked)}
                />
                Send request email immediately
              </label>
              {sendImmediately && (
                <CcSenderOption checked={ccMe} onChange={setCcMe} senderEmail={senderEmail} />
              )}
            </>
          )}

          {usesAutoTitle(mode) && selectedParty && (
            <p className="text-caption text-tertiary">
              Title: <span className="text-secondary">{defaultTitleForParty(type, selectedParty.name)}</span>
            </p>
          )}

          {limitError && <UsageLimitAlert message={limitError} />}
          {error && <p className="text-body-sm text-error">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                ((mode === "directory_request" || mode === "vendor_packet" || mode === "people_request" || mode === "exclusion") &&
                  !partyId) ||
                (mode === "contract" && !contractName.trim()) ||
                (mode === "generic" && !title.trim())
              }
            >
              {loading ? "Working…" : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
