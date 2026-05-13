---
title: "Store connector"
date: "2026-05-11T00:00:00Z"
weight: 2
summary: "How store connectors work in Plakar Control Plane."
---

# Store Connector

When a new store connector is added, the connector details page provides a **Dashboard** tab with actions for testing and initializing the store.

It is recommended to first use the **Test Connection** action to verify that Plakar Control Plane can successfully connect to the store using the provided configuration and credentials.

![](../images/store-connector-1.png)

If the selected store has already been initialized by Plakar Control Plane and contains an existing Kloset store, the connection test will detect it automatically and no additional initialization is required.

If the store is in a new location (for example, a new S3 bucket that has never been used by Plakar before), you must use the **Initialize Store** action before the store can receive backups. This prepares the store with the metadata and structure required so it is ready to receive backup data.

If the connection test fails, verify the provided configuration and credentials, then test the connection again.

Once a store has been initialized, additional operations become available from the dashboard:
* **Check Store** - schedule an integrity check for the Kloset store
* **Create Backup** - schedule a backup to the store
* **Sync Store** - schedule synchronization to another store
* **Restore Data** - schedule a restore operation from the store

> [!NOTE]+
> Operations in Plakar Control Plane can be executed either as one-off job or through scheduled tasks.

## Browsing Snapshots

![](../images/view-snapshots.png)

You can view all backup snapshots stored in this store from the **Browse** tab. From there, you can inspect the files contained in each snapshot and download individual files without performing a full restore.

![](../images/browse-snapshots.png)

## Scheduling Tasks

Backup, restore, sync, and integrity check operations can be configured as recurring scheduled tasks. See the [scheduling documentation](#) for details on creating and managing schedules.

The **Dashboard** tab displays recent jobs that have run on the store, along with upcoming scheduled jobs.

![](../images/store-connector-2.png)

The **Schedules** tab displays all scheduled operations associated with the store connector.

![](../images/scheduling-tasks-on-store.png)

## Settings

The **Settings** tab allows connector configuration to be updated and the connector to be deleted.
