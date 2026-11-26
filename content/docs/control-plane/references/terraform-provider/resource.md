---
title: "plakar_resource"
date: "2026-11-26T11:35:02Z"
weight: 10
summary: "Arguments and attributes of the plakar_resource data source."
---

# plakar_resource

## Data Source

An inventory resource, looked up by URN or name.

### Example Usage

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
