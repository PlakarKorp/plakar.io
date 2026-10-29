---
title: "Inventories"
date: "2026-05-03T00:00:00Z"
weight: 4
summary:
  "Understand how inventories work in Plakar Control Plane and how to use them."
aliases:
  - /control-plane-docs/infrastructure/inventories/
  - /docs/control-plane/infrastructure/inventories/
---

# Inventories

An inventory holds the resources that Plakar Control Plane can manage. A
resource is an individual entity that can be backed up, used as storage, or
restored to, such as an EC2 instance or an S3 bucket. A managed inventory
discovers its resources from a provider, while a self-managed inventory holds
resources defined by hand.

Each inventory belongs to one organization. Only the inventories of the
organization you are signed in to are visible, and the
[permissions](../access-control/permissions) held in that organization determine
what can be done with them.

Inventory providers are delivered as integrations, so a provider must be
installed before an inventory can use it. Providers can be installed from the
**Integrations** page or from the **Add inventory** dialog, which lists
installed providers alongside those available to install.

![Creating a new inventory](./images/create-inventory.png)

## Managed inventories

A managed inventory connects to a provider with credentials and discovers the
resources of the account, classified by type. The provider is the source of
truth. Resources cannot be created or deleted by hand in a managed inventory,
and changes made in the provider appear at the next synchronization.

## Self-managed inventories

A self-managed inventory holds resources that are added by hand, one at a time
or in bulk from a CSV file. It covers infrastructure that no managed inventory
discovers, such as a local MinIO instance or a self-hosted database.

## Resources

A resource is identified by its resource URN, which cannot change once the
resource exists. It also has a name, a class, subclass and tags.
[Configuration bundles](configuration-bundles) select resources by class and
tags, and [policies](../compliance/policies) can narrow their scope by tag. In a
managed inventory, the class and tags are discovered from the provider and
cannot be edited.

![](./images/resources.png)

Each resource also has one or more endpoints that identify where it is reached,
such as a hostname, an IP address or a bucket name. In a self-managed inventory,
the endpoints are entered with the resource. In a managed inventory, they are
discovered from the provider, together with attributes that describe the
resource, such as the S3 endpoint of a bucket or whether versioning is enabled
on it. When an app is set up on the resource, the endpoints and attributes fill
in the matching fields, so they do not have to be entered again.

Backups and restores are configured by setting up [apps](../apps) on a resource.
There are three types of app:

- **Source**: the resource is backed up.
- **Store**: the resource holds backups.
- **Destination**: data is restored to the resource.

Each resource has a protection status, which reflects whether it is covered by
backups. A resource that does not need backups, such as a test database or a
temporary bucket, can be excluded from backup coverage. An excluded resource is
left out of protection status and coverage reporting.

![](./images/resource.png)

## Data residency

An inventory can have a **residency**, which is inherited by every resource it
exposes. This gives those resources a country in which their data must remain. A
residency set on an individual resource takes precedence over the inherited one,
for a resource located in a different country from the rest of the inventory.

When you configure an operation, PCP only allows resources with the same
residency to be used together. For example, resources from an inventory with a
French residency can only be backed up to, restored from, or synchronized with
resources that also have a French residency. See
[data residency](../compliance/residency) for more information.

## Edge pools

An inventory can name an [edge pool](../edges/running-tasks#selecting-an-edge),
which is inherited by every resource it exposes. Tasks that use those resources
run on an edge of the pool instead of on the Control Plane. A pool set on an
individual resource takes precedence over the one inherited from the inventory.

## Configuration bundles

Configuration bundles declare shared fields, such as credentials, that are
filled in when an app is set up on a matching resource of the inventory. See
[configuration bundles](configuration-bundles) for details.
