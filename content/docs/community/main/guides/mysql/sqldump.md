---
title: "Logical backups with SQL dumps"
date: "2026-03-18T00:00:00Z"
weight: 1
summary: Back up MySQL and MariaDB databases using the Plakar MySQL integration and restore them.
---

# Logical backups with SQL dumps

The Plakar MySQL integration uses `mysqldump` (MySQL) or `mariadb-dump` (MariaDB) to produce logical backups. These are standard SQL files that are portable, human-readable, and restorable without Plakar if needed.

Two URI schemes map to independent sets of binaries:

| Protocol           | Target              | Dump tool      | Restore tool |
| ------------------ | ------------------- | -------------- | ------------ |
| `mysql://`         | MySQL 5.7 / 8.x     | `mysqldump`    | `mysql`      |
| `mysql+mariadb://` | MariaDB 10.x / 11.x | `mariadb-dump` | `mariadb`    |

For a deeper understanding of logical backups and MySQL backup strategies, refer to the [official MySQL documentation on mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html).

## Requirements

- A running MySQL or MariaDB server.
- A database user with sufficient privileges (see [Required privileges](#required-privileges)).
- `mysqldump` and `mysql` in `$PATH` for MySQL, or `mariadb-dump` and `mariadb` for MariaDB.

### Install the package

```bash
$ plakar pkg add mysql
```

## What gets stored in a snapshot

| File              | Description |
| ----------------- | ----------- |
| `/manifest.json`  | Server metadata: version, configuration, databases, tables, routines, triggers, events. |
| `/<database>.sql` | Single-database dump (when `database` is specified). |
| `/all.sql`        | Full-server dump (when `database` is omitted). |

## Back up a single database

```bash
# MySQL
$ plakar source add mydb mysql://dbuser:secret@db.example.com/mydb
$ plakar at /var/backups backup @mydb

# MariaDB
$ plakar source add mydb mysql+mariadb://dbuser:secret@db.example.com/mydb
$ plakar at /var/backups backup @mydb
```

## Back up all databases

Omit the database name from the URI to use `--all-databases`:

```bash
# MySQL
$ plakar source add alldb mysql://root:secret@db.example.com
$ plakar at /var/backups backup @alldb

# MariaDB
$ plakar source add alldb mysql+mariadb://root:secret@db.example.com
$ plakar at /var/backups backup @alldb
```

## Restore a single database

The target database must already exist:

```bash
$ plakar destination add mydbdst mysql://dbuser:secret@target.example.com/mydb
$ plakar at /var/backups restore -to @mydbdst <snapshot_id>
```

To have Plakar create the database automatically, set `create_db=true`:

```bash
$ plakar destination add mydbdst mysql://dbuser:secret@target.example.com/mydb \
  create_db=true
$ plakar at /var/backups restore -to @mydbdst <snapshot_id>
```

## Restore all databases

```bash
$ plakar destination add mydbdst mysql://root:secret@target.example.com
$ plakar at /var/backups restore -to @mydbdst <snapshot_id>
```

## List snapshots

```bash
$ plakar at /var/backups ls
```

## Source options

| Option               | Default     | Description |
| -------------------- | ----------- | ----------- |
| `location`           | —           | Connection URI: `mysql://[user[:password]@]host[:port][/database]` |
| `host`               | `127.0.0.1` | Server hostname. Overrides the URI host. |
| `port`               | `3306`      | Server port. Overrides the URI port. |
| `username`           | —           | Username. Overrides the URI user. |
| `password`           | —           | Password. Overrides the URI password. Passed via `MYSQL_PWD`, never on the command line. |
| `database`           | —           | Database to back up. Overrides the URI path. If omitted, all databases are backed up. |
| `single_transaction` | `true`      | Use `--single-transaction` for a lock-free InnoDB snapshot. |
| `routines`           | `true`      | Include stored procedures and functions. |
| `events`             | `true`      | Include event scheduler events. |
| `triggers`           | `true`      | Include triggers. |
| `no_data`            | `false`     | Dump schema only, no data. |
| `no_create_info`     | `false`     | Dump data only, no schema. |
| `no_tablespaces`     | `true`      | Suppress tablespace statements. |
| `hex_blob`           | `false`     | Encode BINARY/BLOB columns as hex. |
| `ssl_mode`           | —           | TLS mode: `disabled`, `preferred`, `required`, `verify_ca`, `verify_identity`. |
| `ssl_cert`           | —           | Path to the client SSL certificate (PEM). |
| `ssl_key`            | —           | Path to the client SSL private key (PEM). |
| `ssl_ca`             | —           | Path to the CA certificate (PEM). |
| `mysql_bin_dir`      | —           | Directory containing MySQL binaries. MySQL only. |
| `column_statistics`  | `true`      | Query `COLUMN_STATISTICS`. Set to `false` when using mysqldump 8.0 against MySQL 5.7. MySQL only. |
| `set_gtid_purged`    | `AUTO`      | GTID mode: `AUTO`, `ON`, or `OFF`. MySQL only. |
| `mariadb_bin_dir`    | —           | Directory containing MariaDB binaries. MariaDB only. |

## Destination options

| Option            | Default     | Description |
| ----------------- | ----------- | ----------- |
| `location`        | —           | Connection URI: `mysql://[user[:password]@]host[:port][/database]` |
| `host`            | `127.0.0.1` | Server hostname. Overrides the URI host. |
| `port`            | `3306`      | Server port. Overrides the URI port. |
| `username`        | —           | Username. Overrides the URI user. |
| `password`        | —           | Password. Overrides the URI password. |
| `database`        | —           | Target database. Inferred from the dump filename if omitted. |
| `create_db`       | `false`     | Issue `CREATE DATABASE IF NOT EXISTS` before restoring. |
| `force`           | `false`     | Continue on SQL errors during restore. |
| `ssl_mode`        | —           | TLS mode (same values as source). |
| `ssl_cert`        | —           | Path to the client SSL certificate (PEM). |
| `ssl_key`         | —           | Path to the client SSL private key (PEM). |
| `ssl_ca`          | —           | Path to the CA certificate (PEM). |
| `mysql_bin_dir`   | —           | Directory containing the `mysql` binary. MySQL only. |
| `mariadb_bin_dir` | —           | Directory containing the `mariadb` binary. MariaDB only. |

## Required privileges

### Single database backup

```sql
GRANT SELECT, SHOW VIEW, TRIGGER, EVENT ON mydb.* TO 'backup'@'%';
GRANT PROCESS ON *.* TO 'backup'@'%';
```

With `single_transaction=true` (default), `LOCK TABLES` is not required for InnoDB tables.

### All-databases backup

```sql
GRANT SELECT, SHOW VIEW, TRIGGER, LOCK TABLES, EVENT, RELOAD ON *.* TO 'backup'@'%';
GRANT PROCESS ON *.* TO 'backup'@'%';
```

## Considerations

### MySQL vs MariaDB binaries

Always use binaries that match your server. On Debian and Ubuntu, `apt install default-mysql-client` installs MariaDB's `mysqldump` by default. MariaDB's `mysqldump` is not compatible with MySQL 8 for all-databases backups and will produce dumps that fail to restore.

Verify you have the correct binary:

```bash
$ mysqldump --version
# MySQL:   mysqldump  Ver 8.x Distrib 8.x, for Linux (x86_64)
# MariaDB: mysqldump from 11.x.x-MariaDB ...
```

If both are installed, point the integration to the correct directory using `mysql_bin_dir`.

### InnoDB and MyISAM

`single_transaction` (enabled by default) produces a consistent InnoDB snapshot without locking tables. For databases with MyISAM tables, `single_transaction` does not prevent locks on those tables. If you need a consistent backup across MyISAM tables, set `single_transaction=false` to use `--lock-all-tables` instead, accepting write locks during the dump.

### GTIDs

When the server has GTIDs enabled, the dump includes `SET @@GLOBAL.GTID_PURGED` statements that will cause restore to fail on a server that already has GTID history. Set `set_gtid_purged=OFF` on the source to omit GTID information, or run `RESET MASTER` on the target before restoring.

### User and grant migration

Single-database backups do not include user accounts or grants. To migrate users, use an all-databases backup, export grants manually with a tool like `pt-show-grants`, or recreate accounts manually on the target.

### Compression

Do not enable compression at the dump level. Plakar deduplicates and compresses data automatically. Pre-compressed dumps reduce deduplication effectiveness across snapshots.

### Kloset store location

The examples above use `/var/backups` as the Kloset store. Any supported store backend can be used instead. See [Create a Kloset store](../../create-kloset-repository) for details.

## See also

* [MySQL integration on GitHub](https://github.com/PlakarKorp/integration-mysql)
* [Official mysqldump documentation](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html)
* [Official mariadb-dump documentation](https://mariadb.com/kb/en/mariadb-dump/)
