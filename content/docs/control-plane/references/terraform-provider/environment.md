---
title: "plakar_environment"
date: "2026-11-26T11:35:02Z"
weight: 3
summary: "Arguments and attributes of the plakar_environment resource."
---

# plakar_environment

## Resource

An organization environment, one name in the list the Classification page shows.
New organizations come with integration, production, staging and testing; those
can be deleted like any other, so to manage one, import it first: creating a
name that already exists is an error, because the server would answer as if it
had created it and a later destroy would delete a value Terraform never made.
Names are kept exactly as written, case and spaces included, so Prod and prod
are two environments. There is no update: changing the name replaces. Destroying
the resource removes the name for the whole organization. An import takes the
name, in the provider's organization, or <organization_id>/<name> for another
one: importing by the name alone a environment whose configuration sets
organization_id to another organization plans a replacement, which would delete
the name from the provider's organization.

### Example Usage

```terraform
# A name of your own, next to the defaults every organization starts with.
resource "plakar_environment" "preprod" {
  name = "preprod"
}

# A default is managed only once imported: creating it would be refused. Once
# managed, destroying the resource deletes it from the organization.
import {
  to = plakar_environment.production
  id = "production"
}

resource "plakar_environment" "production" {
  name = "production"
}
```

**Required**

| Argument | Type   | Description                                    |
| -------- | ------ | ---------------------------------------------- |
| `name`   | String | Name of the environment. Changing it replaces. |

**Optional**

| Argument          | Type   | Description                                                      |
| ----------------- | ------ | ---------------------------------------------------------------- |
| `organization_id` | String | Id of the organization. Defaults to the provider's organization. |

**Read-Only**

| Attribute | Type   | Description           |
| --------- | ------ | --------------------- |
| `id`      | String | The environment name. |

### Import

```shell
# <name>, in the provider's organization
terraform import plakar_environment.production production
```
