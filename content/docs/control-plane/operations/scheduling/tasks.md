---
title: "Scheduled Tasks"
date: "2026-06-25T00:00:00Z"
weight: 1
summary: "The different types of tasks you can run in Plakar Control Plane."
---

# Scheduled Tasks

Plakar Control Plane runs operations as tasks. There are four types of tasks,
each requiring a different combination of apps. Any task can be run once as a
one-off operation or attached to a schedule so that it repeats automatically.

## Backup Task

A backup task stores backup data from a source app into a store app. It requires
a source app and a store app.

![](../images/backup-task.png)

## Restore Task

A restore task restores data from a store app to a destination app. It requires
a store app and a destination app. If no restore point is selected, Plakar
Control Plane restores the latest available restore point.

![](../images/restore-task.png)

## Sync Task

A sync task copies backup data from one store app to another. It requires two
store app. This is useful for replicating backups to a second location or a
different storage tier.

![](../images/sync-task.png)

## Check Task

A check task verifies the integrity of data in a store app. It checks that the
backup data can be read correctly and validates file MACs to make sure no
corruption has occurred. It requires a store app. By default the entire store is
checked, but you can select a specific restore point to check only that restore
point.

![](../images/check-task.png)
