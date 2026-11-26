---
title: "inventory_resource"
date: "2026-11-26T12:13:20Z"
weight: 10
summary: "Manage resources in a self-managed Plakar inventory."
---

# inventory_resource

Written `plakarkorp.plakar.inventory_resource` in a task.

Manage resources in a self-managed Plakar inventory.

Declares, updates and deletes resources in a self-managed inventory (see
`plakarkorp.plakar.inventory`). Provider-backed inventories are read-only; their
resources come from synchronization.

Resources are matched by URN within the inventory; the URN is the playbook's key
and is immutable.

Only the options the playbook sets are managed on update; anything else keeps
its current server-side value.

## Examples

```yaml
- name: Declare the database server
  plakarkorp.plakar.inventory_resource:
    inventory: Datacenter racks
    urn: urn:res-db-primary
    name: DB primary
    class: database
    subclass: postgres
    endpoints: [db1.internal]
    tags: [production, database]

- name: Retire it
  plakarkorp.plakar.inventory_resource:
    inventory: Datacenter racks
    urn: urn:res-db-primary
    state: absent
```

## Options

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

## Returns

| Key         | Type        | Returned                                | Description                                                  |
| ----------- | ----------- | --------------------------------------- | ------------------------------------------------------------ |
| `diff_keys` | list of str | on update                               | The option names whose values differed and drove the update. |
| `resource`  | dict        | when the resource exists or was created | The resource acted on (a summary).                           |
