---
title: "Stores and Connectors"
date: "2026-09-11T00:00:00Z"
weight: 1
summary:
  "Declaring store, source and destination apps with plakar_store and
  plakar_connector."
---

# Stores and Connectors

An [app](../../../apps) connects a resource in an inventory to PCP so that it
can take part in a backup workflow. The provider declares apps with two
resources. `plakar_store` creates a store, where backup data is written.
`plakar_connector` creates a [source](../../../apps/sources) or a
[destination](../../../apps/destinations), selected by its `type` argument.

Both require the same three things: the installed
[integration](../../../apps/integrations) that speaks to the resource, the
resource itself, and the `fields` that integration needs in order to reach it.
The resource is named by its URN or by its name, and a name only resolves when
it is unique within the inventory.

## Stores

```terraform
resource "plakar_store" "offsite" {
  name        = "Offsite S3"
  integration = "s3"
  resource    = "Ample Sky"
  environment = "production"

  fields = {
    passphrase        = var.repo_passphrase
    access_key        = var.s3_access_key
    secret_access_key = var.s3_secret_key
    root              = "/backups"
  }
}
```

A store app describes where backup data should go. The
[Kloset store](../../../apps/stores#testing-and-initializing) itself is a
structure that has to exist at that location before anything can be written to
it. Setting `initialize` creates that structure when the resource is created,
and `compression` selects the algorithm used while doing so. Initialization runs
at creation only, so a location that already holds a store is never touched by a
later apply.

Destroying the resource removes the store from PCP. The backup data in the
underlying storage is left in place, and can be reattached by declaring the
store again without `initialize`.

## Connectors

```terraform
resource "plakar_connector" "web" {
  name        = "Web tier"
  type        = "source"
  integration = "sftp"
  resource    = "urn:res-grateful-cascade"
  environment = "production"

  fields = {
    username = "tunnel"
    root     = "/home/tunnel/data"
    port     = "2222"
  }
}
```

A connector is either a source or a destination, and `type` decides which.
Beyond that, the two differ only in how PCP uses them.

The `environment` and `data_classes` arguments carry the classification that
[SLA policies](../../../compliance/policies) match on. A source declared here is
covered by a policy scoped to its environment and data class in the same way as
a source created from the web interface, so declaring the app is enough to bring
it under an existing policy.

## How fields are managed

`fields` is not the complete configuration of the app. The provider manages only
the keys present in the map, and any other value set on the app in PCP keeps
whatever it has. Removing a key from the map therefore stops managing that key
rather than clearing it in PCP.

Field values are credentials. They are sensitive, and Terraform records them in
state, as described [here](.#secrets-in-terraform-state).

## Referring to apps managed elsewhere

An app that already exists, or that is owned by another configuration, can be
resolved instead of declared:

```terraform
data "plakar_store" "existing" {
  name = "Offsite S3"
}

data "plakar_connector" "db" {
  name = "Production DB"
  type = "source"
}
```

A data source returns the identity of the app, which is what a
[schedule](./scheduling) refers to. It never returns credentials, and Terraform
takes no ownership of the app, so a destroy elsewhere in the configuration
leaves it alone.
