---
title: "One-off Tasks"
date: "2026-06-25T00:00:00Z"
weight: 2
summary:
  "How to run a task immediately as a one-off operation in Plakar Control Plane."
---

# One-off Tasks

A one-off task is a task that runs immediately without being attached to a
schedule. This is useful when you want to run an operation on demand, such as
triggering an immediate backup or restore from a restore point.

One-off tasks can be created directly from **Operations > Scheduling** or from
the various pages as a quick way to setup tasks. This includes:

- Each app pages have quick actions to run tasks supported by the app. See the
  [apps documentation](../../apps)
- When browsing restore points in a store or a source you can quickly setup a
  restore or check task on each restore point. See the
  [store app](../../apps/stores) and
  [source app](../../apps/sources) documentation

All of these lead to the same task UI. From there you can run the task
immediately as a one-off, or attach a schedule to it and have it run repeatedly.
See the [scheduler documentation](../scheduler) for details on attaching
schedules and monitoring job progress.
