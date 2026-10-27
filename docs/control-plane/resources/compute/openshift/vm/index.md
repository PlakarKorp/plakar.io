
# OpenShift VM

OpenShift VM resources represent the OpenShift Virtualization virtual machines
of an OpenShift cluster. The OpenShift integration backs them up and restores
them, with their disks, through the `openshift+vm` protocol.

The snapshot of the virtual machine is taken by OpenShift Virtualization, so no
`VolumeSnapshotClass` needs to be configured. The disk contents are then read,
and written back on restore, through a data mover pod started in the namespace
of the virtual machine and deleted when the operation ends. The pod pulls its
image from `ghcr.io/plakarkorp/kubelet` by default. A cluster that cannot reach
`ghcr.io` needs the image from another registry, set with **Kubelet Image**. See
[disconnected clusters](/docs/community/main/integrations/openshift/#disconnected-clusters)
for how to mirror it.

The kubeconfig used by the app must grant the permissions required by the
operation. The roles in the Kubernetes RBAC guide apply to OpenShift as well.
Source apps use the
[VM backup role](../../../guides/kubernetes/kubernetes-rbac#vm-backup) and
destination apps use the
[VM restore role](../../../guides/kubernetes/kubernetes-rbac#vm-restore). When
Plakar runs outside the cluster, both also need the
[port forwarding role](../../../guides/kubernetes/kubernetes-rbac#port-forwarding).

## Inventory Management

[Managed inventories](../../../inventories#managed-inventories) discover virtual
machines automatically once the
[OpenShift inventory](../../../inventories/managed/openshift) is connected to a
cluster with OpenShift Virtualization installed.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph OpenShift["OpenShift Cluster"]
    VM["Virtual machine"]
    Snap["OpenShift Virtualization<br/>snapshot"]
    Mover["Data mover pod"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["OpenShift VM<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  VM --> Snap
  Snap --> Mover
  Mover -->|"reads disk data"| Source
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
    Destination["OpenShift VM<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph OpenShift["OpenShift Cluster"]
    Mover["Data mover pod"]
    VM["Restored<br/>virtual machine"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"writes via"| Mover
  Mover --> VM
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared Configuration

The following settings are available when configuring both source and
destination apps.

- **Kubeconfig**: Paste the contents of a kubeconfig. Leave it empty when Plakar
  Control Plane runs inside the cluster to use the in-cluster credentials. The
  kubeconfig can also be loaded from a
  [secret provider](../../../secret-providers).
- **Kubelet Image**: Optional. The image of the data mover pod. Set it to pull
  the image from a registry the cluster can reach.
- **Node Affinity**: Optional. Node affinity of the data mover pod, as the YAML
  or JSON body of a pod's `spec.affinity.nodeAffinity`.

