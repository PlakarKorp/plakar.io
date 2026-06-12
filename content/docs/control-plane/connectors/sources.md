---
title: "Source Connector"
date: "2026-05-11T00:00:00Z"
weight: 1
summary: "How source connectors work in Plakar Control Plane."
aliases:
  - /control-plane-docs/connectors/sources/
---

# Source Connector

A source connector defines a resource that Plakar Control Plane can back up.
Once a source connector is created, its details page provides a **Dashboard**
tab with a **Test Connection** action.

Use **Test Connection** to verify that Plakar Control Plane can connect to the
source using the provided configuration and credentials.

![](../images/source-connector-1.png)

If the connection test fails, check the connector configuration and credentials,
then run the test again. Once the connection test succeeds, backup actions
become available from the dashboard.

From the source connector dashboard, you can create a backup task for the
connector. This can be done as a one-off task or as a recurring scheduled task.

## Tasks and Schedules

Operations in Plakar Control Plane are managed by the scheduler. A task can be
created as a one-off operation or attached to a schedule so that it runs
repeatedly.

One-off tasks are useful when you want to run an operation immediately and do
not need it to repeat. Scheduled tasks are useful when you want Plakar Control
Plane to run an operation on a regular basis.

See the [scheduling documentation](../../operations/scheduling) for details on
creating and managing schedules.

## One-off Tasks on the Source

### Backup Task

After the source connector has been verified with **Test Connection**, you can
create a backup task from the backup card on the dashboard.

A backup task requires a [store connector](../stores). The store connector
defines where the backup data will be stored, so it must already be configured
before creating the backup task.

You can also add a label to the task. See the
[scheduling documentation](../../operations/scheduling) for more details on
using labels. A backup task can be started immediately as a one-off task, or
attached to a schedule if you want the backup to run repeatedly.

![](../images/source-connector-2.png)

Once the task has been created, you can follow its progress from the jobs
history page. This page shows the task status and progress, and also allows you
to cancel a running task when needed.
