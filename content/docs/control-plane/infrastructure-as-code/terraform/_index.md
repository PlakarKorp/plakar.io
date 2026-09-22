---
title: "Terraform Provider"
date: "2026-09-11T00:00:00Z"
weight: 2
summary:
  "Manage Plakar Control Plane declaratively with the plakarkorp/plakar
  Terraform provider."
---

# Terraform Provider

The `plakarkorp/plakar` Terraform provider configures Plakar Control Plane (PCP)
from code. Stores, connectors, schedules, inventories, organizations and the
roles held in them are declared in `.tf` files and reconciled with
`terraform apply` instead of being created from the web interface.

The provider does not run PCP and does not move backup data. It calls the PCP
API to create, update and read objects, and PCP performs every backup, restore,
sync and check itself. The only requirement is network access to the PCP API,
wherever PCP is [installed](../../intro/installation).

## Installing the provider

The provider is published on the Terraform registry as
[`plakarkorp/plakar`](https://registry.terraform.io/providers/plakarkorp/plakar).
The provider block identifies the PCP instance it acts on and the credentials it
acts with.

```terraform
terraform {
  required_providers {
    plakar = {
      source = "plakarkorp/plakar"
    }
  }
}

provider "plakar" {
  api_url = "https://pcp.example.com" # or PLAKAR_API_URL
  api_key = var.plakar_api_key        # or PLAKAR_API_KEY
}
```

`api_url` is the base URL of the PCP instance. Both arguments fall back to the
`PLAKAR_API_URL` and `PLAKAR_API_KEY` environment variables when they are left
out, which is how the key is normally supplied in CI.

## Authentication

The provider authenticates with an API key belonging to an
[application user](../../administration/users#application-users), the account
type intended for automation. API keys carry the `pcp_ak_` prefix and are
created from the web interface.

An API key belongs to one organization, and the provider acts in that
organization unless told otherwise. Setting `organization_id` on the provider
moves every declaration into a different organization, which requires the
application user to be a member of it. Individual resources accept the same
argument and override the provider for themselves, so one configuration can span
several organizations.

The account's [permissions](../../administration/permissions) determine what the
provider can do. When an apply fails on a single resource with an authorization
error, the role granted to the application user does not reach that part of the
organization.

## Secrets in Terraform state

The `fields` of a store or a connector hold the credentials Plakar Control Plane
uses to reach a resource, and Terraform records them in state. The same applies
to `generated_password`, the one-time password returned when a member resource
registers a new account. State therefore contains secrets that grant access to
the systems being backed up, and needs a backend that encrypts at rest and
restricts who can read it.

## A worked example

The following configuration creates a store, refers to a source that already
exists, and backs one up into the other every night.

```terraform
resource "plakar_store" "offsite" {
  name        = "Offsite S3"
  integration = "s3"
  resource    = "Ample Sky" # inventory resource, by URN or name
  environment = "production"

  fields = {
    passphrase        = var.repo_passphrase
    access_key        = var.s3_access_key
    secret_access_key = var.s3_secret_key
    root              = "/backups"
  }
}

data "plakar_connector" "db" {
  name = "Production DB"
  type = "source"
}

resource "plakar_schedule" "nightly" {
  name      = "Nightly database backup"
  type      = "backup"
  origin_id = data.plakar_connector.db.id
  target_id = plakar_store.offsite.id
  labels    = ["nightly"]

  rule {
    periodicity = 86400 # seconds
  }
}
```

- `plakar_store` creates a [store app](../../apps/stores) backed by the S3
  integration and attached to the `Ample Sky` resource of an inventory. Its
  `fields` carry what that integration needs to reach the bucket, including the
  passphrase the store is encrypted with.

- `data "plakar_connector"` creates nothing. It resolves a
  [source app](../../apps/sources) that already exists in PCP and exposes its
  id, which is what the schedule needs to refer to it.

- `plakar_schedule` creates a [backup task](../../scheduling/tasks#backup-task)
  that reads from that source and writes to the store every 86400 seconds.
  Because it refers to both blocks above, Terraform creates the store before the
  schedule that depends on it.

## Adopting an existing deployment

A deployment configured through the web interface can be brought under Terraform
without being rebuilt. Importing an object records it in state under a resource
block you have already written, and changes nothing in PCP.

```shell
terraform import plakar_store.offsite 3f1e4a2c-9b7d-4e0f-8a11-2c5d6e7f8a90
```

The plan that follows an import compares the object as PCP reports it against
the block that now owns it, and proposes changes wherever the two differ. Read
that plan before applying it.

Most resources import by their own id. Three belong to a parent object and take
a composite id:

| Resource                    | Import id                      |
| --------------------------- | ------------------------------ |
| `plakar_member`             | `<organization_id>/<user_id>`  |
| `plakar_grant`              | `<organization_id>/<grant_id>` |
| `plakar_inventory_resource` | `<inventory_id>/<urn_id>`      |

An object that belongs to someone else does not have to be imported at all. A
data source resolves it by name and returns its id, leaving ownership and
credentials where they are.

## Resources and data sources

{{< children description="true" >}}

Every argument and attribute of every resource and data source is listed in the
[Terraform provider reference](../../references/terraform-provider).
