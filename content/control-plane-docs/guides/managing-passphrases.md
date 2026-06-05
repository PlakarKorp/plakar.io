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
passphrase is configured on a store, it becomes part of the encryption process
for that store and is tied to the data already in it. If the wrong passphrase is
provided, the store cannot be opened and the backup data cannot be read.

## Changing the passphrase of a store

A store passphrase cannot be changed directly. To use a new passphrase, create a
new store with the new passphrase and run a sync task from the old store to the
new one. Once the sync completes, the new store holds the backup data protected
by the new passphrase.

The general flow is:

1. Create a new store with the new passphrase.
2. Run a sync task from the old store to the new store.
3. Verify that the sync completed successfully.
4. Update all tasks (backups, checks, and so on) to use the new store.
5. Delete the old store only when it is no longer needed.

> [!IMPORTANT]+
>
> Do not delete the old store until you have confirmed that the sync completed
> successfully and that the new store can be used for future backup and restore
> operations.

## Why passphrase rotation is not supported

Many encrypted systems use the passphrase only to protect a randomly generated
master key, which in turn encrypts all data. With that design, rotating a
passphrase is cheap: decrypt the master key with the old passphrase, re-encrypt
it with the new one, done. The backup data is never touched.

This is convenient, but it does not solve the problem that most passphrase
changes are actually trying to solve: a suspected compromise.

If an attacker has enough access to obtain the current passphrase, they can also
read and keep a copy of the master key. Changing the passphrase afterwards
prevents future access to the encrypted master key, but it does nothing for a
master key that has already been stolen. The attacker retains the ability to
decrypt all existing data indefinitely, and the passphrase change creates a
false sense of security.

The only way to genuinely rotate the encryption is to re-encrypt the data itself
under a new key. In Plakar Control Plane, that is what the sync-to-new-store
workflow achieves.

## Using the new store

Once synchronized, the new store should replace the old one for all backup
tasks. Keeping both stores active makes it harder to know which one holds the
latest data.

After you have confirmed that the new store works as expected, the old store can
be removed according to your retention and operational requirements.

## Losing a passphrase

If the passphrase for an encrypted store is lost, the data in that store cannot
be recovered. Plakar Control Plane provides end-to-end encryption, and the
passphrase is required to open the store — there is no recovery mechanism.

Store passphrases should be kept in a secure password manager or secret
management system used by your organization.

> [!WARNING]+
>
> If the passphrase for an encrypted store is lost, the data in that store
> cannot be decrypted.

## See also

- [Store Connector](../connectors/stores)
