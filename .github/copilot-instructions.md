# Copilot instructions

Follow [AGENTS.md](../AGENTS.md) at the repository root. It holds the layout, the test commands
and the rules CI enforces.

The short version:

- Plugin names and the catalog name `cbs-consulting` are public; renaming one breaks installs.
- Edit `.agents/plugins/marketplace.json` only, then run `npm run sync`.
- Skills live in the tools' repositories, not here.
- Every plugin has a row in the README.
- Every pull request adds a user-facing line under `## Unreleased` in `CHANGELOG.md`, or gets the label `no changelog`.
- Code runs on Windows, macOS and Linux with Node.js 22 or newer.
- GitHub Actions are pinned by commit SHA.
