
## Why protecting OpenShift matters

An OpenShift cluster runs many applications, each made of manifests, persistent
volumes and, with OpenShift Virtualization, virtual machines. The cluster keeps
them running, but it does not keep a copy of them anywhere else.

- **Configuration spread across namespaces**: deployments, routes, secrets and
  config maps live in many namespaces, and are easy to lose track of.
- **Volume data lives in the cluster**: persistent volumes and their snapshots
  sit on the cluster's own storage, so they are lost along with it.
- **No independent recovery path**: without a copy stored outside the cluster,
  there is nothing to restore from if a namespace, a volume or a virtual machine
  is lost, corrupted or deliberately destroyed.

## Security and Compromise

Access to an OpenShift cluster is controlled by the credentials and roles
granted to users and service accounts. If a credential leaks or its roles are
too broad:

- **Cluster-wide impact**: an attacker with cluster access can affect every
  namespace, volume and virtual machine at once.
- **Data loss at the workload level**: manifests can be deleted and volumes
  encrypted or wiped together with the snapshots stored next to them.
- **No recovery without a backup**: without a backup stored independently of the
  cluster, there is no way to undo the damage, only to rebuild from scratch.

Plakar mitigates this by keeping OpenShift backups encrypted end-to-end and
stored outside the cluster, so a compromised cluster does not put its own backup
history at risk.

## How Plakar protects your OpenShift environment

Plakar integrates with OpenShift in three ways:

- **Inventory**: connect to a cluster and discover its namespaces, its
  PersistentVolumeClaims and its OpenShift Virtualization virtual machines.
- **Source connector**: capture the manifests of a namespace or of the whole
  cluster, the contents of a PVC, or a virtual machine with its disks, and store
  them in an encrypted, deduplicated Kloset.
- **Destination connector**: restore manifests, volume data or virtual machines
  to the same cluster or another one, leaving out the objects OpenShift
  recreates on its own.

Instead of relying on copies kept inside the cluster, Plakar gives you an
independent, verifiable and encrypted backup history for the OpenShift workloads
your business runs on.

