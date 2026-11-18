// Writes .claude-plugin/marketplace.json from the catalog in .agents/plugins/marketplace.json.
// Run it with `npm run sync` after every change to the catalog; the tests fail when it is stale.
import fs from "node:fs";
import { CATALOG, CLAUDE_MARKETPLACE, readJson, stringify, toClaudeMarketplace, validateCatalog } from "./lib.js";

const catalog = readJson(CATALOG);
const errors = validateCatalog(catalog);
if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}
fs.writeFileSync(CLAUDE_MARKETPLACE, stringify(toClaudeMarketplace(catalog)));
console.log("Wrote .claude-plugin/marketplace.json.");
