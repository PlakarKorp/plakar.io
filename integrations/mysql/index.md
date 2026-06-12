
## Why protecting MySQL and MariaDB data matters

MySQL and MariaDB handle storage-level durability well, but they offer no protection against the most common causes of real data loss:

- **Accidental deletion**: A `DROP TABLE`, a bad migration, or a `DELETE` without a `WHERE` clause wipes data instantly. Replication ensures every replica reflects the same mistake just as quickly.
- **Corruption**: A failed upgrade, a misbehaving plugin, or a storage fault can corrupt a database in ways that are not immediately visible and this can also be replicated across replicas.
- **No rollback**: Without snapshots, there is no way to return to an earlier known-good state. By the time a problem is noticed, the damage may already be replicated everywhere.

For production databases, a backup stored independently of the database server is not optional.

## What happens when a database is compromised?

MySQL and MariaDB access is controlled by user accounts and connection credentials. If those credentials are leaked or permissions are misconfigured:

- **Total loss**: An attacker with sufficient privileges can drop databases or truncate tables through standard SQL. Automated scripts can do this in seconds across every database on the server.
- **Ransomware**: Malicious actors can exfiltrate data and then delete or encrypt the originals, leaving no clean copy to recover from.
- **No recovery path**: Without an independent backup stored outside the database server, there is nothing to restore from.

Plakar mitigates these risks by storing snapshots in an isolated Kloset, encrypted end-to-end and independent of the database server itself.

## How Plakar protects your databases

Plakar integrates with MySQL and MariaDB through their native dump tools (`mysqldump` and `mariadb-dump`).

Both single-database and full-server backups are supported. A single-database backup captures the schema, data, routines, triggers, and events for one database. A full-server backup captures everything across all databases in a single snapshot.

Backups can be stored on any supported backend: local storage, S3-compatible object storage, SFTP, or cold storage. Because Plakar snapshots are immutable and end-to-end encrypted, they remain intact even if the database server or its credentials are compromised.

