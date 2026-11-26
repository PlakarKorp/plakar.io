---
title: "plakar_secret_provider"
date: "2026-11-26T11:35:02Z"
weight: 12
summary:
  "Arguments and attributes of the plakar_secret_provider resource and data
  source."
---

# plakar_secret_provider

## Resource

A Plakar secret provider: an external secret manager that store, connector and
inventory credentials can be resolved from at run time, so their values never
reach Plakar's database or Terraform state. Pass the secret provider's own
credential in fields_wo, which Terraform 1.11 and later never write to state.
Scaleway Secret Manager (integration scaleway) takes scw_region in fields and
scw_secret_key in fields_wo: the secret key of an API key whose IAM policy
grants SecretManagerReadOnly and SecretManagerSecretAccess on the projects
holding the secrets, nothing more. Its test call is not implemented by the
integration; a reference resolves when the store, connector or inventory using
it runs or synchronizes.

### Example Usage

```terraform
# The token never lands in state: pass it through an ephemeral variable, and
# bump fields_wo_version whenever it is rotated.
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

# Scaleway Secret Manager: an API key limited to SecretManagerReadOnly and
# SecretManagerSecretAccess on the secrets' project. A reference to it reads
# "<secret id>#<key>", the secret's value being a JSON object.
variable "scw_secret_key" {
  type      = string
  sensitive = true
  ephemeral = true
}

resource "plakar_secret_provider" "scaleway" {
  name        = "Scaleway Secret Manager"
  integration = "scaleway"
  fields = {
    scw_region = "fr-par"
  }
  fields_wo = {
    scw_secret_key = var.scw_secret_key
  }
  fields_wo_version = 1
}

# The access key id is not a secret: a variable, not a placeholder.
variable "scw_access_key" {
  type = string
}

resource "plakar_inventory" "scaleway" {
  name = "Scaleway"
  type = "scaleway"
  scaleway {
    project_id = "11111111-2222-3333-4444-555555555555"
    access_key = var.scw_access_key
    secret_key_secret = {
      provider = plakar_secret_provider.scaleway.id
      path     = "66666666-7777-8888-9999-000000000000#secret_key"
    }
  }
}
```

**Required**

| Argument      | Type                     | Description                                                                                                                                                                                                                                    |
| ------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fields`      | Map of String, Sensitive | Integration-specific configuration that may live in state, e.g. url for vault. Only the keys declared here are managed; anything else set server-side keeps its value. An import adopts only the keys the integration does not mark sensitive. |
| `integration` | String                   | Name of the installed integration backing the secret provider, e.g. vault.                                                                                                                                                                     |
| `name`        | String                   | Name of the secret provider, unique in the organization.                                                                                                                                                                                       |

**Optional**

| Argument            | Type                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fields_wo`         | Map of String, Sensitive | Integration-specific configuration that never lands in state, e.g. token for vault. Requires Terraform 1.11 or later. Its values are sent at creation, when fields_wo_version changes, and for a key that has just moved here from another form: Terraform cannot compare a write-only value with anything, so the version is what rotates it. A key may be set in one form only. A key removed from fields_wo keeps its server-side value, as for fields. An import cannot recover it: after one, keep fields_wo in the configuration and bump fields_wo_version to send it again. |
| `fields_wo_version` | Number                   | Change this to send fields_wo again, for instance after rotating a credential it carries.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `protocol`          | String                   | Protocol spoken to the secret manager. Defaults to the one the integration declares for secret providers; unlike stores it does not share the integration's name (vault speaks vault-sm).                                                                                                                                                                                                                                                                                                                                                                                           |

**Read-Only**

| Attribute | Type   | Description |
| --------- | ------ | ----------- |
| `id`      | String |             |

### Import

```shell
terraform import plakar_secret_provider.example <uuid>
```

## Data Source

A secret provider, looked up by name.

### Example Usage

```terraform
data "plakar_secret_provider" "vault" {
  name = "Vault"
}
```

**Required**

| Argument | Type   | Description |
| -------- | ------ | ----------- |
| `name`   | String |             |

**Read-Only**

| Attribute     | Type   | Description |
| ------------- | ------ | ----------- |
| `id`          | String |             |
| `integration` | String |             |
| `protocol`    | String |             |
