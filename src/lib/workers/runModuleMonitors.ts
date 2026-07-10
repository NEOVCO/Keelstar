import { runCoiExpirationMonitor } from "@/lib/coi/expirationMonitor";
import { runContractRenewalMonitor } from "@/lib/contracts/renewalMonitor";
import { runTrainingExpirationMonitor } from "@/lib/training/expirationMonitor";
import { runVendorPacketMonitor } from "@/lib/vendor-packets/incompleteMonitor";
import { runExclusionMonitor } from "@/lib/exclusions/exclusionMonitor";
import { loadLeieCache } from "@/lib/exclusions/providers/oig-leie";

export type ModuleMonitorResult = {
  coi: Awaited<ReturnType<typeof runCoiExpirationMonitor>>;
  contract: Awaited<ReturnType<typeof runContractRenewalMonitor>>;
  training: Awaited<ReturnType<typeof runTrainingExpirationMonitor>>;
  packet: Awaited<ReturnType<typeof runVendorPacketMonitor>>;
  exclusion: Awaited<ReturnType<typeof runExclusionMonitor>>;
};

/** COI, contracts, training, vendor packets, and OIG exclusion monitors. */
export async function runModuleMonitors(): Promise<ModuleMonitorResult> {
  try {
    const leie = await loadLeieCache();
    console.log(`[module-monitors] OIG LEIE cache: ${leie.recordCount} records`);
  } catch (err) {
    console.warn("[module-monitors] OIG LEIE cache pre-warm failed:", err);
  }

  const coi = await runCoiExpirationMonitor();
  const contract = await runContractRenewalMonitor();
  const training = await runTrainingExpirationMonitor();
  const packet = await runVendorPacketMonitor();
  const exclusion = await runExclusionMonitor();

  console.log(
    `[module-monitors] COI statusUpdates=${coi.updated} reminders=${coi.remindersSent} errors=${coi.errors}`
  );
  console.log(
    `[module-monitors] Contract statusUpdates=${contract.updated} reminders=${contract.remindersSent} errors=${contract.errors}`
  );
  console.log(
    `[module-monitors] Training statusUpdates=${training.updated} reminders=${training.remindersSent} errors=${training.errors}`
  );
  console.log(
    `[module-monitors] Vendor packet statusUpdates=${packet.updated} reminders=${packet.remindersSent} errors=${packet.errors}`
  );
  console.log(`[module-monitors] Exclusion processed=${exclusion.processed} errors=${exclusion.errors}`);

  return { coi, contract, training, packet, exclusion };
}
