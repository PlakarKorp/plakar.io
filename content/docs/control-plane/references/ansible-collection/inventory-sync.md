---
title: "inventory_sync"
date: "2026-11-26T12:13:20Z"
weight: 11
summary: "Synchronize a Plakar inventory against its provider."
---

# inventory_sync

Written `plakarkorp.plakar.inventory_sync` in a task.

Synchronize a Plakar inventory against its provider.

Triggers a synchronization of an inventory, re-reading what its provider holds
and updating the resource set accordingly. The call is synchronous and returns
once the provider has been consulted.

A sync always re-reads the provider, so the task always reports changed.

Self-managed inventories hold only what playbooks declare
(`plakarkorp.plakar.inventory_resource`); syncing one succeeds without effect.

## Examples

```yaml
- name: Refresh what the Scaleway project holds
  plakarkorp.plakar.inventory_sync:
    name: Production Scaleway
```

## Options

| Option            | Type | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str  | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str  | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `name`            | str  | Yes      |         | Name of the inventory to synchronize.                                                                                                                                                                                                                                                                                                                                                                              |
| `organization_id` | str  | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `timeout`         | int  | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

## Returns

| Key         | Type | Returned | Description                          |
| ----------- | ---- | -------- | ------------------------------------ |
| `inventory` | dict | always   | The inventory that was synchronized. |
