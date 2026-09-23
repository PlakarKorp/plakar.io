---
title: "Ansible Collection"
date: "2026-09-23T06:24:18Z"
weight: 3
summary:
  "Option-by-option reference for every module in the plakarkorp.plakar Ansible
  collection."
---

# Ansible collection reference

This page lists every option of every module in the `plakarkorp.plakar` Ansible
collection. For an introduction to what these modules do and how a playbook uses
them, see [Ansible Collection](../../infrastructure-as-code/ansible).

Module names are written in full in a playbook. The `backup` module below is
`plakarkorp.plakar.backup` in a task.

## Modules

> [!NOTE]
>
> All modules talk only to the Plakar management API over HTTPS; nothing runs on
> the managed hosts, so plays typically target `localhost` or use `delegate_to`.

### backup

Trigger a Plakar backup.

Triggers an on-demand backup of a source connector into a store, through the
Plakar management API.

Connectors are addressed by name; names are resolved within the organization at
run time.

The run is asynchronous server-side. By default the module polls until the job
stops and fails unless it succeeded.

**Options**

| Option            | Type        | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ----------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str         | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str         | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `edge_tags`       | list of str | No       |         | Select a remote edge by tags (all must match) to execute the job, falling back to local execution when no edge matches.                                                                                                                                                                                                                                                                                            |
| `ignores`         | list of str | No       |         | Path patterns to exclude from the backup.                                                                                                                                                                                                                                                                                                                                                                          |
| `labels`          | list of str | No       |         | Labels to attach to the resulting snapshot.                                                                                                                                                                                                                                                                                                                                                                        |
| `organization_id` | str         | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `source`          | str         | Yes      |         | Name of the source connector to back up.                                                                                                                                                                                                                                                                                                                                                                           |
| `store`           | str         | Yes      |         | Name of the store connector to back up into.                                                                                                                                                                                                                                                                                                                                                                       |
| `timeout`         | int         | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool        | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |
| `wait`            | bool        | No       | `true`  | Whether to wait for the triggered job to finish. When false, the module returns as soon as the run is accepted; poll it later with `plakarkorp.plakar.job_info`.                                                                                                                                                                                                                                                   |
| `wait_timeout`    | int         | No       | `600`   | Seconds to wait for the job to finish before failing.                                                                                                                                                                                                                                                                                                                                                              |

**Returns**

| Key     | Type | Returned                   | Description                                                                                                                |
| ------- | ---- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `at_id` | str  | always (except check mode) | Identifier of the one-shot run (the scheduler's `at` entry).                                                               |
| `job`   | dict | when available             | The job the run materialized into. Only present once the scheduler picked the run up — with `wait=false` it may be absent. |
| `log`   | str  | on job failure             | Plain-text job log, fetched when the job did not succeed.                                                                  |

**Keys of `job`**

| Key          | Type | Returned | Description                                                    |
| ------------ | ---- | -------- | -------------------------------------------------------------- |
| `id`         | str  |          | Job id, usable with `plakarkorp.plakar.job_info`.              |
| `started_at` | str  |          | When the job started, if it did.                               |
| `status`     | str  |          | One of `queued`, `running`, `canceled`, `succeeded`, `failed`. |
| `stopped_at` | str  |          | When the job stopped, if it did.                               |

### check

Verify the integrity of Plakar snapshots.

Triggers an on-demand integrity check of the snapshots held in a store, through
the Plakar management API.

The store is addressed by name and resolved within the organization at run time.
Without `snapshot_id` the whole store is checked.

The run is asynchronous server-side. By default the module polls until the job
stops and fails unless it succeeded — a failed check means the data did not
verify.

**Options**

| Option            | Type        | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ----------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str         | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str         | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `edge_tags`       | list of str | No       |         | Select a remote edge by tags (all must match) to execute the job, falling back to local execution when no edge matches.                                                                                                                                                                                                                                                                                            |
| `labels`          | list of str | No       |         | Only check snapshots carrying these labels.                                                                                                                                                                                                                                                                                                                                                                        |
| `organization_id` | str         | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `snapshot_id`     | str         | No       |         | Check only this snapshot.                                                                                                                                                                                                                                                                                                                                                                                          |
| `store`           | str         | Yes      |         | Name of the store whose snapshots to verify.                                                                                                                                                                                                                                                                                                                                                                       |
| `timeout`         | int         | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool        | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |
| `wait`            | bool        | No       | `true`  | Whether to wait for the triggered job to finish. When false, the module returns as soon as the run is accepted; poll it later with `plakarkorp.plakar.job_info`.                                                                                                                                                                                                                                                   |
| `wait_timeout`    | int         | No       | `600`   | Seconds to wait for the job to finish before failing.                                                                                                                                                                                                                                                                                                                                                              |

**Returns**

| Key     | Type | Returned                   | Description                                                                                                                |
| ------- | ---- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `at_id` | str  | always (except check mode) | Identifier of the one-shot run (the scheduler's `at` entry).                                                               |
| `job`   | dict | when available             | The job the run materialized into. Only present once the scheduler picked the run up — with `wait=false` it may be absent. |
| `log`   | str  | on job failure             | Plain-text job log, fetched when the job did not succeed.                                                                  |

**Keys of `job`**

| Key          | Type | Returned | Description                                                    |
| ------------ | ---- | -------- | -------------------------------------------------------------- |
| `id`         | str  |          | Job id, usable with `plakarkorp.plakar.job_info`.              |
| `started_at` | str  |          | When the job started, if it did.                               |
| `status`     | str  |          | One of `queued`, `running`, `canceled`, `succeeded`, `failed`. |
| `stopped_at` | str  |          | When the job stopped, if it did.                               |

### connector

Manage Plakar source and destination connectors.

Creates, updates and deletes source and destination connectors in the Plakar
management API. For stores, use `plakarkorp.plakar.store` instead.

Connectors are matched by name within the organization; the name is the
playbook's key, so it must be unique per connector type.

Only the options the playbook sets are managed on update; anything else keeps
its current server-side value.

**Options**

| Option            | Type        | Required | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ----------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str         | No       |           | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str         | No       |           | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `data_classes`    | list of str | No       |           | Data classes the connector carries.                                                                                                                                                                                                                                                                                                                                                                                |
| `endpoints`       | list of str | No       |           | Endpoint names the connector reaches its resource through.                                                                                                                                                                                                                                                                                                                                                         |
| `environment`     | str         | No       |           | Environment label, for example `production`.                                                                                                                                                                                                                                                                                                                                                                       |
| `fields`          | dict        | No       |           | Integration-specific configuration, as a mapping of field name to value. A value may also be a mapping with `value` and an optional `provider_id` naming a secret provider. On update, only the fields named here are compared and replaced; other existing fields are preserved.                                                                                                                                  |
| `integration`     | str         | No       |           | Name of the installed integration backing the connector, for example `s3` or `sftp`. Required when creating.                                                                                                                                                                                                                                                                                                       |
| `name`            | str         | Yes      |           | Name of the connector.                                                                                                                                                                                                                                                                                                                                                                                             |
| `organization_id` | str         | No       |           | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `protocol`        | str         | No       |           | Protocol spoken to the resource, for example `s3` or `sftp`. Defaults to the integration name, which matches for the standard integrations; set it only when they differ.                                                                                                                                                                                                                                          |
| `resource`        | str         | No       |           | URN or name of the inventory resource the connector attaches to. Required when creating.                                                                                                                                                                                                                                                                                                                           |
| `state`           | str         | No       | `present` | Whether the connector should exist. One of `present`, `absent`.                                                                                                                                                                                                                                                                                                                                                    |
| `temperature`     | str         | No       |           | Storage temperature.                                                                                                                                                                                                                                                                                                                                                                                               |
| `timeout`         | int         | No       | `30`      | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `type`            | str         | Yes      |           | What the connector is used for. One of `source`, `destination`.                                                                                                                                                                                                                                                                                                                                                    |
| `validate_certs`  | bool        | No       | `true`    | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

**Returns**

| Key         | Type        | Returned                                 | Description                                                      |
| ----------- | ----------- | ---------------------------------------- | ---------------------------------------------------------------- |
| `connector` | dict        | when the connector exists or was created | The connector acted on (a summary; field values are not echoed). |
| `diff_keys` | list of str | on update                                | The option names whose values differed and drove the update.     |

### grant

Manage role grants in a Plakar organization.

Grants a role to a member of an organization, and revokes it.

A grant is one (subject, role) pair; a member can hold several. The module
manages exactly the pair the playbook names and touches nothing else the subject
holds.

The subject must already be a member — see `plakarkorp.plakar.member`.

The role names come from the server's catalogue; the standard tier is `owner`,
`administrator`, `operator` and `auditor`. An unknown role fails with the
catalogue's list.

**Options**

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

**Returns**

| Key     | Type | Returned                             | Description                             |
| ------- | ---- | ------------------------------------ | --------------------------------------- |
| `grant` | dict | when the grant exists or was created | The grant acted on (id, subject, role). |

### inventory

Manage Plakar inventories.

Creates, updates and deletes inventories in the Plakar management API.

An inventory watches what a provider holds (AWS, Scaleway, GCP, OVH, VMware,
Kubernetes) or, for the `self-managed` type, holds resources a playbook declares
itself with `plakarkorp.plakar.inventory_resource`.

Inventories are matched by name within the organization; the name is the
playbook's key, so it must be unique. The type is immutable once created.

Only the configuration keys the playbook sets are managed on update; anything
else keeps its current server-side value.

**Options**

| Option            | Type | Required | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------- | ---- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api_key`         | str  | No       |           | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable.                                                                                                                                                                                                                                                                              |
| `api_url`         | str  | No       |           | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `configuration`   | dict | No       |           | Provider-specific configuration, as a flat mapping of field name to value. A value may also be a mapping with `value` and an optional `provider_id` naming a secret provider. Keys per type — `aws`: `credentials_type` (`iam` or `access_key`), `region`, `access_key`, `secret_access_key`; `scaleway`: `scw_project_id`, `scw_access_key`, `scw_secret_key`; `gcp`: `gcp_project_id`, `gcp_service_account_json`; `ovh`: `application_key`, `application_secret`, `consumer_key`, `endpoint`; `k8s`: `k8s_kubeconf`; `vmware`: `vsphere_server`, `vsphere_username`, `vsphere_password`, `vsphere_tls_skip_verify`, `vsphere_tls_ca_bundle`. The `self-managed` type takes no configuration. |
| `name`            | str  | Yes      |           | Name of the inventory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `organization_id` | str  | No       |           | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `state`           | str  | No       | `present` | Whether the inventory should exist. One of `present`, `absent`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `timeout`         | int  | No       | `30`      | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `type`            | str  | No       |           | Provider backing the inventory. Required when creating; immutable afterwards. One of `aws`, `gcp`, `k8s`, `ovh`, `scaleway`, `self-managed`, `vmware`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `validate_certs`  | bool | No       | `true`    | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

**Returns**

| Key         | Type        | Returned                                 | Description                                                              |
| ----------- | ----------- | ---------------------------------------- | ------------------------------------------------------------------------ |
| `diff_keys` | list of str | on update                                | The configuration keys whose values differed and drove the update.       |
| `inventory` | dict        | when the inventory exists or was created | The inventory acted on (a summary; configuration values are not echoed). |

### inventory_info

Read Plakar inventories and their resources.

Lists the organization's inventories, or reads one inventory by name with its
coverage summary and, optionally, its resources.

Configuration values (provider credentials) are never echoed.

**Options**

| Option              | Type | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ---- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`           | str  | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`           | str  | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `include_resources` | bool | No       | `false` | Also return the resources of the inventory named by `name`.                                                                                                                                                                                                                                                                                                                                                        |
| `name`              | str  | No       |         | Name of one inventory to read. Without it, all visible inventories are listed.                                                                                                                                                                                                                                                                                                                                     |
| `organization_id`   | str  | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `timeout`           | int  | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`    | bool | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

**Returns**

| Key           | Type         | Returned                         | Description                                                 |
| ------------- | ------------ | -------------------------------- | ----------------------------------------------------------- |
| `inventories` | list of dict | when `name` is not set           | The visible inventories, with resource counts and coverage. |
| `inventory`   | dict         | when `name` is set               | The inventory named by `name`, with coverage and summaries. |
| `resources`   | list of dict | when `include_resources` is true | The inventory's resources.                                  |

### inventory_resource

Manage resources in a self-managed Plakar inventory.

Declares, updates and deletes resources in a self-managed inventory (see
`plakarkorp.plakar.inventory`). Provider-backed inventories are read-only; their
resources come from synchronization.

Resources are matched by URN within the inventory; the URN is the playbook's key
and is immutable.

Only the options the playbook sets are managed on update; anything else keeps
its current server-side value.

**Options**

| Option                   | Type        | Required | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------ | ----------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`                | str         | No       |           | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`                | str         | No       |           | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `class`                  | str         | No       |           | Resource class, for example `object-storage` or `virtual-machine`. Required when creating.                                                                                                                                                                                                                                                                                                                         |
| `endpoints`              | list of str | No       |           | Endpoints the resource is reachable at, as hostnames or IP addresses.                                                                                                                                                                                                                                                                                                                                              |
| `excluded_from_coverage` | bool        | No       |           | Whether the resource is left out of coverage accounting.                                                                                                                                                                                                                                                                                                                                                           |
| `inventory`              | str         | Yes      |           | Name of the self-managed inventory holding the resource.                                                                                                                                                                                                                                                                                                                                                           |
| `name`                   | str         | No       |           | Display name of the resource. Required when creating.                                                                                                                                                                                                                                                                                                                                                              |
| `organization_id`        | str         | No       |           | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `service`                | str         | No       |           | Service the resource belongs to.                                                                                                                                                                                                                                                                                                                                                                                   |
| `state`                  | str         | No       | `present` | Whether the resource should exist. One of `present`, `absent`.                                                                                                                                                                                                                                                                                                                                                     |
| `subclass`               | str         | No       |           | Resource subclass, for example `s3`.                                                                                                                                                                                                                                                                                                                                                                               |
| `tags`                   | list of str | No       |           | Tags on the resource.                                                                                                                                                                                                                                                                                                                                                                                              |
| `timeout`                | int         | No       | `30`      | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `urn`                    | str         | Yes      |           | URN identifying the resource, for example `urn:res-web-tier`.                                                                                                                                                                                                                                                                                                                                                      |
| `validate_certs`         | bool        | No       | `true`    | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

**Returns**

| Key         | Type        | Returned                                | Description                                                  |
| ----------- | ----------- | --------------------------------------- | ------------------------------------------------------------ |
| `diff_keys` | list of str | on update                               | The option names whose values differed and drove the update. |
| `resource`  | dict        | when the resource exists or was created | The resource acted on (a summary).                           |

### inventory_sync

Synchronize a Plakar inventory against its provider.

Triggers a synchronization of an inventory, re-reading what its provider holds
and updating the resource set accordingly. The call is synchronous and returns
once the provider has been consulted.

A sync always re-reads the provider, so the task always reports changed.

Self-managed inventories hold only what playbooks declare
(`plakarkorp.plakar.inventory_resource`); syncing one succeeds without effect.

**Options**

| Option            | Type | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str  | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str  | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `name`            | str  | Yes      |         | Name of the inventory to synchronize.                                                                                                                                                                                                                                                                                                                                                                              |
| `organization_id` | str  | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `timeout`         | int  | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

**Returns**

| Key         | Type | Returned | Description                          |
| ----------- | ---- | -------- | ------------------------------------ |
| `inventory` | dict | always   | The inventory that was synchronized. |

### job_info

Query Plakar job state.

Reads job state from the Plakar management API, either one job by id or a
filtered list.

Never changes anything.

**Options**

| Option            | Type | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str  | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str  | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `at_id`           | str  | No       |         | Return the job of this one-shot run, as returned in `at_id` by `plakarkorp.plakar.backup` and `plakarkorp.plakar.restore`. While the scheduler has not yet materialized the run into a job, the module returns an empty `jobs` list — poll with `until`.                                                                                                                                                           |
| `include_log`     | bool | No       | `false` | Also fetch each returned job's plain-text log. Meant for a single job or a narrow filter; logs are fetched one request per job.                                                                                                                                                                                                                                                                                    |
| `job_id`          | str  | No       |         | Return exactly this job. Mutually exclusive with the list filters.                                                                                                                                                                                                                                                                                                                                                 |
| `limit`           | int  | No       | `50`    | Maximum number of jobs to return.                                                                                                                                                                                                                                                                                                                                                                                  |
| `offset`          | int  | No       | `0`     | Pagination offset.                                                                                                                                                                                                                                                                                                                                                                                                 |
| `organization_id` | str  | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `status`          | str  | No       |         | Only jobs in this state. One of `queued`, `running`, `canceled`, `succeeded`, `failed`.                                                                                                                                                                                                                                                                                                                            |
| `task_type`       | str  | No       |         | Only jobs of this task type. One of `backup`, `restore`, `sync`, `check`, `prune`, `rm`, `maintenance`.                                                                                                                                                                                                                                                                                                            |
| `timeout`         | int  | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

**Returns**

| Key     | Type         | Returned     | Description                                                  |
| ------- | ------------ | ------------ | ------------------------------------------------------------ |
| `jobs`  | list of dict | always       | The matching jobs, newest first (server ordering).           |
| `total` | int          | when listing | Total number of jobs matching the filter, before pagination. |

**Keys of `jobs`**

| Key           | Type | Returned                | Description                                                    |
| ------------- | ---- | ----------------------- | -------------------------------------------------------------- |
| `created_at`  | str  |                         | When the job row was created.                                  |
| `id`          | str  |                         | Job id.                                                        |
| `log`         | str  | when `include_log=true` | Plain-text job log.                                            |
| `schedule_at` | str  |                         | When the job was scheduled to run.                             |
| `started_at`  | str  |                         | When the job started, if it did.                               |
| `status`      | str  |                         | One of `queued`, `running`, `canceled`, `succeeded`, `failed`. |
| `stopped_at`  | str  |                         | When the job stopped, if it did.                               |
| `task_type`   | str  |                         | Type of the task that produced the job.                        |

### member

Manage the members of a Plakar organization.

Adds people and service accounts to an organization, and removes them.

A membership carries no permission — what a member may do is a grant, managed
with `plakarkorp.plakar.grant`.

Adding a person goes through the admin invitation path. A brand-new address gets
an account with a one-time generated password, returned once in
`generated_password`; an address that already has an account simply gains the
membership.

A service account (`service=true`) is an application user — no email, no
interactive login; its address is minted server-side. Mint its API key in the
Plakar UI (an application user cannot mint its own).

Removing a member removes the membership, not the person's account.

**Options**

| Option            | Type | Required | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str  | No       |           | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str  | No       |           | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `email`           | str  | No       |           | Email address of the person. The playbook's key for people.                                                                                                                                                                                                                                                                                                                                                        |
| `name`            | str  | No       |           | Display name. The playbook's key for service accounts, which have no address; optional decoration for people.                                                                                                                                                                                                                                                                                                      |
| `organization`    | str  | No       |           | Name of the organization the membership belongs to. Defaults to the API key's own organization.                                                                                                                                                                                                                                                                                                                    |
| `organization_id` | str  | No       |           | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `service`         | bool | No       | `false`   | Add an application user rather than a person.                                                                                                                                                                                                                                                                                                                                                                      |
| `state`           | str  | No       | `present` | Whether the membership should exist. One of `present`, `absent`.                                                                                                                                                                                                                                                                                                                                                   |
| `timeout`         | int  | No       | `30`      | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool | No       | `true`    | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

**Returns**

| Key                  | Type | Returned                                  | Description                                                                                                                                                                                                                                                                                                    |
| -------------------- | ---- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account_created`    | bool | on creation                               | Whether a brand-new account was registered for the address.                                                                                                                                                                                                                                                    |
| `generated_password` | str  | on creation                               | The one-time must-change password the server minted for a brand-new account. Shown exactly once — relay it or lose it. `null` when the address already had an account. A service account gets one too, but it is inert — an application user has no interactive login, and mints its API key in the Plakar UI. |
| `member`             | dict | when the membership exists or was created | The member acted on (user_id, email, account, name, is_service).                                                                                                                                                                                                                                               |

### organization

Manage Plakar organizations.

Creates and deletes organizations under the API key's organization.

Organizations are matched by name across the badge organization's subtree; the
name is the playbook's key, so it must be unique there.

There is no update — the name is the key, and `info` and `type` are set at
creation. An organization that already exists is left as it is.

Membership is managed with `plakarkorp.plakar.member`, permissions with
`plakarkorp.plakar.grant`.

**Options**

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

**Returns**

| Key            | Type | Returned                                    | Description                                            |
| -------------- | ---- | ------------------------------------------- | ------------------------------------------------------ |
| `organization` | dict | when the organization exists or was created | The organization acted on (id, name, type, parent_id). |

### organization_info

Read a Plakar organization, its members and its grants.

Reads one organization by name (the API key's own by default), with its children
and, on request, its members and grants.

**Options**

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

**Returns**

| Key            | Type         | Returned                       | Description                                              |
| -------------- | ------------ | ------------------------------ | -------------------------------------------------------- |
| `children`     | list of dict | always                         | The direct sub-organizations.                            |
| `grants`       | list of dict | when `include_grants` is true  | The grants (id, subject, role).                          |
| `members`      | list of dict | when `include_members` is true | The members (user_id, email, account, name, is_service). |
| `organization` | dict         | always                         | The organization (id, name, type, parent_id).            |

### prune

Prune snapshots from a Plakar store by retention rule.

Applies a retention rule to a store's snapshots and deletes what falls outside
it, through the Plakar management API. Snapshots under legal hold are never
deleted and are reported separately.

In check mode nothing is deleted — the API's prune preview reports what would be
deleted, kept and held.

The module is `changed` only when snapshots were actually deleted (or, in check
mode, would be).

**Options**

| Option            | Type        | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ----------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str         | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str         | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `filters`         | dict        | No       |         | Further narrowing, passed to the API's locate filters — a mapping of `ignore_tags`, `before`, `since`, `name`, `category`, `environment`, `perimeter`, `job`, `dataset`, `latest`, `ids`, `types`, `origins`, `roots`, `data_classes`. `tags` is shorthand for `filters.tags`; both may be set and merge.                                                                                                          |
| `group_by`        | str         | No       |         | Partition the matched snapshots before applying the rule, so retention is honored per group instead of across the whole store — for example `dataset` keeps the rule per source instead of globally. One of `name`, `category`, `environment`, `perimeter`, `job`, `dataset`, `data-class`, `tag`, `origin`, `type`, `root`.                                                                                       |
| `organization_id` | str         | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `retention`       | dict        | Yes      |         | The retention rule, as a mapping of bucket options — `minute`, `hour`, `day`, `week`, `month`, `year` say how many recent buckets of that unit to keep, and `per_minute`, `per_hour`, `per_day`, `per_week`, `per_month`, `per_year` how many snapshots to keep in each. For example `{day: 7, per_day: 1, month: 12, per_month: 1}` keeps one snapshot a day for a week and one a month for a year.               |
| `store`           | str         | Yes      |         | Name of the store to prune.                                                                                                                                                                                                                                                                                                                                                                                        |
| `tags`            | list of str | No       |         | Only consider snapshots carrying these tags.                                                                                                                                                                                                                                                                                                                                                                       |
| `timeout`         | int         | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool        | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |
| `wait`            | bool        | No       | `true`  | Whether to wait for the deletion job to finish when there is something to delete.                                                                                                                                                                                                                                                                                                                                  |
| `wait_timeout`    | int         | No       | `600`   | Seconds to wait for the deletion job before failing.                                                                                                                                                                                                                                                                                                                                                               |

**Returns**

| Key       | Type         | Returned                              | Description                                                                                                      |
| --------- | ------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `at_ids`  | list of str  | when a deletion ran                   | Identifiers of the deletion runs, when something was deleted. A long delete list may be split over several runs. |
| `deleted` | list of str  | always                                | Snapshot ids the run deleted (in check mode, would delete).                                                      |
| `floored` | list of str  | always                                | Snapshot ids the rule would delete but the organization's retention floor keeps anyway.                          |
| `held`    | list of str  | always                                | Snapshot ids excluded because they are under legal hold.                                                         |
| `jobs`    | list of dict | when a deletion ran and was waited on | The deletion jobs, when something was deleted and `wait=true`.                                                   |
| `kept`    | list of str  | in check mode                         | Snapshot ids the rule keeps. Only the preview reports this.                                                      |

### restore

Trigger a Plakar restore.

Triggers an on-demand restore of a snapshot from a store onto a destination
connector, through the Plakar management API.

Connectors are addressed by name. When no `snapshot_id` is given, the newest
snapshot in the store is restored.

The run is asynchronous server-side. By default the module polls until the job
stops and fails unless it succeeded.

**Options**

| Option            | Type        | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ----------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str         | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str         | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `destination`     | str         | Yes      |         | Name of the destination connector to restore onto.                                                                                                                                                                                                                                                                                                                                                                 |
| `edge_tags`       | list of str | No       |         | Select a remote edge by tags (all must match) to execute the job, falling back to local execution when no edge matches.                                                                                                                                                                                                                                                                                            |
| `organization_id` | str         | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `snapshot_id`     | str         | No       |         | Identifier of the snapshot to restore. When omitted, the newest snapshot in the store (by creation time) is restored.                                                                                                                                                                                                                                                                                              |
| `store`           | str         | Yes      |         | Name of the store connector holding the snapshot.                                                                                                                                                                                                                                                                                                                                                                  |
| `timeout`         | int         | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool        | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |
| `wait`            | bool        | No       | `true`  | Whether to wait for the triggered job to finish. When false, the module returns as soon as the run is accepted; poll it later with `plakarkorp.plakar.job_info`.                                                                                                                                                                                                                                                   |
| `wait_timeout`    | int         | No       | `600`   | Seconds to wait for the job to finish before failing.                                                                                                                                                                                                                                                                                                                                                              |

**Returns**

| Key           | Type | Returned                   | Description                                                                                                                |
| ------------- | ---- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `at_id`       | str  | always (except check mode) | Identifier of the one-shot run (the scheduler's `at` entry).                                                               |
| `job`         | dict | when available             | The job the run materialized into. Only present once the scheduler picked the run up — with `wait=false` it may be absent. |
| `log`         | str  | on job failure             | Plain-text job log, fetched when the job did not succeed.                                                                  |
| `snapshot_id` | str  | always                     | The snapshot that was restored.                                                                                            |

**Keys of `job`**

| Key          | Type | Returned | Description                                                    |
| ------------ | ---- | -------- | -------------------------------------------------------------- |
| `id`         | str  |          | Job id, usable with `plakarkorp.plakar.job_info`.              |
| `started_at` | str  |          | When the job started, if it did.                               |
| `status`     | str  |          | One of `queued`, `running`, `canceled`, `succeeded`, `failed`. |
| `stopped_at` | str  |          | When the job stopped, if it did.                               |

### store

Manage Plakar stores.

Creates, updates and deletes stores — where Plakar keeps backup data — in the
Plakar management API, initializing the underlying storage on creation.

Stores are matched by name within the organization; the name is the playbook's
key, so it must be unique among stores.

Only the options the playbook sets are managed on update; anything else keeps
its current server-side value.

**Options**

| Option            | Type        | Required | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------- | ----------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str         | No       |           | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable.                                                                         |
| `api_url`         | str         | No       |           | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                                                                                                  |
| `compression`     | str         | No       |           | Compression for the store at initialization. Unset keeps the engine's own default. One of `GZIP`, `LZ4`, `ZSTD`.                                                                                                                                                                                                                                                                                                                                                                           |
| `data_classes`    | list of str | No       |           | Data classes the store accepts.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `endpoints`       | list of str | No       |           | Endpoint names the store reaches its resource through.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `environment`     | str         | No       |           | Environment label, for example `production`.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `fields`          | dict        | No       |           | Integration-specific configuration, as a mapping of field name to value. A value may also be a mapping with `value` and an optional `provider_id` naming a secret provider. On update, only the fields named here are compared and replaced; other existing fields are preserved. Must carry a non-empty `passphrase` when the store is initialized here, since it encrypts the store at rest. A field backed by a secret provider counts as set, because the provider supplies the value. |
| `initialize`      | bool        | No       | `true`    | Whether to initialize the underlying storage right after creating the store. Initialization only happens on creation, never on update. Set it to false when the storage is already initialized elsewhere, which also lifts the passphrase requirement.                                                                                                                                                                                                                                     |
| `integration`     | str         | No       |           | Name of the installed integration backing the store. Required when creating.                                                                                                                                                                                                                                                                                                                                                                                                               |
| `name`            | str         | Yes      |           | Name of the store.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `organization_id` | str         | No       |           | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                                                                                         |
| `protocol`        | str         | No       |           | Protocol spoken to the resource, for example `s3` or `sftp`. Defaults to the integration name, which matches for the standard integrations; set it only when they differ.                                                                                                                                                                                                                                                                                                                  |
| `resource`        | str         | No       |           | URN or name of the inventory resource the store attaches to. Required when creating.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `state`           | str         | No       | `present` | Whether the store should exist. `absent` removes the store from Plakar; the data in the underlying storage is not touched. One of `present`, `absent`.                                                                                                                                                                                                                                                                                                                                     |
| `temperature`     | str         | No       |           | Storage temperature.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `timeout`         | int         | No       | `30`      | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                                                                                              |
| `validate_certs`  | bool        | No       | `true`    | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                                                                                              |

**Returns**

| Key         | Type        | Returned                             | Description                                                                                                    |
| ----------- | ----------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `connector` | dict        | when the store exists or was created | The store acted on (a summary; field values are not echoed). Carries `initialized` when the module created it. |
| `diff_keys` | list of str | on update                            | The option names whose values differed and drove the update.                                                   |

### sync

Sync snapshots between Plakar stores.

Triggers an on-demand synchronization of snapshots from one store into another —
offsite replication, hot-to-cold tiering — through the Plakar management API.

Stores are addressed by name; names are resolved within the organization at run
time.

The run is asynchronous server-side. By default the module polls until the job
stops and fails unless it succeeded.

**Options**

| Option            | Type        | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ----------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str         | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str         | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `edge_tags`       | list of str | No       |         | Select a remote edge by tags (all must match) to execute the job, falling back to local execution when no edge matches.                                                                                                                                                                                                                                                                                            |
| `labels`          | list of str | No       |         | Only sync snapshots carrying these labels.                                                                                                                                                                                                                                                                                                                                                                         |
| `organization_id` | str         | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `store`           | str         | Yes      |         | Name of the store holding the snapshots to sync.                                                                                                                                                                                                                                                                                                                                                                   |
| `timeout`         | int         | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `to_store`        | str         | Yes      |         | Name of the store to sync the snapshots into.                                                                                                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool        | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |
| `wait`            | bool        | No       | `true`  | Whether to wait for the triggered job to finish. When false, the module returns as soon as the run is accepted; poll it later with `plakarkorp.plakar.job_info`.                                                                                                                                                                                                                                                   |
| `wait_timeout`    | int         | No       | `600`   | Seconds to wait for the job to finish before failing.                                                                                                                                                                                                                                                                                                                                                              |

**Returns**

| Key     | Type | Returned                   | Description                                                                                                                |
| ------- | ---- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `at_id` | str  | always (except check mode) | Identifier of the one-shot run (the scheduler's `at` entry).                                                               |
| `job`   | dict | when available             | The job the run materialized into. Only present once the scheduler picked the run up — with `wait=false` it may be absent. |
| `log`   | str  | on job failure             | Plain-text job log, fetched when the job did not succeed.                                                                  |

**Keys of `job`**

| Key          | Type | Returned | Description                                                    |
| ------------ | ---- | -------- | -------------------------------------------------------------- |
| `id`         | str  |          | Job id, usable with `plakarkorp.plakar.job_info`.              |
| `started_at` | str  |          | When the job started, if it did.                               |
| `status`     | str  |          | One of `queued`, `running`, `canceled`, `succeeded`, `failed`. |
| `stopped_at` | str  |          | When the job stopped, if it did.                               |
