---
title: "plakar_data_class"
date: "2026-11-26T11:35:02Z"
weight: 2
summary: "Arguments and attributes of the plakar_data_class resource."
---

# plakar_data_class

## Resource

An organization data class, one name in the list the Classification page shows.
New organizations come with personal_data, sensitive_personal_data,
health_records, cardholder_data, financial_records, employee_records,
audit_logs, intellectual_property, business_data and system_state; those can be
deleted like any other, so to manage one, import it first: creating a name that
already exists is an error, because the server would answer as if it had created
it and a later destroy would delete a value Terraform never made. Names are kept
exactly as written, case and spaces included, so Prod and prod are two data
classs. There is no update: changing the name replaces. Destroying the resource
removes the name for the whole organization. An import takes the name, in the
provider's organization, or <organization_id>/<name> for another one: importing
by the name alone a data class whose configuration sets organization_id to
another organization plans a replacement, which would delete the name from the
provider's organization.

### Example Usage

```terraform
resource "plakar_data_class" "contracts" {
  name = "contracts"
}
```

**Required**

| Argument | Type   | Description                                   |
| -------- | ------ | --------------------------------------------- |
| `name`   | String | Name of the data class. Changing it replaces. |

**Optional**

| Argument          | Type   | Description                                                      |
| ----------------- | ------ | ---------------------------------------------------------------- |
| `organization_id` | String | Id of the organization. Defaults to the provider's organization. |

**Read-Only**

| Attribute | Type   | Description          |
| --------- | ------ | -------------------- |
| `id`      | String | The data class name. |

### Import

```shell
# <name>, in the provider's organization
terraform import plakar_data_class.personal_data personal_data
```
