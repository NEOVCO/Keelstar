import { expireStaleMagicLinks } from "@/lib/magic-links/revokeMagicLink";

async function main() {
  console.log("[cleanup-worker] Starting magic link cleanup");
  const count = await expireStaleMagicLinks();
  console.log(`[cleanup-worker] Expired ${count} stale magic links`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[cleanup-worker] Fatal error:", err);
  process.exit(1);
});
