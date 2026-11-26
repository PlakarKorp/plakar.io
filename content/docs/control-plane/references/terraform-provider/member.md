---
title: "plakar_member"
date: "2026-11-26T11:35:02Z"
weight: 8
summary: "Arguments and attributes of the plakar_member resource and data source."
---

# plakar_member

## Resource

A membership — a person or a service account belonging to an organization. Adding a person goes through the admin invitation path: a brand-new address gets an account with a one-time generated password (in generated_password, shown once and kept in state — treat state accordingly); an address that already has an account simply gains the membership. A membership carries no permission; what a member may do is a plakar_grant. Destroying the resource removes the membership, not the person's account. The provider's API key needs the administrator or owner role on the organization: with a lesser one, e.g. operator, the Control Plane answers 403 to the member and grant listings, so plan and import fail.

### Example Usage

```terraform
# The organization the members below belong to (see plakar_organization),
# declared here so the example stands alone.
resource "plakar_organization" "lyon" {
  name = "Lyon"
}

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

### Import

```shell
# <organization_id>/<user_id>
terraform import plakar_member.alice 3f1e4a2c-9b7d-4e0f-8a11-2c5d6e7f8a90/7b2c1d0e-4f5a-4b6c-9d8e-0a1b2c3d4e5f
```

## Data Source

A member of an organization, looked up by email (a person) or name (a service account, which has no address). The provider's API key needs the administrator or owner role on the organization: with a lesser one, e.g. operator, the Control Plane answers 403 to the member and grant listings, so plan and import fail.

### Example Usage

```terraform
# The organization the members below belong to, looked up by name so the
# example stands alone.
data "plakar_organization" "lyon" {
  name = "Lyon"
}

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
