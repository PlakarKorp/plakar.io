
# OpenShift

The OpenShift integration backs up the resources of an OpenShift cluster, the
contents of its persistent volumes and its OpenShift Virtualization virtual
machines, and restores them to a cluster. It understands what OpenShift manages
on its own, so a restore leaves out the objects the cluster recreates by itself.

The integration includes two connectors:

| Connector type            | Description                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Source connector**      | Back up OpenShift resources, persistent volume contents or virtual machines into a Kloset store.              |
| **Destination connector** | Restore OpenShift resources, persistent volume contents or virtual machines from a Kloset store to a cluster. |

Each protocol covers a different kind of data:

| Protocol        | Backup | Restore | Location                                  |
| --------------- | ------ | ------- | ----------------------------------------- |
| `openshift`     | Yes    | Yes     | `openshift://<api>[/<namespace>]`         |
| `openshift+csi` | Yes    | No      | `openshift+csi://<api>/<namespace>/<pvc>` |
| `openshift+pvc` | Yes    | Yes     | `openshift+pvc://<api>/<namespace>/<pvc>` |
| `openshift+vm`  | Yes    | Yes     | `openshift+vm://<api>/<namespace>/<vm>`   |

`<api>` is the address of the cluster's API server, for example
`api.example.com:6443`. It can be left out when a kubeconfig is used, in which
case the API server is taken from the kubeconfig.

**Requirements**

- An accessible OpenShift cluster.
- Credentials with the permissions required by each operation. The roles in
  [Kubernetes Service Accounts and RBAC](/docs/control-plane/guides/kubernetes/kubernetes-rbac)
  apply to OpenShift as well.
- For `openshift+vm`, OpenShift Virtualization installed in the cluster.

## Installation

The OpenShift integration is distributed as a pre-built package only. Unlike
most Community integrations, it has no public source repository, so
`plakar pkg build` cannot produce it. It remains free to install with a Plakar
account. See
[source availability](../../guides/managing-packages/#source-availability) for
how this differs from the other integrations.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the OpenShift package:

```bash
$ plakar pkg add openshift
```

Verify installation:

```bash
$ plakar pkg show
```

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages).

## Cluster access

All protocols reach the cluster through a kubeconfig. By default, the
integration uses `~/.kube/config`. The `kubeconfig` option provides a kubeconfig
inline instead, and takes precedence over the default file.

When no kubeconfig is available, the integration falls back to in-cluster
credentials. It then reaches the cluster it runs in with the permissions of its
pod's ServiceAccount.

The following option applies to every protocol, for both source and destination
connectors.

| Option       | Required | Description                                 |
| ------------ | -------- | ------------------------------------------- |
| `kubeconfig` | No       | Content of a kubeconfig file passed inline. |

## How volume data is read and written

Backing up or restoring volume data, with `openshift+csi`, `openshift+pvc` or
`openshift+vm`, starts a data mover pod in the namespace of the volume. The pod
streams the volume contents between the cluster and Plakar, and is deleted when
the operation ends. Snapshots taken for a backup are deleted as well.

The pod runs as the `default` ServiceAccount of the namespace, without image
pull secrets. Its image is pulled from `ghcr.io/plakarkorp/kubelet` by default.
A cluster that cannot reach `ghcr.io` needs another source for the image, as
described in [Disconnected clusters](#disconnected-clusters).

The following options apply to `openshift+csi`, `openshift+pvc` and
`openshift+vm`, for both source and destination connectors.

| Option          | Required | Description                                                                                            |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `kubelet_image` | No       | Image of the data mover pod. Set it to pull the image from a registry the cluster can reach.           |
| `node_affinity` | No       | Node affinity of the data mover pod, as the YAML or JSON body of a pod's `spec.affinity.nodeAffinity`. |

## 1. `openshift` protocol

The `openshift` protocol backs up and restores the manifests of a cluster. With
a namespace in the location, it covers that namespace. Without one, it covers
the whole cluster.

It backs up configuration only. The contents of persistent volumes and virtual
machine disks are not included, and are backed up with
[`openshift+csi`](#2-openshiftcsi-protocol),
[`openshift+pvc`](#3-openshiftpvc-protocol) and
[`openshift+vm`](#4-openshiftvm-protocol).

A restore leaves out the objects OpenShift recreates on its own:

- `Build` and `ImageTag` objects.
- Build pods and the config maps generated for them.
- Serving certificate secrets issued by the service CA operator, which are
  issued again for the restored services.
- The role bindings OpenShift creates in every namespace, such as
  `system:image-pullers`, `system:image-builders` and `system:deployers`.
- OADP non-admin objects.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["OpenShift Cluster"]
  API["API Server"]
end

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

API -->|"fetch manifests"| Plakar --> Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Transform["Decrypt & reconstruct"]

Plakar["Plakar"]

subgraph Destination["OpenShift Cluster"]
  API["API Server"]
end

Store --> Transform --> Plakar -->|"apply manifests"| API
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Source configuration

The following options are available to source connectors using the `openshift`
protocol, in addition to those in [Cluster access](#cluster-access).

| Option     | Required | Description                                                                             |
| ---------- | -------- | --------------------------------------------------------------------------------------- |
| `location` | Yes      | `openshift://<api>[/<namespace>]`. Without a namespace, the whole cluster is backed up. |
| `labels`   | No       | Label selector. Only the resources matching it are backed up, for example `app=nginx`.  |

### Destination configuration

The following options are available to destination connectors using the
`openshift` protocol, in addition to those in [Cluster access](#cluster-access).

| Option             | Required | Description                                                                                                                                                                                                  |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `location`         | Yes      | `openshift://<api>[/<namespace>]`, the cluster or namespace to restore into.                                                                                                                                 |
| `ignore_resources` | No       | Semicolon-separated list of `group/Kind` to leave out of the restore, for example `apps/Deployment;route.openshift.io/Route;/ConfigMap`. Leave the group empty for the core group. Kinds are case-sensitive. |

### Example

Back up a namespace:

```bash
$ plakar at /var/backups backup openshift://api.example.com:6443/my-namespace
```

Back up the whole cluster:

```bash
$ plakar at /var/backups backup openshift://api.example.com:6443
```

Restore a snapshot into a namespace:

```bash
$ plakar at /var/backups restore -to openshift://api.example.com:6443/my-namespace <snapshot_id>
```

## 2. `openshift+csi` protocol

The `openshift+csi` protocol takes a CSI `VolumeSnapshot` of a PVC and reads the
volume from that snapshot, so the volume is captured at a single point in time.
The snapshot is deleted once the backup completes.

This protocol is available for backup only. Data backed up with `openshift+csi`
is restored with the [`openshift+pvc`](#3-openshiftpvc-protocol) protocol.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["OpenShift Cluster"]
  PVC["PVC"]
  Snap["VolumeSnapshot"]
  Mover["Data mover pod"]
  PVC --> Snap --> Mover
end

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Mover --> Plakar --> Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Source configuration

The following options are available to source connectors using the
`openshift+csi` protocol, in addition to those in
[Cluster access](#cluster-access) and
[How volume data is read and written](#how-volume-data-is-read-and-written).

| Option                  | Required | Description                                                    |
| ----------------------- | -------- | -------------------------------------------------------------- |
| `location`              | Yes      | `openshift+csi://<api>/<namespace>/<pvc>`, the PVC to back up. |
| `volume_snapshot_class` | Yes      | `VolumeSnapshotClass` used to snapshot the PVC.                |

### Example

Back up the `my-pvc` PVC in the `storage` namespace:

```bash
$ plakar at /var/backups backup \
  -o volume_snapshot_class=my-snapclass \
  openshift+csi://api.example.com:6443/storage/my-pvc
```

## 3. `openshift+pvc` protocol

The `openshift+pvc` protocol streams the contents of a PVC through the data
mover pod, reading the live volume directly. A restore writes into a new or an
existing PVC.

For backups, this protocol is a fallback for clusters where CSI snapshots are
not available. Use [`openshift+csi`](#2-openshiftcsi-protocol) whenever the
storage class supports `VolumeSnapshot`.

> [!WARNING]+ No point-in-time consistency
>
> An `openshift+pvc` backup reads files one after another while the workload
> keeps writing to the volume. Different files can therefore reflect different
> points in time. This is not safe for data that must be captured as a whole,
> such as the data directory of a database.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["OpenShift Cluster"]
  PVC["PVC"]
  Mover["Data mover pod"]
  PVC --> Mover
end

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Mover --> Plakar --> Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Transform["Decrypt & reconstruct"]

Plakar["Plakar"]

subgraph Destination["OpenShift Cluster"]
  Mover["Data mover pod"]
  PVC["New or existing PVC"]
  Mover --> PVC
end

Store --> Transform --> Plakar --> Mover
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following option applies to both source and destination connectors using the
`openshift+pvc` protocol, in addition to those in
[Cluster access](#cluster-access) and
[How volume data is read and written](#how-volume-data-is-read-and-written).

| Option     | Required | Description                                                                                                              |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `location` | Yes      | `openshift+pvc://<api>/<namespace>/<pvc>`. For a source, the PVC to back up. For a destination, the PVC to restore into. |

### Example

Restore a snapshot into the `pristine` PVC of the `storage` namespace:

```bash
$ plakar at /var/backups restore -to openshift+pvc://api.example.com:6443/storage/pristine <snapshot_id>
```

## 4. `openshift+vm` protocol

The `openshift+vm` protocol backs up and restores OpenShift Virtualization
virtual machines with their disks. The snapshot of the virtual machine is taken
by OpenShift Virtualization, so no `VolumeSnapshotClass` is needed. The disk
contents are then read through the data mover pod.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["OpenShift Cluster"]
  VM["Virtual machine"]
  Snap["OpenShift Virtualization<br/>snapshot"]
  Mover["Data mover pod"]
  VM --> Snap --> Mover
end

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Mover --> Plakar --> Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Transform["Decrypt & reconstruct"]

Plakar["Plakar"]

subgraph Destination["OpenShift Cluster"]
  Mover["Data mover pod"]
  VM["Virtual machine"]
  Mover --> VM
end

Store --> Transform --> Plakar --> Mover
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following option applies to both source and destination connectors using the
`openshift+vm` protocol, in addition to those in
[Cluster access](#cluster-access) and
[How volume data is read and written](#how-volume-data-is-read-and-written).

| Option     | Required | Description                                                                                                                               |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `location` | Yes      | `openshift+vm://<api>/<namespace>/<vm>`. For a source, the virtual machine to back up. For a destination, the virtual machine to restore. |

### Example

Back up the `my-vm` virtual machine in the `vms` namespace:

```bash
$ plakar at /var/backups backup openshift+vm://api.example.com:6443/vms/my-vm
```

Restore that virtual machine:

```bash
$ plakar at /var/backups restore -to openshift+vm://api.example.com:6443/vms/my-vm <snapshot_id>
```

## Disconnected clusters

A cluster that cannot reach `ghcr.io` cannot pull the image of the data mover
pod. The pod stays in `ImagePullBackOff` and the operation fails. The image has
to be made available from a registry the cluster can reach, either by setting
`kubelet_image` on each connector or by redirecting the pull for the whole
cluster.

Mirror the image to a reachable registry:

```bash
$ oc image mirror ghcr.io/plakarkorp/kubelet:<tag> registry.example.com/plakarkorp/kubelet:<tag>
```

Then either set `kubelet_image` to the mirrored image, or redirect the pull for
the whole cluster. The default image is referenced by tag, not by digest, so the
redirection needs an `ImageTagMirrorSet`. An `ImageDigestMirrorSet` or an
`ImageContentSourcePolicy` does not apply to it.

```yaml
apiVersion: config.openshift.io/v1
kind: ImageTagMirrorSet
metadata:
  name: plakar-kubelet
spec:
  imageTagMirrors:
    - source: ghcr.io/plakarkorp/kubelet
      mirrors:
        - registry.example.com/plakarkorp/kubelet
```

The cluster-wide mirror has to be updated whenever the default tag of the image
changes. Setting `kubelet_image` does not have this constraint.

The data mover pod sets no image pull secrets. If the mirror requires
credentials, add them to the global pull secret, `pull-secret` in the
`openshift-config` namespace, or link them to the `default` ServiceAccount of
the namespace:

```bash
$ oc secrets link default <pull-secret> --for=pull -n <namespace>
```

## See also

- [OpenShift inventory in Plakar Control Plane](/docs/control-plane/inventories/managed/openshift)
- [OpenShift PVC in Plakar Control Plane](/docs/control-plane/resources/block-storage/openshift-pvc)
- [OpenShift VM in Plakar Control Plane](/docs/control-plane/resources/compute/openshift/vm)
- [Kubernetes integration](../kubernetes)
- [OpenShift documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/)
- [Managing packages](../../guides/managing-packages)

