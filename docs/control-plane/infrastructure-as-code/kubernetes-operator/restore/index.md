
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
  edgeTags:
    - eu-west-1
```

`store` and `destination` reference the `Store` and `Destination` resources by
name (and optionally namespace). To restore a specific restore point instead of
the latest one, set `snapshotID` to its ID; `snapshotID` and `latest` are
mutually exclusive.

`edgeTags` dispatches the restore to a remote
[edge](../../../infrastructure/edges) instead of running it on the Control Plane
appliance: all listed tags must be present on the edge for it to match. If
omitted or empty, the restore matches any online edge, preferring one over local
execution, and falls back to running on the Control Plane appliance if none are
online. If `edgeTags` is set but matches no online edge, the restore fails
instead of running locally.

Once submitted, the job's identifier is exposed through `status.atID`, and
`status.conditions` reports `Running`, `Completed`, or `Failed` as the job
progresses.

