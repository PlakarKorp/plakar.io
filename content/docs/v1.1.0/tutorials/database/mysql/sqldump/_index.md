---
title: Logical backups with SQL dumps
description: >
    How to back up MySQL databases using the mysqldump utility, and how to restore from these backups.
last_reviewed: "2026-01-24"
last_reviewed_version: "v1.0.6"
weight: 1
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

# Overview
Logical backups save information represented as logical database structure (`CREATE DATABASE`, `CREATE TABLE` statements) and content (`INSERT` statements). This type of backup is performed by querying the MySQL server to obtain database structure and content information.

Unlike physical backups, logical backups are machine-independent and highly portable, making them suitable for transferring data between different MySQL versions and architectures.

For a deeper understanding of logical backups and MySQL backup strategies, we recommend reading the [official MySQL documentation on mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html).

## Requirements
This guide assumes that you have:
- A running MySQL server to back up.
- Valid MySQL credentials with sufficient privileges to dump databases.
- The `mysqldump` and `mysql` utilities available on the system where the backup is performed.

### Setting up environment variables
To avoid exposing credentials on the command line, set the following environment variables:
```bash
export MYSQL_HOST=xxxx
export MYSQL_TCP_PORT=3306
export MYSQL_USER=xxxx
export MYSQL_PWD=xxxx
```
These variables will be automatically used by `mysqldump` and `mysql` commands.

## Backup a single database
The easiest way to back up a MySQL database is to pipe the output of `mysqldump` directly into `plakar backup` using the `stdin` integration.

### Basic backup
```bash
mysqldump <dbname> | plakar at /var/backups backup stdin:dump.sql
```

### Recommended backup (InnoDB with all objects)
InnoDB is MySQL's default storage engine since MySQL 5.5. For InnoDB tables, use the `--single-transaction` option to create a consistent snapshot without locking tables:
```bash
mysqldump --single-transaction \
  --routines \
  --triggers \
  --events \
  <dbname> | plakar at /var/backups backup stdin:dump.sql
```
This includes:
- **--single-transaction**: Consistent snapshot for InnoDB tables without blocking writes
- **--routines**: Stored procedures and functions
- **--triggers**: Table triggers
- **--events**: Scheduled events

## Backup all databases
To back up all databases on a MySQL server, including system databases and user privileges:
```bash
mysqldump --all-databases \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --set-gtid-purged=OFF | \
  plakar at /var/backups backup stdin:all_databases.sql
```
The `--set-gtid-purged=OFF` option prevents GTID information from being included in the dump, making it more portable across different MySQL configurations.

## Restore a database
### Restore a single database
```bash
plakar at /var/backups cat <SNAPSHOT_ID>:dump.sql | mysql <dbname>
```
### Restore all databases
```bash
plakar at /var/backups cat <SNAPSHOT_ID>:all_databases.sql | mysql
```
Replace `<SNAPSHOT_ID>` with the actual snapshot ID containing your backup. You can list available snapshots with `plakar at /var/backups ls`.

## Best practices
### Credential security
Never pass passwords directly on the command line using `-p` followed by the password, as this exposes credentials in process listings and shell history. Always use environment variables or MySQL configuration files (`~/.my.cnf`).

### Compression
**Do not compress dumps manually**. Plakar automatically deduplicates and compresses data, optimizing storage space and transfer efficiency. Pre-compressed dumps prevent effective deduplication.

### Storage engines
For mixed storage engines (InnoDB and MyISAM), you may need to use `--lock-all-tables` instead of `--single-transaction`.
```bash
# This blocks all write operations during the dump
mysqldump --all-databases --lock-all-tables | \
  plakar at /var/backups backup stdin:dump.sql
```
