---
title: "Kubernetes Cluster"
date: "2026-10-26T00:00:00Z"
weight: 1
summary:
  "How to back up and restore the manifests of a Kubernetes cluster or namespace
  in Plakar Control Plane."
---

# Kubernetes Cluster

Kubernetes Cluster resources represent the manifests of a Kubernetes cluster,
either the whole cluster or a single namespace. The Kubernetes integration backs
them up and restores them through the `k8s` protocol.

These resources hold the configuration of the cluster only. The contents of
persistent volumes and virtual machine disks are not part of their backups, and
are backed up through [Kubernetes PVC](../../block-storage/pvc) and
[Kubernetes VM](vm) resources.

A backup reads the manifests of the resources in the namespace, or in every
namespace for the `cluster` resource, along with their status, and stores them
in the Kloset store. Browsing a restore point shows the state of deployments,
nodes and other resources at the time of the backup. A restore applies the
manifests to the cluster again.

The kubeconfig used by the app must grant the permissions required by the
operation. Source apps use the
[manifest backup role](../../../guides/kubernetes/kubernetes-rbac#manifest-backup)
and destination apps use the
[manifest restore role](../../../guides/kubernetes/kubernetes-rbac#manifest-restore).

## Inventory Management

[Managed inventories](../../../inventories#managed-inventories) discover the
`cluster` resource and one resource per namespace once the
[Kubernetes inventory](../../../inventories/managed/kubernetes) is connected to
a cluster. The `cluster` resource is listed when the inventory discovers every
namespace.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph K8s["Kubernetes Cluster"]
    API["API Server"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["Kubernetes Cluster<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"reads manifests"| API
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
    Destination["Kubernetes Cluster<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph K8s["Kubernetes Cluster"]
    API["API Server"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"applies manifests"| API
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared Configuration

The following setting is available when configuring both source and destination
apps.

- **Kubeconfig**: Paste the contents of a kubeconfig. Leave it empty when Plakar
  Control Plane runs inside the cluster to use the in-cluster configuration. The
  kubeconfig can also be loaded from a
  [secret provider](../../../secret-providers).

## Source Configuration

The following setting is only available when configuring source apps.

- **Labels**: Optional. A label selector restricting the resources backed up,
  for example `app=nginx`.

## Destination Configuration

The following setting is only available when configuring destination apps.

- **Ignore Resources**: Optional. A semicolon-separated list of `group/Kind` to
  leave out of the restore, for example
  `apps/Deployment;cert-manager.io/Certificate;/ConfigMap`. Leave the group
  empty for the core group. Kinds are case-sensitive.
