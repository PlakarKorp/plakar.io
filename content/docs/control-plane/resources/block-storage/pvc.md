---
title: "Kubernetes PVC"
date: "2026-08-11T00:00:00Z"
weight: 2
summary:
  "How to configure a Kubernetes PersistentVolumeClaim resource in Plakar
  Control Plane."
---

# Kubernetes PVC

The Kubernetes integration allows Plakar Control Plane to back up and restore
the contents of Kubernetes PersistentVolumeClaims. Kubernetes integration
supports multiple protocols for backup, either via the CSI driver snapshot
feature (preferred) or by reading the volume directly.

The kubeconfig used by the app must grant the permissions required by the
protocol. Both protocols use the
[PVC backup and restore role](../../../guides/kubernetes/kubernetes-rbac#pvc-backup-and-restore).
When Plakar runs outside the cluster, they also need the
[port forwarding role](../../../guides/kubernetes/kubernetes-rbac#port-forwarding).

## Inventory Management

[Managed inventories](../../inventories#managed-inventories) can discover
PersistentVolumeClaims automatically once the
[Kubernetes inventory](../../inventories/managed/kubernetes) is connected to a
cluster. You can instead set up a
[self-managed inventory](../../inventories/self-managed) and add the PVC
manually.

### Adding a Kubernetes PVC as a resource

When using a self-managed inventory, register the resource with `Block Storage`
as the class and `PVC` as the subclass. For the endpoint, use the namespace
followed by the PVC name, for example `/default/my-pvc`. See
[resources documentation](../../resources) for more information on how to set up
resources on a self-managed inventory.

## 1. `k8s+csi` protocol

The `k8s+csi` protocol backs up a PVC by creating a `VolumeSnapshot` through the
cluster's CSI driver, then reading the snapshot's data through a helper pod. It
is the preferred backup method when the cluster's storage class supports the
`VolumeSnapshot` API, since the snapshot captures a consistent point-in-time
copy of the volume without needing to quiesce the workload manually.

This protocol is available for backup only. Restoring a PVC always uses the
`k8s+pvc` protocol, described below. Because `k8s+pvc` is the only protocol
Control Plane can use to restore PVC data, it is selected automatically and the
protocol selector is not shown during restore.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph K8s["Kubernetes Cluster"]
    PVC["PersistentVolumeClaim"]
    Snap["VolumeSnapshot"]
    Helper["Helper pod"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["Kubernetes PVC<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"creates"| Snap
  PVC --> Snap
  Snap --> Helper
  Helper -->|"reads snapshot data"| Source
  Source --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following settings are available when configuring a source app using the
`k8s+csi` protocol.

- **Kubeconfig**: Upload a kube config YAML file or paste its contents directly.
  Leave it empty when Plakar Control Plane runs inside the cluster to use the
  in-cluster configuration. The kubeconfig can also be loaded from a
  [secret provider](../../secret-providers).
- **Kubelet Image**: The container image used for the helper pod. Defaults to a
  recent kubelet image. Set it to pull the image from another registry, for
  example a local mirror in an air-gapped cluster.
- **Node Affinity**: Optional. Node affinity of the helper pod, as the YAML or
  JSON body of a pod's `spec.affinity.nodeAffinity`.
- **Volume Snapshot Class**: Required. The name of the `VolumeSnapshotClass` to
  use when creating the CSI snapshot.
- **FS Access**: The file access capabilities granted to the helper pod.
  `default` grants no extra capabilities, `read` grants read capabilities only,
  and `full` grants read and write capabilities. Defaults to `read`.

## 2. `k8s+pvc` protocol

The `k8s+pvc` protocol reads a PVC's contents directly from the live volume,
without going through a CSI snapshot. It supports both backup and restore, and
is the only protocol available for restoring PVC data, regardless of which
protocol was used to back it up.

For backups, this protocol is a fallback for clusters where CSI snapshots are
not available. Use `k8s+csi` whenever the storage class supports
`VolumeSnapshot`.

> [!WARNING]+ No point-in-time consistency
>
> A `k8s+pvc` backup reads files one after another while the workload keeps
> writing to the volume. Different files can therefore reflect different points
> in time. This is not safe for data that must be captured as a whole, such as
> the data directory of a database. It is generally acceptable for data that
> rarely changes, such as configuration files. Whether `k8s+pvc` is suitable
> depends on the application using the volume.

A `ReadWriteOnce` PVC can only be mounted on one node at a time. If a workload
already mounts the PVC and the helper pod is scheduled on a different node, the
helper pod cannot mount the volume and the backup fails.

> [!NOTE]
>
> Support for backing up `ReadWriteOnce` PVCs that are already mounted is
> planned.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph K8s["Kubernetes Cluster"]
    PVC["PersistentVolumeClaim"]
    Helper["Helper pod"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["Kubernetes PVC<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"mounts via"| Helper
  PVC --> Helper
  Helper -->|"reads volume data"| Source
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
    Destination["Kubernetes PVC<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph K8s["Kubernetes Cluster"]
    Helper["Helper pod"]
    PVC["Restored <br/> PersistentVolumeClaim"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"writes via"| Helper
  Helper --> PVC
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following settings are available when configuring both source and
destination apps using the `k8s+pvc` protocol.

- **Kubeconfig**: Upload a kube config YAML file or paste its contents directly.
  Leave it empty when Plakar Control Plane runs inside the cluster to use the
  in-cluster configuration. The kubeconfig can also be loaded from a
  [secret provider](../../secret-providers).
- **Kubelet Image**: The container image used for the helper pod. Defaults to a
  recent kubelet image. Set it to pull the image from another registry, for
  example a local mirror in an air-gapped cluster.
- **Node Affinity**: Optional. Node affinity of the helper pod, as the YAML or
  JSON body of a pod's `spec.affinity.nodeAffinity`.
- **FS Access**: The file access capabilities granted to the helper pod.
  `default` grants no extra capabilities, `read` grants read capabilities only,
  and `full` grants read and write capabilities. Defaults to `read` for source
  apps and `full` for destination apps.
