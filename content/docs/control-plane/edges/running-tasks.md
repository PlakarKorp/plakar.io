---
title: "Running Tasks"
date: "2026-07-13T00:00:00Z"
weight: 5
summary: "Run tasks on edges and how Plakar Control Plane selects an edge."
---

# Running Tasks on Edges

A task that is not pinned to an edge is dispatched by the Control Plane, which
prefers an available edge over running the task itself. See
[Selecting an edge](#selecting-an-edge).

To run a task on a specific edge, pin it to that edge when creating or editing
the schedule. This allows you to choose where an operation runs based on the
network location of the resources it protects.

See [Scheduled Tasks](../../scheduling/tasks) for information about configuring
scheduled operations.

## Selecting an edge

The Control Plane decides where a task runs when the task is dispatched. A task
can name one edge or a set of tags, but not both.

Tags let a task describe which edges it can run on rather than naming one
specific edge. Each edge reports its tags to the Control Plane on every poll. A
task targeting `env:prod` can run on any online edge tagged `env:prod`, so the
Control Plane can choose among them instead of depending on a single edge.

- **Pinned to an edge**: the task runs on that edge. It fails if the edge is
  offline.
- **Targeted by tags**: the task runs on an online edge that reports every tag
  in the set. It fails if no online edge matches.
- **Neither**: the task runs on any online edge. When several are online, the
  Control Plane prefers the one that has run a task least recently. When no edge
  is online, the task runs on the Control Plane itself.

A task is pinned to an edge with the **Run on** field when it is
[scheduled](../../scheduling/tasks). Targeting by tags is not available in the
Control Plane interface. It is currently only possible through the `edge_tags`
option of the [Ansible collection](../../references/ansible-collection) and the
`edgeTags` field of the
[Kubernetes operator](../../infrastructure-as-code/kubernetes-operator/scheduling#running-tasks-on-a-remote-edge)
schedule resources.

> [!NOTE]
>
> Edge selection is being improved to provide more flexible task scheduling and
> horizontal scaling. Tag-based selection and task dispatch are being expanded,
> which will make it easier to distribute workloads across multiple edges.
