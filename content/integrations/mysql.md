---
title: MySQL / MariaDB

subtitle: Encrypted, deduplicated backups for MySQL and MariaDB databases

description: >
  Protect your MySQL and MariaDB databases against data loss, accidental deletion, and misconfiguration. Plakar provides encrypted, deduplicated snapshots using the backup tools MySQL and MariaDB already ship with.

technology_title: MySQL and MariaDB are reliable, until something goes wrong

technology_description: >
  MySQL and MariaDB power some of the most widely deployed applications in the world. They handle data integrity well at the storage level, but they have no built-in protection against the most common causes of data loss: a bad migration, a dropped table, or compromised credentials.

  Plakar integrates with mysqldump and mariadb-dump which are the backup tools MySQL and MariaDB already ship with, adding encryption, deduplication, and snapshot management on top of the standard SQL dump format.

categories:
  - source connector
  - destination connector

tags:
  - MySQL
  - MariaDB
  - Databases
  - SQL
  - mysqldump
  - AWS RDS
  - Managed Databases
  - On-Premise

seo_tags:
  - MySQL backup
  - MariaDB backup
  - mysqldump backup
  - database disaster recovery
  - encrypted database backup
  - logical backup
  - SQL dump backup
  - database snapshot
  - deduplication
  - cross-server restore

technical_documentation_link:

stage: beta

date: 2026-04-02

resource: MySQL and MariaDB

resource_type: database

image: img/integrations/mysql.png
---

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
