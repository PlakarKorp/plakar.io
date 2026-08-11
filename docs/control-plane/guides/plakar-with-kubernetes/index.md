
# Plakar with Kubernetes

Plakar and Plakar Control Plane provides several Kubernetes components that work
together to discover, protect, and manage Kubernetes workloads. Depending on
your deployment model, you can use one or all of these components together.

## Kubernetes Inventory

The [Kubernetes inventory](../infrastructure/inventories/kubernetes) is a
managed inventory that discovers resources running inside one or more Kubernetes
clusters. Like other managed inventories, such as the
[AWS inventory](../infrastructure/inventories/aws), it synchronizes with the
cluster and imports discovered resources into Plakar Control Plane.

Once discovered, resources can be managed through the Plakar Control Plane UI,
assigned apps, and protected by backup policies.

See the [Kubernetes Inventory](../infrastructure/inventories/kubernetes)
documentation for configuration instructions.

## Kubernetes Integration

The Kubernetes integration provides backup and restore capabilities for
Kubernetes resources and Persistent Volumes. It is used by apps attached to
Kubernetes resources and performs the actual backup and restore operations.

See the [Kubernetes Integration](/docs/community/main/integrations/kubernetes)
documentation for configuration instructions.

## Plakar Operator

The Plakar Operator allows Plakar Control Plane resources to be managed
declaratively using Kubernetes Custom Resources (CRDs). Resources such as
inventories, apps, policies, and other configuration can be managed through
Kubernetes manifests and integrated into GitOps workflows.

See the
[Operator Installation](../infrastructure-as-code/kubernetes-operator/installation)
guide to get started.

## Plakar Edge

Plakar Edge is a lightweight execution worker that can be deployed inside a
Kubernetes cluster. It executes backup and restore operations close to the data
while Plakar Control Plane continues to provide centralized orchestration and
management.

See the [Edges](../infrastructure/edges) documentation for more information.

## Plakar Control Plane on Kubernetes

Plakar Control Plane will be available as a deployment running inside a
Kubernetes cluster, in addition to the currently supported deployment models.
This will allow the orchestration layer itself, alongside the components it
manages, to run natively on Kubernetes.

> [!NOTE]+
>
> This component is planned and not yet available.

## Choosing the right component

Each component serves a different purpose and they are designed to complement
one another.

| Component                      | Purpose                                                            |
| ------------------------------ | ------------------------------------------------------------------ |
| Kubernetes Inventory           | Discovers Kubernetes resources.                                    |
| Kubernetes Integration         | Backs up and restores Kubernetes resources and Persistent Volumes. |
| Plakar Operator                | Manages Plakar resources declaratively using Kubernetes manifests. |
| Plakar Edge                    | Executes backup and restore operations close to the data.          |
| Plakar Control Plane (planned) | Runs the orchestration layer itself inside a Kubernetes cluster.   |

A typical deployment may use the Kubernetes inventory to discover resources, the
Kubernetes integration to protect them, the Plakar Operator to manage
configuration as code, and Plakar Edge to execute operations within the cluster.

