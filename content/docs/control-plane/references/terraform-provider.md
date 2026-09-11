---
title: "Terraform Provider"
date: "2026-09-11T10:13:41Z"
weight: 2
summary:
  "Argument-by-argument reference for every resource and data source in the
  plakar Terraform provider."
---

# Terraform provider reference

This page lists every argument and attribute of every resource and data source
in the `plakarkorp/plakar` Terraform provider. For an introduction to what these
resources are and how to use them, see
[Terraform Provider](../../infrastructure-as-code/terraform).

## Provider

Manage Plakar backup configuration — stores, connectors and schedules — through
the Plakar management API.

#### Example Usage

```terraform
provider "plakar" {
  api_url = "https://plakar.example.com" # or PLAKAR_API_URL
  api_key = var.plakar_api_key           # or PLAKAR_API_KEY
}
```

**Optional**

| Argument          | Type              | Description                                                                                           |
| ----------------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| `api_key`         | String, Sensitive | API key of a service account (pcp_ak_...). Falls back to PLAKAR_API_KEY.                              |
| `api_url`         | String            | Base URL of the Plakar management API, e.g. https://plakar.example.com. Falls back to PLAKAR_API_URL. |
| `organization_id` | String            | Organization to operate in, when different from the one the API key is bound to.                      |

## Resources

### plakar_connector (Resource)

A Plakar source or destination connector. For stores, use plakar_store.

#### Example Usage

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

**Required**

| Argument      | Type                     | Description                                                                                                                 |
| ------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `fields`      | Map of String, Sensitive | Integration-specific configuration. Only the keys declared here are managed; anything else set server-side keeps its value. |
| `integration` | String                   | Name of the installed integration backing the connector, e.g. s3 or sftp.                                                   |
| `name`        | String                   | Name of the connector, unique per connector type in the organization.                                                       |
| `resource`    | String                   | URN or name of the inventory resource the connector attaches to.                                                            |
| `type`        | String                   | What the connector is used for: source or destination.                                                                      |

**Optional**

| Argument       | Type           | Description                                                                                                     |
| -------------- | -------------- | --------------------------------------------------------------------------------------------------------------- |
| `data_classes` | List of String | Data classes the connector carries.                                                                             |
| `environment`  | String         | Environment label, e.g. production.                                                                             |
| `protocol`     | String         | Protocol spoken to the resource. Defaults to the integration name, which matches for the standard integrations. |
| `temperature`  | String         | Storage temperature. Computed by the server when not set.                                                       |

**Read-Only**

| Attribute | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| `id`      | String | The ID of this resource.               |
| `urn_id`  | String | Resolved id of the inventory resource. |

#### Import

Import is supported using the following syntax:

The
[`terraform import` command](https://developer.hashicorp.com/terraform/cli/commands/import)
can be used, for example:

```shell
terraform import plakar_connector.example <uuid>
```

### plakar_grant (Resource)

A grant — a role held by a member of an organization. The subject must already
be a member (see plakar_member); the role names come from the server's
catalogue, the standard tier being owner, administrator, operator and auditor.

#### Example Usage

```terraform
# What a member may do is a grant: one (subject, role) pair.
resource "plakar_grant" "alice_audits" {
  organization_id = plakar_organization.lyon.id
  subject_id      = plakar_member.alice.id
  role            = "auditor"
}

resource "plakar_grant" "nightly_runs" {
  organization_id = plakar_organization.lyon.id
  subject_id      = plakar_member.nightly.id
  role            = "operator"
}
```

**Required**

| Argument     | Type   | Description                                                         |
| ------------ | ------ | ------------------------------------------------------------------- |
| `role`       | String | Name of the role, as the catalogue spells it, e.g. operator.        |
| `subject_id` | String | User id of the member holding the grant, e.g. a plakar_member's id. |

**Optional**

| Argument          | Type   | Description                                                                         |
| ----------------- | ------ | ----------------------------------------------------------------------------------- |
| `organization_id` | String | Id of the organization the grant lives in. Defaults to the provider's organization. |

**Read-Only**

| Attribute | Type   | Description                                                                             |
| --------- | ------ | --------------------------------------------------------------------------------------- |
| `id`      | String | Id of the grant. A role change replaces the row server-side, so the id changes with it. |

#### Import

Import is supported using the following syntax:

The
[`terraform import` command](https://developer.hashicorp.com/terraform/cli/commands/import)
can be used, for example:

```shell
# <organization_id>/<grant_id>
terraform import plakar_grant.alice_audits 3f1e4a2c-9b7d-4e0f-8a11-2c5d6e7f8a90/9d8e7f6a-5b4c-4d3e-8f2a-1b0c9d8e7f6a
```

### plakar_inventory (Resource)

An inventory — the census of resources Plakar watches over. Provider-backed
inventories (aws, ovh, scaleway, gcp, vmware, k8s) discover their resources from
the account they are configured against; a self-managed inventory holds
resources declared by hand, e.g. with plakar_inventory_resource.

#### Example Usage

```terraform
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
```

**Required**

| Argument | Type   | Description                                                                                                                                                                   |
| -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`   | String | Name of the inventory.                                                                                                                                                        |
| `type`   | String | What backs the inventory: aws, ovh, scaleway, gcp, vmware, k8s or self-managed. Must match the configuration block, one of which is required for every type but self-managed. |

**Optional**

| Argument   | Type            | Description                                                                                    |
| ---------- | --------------- | ---------------------------------------------------------------------------------------------- |
| `aws`      | Block, Optional | Configuration of an aws inventory. (see [below for nested schema](#nestedblock--aws))          |
| `gcp`      | Block, Optional | Configuration of a gcp inventory. (see [below for nested schema](#nestedblock--gcp))           |
| `k8s`      | Block, Optional | Configuration of a k8s inventory. (see [below for nested schema](#nestedblock--k8s))           |
| `ovh`      | Block, Optional | Configuration of an ovh inventory. (see [below for nested schema](#nestedblock--ovh))          |
| `scaleway` | Block, Optional | Configuration of a scaleway inventory. (see [below for nested schema](#nestedblock--scaleway)) |
| `vmware`   | Block, Optional | Configuration of a vmware inventory. (see [below for nested schema](#nestedblock--vmware))     |

**Read-Only**

| Attribute | Type   | Description              |
| --------- | ------ | ------------------------ |
| `id`      | String | The ID of this resource. |

<a id="nestedblock--aws"></a>

#### Nested Schema for `aws`

Optional:

| Argument            | Type              | Description                                             |
| ------------------- | ----------------- | ------------------------------------------------------- |
| `access_key`        | String, Sensitive | Access key id, when credentials_type is access_key.     |
| `credentials_type`  | String            | How to authenticate: iam or access_key.                 |
| `region`            | String            | AWS region the discovery runs against.                  |
| `secret_access_key` | String, Sensitive | Secret access key, when credentials_type is access_key. |

<a id="nestedblock--gcp"></a>

#### Nested Schema for `gcp`

Optional:

| Argument               | Type              | Description                                                            |
| ---------------------- | ----------------- | ---------------------------------------------------------------------- |
| `project_id`           | String            |                                                                        |
| `service_account_json` | String, Sensitive | Service account key, as JSON. Unset falls back to ambient credentials. |

<a id="nestedblock--k8s"></a>

#### Nested Schema for `k8s`

Optional:

| Argument     | Type              | Description                                                                            |
| ------------ | ----------------- | -------------------------------------------------------------------------------------- |
| `kubeconfig` | String, Sensitive | Kubeconfig granting access to the cluster. Unset falls back to in-cluster credentials. |

<a id="nestedblock--ovh"></a>

#### Nested Schema for `ovh`

Optional:

| Argument             | Type              | Description                    |
| -------------------- | ----------------- | ------------------------------ |
| `application_key`    | String, Sensitive |                                |
| `application_secret` | String, Sensitive |                                |
| `consumer_key`       | String, Sensitive |                                |
| `endpoint`           | String            | OVH API endpoint, e.g. ovh-eu. |

<a id="nestedblock--scaleway"></a>

#### Nested Schema for `scaleway`

Optional:

| Argument     | Type              | Description |
| ------------ | ----------------- | ----------- |
| `access_key` | String, Sensitive |             |
| `project_id` | String            |             |
| `secret_key` | String, Sensitive |             |

<a id="nestedblock--vmware"></a>

#### Nested Schema for `vmware`

Optional:

| Argument          | Type              | Description                                          |
| ----------------- | ----------------- | ---------------------------------------------------- |
| `password`        | String, Sensitive |                                                      |
| `server`          | String            |                                                      |
| `tls_ca_bundle`   | String            | CA bundle to verify the vSphere server against, PEM. |
| `tls_skip_verify` | Boolean           | Skip TLS verification of the vSphere server.         |
| `username`        | String            |                                                      |

#### Import

Import is supported using the following syntax:

The
[`terraform import` command](https://developer.hashicorp.com/terraform/cli/commands/import)
can be used, for example:

```shell
terraform import plakar_inventory.fleet 3f1e4a2c-9b7d-4e0f-8a11-2c5d6e7f8a90
```

### plakar_inventory_resource (Resource)

A resource declared in a self-managed inventory — a machine, database or share
Plakar should know about. Connectors attach to it by URN, e.g. through the
plakar_resource data source.

#### Example Usage

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

# Connectors attach to the resource by URN.
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

**Required**

| Argument       | Type   | Description                                                |
| -------------- | ------ | ---------------------------------------------------------- |
| `class`        | String | Resource class, e.g. compute, database, storage.           |
| `inventory_id` | String | Id of the self-managed inventory the resource lives in.    |
| `name`         | String | Human name of the resource.                                |
| `urn`          | String | URN identifying the resource, unique within the inventory. |

**Optional**

| Argument                 | Type           | Description                                                                    |
| ------------------------ | -------------- | ------------------------------------------------------------------------------ |
| `endpoints`              | List of String | Addresses of the resource — hostnames or IPs; the kind is derived server-side. |
| `excluded_from_coverage` | Boolean        | Leave the resource out of coverage accounting.                                 |
| `service`                | String         | Service label the resource belongs to.                                         |
| `subclass`               | String         | Finer class, e.g. vm, postgres.                                                |
| `tags`                   | List of String | Free-form tags.                                                                |

**Read-Only**

| Attribute | Type    | Description                                                                                                                                                                                                                                 |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | String  | Id of the resource's URN, the handle connectors attach to.                                                                                                                                                                                  |
| `locked`  | Boolean | Whether the resource is locked — no task may use a connector configured against it. Placed and lifted outside Terraform, by an operator — which is why it plans as unknown: promising the state's value could contradict an operator's act. |

#### Import

Import is supported using the following syntax:

The
[`terraform import` command](https://developer.hashicorp.com/terraform/cli/commands/import)
can be used, for example:

```shell
# <inventory_id>/<urn_id>
terraform import plakar_inventory_resource.db1 3f1e4a2c-9b7d-4e0f-8a11-2c5d6e7f8a90/7b2c1d0e-4f5a-4b6c-9d8e-0a1b2c3d4e5f
```

### plakar_member (Resource)

A membership — a person or a service account belonging to an organization.
Adding a person goes through the admin invitation path: a brand-new address gets
an account with a one-time generated password (in generated_password, shown once
and kept in state — treat state accordingly); an address that already has an
account simply gains the membership. A membership carries no permission; what a
member may do is a plakar_grant. Destroying the resource removes the membership,
not the person's account.

#### Example Usage

```terraform
# A person: the invitation is auto-accepted; a brand-new address gets an
# account whose one-time password lands in generated_password (state!).
resource "plakar_member" "alice" {
  organization_id = plakar_organization.lyon.id
  email           = "alice@example.com"
  name            = "Alice"
}

# A service account for automation: no email, no interactive login. Mint its
# API key in the Plakar UI.
resource "plakar_member" "nightly" {
  organization_id = plakar_organization.lyon.id
  name            = "nightly-automation"
  service         = true
}
```

**Optional**

| Argument          | Type    | Description                                                                                                                                                                                                                                                                                                    |
| ----------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `email`           | String  | Email address of the person. Required for a person; a service account has none.                                                                                                                                                                                                                                |
| `name`            | String  | Display name. Required for a service account, which has no address and is identified by it — changing it replaces. For a person it is decoration applied only when the account is created; an existing account keeps its own name, so it is neither refreshed nor sent again — changing it only updates state. |
| `organization_id` | String  | Id of the organization. Defaults to the provider's organization.                                                                                                                                                                                                                                               |
| `service`         | Boolean | Add an application user rather than a person: no email, no interactive login.                                                                                                                                                                                                                                  |

**Read-Only**

| Attribute            | Type              | Description                                                                                                                                                                                                          |
| -------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account`            | String            | Login identifier of the membership: <prefix>/<email>, or a bare email at the deployment root.                                                                                                                        |
| `account_created`    | Boolean           | Whether a brand-new account was registered for the address at creation.                                                                                                                                              |
| `generated_password` | String, Sensitive | The one-time must-change password the server minted for a brand-new account, kept from creation; null when the address already had one. A service account's is inert — an application user has no interactive login. |
| `id`                 | String            | User id of the member.                                                                                                                                                                                               |

#### Import

Import is supported using the following syntax:

The
[`terraform import` command](https://developer.hashicorp.com/terraform/cli/commands/import)
can be used, for example:

```shell
# <organization_id>/<user_id>
terraform import plakar_member.alice 3f1e4a2c-9b7d-4e0f-8a11-2c5d6e7f8a90/7b2c1d0e-4f5a-4b6c-9d8e-0a1b2c3d4e5f
```

### plakar_organization (Resource)

An organization — a tenant, or a perimeter nested under one. Membership is
managed with plakar_member, permissions with plakar_grant. v1 has no
organization update, so every change replaces — and destroying the resource
deletes the tenant and everything scoped to it.

#### Example Usage

```terraform
# A tenant under the provider's organization.
resource "plakar_organization" "lyon" {
  name = "Lyon"
}

# A perimeter nested under it.
resource "plakar_organization" "lyon_production" {
  name      = "Lyon production"
  parent_id = plakar_organization.lyon.id
}
```

**Required**

| Argument | Type   | Description               |
| -------- | ------ | ------------------------- |
| `name`   | String | Name of the organization. |

**Optional**

| Argument    | Type          | Description                                                                                 |
| ----------- | ------------- | ------------------------------------------------------------------------------------------- |
| `info`      | Map of String | Free-form key/value information attached at creation.                                       |
| `parent_id` | String        | Id of the parent organization. Defaults to the provider's organization.                     |
| `type`      | String        | Organization type. Only enterprise organizations can be created as sub-organizations today. |

**Read-Only**

| Attribute | Type   | Description              |
| --------- | ------ | ------------------------ |
| `id`      | String | The ID of this resource. |

#### Import

Import is supported using the following syntax:

The
[`terraform import` command](https://developer.hashicorp.com/terraform/cli/commands/import)
can be used, for example:

```shell
terraform import plakar_organization.lyon 3f1e4a2c-9b7d-4e0f-8a11-2c5d6e7f8a90
```

### plakar_schedule (Resource)

A scheduled task — a backup, prune, sync or check with its recurrence rules. A
scheduled prune carries the retention rule.

#### Example Usage

```terraform
resource "plakar_schedule" "nightly" {
  name      = "Nightly database backup"
  type      = "backup"
  origin_id = data.plakar_connector.db.id
  target_id = plakar_store.offsite.id
  labels    = ["nightly"]

  rule {
    periodicity = 86400
  }
}

resource "plakar_schedule" "retention" {
  name      = "Retention policy"
  type      = "prune"
  origin_id = plakar_store.offsite.id
  group_by  = "dataset"
  retention = {
    day     = 7
    per_day = 1
  }

  rule {
    periodicity = 86400
  }
}
```

**Required**

| Argument    | Type   | Description                                                                                   |
| ----------- | ------ | --------------------------------------------------------------------------------------------- |
| `name`      | String | Name of the schedule. Stored but not echoed by the API, so drift on the name is not detected. |
| `origin_id` | String | Id of the origin connector: the source for a backup, the store for a prune, sync or check.    |
| `type`      | String | What the schedule runs: backup, prune, sync or check.                                         |

**Optional**

| Argument      | Type           | Description                                                                                                                                                                            |
| ------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `description` | String         | Free-form description. Stored but not echoed by the API.                                                                                                                               |
| `enabled`     | Boolean        | Whether the schedule runs at all.                                                                                                                                                      |
| `group_by`    | String         | For a prune: partition matched snapshots before applying the rule, e.g. dataset to hold the rule per source.                                                                           |
| `ignores`     | List of String | For a backup: path patterns to exclude.                                                                                                                                                |
| `labels`      | List of String | For a backup: labels stamped on the snapshots. For the other types: only snapshots carrying these tags are considered.                                                                 |
| `retention`   | Map of Number  | For a prune: the retention rule, as bucket options — minute, hour, day, week, month, year for how many recent buckets to keep, per_minute ... per_year for how many snapshots in each. |
| `rule`        | Block List     | A recurrence of the schedule. At least one. (see [below for nested schema](#nestedblock--rule))                                                                                        |
| `target_id`   | String         | Id of the target connector: the store for a backup, the destination store for a sync. A check has none.                                                                                |

**Read-Only**

| Attribute | Type   | Description              |
| --------- | ------ | ------------------------ |
| `id`      | String | The ID of this resource. |

<a id="nestedblock--rule"></a>

#### Nested Schema for `rule`

Required:

| Argument      | Type   | Description           |
| ------------- | ------ | --------------------- |
| `periodicity` | Number | Seconds between runs. |

Optional:

| Argument  | Type    | Description                               |
| --------- | ------- | ----------------------------------------- |
| `enabled` | Boolean | Whether this rule fires.                  |
| `jitter`  | Number  | Seconds of random spread around each run. |
| `start`   | String  | RFC3339 time the rule starts from.        |

Read-Only:

| Attribute | Type   | Description              |
| --------- | ------ | ------------------------ |
| `id`      | String | Server-assigned rule id. |

#### Import

Import is supported using the following syntax:

The
[`terraform import` command](https://developer.hashicorp.com/terraform/cli/commands/import)
can be used, for example:

```shell
terraform import plakar_schedule.example <uuid>
```

### plakar_store (Resource)

A Plakar store — where backup data lands. Destroying the resource removes the
store from Plakar; data in the underlying storage is not touched.

#### Example Usage

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

**Required**

| Argument      | Type                     | Description                                                                                                                 |
| ------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `fields`      | Map of String, Sensitive | Integration-specific configuration. Only the keys declared here are managed; anything else set server-side keeps its value. |
| `integration` | String                   | Name of the installed integration backing the store, e.g. s3.                                                               |
| `name`        | String                   | Name of the store, unique among stores in the organization.                                                                 |
| `resource`    | String                   | URN or name of the inventory resource the store attaches to.                                                                |

**Optional**

| Argument       | Type           | Description                                                                                                     |
| -------------- | -------------- | --------------------------------------------------------------------------------------------------------------- |
| `compression`  | String         | Compression for the store at initialization (GZIP, LZ4, ZSTD). Unset keeps the engine's default.                |
| `data_classes` | List of String | Data classes the store accepts.                                                                                 |
| `environment`  | String         | Environment label, e.g. production.                                                                             |
| `initialize`   | Boolean        | Initialize the underlying storage at creation. Never re-runs on update.                                         |
| `protocol`     | String         | Protocol spoken to the resource. Defaults to the integration name, which matches for the standard integrations. |
| `temperature`  | String         | Storage temperature. Computed by the server when not set.                                                       |

**Read-Only**

| Attribute | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| `id`      | String | The ID of this resource.               |
| `urn_id`  | String | Resolved id of the inventory resource. |

#### Import

Import is supported using the following syntax:

The
[`terraform import` command](https://developer.hashicorp.com/terraform/cli/commands/import)
can be used, for example:

```shell
terraform import plakar_store.example <uuid>
```

## Data sources

### plakar_connector (Data Source)

A source or destination connector, looked up by type and name.

#### Example Usage

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

| Attribute     | Type   | Description              |
| ------------- | ------ | ------------------------ |
| `environment` | String |                          |
| `id`          | String | The ID of this resource. |
| `protocol`    | String |                          |
| `urn_id`      | String |                          |

### plakar_integration (Data Source)

An installed integration, looked up by name.

#### Example Usage

```terraform
data "plakar_integration" "s3" {
  name = "s3"
}
```

**Required**

| Argument | Type   | Description |
| -------- | ------ | ----------- |
| `name`   | String |             |

**Read-Only**

| Attribute | Type   | Description              |
| --------- | ------ | ------------------------ |
| `id`      | String | The ID of this resource. |

### plakar_inventory (Data Source)

An inventory, looked up by name.

#### Example Usage

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
| `id`      | String | The ID of this resource.                              |
| `type`    | String | aws, ovh, scaleway, gcp, vmware, k8s or self-managed. |

### plakar_member (Data Source)

A member of an organization, looked up by email (a person) or name (a service
account, which has no address).

#### Example Usage

```terraform
# A person, by email.
data "plakar_member" "alice" {
  organization_id = data.plakar_organization.lyon.id
  email           = "alice@example.com"
}

# A service account, by name.
data "plakar_member" "nightly" {
  organization_id = data.plakar_organization.lyon.id
  name            = "nightly-automation"
}
```

**Optional**

| Argument          | Type   | Description                                                      |
| ----------------- | ------ | ---------------------------------------------------------------- |
| `email`           | String |                                                                  |
| `name`            | String |                                                                  |
| `organization_id` | String | Id of the organization. Defaults to the provider's organization. |

**Read-Only**

| Attribute | Type    | Description            |
| --------- | ------- | ---------------------- |
| `account` | String  |                        |
| `id`      | String  | User id of the member. |
| `service` | Boolean |                        |

### plakar_organization (Data Source)

An organization, looked up by name across the provider organization's subtree.

#### Example Usage

```terraform
data "plakar_organization" "lyon" {
  name = "Lyon"
}
```

**Required**

| Argument | Type   | Description |
| -------- | ------ | ----------- |
| `name`   | String |             |

**Read-Only**

| Attribute   | Type   | Description              |
| ----------- | ------ | ------------------------ |
| `id`        | String | The ID of this resource. |
| `parent_id` | String |                          |
| `type`      | String |                          |

### plakar_resource (Data Source)

An inventory resource, looked up by URN or name.

#### Example Usage

```terraform
data "plakar_resource" "db_host" {
  ref = "urn:aws:123456789:ec2:eu-west-1:instance:i-0abc" # or its name
}
```

**Required**

| Argument | Type   | Description                                                                                |
| -------- | ------ | ------------------------------------------------------------------------------------------ |
| `ref`    | String | URN or name of the resource. Names must be unique to resolve; use the URN to disambiguate. |

**Read-Only**

| Attribute | Type   | Description |
| --------- | ------ | ----------- |
| `name`    | String |             |
| `urn`     | String |             |
| `urn_id`  | String |             |

### plakar_store (Data Source)

A store, looked up by name.

#### Example Usage

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

| Attribute     | Type   | Description              |
| ------------- | ------ | ------------------------ |
| `environment` | String |                          |
| `id`          | String | The ID of this resource. |
| `protocol`    | String |                          |
| `type`        | String |                          |
| `urn_id`      | String |                          |
