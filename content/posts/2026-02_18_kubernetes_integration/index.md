---
title: "Backing up kubernetes clusters with Plakar"
date: 2026-02-18T20:00:00+0100
authors:
  - "op"
summary: "We built a Kubernetes integration for Plakar that backs up clusters at three levels: etcd (disaster recovery), manifests (granular restore and inspection), and persistent volumes (via CSI snapshots). This enables full cluster recovery, fine-grained restores, and data portability across environments."
categories: []
featured-scope: []
tags:
  - integration
  - kubernetes
---

**TL;DR:**

> We built a Kubernetes integration for Plakar that backs up clusters at three levels: etcd (disaster recovery), manifests (granular restore and inspection), and persistent volumes (via CSI snapshots). This enables full cluster recovery, fine-grained restores, and data portability across environments.

--- 

After joining the [Linux Foundation and the CNCF][cncf-join],
we started to attend some events, like the Cloud Native Days in Paris or the upcoming KubeConf in Amsterdam.
While we're already providing a large number of integrations, we felt we couldn't go empty-handed to these events;
we had to announce and present something new-something like a Kubernetes integration.

[cncf-join]: https://plakar.io/posts/2026-01-07/plakar-joins-the-linux-foundation-and-cloud-native-computing-foundation/

![](cnd-booth.png)
<small>From left to right: Omar, Julien, Antoine & Gilles at our Cloud Native Days booth.</small>

I've worked a lot with Kubernetes in the last years, but it was mostly
as a user and in a particular environment: strict adherence to a
GitOps flow, managed Kubernetes, and almost no usage of any
<abbr title="Persistent Volume Claims">PVCs</abbr> since all the data
was in managed databases or on buckets.

So this has also been a chance for me to dive into the Kubernetes
Golang APIs and into the workings of
<abbr title="Container Storage Interface">CSI</abbr>-backed drives.

## Installing the k8s integrations

At the time of this writing, the etcd and k8s integrations have been committed to public repositories and are **only available for plakar v1.1.0-beta**.

To test them, you first need to install our latest beta of plakar:

```sh
$ go install github.com/PlakarKorp/plakar@v1.1.0-beta.4
```

This is needed for the commands of this article to succeed !


## Disaster recovery with etcd

To provide a complete solution, I decided to tackle the backup
strategy in multiple levels.  The lowest level is **keeping etcd safe**.

[etcd][etcd] is a distributed key-value store for distributed systems.
It's often used as the single source of truth in Kubernetes clusters.

[etcd]: https://etcd.io

Under normal circumstances, _etcd_ can resist a partial disruption of
the nodes of its cluster, but if too many nodes fail, it might not
recover.  Given how critical this piece is, it's important to have a
sound disaster recovery strategy.

For this, we've just release a first version of the [etcd
integration][etcd-integration]: backing up etcd is now as easy as:

```sh
$ plakar pkg add etcd
$ plakar backup etcd://node1:2379
```

[etcd-integration]: https://github.com/PlakarKorp/integration-etcd

Unfortunately, due to how _etcd_ restore works, it's difficult to do so
in a granular way, so this is really about the last line of defense in
case of a wide cluster disruption.

To inspect or restore the state of the cluster in a more granular way
we need to handle the manifests.


## Saving the manifests

The second layer is backing up the manifests:
these represent **all the workloads on the cluster at a given time**,
with extra metadata about their current state as well.

At this layer, it's easier to browse the content of the backups,
investigate the differences between snapshots, or restore the
resources in a granular way:

- restoring the whole cluster configuration
- restoring just one namespace
- or even restoring a single Deployment.

This is part of what the [kubernetes integration][k8s-integration] does:
fetches all the manifests, the resources, present on the cluster for archival with Plakar.

[k8s-integration]: https://github.com/PlakarKorp/integration-k8s

```sh
$ plakar pkg add k8s
$ plakar backup k8s://localhost:8001
```

The presence of the status metadata in the backup also unlocks other
uses: for example, it may help investigate incidents since it's
easily possible from the UI to browse what was happening at a specific
time in the cluster (the nodes available, the state of the
deployments, etc.), in addition to existing monitoring tools.


## What about the data?

Even if Kubernetes was not initially designed for stateful workloads,
in practice it's normal to have Persistent Volumes attached to pods,
and these need to be protected as well.

The other main job of the [kubernetes integration][k8s-integration] is
to provide a way to back up and restore the contents of persistent
volumes. Incidentally, this was also the most complicated part for me
to implement.

I owe a lot to Mathieu and Gilles for helping me on this journey,
providing support when I was in a pinch, and for brutally simplifying
the design to make the integration easier to develop and use-and more
powerful, too.  When working alone, it's easy to fall for the
temptation of writing "clever" code that ends up being fairly complex
and just plain weird to use.

We started with <abbr title="Container Storage Interface">CSI</abbr>-backed <abbr title="Persistent Volume Claims">PVCs</abbr>, as they represent the de facto standard for persistent storage in Kubernetes clusters.

```sh
$ plakar pkg add k8s
$ plakar backup k8s+csi://localhost:8001/prod/my-pvc
```

The integration works by first creating a snapshot of a given <abbr
title="Persistent Volume Claims">PVC</abbr>.  Then, when it's ready,
it mounts it in a pod running a small
helper that runs our filesystem importer.  Plakar connects to it and
ingests the data.  Finally, the <abbr title="Persistent Volume Claims">PVC</abbr> snapshot gets deleted from the
Kubernetes cluster.

Restoring works in a similar way, except that no snapshot is taken.

A powerful feature provided by Plakar is that it is possible to
mix and match connectors, so, for example, it's possible to restore an _etcd_
snapshot in, say, a persistent volume in a Kubernetes cluster, or to
move data from a
<abbr title="Persistent Volume Claims">PVC</abbr>
to an S3 bucket. The sky is the limit!


## Wrapping up

What lies ahead is to keep testing the integration across different
flavors of Kubernetes distributions and providers, and extend the
support for non-<abbr title="Container Storage Interface">CSI</abbr>
volumes.  If you're running a Kubernetes cluster, be it on premise or
managed somewhere, please don't hesitate to give it a try and let us
know what you think!
