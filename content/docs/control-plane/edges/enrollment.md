---
title: "Edge Enrollment"
date: "2026-07-13T00:00:00Z"
weight: 3
summary:
  "Enroll edges with an organization key or a pool key, and share edges with
  child organizations."
---

# Edge Enrollment

An edge joins an organization by enrolling. On its first connection to PCP, it
presents an enrollment key, and PCP exchanges the key for an authentication
token. The edge stores the token locally and uses it for every later connection,
so it no longer depends on the key. Closing enrollment or regenerating a key
therefore stops new edges from joining with the old key, and has no effect on
the edges that are already enrolled.

An organization has two kinds of enrollment key:

- **The organization key** enrolls an edge into the organization, outside any
  pool. It receives tasks once it is added to a pool.
- **A pool key** enrolls an edge into the organization and into that edge pool.
  The edge runs the tasks of the pool's resources as soon as it is online.

The key is passed to the edge when it starts for the first time, as described in
[Edge Installation](../installation). You work with the edges available to the
organization you signed in to, and what you can do with them is determined by
the [permissions](../../access-control/permissions) your application user has on
the organization.

## Enrollment keys

{{< tabs >}}

{{< tab label="Single edge" >}}

The organization key is available once **edge enrollment** is enabled for the
organization, under **Organizations -> Settings**. Edge enrollment is disabled
by default. Enable it in the organization the new edges should join.

![](../images/edge-enrollment.png)

Disabling edge enrollment prevents new edges from joining the organization with
its key. Enable it again before the first connection of any edge added later.
Regenerating the key replaces it. Edges enrolled afterwards have to use the new
key.

{{< /tab >}}

{{< tab label="Edge pools" >}}

### What are edge pools

Edge pools are groups of edges that can run the same tasks, for any of the uses
described in [When to use an edge](../../edges#when-to-use-an-edge). Pools are
assigned to inventories, and to individual resources when needed, rather than to
tasks. Every task that uses a resource assigned to a pool runs on one of the
edges of that pool.

Because tasks follow the pool rather than a specific edge, the edges in a pool
can change without touching any task or schedule. Edges can be added to handle
more work, or removed and replaced, and tasks keep running as long as at least
one edge of the pool is online.

A resource inherits the pool of its inventory, unless it sets its own. How PCP
picks an edge, and what happens when none is available, is described in
[Selecting an edge](../running-tasks#selecting-an-edge).

![](../images/all-edges.png)

### Creating a pool and enrolling edges

Pools are created under **Edges -> Pools**. Each pool can have its own
enrollment key. An edge that presents this key on its first connection is
enrolled into the organization and placed in the pool in the same step.

The key is shown only once, when it is generated. A pool has one key at a time,
so generating a new one invalidates the previous one. Closing enrollment removes
the key, and no new edge can join the pool until a key is generated again.
Neither change affects the edges that already enrolled.

![](../images/edge-pool.png)

### Adding and removing edges

Edges that enrolled with the organization key can be added to a pool afterwards.
An edge belongs to one pool at most, so adding it to another pool moves it. Only
the organization's own edges can join its pools, not the edges shared by an
organization above it. An edge removed from its pool stays enrolled, but runs no
task until it is added to a pool again.

{{< /tab >}}

{{< /tabs >}}

## Sharing edges with child organizations

An organization shares its edges with the organizations below it by handing down
its edge enrollment setting. Every organization that inherits the setting, at
any depth, can use the edges of the organization that set it. The setting is
inherited like any other organization setting, as described in
[handing settings down](../../access-control/organization-settings#handing-settings-down).

A shared edge appears in the organization's list of edges alongside its own.
Only the organization that enrolled the edge can manage it.

An organization gets edges from one organization above it at most: the one it
inherits the edge enrollment setting from. For example, the root organization
hands the setting down, and organization A below it sets its own and hands that
down too. Organization B below A then uses A's edges along with its own, but not
the root organization's.

The edges are shared for as long as the setting is inherited, whether or not
enrollment is enabled in it. Disabling enrollment only stops new edges from
joining.

An edge joins the organization that owns the enrollment key it presents. An edge
enrolled with an inherited key therefore joins the organization that handed the
setting down, even when it was set up for an organization below. An organization
enrolls edges of its own by setting its own edge enrollment value. A locked
setting prevents this, so the organizations below share the edges of the
organization that locked it and cannot enroll any of their own.
