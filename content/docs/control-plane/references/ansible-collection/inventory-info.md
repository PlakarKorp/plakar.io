---
title: "inventory_info"
date: "2026-11-26T12:13:20Z"
weight: 9
summary: "Read Plakar inventories and their resources."
---

# inventory_info

Written `plakarkorp.plakar.inventory_info` in a task.

Read Plakar inventories and their resources.

Lists the organization's inventories, or reads one inventory by name with its
coverage summary and, optionally, its resources.

Configuration values (provider credentials) are never echoed.

## Examples

```yaml
- name: All inventories
  plakarkorp.plakar.inventory_info:
  register: all_inventories

- name: One inventory, with what it holds
  plakarkorp.plakar.inventory_info:
    name: Production Scaleway
    include_resources: true
  register: scaleway
```

## Options

| Option              | Type | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ---- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`           | str  | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`           | str  | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `include_resources` | bool | No       | `false` | Also return the resources of the inventory named by `name`.                                                                                                                                                                                                                                                                                                                                                        |
| `name`              | str  | No       |         | Name of one inventory to read. Without it, all visible inventories are listed.                                                                                                                                                                                                                                                                                                                                     |
| `organization_id`   | str  | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `timeout`           | int  | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`    | bool | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

## Returns

| Key           | Type         | Returned                         | Description                                                 |
| ------------- | ------------ | -------------------------------- | ----------------------------------------------------------- |
| `inventories` | list of dict | when `name` is not set           | The visible inventories, with resource counts and coverage. |
| `inventory`   | dict         | when `name` is set               | The inventory named by `name`, with coverage and summaries. |
| `resources`   | list of dict | when `include_resources` is true | The inventory's resources.                                  |
