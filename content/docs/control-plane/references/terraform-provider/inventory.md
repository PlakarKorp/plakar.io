---
title: "plakar_inventory"
date: "2026-11-26T11:35:02Z"
weight: 6
summary: "Arguments and attributes of the plakar_inventory resource and data source."
---

# plakar_inventory

## Resource

An inventory — the census of resources Plakar watches over. Provider-backed inventories (aws, ovh, scaleway, gcp, vmware, k8s) discover their resources from the account they are configured against; a self-managed inventory holds resources declared by hand, e.g. with plakar_inventory_resource.

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

variable "aws_access_key" {
  type = string
}

variable "aws_secret_access_key" {
  type      = string
  sensitive = true
}

# The fleet declared by hand: a self-managed inventory carries no
# configuration, its resources are declared with plakar_inventory_resource.
resource "plakar_inventory" "fleet" {
  name = "Fleet"
  type = "self-managed"
}

# A provider-backed inventory discovers its resources from the account it is
# configured against.
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

# A scaleway inventory keeps its keys out of state: the access key resolved
# from Vault, the secret key write-only. Each credential takes one of three
# forms: <name>, <name>_secret or <name>_wo. Other inventory types take
# plain values only for now.
variable "scw_secret_key" {
  type      = string
  sensitive = true
  ephemeral = true
}

resource "plakar_inventory" "scaleway" {
  name = "Scaleway production"
  type = "scaleway"

  # Discover the project's resources each time Terraform writes the
  # inventory, which also proves the keys work: a failed sync fails the apply.
  sync = true

  scaleway {
    project_id            = "11111111-2222-3333-4444-555555555555"
    access_key_secret     = { provider = plakar_secret_provider.vault.id, path = "secret/inventories/scaleway#access_key" }
    secret_key_wo         = var.scw_secret_key
    secret_key_wo_version = 1
  }
}
```

**Required**

| Argument | Type   | Description                                                                                                                                                                   |
| -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`   | String | Name of the inventory.                                                                                                                                                        |
| `type`   | String | What backs the inventory: aws, ovh, scaleway, gcp, vmware, k8s or self-managed. Must match the configuration block, one of which is required for every type but self-managed. |

**Optional**

| Argument        | Type          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sync`          | Boolean       | Synchronize the inventory each time Terraform writes it: after it is created, after any change to its configuration, and when this attribute turns true. A sync discovers the resources of the account, adds the new ones and drops those that no longer exist; it is also when the Control Plane first uses the credentials, so a failed sync fails the apply with the server's reason. Nothing is synchronized when the configuration does not change, and a self-managed inventory, having nothing to discover, refuses it. A failed sync at creation leaves the inventory in state, tainted: the next apply replaces it, or `terraform untaint` then a change to sync_triggers synchronizes it again as is. A failed sync at update keeps the new configuration in state but records sync as false and sync_triggers as they were, so the next plan shows sync turning true and the next apply tries again by itself, without sending the configuration. The provider waits up to five minutes for a sync, and for one already running, e.g. started from the web interface. Defaults to false. |
| `sync_triggers` | Map of String | Arbitrary values whose change synchronizes the inventory again without sending its configuration, e.g. to retry after a failed sync. Only acts when sync is true, so never on a self-managed inventory. Stored in state as written: keep secrets out.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `aws`           | Block         | Configuration of an aws inventory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `gcp`           | Block         | Configuration of a gcp inventory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `k8s`           | Block         | Configuration of a k8s inventory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `ovh`           | Block         | Configuration of an ovh inventory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `scaleway`      | Block         | Configuration of a scaleway inventory. Each credential can be given plainly, as a reference to a secret provider (<name>_secret), or write-only (<name>_wo).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `vmware`        | Block         | Configuration of a vmware inventory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

**Read-Only**

| Attribute        | Type   | Description                                                                                                                                                                                                                    |
| ---------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`             | String |                                                                                                                                                                                                                                |
| `last_synced_at` | String | When the Control Plane last synchronized the inventory successfully, from Terraform or from the web interface, since its configuration last changed (RFC 3339). Null when it has not: a change to the configuration clears it. |

### Nested Schema for `aws`

**Optional**

| Argument            | Type              | Description                                             |
| ------------------- | ----------------- | ------------------------------------------------------- |
| `access_key`        | String, Sensitive | Access key id, when credentials_type is access_key.     |
| `credentials_type`  | String            | How to authenticate: iam or access_key.                 |
| `region`            | String            | AWS region the discovery runs against.                  |
| `secret_access_key` | String, Sensitive | Secret access key, when credentials_type is access_key. |

### Nested Schema for `gcp`

**Optional**

| Argument               | Type              | Description                                                            |
| ---------------------- | ----------------- | ---------------------------------------------------------------------- |
| `project_id`           | String            |                                                                        |
| `service_account_json` | String, Sensitive | Service account key, as JSON. Unset falls back to ambient credentials. |

### Nested Schema for `k8s`

**Optional**

| Argument     | Type              | Description                                                                            |
| ------------ | ----------------- | -------------------------------------------------------------------------------------- |
| `kubeconfig` | String, Sensitive | Kubeconfig granting access to the cluster. Unset falls back to in-cluster credentials. |

### Nested Schema for `ovh`

**Optional**

| Argument             | Type              | Description                    |
| -------------------- | ----------------- | ------------------------------ |
| `application_key`    | String, Sensitive |                                |
| `application_secret` | String, Sensitive |                                |
| `consumer_key`       | String, Sensitive |                                |
| `endpoint`           | String            | OVH API endpoint, e.g. ovh-eu. |

### Nested Schema for `scaleway`

**Optional**

| Argument                | Type              | Description                                                                                                                                                                          |
| ----------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `access_key`            | String, Sensitive | Scaleway access key. Lands in state; see access_key_secret and access_key_wo.                                                                                                        |
| `access_key_secret`     | String            | Resolve access_key from a secret provider each time Plakar needs it: only the path is stored.                                                                                        |
| `access_key_wo`         | String, Sensitive | Write-only access_key: Plakar holds it, state never does. Requires Terraform 1.11 or later. Sent at creation, when access_key_wo_version changes, and when it replaces another form. |
| `access_key_wo_version` | Number            | Change this to send access_key_wo again.                                                                                                                                             |
| `project_id`            | String            |                                                                                                                                                                                      |
| `secret_key`            | String, Sensitive | Scaleway secret key. Lands in state; see secret_key_secret and secret_key_wo.                                                                                                        |
| `secret_key_secret`     | String            | Resolve secret_key from a secret provider each time Plakar needs it: only the path is stored.                                                                                        |
| `secret_key_wo`         | String, Sensitive | Write-only secret_key: Plakar holds it, state never does. Requires Terraform 1.11 or later. Sent at creation, when secret_key_wo_version changes, and when it replaces another form. |
| `secret_key_wo_version` | Number            | Change this to send secret_key_wo again.                                                                                                                                             |

### Nested Schema for `vmware`

**Optional**

| Argument          | Type              | Description                                          |
| ----------------- | ----------------- | ---------------------------------------------------- |
| `password`        | String, Sensitive |                                                      |
| `server`          | String            |                                                      |
| `tls_ca_bundle`   | String            | CA bundle to verify the vSphere server against, PEM. |
| `tls_skip_verify` | Boolean           | Skip TLS verification of the vSphere server.         |
| `username`        | String            |                                                      |

### Import

```shell
terraform import plakar_inventory.fleet 3f1e4a2c-9b7d-4e0f-8a11-2c5d6e7f8a90
```

## Data Source

An inventory, looked up by name.

### Example Usage

```terraform
data "plakar_inventory" "fleet" {
  name = "Fleet"
}
```

**Required**

| Argument | Type   | Description |
| -------- | ------ | ----------- |
| `name`   | String |             |

**Read-Only**

| Attribute | Type   | Description                                           |
| --------- | ------ | ----------------------------------------------------- |
| `id`      | String |                                                       |
| `type`    | String | aws, ovh, scaleway, gcp, vmware, k8s or self-managed. |
