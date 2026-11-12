---
title: "MySQL / MariaDB"
date: "2026-06-12T00:00:00Z"
weight: 16
summary:
  "Back up and restore MySQL and MariaDB databases with Plakar using logical
  dumps from mysqldump and mariadb-dump, including Google Cloud SQL."
---

# MySQL / MariaDB

The MySQL / MariaDB integration performs logical backups of MySQL and MariaDB
databases using `mysqldump` and `mariadb-dump`, and restores them with the
`mysql` and `mariadb` clients. A backup is a set of standard SQL files. They are
human-readable and can be restored without Plakar if needed.

The integration includes two connectors:

| Connector type            | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| **Source connector**      | Back up MySQL or MariaDB databases into a Kloset store.    |
| **Destination connector** | Restore databases from a Kloset store to a running server. |

Both connectors support three protocols:

| Protocol           | Target                    | Dump tool      | Restore tool |
| ------------------ | ------------------------- | -------------- | ------------ |
| `mysql://`         | MySQL 5.7 / 8.x           | `mysqldump`    | `mysql`      |
| `mysql+mariadb://` | MariaDB 10.x / 11.x       | `mariadb-dump` | `mariadb`    |
| `mysql+gcsql://`   | MySQL on Google Cloud SQL | `mysqldump`    | `mysql`      |

`mysql://` and `mysql+mariadb://` are independent connectors. Each always uses
its own set of binaries, regardless of the server at the other end.

**Requirements**

- For `mysql://` and `mysql+gcsql://`, `mysqldump` (backup) and `mysql`
  (restore) in `$PATH` on the machine running Plakar. They are provided by the
  `mysql-client` package or the MySQL distribution.
- For `mysql+mariadb://`, `mariadb-dump` (backup) and `mariadb` (restore).
- A database user with the privileges listed in
  [Backup user privileges](#backup-user-privileges).

**Typical use cases**

- Scheduled logical backups of application databases with cross-version
  portability.
- Full-cluster dumps including stored procedures, events, and triggers.
- MariaDB-specific backups that require `mariadb-dump` semantics.
- Backups of MySQL instances on Google Cloud SQL.

## Installation

The MySQL / MariaDB integration is distributed as a Plakar package.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

```bash
$ plakar pkg add mysql
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< tab label="Building from source" >}}

**Prerequisites:**

- Go toolchain compatible with your **Plakar** version

```bash
$ plakar pkg build mysql
```

Install the resulting archive:

```bash
$ plakar pkg add -allow-unsigned ./mysql_v1.0.0_linux_amd64.ptar
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see the
[managing packages guide](../../guides/managing-packages/).

## How a backup works

The source connector runs the dump tool of its protocol and produces a single
SQL file per database, or a combined `all.sql` when no database is specified.
Every snapshot follows the same layout:

- `/manifest.json`: cluster metadata captured before the dump. See
  [Snapshot manifest](#snapshot-manifest).
- `/<dbname>.sql`: single-database dump when a database is specified.
- `/all.sql`: full-server dump when no database is specified
  (`--all-databases`).

The destination connector feeds the full dump to the client tool of its
protocol.

**Pros**

- Portable across MySQL major versions.
- Human-readable SQL that can be restored without Plakar.
- Supports selective restore of individual databases.
- No server downtime required.

**Cons**

- Restore time scales with data volume.
- Does not capture user accounts or grants for single-database backups.
- MyISAM tables cannot be backed up consistently without locking.

### InnoDB and MyISAM

`single_transaction`, enabled by default, produces a consistent InnoDB snapshot
without locking tables. For databases that contain MyISAM tables, this option
does not prevent locks on those tables. Disable `single_transaction` to use
`--lock-all-tables` instead, accepting write locks for the duration of the dump.

## Backup user privileges

The backup user requires the following privileges:

```sql
-- Single database (with single_transaction=true, default)
GRANT SELECT, SHOW VIEW, TRIGGER, EVENT ON mydb.* TO 'backup'@'%';
GRANT PROCESS ON *.* TO 'backup'@'%';

-- All databases
GRANT SELECT, SHOW VIEW, TRIGGER, LOCK TABLES, EVENT, RELOAD ON *.* TO 'backup'@'%';
GRANT PROCESS ON *.* TO 'backup'@'%';
```

## MySQL and MariaDB binaries

The client binaries must match the server flavor. On Debian and Ubuntu,
`apt install default-mysql-client` installs MariaDB binaries by default,
including MariaDB's `mysqldump`. MariaDB's `mysqldump` is **not compatible**
with MySQL 8 for all-databases backups and produces dumps that fail to restore.

Check which binary is installed:

```bash
$ mysqldump --version
# MySQL:   mysqldump  Ver 8.x Distrib 8.x, for Linux (x86_64)
# MariaDB: mysqldump from 11.x.x-MariaDB ...
```

When both flavors are installed on the same machine, use `mysql_bin_dir` to
point to the correct binary directory.

## Snapshot manifest

Every snapshot produced by this integration includes a `/manifest.json` record
written before the dump data. It captures the server state at the time of
backup.

| Field               | Description                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `version`           | Manifest schema version.                                                                                                             |
| `connector`         | `mysql` or `mariadb`.                                                                                                                |
| `server_version`    | MySQL or MariaDB server version string.                                                                                              |
| `mysqldump_version` | `mysqldump` version string (or `mariadump_version` for MariaDB).                                                                     |
| `server_config`     | Key server settings: `datadir`, `hostname`, `character_set_server`, `collation_server`, `max_connections`, `gtid_mode`.              |
| `databases`         | One entry per database: name, character set, collation, tables (with engine, row estimate, columns), routines, triggers, and events. |
| `users`             | User accounts on the server. Only in full-server backups.                                                                            |
| `options`           | The effective dump options used for this backup.                                                                                     |

Metadata collection is best-effort. If a query fails, the affected field is
omitted and the backup continues normally.

## 1. `mysql` protocol

The `mysql` protocol connects to a running MySQL server, produces the dump with
`mysqldump`, and restores it with `mysql`.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR
subgraph Source["MySQL Server"]
  DB["Databases"]
end

subgraph Plakar["Plakar"]
  Connector["mysqldump"]
  Transform["Encrypt & deduplicate"]

  Connector --> Transform
end

Store["Kloset Store"]

DB --> Connector
Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR
Store["Kloset Store"]

subgraph Plakar["Plakar"]
  Transform["Decrypt & reconstruct"]
  Connector["mysql"]

  Transform --> Connector
end

subgraph Destination["MySQL Server"]
  DB["Databases"]
end

Store --> Transform
Connector --> DB
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to both source and destination connectors using the
`mysql` protocol.

| Option          | Required | Description                                                                                                        |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `location`      | Yes      | Connection URI: `mysql://[user[:password]@]host[:port][/database]`                                                 |
| `host`          | No       | Server hostname. Overrides the URI host. Defaults to `127.0.0.1`.                                                  |
| `port`          | No       | Server port. Overrides the URI port. Defaults to `3306`.                                                           |
| `username`      | No       | Username. Overrides the URI user.                                                                                  |
| `password`      | No       | Password. Overrides the URI password. Passed via `MYSQL_PWD`, never on the command line.                           |
| `mysql_bin_dir` | No       | Directory containing `mysqldump` (source) or the `mysql` binary (destination). When omitted, resolved via `$PATH`. |
| `ssl_mode`      | No       | TLS mode: `disabled`, `preferred`, `required`, `verify_ca`, `verify_identity`.                                     |
| `ssl_cert`      | No       | Path to the client SSL certificate (PEM).                                                                          |
| `ssl_cert_data` | No       | Inline PEM content of the client SSL certificate. Mutually exclusive with `ssl_cert`.                              |
| `ssl_key`       | No       | Path to the client SSL private key (PEM).                                                                          |
| `ssl_key_data`  | No       | Inline PEM content of the client SSL private key. Mutually exclusive with `ssl_key`.                               |
| `ssl_ca`        | No       | Path to the CA certificate (PEM).                                                                                  |
| `ssl_ca_data`   | No       | Inline PEM content of the CA certificate. Mutually exclusive with `ssl_ca`.                                        |

### Source configuration

The following extra options are available to source connectors using the `mysql`
protocol.

| Option               | Required | Description                                                                                                                         |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `database`           | No       | Database to back up. Overrides the URI path. If omitted, all databases are backed up.                                               |
| `single_transaction` | No       | Use `--single-transaction` for a lock-free InnoDB snapshot. Defaults to `true`.                                                     |
| `routines`           | No       | Include stored procedures and functions (`--routines`). Defaults to `true`.                                                         |
| `events`             | No       | Include event scheduler events (`--events`). Defaults to `true`.                                                                    |
| `triggers`           | No       | Include triggers. Set to `false` to pass `--skip-triggers`. Defaults to `true`.                                                     |
| `no_data`            | No       | Dump schema only, no data (`--no-data`). Mutually exclusive with `no_create_info`. Defaults to `false`.                             |
| `no_create_info`     | No       | Dump data only, no schema (`--no-create-info`). Mutually exclusive with `no_data`. Defaults to `false`.                             |
| `no_tablespaces`     | No       | Suppress tablespace statements (`--no-tablespaces`). Defaults to `true`.                                                            |
| `hex_blob`           | No       | Encode BINARY/BLOB columns as hex (`--hex-blob`). Defaults to `false`.                                                              |
| `column_statistics`  | No       | Query `COLUMN_STATISTICS`. Set to `false` (`--column-statistics=0`) when using mysqldump 8.0 against MySQL 5.7. Defaults to `true`. |
| `set_gtid_purged`    | No       | GTID mode: `AUTO`, `ON`, or `OFF`. Defaults to `AUTO`. See [GTIDs](#gtids).                                                         |

### Destination configuration

The following extra options are available to destination connectors using the
`mysql` protocol.

| Option      | Required | Description                                                                   |
| ----------- | -------- | ----------------------------------------------------------------------------- |
| `database`  | No       | Target database. Inferred from the dump filename if omitted.                  |
| `create_db` | No       | Issue `CREATE DATABASE IF NOT EXISTS` before restoring. Defaults to `false`.  |
| `force`     | No       | Pass `--force` to continue on SQL errors during restore. Defaults to `false`. |

### Example

Back up a single database, all databases, or the schema only:

```bash
# Back up a single database
$ plakar source add mydb mysql://dbuser:secret@db.example.com/mydb
$ plakar at /var/backups backup "@mydb"

# Back up all databases
$ plakar source add alldb mysql://root:secret@db.example.com
$ plakar at /var/backups backup "@alldb"

# Schema only
$ plakar source add mydb mysql://dbuser:secret@db.example.com/mydb \
  no_data=true
$ plakar at /var/backups backup "@mydb"
```

Restore into an existing database, create the database first, or restore all
databases:

```bash
# Restore into an existing database
$ plakar destination add mydbdst mysql://dbuser:secret@target.example.com/mydb
$ plakar at /var/backups restore -to "@mydbdst" <snapshot_id>

# Create the database and restore
$ plakar destination add mydbdst mysql://dbuser:secret@target.example.com/mydb \
  create_db=true
$ plakar at /var/backups restore -to "@mydbdst" <snapshot_id>

# Restore all databases
$ plakar destination add mydbdst mysql://root:secret@target.example.com
$ plakar at /var/backups restore -to "@mydbdst" <snapshot_id>
```

## 2. `mysql+mariadb` protocol

The `mysql+mariadb` protocol works identically to `mysql`, but invokes
`mariadb-dump` for backup and `mariadb` for restore. It is used when targeting a
MariaDB server, to avoid binary-compatibility issues.

### Configuration

`mysql+mariadb://` supports the same source and destination options as
`mysql://`, with the following differences:

| Option            | Required | Description                                                                |
| ----------------- | -------- | -------------------------------------------------------------------------- |
| `mariadb_bin_dir` | No       | Directory containing `mariadb-dump` / `mariadb`. Replaces `mysql_bin_dir`. |

The `column_statistics` and `set_gtid_purged` options are MySQL-only and have no
effect on `mysql+mariadb://`.

### Example

```bash
# Back up a single MariaDB database
$ plakar source add mydb mysql+mariadb://dbuser:secret@db.example.com/mydb
$ plakar at /var/backups backup "@mydb"

# Back up all MariaDB databases
$ plakar source add alldb mysql+mariadb://root:secret@db.example.com
$ plakar at /var/backups backup "@alldb"

# Restore
$ plakar destination add mydbdst mysql+mariadb://dbuser:secret@target.example.com/mydb \
  create_db=true
$ plakar at /var/backups restore -to "@mydbdst" <snapshot_id>
```

## 3. `mysql+gcsql` protocol

The `mysql+gcsql` protocol targets MySQL databases hosted on Google Cloud SQL.
Plakar opens an encrypted connection to the instance itself, through the
[Cloud SQL Go connector](https://github.com/GoogleCloudPlatform/cloud-sql-go-connector),
so no separate Cloud SQL Auth Proxy needs to run. It authenticates to Google
Cloud with Application Default Credentials.

### Configuration

The connector supports the same source and destination options as `mysql://`,
except `port` and the `ssl_*` options. The `host` option is required and holds
the instance connection name, in the form `project:region:instance`. It has no
default.

### Example

```bash
$ plakar source add mygcs mysql+gcsql://dbuser:secret@localhost/mydb \
  host=my-project:europe-west1:my-instance
$ plakar at /var/backups backup "@mygcs"
```

## Restore considerations

### GTIDs

When the server has GTIDs enabled (`gtid_mode=ON`), `mysqldump` includes
`SET @@GLOBAL.GTID_PURGED` statements. Restoring to a server that already has
GTID history fails. There are two ways to avoid this:

- Set `set_gtid_purged=OFF` on the source to omit GTID information from the
  dump.
- Run `RESET MASTER` on the target server before restoring.

### User and grant migration

Single-database backups do not include user accounts or grants. To migrate
users:

- Use an all-databases backup, which includes the `mysql` system database.
- Export grants manually with a tool like `pt-show-grants` (Percona Toolkit).
- Recreate user accounts manually on the target server.

## Limitations and scope

The integration takes logical dumps only, through `mysqldump` or `mariadb-dump`.
Physical backups are not supported. For a physical backup, stop the server and
use Plakar's filesystem backup on the data directory directly.

There is no per-table filtering. The entire database, or all databases, is
dumped. There is also no data or schema filtering at restore time. The full dump
is always piped to the client CLI.

## See also

- [Logical backups with SQL dumps](../guides/mysql/sqldump/)
- [Physical backups](../guides/mysql/physical-backups/)
- [MySQL integration GitHub](https://github.com/PlakarKorp/integrations/tree/main/mysql)
- [mysqldump reference](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html)
- [mariadb-dump reference](https://mariadb.com/kb/en/mariadb-dump/)
