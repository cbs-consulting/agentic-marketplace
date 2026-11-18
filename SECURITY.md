# Security Policy

## Supported Versions

Only the current state of the `main` branch is supported. Agents read the catalog from there.

## Reporting a Vulnerability

Do not open a public issue for a security problem. Report it privately in one of these ways:

- Through [GitHub private vulnerability reporting](https://github.com/cbs-consulting/agentic-marketplace/security/advisories/new).
- By email to [cp_opensource@cbs-consulting.de](mailto:cp_opensource@cbs-consulting.de),
  with [administrator@cbs-consulting.de](mailto:administrator@cbs-consulting.de) in copy.

Describe the problem and the steps to reproduce it. If you know of a fix or a workaround, add it
as well.

We confirm that we received your report within five working days and keep you informed while we
work on a fix. Once the fix is released we publish a security advisory and credit you, unless you
would rather stay anonymous.

## Scope

This policy covers the catalog and the scripts in this repository. Examples of what is in scope:

- A catalog entry that points to a repository cbs does not control.
- A change that makes an agent install a plugin from somewhere other than the tool's repository.

A problem in a skill itself, such as instructions that make an agent run something unsafe, belongs
to the security policy of that tool's repository. Problems in an agent belong with its vendor.
