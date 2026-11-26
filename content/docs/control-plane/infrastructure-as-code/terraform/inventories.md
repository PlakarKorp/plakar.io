---
title: "Inventories"
date: "2026-09-11T00:00:00Z"
weight: 3
summary:
  "Declaring managed and self-managed inventories, and the resources inside
  them."
---

# Inventories

An [inventory](../../../inventories) is the set of resources PCP knows about,
and apps attach to those resources. `plakar_inventory` declares one. Its `type`
determines where the resources come from: an inventory of type `aws`, `ovh`,
`scaleway`, `gcp`, `vmware` or `k8s` discovers them from the account it is
configured against, while a `self-managed` inventory holds only what is declared
in it by hand.

## Managed inventories

Every type except `self-managed` requires a configuration block of the same
name, which supplies the credentials discovery runs with.

```terraform
resource "plakar_inventory" "aws" {
  name = "AWS production"
  type = "aws"

  aws {
    credentials_type  = "access_key"
    access_key        = var.aws_access_key
    secret_access_key = var.aws_secret_access_key
    region            = "eu-west-1"
  }
}
```

Three of the types can also use the credentials of the environment PCP runs in,
which keeps long-lived secrets out of Terraform state. An `aws` inventory with
`credentials_type = "iam"` uses the IAM role PCP runs under, a `gcp` inventory
without `service_account_json` falls back to the ambient service account, and a
`k8s` inventory without `kubeconfig` uses in-cluster credentials.

### Scaleway keys

The `scaleway` inventory can keep its keys out of Terraform state. Its
`access_key` and `secret_key` take the same three forms as the fields of a
store, described in [Managing Secrets](./secrets). Instead of separate maps,
each form is its own argument, named after the key:

- `secret_key` holds a plain value.
- `secret_key_secret` holds a reference to a secret provider.
- `secret_key_wo` holds a write-only value, sent again when
  `secret_key_wo_version` changes.

Set each key in one form only.

```terraform
resource "plakar_inventory" "scaleway" {
  name = "Scaleway production"
  type = "scaleway"

  scaleway {
    project_id            = "11111111-2222-3333-4444-555555555555"
    access_key_secret     = { provider = plakar_secret_provider.vault.id, path = "secret/inventories/scaleway#access_key" }
    secret_key_wo         = var.scw_secret_key
    secret_key_wo_version = 1
  }
}
```

## Synchronizing an inventory

With `sync = true`, a managed inventory synchronizes each time it is created or
its configuration changes. A failed sync, such as one with a revoked key, fails
the apply.

```terraform
resource "plakar_inventory" "aws" {
  name = "AWS production"
  type = "aws"
  sync = true

  sync_triggers = {
    access_key = var.aws_access_key
  }

  aws {
    # ...
  }
}
```

A change to `sync_triggers` synchronizes the inventory again without changing
its configuration. Use it after a change Terraform cannot see, such as a key
rotated in the secret manager. Its values are stored in state, so use
identifiers like the access key id, never secrets. On a connector for a
discovered resource, add `depends_on` so that it is created after the sync:

```terraform
resource "plakar_connector" "archive" {
  name        = "Archive bucket"
  type        = "source"
  integration = "s3"
  resource    = "archive-bucket"

  fields = {
    root = "/"
  }

  depends_on = [plakar_inventory.aws]
}
```

## Self-managed inventories

A [self-managed](../../../inventories/self-managed) inventory discovers nothing,
so it takes no configuration block. Its contents are declared one
`plakar_inventory_resource` at a time, which is how infrastructure that no cloud
API describes is represented in PCP.

```terraform
resource "plakar_inventory" "fleet" {
  name = "Fleet"
  type = "self-managed"
}

resource "plakar_inventory_resource" "db1" {
  inventory_id = plakar_inventory.fleet.id
  urn          = "urn:fleet:database/db1"
  name         = "db1"
  class        = "database"
  subclass     = "postgres"
  endpoints    = ["db1.internal"]
  tags         = ["production"]
}
```

The `urn` identifies the resource within the inventory and is the handle apps
attach to. `class` and `subclass` describe what the resource is, and PCP uses
them to determine which integrations are compatible with it. `endpoints` holds
the addresses the resource is reached at.

Declaring the app in the same configuration attaches it to the resource by URN,
so the system and the app that protects it are created together:

```terraform
resource "plakar_connector" "db1_dump" {
  name        = "db1 nightly dump"
  type        = "source"
  integration = "postgres"
  resource    = plakar_inventory_resource.db1.urn

  fields = {
    connection_string = var.db1_connection_string
  }
}
```

## Legal holds on a resource

`plakar_inventory_resource` exposes a read-only `locked` attribute, which
reports whether the resource is under a
[legal hold](../../../compliance/legal-hold). While a hold is in place, PCP
refuses every task that would use an app configured against the resource.

Holds are placed and lifted by an operator rather than through Terraform. The
provider therefore leaves `locked` unknown at plan time instead of promising a
value that an operator's decision could contradict.

## Referring to discovered resources

Resources found by a managed inventory exist without Terraform creating them. A
data source resolves one so that an app can attach to it:

```terraform
data "plakar_resource" "db_host" {
  ref = "urn:aws:123456789:ec2:eu-west-1:instance:i-0abc"
}
```

`ref` accepts a URN or a name. A name only resolves when it is unique, so the
URN is the dependable reference in an inventory of any size.
