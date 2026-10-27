---
title: "OpenShift"
date: "2026-10-26T00:00:00Z"
weight: 7
summary:
  "OpenShift cluster manifests and OpenShift Virtualization virtual machines in
  Plakar Control Plane."
---

# OpenShift

The OpenShift integration discovers two kinds of compute resources in an
OpenShift cluster: the cluster and its namespaces, whose manifests are backed up
and restored, and OpenShift Virtualization virtual machines, backed up and
restored with their disks. The PersistentVolumeClaims of the cluster are
[block storage resources](../../block-storage/openshift-pvc).

{{% children description="true" %}}
