---
title: Logical backups with SQL dumps
description: >
    How to back up PostgreSQL databases using the pg_dump utility, and how to restore from these backups.
last_reviewed: "2026-01-05"
last_reviewed_version: "v1.0.6"
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

# Overview

SQL dumps consist of a file containing SQL commands that can be fed back to a PostgreSQL server to recreate a database in the exact state it was in at the time the dump was taken.

For a deeper understanding of SQL dumps and PostgreSQL backup strategies, we recommend reading the [official PostgreSQL documentation on SQL dumps](https://www.postgresql.org/docs/current/backup-dump.html).

## Requirements

This guide assumes that you have:

- A running PostgreSQL server to back up.
- The environment variables `PGHOST`, `PGPORT`, `PGUSER`, and `PGPASSWORD` set to allow connections to your PostgreSQL server.

## Backup with pg_dump

The easiest way to back up a PostgreSQL database is to pipe the output of `pg_dump` directly into `plakar backup` using the `stdin` integration.

Run the following command:

```bash
export PGUSER=xxx
export PGPORT=5432
export PGHOST=xxx
export PGPASSWORD=xxx

pg_dump <dbname> | plakar at /var/backups backup stdin:dump.sql
```

This command invokes `pg_dump` to create a SQL dump of the database named `<dbname>` and pipes the output to `plakar backup`. The dump is stored in the Kloset store located at `/var/backups` under the filename `dump.sql`.

### Restore with pg_dump

To restore the database from this dump, run:

```bash
export PGUSER=xxx
export PGPORT=5432
export PGHOST=xxx
export PGPASSWORD=xxx

plakar at /var/backups cat 8e85865c:dump.sql | psql -X <dbname>
```

This command retrieves the `dump.sql` file from the specified snapshot in the Kloset store and pipes it to `psql`, restoring the database named `<dbname>`. Replace "8e85865c" with the actual snapshot ID containing your backup.

## Backup with pg_dumpall

While `pg_dump` operates on a single database, it does not include cluster-wide objects such as roles or tablespaces. To back up an entire PostgreSQL cluster, including all databases and global objects, use `pg_dumpall`.

```bash
export PGUSER=xxx
export PGPORT=5432
export PGHOST=xxx
export PGPASSWORD=xxx

pg_dumpall | plakar at /var/backups backup stdin:dump.sql
```

This command produces a single SQL dump containing all databases and cluster-wide metadata, which is then stored in the Kloset store.

### Restore with pg_dumpall

Restoring a `pg_dumpall` dump is similar to restoring a single-database dump, except that no database name is required:

```bash
export PGUSER=xxx
export PGPORT=5432
export PGHOST=xxx
export PGPASSWORD=xxx

plakar at /var/backups cat 05f6b8da:dump.sql | psql -X
```

This command restores all databases and global objects from the dump. Replace "05f6b8da" with the snapshot ID where the backup is stored.

## Considerations

### Compressed dumps

The PostgreSQL documentation recommends compressing SQL dumps for large databases by piping the output of `pg_dump` or `pg_dumpall` through a compression tool such as `gzip`.

When using Plakar, **we recommend not compressing dumps manually**. Plakar automatically deduplicates and compresses data, optimizing storage space and transfer efficiency.

If the dump is compressed before being passed to Plakar, Plakar will not be able to deduplicate or further compress the data effectively.

### Kloset store location

In the examples above, we used `/var/backups` as the Kloset store location.

It is possible to use other store locations, for example to store the snapshots in a cloud storage bucket. Check the guide [Create a Kloset store](../../create-kloset-repository) for more information on setting up Kloset stores.
