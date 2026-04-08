---
title: Kubernetes
summary: Back up and restore Kubernetes resources and persistent volumes with Plakar.
date: "2026-04-02T00:00:00Z"
---

The Kubernetes integration backs up clusters at three levels: etcd for disaster recovery, manifests for granular inspection and restore, and persistent volumes via CSI snapshots. Each level is handled by a dedicated package.

| Package  | What it backs up |
| -------- | ---------------- |
| `etcd`   | etcd cluster state — full disaster recovery. |
| `k8s`    | Kubernetes manifests and resource state across namespaces. |
| `k8s` (CSI) | Persistent volume contents via CSI driver snapshots. |

**Requirements**

* Plakar v1.1.0-beta or later.
* `kubectl proxy` running and accessible for manifest and PVC backups.
* A CSI driver with snapshot support and a configured `VolumeSnapshotClass` for CSI-based PVC backups.

**Typical use cases**

* Full cluster disaster recovery via etcd backup.
* Namespace or resource-level restore from manifest snapshots.
* Incident investigation by browsing cluster state at a point in time.
* Persistent volume backup and cross-environment data portability.

---

## Installation

{{< tabs name="Installation Methods" >}}
{{% tab name="Pre-built package" %}}
**Note:** Installing pre-built packages requires authentication with Plakar. See [Login to Plakar to unlock features](../../guides/what-is-plakar-login/).

Install the etcd package:

```bash
$ plakar pkg add etcd
```

Install the Kubernetes package:

```bash
$ plakar pkg add k8s
```

Verify the installation:

```bash
$ plakar pkg list
```
{{% /tab %}}

{{% tab name="Building from source" %}}
**Prerequisites**

* A working Go toolchain compatible with your version of Plakar.

Build and install the etcd package:

```bash
$ plakar pkg build etcd
$ plakar pkg add ./etcd_v1.1.0-beta_linux_amd64.ptar
```

Build and install the Kubernetes package:

```bash
$ plakar pkg build k8s
$ plakar pkg add ./k8s_v1.1.0-beta_linux_amd64.ptar
```

Verify the installation:

```bash
$ plakar pkg list
```
{{% /tab %}}

{{% tab name="Reinstalling or upgrading" %}}
To check installed packages:

```bash
$ plakar pkg list
```

To upgrade, remove and reinstall:

```bash
$ plakar pkg rm etcd && plakar pkg add etcd
$ plakar pkg rm k8s && plakar pkg add k8s
```

Existing configurations are preserved during upgrade.
{{% /tab %}}
{{< /tabs >}}

---

## etcd backup

etcd is the key-value store that holds all cluster state in Kubernetes. Losing etcd without a backup means losing the cluster. This integration provides a last-resort recovery path in the event of a wide node failure.

{{< mermaid >}}
flowchart LR

subgraph Source[<b>etcd</b>]
  db@{ shape: cyl, label: "Cluster state" }
end

subgraph Plakar[<b>Plakar</b>]
  Connector@{ shape: rect, label: "<small>Retrieve snapshot via</small><br><b>etcd API</b>" }
  Transform@{ shape: rect, label: "<small>Encrypt & deduplicate</small>" }
  Connector --> Transform
end

Source --> Connector
Store@{ shape: cyl, label: "Kloset Store" }
Transform --> Store

classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px
class Source sourceBox
class Plakar brandBox
class Store storeBox
linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

Back up an etcd node:

```bash
$ plakar backup etcd://node1:2379
```

{{% notice style="info" title="Restore scope" expanded="true" %}}
etcd restore is an all-or-nothing operation. It is intended for full cluster recovery, not granular resource restores. For namespace or resource-level restores, use the manifest backup described below.
{{% /notice %}}

---

## Manifest backup and restore

The `k8s` package fetches all Kubernetes resources across the cluster and stores them as a Plakar snapshot. This enables browsing, diffing, and restoring cluster configuration at any level of granularity — full cluster, single namespace, or individual resource.

{{< mermaid >}}
flowchart LR

subgraph Source[<b>Kubernetes Cluster</b>]
  api@{ shape: rect, label: "API Server" }
end

subgraph Plakar[<b>Plakar</b>]
  Connector@{ shape: rect, label: "<small>Fetch manifests via</small><br><b>kubectl proxy</b>" }
  Transform@{ shape: rect, label: "<small>Encrypt & deduplicate</small>" }
  Connector --> Transform
end

Source --> Connector
Store@{ shape: cyl, label: "Kloset Store" }
Transform --> Store

classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px
class Source sourceBox
class Plakar brandBox
class Store storeBox
linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
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

Snapshots also include resource status metadata, making them useful for incident investigation — you can browse the Plakar UI to inspect the state of deployments, nodes, and other resources at any point in time.

---

## Persistent volume backup and restore (CSI)

The CSI connector backs up the contents of persistent volumes by creating a `VolumeSnapshot`, mounting it in a temporary pod running a helper importer, and ingesting the data into a Kloset store. The snapshot is deleted from the cluster once ingestion completes.

Restore works in reverse: data is written into a target PVC using the same helper pod mechanism. The target can be an existing PVC or a freshly created one.

{{< mermaid >}}
flowchart LR

subgraph Source[<b>Kubernetes Cluster</b>]
  pvc@{ shape: cyl, label: "PVC" }
  snap@{ shape: rect, label: "VolumeSnapshot" }
  pvc --> snap
end

subgraph Plakar[<b>Plakar</b>]
  Connector@{ shape: rect, label: "<small>Ingest via</small><br><b>helper pod</b>" }
  Transform@{ shape: rect, label: "<small>Encrypt & deduplicate</small>" }
  Connector --> Transform
end

snap --> Connector
Store@{ shape: cyl, label: "Kloset Store" }
Transform --> Store

classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px
class Source sourceBox
class Plakar brandBox
class Store storeBox
linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

### Back up a PVC

Back up the PVC `my-pvc` in the `storage` namespace:

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

{{% notice style="warning" title="CSI support required" expanded="true" %}}
CSI-based PVC backups require a storage driver that supports the `VolumeSnapshot` API. Verify that your cluster has a compatible CSI driver and a configured `VolumeSnapshotClass` before using this connector.
{{% /notice %}}

---

## Limitations and scope

**What is captured**

* Full etcd cluster state (etcd package).
* All Kubernetes resource manifests and status metadata (k8s package).
* Persistent volume contents for CSI-backed PVCs (k8s+csi connector).

**What is not captured**

* Non-CSI volumes are not yet supported for PVC backups.
* Node-level configuration (OS, kubelet config, network setup).
* In-flight workload state (open connections, in-memory data).

**Snapshot consistency**

Manifest snapshots reflect the state of the API server at the time of backup. For PVCs, consistency depends on the CSI driver and whether the workload was quiesced before the snapshot was taken.

---

## See also

* [Kubernetes integration demo](https://www.youtube.com/watch?v=b8fOwCLSTiU)
* [Kubernetes documentation - Volumes](https://kubernetes.io/docs/concepts/storage/volumes/)
* [Kubernetes documentation - VolumeSnapshots](https://kubernetes.io/docs/concepts/storage/volume-snapshots/)
