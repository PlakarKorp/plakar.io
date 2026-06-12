
# Managing passphrases

Plakar Control Plane provides end-to-end encryption for backups. When a
passphrase is configured on a store, it becomes part of the encryption process
for that store and is tied to the data already stored in it.

If the wrong passphrase is provided, Plakar Control Plane cannot open the store
and the backup data cannot be read.

## Changing the passphrase of a store

A store passphrase cannot be changed directly.

To use a new passphrase, you need to create a new store using the new
passphrase, then synchronize the data from the old store to the new one. This
creates a new encrypted store containing the same backup data, protected with
the new passphrase.

The general workflow is:

1. Create a new store connector with the new passphrase.
2. Run a sync task from the old store to the new store.
3. Verify that the sync job completed successfully.
4. Update backup, restore, check, and sync tasks to use the new store.
5. Update SLA policies that target the old store to target the new store, if
   any.
6. Keep the old store until you are sure it is no longer needed.
7. Remove the old store only after validation.

> [!IMPORTANT]+
>
> Do not delete the old store immediately. Keep it until you have confirmed that
> the sync completed successfully.

## Step 1: Create a new store

First, create a new store connector. This store must use the new passphrase. See
the [connectors documentation](../connectors) for the full procedure.

When creating the new store:

- Set up the new store with a new passphrase.
- Test the connection before using the store in a sync task.

> [!NOTE]+
>
> The new store should be separate from the old one. Do not point both store
> connectors to the same resource. Read the
> [resources documentation](../resources) for more information about resources.

## Step 2: Sync the old store to the new store

After the new store has been created, create a sync task from the old store to
the new store. The old store is used as the source. The new store is used as the
destination. See the
[sync task documentation](../connectors/stores#sync-store-task) for details on
creating and running scheduled tasks. When configuring the sync task:

- Select the old store as the source store.
- Select the new store as the destination store.
- Run the task.
- Wait for the job to complete successfully.

The sync operation copies the backup data into the new store. Since the new
store uses a different passphrase, the synchronized data is protected by the new
passphrase.

## Step 3: Verify the sync

Once the sync job has completed, verify that the new store can be used. Check
that:

- The sync job completed successfully.
- The new store contains the expected snapshots.
- A check task can run successfully on the new store to verify data integrity.

## Step 4: Update existing tasks and policies

After the new store has been validated, update existing tasks and policies so
they use the new store. This may include:

- Backup tasks
- Restore tasks
- Sync tasks
- Check tasks
- SLA policies that target the old store

## Step 5: Remove the old store when safe

Only remove the old store after you have confirmed that:

- The new store contains the expected backup data.
- The new passphrase is stored securely.
- Backup and restore workflows use the new store.

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
new encryption material. In Plakar Control Plane, this is done by syncing the
old store into a new store configured with a new passphrase.

## Losing a passphrase

If the passphrase for an encrypted store is lost, the data in that store cannot
be recovered.

Plakar Control Plane provides end-to-end encryption, and the passphrase is
required to open the store. There is no recovery mechanism for a lost
passphrase.

Store passphrases should be kept in a secure password manager or secret
management system used by your organization.

See the [Secret Providers documentation](../infrastructure/secret-providers) for
details on using secrets from a secret manager inside Plakar Control Plane.

> [!WARNING]+
>
> If the passphrase for an encrypted store is lost, the data in that store
> cannot be decrypted.

## See also

- [Store connectors](../connectors/stores)
- [Scheduling tasks](../operations/scheduling)
- [Secret Providers](../infrastructure/secret-providers)

