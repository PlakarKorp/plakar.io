---
title: "Backing up kubernetes clusters"
date: 2026-02-17T20:00:00+0100
authors:
  - "op"
summary: "Backup etcd, kubernetes configuration and CSI drives with ease"
categories: []
featured-scope: []
tags:
  - integration
  - kubernetes
---

After joining the [Linux Foundation and the CNCF][cncf-join] we
started to attend to some events, like the Cloud Native Days in Paris
or the upcoming KubeConf in Amsterdam.

[cncf-join]: https://plakar.io/posts/2026-02-07/storing-backups-in-an-oci-registry/

While we're already providing a large number of integrations, we felt
we couldn't go empty-handed to these events, we had to announce and
present something new.  Something like a kubernetes integration.

I've worked a lot with kubernetes in the last years, but it was mostly
as a user and in a particular environment: strictly adherence to a
gitops flow, kubernetes hosted elsewhere, and almost no usage of any
<abbr title="Persistent Volume Claims">PVCs</abbr> since all the data
was in managed databases or on buckets.

So, this has also been a chance for me to dive into the kubernetes
golang APIs, and into the workings of
<abbr title="Container Storage Interface">CSI</abbr>-backed drives.


## etcd & disaster recovery

To provide a complete solution, I decided to tackle the backup
strategy in multiple levels.  The lowest level is keeping etcd safe.

[etcd][etcd] is a distributed key-value store for distributed systems.
It's often used as the single source of truth in kubernetes clusters.

[etcd]: https://etcd.io

Under normal circumstances, etcd can resist a partial disruption of
the nodes of its cluster, but if too many nodes fail, it might not
recover.  Given how critical this piece is, it's important to have a
sound disaster recovery strategy.

For this, I've wrote a first version of the [etcd
integration][etcd-integration].

[etcd-integration]: https://github.com/PlakarKorp/integration-etcd

Unfortunately, due to how etcd restore works, it's difficult to do so
in a granular way, so this is really about the last line of defens in
case of a wide cluster diruption.

To inspect or restore the state of the cluster in a more granular way
we need to handle the manifests.


## Save the manifests

The second layer is backing up the manifests: these represent all the
workloads on the cluster at a given time, with extra metadata about
their current state as well.

At this layer, it's easier to browse the content of the backups,
investigate the differences between snapshots, or restore the
resources in a granular way: the whole cluster configuration, just one
namespace, or even a single Deployment.

This is part of what the [kubernetes integration][k8s-integration]
does: it persist all the manifests, the resources, present on the
cluster.

[k8s-integration]: https://github.com/PlakarKorp/integration-k8s

The presence of the status metadata in the backup also unlocks other
uses: for example it may help investigating incidents since it's
easily possible from the UI to browse what was happening at a specific
time in the cluster (the nodes available, the state of the
deployments, etc...), in addition to existing monitoring tools.


## What about the data?

Even if kubernetes was not initially designed for stateful workloads,
in practice it's normal to have Persistent Volumes attached to pods,
and these needs to be protected as well.

The other main job of the [kubernetes integration][k8s-integration] is
to provide a way to backup and restore the contents of persistent
volumes.  Incidentally, this was also the most complicate part for me
to implement.

I owe a lot to Mathieu and Gilles for helping me in this journey,
providing help when I was in a pinch, and for brutally simplifying the
design to make the integration easier to develop and to use, and more
powerful too.

The current version only works on
<abbr title="Persistent Volume Claims">PVCs</abbr>
that are backed by a
<abbr title="Container Storage Interface">CSI</abbr>
driver, which are quite widespread in practice.

The integration works by first creating a snapshot of a given
<abbr title="Persistent Volume Claims">PVCs</abbr>,
then when it's ready, as it could take some time, it mounts it in a
pod running a small helper, which I've called "kubelet", which runs
our filesystem importer, and then plakar connects to it and ingest the
data.  When it's done, the snapshots gets deleted from the cluster.

Restoring works in a similar way, except that no snapshot is taken.

A powerful feature provided by plakar is that is possible to
mix-and-match connectors, so for example it's possible to restore etcd
snapshot in a, say, persistent volume in a kubernetes cluster.  Or to
move data from a
<abbr title="Persistent Volume Claims">PVCs</abbr>
to a s3 bucket.  The sky is the limit!


## Wrapping up

What lies ahead is to keep testing the integration across different
flavors of kubernetes distributions and providers, and extend the
support for non-<abbr title="Container Storage Interface">CSI</abbr>
volumes.  If you're running a kubernetes cluster, be it on premise or
managed somewhere, please don't hesitate to give it a try and let us
know what you think!
