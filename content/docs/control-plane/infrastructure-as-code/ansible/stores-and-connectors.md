---
title: "Stores and Connectors"
date: "2026-09-23T00:00:00Z"
weight: 2
summary:
  "Declaring store, source and destination apps with the store and connector
  modules."
---

# Stores and Connectors

An [app](../../../apps) connects a resource in an inventory to PCP so that it
can take part in a backup workflow. The `store` module declares a store, where
backup data is written. The `connector` module declares a
[source](../../../apps/sources) or a [destination](../../../apps/destinations),
selected by its `type`.

Both need the same three things: the installed
[integration](../../../apps/integrations) that speaks to the resource, the
resource itself, and the `fields` that integration needs in order to reach it.
The resource is named by its URN or by its name, and a name only resolves when
it is unique within the inventory.

## Stores

```yaml
- name: Declare the offsite store
  plakarkorp.plakar.store:
    name: Offsite S3
    integration: s3
    resource: Ample Sky
    environment: production
    fields:
      passphrase: "{{ vault_repo_passphrase }}"
      access_key: "{{ vault_s3_access_key }}"
      secret_access_key: "{{ vault_s3_secret_key }}"
      root: /backups
```

The [Kloset store](../../../apps/stores#testing-and-initializing) is a structure
that has to exist at the location before anything can be written to it.
`initialize` defaults to `true`, so the module creates that structure along with
the store, and only ever at creation. `compression` selects the algorithm used
while doing so.

A store initialized this way is encrypted at rest with the `passphrase` in
`fields`, which is why that key belongs in Ansible Vault rather than in the
playbook. Setting `initialize: false` says the storage was initialized
elsewhere, and lifts the passphrase requirement with it.

## Connectors

```yaml
- name: Declare the web tier source
  plakarkorp.plakar.connector:
    name: Web tier
    type: source
    integration: sftp
    resource: urn:res-grateful-cascade
    environment: production
    fields:
      username: tunnel
      root: /home/tunnel/data
      port: "2222"
```

A connector is either a source or a destination, and `type` decides which.
Beyond that the two differ only in how PCP uses them.

`environment` and `data_classes` carry the classification that
[SLA policies](../../../compliance/policies) match on. A source declared here is
covered by a policy scoped to its environment and data class in the same way as
one created from the web interface, so declaring the app is enough to bring it
under an existing policy.

## How fields are managed

`fields` is not the complete configuration of an app. The module manages only
the keys the task sets, and any other value the app holds in PCP keeps whatever
it has. Removing a key from the map stops managing that key rather than clearing
it in PCP.

Field values are credentials for the systems being backed up. Supply them from
Ansible Vault or from whatever secret store the rest of your playbooks use.
