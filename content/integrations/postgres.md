---
title: PostgreSQL

subtitle: Encrypted, deduplicated backups for PostgreSQL databases and clusters

description: >
  Protect your PostgreSQL databases against data loss, accidental deletion, and misconfiguration. Plakar provides encrypted, deduplicated snapshots using either logical or physical backups, restorable to any environment.

technology_title: PostgreSQL is battle-tested, but still need a backup plan

technology_description: >
  PostgreSQL is one of the most trusted databases in production, but durability at the database level is not the same as having a reliable backup strategy. Replication spreads data across nodes which also spreads corruption and accidental deletions just as quickly.

  Plakar integrates with PostgreSQL's own tooling (pg_dump and pg_basebackup) adding encryption, deduplication, and snapshot management on top of the backup formats PostgreSQL already knows how to produce.

categories:
  - source connector
  - destination connector


tags:
  - Databases
  - pg_dump
  - pg_basebackup
  - SQL
  - AWS RDS

seo_tags:
  - PostgreSQL backup
  - pg_dump backup
  - pg_basebackup backup
  - database disaster recovery
  - encrypted database backup
  - logical backup
  - physical backup
  - cross-version restore
  - database snapshot
  - deduplication

technical_documentation_link:

stage: beta

date: 2026-04-02

resource: PostgreSQL

resource_type: database

image: img/integrations/postgres.png
---

## Why protecting PostgreSQL data matters

PostgreSQL handles data integrity well at the storage level, but it has no built-in protection against the most common causes of data loss:

- **Accidental deletion**: A dropped table, a bad migration, or a `DELETE` without a `WHERE` clause can wipe critical data instantly. Replication ensures every replica reflects the same mistake.
- **Corruption**: A failed upgrade, a misbehaving extension, or a storage fault can corrupt a database in ways that are not immediately visible and this can also be replicated across replicas.
- **No rollback**: Without snapshots, there is no way to return to an earlier known-good state. Point-in-time recovery requires WAL archiving to be set up in advance and maintained carefully.

For production databases, a backup that lives outside the database itself is not optional.

## What happens when a database is compromised?

PostgreSQL access is controlled by roles and connection credentials. If those credentials are leaked or permissions are misconfigured:

- **Total loss**: An attacker with sufficient privileges can drop databases or truncate tables through standard SQL. Automated scripts can do this in seconds.
- **Ransomware**: Malicious actors can exfiltrate data and then delete or encrypt the originals, leaving no clean copy to recover from.
- **No recovery path**: Without an independent backup stored outside the database server, there is nothing to restore from.

Plakar mitigates these risks by storing snapshots in an isolated Kloset, encrypted end-to-end and independent of the PostgreSQL server itself.

## How Plakar protects your PostgreSQL databases

Plakar integrates with PostgreSQL through two independent strategies, each suited to different recovery needs:

- **Logical backups** use `pg_dump` and `pg_dumpall` to produce portable, SQL-level snapshots of individual databases or entire clusters. Logical backups work across PostgreSQL major versions, require no downtime, and support selective restore of individual databases, schemas, or tables.
- **Physical backups** use `pg_basebackup` to capture the entire PostgreSQL data directory as a file-level snapshot. Physical backups are faster to restore and capture everything (all databases, configuration, and WAL) but must be restored with the same PostgreSQL major version.

Both strategies benefit from Plakar's encryption, deduplication, and snapshot management. Backups can be stored on any supported backend: local storage, S3-compatible object storage, SFTP, or cold storage.
