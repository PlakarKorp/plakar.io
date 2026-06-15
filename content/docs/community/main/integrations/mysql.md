---
title: "MySQL / MariaDB"
date: "2026-06-12T00:00:00Z"
weight: 16
summary:
  "Back up and restore MySQL and MariaDB databases with Plakar — logical dumps
  via mysqldump and mariadb-dump, with Google Cloud SQL support."
---

# MySQL / MariaDB

The **MySQL / MariaDB integration** performs logical backups of MySQL and
MariaDB databases using `mysqldump` and `mariadb-dump`. These backups produce
standard SQL files that are human-readable and can be restored without Plakar if
needed.

| Protocol           | Target                    | Dump tool      | Restore tool |
| ------------------ | ------------------------- | -------------- | ------------ |
| `mysql://`         | MySQL 5.7 / 8.x           | `mysqldump`    | `mysql`      |
| `mysql+mariadb://` | MariaDB 10.x / 11.x       | `mariadb-dump` | `mariadb`    |
| `mysql+gcsql://`   | MySQL on Google Cloud SQL | `mysqldump`    | `mysql`      |

`mysql://` and `mysql+mariadb://` are independent connectors: each always uses
its own set of binaries regardless of the server at the other end.

**Typical use cases**

- Scheduled logical backups of application databases with cross-version
  portability.
- Full-cluster dumps including stored procedures, events, and triggers.
- MariaDB-specific backups that require `mariadb-dump` semantics.
- Cloud SQL backups via the Cloud SQL Auth Proxy.

## Installation

The MySQL / MariaDB integration is distributed as a Plakar package.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

> [!NOTE]+
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

```bash
$ plakar pkg add mysql
```

Verify installation:

```bash
$ plakar pkg list
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
$ plakar pkg add ./mysql_v1.0.0_linux_amd64.ptar
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see the
[managing packages guide](../../guides/managing-packages/).

## Logical backup - `mysql://`

### How it works

The connector invokes `mysqldump` to produce a single SQL file per database, or
a combined `all.sql` when no database is specified. Every snapshot follows the
same layout:

- `/manifest.json`: cluster metadata captured before the dump (see
  [Snapshot manifest](#snapshot-manifest)).
- `/<dbname>.sql`: single-database dump when a database is specified.
- `/all.sql`: full-server dump when no database is specified
  (`--all-databases`).

**Pros**

- Portable across MySQL major versions.
- Human-readable SQL that can be restored without Plakar.
- Supports selective restore of individual databases.
- No server downtime required.

**Cons**

- Restore time scales with data volume.
- Does not capture user accounts or grants for single-database backups.
- MyISAM tables cannot be backed up consistently without locking.

### Prerequisites

The following tools must be available in `$PATH` on the machine running Plakar
(provided by the `mysql-client` package, or the MySQL distribution):

- `mysqldump`: for backup
- `mysql`: for restore

The backup user requires the following privileges:

```sql
-- Single database (with single_transaction=true, default)
GRANT SELECT, SHOW VIEW, TRIGGER, EVENT ON mydb.* TO 'backup'@'%';
GRANT PROCESS ON *.* TO 'backup'@'%';

-- All databases
GRANT SELECT, SHOW VIEW, TRIGGER, LOCK TABLES, EVENT, RELOAD ON *.* TO 'backup'@'%';
GRANT PROCESS ON *.* TO 'backup'@'%';
```

> [!WARNING]+
>
> Binary compatibility On Debian and Ubuntu, `apt install default-mysql-client`
> installs MariaDB's `mysqldump` by default. MariaDB's `mysqldump` is **not
> compatible** with MySQL 8 for all-databases backups and produces dumps that
> fail to restore. Verify you have the correct binary:
>
> ```bash
> $ mysqldump --version
> # MySQL:   mysqldump  Ver 8.x Distrib 8.x, for Linux (x86_64)
> # MariaDB: mysqldump from 11.x.x-MariaDB ...
> ```
>
> Use `mysql_bin_dir` to point to the correct binary directory if both are
> installed.

### Source connector

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

#### Source options

| Option               | Default     | Description                                                                                                     |
| -------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| `location`           | —           | Connection URI: `mysql://[user[:password]@]host[:port][/database]`                                              |
| `host`               | `127.0.0.1` | Server hostname. Overrides the URI host.                                                                        |
| `port`               | `3306`      | Server port. Overrides the URI port.                                                                            |
| `username`           | —           | Username. Overrides the URI user.                                                                               |
| `password`           | —           | Password. Overrides the URI password. Passed via `MYSQL_PWD`, never on the command line.                        |
| `database`           | —           | Database to back up. Overrides the URI path. If omitted, all databases are backed up.                           |
| `single_transaction` | `true`      | Use `--single-transaction` for a lock-free InnoDB snapshot.                                                     |
| `routines`           | `true`      | Include stored procedures and functions (`--routines`).                                                         |
| `events`             | `true`      | Include event scheduler events (`--events`).                                                                    |
| `triggers`           | `true`      | Include triggers. Set to `false` to pass `--skip-triggers`.                                                     |
| `no_data`            | `false`     | Dump schema only, no data (`--no-data`). Mutually exclusive with `no_create_info`.                              |
| `no_create_info`     | `false`     | Dump data only, no schema (`--no-create-info`). Mutually exclusive with `no_data`.                              |
| `no_tablespaces`     | `true`      | Suppress tablespace statements (`--no-tablespaces`).                                                            |
| `hex_blob`           | `false`     | Encode BINARY/BLOB columns as hex (`--hex-blob`).                                                               |
| `column_statistics`  | `true`      | Query `COLUMN_STATISTICS`. Set to `false` (`--column-statistics=0`) when using mysqldump 8.0 against MySQL 5.7. |
| `set_gtid_purged`    | `AUTO`      | GTID mode: `AUTO`, `ON`, or `OFF`.                                                                              |
| `mysql_bin_dir`      | —           | Directory containing `mysqldump`. When omitted, resolved via `$PATH`.                                           |
| `ssl_mode`           | —           | TLS mode: `disabled`, `preferred`, `required`, `verify_ca`, `verify_identity`.                                  |
| `ssl_cert`           | —           | Path to the client SSL certificate (PEM).                                                                       |
| `ssl_key`            | —           | Path to the client SSL private key (PEM).                                                                       |
| `ssl_ca`             | —           | Path to the CA certificate (PEM).                                                                               |

### Destination connector

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

#### Destination options

| Option          | Default     | Description                                                                  |
| --------------- | ----------- | ---------------------------------------------------------------------------- |
| `location`      | —           | Connection URI: `mysql://[user[:password]@]host[:port][/database]`           |
| `host`          | `127.0.0.1` | Server hostname. Overrides the URI host.                                     |
| `port`          | `3306`      | Server port. Overrides the URI port.                                         |
| `username`      | —           | Username. Overrides the URI user.                                            |
| `password`      | —           | Password. Overrides the URI password.                                        |
| `database`      | —           | Target database. Inferred from the dump filename if omitted.                 |
| `create_db`     | `false`     | Issue `CREATE DATABASE IF NOT EXISTS` before restoring.                      |
| `force`         | `false`     | Pass `--force` to continue on SQL errors during restore.                     |
| `mysql_bin_dir` | —           | Directory containing the `mysql` binary. When omitted, resolved via `$PATH`. |
| `ssl_mode`      | —           | TLS mode (same values as source).                                            |
| `ssl_cert`      | —           | Path to the client SSL certificate (PEM).                                    |
| `ssl_key`       | —           | Path to the client SSL private key (PEM).                                    |
| `ssl_ca`        | —           | Path to the CA certificate (PEM).                                            |

## Logical backup - `mysql+mariadb://`

`mysql+mariadb://` works identically to `mysql://` but invokes `mariadb-dump`
for backup and `mariadb` for restore. This connector is used when targeting a
MariaDB server to avoid binary-compatibility issues.

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

`mysql+mariadb://` supports the same source and destination options as
`mysql://`, with the following differences:

| Option            | Default | Description                                                                |
| ----------------- | ------- | -------------------------------------------------------------------------- |
| `mariadb_bin_dir` | —       | Directory containing `mariadb-dump` / `mariadb`. Replaces `mysql_bin_dir`. |

The `column_statistics` and `set_gtid_purged` options are MySQL-only and have no
effect on `mysql+mariadb://`.

## Google Cloud SQL - `mysql+gcsql://`

`mysql+gcsql://` targets MySQL databases hosted on Google Cloud SQL. It uses the
[Cloud SQL Auth Proxy](https://cloud.google.com/sql/docs/mysql/sql-proxy) to
establish an encrypted connection, making the experience equivalent to
connecting to a local MySQL server.

The connector supports the same source and destination options as `mysql://`.
The Cloud SQL Auth Proxy must be running and accessible on the configured host
and port before Plakar connects.

```bash
# Assuming the proxy is running on localhost:3306
$ plakar source add mygcs mysql+gcsql://dbuser:secret@127.0.0.1:3306/mydb
$ plakar at /var/backups backup "@mygcs"
```

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
| `options`           | The effective dump options used for this backup.                                                                                     |

Metadata collection is best-effort: if a query fails, the affected field is
omitted and the backup continues normally.

## Considerations

### MySQL vs MariaDB binaries

Always use binaries that match your server flavor. On Debian and Ubuntu,
`apt install default-mysql-client` installs MariaDB binaries by default.
MariaDB's `mysqldump` produces dumps that fail to restore against MySQL 8 for
all-databases backups. Use `mysql_bin_dir` to point to the correct binaries when
both flavors are installed on the same machine.

### InnoDB and MyISAM

`single_transaction` (enabled by default) produces a consistent InnoDB snapshot
without locking tables. For databases that contain MyISAM tables, this option
does not prevent locks on those tables. Disable `single_transaction` to use
`--lock-all-tables` instead, accepting write locks for the duration of the dump.

### GTIDs

When the server has GTIDs enabled (`gtid_mode=ON`), `mysqldump` includes
`SET @@GLOBAL.GTID_PURGED` statements. Restoring to a server that already has
GTID history will fail. Options:

- Set `set_gtid_purged=OFF` on the source to omit GTID information from the
  dump.
- Run `RESET MASTER` on the target server before restoring.

### User and grant migration

Single-database backups do not include user accounts or grants. To migrate
users:

- Use an all-databases backup, which includes the `mysql` system database.
- Export grants manually with a tool like `pt-show-grants` (Percona Toolkit).
- Recreate user accounts manually on the target server.

## Known limitations

- **Physical backup not supported**: Only logical dumps via `mysqldump` /
  `mariadb-dump`. For physical backups, stop the server and use Plakar's
  filesystem backup on the data directory directly.
- **No per-table filtering**: The entire database (or all databases) is dumped.
- **No restore-time data/schema filtering**: The full dump is always piped to
  the client CLI.

## See also

- [Logical backups with SQL dumps](../guides/mysql/sqldump/)
- [Physical backups](../guides/mysql/physical-backups/)
- [MySQL integration GitHub](https://github.com/PlakarKorp/integrations/tree/main/mysql)
- [mysqldump reference](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html)
- [mariadb-dump reference](https://mariadb.com/kb/en/mariadb-dump/)
