# Changelog

What changed in each release of the catalog, newest first. Add your change under "Unreleased" in
the same pull request. To release, raise the version and rename "Unreleased" to that version and
the date.

## Unreleased

- First version of the catalog. Its plugins install in Codex, GitHub
  Copilot CLI and Claude Code, and their skills install in other agents with `npx skills add`.
- New cds-guard plugin. Its skill sets up `@cbs-consulting/cds-guard` and keeps the agent from
  changing protected CDS entities, annotations, code blocks and files by accident.
- New container-features plugin. Its skill sets up the cbs Dev Container Features in a
  project: it picks the Features the project needs, writes `devcontainer.json` and connects
  private npm feeds without committing tokens.
- New container-templates plugin. Its skill starts a new SAP BTP project from the cbs Dev
  Container Templates and helps when the container or the project generator does not start.
- New virtual-key-mapper plugin. Its skill `vkm-setup` sets up `vkm` for the user: the gateway
  profile, the sign-in, the connected tools and a repository's labels.
- New generator-btp plugin. Its skill sets up SAP CAP projects with
  `@cbs-consulting/generator-btp`: it asks what the project needs, runs the generator and goes
  through the next steps.
- New stack-sentinel plugin. Its skill sets up `@cbs-consulting/stack-sentinel`: a first scan,
  the weekly pipeline for GitHub Actions or Azure DevOps, and the settings the user makes.
