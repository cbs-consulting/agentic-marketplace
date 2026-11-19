<div align="center">

<img src=".github/assets/logo.svg" alt="" width="120" />

# cbs Agentic Marketplace

**The skills of cbs open source tools, for every coding agent, from one catalog.**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-SKILL.md-0F4C5C)](https://agentskills.io)
[![Agent Plugins](https://img.shields.io/badge/Agent%20Plugins-1.0-0F4C5C)](https://agent-plugins.org)

</div>

---

Many cbs open source tools ship an agent skill: instructions that teach a coding agent how to set
up and use the tool. This repository is the catalog of those skills. It holds no skills itself.
Each skill lives in its tool's repository, next to the code it describes, and is released with it.

The catalog uses open formats, so it works with any agent that reads them:

- Skills follow the [Agent Skills](https://agentskills.io) standard (`skills/<name>/SKILL.md`).
- Each tool repository is a plugin in the [Agent Plugins 1.0](https://agent-plugins.org) layout
  (`plugin.json` and `skills/`).
- The catalog is a `marketplace.json`, the plugin marketplace format that Codex, GitHub Copilot
  CLI and Claude Code read.

## ✨ Plugins

| Plugin | Tool | What the skill does |
| --- | --- | --- |
| [cds-guard](https://github.com/cbs-consulting/cds-guard) | Stops accidental changes to protected CDS entities, annotations, code blocks and files in CAP and UI5 projects | Sets up `@cbs-consulting/cds-guard`, checks whether a file is protected before the agent edits it, runs `check` afterwards, and locks only changes the user asked for. |
| [container-features](https://github.com/cbs-consulting/container-features) | Dev Container Features for SAP BTP, CAP and Fiori development | Reads the project, picks the Features and options it needs, writes `devcontainer.json`, connects private npm feeds without committing tokens, and fixes failing container builds. |
| [container-templates](https://github.com/cbs-consulting/container-templates) | Dev Container Templates that start a new SAP BTP project in a pre-configured container | Checks Docker, applies a template to an empty folder, hands the interactive project generator over to the user, and helps when the container or the generator does not start. |
| [generator-btp](https://github.com/cbs-consulting/generator-btp) | Yeoman generator that starts SAP CAP projects with linting, tests, a dev container and an Azure DevOps setup | Asks only the questions that apply, runs the generator with `--answers` instead of interactive prompts, and goes through the next steps, such as the Azure DevOps setup. |
| [stack-sentinel](https://github.com/cbs-consulting/stack-sentinel) | Reports out-of-support UI5, Node.js, Cloud Foundry and CAP versions and vulnerable npm packages to Teams, and opens fix pull requests | Sets up `@cbs-consulting/stack-sentinel`: runs a first scan, adds the weekly pipeline for GitHub Actions or Azure DevOps, lists the variables, secrets and permissions to set, and explains why a run sent nothing. |
| [virtual-key-mapper](https://github.com/cbs-consulting/virtual-key-mapper) | Signs developers in to the company LLM gateway and gives their coding tools short-lived keys, labelled with the repository they work in | Installs `vkm`, adds the gateway profile, has the user sign in, connects Claude Code, Codex, OpenCode or other tools through the local proxy, and assigns a repository's labels. Never shows a key. |

## 🚀 Install

Add the catalog once, then install the plugins you want. The catalog is called `cbs-consulting`.

### Codex

```bash
codex plugin marketplace add cbs-consulting/agentic-marketplace
```

Then open `/plugins` in Codex and install a plugin from **cbs Agentic Marketplace**.

### GitHub Copilot CLI

```bash
copilot plugin marketplace add cbs-consulting/agentic-marketplace
copilot plugin install cds-guard@cbs-consulting
```

### Claude Code

```text
/plugin marketplace add cbs-consulting/agentic-marketplace
/plugin install cds-guard@cbs-consulting
```

### Cursor, Gemini CLI, VS Code, OpenCode and other agents

Agents that read Agent Skills but no plugin marketplace get the skill with the
[`skills`](https://skills.sh) CLI. It copies the skill from the tool's repository into the
agent's skills folder:

```bash
npx skills add cbs-consulting/cds-guard
```

Add `-a <agent>` to pick the agent (for example `-a cursor` or `-a gemini-cli`) and `-g` to
install for your user instead of the project. `npx skills add cbs-consulting/cds-guard --list`
shows the skills first.

### By hand

Copy the `skills/<name>` folder of the tool's repository into the skills folder of your agent,
for example `.agents/skills/` in your project.

## 📝 How it works

```text
cbs-consulting/agentic-marketplace                 cbs-consulting/<tool>
├── .agents/plugins/marketplace.json  ───►  ├── plugin.json        (Agent Plugins 1.0)
└── .claude-plugin/marketplace.json   ───►  └── skills/<name>/SKILL.md
```

- **`.agents/plugins/marketplace.json`** is the catalog and the file to edit. Codex reads it.
- **`.claude-plugin/marketplace.json`** is generated from it with `npm run sync`. Claude Code and
  GitHub Copilot CLI read it.
- Every entry points at the root of a tool's repository, at its default branch. The agent fetches
  the plugin from there, so a skill change in a tool reaches users without a change here.

## 🔧 Development

Node.js 22 or newer, no dependencies.

| What | Command |
| --- | --- |
| Check the catalog | `npm test` |
| Regenerate `.claude-plugin/marketplace.json` | `npm run sync` |
| Clone and check the listed repositories | `npm run check:sources` |

## ❓ Questions

- **Why are the skills not in this repository?** A skill describes one tool, so it changes with
  that tool. Keeping it in the tool's repository means one pull request changes both, and the
  tool's tests can check the skill.
- **Can I use only the skill, without the plugin?** Yes. A plugin here is a skill plus metadata.
  Use the `skills` CLI or copy the folder.
- **Is there an official registry?** The open standards define skills and plugins, not a
  registry. Each agent reads marketplace files from Git repositories, so this repository is the
  registry for cbs tools.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) to add a tool. Security problems go through the
[Security Policy](SECURITY.md), not public issues.

## 📄 License

[Apache License 2.0](LICENSE), © 2026 cbs Corporate Business Solutions Unternehmensberatung GmbH.
