---
title: "Ansible Collection"
date: "2026-09-23T00:00:00Z"
weight: 3
summary:
  "Drive Plakar Control Plane from playbooks with the plakarkorp.plakar Ansible
  collection."
---

# Ansible Collection

The `plakarkorp.plakar` collection drives Plakar Control Plane (PCP) from
Ansible playbooks. It triggers backups, restores, syncs, checks and prunes,
reads job state, and declares the stores, connectors, inventories and
organizations those operations run against.

Every module talks HTTPS to the PCP API. Nothing is installed on or run against
the managed hosts, so plays target `localhost`, or use `delegate_to` when the
surrounding play is aimed elsewhere.

PCP performs every backup, restore, sync and check itself, as it does when one
of its own schedules triggers the work. The modules ask it to, and report the
result.

## Installing the collection

```sh
$ ansible-galaxy collection install plakarkorp.plakar
```

The collection requires `ansible-core` 2.15 or later.

For Red Hat Ansible Automation Platform, add the collection to an execution
environment. The collection repository ships an `execution-environment.yml` for
this:

```sh
$ ansible-builder build -t plakar-ee .
```

Point your job templates at the resulting image, and supply `PLAKAR_API_URL` and
`PLAKAR_API_KEY` through a credential type or the job's environment.

## Authentication

The collection authenticates with an API key belonging to an
[application user](../../administration/users#application-users), the account
type intended for automation. Keys carry the `pcp_ak_` prefix, are shown once
when minted, and belong to the organization they were minted in. An application
user cannot mint its own key, so this is done from the web interface.

Create the service account, grant it a role, and mint its key. The
[Operator](../../administration/permissions/operator) role suits a playbook that
runs work already defined in PCP.

Point the collection at the deployment with module arguments, or with the
`PLAKAR_API_URL` and `PLAKAR_API_KEY` environment variables:

```yaml
- hosts: localhost
  gather_facts: false
  environment:
    PLAKAR_API_URL: https://pcp.example.com
    PLAKAR_API_KEY: "{{ vault_plakar_api_key }}"
```

> [!NOTE]
>
> A service account holding no grant does not get authorization errors. It gets
> empty lists. When a module reports that no connector or store of that name
> exists, check the grant before the name.

## Acting on another organization

An API key is bound to one organization, and the collection acts there by
default. Setting `organization_id` on a task re-scopes it server-side for that
task, using the same key, and requires the account to be a member of the
organization it names.

The organization modules also accept an `organization` name, which acts on a
tenant beneath the key's own organization without re-scoping.

## Modules

| Module               | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| `backup`             | Back up a source into a store.                        |
| `restore`            | Restore a snapshot from a store onto a destination.   |
| `sync`               | Sync snapshots from one store into another.           |
| `check`              | Verify the integrity of a store's snapshots.          |
| `prune`              | Prune a store's snapshots by retention rule.          |
| `job_info`           | Read job state, one job or a filtered list.           |
| `store`              | Declare stores, initialized on creation.              |
| `connector`          | Declare source and destination connectors.            |
| `inventory`          | Declare inventories, provider-backed or self-managed. |
| `inventory_resource` | Declare resources in a self-managed inventory.        |
| `inventory_sync`     | Re-read what an inventory's provider holds.           |
| `inventory_info`     | Read inventories, their coverage and their resources. |
| `organization`       | Declare organizations beneath your own.               |
| `member`             | Manage an organization's people and service accounts. |
| `grant`              | Grant and revoke roles held by members.               |
| `organization_info`  | Read an organization, its members and its grants.     |

Module names are written in full in a playbook, as `plakarkorp.plakar.backup`.
Every option of every module is listed in the
[Ansible collection reference](../../references/ansible-collection), and each
module documents itself:

```sh
$ ansible-doc plakarkorp.plakar.backup
```

Beyond the options particular to a module, all of them take `api_url`,
`api_key`, `organization_id`, `validate_certs` and `timeout`. The modules that
trigger work also take `wait`, `wait_timeout` and `edge_tags`.

## Objects are addressed by name

Modules refer to stores, connectors, inventories and organizations by name, and
resolve those names within the organization when the task runs. Nothing has to
be looked up first or carried between tasks.

The declarative modules manage only the options the playbook sets. Any other
value the object holds in PCP keeps whatever it has, so removing an option from
a task stops managing it rather than clearing it.

## A worked example

```yaml
- hosts: localhost
  gather_facts: false
  environment:
    PLAKAR_API_URL: https://pcp.example.com
    PLAKAR_API_KEY: "{{ vault_plakar_api_key }}"
  tasks:
    - name: Back up the production database
      plakarkorp.plakar.backup:
        source: Production DB
        store: S3 Store
        labels: [nightly]

    - name: Replicate the store offsite
      plakarkorp.plakar.sync:
        store: S3 Store
        to_store: Offsite S3

    - name: Report any backup that failed today
      plakarkorp.plakar.job_info:
        task_type: backup
        status: failed
      register: failed
```

The play targets `localhost` because the modules call the PCP API rather than
the database being backed up. PCP reaches the source itself, from the appliance
or from an [edge](../../infrastructure/edges).

## Using the modules

{{< children description="true" >}}
