---
title: "How Edges Work"
date: "2026-07-13T00:00:00Z"
weight: 1
summary:
  "How edges connect to Plakar Control Plane, receive tasks, and access secrets."
---

# How Edges Work

The Control Plane remains responsible for coordinating protection. It schedules
operations, manages inventories, stores metadata, and resolves the secrets
required to perform a task.

The edge is responsible for executing the operation. It connects to the Control
Plane and accesses the source or destination from its own network.

A deployment can contain multiple edges in different environments:

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR
  PCP["Plakar Control Plane"]

  subgraph Site1["Datacenter A"]
    Edge1["Edge"]
    VM1["Virtual Machines"]
    DB1["Databases"]
  end

  subgraph Site2["Remote Office"]
    Edge2["Edge"]
    NAS["NAS"]
    Files["File Servers"]
  end

  PCP -->|Assign task| Edge1
  PCP -->|Assign task| Edge2

  Edge1 --> VM1
  Edge1 --> DB1

  Edge2 --> NAS
  Edge2 --> Files
{{< /mermaid >}}
<!-- prettier-ignore-end -->

The important part of this architecture is that **the Control Plane does not
need direct access to the protected resources**. It only needs to communicate
with the edges. Each edge must be able to reach both the Control Plane and the
resources it is responsible for.

## Task lifecycle

An edge is enrolled once with the Control Plane. During enrollment, PCP gives
the edge an authentication token that it stores locally.

After enrollment, the edge maintains its connection to PCP by polling for work.
When a scheduled operation is assigned to it, PCP provides the information and
secrets required to perform the operation. The edge then connects directly to
the source, store or destination, performs the operation, and reports its status
to PCP.

A task runs through an integration, such as the S3 integration when backing up
an S3 bucket. The edge installs the integrations its tasks need from the Control
Plane, not from the internet, so an edge never needs internet access to obtain
them.

While a task runs, the edge streams its progress back to PCP. The
[job details](../../scheduling/job-history#job-details) of a task run on an edge
therefore show the same information as for a task run on the Control Plane:
progress, resource and network graphs, recent paths, and output. The output
carries what the task writes to `stderr`, along with the output of its
[pre-job and post-job hooks](../hooks).

<!-- prettier-ignore-start -->
{{< mermaid >}}
sequenceDiagram
  participant Edge as plakar-edge
  participant PCP as Plakar Control Plane
  participant Target as Source / Destination

  Note over Edge,PCP: One-time enrollment
  Edge->>PCP: Register with enrollment key
  PCP-->>Edge: Authentication token

  Note over Edge,PCP: Task execution
  PCP->>Edge: Assign task
  PCP-->>Edge: Resolve and provide required secrets
  Edge->>PCP: Install required integration
  Edge->>Target: Execute operation locally
  Edge-->>PCP: Stream progress and output
  Target-->>Edge: Result
  Edge-->>PCP: Report task status
{{< /mermaid >}}
<!-- prettier-ignore-end -->

Because the edge initiates communication with PCP, you do not need to expose an
edge to inbound connections from the Control Plane. This also makes it suitable
for environments where inbound connectivity is restricted.

## Secrets

Secrets required by a task remain managed by the Control Plane.

When PCP assigns a task to an edge, it resolves the secrets required for that
operation and provides them to the edge for the duration of the task. This can
include repository credentials such as a repository passphrase.

The edge therefore does not need to maintain a separate copy of the credentials
required by every task it executes.
