
# Kubernetes PVC

The Kubernetes integration allows Plakar Control Plane to back up and restore
the contents of Kubernetes PersistentVolumeClaims. Kubernetes integration
supports multiple protocols for backup, either via the CSI driver snapshot
feature (preferred) or by reading the volume directly.

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

- **Kubeconfig**: Required. Upload a kube config YAML file or paste its contents
  directly.
- **Kubelet Image**: The container image used for the helper pod. Leave this
  unset. It exists only so that Plakar support can supply a replacement image
  while diagnosing a problem, and a working deployment never needs it.
- **Volume Snapshot Class**: Required. The name of the `VolumeSnapshotClass` to
  use when creating the CSI snapshot.

## 2. `k8s+pvc` protocol

The `k8s+pvc` protocol reads a PVC's contents directly, without going through a
CSI snapshot. It supports both backup and restore, and is the only protocol
available for restoring PVC data, regardless of which protocol was used to back
it up.

Use this protocol for backup when the cluster's storage class has no
`VolumeSnapshot` support.

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

- **Kubeconfig**: Required. Upload a kube config YAML file or paste its contents
  directly.
- **Kubelet Image**: The container image used for the helper pod. Leave this
  unset. It exists only so that Plakar support can supply a replacement image
  while diagnosing a problem, and a working deployment never needs it.

