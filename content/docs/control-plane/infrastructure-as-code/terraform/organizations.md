---
title: "Organizations and Access"
date: "2026-09-11T00:00:00Z"
weight: 4
summary:
  "Declaring organizations, their members, and the roles those members hold."
---

# Organizations and Access

Access in PCP is described by three separate objects, and the provider declares
each with its own resource. `plakar_organization` is the organization.
`plakar_member` places a person or a service account in it. `plakar_grant` gives
that member a role. A membership on its own carries no permission, so a member
without a grant can sign in to the organization and do nothing in it.

## Organizations

An [organization](../../../administration/organizations) is created under
another one. Without `parent_id`, the parent is the organization the provider's
API key belongs to.

```terraform
resource "plakar_organization" "lyon" {
  name = "Lyon"
}

resource "plakar_organization" "lyon_production" {
  name      = "Lyon production"
  parent_id = plakar_organization.lyon.id
}
```

PCP has no update operation for an organization, so the provider replaces it
whenever an argument changes. Replacement deletes the organization and
everything scoped to it, including its apps, schedules and members, and
`terraform destroy` does the same. A plan that reports a `plakar_organization`
as replaced is therefore describing the loss of its contents, not a rename.

## Members

A member is either a person, identified by an email address, or a service
account, identified by a name and marked with `service`.

```terraform
resource "plakar_member" "alice" {
  organization_id = plakar_organization.lyon.id
  email           = "alice@example.com"
  name            = "Alice"
}

resource "plakar_member" "nightly" {
  organization_id = plakar_organization.lyon_production.id
  name            = "nightly-backups"
  service         = true
}
```

Adding a person follows the invitation path. An address that already has an
account gains the membership and nothing else. A new address gets an account
with a one-time password, returned in `generated_password` and recorded in
state, which the person is required to change at their first
[sign-in](../../../administration/signing-in). The `account_created` attribute
reports which of the two happened.

A service account is an
[application user](../../../administration/users#application-users). It has no
address and no interactive login, so its `generated_password` is inert and its
API key is created from the web interface. This is also how the key the provider
itself authenticates with comes into existence, which means the first
application user cannot be created by the provider that depends on it.

Destroying a member resource removes the membership. The person's account
continues to exist, along with any membership they hold in another organization.

## Grants

A grant is one pair of a subject and a
[role](../../../administration/permissions). Two roles for the same person means
two grants.

```terraform
resource "plakar_grant" "alice_owns_lyon" {
  organization_id = plakar_organization.lyon.id
  subject_id      = plakar_member.alice.id
  role            = "owner"
}

resource "plakar_grant" "nightly_operates" {
  organization_id = plakar_organization.lyon_production.id
  subject_id      = plakar_member.nightly.id
  role            = "operator"
}
```

The subject must already be a member of the organization the grant lives in.
Role names come from the server's catalogue, of which the standard tier is
`owner`, `administrator`, `operator` and `auditor`.

Changing the role replaces the grant server-side and its id changes with it. A
plan that reports a grant as replaced is describing a role change rather than an
interruption of access.

## Generated passwords

`generated_password` is sensitive and, like every sensitive attribute, is kept
in Terraform state. It is set only for accounts that the apply registered, and
is null for an address that already had one. Exposing it through an output is
the usual way to hand a new account its first password:

```terraform
output "initial_passwords" {
  sensitive = true
  value     = { alice = plakar_member.alice.generated_password }
}
```
