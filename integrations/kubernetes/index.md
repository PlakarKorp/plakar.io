
## Why protecting Kubernetes clusters matters

Kubernetes manages the full lifecycle of your workloads, but it does not protect
the data that keeps those workloads running. Three distinct layers are at risk:

- **etcd**: The key-value store that holds all cluster state. If too many nodes
  fail simultaneously, etcd cannot recover on its own. Without an independent
  backup, the cluster configuration is gone.
- **Manifests**: Resource definitions, namespace configurations, and workload
  specs can be accidentally deleted, overwritten by bad deployments, or lost
  during a cluster migration. Kubernetes versioning does not give you a restore
  point.
- **Persistent Volumes**: Stateful workloads store data in PVCs that live
  outside the cluster's built-in resilience model. A misconfigured storage
  class, a deleted PVC, or a failed migration can result in permanent data loss.

Each layer requires a different backup strategy. Plakar handles all three, and
keeps track of what's protected across the cluster as it evolves.

## What happens when a cluster is compromised?

Kubernetes clusters are increasingly targeted by attackers who gain access
through misconfigured RBAC, leaked credentials, or supply chain vulnerabilities.
The consequences can be severe:

- **Total state loss**: With sufficient API access, an attacker can delete
  namespaces, wipe persistent volumes, and corrupt etcd in seconds.
- **Ransomware on persistent storage**: PVCs attached to compromised pods can be
  encrypted or exfiltrated without any cluster-level protection.
- **No clean rollback**: Without independent snapshots stored outside the
  cluster, there is no verified state to recover from.

Plakar stores snapshots in an isolated Kloset, encrypted end-to-end and
independent of the cluster itself. The backups remain intact even if the cluster
is fully compromised.

## How Plakar protects your Kubernetes infrastructure

Plakar integrates with Kubernetes in three ways:

- **Inventory**: connect to a cluster and automatically discover its resources,
  keeping track of what exists and what's already protected as the cluster
  changes.
- **Source Connector**: capture encrypted, deduplicated backups at three
  independent levels — a full etcd snapshot as the last line of defense in a
  catastrophic failure, manifest backups covering all resources across the
  cluster or scoped to a namespace, and persistent volume contents captured
  through CSI driver snapshots.
- **Destination Connector**: restore what you backed up, whether that's the full
  cluster state, a single namespace, one deployment, or a persistent volume,
  back onto the original cluster or a different one entirely.

Manifest backups are browsable and searchable as ordinary Plakar snapshots, so
you can inspect what the cluster looked like at any point in time before
deciding what to restore.

Because Plakar connectors are composable, data is not locked to a single
environment. A persistent volume backed up from one cluster can be restored to
another, archived to S3, or exported as a portable ptar archive.

