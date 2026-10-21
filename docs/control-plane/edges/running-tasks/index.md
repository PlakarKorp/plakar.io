
# Running Tasks on Edges

A task runs on an edge only when it is pinned to an edge or targets edges by
tags. Any other task runs on the Control Plane itself. See
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
  in the set. When several edges match, the Control Plane prefers the one that
  has run a task least recently. It fails if no online edge matches.
- **Neither**: the task runs on the Control Plane itself, even when edges are
  online.

A task pinned to an edge or targeted by tags never falls back to the Control
Plane. If no suitable edge is available, the task fails rather than running
somewhere it was not meant to run. For a task targeted by tags, the job output
lists the requested tags. Check that an online edge reports every one of them,
and that their spelling matches the tags the edge was started with.

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

