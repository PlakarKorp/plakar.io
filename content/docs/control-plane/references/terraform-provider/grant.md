---
title: "plakar_grant"
date: "2026-11-26T11:35:02Z"
weight: 4
summary: "Arguments and attributes of the plakar_grant resource."
---

# plakar_grant

## Resource

A grant — a role held by a member of an organization. The subject must already be a member (see plakar_member); the role names come from the server's catalogue, the standard tier being owner, administrator, operator and auditor. The provider's API key needs the administrator or owner role on the organization: with a lesser one, e.g. operator, the Control Plane answers 403 to the member and grant listings, so plan and import fail.

### Example Usage

```terraform
# The organization and the members the grants below apply to (see
# plakar_organization and plakar_member), declared here so the example stands
# alone.
resource "plakar_organization" "lyon" {
  name = "Lyon"
}

resource "plakar_member" "alice" {
  organization_id = plakar_organization.lyon.id
  email           = "alice@example.com"
  name            = "Alice"
}

resource "plakar_member" "nightly" {
  organization_id = plakar_organization.lyon.id
  name            = "nightly-automation"
  service         = true
}

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

### Import

```shell
# <organization_id>/<grant_id>
terraform import plakar_grant.alice_audits 3f1e4a2c-9b7d-4e0f-8a11-2c5d6e7f8a90/9d8e7f6a-5b4c-4d3e-8f2a-1b0c9d8e7f6a
```
