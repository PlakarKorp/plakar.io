---
title: "Kubernetes"
date: "2026-10-26T00:00:00Z"
weight: 6
summary:
  "Kubernetes cluster manifests and KubeVirt virtual machines in Plakar Control
  Plane."
---

# Kubernetes

The Kubernetes integration discovers two kinds of compute resources in a
Kubernetes cluster: the cluster and its namespaces, whose manifests are backed
up and restored, and KubeVirt virtual machines, backed up and restored with
their disks. The PersistentVolumeClaims of the cluster are
[block storage resources](../../block-storage/pvc).

{{% children description="true" %}}
