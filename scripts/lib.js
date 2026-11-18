// Shared checks for the catalog and for the repositories it lists. No dependencies on purpose.
import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(import.meta.dirname, "..");
export const CATALOG = path.join(ROOT, ".agents", "plugins", "marketplace.json");
export const CLAUDE_MARKETPLACE = path.join(ROOT, ".claude-plugin", "marketplace.json");
export const AGENT_PLUGINS_SCHEMA = /^https:\/\/agent-plugins\.org\/schemas\/1\.\d+\.\d+\/plugin\.schema\.json$/;

export const OWNER = {
  name: "cbs Corporate Business Solutions Unternehmensberatung GmbH",
  email: "cp_opensource@cbs-consulting.de"
};
export const DESCRIPTION = "Agent skills and plugins from cbs Corporate Business Solutions.";

const CATEGORIES = ["Development", "Productivity", "Security", "Data", "Design", "Documentation"];
const INSTALLATION = ["AVAILABLE", "INSTALLED_BY_DEFAULT", "NOT_AVAILABLE"];
const AUTHENTICATION = ["ON_INSTALL", "ON_USE"];
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Reads a JSON file and names the file when it is not valid JSON. */
export function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`${path.relative(ROOT, file)}: ${error.message}`);
  }
}

/** Checks the catalog and returns one message per problem. */
export function validateCatalog(catalog) {
  const errors = [];
  if (catalog.name !== "cbs-consulting") errors.push('"name" must be "cbs-consulting"; users install plugins as <plugin>@cbs-consulting.');
  if (typeof catalog.interface?.displayName !== "string") errors.push('"interface.displayName" is missing.');
  if (!Array.isArray(catalog.plugins) || catalog.plugins.length === 0) {
    errors.push('"plugins" must list at least one plugin.');
    return errors;
  }
  const names = catalog.plugins.map((plugin) => plugin.name);
  const sorted = [...names].sort();
  if (names.join() !== sorted.join()) errors.push(`Plugins must be sorted by name: ${sorted.join(", ")}.`);
  for (const plugin of catalog.plugins) {
    const at = `Plugin "${plugin.name}"`;
    if (!isName(plugin.name)) errors.push(`${at}: the name must be kebab-case, at most 64 characters.`);
    if (names.filter((name) => name === plugin.name).length > 1) errors.push(`${at}: the name is listed twice.`);
    if (!plugin.description || plugin.description.length > 1024) errors.push(`${at}: the description must have 1 to 1024 characters.`);
    errors.push(...validateSource(plugin.source).map((message) => `${at}: ${message}`));
    if (!INSTALLATION.includes(plugin.policy?.installation)) errors.push(`${at}: "policy.installation" must be one of ${INSTALLATION.join(", ")}.`);
    if (!AUTHENTICATION.includes(plugin.policy?.authentication)) errors.push(`${at}: "policy.authentication" must be one of ${AUTHENTICATION.join(", ")}.`);
    if (!CATEGORIES.includes(plugin.category)) errors.push(`${at}: "category" must be one of ${CATEGORIES.join(", ")}.`);
  }
  return errors;
}

/** A plugin lives at the root of a public Git repository, optionally at a branch or tag. */
function validateSource(source) {
  if (source?.source !== "url") return ['"source" must be {"source": "url", "url": "https://<host>/<owner>/<repo>.git"}.'];
  const errors = [];
  if (!/^https:\/\/[^/\s]+\/[^\s]+\.git$/.test(source.url ?? "")) errors.push('"source.url" must be an https URL that ends in .git.');
  if (source.ref !== undefined && typeof source.ref !== "string") errors.push('"source.ref" must be a branch or tag name.');
  return errors;
}

/** Builds the marketplace that Claude Code and GitHub Copilot CLI read from the catalog. */
export function toClaudeMarketplace(catalog) {
  return {
    name: catalog.name,
    owner: OWNER,
    metadata: { description: DESCRIPTION },
    plugins: catalog.plugins.map((plugin) => ({
      name: plugin.name,
      description: plugin.description,
      source: plugin.source,
      category: plugin.category.toLowerCase()
    }))
  };
}

/** Formats JSON the way the repository stores it. */
export function stringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function isName(name) {
  return typeof name === "string" && name.length <= 64 && KEBAB.test(name);
}

/** Reads the YAML frontmatter of a SKILL.md: flat keys, plain or quoted values, and > or | blocks. */
export function parseFrontmatter(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  if (lines[0] !== "---") throw new Error("SKILL.md must start with a --- frontmatter line.");
  const end = lines.indexOf("---", 1);
  if (end === -1) throw new Error("The frontmatter has no closing --- line.");
  const data = {};
  let block;
  for (const line of lines.slice(1, end)) {
    if (block && (line.startsWith(" ") || line === "")) {
      block.lines.push(line.trim());
      continue;
    }
    if (block) data[block.key] = joinBlock(block);
    block = undefined;
    const match = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!match) continue; // nested keys such as metadata entries
    const [, key, raw] = match;
    if (/^[>|][+-]?$/.test(raw)) block = { key, folded: raw.startsWith(">"), lines: [] };
    else data[key] = unquote(raw.trim());
  }
  if (block) data[block.key] = joinBlock(block);
  return data;
}

function joinBlock({ folded, lines }) {
  return lines.join(folded ? " " : "\n").trim();
}

function unquote(value) {
  if (/^".*"$/.test(value)) return JSON.parse(value);
  if (/^'.*'$/.test(value)) return value.slice(1, -1).replace(/''/g, "'");
  return value;
}

/** Checks one skill directory against the Agent Skills standard. */
export function validateSkill(dir) {
  const name = path.basename(dir);
  const file = path.join(dir, "SKILL.md");
  if (!fs.existsSync(file)) return [`skills/${name}: SKILL.md is missing.`];
  let data;
  try {
    data = parseFrontmatter(fs.readFileSync(file, "utf8"));
  } catch (error) {
    return [`skills/${name}/SKILL.md: ${error.message}`];
  }
  const errors = [];
  if (data.name !== name) errors.push(`skills/${name}/SKILL.md: "name" must be "${name}", the name of its directory.`);
  if (!isName(data.name)) errors.push(`skills/${name}/SKILL.md: "name" must be kebab-case, at most 64 characters.`);
  if (!data.description || data.description.length > 1024) errors.push(`skills/${name}/SKILL.md: "description" must have 1 to 1024 characters.`);
  return errors;
}

/** Checks a checked-out plugin repository: an Agent Plugins plugin.json and at least one skill. */
export function validatePluginRepository(root, expectedName) {
  const errors = [];
  const manifest = path.join(root, "plugin.json");
  if (!fs.existsSync(manifest)) {
    errors.push("plugin.json is missing at the repository root (Agent Plugins 1.0).");
  } else {
    const plugin = readJsonQuiet(manifest, errors, "plugin.json");
    if (plugin) {
      if (!AGENT_PLUGINS_SCHEMA.test(plugin.$schema ?? "")) errors.push('plugin.json: "$schema" must be https://agent-plugins.org/schemas/1.0.0/plugin.schema.json.');
      if (plugin.name !== expectedName) errors.push(`plugin.json: "name" must be "${expectedName}", as in the catalog.`);
    }
  }
  const claude = path.join(root, ".claude-plugin", "plugin.json");
  if (fs.existsSync(claude)) {
    const plugin = readJsonQuiet(claude, errors, ".claude-plugin/plugin.json");
    if (plugin && plugin.name !== expectedName) errors.push(`.claude-plugin/plugin.json: "name" must be "${expectedName}", as in the catalog.`);
  }
  const skills = path.join(root, "skills");
  const dirs = fs.existsSync(skills)
    ? fs.readdirSync(skills, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => path.join(skills, entry.name))
    : [];
  if (dirs.length === 0) errors.push("skills/ has no skill. Add skills/<name>/SKILL.md.");
  for (const dir of dirs) errors.push(...validateSkill(dir));
  return errors;
}

function readJsonQuiet(file, errors, label) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${label}: ${error.message}`);
    return undefined;
  }
}
