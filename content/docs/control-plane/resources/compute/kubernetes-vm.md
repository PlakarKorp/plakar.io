---
title: "Kubernetes VM"
date: "2026-10-14T00:00:00Z"
weight: 6
summary:
  "How to configure a KubeVirt virtual machine resource in Plakar Control Plane."
---

# Kubernetes VM

Kubernetes VM resources represent KubeVirt virtual machines running in a
Kubernetes cluster. The Kubernetes integration backs them up and restores them
through the `k8s+vm` protocol.

During a backup, Plakar Control Plane asks KubeVirt to snapshot the virtual
machine. KubeVirt snapshots each disk, so no `VolumeSnapshotClass` needs to be
configured. Plakar Control Plane then reads each disk through a helper pod and
stores the disk contents and the virtual machine manifest in the Kloset store.

During a restore, Plakar Control Plane recreates the PVC of each disk in the
namespace of the destination resource, writes the disk contents back through a
helper pod, then applies the virtual machine manifest.

The kubeconfig used by the app must grant the permissions required by the
operation. Source apps use the
[VM backup role](../../../guides/kubernetes/kubernetes-rbac#vm-backup) and
destination apps use the
[VM restore role](../../../guides/kubernetes/kubernetes-rbac#vm-restore). When
Plakar runs outside the cluster, both also need the
[port forwarding role](../../../guides/kubernetes/kubernetes-rbac#port-forwarding).

## Inventory Management

[Managed inventories](../../inventories#managed-inventories) can discover
KubeVirt virtual machines automatically once the
[Kubernetes inventory](../../inventories/managed/kubernetes) is connected to a
cluster with KubeVirt installed. You can instead set up a
[self-managed inventory](../../inventories/self-managed) and add the virtual
machine manually.

### Adding a Kubernetes VM as a resource

When using a self-managed inventory, register the resource with `Compute` as the
class. For the endpoint, use the namespace followed by the virtual machine name,
for example `/default/my-vm`. See [resources documentation](../../resources) for
more information on how to set up resources on a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph K8s["Kubernetes Cluster"]
    VM["Virtual Machine"]
    Snap["KubeVirt snapshot"]
    Helper["Helper pod"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["Kubernetes VM<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"requests"| Snap
  VM --> Snap
  Snap --> Helper
  Helper -->|"reads disk data"| Source
  Source --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["Kubernetes VM<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph K8s["Kubernetes Cluster"]
    Helper["Helper pod"]
    PVC["Restored disk PVCs"]
    VM["Restored <br/> Virtual Machine"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"writes via"| Helper
  Helper --> PVC
  PVC --> VM
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared Configuration

The following settings are available when configuring both source and
destination apps using the `k8s+vm` protocol.

- **Kubeconfig**: Upload a kube config YAML file or paste its contents directly.
  Leave it empty when Plakar Control Plane runs inside the cluster to use the
  in-cluster configuration. The kubeconfig can also be loaded from a
  [secret provider](../../secret-providers).
- **Kubelet Image**: The container image used for the helper pod. Defaults to a
  recent kubelet image. Set it to pull the image from another registry, for
  example a local mirror in an air-gapped cluster.
