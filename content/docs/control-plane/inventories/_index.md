---
title: "Inventories"
date: "2026-05-03T00:00:00Z"
weight: 2
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
[permissions](../administration/permissions) held in that organization determine
what can be done with them.

Inventory providers are delivered as integrations, so a provider must be
installed before an inventory can use it. Providers can be installed from the
**Integrations** page or from the **Add inventory** dialog, which lists
installed providers alongside those available to install.

![Creating a new inventory](./images/create-inventory.png)

Backups and restores are configured by setting up [apps](../apps) on a resource.
There are three types of app:

- **Source**: the resource is backed up.
- **Store**: the resource holds backups.
- **Destination**: data is restored to the resource.

## Managed inventories

Managed inventories connect to a provider using credentials. Plakar Control
Plane discovers the resources in your account and classifies them by type. The
provider is the source of truth. Resources cannot be created or deleted manually
in a managed inventory. Synchronize the inventory to pick up changes made by the
provider.

## Self-managed inventories

Self-managed inventories hold resources that are added by hand, one at a time or
in bulk from a CSV file. They cover infrastructure that no managed inventory
discovers, such as a local MinIO instance, and resources whose definition should
stay fully under your control.

## Data residency

An inventory can have a **residency**, which is inherited by every resource it
exposes. This gives those resources a country in which their data must remain.

When you configure an operation, PCP only allows resources with the same
residency to be used together. For example, resources from an inventory with a
French residency can only be backed up to, restored from, or synchronized with
resources that also have a French residency.

See [data residency](../compliance/residency) for more information.

## Configuration bundles

Configuration bundles declare shared fields, such as credentials, that are
filled in when an app is set up on a matching resource of the inventory. See
[configuration bundles](configuration-bundles) for details.
