---
title: "plakar_inventory_resource"
date: "2026-11-26T11:35:02Z"
weight: 7
summary: "Arguments and attributes of the plakar_inventory_resource resource."
---

# plakar_inventory_resource

## Resource

A resource declared in a self-managed inventory — a machine, database or share Plakar should know about. Connectors attach to it by URN, e.g. through the plakar_resource data source.

### Example Usage

```terraform
variable "db1_connection_string" {
  type      = string
  sensitive = true
}

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

### Import

```shell
# <inventory_id>/<urn_id>
terraform import plakar_inventory_resource.db1 3f1e4a2c-9b7d-4e0f-8a11-2c5d6e7f8a90/7b2c1d0e-4f5a-4b6c-9d8e-0a1b2c3d4e5f
```
