---
title: "Managing passphrases"
date: "2026-06-04T00:00:00Z"
weight: 11
summary:
  "How Kloset store passphrases work in Plakar and how to change the passphrase
  used by a Kloset store."
---

# Managing Passphrases

Plakar provides end-to-end encryption for backups. When a passphrase is
configured on a store, it becomes part of the encryption process for that store
and is tied to the data already stored in it.

If the wrong passphrase is provided, Plakar cannot open the Kloset store and the
backup data cannot be read.

## Changing the passphrase of a store

A store passphrase cannot be changed directly.

To use a new passphrase, you need to create a new store using the new
passphrase, then synchronize the data from the old store to the new one. This
creates a new encrypted store containing the same backup data, protected with
the new passphrase.

The general workflow is:

1. Create a new store with the new passphrase.
2. Run a sync from the old store to the new store.
3. Verify that the sync completed successfully.
4. Update any scripts or scheduled tasks to use the new store.
5. Remove the old store only after validation.

> [!WARNING]+
>
> Do not delete the old store immediately. Keep it until you have confirmed that
> the sync completed successfully and the new store is working as expected.

### Step 1: Create a new store

Create a new store at a different location and configure it with the new
passphrase.

```sh
$ plakar store add store2 /var/backups passphrase=xxx
```

### Step 2: Sync the old store to the new store

Use `plakar sync` to copy all snapshots from the old store into the new store.
The old store is the source and the new store is the destination.

```sh
$ plakar at @store1 sync to @store2
```

The sync operation reads each snapshot from the old store, decrypts it using the
old passphrase, and writes it into the new store encrypted with the new
passphrase.

### Step 3: Verify the sync

Once the sync has completed, confirm that the new store contains the expected
snapshots:

```sh
$ plakar at @store2 ls
```

### Step 4: Update scripts and scheduled tasks

After validating the new store, update any scripts, cron jobs, or automation
that reference the old store to use the new store.

### Step 5: Remove the old store when safe

Only remove the old store after you have confirmed that:

- The new store contains all expected snapshots.
- The new passphrase is stored securely (for example, in a password manager or
  secrets manager).
- All backup and restore workflows are using the new store successfully.

## Why passphrase rotation is not supported

Many encrypted systems use the passphrase only to protect a randomly generated
master key, which then encrypts the actual data. With that design, rotating a
passphrase is cheap: decrypt the master key with the old passphrase, re-encrypt
it with the new one, and leave the backup data untouched.

This is convenient, but it does not fully solve the problem that most passphrase
changes are meant to address: a suspected compromise.

If an attacker has enough access to obtain the current passphrase, they may also
have enough access to read or keep a copy of the encryption material it
protects. Changing the passphrase afterwards may prevent future access through
the old passphrase, but it does not protect data that could already be
decryptable by a copied key.

The only way to genuinely rotate the encryption is to write the data again under
new encryption material. In Plakar, this is done by syncing the old store into a
new store configured with a new passphrase.

## Losing a passphrase

If the passphrase for an encrypted store is lost, the data in that store cannot
be recovered.

Plakar provides end-to-end encryption, and the passphrase is required to open
the store. There is no recovery mechanism for a lost passphrase.

Store passphrases should be kept in a secure password manager or secret
management system.

> [!WARNING]
>
> If the passphrase for an encrypted store is lost, the data in that store
> cannot be decrypted. There is no backdoor or recovery path.

## See also

- [plakar sync](../references/commands/plakar-sync)
- [Creating a Kloset store](../create-kloset-repository)
