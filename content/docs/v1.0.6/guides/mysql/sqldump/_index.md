---
title: Logical backups with SQL dumps
description: >
    Back up MySQL databases using mysqldump and restore from these backups.
last_reviewed: "2026-02-11"
last_reviewed_version: "v1.1.0"
weight: 1
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

## Overview

Logical backups export database structure (`CREATE DATABASE`, `CREATE TABLE`) and content (`INSERT` statements) using `mysqldump`. These backups are machine-independent and portable across MySQL versions and architectures.

For a deeper understanding of logical backups and MySQL backup strategies, we recommend reading the [official MySQL documentation on mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html).

## Prerequisites

- Running MySQL server
- MySQL credentials with dump privileges
- `mysqldump` and `mysql` utilities installed

## Configure Credentials

Set environment variables to avoid exposing credentials on command line:

```bash
export MYSQL_HOST=xxxx
export MYSQL_TCP_PORT=3306
export MYSQL_USER=xxxx
export MYSQL_PWD=xxxx
```

## Back Up Single Database

### Basic backup
```bash
mysqldump <dbname> | plakar at /var/backups backup stdin:dump.sql
```

### InnoDB with all objects (recommended)
```bash
mysqldump --single-transaction \
  --routines \
  --triggers \
  --events \
  <dbname> | plakar at /var/backups backup stdin:dump.sql
```

Options:
- `--single-transaction`: Consistent snapshot without locking tables (InnoDB)
- `--routines`: Include stored procedures and functions
- `--triggers`: Include table triggers
- `--events`: Include scheduled events

## Back Up All Databases

```bash
mysqldump --all-databases \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --set-gtid-purged=OFF | \
  plakar at /var/backups backup stdin:all_databases.sql
```

The `--set-gtid-purged=OFF` option improves portability across MySQL configurations.

## Restore Database

### Single database
```bash
plakar at /var/backups cat <SNAPSHOT_ID>:dump.sql | mysql <dbname>
```

### All databases
```bash
plakar at /var/backups cat <SNAPSHOT_ID>:all_databases.sql | mysql
```

List snapshots:
```bash
plakar at /var/backups ls
```

## Mixed Storage Engines

For databases using both InnoDB and MyISAM, use `--lock-all-tables`:

```bash
mysqldump --all-databases --lock-all-tables | \
  plakar at /var/backups backup stdin:dump.sql
```

This blocks all write operations during the dump.

## Best Practices

### Credentials
- Use environment variables or `~/.my.cnf`
- Never pass passwords with `-p<password>` on command line (exposes in process listings)

### Compression
- Do not compress dumps manually
- Plakar automatically deduplicates and compresses data
- Pre-compressed dumps prevent effective deduplication

### Storage Engines
- Use `--single-transaction` for InnoDB (default since MySQL 5.5)
- Use `--lock-all-tables` for mixed InnoDB/MyISAM environments
