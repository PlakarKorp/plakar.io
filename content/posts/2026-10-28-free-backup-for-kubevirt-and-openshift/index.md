---
title: "Free backup for KubeVirt VMs and OpenShift"
summary:
  "Plakar's Kubernetes integration now backs up KubeVirt VMs: every disk plus
  the VM manifest, in one consistent snapshot. On OpenShift, a new openshift
  package keeps restores from doing things you didn't ask for. Both are free."
slug: "free-backup-for-kubevirt-and-openshift"
date: "2026-10-28T00:00:00+14:00"
authors:
  - "victor"
tags:
  - integration
  - kubernetes
  - kubevirt
  - openshift
  - backup
category: "technology"
featured-scope:
  - header
---

**TL;DR:**

> Plakar's Kubernetes integration now backs up KubeVirt VMs: every disk plus the
> VM manifest, in one snapshot, consistent across disks. On OpenShift, a new
> `openshift` package keeps restores from doing things you didn't ask for. Both
> are free.

---

OpenShift Virtualization is Red Hat's packaging of upstream KubeVirt. A VM is a
Kubernetes object, its disks are PVCs, so our Kubernetes integration should have
covered them already. It didn't: it rejected `VolumeMode: Block` outright, and
most VM disks are block-mode. That was the actual blocker.

## We don't freeze VMs. KubeVirt does.

A disk snapshotted mid-write may not boot. A VM with three disks snapshotted a
few seconds apart is worse. KubeVirt already solves this: its
`VirtualMachineSnapshot` freezes the guest through the qemu guest agent and
coordinates every disk. So we drive it instead of reimplementing it.

The flow: Plakar requests a `VirtualMachineSnapshot`, a short-lived pod streams
each disk out as raw blocks, and Plakar dedups, compresses and encrypts it into
the same snapshot as the VM manifest. Restore goes the other way: fresh PVCs,
data written back, manifest applied, into the original namespace or a new one.

No guest agent, no freeze: Plakar gives up after 10 minutes instead of waiting
forever. Install the agent.

## OpenShift: restore what you backed up, nothing more

Backup stays a complete record. Filtering happens on restore, because some
objects come with side effects: restoring a `BuildConfig` re-triggers a build, a
`Route` reassigns a host, `SecurityContextConstraints` and OAuth tokens belong
to the cluster. The `openshift` package skips them. Its helper pod sets its
security context explicitly, and it matches OpenShift's default restricted SCC:
OpenShift doesn't let pods add capabilities anyway.

## Try it

Pre-built packages need a free Plakar account:

```bash
$ plakar login
$ plakar pkg add k8s
$ plakar backup k8s+vm:/vms/my-vm
```

On OpenShift:

```bash
$ plakar pkg add openshift
$ plakar backup openshift+vm:/vms/my-vm
```

RBAC roles and options are in the
[Kubernetes docs](https://plakar.io/docs/community/main/integrations/kubernetes/).

## How it ships

KubeVirt support lives in the Kubernetes integration, which is
[open source](https://github.com/PlakarKorp/integrations/tree/main/k8s) (ISC).
The `openshift` package is not open source, but it is free for everyone in the
Plakar community: create a free account, run `plakar login`, install it.

Running VMs on Kubernetes? Break it and tell us on
[Discord](https://discord.gg/uuegtnF2Q5).
