---
title: "Managing passphrases"
date: "2026-06-04T00:00:00Z"
weight: 1
summary:
  "How store passphrases work in Plakar Control Plane and how to change the
  passphrase used by a store."
---

# Managing passphrases

Plakar Control Plane provides end-to-end encryption for backups. When a
passphrase is configured on a store, Plakar Control Plane uses it as part of the
encryption process for that store.

This means the passphrase is tied to the data already stored in that store. If
the wrong passphrase is provided, Plakar Control Plane cannot open the store and
the backup data cannot be read.

## Changing the passphrase of a store

A store passphrase cannot be changed directly. To use a new passphrase, you'll
need to create a new store with the new passphrase, then run a sync task from
the old store to the new store.

After the sync has completed successfully, the new store contains the backup
data protected with the new passphrase. You can then update your backup tasks to
use the new store going forward.

The general flow is:

1. Create a new store with the new passphrase.
2. Run a sync task from the old store to the new store.
3. Verify that the sync completed successfully.
4. Update all tasks on the old store such as backups, checks etc to use the new
   store.
5. Delete the old store only when it is no longer needed.

> [!IMPORTANT]+
>
> Do not delete the old store until you have confirmed that the sync completed
> successfully and that the new store can be used for future backup and restore
> operations.

## Using the new store

Once the new store has been created and synchronized, it should become the store
used by your backup tasks.

The old store should no longer be used for new backups. Keeping both stores
active can make it harder to know which store contains the latest backup data.

After you have confirmed that the new store works as expected, the old store can
be removed according to your retention and operational requirements.

## Losing a passphrase

If the passphrase for an encrypted store is lost, Plakar Control Plane cannot
recover it.

Because Plakar Control Plane provides end-to-end encryption, the passphrase is
required to open the store. Without the correct passphrase, the data in the
store cannot be decrypted.

Store passphrases should be kept in a secure password manager or secret
management system used by your organization.

> [!WARNING]+
>
> If the passphrase for an encrypted store is lost, the data in that store
> cannot be decrypted.

## See also

- [Store Connector](../connectors/stores)
