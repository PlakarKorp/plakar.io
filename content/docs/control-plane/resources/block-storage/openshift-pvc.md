---
title: "OpenShift PVC"
date: "2026-10-26T00:00:00Z"
weight: 4
summary:
  "How to configure an OpenShift PersistentVolumeClaim resource in Plakar
  Control Plane."
---

# OpenShift PVC

OpenShift PVC resources represent the PersistentVolumeClaims of an OpenShift
cluster. The OpenShift integration backs up and restores their contents with two
protocols:

- `openshift+csi` takes a CSI `VolumeSnapshot` of the PVC and reads the volume
  from it, so the volume is captured at a single point in time. It is available
  for backup only.
- `openshift+pvc` reads the live volume directly, and is the only protocol used
  to restore a PVC, whichever protocol backed it up. A restore writes into a new
  or an existing PVC.

Both protocols move the data through a data mover pod started in the namespace
of the PVC and deleted when the operation ends. Snapshots taken for a backup are
deleted as well. The pod runs as the `default` ServiceAccount of the namespace
and pulls its image from `ghcr.io/plakarkorp/kubelet` by default. A cluster that
cannot reach `ghcr.io` needs the image from another registry, set with **Kubelet
Image**. See
[disconnected clusters](/docs/community/main/integrations/openshift/#disconnected-clusters)
for how to mirror it.

> [!WARNING]+ No point-in-time consistency
>
> An `openshift+pvc` backup reads files one after another while the workload
> keeps writing to the volume. Different files can therefore reflect different
> points in time. Use `openshift+csi` whenever the storage class supports
> `VolumeSnapshot`.

The kubeconfig used by the app must grant the permissions required by the
protocol. The roles in the Kubernetes RBAC guide apply to OpenShift as well.
Both protocols use the
[PVC backup and restore role](../../../guides/kubernetes/kubernetes-rbac#pvc-backup-and-restore).
When Plakar runs outside the cluster, they also need the
[port forwarding role](../../../guides/kubernetes/kubernetes-rbac#port-forwarding).

## Inventory Management

[Managed inventories](../../inventories#managed-inventories) discover
PersistentVolumeClaims automatically once the
[OpenShift inventory](../../inventories/managed/openshift) is connected to a
cluster.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph OpenShift["OpenShift Cluster"]
    PVC["PersistentVolumeClaim"]
    Snap["VolumeSnapshot<br/>(openshift+csi)"]
    Mover["Data mover pod"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["OpenShift PVC<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  PVC --> Snap
  PVC --> Mover
  Snap --> Mover
  Mover -->|"reads volume data"| Source
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
    Destination["OpenShift PVC<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph OpenShift["OpenShift Cluster"]
    Mover["Data mover pod"]
    PVC["New or existing PVC"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"writes via"| Mover
  Mover --> PVC
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared Configuration

The following settings are available when configuring both source and
destination apps.

- **Kubeconfig**: Paste the contents of a kubeconfig. Leave it empty when Plakar
  Control Plane runs inside the cluster to use the in-cluster credentials. The
  kubeconfig can also be loaded from a
  [secret provider](../../secret-providers).
- **Kubelet Image**: Optional. The image of the data mover pod. Set it to pull
  the image from a registry the cluster can reach.
- **Node Affinity**: Optional. Node affinity of the data mover pod, as the YAML
  or JSON body of a pod's `spec.affinity.nodeAffinity`.

## Source Configuration

The following setting is only available when configuring source apps with the
`openshift+csi` protocol.

- **Volume Snapshot Class**: Required. The `VolumeSnapshotClass` used to
  snapshot the PVC.
