---
title: "Backup & Restore"
date: "2026-11-18T00:00:00Z"
weight: 8
summary:
  "Back up, restore, check or sync any resource or store of the organization,
  immediately or on a schedule."
---

# Backup & Restore

Backup & Restore brings together the resources and stores of every inventory of
an organization, so any of them can be backed up, restored, checked or synced
from one place. Each operation can run immediately, as a single job, or be
scheduled, which turns it into a [task](../scheduling/tasks) with the same
settings on the [manual scheduler](../scheduling/manual-scheduler). A job that
runs immediately does not replace any scheduled run.

Stores and destinations of every inventory can be picked, as long as their
[residency](../compliance/residency) matches. A resource or store under a
[legal hold](../compliance/legal-hold) cannot be used until the hold is lifted.

## Backup

Resources show when they were last backed up and whether an
[SLA policy](../compliance/policies) covers them. When a policy covers the
resource, the store of that policy is selected. Otherwise, the backup is a
one-off and nothing schedules the next one. A backup takes the same options as a
[backup task](../scheduling/tasks#backup-task).

## Restore

Restore points can be narrowed down by creation date, by store and by label. A
restore point held by several stores, for example after a sync, is restored from
the store you pick. The whole restore point can be restored, or a single file or
folder found by browsing or searching its contents. A restore takes the same
options as a [restore task](../scheduling/tasks#restore-task).

## Check

A check covers all the restore points of a store, the recent ones, or a single
one. It verifies the restore points themselves, unlike the
[integrity checks](../apps/stores#integrity-checks) that run continuously on a
store. See
[when to use integrity checks and check tasks](../apps/stores#when-to-use-integrity-checks-and-check-tasks).
A check takes the same options as a
[check task](../scheduling/tasks#check-task).

## Sync

A sync copies all the restore points of a store, or the recent ones, to another
store of any inventory, to keep a second copy in another location or on another
storage tier. Once copied, a restore point can be restored from either store. A
sync takes the same options as a [sync task](../scheduling/tasks#sync-task).
