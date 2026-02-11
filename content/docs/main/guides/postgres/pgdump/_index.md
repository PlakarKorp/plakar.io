---
title: Logical backups with SQL dumps
description: >
    Back up PostgreSQL databases using pg_dump and restore from these backups.
last_reviewed: "2026-01-05"
last_reviewed_version: "v1.0.6"
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

## Overview

SQL dumps consist of a file containing SQL commands that can be fed back to a PostgreSQL server to recreate a database in the exact state it was in at the time the dump was taken.

For a deeper understanding of SQL dumps and PostgreSQL backup strategies, we recommend reading the [official PostgreSQL documentation on SQL dumps](https://www.postgresql.org/docs/current/backup-dump.html).

## Prerequisites

- Running PostgreSQL server
- Environment variables: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`

## Back Up Single Database

```bash
export PGUSER=xxx
export PGPORT=5432
export PGHOST=xxx
export PGPASSWORD=xxx

pg_dump <dbname> | plakar at /var/backups backup stdin:dump.sql
```

## Restore Single Database

```bash
export PGUSER=xxx
export PGPORT=5432
export PGHOST=xxx
export PGPASSWORD=xxx

plakar at /var/backups cat <SNAPSHOT_ID>:dump.sql | psql -X <dbname>
```

List snapshots:
```bash
plakar at /var/backups ls
```

## Back Up Entire Cluster

Use `pg_dumpall` to include all databases, roles, and tablespaces:

```bash
export PGUSER=xxx
export PGPORT=5432
export PGHOST=xxx
export PGPASSWORD=xxx

pg_dumpall | plakar at /var/backups backup stdin:dump.sql
```

## Restore Entire Cluster

```bash
export PGUSER=xxx
export PGPORT=5432
export PGHOST=xxx
export PGPASSWORD=xxx

plakar at /var/backups cat <SNAPSHOT_ID>:dump.sql | psql -X
```

## Considerations

### Compression

- Do not compress dumps manually
- Plakar automatically deduplicates and compresses data
- Pre-compressed dumps prevent effective deduplication
