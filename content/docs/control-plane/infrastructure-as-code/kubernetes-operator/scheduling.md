---
title: "Scheduling"
date: "2026-07-15T00:00:00Z"
weight: 5
summary:
  "Define scheduled backup, check, and sync tasks using the plakar-operator."
---

# Scheduling

The operator provides three custom resources for scheduling tasks in Plakar
Control Plane:

- `ScheduleBackup`
- `ScheduleCheck`
- `ScheduleSync`

These resources are the declarative equivalents of the scheduled tasks that can
be configured through the [Scheduling](../../../operations/scheduling/) section
of Plakar Control Plane.

All three resources use the same `periodicity` field, which specifies the
execution interval in seconds. Rather than referencing Plakar Control Plane
resource UUIDs, they reference other Kubernetes custom resources by name, and
optionally by namespace.

## ScheduleBackup

A `ScheduleBackup` resource creates a recurring backup task for a
[Source](../sources) and stores the backups in a [Store](../stores).

```yaml
apiVersion: task.plakar.io/v1alpha1
kind: ScheduleBackup
metadata:
  name: nightly-database-backup
spec:
  periodicity: 86400
  source:
    name: production-database
  store:
    name: production-s3
```

## ScheduleCheck

A `ScheduleCheck` resource periodically verifies the integrity of a
[Store](../stores).

```yaml
apiVersion: task.plakar.io/v1alpha1
kind: ScheduleCheck
metadata:
  name: weekly-store-check
spec:
  periodicity: 604800
  store:
    name: production-s3
```

## ScheduleSync

A `ScheduleSync` resource periodically copies backup data from one
[Store](../stores) to another.

```yaml
apiVersion: task.plakar.io/v1alpha1
kind: ScheduleSync
metadata:
  name: replicate-to-cold-storage
spec:
  periodicity: 86400
  sourceStore:
    name: production-s3
  destinationStore:
    name: cold-storage-glacier
```

After a scheduling resource is created, the corresponding scheduled task is
created in Plakar Control Plane. Its UUID is exposed through `status.id`, while
`status.conditions` reports whether the task was created successfully.

The operator currently manages only recurring tasks. To run a task immediately,
use the [manual scheduler](../../../operations/scheduling/manual-scheduler) or
the Plakar Control Plane API.
