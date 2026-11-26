---
title: "plakar_connector"
date: "2026-11-26T11:35:02Z"
weight: 1
summary: "Arguments and attributes of the plakar_connector resource and data source."
---

# plakar_connector

## Resource

A Plakar source or destination connector. For stores, use plakar_store.

### Example Usage

```terraform
# The Vault secret provider the references below read from (see
# plakar_secret_provider), declared here so the example stands alone.
variable "vault_token" {
  type      = string
  sensitive = true
  ephemeral = true
}

resource "plakar_secret_provider" "vault" {
  name        = "Vault"
  integration = "vault"
  fields = {
    url = "https://vault.example.com:8200"
  }
  fields_wo = {
    token = var.vault_token
  }
  fields_wo_version = 1
}

# The access key id is not a secret; its secret half goes write-only below.
variable "media_access_key" {
  type = string
}

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

resource "plakar_connector" "bucket" {
  name        = "Media bucket"
  type        = "source"
  integration = "s3"
  resource    = "urn:res-quiet-harbor"
  fields = {
    root = "/"
  }
  secret_fields = {
    access_key        = { provider = plakar_secret_provider.vault.id, path = "secret/sources/media#access_key" }
    secret_access_key = { provider = plakar_secret_provider.vault.id, path = "secret/sources/media#secret_access_key" }
  }
}

variable "media_secret_key" {
  type      = string
  sensitive = true
  ephemeral = true
}

resource "plakar_connector" "bucket_write_only" {
  name        = "Media bucket (write-only)"
  type        = "source"
  integration = "s3"
  resource    = "urn:res-quiet-harbor"
  fields = {
    root       = "/"
    access_key = var.media_access_key
  }
  fields_wo = {
    secret_access_key = var.media_secret_key
  }
  fields_wo_version = 1
}

resource "plakar_inventory" "scaleway" {
  name = "Scaleway production"
  type = "scaleway"
  sync = true

  scaleway {
    project_id        = "11111111-2222-3333-4444-555555555555"
    access_key_secret = { provider = plakar_secret_provider.vault.id, path = "secret/inventories/scaleway#access_key" }
    secret_key_secret = { provider = plakar_secret_provider.vault.id, path = "secret/inventories/scaleway#secret_key" }
  }
}

# A synchronized inventory, and a bucket it discovers in the same
# configuration:
# the URN is only a string, so depends_on makes the connector wait for the
# sync that brings the bucket into the inventory.
resource "plakar_connector" "discovered_bucket" {
  name        = "Archive bucket"
  type        = "source"
  integration = "s3"
  resource    = "urn:scaleway:11111111-2222-3333-4444-555555555555:s3:fr-par:bucket:archive"
  fields = {
    root = "/"
  }
  secret_fields = {
    access_key        = { provider = plakar_secret_provider.vault.id, path = "secret/sources/archive#access_key" }
    secret_access_key = { provider = plakar_secret_provider.vault.id, path = "secret/sources/archive#secret_access_key" }
  }

  depends_on = [plakar_inventory.scaleway]
}
```

**Required**

| Argument      | Type                     | Description                                                                                                                                                                                                                                |
| ------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fields`      | Map of String, Sensitive | Integration-specific configuration. Only the keys declared here are managed; anything else set server-side keeps its value. An import adopts only the keys the integration does not mark sensitive; declare the others again, in any form. |
| `integration` | String                   | Name of the installed integration backing the connector, e.g. s3 or sftp.                                                                                                                                                                  |
| `name`        | String                   | Name of the connector, unique per connector type in the organization.                                                                                                                                                                      |
| `type`        | String                   | What the connector is used for: source or destination.                                                                                                                                                                                     |

**Optional**

| Argument            | Type                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data_classes`      | List of String           | Data classes the connector carries. Sources only: the Control Plane refuses them on a destination.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `environment`       | String                   | Environment label, e.g. production.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `fields_wo`         | Map of String, Sensitive | Integration-specific configuration that never lands in state, e.g. secret_access_key. Requires Terraform 1.11 or later. Its values are sent at creation, when fields_wo_version changes, and for a key that has just moved here from another form: Terraform cannot compare a write-only value with anything, so the version is what rotates it. A key may be set in one form only. A key removed from fields_wo keeps its server-side value, as for fields. An import cannot recover it: after one, keep fields_wo in the configuration and bump fields_wo_version to send it again.                                                                                                                                                                                                                                                                                                                                                                                     |
| `fields_wo_version` | Number                   | Change this to send fields_wo again, for instance after rotating a credential it carries.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `protocol`          | String                   | Protocol spoken to the resource. Defaults to the integration name, which matches for the standard integrations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `resource`          | String                   | URN or name of the inventory resource the connector attaches to; required to create one. Terraform sees no link between this string and the inventory: for a resource that a plakar_inventory with sync = true discovers in the same apply, add depends_on = [plakar_inventory.<name>], or the connector may be created before the sync and not find its resource. A connector whose resource was deleted afterwards, by hand or by a sync after it disappeared from the cloud, is left without one, and the Control Plane refuses any change to it but a new resource: a refresh clears resource in state, an import leaves it unset. With resource unset in the configuration too, the connector plans no change and can be destroyed; with resource set, the connector is attached to that resource in place, e.g. once it reappeared under the same URN. On a connector that has its resource, changing resource replaces the connector, and unsetting it is refused. |
| `secret_fields`     | String                   | Fields resolved from a secret provider each time Plakar needs them, instead of being stored: Plakar and Terraform state only hold the path. Keyed like fields; a key may not appear in both.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `temperature`       | String                   | Storage temperature, as the server reports it. Refused when set: the Control Plane only accepts a temperature on a store.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

**Read-Only**

| Attribute | Type   | Description                                                           |
| --------- | ------ | --------------------------------------------------------------------- |
| `id`      | String |                                                                       |
| `urn_id`  | String | Resolved id of the inventory resource; null once it no longer exists. |

### Import

```shell
terraform import plakar_connector.example <uuid>
```

## Data Source

A source or destination connector, looked up by type and name.

### Example Usage

```terraform
data "plakar_connector" "db" {
  name = "Production DB"
  type = "source"
}
```

**Required**

| Argument | Type   | Description            |
| -------- | ------ | ---------------------- |
| `name`   | String |                        |
| `type`   | String | source or destination. |

**Read-Only**

| Attribute     | Type   | Description |
| ------------- | ------ | ----------- |
| `environment` | String |             |
| `id`          | String |             |
| `protocol`    | String |             |
| `urn_id`      | String |             |
