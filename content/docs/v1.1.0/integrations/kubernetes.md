---
title: "Kubernetes"
date: "2026-04-02T00:00:00Z"
weight: 12
summary: "Back up and restore Kubernetes resources and persistent volumes with Plakar."
---

# Kubernetes

The Kubernetes integration backs up cluster resources and persistent volumes. It provides two connectors accessible via two URI schemes:

| URI scheme   | What it backs up |
| ------------ | ---------------- |
| `k8s://`     | Kubernetes manifests and resource state across namespaces. |
| `k8s+csi://` | Persistent volume contents via CSI driver snapshots. |

**Requirements**

* Plakar v1.1.0-beta or later.
* `kubectl proxy` running and accessible.
* A CSI driver with snapshot support and a configured `VolumeSnapshotClass` for CSI-based PVC backups.

**Typical use cases**

* Namespace or resource-level restore from manifest snapshots.
* Incident investigation by browsing cluster state at a point in time.
* Persistent volume backup and cross-environment data portability.


## Installation

{{< tabs >}}
  {{< tab label="Pre-built package" >}}
  
  Pre-compiled packages are available for common platforms and provide the simplest installation method.
  
  > [!NOTE]+ Logging In
  > Pre-built packages require Plakar authentication. See [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.
  
  Install the Kubernetes package:
  
  ```bash
  $ plakar pkg add k8s
  ```

  Verify installation:
  
  ```bash
  $ plakar pkg list
  ```
  
  {{< /tab >}}
  {{< tab label="Building from source" >}}
  
  Source builds are useful when pre-built packages are unavailable or when customization is required.

  **Prerequisites:**
  - Go toolchain compatible with your **Plakar** version
  
  Build the package:
  
  ```bash
  $ plakar pkg build k8s
  ```
  
  A package archive will be created in the current directory (e.g., `k8s_v1.1.0-rc.1_darwin_arm64.ptar`).
  
  Install the package:
  
  ```bash
  $ plakar pkg add ./k8s_v1.0.0_darwin_arm64.ptar
  ```
  
  Verify installation:
  ```bash
  $ plakar pkg list
  ```
  
  {{< /tab >}}
  {{< tab label="Reinstalling or upgrading" >}}
  
  Check if the Kubernetes package is installed:
  
  ```bash
  $ plakar pkg list
  ```
  
  To upgrade to the latest available version, remove the existing package and reinstall it:
  
  ```bash
  $ plakar pkg rm k8s
  $ plakar pkg add k8s
  ```
  
  Existing configurations (stores, sources, destinations) are preserved during upgrade.
  
  {{< /tab >}}
{{< /tabs >}}


## Manifest backup and restore

The `k8s://` connector fetches all Kubernetes resources across the cluster and stores them as a Plakar snapshot. This enables browsing, diffing, and restoring cluster configuration at any level of granularity — full cluster, single namespace, or individual resource.

Snapshots include resource status metadata, making them useful for incident investigation — you can browse the Plakar UI to inspect the state of deployments, nodes, and other resources at any point in time.

{{< mermaid >}}
flowchart LR

subgraph Source["Kubernetes Cluster"]
  API["API Server"]
end

Plakar["Plakar"]

Via["Fetch manifests via<br/>kubectl proxy"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

API --> Via --> Plakar --> Transform --> Store
{{< /mermaid >}}

Start a proxy to the cluster:

```bash
$ kubectl proxy
Starting to serve on 127.0.0.1:8001
```

### Back up manifests

Back up all resources across the entire cluster:

```bash
$ plakar backup k8s://localhost:8001
```

Back up resources in a specific namespace:

```bash
$ plakar backup k8s://localhost:8001/foo
```

### Restore manifests

Restore all `StatefulSet` resources in the `foo` namespace:

```bash
$ plakar restore -to k8s://localhost:8001 abcd:/foo/apps/StatefulSet
```

## Persistent volume backup and restore (CSI)

The `k8s+csi://` connector backs up the contents of persistent volumes by creating a `VolumeSnapshot`, mounting it in a temporary pod running a helper importer, and ingesting the data into a Kloset store. The snapshot is deleted from the cluster once ingestion completes.

Restore works in reverse: data is written into a target PVC using the same helper pod mechanism. The target can be an existing PVC or a freshly created one.

{{< mermaid >}}
flowchart LR

subgraph Source["Kubernetes Cluster"]
  PVC["PVC"]
  Snap["VolumeSnapshot"]
  PVC --> Snap
end

Plakar["Plakar"]

Via["Ingest via<br/>helper pod"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Snap --> Via --> Plakar --> Transform --> Store
{{< /mermaid >}}

### Back up a PVC

```bash
$ plakar backup -o volume_snapshot_class=my-snapclass k8s+csi://localhost:8001/storage/my-pvc
```

### Restore a PVC

Restore into a new, empty PVC:

```bash
$ kubectl create -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pristine
  namespace: storage
spec:
  resources:
    requests:
      storage: 1Gi
  accessModes:
    - ReadWriteOnce

$ plakar restore -to k8s+csi://localhost:8001/storage/pristine abcdef:
```

Restore into an existing PVC by referencing it in the same way. The target PVC must have sufficient capacity.

### Options

| Option                  | Required | Description |
| ----------------------- | -------- | ----------- |
| `volume_snapshot_class` | Yes      | Name of the `VolumeSnapshotClass` to use for CSI snapshots. |
| `kubelet_image`         | No       | Container image for the helper pod. Defaults to a recent kubelet image. |

## Limitations and scope

**What is captured**

* All Kubernetes resource manifests and status metadata (`k8s://`).
* Persistent volume contents for CSI-backed PVCs (`k8s+csi://`).

**What is not captured**

* Non-CSI volumes are not yet supported for PVC backups.
* Node-level configuration (OS, kubelet config, network setup).
* In-flight workload state (open connections, in-memory data).

**Snapshot consistency**

Manifest snapshots reflect the state of the API server at the time of backup. For PVCs, consistency depends on the CSI driver and whether the workload was quiesced before the snapshot was taken.

## See also

* [Kubernetes integration demo](https://www.youtube.com/watch?v=b8fOwCLSTiU)
* [etcd integration](/docs/main/integrations/etcd/)
* [Kubernetes documentation — VolumeSnapshots](https://kubernetes.io/docs/concepts/storage/volume-snapshots/)
