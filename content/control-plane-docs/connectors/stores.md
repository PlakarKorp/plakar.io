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

![](../images/store-connector-2.png)

> [!NOTE]+
> All operations in Plakar Control Plane are currently scheduled as jobs. One-off job execution support is planned for a future release.

The **Settings** tab allows connector configuration to be updated and the connector to be deleted.

## Scheduling operations

Backup, restore, synchronization, and integrity check operations are managed through the scheduling system.

See the [scheduling documentation](#) for more details.
