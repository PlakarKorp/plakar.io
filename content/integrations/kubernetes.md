---
title: Kubernetes

subtitle: Encrypted, deduplicated backups for clusters, manifests, and persistent volumes

description: >
  Protect your Kubernetes infrastructure at every level. Plakar backs up etcd for disaster recovery, manifests for granular inspection and restore, and persistent volumes via CSI snapshots. All encrypted, deduplicated, and portable across environments.

technology_title: Kubernetes is resilient by design, but not immune to data loss

technology_description: >
  Kubernetes is built for high availability, but availability is not the same as data protection. etcd can be lost. Manifests can be deleted or misconfigured. Persistent volumes hold stateful data that no cluster feature automatically protects.

  Plakar addresses each of these failure modes independently, giving you a layered backup strategy that covers the full lifecycle of a cluster.

categories:
  - source connector
  - destination connector

tags:
  - etcd
  - Containers
  - CSI
  - Persistent Volumes
  - On-Premise
  - EKS
  - GKE
  - AKS

seo_tags:
  - Kubernetes backup
  - etcd backup
  - persistent volume backup
  - CSI snapshot
  - disaster recovery
  - manifest backup
  - cluster restore
  - encrypted Kubernetes backup
  - cloud native backup
  - namespace restore

technical_documentation_link: /docs/main/integrations/kubernetes/

stage: beta

date: 2026-03-16

resource: Kubernetes

resource_type: orchestration

image: img/integrations/kubernetes.png
---

## Why protecting Kubernetes clusters matters

Kubernetes manages the full lifecycle of your workloads, but it does not protect the data that keeps those workloads running. Three distinct layers are at risk:

- **etcd**: The key-value store that holds all cluster state. If too many nodes fail simultaneously, etcd cannot recover on its own. Without an independent backup, the cluster configuration is gone.
- **Manifests**: Resource definitions, namespace configurations, and workload specs can be accidentally deleted, overwritten by bad deployments, or lost during a cluster migration. Kubernetes versioning does not give you a restore point.
- **Persistent Volumes**: Stateful workloads store data in PVCs that live outside the cluster's built-in resilience model. A misconfigured storage class, a deleted PVC, or a failed migration can result in permanent data loss.

Each layer requires a different backup strategy. Plakar handles all three.

## What happens when a cluster is compromised?

Kubernetes clusters are increasingly targeted by attackers who gain access through misconfigured RBAC, leaked credentials, or supply chain vulnerabilities. The consequences can be severe:

- **Total state loss**: With sufficient API access, an attacker can delete namespaces, wipe persistent volumes, and corrupt etcd — in seconds.
- **Ransomware on persistent storage**: PVCs attached to compromised pods can be encrypted or exfiltrated without any cluster-level protection.
- **No clean rollback**: Without independent snapshots stored outside the cluster, there is no verified state to recover from.

Plakar stores snapshots in an isolated Kloset, encrypted end-to-end and independent of the cluster itself. The backups remain intact even if the cluster is fully compromised.

## How Plakar protects your Kubernetes infrastructure

Plakar covers Kubernetes backups at three levels, each independent and composable:

- **etcd backup**: A full snapshot of cluster state, intended as the last line of defense in a catastrophic failure scenario.
- **Manifest backup**: All Kubernetes resources across the cluster (or scoped to a specific namespace) stored as a browsable, searchable Plakar snapshot. Restore the full cluster, a single namespace, or one deployment. Browse past snapshots to investigate what the cluster looked like at any point in time.
- **Persistent volume backup**: PVC contents captured via CSI driver snapshots, ingested into a Kloset store, and restorable into any PVC, on the same cluster or a different one.

Because Plakar connectors are composable, data is not locked to a single environment. A persistent volume backed up from one cluster can be restored to another, archived to S3, or exported as a portable ptar archive.
