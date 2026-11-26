---
title: "plakar_integration"
date: "2026-11-26T11:35:02Z"
weight: 5
summary: "Arguments and attributes of the plakar_integration resource and data source."
---

# plakar_integration

## Resource

An integration installed from the catalog, made the current version of its name. Integrations belong to the whole deployment, not to an organization: managing them needs an API key whose service account holds the platform-admin role, and destroying the resource uninstalls the version in state for every organization, including one imported rather than installed by Terraform; other installed versions of the same integration, such as the one a version change left behind, stay installed. The server uninstalls an integration a connector still uses without complaint, and leaves the connector in place; within one configuration, Terraform destroys those first. Changing version installs that version and makes it current; the previous one stays installed, no longer current. With version set, a version made current by hand is put back on the next apply; without, it is adopted.

### Example Usage

```terraform
# Integrations belong to the whole deployment: the API key needs the
# platform-admin role, and destroying one uninstalls it for every
# organization. Pin version for a deterministic install; left out, the
# catalog's highest version is installed once and never upgraded by a plan.
# Import what is already installed before the first apply (see import.sh):
# otherwise a later destroy uninstalls it for the whole instance.
variable "integrations" {
  type = map(string)
  default = {
    s3       = "v1.1.10"
    scaleway = "v1.1.13"
    vault    = "v1.1.12"
  }
}

resource "plakar_integration" "this" {
  for_each = var.integrations
  name     = each.key
  version  = each.value
}
```

**Required**

| Argument | Type   | Description                                            |
| -------- | ------ | ------------------------------------------------------ |
| `name`   | String | Name of the integration in the catalog, e.g. scaleway. |

**Optional**

| Argument  | Type   | Description                                                                                                                                                                                                                                                                                                                                          |
| --------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version` | String | Version to install, e.g. v1.1.13. Pinning it is the deterministic choice. Left out, the highest version the catalog offers is installed, in semantic-version order: the catalog marks no version as stable, so that may be a prerelease. The version chosen is kept in state and never upgraded by a later plan; set version to move to another one. |

**Read-Only**

| Attribute | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `id`      | String | Id of the installed version. |

### Import

```shell
# <id> of the installed version, as GET /api/v1/integrations/installed lists it.
# An integration already installed must be imported before it is managed, or
# a destroy would uninstall what Terraform never installed.
terraform import 'plakar_integration.this["vault"]' 5d2e8f1a-3c4b-4a7d-9e6f-1b2c3d4e5f60
```

## Data Source

An installed integration, looked up by name.

### Example Usage

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

| Attribute | Type   | Description |
| --------- | ------ | ----------- |
| `id`      | String |             |
