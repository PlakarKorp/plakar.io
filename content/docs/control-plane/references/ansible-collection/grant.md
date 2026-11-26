---
title: "grant"
date: "2026-11-26T12:13:20Z"
weight: 6
summary: "Manage role grants in a Plakar organization."
---

# grant

Written `plakarkorp.plakar.grant` in a task.

Manage role grants in a Plakar organization.

Grants a role to a member of an organization, and revokes it.

A grant is one (subject, role) pair; a member can hold several. The module
manages exactly the pair the playbook names and touches nothing else the subject
holds.

The subject must already be a member — see `plakarkorp.plakar.member`.

The role names come from the server's catalogue; the standard tier is `owner`,
`administrator`, `operator` and `auditor`. An unknown role fails with the
catalogue's list.

## Examples

```yaml
- name: Alice audits the Lyon tenant
  plakarkorp.plakar.grant:
    organization: Lyon
    subject: alice@example.com
    role: auditor

- name: The automation runs what is already defined
  plakarkorp.plakar.grant:
    organization: Lyon
    subject: nightly-automation
    role: operator

- name: Alice no longer audits
  plakarkorp.plakar.grant:
    organization: Lyon
    subject: alice@example.com
    role: auditor
    state: absent
```

## Options

| Option            | Type | Required | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str  | No       |           | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str  | No       |           | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `organization`    | str  | No       |           | Name of the organization the grant lives in. Defaults to the API key's own organization.                                                                                                                                                                                                                                                                                                                           |
| `organization_id` | str  | No       |           | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `role`            | str  | Yes      |           | Name of the role, as the catalogue spells it, for example `operator` or `backup-operator`.                                                                                                                                                                                                                                                                                                                         |
| `state`           | str  | No       | `present` | Whether the grant should exist. One of `present`, `absent`.                                                                                                                                                                                                                                                                                                                                                        |
| `subject`         | str  | Yes      |           | Who holds the grant — a member's email address, or the name of a service account (which has no address).                                                                                                                                                                                                                                                                                                           |
| `timeout`         | int  | No       | `30`      | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool | No       | `true`    | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

## Returns

| Key     | Type | Returned                             | Description                             |
| ------- | ---- | ------------------------------------ | --------------------------------------- |
| `grant` | dict | when the grant exists or was created | The grant acted on (id, subject, role). |
