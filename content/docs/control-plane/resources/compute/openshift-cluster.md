---
title: "OpenShift Cluster"
date: "2026-10-26T00:00:00Z"
weight: 7
summary:
  "How to back up and restore the manifests of an OpenShift cluster or namespace
  in Plakar Control Plane."
---

# OpenShift Cluster

OpenShift Cluster resources represent the manifests of an OpenShift cluster,
either the whole cluster or a single namespace. The OpenShift integration backs
them up and restores them through the `openshift` protocol.

A backup reads the manifests of the resources in the namespace, or in every
namespace for the `cluster` resource, and stores them in the Kloset store. A
restore applies them to the cluster again, leaving out the objects OpenShift
recreates on its own:

- `Build` and `ImageTag` objects.
- Build pods and the config maps generated for them.
- Serving certificate secrets issued by the service CA operator, which are
  issued again for the restored services.
- The role bindings OpenShift creates in every namespace, such as
  `system:image-pullers`, `system:image-builders` and `system:deployers`.
- OADP non-admin objects.

The kubeconfig used by the app must grant the permissions required by the
operation. The roles in the Kubernetes RBAC guide apply to OpenShift as well.
Source apps use the
[manifest backup role](../../../guides/kubernetes/kubernetes-rbac#manifest-backup)
and destination apps use the
[manifest restore role](../../../guides/kubernetes/kubernetes-rbac#manifest-restore).

## Inventory Management

[Managed inventories](../../inventories#managed-inventories) discover the
`cluster` resource and one resource per namespace once the
[OpenShift inventory](../../inventories/managed/openshift) is connected to a
cluster.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph OpenShift["OpenShift Cluster"]
    API["API Server"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["OpenShift Cluster<br/>Source app"]
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
    Destination["OpenShift Cluster<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph OpenShift["OpenShift Cluster"]
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
  Control Plane runs inside the cluster to use the in-cluster credentials. The
  kubeconfig can also be loaded from a
  [secret provider](../../secret-providers).

## Source Configuration

The following setting is only available when configuring source apps.

- **Labels**: Optional. A label selector restricting the resources backed up,
  for example `app=nginx`.

## Destination Configuration

The following setting is only available when configuring destination apps.

- **Ignore Resources**: Optional. A semicolon-separated list of `group/Kind` to
  leave out of the restore, for example
  `apps/Deployment;route.openshift.io/Route;/ConfigMap`. Leave the group empty
  for the core group. Kinds are case-sensitive.
