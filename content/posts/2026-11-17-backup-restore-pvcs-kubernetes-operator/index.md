---
title: "How to backup and restore PVCs with the Kubernetes Operator"
slug: "backup-restore-pvcs-kubernetes-operator-walkthrough"
date: 2026-11-17T10:00:00+0100
authors:
  - "nick"
summary:
  "An 18-minute walkthrough of the Plakar Kubernetes Operator: WordPress and
  MariaDB on EKS, backed up to S3 and restored, every step declared in YAML."
category: "insights"
tags:
  - kubernetes
  - resilience-as-code
  - backup
  - restore
  - gitops
featured-scope:
  - header
---

**TL;DR:**

> A walkthrough of the Plakar Kubernetes Operator: a real app on EKS, backed up
> to S3 and restored, with every step applied through `kubectl`.

---

{{< youtubeLite id="8vPUMGBbGXE" >}}

The
[Kubernetes Operator](/docs/control-plane/infrastructure-as-code/kubernetes-operator/)
is how you orchestrate backups and restoration from inside the cluster. It is a
controller that reconciles custom resources against the Plakar Control Plane:
you declare a store, a source, a destination and a schedule as YAML, apply them
with `kubectl`, and the operator makes the API calls. In case you missed it, we
wrote a blog post on
[Resilience as Code](/posts/2026-09-23/resilience-as-code-kubernetes-operator/)
which explains why: the reconcile loop that made GitOps reliable should drive
backup too. This video is what that looks like in practice: a real app on EKS,
two PVCs, one S3 bucket, and a restore you can check.

## The setup

If you want the full step-by-step walkthrough, every command is in the
[README](https://github.com/PlakarKorp/kubernetes-operator-demo-aws-eks). The
only templating is `envsubst`, wrapped in a `./run` script, so cluster name,
bucket name and Control Plane URL come from a `.env` file.

The cluster is a two-node EKS cluster. On top of it:

- EBS and EFS CSI drivers, the Gateway API and NGINX Gateway Fabric
- an echo service to prove the gateway works
- WordPress with MariaDB in an `apps` namespace, MariaDB on a `ReadWriteOnce`
  EBS volume and WordPress uploads on a `ReadWriteMany` EFS volume shared by two
  replicas

Before touching backups, the app gets a known state: an edited post, an uploaded
image, and a restart of both deployments to confirm the data survives a pod
restart. That matters later: the restore test only means something if you know
what state you expect back.

## Wiring the operator

The operator needs a Control Plane to talk to. A ServiceAccount with a bearer
token and the minimum RBAC to back up and restore PVCs lets the Control Plane
reach the cluster, and an application user with the Operator role and an API key
lets the operator reach the Control Plane. The key goes in a Kubernetes secret,
and the `Plakar` resource points at both:

```yaml
apiVersion: "task.plakar.io/v1alpha1"
kind: "Plakar"
metadata:
  name: "pcp"
spec:
  plakarControlPlaneUrl: "${PLAKAR_KUBERNETES_OPERATOR_PCP_URL}"
  apiKey:
    secretName: "plakar-credentials"
    key: "apikey"
```

Apply it, and an inventory shows up in the Control Plane. From there the
resources map one to one to what you would otherwise click through in the UI:

- `Store`: the S3 bucket where snapshots land
- `Source`: the two PVCs to back up, `wordpress-pvc` and `mariadb-pvc`, through
  the `k8s` integration with the `k8s+pvc` protocol
- `Destination`: where a restore writes to. It holds no data, it is a registered
  target. In the demo it points at the same two PVCs
- `Backup`: a one-off backup of a source into a store
- `ScheduleBackup`: the same, recurring.
- `Restore`: a one-off restore from a store into a destination

The source and destination use the Kubernetes integration underneath: the
operator declares the job, the integration does the reading and writing.

Every one of them reports the ID the Control Plane assigned in `status.id`, plus
`Available`, `Progressing` and `Degraded` conditions, so `kubectl get` and
`kubectl describe` work the way they do on any other object.

## Backup, then break something

A one-off backup is a `Backup` resource, one per PVC: apply it, then
`kubectl describe backup` or watch the job in the Control Plane. Then the app
changes: a second post and a second upload. The scheduled backups come
afterwards, so the snapshot to restore from is the one with a single post. Known
state before, known state after.

## Restore, with a check first

Backing up matters, but being able to browse and inspect a backup before you
restore it is where the real value is. Before restoring, open the snapshot in
the Control Plane and browse it: the uploaded image is there, the database files
are there.

Then the app is prepared. The destination is the same PVC as the source, so both
deployments are scaled to zero first: nothing writes to the volume mid-restore,
and nothing a user does in WordPress gets lost between the restore and the
restart. The `Restore` resources are applied, one per PVC:

```yaml
apiVersion: "task.plakar.io/v1alpha1"
kind: "Restore"
metadata:
  name: "wordpress-restore"
spec:
  store:
    name: "aws-s3"
  destination:
    name: "wordpress-restore"
  filters:
    dataset: "${PLAKAR_SOURCE_ID_WORDPRESS}"
    latest: true
```

The `dataset` filter matters. `latest: true` alone would pick the last snapshot
in the store, whichever PVC it came from. Scoped to the source ID, it picks the
latest snapshot of that PVC. Swap the filter for a `snapshotID` to restore a
specific one. The Control Plane runs both restores as jobs: the MariaDB volume
comes back in seconds, the WordPress uploads take a few minutes.

## Where to go from here

The [demo repo](https://github.com/PlakarKorp/kubernetes-operator-demo-aws-eks)
has the full step-by-step walkthrough, from creating the EKS cluster to
restoring. The operator is in the Control Plane's
[infrastructure-as-code docs](/docs/control-plane/infrastructure-as-code/kubernetes-operator/),
starting with
[installation](/docs/control-plane/infrastructure-as-code/kubernetes-operator/installation/).
The Control Plane itself has a
[free tier up to 500 GB](/docs/control-plane/intro/overview/).

By the way: if what you want to back up is Kubernetes itself, not just the
volumes in it, that is the [Kubernetes integration](/integrations/kubernetes/).
It covers manifests and resource state, persistent volume contents (through CSI
`VolumeSnapshot` or directly from the PVC) and KubeVirt VMs. Omar wrote up how
it works in
[Backing up Kubernetes clusters with Plakar](/posts/2026-02-18/backing-up-kubernetes-clusters-with-plakar/)
and
[Free backup for KubeVirt VMs and OpenShift](/posts/2026-10-28/free-backup-for-kubevirt-and-openshift/).
