---
title: "Pre-job and Post-job Hooks"
date: "2026-07-13T00:00:00Z"
weight: 6
summary:
  "Run scripts on an edge immediately before and after a backup or restore."
---

# Pre-job and Post-job Hooks

Backup and restore tasks running on an edge can use **pre-job** and **post-job
hooks** to perform actions immediately before and after the task. Hooks are
useful when a workload needs preparation before a backup or restore, or cleanup
afterward. For example, a pre-job hook can quiesce a database or mount a
snapshot, while a post-job hook can resume the database or remove the snapshot.

Hooks are scripts that are managed on the edge host. The edge only executes
scripts from the directory configured with `-scripts-dir`. The task refers to a
script by its file name; it cannot provide an arbitrary path. File names
containing path separators, `.` or `..` are rejected. An edge without a
configured scripts directory does not accept hooks.

The pre-job hook runs before the backup or restore begins. If it fails, the task
is aborted and the backup or restore does not start. The post-job hook runs
after the job once a pre-job hook has completed, regardless of whether the
backup or restore itself succeeded. It also runs when the job is cancelled. This
ensures that cleanup or recovery actions can still take place after a failed or
cancelled job.

A failure in the post-job hook causes the task to be reported as failed, even if
the backup or restore itself succeeded. The backup is not discarded in this
case. For example, if a post-job hook is responsible for resuming a database and
that operation fails, the task reports the hook failure so that the resulting
state can be investigated.

Hook scripts inherit the environment of the edge process and receive additional
variables describing the current task:

- `PLAKAR_WORK_ID`: identifier of the work item.
- `PLAKAR_OP`: operation being performed.
- `PLAKAR_HOOK`: `pre_job` or `post_job`.

This allows the same script to be used by multiple tasks and to distinguish
between the pre-job and post-job phases.

The output of each hook appears in the job's output alongside the task's own.
When a hook fails, the end of its output is also included in the error reported
to the Control Plane, providing context for diagnosing the failure.

## Hooks on Kubernetes

On Kubernetes, hook scripts are provided through a ConfigMap configured with
`scripts.configMapName`. The chart mounts the ConfigMap as a read-only,
executable directory at `scripts.mountPath` and passes that path to the edge
using `-scripts-dir`. See
[Configure the chart](../installation/kubernetes#configure-the-chart).
