---
title: "plakar_organization"
date: "2026-11-26T11:35:02Z"
weight: 9
summary:
  "Arguments and attributes of the plakar_organization resource and data source."
---

# plakar_organization

## Resource

An organization — a tenant, or a perimeter nested under one. Membership is
managed with plakar_member, permissions with plakar_grant. v1 has no
organization update, so every change replaces — and destroying the resource
deletes the tenant and everything scoped to it.

### Example Usage

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

| Attribute | Type   | Description |
| --------- | ------ | ----------- |
| `id`      | String |             |

### Import

```shell
terraform import plakar_organization.lyon 3f1e4a2c-9b7d-4e0f-8a11-2c5d6e7f8a90
```

## Data Source

An organization, looked up by name across the provider organization's subtree.

### Example Usage

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

| Attribute   | Type   | Description |
| ----------- | ------ | ----------- |
| `id`        | String |             |
| `parent_id` | String |             |
| `type`      | String |             |
