---
title: "Resource Types"
date: "2026-05-19T00:00:00Z"
weight: 6
summary:
  "Resources are the systems and storage targets that Plakar Control Plane backs
  up, stores data in, or restores to. Learn how to configure each resource type
  and manage resource settings."
aliases:
  - /control-plane-docs/resources/
---

# Resource Types

Resources are the individual systems, services, or storage targets that Plakar
Control Plane manages as part of a backup workflow. Examples of resources
include S3 buckets, EC2 instances, PostgreSQL databases, virtual machines, and
filesystems.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TB
  subgraph Inventories
    Managed["Managed inventory\n(Scaleway, ...)"]
    SelfManaged["Self-managed inventory"]
  end

  subgraph Resources
    R["Resource\nclass / subclass"]
  end

  subgraph Apps
    Source["Source\n(Back up content from here)"]
    Store["Store\n(Store backups here)"]
    Destination["Destination\n(Restore here)"]
  end

  Managed -->|"auto-discover"| R
  SelfManaged -->|"manually added"| R
  R --> Source & Store & Destination
{{< /mermaid >}}
<!-- prettier-ignore-end -->

All resources discovered across all inventories are available under
**Infrastructure -> Inventory -> Resources**. From here a resource can be
assigned to either a [source](../apps/sources) or a
[destination](../apps/destinations) app. You can also filter resources by
inventories or by resource class.

The actions on each resource include placing a
[legal hold](../compliance/legal-hold) on it. A resource under a legal hold
cannot be used by any task, so backups, restores, checks, and prunes involving
it are refused until the hold is removed.

![](./../inventories/images/resources.png)

## Resource settings

Resource settings can be updated from the **Resource settings** tab under each
resource, which is split between **General**, **Residency** and **Edge pool**.
General holds the settings described below. Residency and Edge pool are
described in [Residency](#residency) and [Edge pools](#edge-pools).

For managed inventories, most settings are read-only since the resource is
managed by the inventory. For self-managed inventories, all settings can be
modified. Backup coverage and the edge pool can be modified for any resource
regardless of inventory type, since neither comes from the inventory.

Backup coverage tracks how many of your resources are protected by backups. If a
resource does not need to be backed up (for example, a test database), you can
exclude it from coverage using the **Exclude from backup coverage**. Excluded
resources are omitted from protection status and coverage reporting.

![](./../inventories/images/resource.png)

## Residency

Resources can only be used together when they have the same
[residency](../compliance/residency). A source can only be backed up to a store
with the same residency, a restore can only write to a destination with the
residency of its store, and a sync can only run between stores with the same
residency. The residency belongs to the resource, so every app created for it
takes on its residency.

## Edge pools

A resource assigned to an [edge pool](../edges/enrollment#enrollment-keys) has
its tasks run on an edge of that pool. A resource without a pool has its tasks
run on the Control Plane.

A resource inherits the pool of its inventory. A pool set in the **Edge pool**
section of its settings takes precedence, for a resource whose tasks have to run
on different edges than the rest of its inventory. Clearing it brings back the
pool of the inventory. Every app created for the resource takes on its pool.

A backup, restore or sync runs on the pool of its source or store resource, and
is refused when the two resources are in different pools, since the task runs on
a single edge and an edge belongs to one pool at most. See
[Selecting an edge](../edges/running-tasks#selecting-an-edge).

## Resource classification

Each resource is assigned a `class` and `subclass` that describe what kind of
infrastructure it is. The `class` describes the general category the resource
belongs to, while the `subclass` identifies the specific implementation or
provider. Plakar Control Plane uses this classification to determine which
integrations are compatible with a resource.

## Environment and data class tags

A resource can carry its environment and data class as tags. When a
[source app](../apps/sources) is created for the resource, Plakar Control Plane
fills in its **Environment** and **Data Class** from those tags. Both fields can
still be changed before the app is saved or even later on.

A tag is a prefix followed by the value. The prefix has a long and a short form,
and either `:` or `=` separates it from the value:

- **Environment**: `plakar:environment:<value>`, `plakar:environment=<value>`,
  `plakar:env:<value>` or `plakar:env=<value>`
- **Data Class**: `plakar:data-class:<value>`, `plakar:data-class=<value>`,
  `plakar:class:<value>` or `plakar:class=<value>`

For example, a resource tagged `plakar:env=production` and
`plakar:class=database` gets `production` as the environment and `database` as
the data class of its source apps.

The tags can be set in two places:

- On a resource in a [self-managed inventory](../inventories/self-managed), in
  its **Tags** field.
- On the resource at the cloud provider, as a tag or label. A
  [managed inventory](../inventories#managed-inventories) picks them up when it
  discovers the resource.

## Supported resources

The following pages document the supported resource types and the configuration
required to use each one as a source, store, or destination.

{{% children description="true" style="sections" %}}
