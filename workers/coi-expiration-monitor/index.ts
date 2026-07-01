/**
 * COI expiration monitor worker — run daily via cron
 * Usage: npm run worker:coi-monitor
 */
import { runCoiExpirationMonitor } from "../../src/lib/coi/expirationMonitor";
import { runContractRenewalMonitor } from "../../src/lib/contracts/renewalMonitor";

import { runVendorPacketMonitor } from "../../src/lib/vendor-packets/incompleteMonitor";
import { runExclusionMonitor } from "../../src/lib/exclusions/exclusionMonitor";
import { loadLeieCache } from "../../src/lib/exclusions/providers/oig-leie";

async function run() {
  try {
    const leie = await loadLeieCache();
    console.log(`OIG LEIE cache: ${leie.recordCount} records from ${leie.sourceUrl}`);
  } catch (err) {
    console.warn("OIG LEIE cache pre-warm failed:", err);
  }

  const coi = await runCoiExpirationMonitor();
  const contract = await runContractRenewalMonitor();
  const packet = await runVendorPacketMonitor();
  const exclusion = await runExclusionMonitor();
  console.log(
    `COI monitor: statusUpdates=${coi.updated} reminders=${coi.remindersSent} errors=${coi.errors}`
  );
  console.log(
    `Contract monitor: statusUpdates=${contract.updated} reminders=${contract.remindersSent} errors=${contract.errors}`
  );
  console.log(
    `Vendor packet monitor: statusUpdates=${packet.updated} reminders=${packet.remindersSent} errors=${packet.errors}`
  );
  console.log(`Exclusion monitor: processed=${exclusion.processed} errors=${exclusion.errors}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
