import { runDueReminders } from "@/lib/workers/runDueReminders";

runDueReminders().catch((err) => {
  console.error(err);
  process.exit(1);
});
