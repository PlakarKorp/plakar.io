---
title: "Running Tasks"
date: "2026-07-13T00:00:00Z"
weight: 5
summary: "Run tasks on edges and how Plakar Control Plane selects an edge."
---

# Running Tasks on Edges

A task runs on an edge when one of the resources it uses is assigned to an
[edge pool](../enrollment#enrollment-keys). PCP sends the task to an edge of
that pool instead of running it itself. A task whose resources have no pool runs
on the Control Plane. Tasks do not name an edge themselves.

A resource gets its pool from its inventory, unless the resource sets a
different one in its [settings](../../resources#resource-settings).

## Selecting an edge

Every task runs on one edge at most, never on several. A pool only tells PCP
which edges a resource can use. When the task runs, PCP picks a single edge from
that pool, the one that has run a task least recently, so consecutive tasks are
spread across the edges of the pool.

Backups, restores and syncs use two resources, an origin and a target. PCP
decides where the task runs from the edges each of them can use, when the task
is created and when it runs:

- **Neither resource uses an edge**: the task runs on the Control Plane.
- **One resource uses an edge**: the task runs on one edge of that resource's
  pool.
- **Both resources use the same edges**: the task runs on one edge of their
  common pool.
- **They use different edges**: PCP refuses the task. An edge belongs to one
  pool at most, so no edge can serve both resources.

An operation on a single resource, such as checking a store, creating it or
testing its connection, runs on one edge of the pool of that resource, or on the
Control Plane when it has none.

When none of the edges a task can use is available, the task fails. It never
falls back to the Control Plane, since a resource assigned to a pool is meant to
be handled by its edges.

See [Scheduled Tasks](../../scheduling/tasks) for information about configuring
scheduled operations.
