// Clones every repository in the catalog and checks that agents can install its plugin.
// Needs git and network access; CI runs it in the "Plugin sources" job.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CATALOG, readJson, validatePluginRepository } from "./lib.js";

const only = process.argv.slice(2);
const plugins = readJson(CATALOG).plugins.filter((plugin) => only.length === 0 || only.includes(plugin.name));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "agentic-marketplace-"));
let failed = false;

try {
  for (const plugin of plugins) {
    const dir = path.join(temp, plugin.name);
    const { url, ref } = plugin.source;
    const args = ["clone", "--quiet", "--depth", "1", ...(ref ? ["--branch", ref] : []), url, dir];
    let errors;
    try {
      execFileSync("git", args, { stdio: ["ignore", "ignore", "pipe"], env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });
      errors = validatePluginRepository(dir, plugin.name);
    } catch (error) {
      errors = [`git clone ${url}${ref ? ` at ${ref}` : ""} failed: ${String(error.stderr ?? error.message).trim()}`];
    }
    if (errors.length === 0) {
      console.log(`ok ${plugin.name}`);
    } else {
      failed = true;
      for (const error of errors) console.error(`${plugin.name}: ${error}`);
    }
  }
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
