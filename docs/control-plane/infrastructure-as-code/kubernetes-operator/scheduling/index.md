
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
optionally by namespace. They also share an optional `historyLimit` field,
covered in [Job history](#job-history) below.

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

## Running tasks on a remote edge

All three resources also accept an optional `edgeTags` field to dispatch the
task to a remote [edge](../../../infrastructure/edges) instead of running it on
the Control Plane appliance:

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
  edgeTags:
    - gpu
    - eu-west
```

All listed tags must be present on the edge for it to match. If `edgeTags` is
omitted or empty, the task matches any online edge, preferring one over local
execution; if none are online, it falls back to running on the Control Plane
appliance. If `edgeTags` is set but matches no online edge, the task fails
instead of running locally.

After a scheduling resource is created, the corresponding scheduled task is
created in Plakar Control Plane. Its UUID is exposed through `status.id`, while
`status.conditions` reports whether the task was created successfully.

## Job history

Each execution of a `ScheduleBackup`, `ScheduleCheck`, or `ScheduleSync` is
mirrored in the cluster as a `TaskRun` resource, in the same namespace as the
schedule that produced it. A `TaskRun` reports the execution's phase (`queued`,
`running`, `canceled`, `succeeded`, or `failed`) and its scheduled, started, and
stopped timestamps:

```sh
$ kubectl get taskruns
```

`TaskRun` resources are read-only records owned by the schedule that created
them, so deleting a `ScheduleBackup`, `ScheduleCheck`, or `ScheduleSync`
resource also deletes its `TaskRun` history. Each one carries
`task.plakar.io/name` and `task.plakar.io/kind` labels identifying that parent,
so you can list only the runs for a given schedule:

```sh
$ kubectl get taskruns -l task.plakar.io/name=backup
```

```txt
NAME              TASK     KIND             PHASE       SCHEDULEDAT   AGE
backup-0d2a6cd0   backup   schedulebackup   running     16s           16s
backup-609ae284   backup   schedulebackup   succeeded   106s          79s
backup-917e49c9   backup   schedulebackup   succeeded   46s           17s
backup-a241c8ff   backup   schedulebackup   succeeded   2m16s         110s
backup-f1788ce4   backup   schedulebackup   succeeded   76s           48s
```

`kubectl describe` on a single `TaskRun` shows its `jobID`, the
`ScheduleBackup`, `ScheduleCheck`, or `ScheduleSync` resource that owns it, and
the timestamps reported by Plakar Control Plane for that execution:

```sh
$ kubectl describe taskrun backup-0d2a6cd0
```

```txt
Name:         backup-0d2a6cd0
Namespace:    default
Labels:       task.plakar.io/kind=schedulebackup
              task.plakar.io/name=backup
Annotations:  <none>
API Version:  task.plakar.io/v1alpha1
Kind:         TaskRun
Metadata:
  Creation Timestamp:  2026-08-06T09:00:05Z
  Generation:          1
  Owner References:
    API Version:           task.plakar.io/v1alpha1
    Block Owner Deletion:  true
    Controller:            true
    Kind:                  ScheduleBackup
    Name:                  backup
    UID:                   ea5004e0-18af-42ab-8d4f-543e3afe8ad0
  Resource Version:        112969151773
  UID:                     5df1b84f-bb6a-4067-8630-ea757190fded
Spec:
  Job ID:  0d2a6cd0-66a2-468c-9040-48f8995c9f7e
  Task Ref:
    Kind:  schedulebackup
    Name:  backup
Status:
  Phase:         running
  Scheduled At:  2026-08-06T09:00:05Z
  Started At:    2026-08-06T09:00:05Z
Events:          <none>
```

The `historyLimit` field caps how many `TaskRun` resources are kept for a given
schedule. It defaults to 5 and can be set up to 20:

```yaml
apiVersion: task.plakar.io/v1alpha1
kind: ScheduleBackup
metadata:
  name: nightly-database-backup
spec:
  periodicity: 86400
  historyLimit: 10
  source:
    name: production-database
  store:
    name: production-s3
```

The operator authenticates as an Application user, and creates a scheduler for
that user in Plakar Control Plane if one doesn't already exist. Every
`ScheduleBackup`, `ScheduleCheck`, and `ScheduleSync` resource it manages then
appears under that user's entry in the **User schedulers** view described in
[User Schedulers](../../../operations/scheduling/user-schedulers).

These resources only cover recurring tasks. For one-off restores, see the
[Restore Resource](../restore). For any other task run once, use the
[manual scheduler](../../../operations/scheduling/manual-scheduler).

