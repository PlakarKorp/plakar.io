---
title: "inventory"
date: "2026-11-26T12:13:20Z"
weight: 8
summary: "Manage Plakar inventories."
---

# inventory

Written `plakarkorp.plakar.inventory` in a task.

Manage Plakar inventories.

Creates, updates and deletes inventories in the Plakar management API.

An inventory watches what a provider holds (AWS, Scaleway, GCP, OVH, VMware,
Kubernetes) or, for the `self-managed` type, holds resources a playbook declares
itself with `plakarkorp.plakar.inventory_resource`.

Inventories are matched by name within the organization; the name is the
playbook's key, so it must be unique. The type is immutable once created.

Only the configuration keys the playbook sets are managed on update; anything
else keeps its current server-side value.

## Examples

```yaml
- name: Watch a Scaleway project
  plakarkorp.plakar.inventory:
    name: Production Scaleway
    type: scaleway
    configuration:
      scw_project_id: 11111111-2222-3333-4444-555555555555
      scw_access_key: SCWXXXXXXXXXXXXXXXXX
      scw_secret_key: "{{ vault_scw_secret_key }}"

- name: An inventory of hand-declared machines
  plakarkorp.plakar.inventory:
    name: Datacenter racks
    type: self-managed

- name: Retire it
  plakarkorp.plakar.inventory:
    name: Datacenter racks
    state: absent
```

## Options

| Option            | Type | Required | Default     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------- | ---- | -------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api_key`         | str  | No       |             | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `api_url`         | str  | No       |             | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `configuration`   | dict | No       |             | Provider-specific configuration, as a flat mapping of field name to value. To take a value from a secret provider instead, give a mapping with `value`, the path of the secret in the provider, and `provider`, the name of the secret provider as `plakarkorp.plakar.secret_provider` declares it. `provider_id` takes its id instead of its name. Keys per type — `aws`: `credentials_type` (`iam` or `access_key`), `region`, `access_key`, `secret_access_key`; `scaleway`: `scw_project_id`, `scw_access_key`, `scw_secret_key`; `gcp`: `gcp_project_id`, `gcp_service_account_json`; `ovh`: `application_key`, `application_secret`, `consumer_key`, `endpoint`; `k8s`: `k8s_kubeconf`; `vmware`: `vsphere_server`, `vsphere_username`, `vsphere_password`, `vsphere_tls_skip_verify`, `vsphere_tls_ca_bundle`. The `self-managed` type takes no configuration. |
| `name`            | str  | Yes      |             | Name of the inventory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `organization_id` | str  | No       |             | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `state`           | str  | No       | `present`   | Whether the inventory should exist. One of `present`, `absent`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `timeout`         | int  | No       | `30`        | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `type`            | str  | No       |             | Provider backing the inventory. Required when creating; immutable afterwards. One of `aws`, `gcp`, `k8s`, `ovh`, `scaleway`, `self-managed`, `vmware`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `update_secrets`  | str  | No       | `on_create` | When to send a value the API does not show. Since v0.19 the Plakar Control Plane leaves the value of a sensitive field out of what it returns, so the module cannot tell whether the one in the playbook differs from the one stored. `on_create` sends such a value at creation only. Later runs leave the stored one alone and report no change for it, also when another option of the same task is updated. `always` sends it on every run, which then reports a change each time. Use it for the run that rotates a credential. A value that references a secret provider is always shown, and so always compared, as is every value on an older Control Plane. One of `on_create`, `always`.                                                                                                                                                                    |
| `validate_certs`  | bool | No       | `true`      | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

## Returns

| Key         | Type        | Returned                                 | Description                                                              |
| ----------- | ----------- | ---------------------------------------- | ------------------------------------------------------------------------ |
| `diff_keys` | list of str | on update                                | The configuration keys whose values differed and drove the update.       |
| `inventory` | dict        | when the inventory exists or was created | The inventory acted on (a summary; configuration values are not echoed). |
