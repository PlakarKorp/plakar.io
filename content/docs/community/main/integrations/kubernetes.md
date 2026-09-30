---
title: "Kubernetes"
date: "2026-05-13T00:00:00Z"
weight: 13
summary:
  "Back up and restore Kubernetes resources and persistent volumes with Plakar."
aliases:
  - /docs/main/integrations/kubernetes/
---

# Kubernetes

The Kubernetes integration backs up the resources of a cluster and the contents
of its persistent volumes, and restores them to a cluster.

The integration includes two connectors:

| Connector type            | Description                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| **Source connector**      | Back up Kubernetes resources or persistent volume contents into a Kloset store.              |
| **Destination connector** | Restore Kubernetes resources or persistent volume contents from a Kloset store to a cluster. |

Each protocol covers a different kind of data:

| Protocol  | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| `k8s`     | Back up and restore Kubernetes manifests and resource state.               |
| `k8s+csi` | Back up persistent volume contents through a CSI `VolumeSnapshot`.         |
| `k8s+pvc` | Back up and restore persistent volume contents without a `VolumeSnapshot`. |

**Requirements**

- An accessible Kubernetes cluster.
- Credentials with the permissions required by each operation. See
  [Kubernetes Service Accounts and RBAC](/docs/control-plane/guides/kubernetes/kubernetes-rbac)
  for least-privilege roles.

## Installation

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the Kubernetes package:

```bash
$ plakar pkg add k8s
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< tab label="Building from source" >}}

Source builds are useful when pre-built packages are unavailable or when
customization is required.

**Prerequisites:**

- Go toolchain compatible with your **Plakar** version

Build the package:

```bash
$ plakar pkg build k8s
```

A package archive will be created in the current directory (e.g.,
`k8s_v1.1.0-beta.6_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add -allow-unsigned ./k8s_v1.1.0-beta.6_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## Cluster access

All three protocols reach the cluster through a kube config. By default, the
integration uses the default context defined in `~/.kube/config`. Use the
`kubeconfig_file` option to point at a different kube config, or `kubeconfig` to
provide a configuration inline.

The following options apply to every protocol, for both source and destination
connectors.

| Option            | Required | Description                                              |
| ----------------- | -------- | -------------------------------------------------------- |
| `kubeconfig_file` | No       | Path to a kube config file, defaults to `~/.kube/config` |
| `kubeconfig`      | No       | Content of a kube config file passed inline              |

## 1. `k8s` protocol

The `k8s` protocol fetches all Kubernetes resources across the cluster and
stores them as a Plakar snapshot. Cluster configuration can then be browsed,
diffed and restored at any level of granularity: the full cluster, a single
namespace, or an individual resource.

Snapshots include resource status metadata. Browsing a snapshot in the Plakar UI
shows the state of deployments, nodes and other resources at the time of the
backup, which is useful for incident investigation.

#### Backup flow

<!-- prettier-ignore-start -->
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
<!-- prettier-ignore-end -->

### Source configuration

The following options are available to source connectors using the `k8s`
protocol, in addition to those in [Cluster access](#cluster-access).

| Option   | Required | Description                                                                    |
| -------- | -------- | ------------------------------------------------------------------------------ |
| `labels` | No       | Kubernetes label selector. Only manifests matching the selector are backed up. |

### Destination configuration

The following options are available to destination connectors using the `k8s`
protocol, in addition to those in [Cluster access](#cluster-access).

| Option             | Required | Description                                                                                                                                                                                                     |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ignore_resources` | No       | Semicolon-separated list of `group/Kind` to leave out of the restore, for example `apps/Deployment;cert-manager.io/Certificate;/ConfigMap`. Leave the group empty for the core group. Kinds are case-sensitive. |

### Example

Back up all resources across the entire cluster:

```bash
$ plakar backup k8s:/
```

Back up resources in a specific namespace:

```bash
$ plakar backup k8s:/foo
```

Restore all `StatefulSet` resources in the `foo` namespace:

```bash
$ plakar restore -to k8s: abcd:/foo/apps/StatefulSet
```

## 2. `k8s+csi` protocol

The `k8s+csi` protocol backs up the contents of a persistent volume by creating
a `VolumeSnapshot`, mounting it in a temporary pod running a helper importer,
and ingesting the data into a Kloset store. The snapshot is deleted from the
cluster once ingestion completes.

This protocol is available for backup only. Data backed up with `k8s+csi` is
restored with the [`k8s+pvc`](#3-k8spvc-protocol) protocol.

A VolumeSnapshotClass is required for CSI-based backups. Depending on the
provider, one may already be available, or it may need to be created explicitly.

#### Backup flow

<!-- prettier-ignore-start -->
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
<!-- prettier-ignore-end -->

### Source configuration

The following options are available to source connectors using the `k8s+csi`
protocol, in addition to those in [Cluster access](#cluster-access).

| Option                  | Required | Description                                                                                                                                       |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kubelet_image`         | No       | Container image for the helper pod. Leave unset. It exists only so that Plakar support can supply a replacement image while diagnosing a problem. |
| `volume_snapshot_class` | Yes      | Name of the `VolumeSnapshotClass` to use for CSI snapshots.                                                                                       |
| `fs_access`             | No       | File access capabilities granted to the helper pod. See [File access](#file-access). Defaults to `read`.                                          |

### Example

Back up the `my-pvc` PVC in the `storage` namespace:

```bash
$ plakar backup -o volume_snapshot_class=my-snapclass k8s+csi:/storage/my-pvc
```

## 3. `k8s+pvc` protocol

The `k8s+pvc` protocol backs up and restores the contents of a PVC without a
VolumeSnapshot. The PVC access mode is critical when backing up this way. For
example, ReadWriteOnce does not permit concurrent backups of an already mounted
PVC.

A restore writes the data into a target PVC through the same helper pod
mechanism used for backups. The target can be an existing PVC or a freshly
created one, and must have sufficient capacity.

### Shared configuration

The following options apply to both source and destination connectors using the
`k8s+pvc` protocol, in addition to those in [Cluster access](#cluster-access).

| Option          | Required | Description                                                                                                                                       |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kubelet_image` | No       | Container image for the helper pod. Leave unset. It exists only so that Plakar support can supply a replacement image while diagnosing a problem. |
| `fs_access`     | No       | File access capabilities granted to the helper pod. See [File access](#file-access). Defaults to `read` for backups and `full` for restores.      |

### File access

The `fs_access` option sets the file access capabilities granted to the helper
pod:

- `default`: the pod gains no extra capabilities.
- `read`: the pod gains read capabilities only.
- `full`: the pod gains read and write capabilities.

### Example

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

$ plakar restore -to k8s+pvc:/storage/pristine abcdef:
```

Restore into an existing PVC by referencing it in the same way.

## Limitations and scope

Backups capture all Kubernetes resource manifests and status metadata with
`k8s`, and persistent volume contents with `k8s+csi` and `k8s+pvc`. Node-level
configuration (OS, kubelet config, network setup) and in-flight workload state
(open connections, in-memory data) are not captured.

Manifest snapshots reflect the state of the API server at the time of backup.
For PVCs, consistency depends on the CSI driver and whether the workload was
quiesced before the snapshot was taken.

## See also

- [Kubernetes integration demo](https://www.youtube.com/watch?v=b8fOwCLSTiU)
- [etcd integration](/docs/community/main/integrations/etcd/)
- [Kubernetes PVC in Plakar Control Plane](/docs/control-plane/resources/block-storage/pvc)
- [VolumeSnapshots in the Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/volume-snapshots/)
