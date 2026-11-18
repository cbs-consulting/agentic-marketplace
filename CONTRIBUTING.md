# Contributing

Thank you for helping to improve the cbs agent skills catalog. This guide explains how to add a
tool or change an entry. The rules that tests and CI enforce are collected in
[AGENTS.md](AGENTS.md); they apply to people and coding agents alike.

By taking part in this project you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md). To
report a security problem, follow the [Security Policy](SECURITY.md) instead of opening an issue.

## Reporting bugs and requesting features

Search the [existing issues](https://github.com/cbs-consulting/agentic-marketplace/issues) first. A
problem with what a skill tells the agent belongs in the tool's repository. Problems with
installing from the catalog belong here.

## Preparing a tool's repository

The catalog lists cbs open source tools only. Before you add one, its repository needs:

1. **A skill** in `skills/<name>/SKILL.md`, following the [Agent Skills](https://agentskills.io)
   standard. The frontmatter has a `name` equal to the folder name (kebab-case, at most 64
   characters) and a `description` of at most 1024 characters that says what the skill does and
   when to use it. Add `license: Apache-2.0`.
2. **A `plugin.json`** at the repository root, in the [Agent Plugins 1.0](https://agent-plugins.org)
   format. Codex and GitHub Copilot read it:

   ```json
   {
     "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
     "name": "eslint-plugin-cds",
     "version": "0.1.0",
     "description": "Sets up @cbs-consulting/eslint-plugin-cds in SAP CAP projects and lints .cds files as you edit them.",
     "author": {
       "name": "cbs Corporate Business Solutions Unternehmensberatung GmbH",
       "email": "cp_opensource@cbs-consulting.de"
     },
     "homepage": "https://github.com/cbs-consulting/eslint-plugin-cds#readme",
     "repository": "https://github.com/cbs-consulting/eslint-plugin-cds",
     "license": "Apache-2.0",
     "keywords": ["sap", "cap", "cds", "eslint"]
   }
   ```

3. **Optionally a `.claude-plugin/plugin.json`** with the same `name`, for Claude Code's own
   metadata. Claude Code finds `skills/` without it.

The tool's repository does not need a marketplace file of its own; this catalog is the
marketplace. A skill should not repeat what the tool's docs say. Point the agent to the docs and
keep the skill about when and how to use the tool.

## Adding a tool to the catalog

1. Fork the repository and create a branch from `main`.
2. Add an entry to `.agents/plugins/marketplace.json`, sorted by name:

   ```json
   {
     "name": "eslint-plugin-cds",
     "description": "Sets up @cbs-consulting/eslint-plugin-cds in SAP CAP projects and lints .cds files as you edit them.",
     "source": {
       "source": "url",
       "url": "https://github.com/cbs-consulting/eslint-plugin-cds.git"
     },
     "policy": {
       "installation": "AVAILABLE",
       "authentication": "ON_INSTALL"
     },
     "category": "Development"
   }
   ```

   The `name` is the `name` in the tool's `plugin.json`. Leave out `source.ref` to follow the
   default branch, or set it to a branch or tag.

3. Run `npm run sync` to regenerate `.claude-plugin/marketplace.json`. Do not edit that file by
   hand.
4. Add a row to the plugin table in the README and the plugin to the dropdown in
   `.github/ISSUE_TEMPLATE/bug_report.yml`.
5. Check that everything passes (Node.js 22 or newer, no dependencies to install):

   ```bash
   npm test
   npm run check:sources -- eslint-plugin-cds
   ```

6. Add a line under "Unreleased" in [CHANGELOG.md](CHANGELOG.md) that describes the change for
   users. A pull request that changes nothing a user notices, such as a CI or typo fix, gets the
   label "no changelog" instead.
7. Open a pull request against `main` and fill in the template. It needs the checks
   **Test features** and **Changelog entry**.

Install the plugin in at least one agent from your branch before you open the pull request, for
example `codex plugin marketplace add <your-fork> --ref <branch>`.

Do not change the version: it is raised only when a release is prepared.

## Commit messages

Write the subject as an imperative sentence in plain words, for example "Add the cds-guard
plugin", and say in the body why the change is needed. Keep each pull request to one topic.

## License

By contributing you agree that your contribution is licensed under the
[Apache License 2.0](LICENSE), the license of this project.
