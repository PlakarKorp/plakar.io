---
title: "organization"
date: "2026-11-26T12:13:20Z"
weight: 14
summary: "Manage Plakar organizations."
---

# organization

Written `plakarkorp.plakar.organization` in a task.

Manage Plakar organizations.

Creates and deletes organizations under the API key's organization.

Organizations are matched by name across the badge organization's subtree; the
name is the playbook's key, so it must be unique there.

There is no update — the name is the key, and `info` and `type` are set at
creation. An organization that already exists is left as it is.

Membership is managed with `plakarkorp.plakar.member`, permissions with
`plakarkorp.plakar.grant`.

## Examples

```yaml
- name: A tenant for the Lyon subsidiary
  plakarkorp.plakar.organization:
    name: Lyon

- name: A perimeter nested under it
  plakarkorp.plakar.organization:
    name: Lyon production
    parent: Lyon

- name: Retire it
  plakarkorp.plakar.organization:
    name: Lyon production
    state: absent
```

## Options

| Option            | Type | Required | Default      | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str  | No       |              | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str  | No       |              | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `info`            | dict | No       |              | Free-form key/value information attached at creation.                                                                                                                                                                                                                                                                                                                                                              |
| `name`            | str  | Yes      |              | Name of the organization.                                                                                                                                                                                                                                                                                                                                                                                          |
| `organization_id` | str  | No       |              | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `parent`          | str  | No       |              | Name of the parent organization. Defaults to the API key's own organization.                                                                                                                                                                                                                                                                                                                                       |
| `state`           | str  | No       | `present`    | Whether the organization should exist. One of `present`, `absent`.                                                                                                                                                                                                                                                                                                                                                 |
| `timeout`         | int  | No       | `30`         | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `type`            | str  | No       | `enterprise` | Organization type. Only `enterprise` organizations can be created as sub-organizations today.                                                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool | No       | `true`       | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

## Returns

| Key            | Type | Returned                                    | Description                                            |
| -------------- | ---- | ------------------------------------------- | ------------------------------------------------------ |
| `organization` | dict | when the organization exists or was created | The organization acted on (id, name, type, parent_id). |
