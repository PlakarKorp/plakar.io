---
title: "Inventories"
date: "2026-09-23T00:00:00Z"
weight: 3
summary:
  "Declaring provider-backed and self-managed inventories, and mirroring an
  Ansible fleet into one."
---

# Inventories

Connectors attach to the resources of an
[inventory](../../../infrastructure/inventories), which is what PCP knows of
your estate and what it measures coverage against. Four modules cover them.
`inventory` declares one, `inventory_resource` declares what a self-managed one
holds, `inventory_sync` re-reads a provider, and `inventory_info` reads any of
it back.

## Provider-backed inventories

A provider-backed inventory watches a cloud account and fills itself from what
it finds there. Its `configuration` carries the credentials for that account:

```yaml
- name: Declare the Scaleway inventory
  plakarkorp.plakar.inventory:
    name: Production Scaleway
    type: scaleway
    configuration:
      scw_project_id: "{{ scw_project_id }}"
      scw_access_key: "{{ vault_scw_access_key }}"
      scw_secret_key: "{{ vault_scw_secret_key }}"

- name: Read what the account holds now
  plakarkorp.plakar.inventory_sync:
    name: Production Scaleway
```

`inventory_sync` re-reads the provider on demand, which is how a playbook picks
up infrastructure created moments earlier in the same run.

## Self-managed inventories

A self-managed inventory holds whatever is declared in it, which is how a fleet
Ansible already knows about becomes an inventory PCP tracks coverage for.

Resources are keyed by URN, so declaring them is idempotent and the play can run
on every inventory change:

```yaml
- name: Mirror the Ansible inventory into the control plane
  hosts: localhost
  gather_facts: false
  tasks:
    - plakarkorp.plakar.inventory:
        name: Ansible fleet
        type: self-managed

    - plakarkorp.plakar.inventory_resource:
        inventory: Ansible fleet
        urn: "urn:ansible:{{ item }}"
        name: "{{ item }}"
        class: "{{ hostvars[item].plakar_class | default('compute') }}"
        endpoints: ["{{ hostvars[item].ansible_host | default(item) }}"]
        tags: "{{ hostvars[item].plakar_tags | default([]) }}"
      loop: "{{ groups['all'] }}"
```

Retiring a resource is `state: absent` on its URN.

Use the classes PCP knows: `compute`, `database`, `file-storage`,
`object-storage`, `block-storage`, `network`, `hypervisor` and `service`. The
API stores an unknown class as given, but the web interface and coverage
grouping key off the known set, so an invented one leaves the resource
ungrouped.

## Reading an inventory back

`inventory_info` reports the inventories and, with `include_resources`, what
each one holds:

```yaml
- plakarkorp.plakar.inventory_info:
    name: Ansible fleet
    include_resources: true
  register: fleet
```

It also reports coverage, meaning how many resources are protected, unprotected,
or excluded. A freshly mirrored host counts as unprotected until a connector and
a schedule cover it, which makes this the check to run after a mirroring play.
