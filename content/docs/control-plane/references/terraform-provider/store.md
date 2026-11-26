---
title: "plakar_store"
date: "2026-11-26T11:35:02Z"
weight: 13
summary: "Arguments and attributes of the plakar_store resource and data source."
---

# plakar_store

## Resource

A Plakar store — where backup data lands. Destroying the resource removes the store from Plakar; data in the underlying storage is not touched.

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

variable "repo_passphrase" {
  type      = string
  sensitive = true
}

variable "s3_access_key" {
  type = string
}

variable "s3_secret_key" {
  type      = string
  sensitive = true
}

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

# The same store with its secrets resolved from Vault each time Plakar needs
# them: Plakar and Terraform state only hold the paths.
resource "plakar_store" "offsite_vault" {
  name        = "Offsite S3 (Vault)"
  integration = "s3"
  resource    = "Ample Sky"
  environment = "production"
  fields = {
    root = "/backups"
  }
  secret_fields = {
    passphrase        = { provider = plakar_secret_provider.vault.id, path = "secret/backups/offsite#passphrase" }
    access_key        = { provider = plakar_secret_provider.vault.id, path = "secret/backups/offsite#access_key" }
    secret_access_key = { provider = plakar_secret_provider.vault.id, path = "secret/backups/offsite#secret_access_key" }
  }
}

# Or with the passphrase write-only: Plakar holds it, Terraform state never
# does. Requires Terraform 1.11 or later; bump fields_wo_version to send a
# new value.
variable "offsite_passphrase" {
  type      = string
  sensitive = true
  ephemeral = true
}

resource "plakar_store" "offsite_write_only" {
  name        = "Offsite S3 (write-only)"
  integration = "s3"
  resource    = "Ample Sky"
  environment = "production"
  fields = {
    root = "/backups"
  }
  fields_wo = {
    passphrase = var.offsite_passphrase
  }
  fields_wo_version = 1
  secret_fields = {
    access_key        = { provider = plakar_secret_provider.vault.id, path = "secret/backups/offsite#access_key" }
    secret_access_key = { provider = plakar_secret_provider.vault.id, path = "secret/backups/offsite#secret_access_key" }
  }
}
```

**Required**

| Argument      | Type                     | Description                                                                                                                                                                                                                                                                                                                                       |
| ------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fields`      | Map of String, Sensitive | Integration-specific configuration. Must carry a non-empty `passphrase` when the store is initialized here: it encrypts the store at rest. Only the keys declared here are managed; anything else set server-side keeps its value. An import adopts only the keys the integration does not mark sensitive; declare the others again, in any form. |
| `integration` | String                   | Name of the installed integration backing the store, e.g. s3.                                                                                                                                                                                                                                                                                     |
| `name`        | String                   | Name of the store, unique among stores in the organization.                                                                                                                                                                                                                                                                                       |
| `resource`    | String                   | URN or name of the inventory resource the store attaches to.                                                                                                                                                                                                                                                                                      |

**Optional**

| Argument            | Type                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `compression`       | String                   | Compression for the store at initialization (GZIP, LZ4, ZSTD). Unset keeps the engine's default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `data_classes`      | List of String           | Refused when set: the Control Plane only accepts data classes on a source connector.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `environment`       | String                   | Environment label, e.g. production.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `fields_wo`         | Map of String, Sensitive | Integration-specific configuration that never lands in state, e.g. passphrase. Requires Terraform 1.11 or later. Its values are sent at creation, when fields_wo_version changes, and for a key that has just moved here from another form: Terraform cannot compare a write-only value with anything, so the version is what rotates it. A key may be set in one form only. A key removed from fields_wo keeps its server-side value, as for fields. An import cannot recover it: after one, keep fields_wo in the configuration and bump fields_wo_version to send it again. |
| `fields_wo_version` | Number                   | Change this to send fields_wo again, for instance after rotating a credential it carries.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `initialize`        | Boolean                  | Initialize the underlying storage at creation. Never re-runs on update. Set it to false when the storage is already initialized elsewhere, which also lifts the passphrase requirement.                                                                                                                                                                                                                                                                                                                                                                                        |
| `protocol`          | String                   | Protocol spoken to the resource. Defaults to the integration name, which matches for the standard integrations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `secret_fields`     | String                   | Fields resolved from a secret provider each time Plakar needs them, instead of being stored: Plakar and Terraform state only hold the path. Keyed like fields; a key may not appear in both.                                                                                                                                                                                                                                                                                                                                                                                   |
| `temperature`       | String                   | Storage temperature. Computed by the server when not set.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

**Read-Only**

| Attribute | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| `id`      | String |                                        |
| `urn_id`  | String | Resolved id of the inventory resource. |

### Import

```shell
terraform import plakar_store.example <uuid>
```

## Data Source

A store, looked up by name.

### Example Usage

```terraform
data "plakar_store" "existing" {
  name = "Offsite S3"
}
```

**Required**

| Argument | Type   | Description |
| -------- | ------ | ----------- |
| `name`   | String |             |

**Read-Only**

| Attribute     | Type   | Description |
| ------------- | ------ | ----------- |
| `environment` | String |             |
| `id`          | String |             |
| `protocol`    | String |             |
| `type`        | String |             |
| `urn_id`      | String |             |
