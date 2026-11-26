---
title: "organization_info"
date: "2026-11-26T12:13:20Z"
weight: 15
summary: "Read a Plakar organization, its members and its grants."
---

# organization_info

Written `plakarkorp.plakar.organization_info` in a task.

Read a Plakar organization, its members and its grants.

Reads one organization by name (the API key's own by default), with its children
and, on request, its members and grants.

## Examples

```yaml
- name: Who is in the Lyon tenant, and what may they do
  plakarkorp.plakar.organization_info:
    name: Lyon
    include_members: true
    include_grants: true
  register: lyon
```

## Options

| Option            | Type | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str  | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str  | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `include_grants`  | bool | No       | `false` | Also return the grants.                                                                                                                                                                                                                                                                                                                                                                                            |
| `include_members` | bool | No       | `false` | Also return the members.                                                                                                                                                                                                                                                                                                                                                                                           |
| `name`            | str  | No       |         | Name of the organization, anywhere in the badge organization's subtree. Defaults to the API key's own organization.                                                                                                                                                                                                                                                                                                |
| `organization_id` | str  | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `timeout`         | int  | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

## Returns

| Key            | Type         | Returned                       | Description                                              |
| -------------- | ------------ | ------------------------------ | -------------------------------------------------------- |
| `children`     | list of dict | always                         | The direct sub-organizations.                            |
| `grants`       | list of dict | when `include_grants` is true  | The grants (id, subject, role).                          |
| `members`      | list of dict | when `include_members` is true | The members (user_id, email, account, name, is_service). |
| `organization` | dict         | always                         | The organization (id, name, type, parent_id).            |
