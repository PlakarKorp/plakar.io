---
title: "Restore Resource"
date: "2026-07-15T00:00:00Z"
weight: 5
summary:
  "Run a one-off restore using the plakar-operator Restore custom resource."
---

# Restore Resource

A `Restore` resource runs a one-off restore from a [Store](../stores) into a
[Destination](../destinations). Unlike `ScheduleBackup`, `ScheduleCheck`, and
`ScheduleSync` (see [Scheduling](../scheduling)), it isn't recurring: creating
it submits a single restore job to Plakar Control Plane.

```yaml
apiVersion: task.plakar.io/v1alpha1
kind: Restore
metadata:
  name: restore-recovery-database
spec:
  store:
    name: production-s3
  destination:
    name: recovery-database
  latest: true
```

`store` and `destination` reference the `Store` and `Destination` resources by
name (and optionally namespace). To restore a specific restore point instead of
the latest one, set `snapshotID` to its ID; `snapshotID` and `latest` are
mutually exclusive.

Once submitted, the job's identifier is exposed through `status.atID`, and
`status.conditions` reports `Running`, `Completed`, or `Failed` as the job
progresses. To run a task immediately without pinning it to a `Store` and
`Destination` already declared as Kubernetes resources, use the
[manual scheduler](../../../operations/scheduling/manual-scheduler).
