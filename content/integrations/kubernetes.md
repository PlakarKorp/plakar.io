---
title: Kubernetes

seo_title: Free, Open-Source Kubernetes Backup and Restore

subtitle: Free, open-source Kubernetes backup

description: >
  Free, open-source Kubernetes backup: objects, PVC data and KubeVirt VMs in
  encrypted snapshots. Restore a deleted namespace, one kind or a single object.

technology_title: Git holds your Kubernetes manifests, not your cluster

technology_description: >
  A GitOps repository rebuilds the Deployments, Services and ConfigMaps it
  describes. It does not hold the Secrets kept out of Git, the objects that
  operators and controllers create at run time, or the data written to
  PersistentVolumeClaims. After a deleted namespace or a lost cluster, those are
  what is missing.

  Plakar reads the cluster through the Kubernetes API and keeps it as it ran:
  every object with its status, Secrets included, the contents of the volumes
  and KubeVirt VMs. The snapshots are encrypted and deduplicated, in a store you
  choose, ready to restore into the same cluster or another one.
technology_image: img/integrations/technology/kubernetes.svg

categories:
  - source
  - destination
  - inventory

seo_tags:
  - Kubernetes backup
  - restore deleted Kubernetes namespace
  - Kubernetes PVC backup
  - KubeVirt VM backup
  - open source Kubernetes backup
  - back up Kubernetes namespace
  - CSI VolumeSnapshot backup
  - restore namespace to another namespace

links:
  - type: community
    url: /docs/community/main/integrations/kubernetes/
  - type: control-plane
    url: /docs/control-plane/inventories/managed/kubernetes/
  - type: custom
    label: "Blog: Backing up kubernetes clusters with Plakar"
    url: /posts/2026-02-18/backing-up-kubernetes-clusters-with-plakar/
    icon: ri/article-line

related:
  - openshift
  - etcd
  - postgres
  - vmware

edition:
  - community
  - control-plane

stage: stable

author:
  - type: official
    name: Plakar

date: 2026-05-16

resource: Kubernetes

image: img/integrations/kubernetes.png
---

## What the Kubernetes integration does {kicker="Overview"}

{{< columns ratio="7:5" sticky="right" >}}

{{< column >}}

The Kubernetes integration backs up the objects of a cluster or a namespace, the
contents of PersistentVolumeClaims and KubeVirt virtual machines into encrypted,
deduplicated Plakar snapshots. It restores a whole snapshot, one namespace, one
kind or a single object, into the original namespace or another one, on the same
cluster or a new one. Plakar reaches the API server with a kubeconfig, from any
host or from a pod running in the cluster, with the free, open-source CLI or
with Plakar Control Plane.

The `k8s` protocol discovers every resource type the API server lists, custom
resources included, and stores each object as YAML with its status. Volume data
goes through `k8s+csi`, which copies a CSI VolumeSnapshot, or `k8s+pvc`, which
reads a live claim. `k8s+vm` backs up a KubeVirt VM with its disks.

{{< /column >}}

{{< column >}}

```console {title="backup-host"}
$ plakar pkg add k8s
$ plakar at /var/backups backup k8s:/payments
82dd786f: OK ✓ /payments/apps/Deployment/v1/api.yaml
82dd786f: OK ✓ /payments/_/Secret/v1/stripe.yaml
82dd786f: OK ✓ /payments
82dd786f: backup completed without errors in 4.299s (in: 24 KiB, out: 5.2 MiB)
$ plakar at /var/backups ls
2026-11-15T02:00:04Z   82dd786f    82 KiB        4s /payments
2026-11-14T02:00:03Z   0e61aa12    62 KiB        4s /payments
$
```

{{< /column >}}

{{< /columns >}}

## Why use Plakar for Kubernetes backup {kicker="Why Plakar"}

{{< cards cols="3" style="ruled" >}}

{{< card label="snapshot:/payments/apps/Deployment" >}}

### Restore one Kubernetes object, kind or namespace

Each object sits in the snapshot under its namespace, API group, kind and
version. Give `plakar restore` the path you need, from the whole cluster down to
one Secret, and Plakar applies it with server-side apply, creating what is
missing and updating what exists.

{{< /card >}}

{{< card label="nothing installed in the cluster" >}}

### Kubernetes objects read through the API server

Plakar is a client of the Kubernetes API, like `kubectl`. Backing up objects
adds no operator, CRD or DaemonSet to the cluster. Volume and VM backups start a
helper pod for the length of the operation and remove it afterwards.

{{< /card >}}

{{< card label="plakar diff -recursive" >}}

### Compare two Kubernetes snapshots object by object

`plakar diff -recursive` between last night's snapshot and one taken after a
release lists the objects added or removed, and prints a YAML diff for each
object that changed, such as a Deployment going from `replicas: 2` to
`replicas: 3`.

{{< /card >}}

{{< /cards >}}

## How to restore a deleted Kubernetes namespace {kicker="Deleted namespace"}

{{< columns ratio="5:7" sticky="right" >}}

{{< column >}}

`kubectl delete namespace payments` removes the Deployments, Services,
ConfigMaps, Secrets and PersistentVolumeClaims of `payments`. Volumes
provisioned by a StorageClass whose `reclaimPolicy` was left unset follow the
default, `Delete`, and the storage provider removes the disks. The Events that
would explain the incident expire after one hour, the API server's default
`--event-ttl` of `1h0m0s`.

A namespace backup holds the namespaced objects, not the `Namespace` object
itself, so name the namespace in the destination and Plakar creates it.

{{< steps >}}

{{< step >}}

**Pick the snapshot.** `plakar ls` lists the snapshots with their date and ID.
Take the last one before the deletion.

{{< /step >}}

{{< step >}}

**Check it under another name.** Restore into `payments-check` and compare it
with what you expect. Cluster-scoped objects stay out of a restore into a named
namespace.

{{< /step >}}

{{< step >}}

**Restore the namespace.** `-to k8s:/payments` creates the namespace and applies
its objects. Controllers rebuild the ReplicaSets and Pods that their Deployments
and StatefulSets own.

{{< /step >}}

{{< step >}}

**Refill the volumes.** Scale the workload to zero, write each volume snapshot
into its recreated claim with `k8s+pvc`, then scale it back up.

{{< /step >}}

{{< /steps >}}

{{< /column >}}

{{< column >}}

```console {title="backup-host"}
$ plakar at /var/backups ls
2026-11-15T02:00:31Z   f2d6b49c   282 KiB       22s /
2026-11-15T02:00:04Z   82dd786f    82 KiB        4s /payments
$ plakar at /var/backups restore \
    -to k8s:/payments-check 82dd786f:/payments
$ kubectl -n payments-check get deploy,svc,cm,secret,pvc
$ plakar at /var/backups restore \
    -to k8s:/payments 82dd786f:/payments
$ kubectl -n payments scale deploy/api --replicas=0
$ plakar at /var/backups restore \
    -to k8s+pvc:/payments/pgdata f2d6b49c:
$ kubectl -n payments scale deploy/api --replicas=2
$ kubectl delete namespace payments-check
```

{{< /column >}}

{{< /columns >}}

## Kubernetes backup and recovery scenarios {kicker="Recovery scenarios"}

{{< cards cols="2" style="accent" >}}

{{< card label="kubectl delete secret -l tier=legacy" >}}

### An AI agent deletes Kubernetes Secrets it thought were unused

An SRE agent working with the operator's cluster-admin kubeconfig is asked to
clean up `checkout`. Its label selector also matches `stripe`, the Secret that
holds the payment key. Take a `plakar backup` before the session, with the store
and its passphrase kept out of the agent's environment. Afterwards,
`plakar diff -recursive` between the two snapshots shows every object the
session touched, and `<snap>:/checkout/_/Secret/v1/stripe.yaml` restores that
Secret alone, leaving the rest of the agent's work in place.

{{< /card >}}

{{< card label="ERROR: invalid page in block" >}}

### A Kubernetes PVC corrupted by a failed migration

A schema migration crashes halfway and PostgreSQL in `billing` reports invalid
pages on `pgdata`. The CSI VolumeSnapshots taken by the storage driver live on
the same array as the damaged volume. The nightly `k8s+csi` snapshot holds a
point-in-time copy in the Plakar store. Create `pgdata-restored`, write the copy
into it with `k8s+pvc`, and point the StatefulSet at it once PostgreSQL starts
cleanly.

{{< /card >}}

{{< card label="ignore_resources" >}}

### A Kubernetes cluster rebuilt after a failed upgrade

A control plane upgrade leaves the API server unable to start, and the team
builds a fresh cluster. Restore the last cluster-wide snapshot to it with
`-to k8s:`, and list in `ignore_resources` the kinds the new cluster provisions
on its own, such as `cert-manager.io/Certificate`. Nodes, PersistentVolumes and
Events are never replayed, so the new cluster keeps its own.

{{< /card >}}

{{< card label="k8s+vm:/ci/runner-01" >}}

### A KubeVirt VM that stops booting after a guest update

`runner-01`, a CI runner VM in namespace `ci`, hangs at boot after a kernel
update inside the guest. Last night's `k8s+vm` snapshot holds the VM definition
and its disks. `plakar restore -to k8s+vm: <snapshot_id>` writes them back, and
the runner picks up jobs again.

{{< /card >}}

{{< /cards >}}

## Kubernetes backup methods: objects, PVCs and KubeVirt VMs {kicker="Protocols"}

{{< cards cols="2" style="boxed" >}}

{{< card label="k8s" >}}

### Kubernetes objects of a cluster or a namespace

`k8s:/` backs up every namespace, `k8s:/payments` one of them, and `labels`
narrows it to a label selector. On restore, `ignore_resources` leaves out kinds
given as `group/Kind`.

```bash
plakar source add shop k8s:/shop \
  labels=app=web
```

{{< /card >}}

{{< card label="k8s+csi" >}}

### Kubernetes PVC backup from a CSI snapshot

Plakar asks the CSI driver for a VolumeSnapshot, reads it through a helper pod
and deletes it once the data is in the store. The application keeps running and
the copy is point-in-time. Restores go through `k8s+pvc`.

```bash
plakar source add pgdata k8s+csi:/billing/pgdata \
  volume_snapshot_class=csi-snapclass
```

{{< /card >}}

{{< card label="k8s+pvc" >}}

### Any Kubernetes PVC, with or without CSI snapshots

A helper pod mounts the claim and Plakar reads its files, on any StorageClass.
It is also the protocol that writes volume data back, into a new or an existing
claim.

```bash
plakar source add uploads k8s+pvc:/web/uploads
```

{{< /card >}}

{{< card label="k8s+vm" >}}

### KubeVirt virtual machine backup

KubeVirt takes the VM snapshot, so Plakar needs no VolumeSnapshotClass. The
helper pod ingests the disks, and a restore brings back the VM with them.

```bash
plakar source add runner k8s+vm:/ci/runner-01
```

{{< /card >}}

{{< /cards >}}

Set `kubelet_image` to pull the helper pod's image from a mirror in a cluster
without internet access, and `node_affinity` to place the pod on chosen nodes.

## What a Kubernetes backup snapshot contains {kicker="Inside a snapshot"}

{{< columns ratio="5:7" >}}

{{< column >}}

A `k8s` snapshot is a tree of YAML files: namespace, API group, kind, version,
then one file per object. `_` stands for the core API group, and for the
cluster-scoped objects of a cluster-wide backup. Each file is the object as the
API server returned it, status included, so `plakar cat` shows the replica count
and conditions of a Deployment at backup time.

Secrets are stored like any other object, inside the encrypted snapshot. Objects
that RBAC does not let Plakar read are recorded as errors in the snapshot, so a
missing permission shows up in the backup output.

{{< /column >}}

{{< column >}}

```tree
82dd786f:/payments
├── _
│   ├── ConfigMap/v1
│   │   ├── api-config.yaml
│   │   └── feature-flags.yaml
│   ├── PersistentVolumeClaim/v1
│   │   └── pgdata.yaml
│   ├── Secret/v1
│   │   └── stripe.yaml
│   └── Service/v1
│       └── api.yaml
├── apps
│   ├── Deployment/v1
│   │   └── api.yaml
│   └── ReplicaSet/v1
│       └── api-654f75d7cb.yaml
└── discovery.k8s.io
    └── EndpointSlice/v1
        └── api-q5lfw.yaml
```

{{< /column >}}

{{< /columns >}}

## Kubernetes backup tools compared: Plakar, backup suites, operators and GitOps {kicker="Comparison"}

Kubernetes clusters are usually protected by an enterprise backup suite, an
open-source backup operator installed in the cluster, or a GitOps repository
next to CSI snapshots.

|                                                     | Plakar                                                                                                                                           | Enterprise backup suites           | Open-source backup operators                  | GitOps repository and CSI snapshots       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- | --------------------------------------------- | ----------------------------------------- |
| Nothing installed in the cluster to back up objects | ✓ Plakar reads the API server from any host                                                                                                      | ◐ Depends on the product           | ✗ An operator and its CRDs run in the cluster | ✗ A GitOps controller runs in the cluster |
| One object restored by its name                     | ✓ A restore of its path in the snapshot                                                                                                          | ◐ Depends on the product           | ◐ Depends on the product                      | ◐ Objects kept in Git                     |
| Secrets in the backup, encrypted                    | ✓ Inside the encrypted snapshot                                                                                                                  | ✓                                  | ◐ Depends on the product                      | ✗ Secrets usually kept out of Git         |
| Volume data copied off the storage backend          | ✓ `k8s+csi` and `k8s+pvc` write it to the store                                                                                                  | ✓                                  | ✓ Through a data mover or a job per volume    | ✗ Snapshots stay on the storage backend   |
| Object-by-object diff of two backups                | ✓ `plakar diff -recursive`                                                                                                                       | ✗ No diff between backups          | ✗ No diff between backups                     | ◐ `git diff` of the desired state         |
| Kubernetes and the rest of the stack with one tool  | ✓ One CLI and one store for clusters, [PostgreSQL](/integrations/postgres/), [etcd](/integrations/etcd/) and [VMware](/integrations/vmware/) VMs | ✓ The workloads the suite supports | ✗ Kubernetes only                             | ✗ Kubernetes only                         |
| Free and open source                                | ✓ The CLI                                                                                                                                        | ✗ Commercial licence               | ◐ Depends on the product                      | ✓                                         |

## How to back up Kubernetes with the open-source Plakar CLI {kicker="Quickstart"}

{{< columns ratio="5:7" >}}

{{< column >}}

Install the `k8s` package in the free, open-source Plakar CLI, create a store
outside the cluster, and back up the namespaces and volumes you need. Plakar
uses `~/.kube/config` unless a source sets its own `kubeconfig`, and the
ServiceAccount of its pod when it runs in the cluster. Run the backups from
cron, a systemd timer or a Kubernetes CronJob.

The
[Kubernetes CLI documentation](/docs/community/main/integrations/kubernetes/)
lists every protocol, option and RBAC permission.

{{< /column >}}

{{< column >}}

```console {title="backup-host"}
$ plakar pkg add k8s
$ plakar at /var/backups create

$ plakar at /var/backups backup k8s:/
$ plakar at /var/backups backup \
    -o volume_snapshot_class=csi-snapclass \
    k8s+csi:/billing/pgdata
$ plakar at /var/backups check

$ plakar destination add billing-new k8s:/billing-new \
    ignore_resources=cert-manager.io/Certificate
$ plakar at /var/backups restore \
    -to "@billing-new" <snapshot_id>:/billing
```

{{< /column >}}

{{< /columns >}}

## Kubernetes backups across a fleet with Plakar Control Plane {kicker="Control Plane"}

{{< columns ratio="5:7" sticky="left" >}}

{{< column >}}

When clusters multiply across teams and environments, Plakar Control Plane keeps
track of what each one runs and schedules its backups from one place. A
namespace created next week is discovered at the next sync and backed up by the
policy that matches it, with nobody adding a cron entry.

[See how Plakar Control Plane works](/solutions/control-plane/), read the
[Control Plane Kubernetes inventory documentation](/docs/control-plane/inventories/managed/kubernetes/),
or [contact us](/contact/) to plan a deployment.

{{< /column >}}

{{< column >}}

{{< steps >}}

{{< step >}}

**Connect the cluster.** Create a Kubernetes inventory with a kubeconfig pasted
in, loaded from a secret provider, or taken from the cluster Plakar Control
Plane runs in. The documentation gives a least-privilege role for each
operation.

{{< /step >}}

{{< step >}}

**Let the inventory discover it.** Each sync, every 15 minutes by default, lists
the cluster, each namespace, the PersistentVolumeClaims and, where KubeVirt is
installed, the virtual machines.

{{< /step >}}

{{< step >}}

**Attach a policy.** Namespaces, claims and VMs that match it get its backup
frequency, its retention and its target store, including the ones discovered
after the policy was written.

{{< /step >}}

{{< /steps >}}

{{< /column >}}

{{< /columns >}}

## Kubernetes backup FAQ {kicker="FAQ"}

{{< columns >}}

{{< column >}}

### How do I restore a deleted Kubernetes namespace?

Run `plakar restore -to k8s:/payments <snapshot_id>:/payments`. Plakar recreates
the namespace and applies its objects, and the controllers start the Pods.
Volume contents come back with a `k8s+pvc` restore into each claim.

### Can I restore a Kubernetes namespace into another namespace?

Yes. Name the target in the destination, as in `-to k8s:/payments-check`.
Namespaced objects land there and the namespace is created if needed. To restore
into another cluster, use a kubeconfig for that cluster.

### Are Kubernetes Secrets included in the backup?

Yes. Plakar backs up every Secret its credentials can read and stores them in
the encrypted snapshot. To leave Secrets out, deny `get` and `list` on them to
the backup identity.

### Is a GitOps repository enough to restore a Kubernetes cluster?

A GitOps repository holds the desired state. A Plakar snapshot adds what Git
does not hold: the objects as they ran, with their status, the Secrets kept out
of Git, the objects operators created, and the contents of the volumes.

### How do I back up a Kubernetes PVC?

Use `k8s+csi:/<namespace>/<pvc>` with a `volume_snapshot_class` for a
point-in-time copy from a CSI snapshot, or `k8s+pvc:/<namespace>/<pvc>` for any
claim. Both store the files in the Plakar snapshot, and `k8s+pvc` restores them.

{{< /column >}}

{{< column >}}

### Where are Kubernetes backups stored?

In a Plakar store you choose: a local disk, an SFTP server, or an S3-compatible
bucket at any provider. The store is encrypted with its own passphrase, and
`plakar sync` keeps a second copy in another store.

### How do I back up KubeVirt virtual machines?

Run `plakar backup k8s+vm:/<namespace>/<vm>`. KubeVirt snapshots the VM, Plakar
stores its definition and disks, and `plakar restore -to k8s+vm:` brings it
back.

### Where does Plakar run to back up Kubernetes?

On any machine whose kubeconfig reaches the API server, or in a pod inside the
cluster with a ServiceAccount. Volume and VM data pass through a helper pod that
Plakar starts in the volume's namespace and removes at the end.

### How do I back up etcd along with Kubernetes objects?

Add the [etcd integration](/integrations/etcd/) for a self-hosted control plane.
Its snapshot is restored to disk and loaded with `etcdutl snapshot restore`,
while the Kubernetes integration restores single namespaces and objects through
the API.

### Which Kubernetes permissions does Plakar need?

`get` and `list` on the resources to back up, and the rights to apply them on
restore. Volume and VM protocols also create the helper pod and the
VolumeSnapshots or KubeVirt snapshots. The documentation lists a least-privilege
role for each operation.

### Should I back up Kubernetes with the free CLI or Plakar Control Plane?

The free, open-source CLI covers a handful of clusters driven by cron or a
CronJob. Plakar Control Plane takes over when namespaces, claims and VMs appear
faster than anyone edits scripts, and finds and schedules them on its own. Both
use the same Kubernetes integration.

{{< /column >}}

{{< /columns >}}
