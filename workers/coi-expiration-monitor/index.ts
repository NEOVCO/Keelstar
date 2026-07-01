/**
 * COI expiration monitor worker — run daily via cron
 * Usage: npm run worker:coi-monitor
 */
import { runCoiExpirationMonitor } from "../../src/lib/coi/expirationMonitor";
import { runContractRenewalMonitor } from "../../src/lib/contracts/renewalMonitor";

import { runVendorPacketMonitor } from "../../src/lib/vendor-packets/incompleteMonitor";

async function run() {
  const coi = await runCoiExpirationMonitor();
  const contract = await runContractRenewalMonitor();
  const packet = await runVendorPacketMonitor();
  console.log(
    `COI monitor: statusUpdates=${coi.updated} reminders=${coi.remindersSent} errors=${coi.errors}`
  );
  console.log(
    `Contract monitor: statusUpdates=${contract.updated} reminders=${contract.remindersSent} errors=${contract.errors}`
  );
  console.log(
    `Vendor packet monitor: statusUpdates=${packet.updated} reminders=${packet.remindersSent} errors=${packet.errors}`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
