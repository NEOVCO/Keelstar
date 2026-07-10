import { runModuleMonitors } from "@/lib/workers/runModuleMonitors";

async function run() {
  await runModuleMonitors();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
