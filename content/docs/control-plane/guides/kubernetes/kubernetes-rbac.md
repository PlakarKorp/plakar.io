---
title: "Kubernetes Service Accounts and RBAC"
date: "2026-09-30T00:00:00Z"
weight: 2
summary:
  "Create least-privilege Kubernetes service accounts for the Kubernetes
  integration and inventory."
---

# Kubernetes Service Accounts and RBAC

The [Kubernetes integration](/docs/community/main/integrations/kubernetes) and
the [Kubernetes inventory](../../infrastructure/inventories/kubernetes) operate
on a cluster using the permissions of the credentials they are given.

The Kubernetes integration provides several protocols, each backing up or
restoring a different kind of data:

- `k8s`: Kubernetes manifests and resource state. Backup and restore.
- `k8s+csi`: PVC contents, read from a CSI `VolumeSnapshot`. Backup only.
- `k8s+pvc`: PVC contents, read directly from the volume. Backup and restore.
- `k8s+vm`: KubeVirt virtual machines and their disks. Backup and restore.

See [Kubernetes PVC](../../resources/block-storage/pvc) for how the PVC
protocols are used in Plakar Control Plane.

The required permissions depend on the operation. This guide provides a separate
**Role** or **ClusterRole** and **ServiceAccount** for each operation. Apply
only the roles required by your deployment.

Keeping the ServiceAccounts separate limits the impact of each operation. For
example, a backup ServiceAccount cannot modify the cluster, while the inventory
ServiceAccount can discover PVCs without accessing their contents.

> [!WARNING]
>
> Do not grant all of these roles to the same ServiceAccount. A ServiceAccount
> with every role described in this guide has permissions equivalent to a
> cluster administrator.

## Roles overview

| Operation              | ServiceAccount             | Scope                                    |
| ---------------------- | -------------------------- | ---------------------------------------- |
| PVC backup and restore | `plakar-pvc`               | Namespaced                               |
| Port forwarding        | Shared                     | Namespaced                               |
| VM backup              | `plakar-vm-backup`         | Namespaced                               |
| VM restore             | `plakar-vm-restore`        | Namespaced, write                        |
| Manifest backup        | `plakar-resources-backup`  | Cluster-wide read, **including Secrets** |
| Manifest restore       | `plakar-resources-restore` | Cluster-wide write                       |
| Inventory              | `plakar-inventory`         | Cluster-wide read of PVCs only           |

The manifests use two placeholders:

- `plakar`: the namespace containing the ServiceAccounts. For in-cluster
  deployments, this is the namespace where Plakar runs.
- `target-namespace`: the namespace containing the resources to back up or
  restore. Namespaced roles must be created once for each target namespace.

Create the `plakar` namespace first:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: plakar
```

## PVC backup and restore

This role covers the `k8s+csi` and `k8s+pvc` protocols. It is the smallest role
and is the only role required when backing up volumes.

The connectors read the target PVC and start a temporary pod that serves the
volume over mTLS. Plakar reads the pod log to obtain the public key used to
connect to the pod.

The `k8s+csi` protocol also creates a `VolumeSnapshot` and a temporary PVC
cloned from that snapshot. If you only use `k8s+pvc`, remove the
`volumesnapshots` rule and the `create` and `delete` verbs from the
`persistentvolumeclaims` rule.

Read access to events is optional. It improves error messages when a pod does
not become ready, for example when a PVC does not bind.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: plakar-pvc
  namespace: plakar
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: plakar-pvc
  namespace: target-namespace
rules:
  - apiGroups: [""]
    resources: ["persistentvolumeclaims"]
    verbs: ["get", "create", "delete"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["create", "get", "list", "watch", "delete"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]
  - apiGroups: ["snapshot.storage.k8s.io"]
    resources: ["volumesnapshots"]
    verbs: ["create", "get", "list", "watch", "delete"]
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: plakar-pvc
  namespace: target-namespace
subjects:
  - kind: ServiceAccount
    name: plakar-pvc
    namespace: plakar
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: plakar-pvc
```

## Port forwarding

When Plakar runs outside the cluster using a kubeconfig, it reaches the
temporary pod through the API server's port-forwarding subresource.

When Plakar runs inside the cluster, it connects to the pod directly and does
not require this role.

The role is shared by the ServiceAccounts used by operations that start
temporary serving pods: PVC backup and restore, and VM backup and restore. Keep
only the ServiceAccounts you actually use in the RoleBinding.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: plakar-pvc-portforward
  namespace: target-namespace
rules:
  - apiGroups: [""]
    resources: ["pods/portforward"]
    verbs: ["create"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: plakar-pvc-portforward
  namespace: target-namespace
subjects:
  - kind: ServiceAccount
    name: plakar-pvc
    namespace: plakar
  - kind: ServiceAccount
    name: plakar-vm-backup
    namespace: plakar
  - kind: ServiceAccount
    name: plakar-vm-restore
    namespace: plakar
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: plakar-pvc-portforward
```

## VM backup

This role is used by the `k8s+vm` protocol when backing up KubeVirt virtual
machines. The cluster must support KubeVirt snapshots.

The backup creates a `VirtualMachineSnapshot`. The KubeVirt controller handles
the guest-side snapshot operation: it freezes the guest, creates a
`VolumeSnapshot` for each disk, and thaws the guest again.

Plakar then reads each disk through a temporary PVC and pod, in the same way as
a PVC backup. The virtual machine itself is only read.

The `VirtualMachineSnapshot` and the underlying `VolumeSnapshot` resources are
created by KubeVirt using its own credentials. The Plakar ServiceAccount only
needs permission to create and read the `VirtualMachineSnapshot`, and to read
the resulting `VolumeSnapshot` resources.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: plakar-vm-backup
  namespace: plakar
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: plakar-vm-backup
  namespace: target-namespace
rules:
  - apiGroups: ["kubevirt.io"]
    resources: ["virtualmachines"]
    verbs: ["get"]
  - apiGroups: ["snapshot.kubevirt.io"]
    resources: ["virtualmachinesnapshots"]
    verbs: ["create", "get", "list", "watch", "delete"]
  - apiGroups: ["snapshot.kubevirt.io"]
    resources: ["virtualmachinesnapshotcontents"]
    verbs: ["get"]
  - apiGroups: ["snapshot.storage.k8s.io"]
    resources: ["volumesnapshots"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["persistentvolumeclaims"]
    verbs: ["create", "get", "delete"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["create", "get", "list", "watch", "delete"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: plakar-vm-backup
  namespace: target-namespace
subjects:
  - kind: ServiceAccount
    name: plakar-vm-backup
    namespace: plakar
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: plakar-vm-backup
```

## VM restore

This role is used by the `k8s+vm` protocol when restoring a virtual machine.

The restore recreates each disk, streams the disk contents through a temporary
pod, and applies the virtual machine manifest last.

The role is namespaced and only grants access to virtual machines and PVCs,
along with the temporary pods required to transfer the disk data. It still
grants write access to a virtual machine and therefore to whatever runs inside
that virtual machine. Keep it separate from the ServiceAccount used for backups.

A restore does not delete an existing PVC. It applies the restored configuration
over the existing claim.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: plakar-vm-restore
  namespace: plakar
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: plakar-vm-restore
  namespace: target-namespace
rules:
  - apiGroups: ["kubevirt.io"]
    resources: ["virtualmachines"]
    verbs: ["get", "create", "patch"]
  - apiGroups: [""]
    resources: ["persistentvolumeclaims"]
    verbs: ["get", "create", "patch"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["create", "get", "list", "watch", "delete"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: plakar-vm-restore
  namespace: target-namespace
subjects:
  - kind: ServiceAccount
    name: plakar-vm-restore
    namespace: plakar
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: plakar-vm-restore
```

## Manifest backup

> [!WARNING]+
>
> A manifest backup lists every resource type the cluster exposes, including
> Secrets. Anyone who can run a backup using this ServiceAccount can read every
> Secret in the cluster. Anyone who can read the resulting snapshot can also
> access those Secrets.

This role is used by the `k8s` protocol. It grants cluster-wide read access to
Kubernetes resources.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: plakar-resources-backup
  namespace: plakar
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: plakar-resources-backup
rules:
  - apiGroups: ["*"]
    resources: ["*"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: plakar-resources-backup
subjects:
  - kind: ServiceAccount
    name: plakar-resources-backup
    namespace: plakar
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: plakar-resources-backup
```

## Manifest restore

This role is used by the `k8s` protocol when restoring manifests.

A restore can apply any resource kind stored in the snapshot, so the role grants
cluster-wide write access. Keep it on a separate ServiceAccount from manifest
backups. A scheduled backup does not require this role.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: plakar-resources-restore
  namespace: plakar
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: plakar-resources-restore
rules:
  - apiGroups: ["*"]
    resources: ["*"]
    verbs: ["get", "list", "create", "patch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: plakar-resources-restore
subjects:
  - kind: ServiceAccount
    name: plakar-resources-restore
    namespace: plakar
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: plakar-resources-restore
```

## Inventory

This role is used by the
[Kubernetes inventory](../../infrastructure/inventories/kubernetes) to discover
PVCs across all namespaces.

It only reads PVC metadata and never accesses the contents of the volumes. It
also reads the `kube-system` namespace, whose UID is used to identify the
cluster.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: plakar-inventory
  namespace: plakar
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: plakar-inventory
rules:
  - apiGroups: [""]
    resources: ["persistentvolumeclaims"]
    verbs: ["get", "list"]
  - apiGroups: [""]
    resources: ["namespaces"]
    resourceNames: ["kube-system"]
    verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: plakar-inventory
subjects:
  - kind: ServiceAccount
    name: plakar-inventory
    namespace: plakar
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: plakar-inventory
```
