import { accessSync } from "node:fs";
import { spawnSync } from "node:child_process";

function run(command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

let hasBuild = false;
try {
  accessSync(".next/BUILD_ID");
  hasBuild = true;
} catch {
  hasBuild = false;
}

if (!hasBuild) {
  console.log("No production build in .next — running next build...");
  // TypeScript/Tailwind live in devDependencies; install must include them.
  run("npm", ["ci", "--include=dev"], { NPM_CONFIG_PRODUCTION: "false" });
  run("npm", ["run", "build"]);
  accessSync(".next/BUILD_ID");
}

run("npx", ["next", "start"]);
