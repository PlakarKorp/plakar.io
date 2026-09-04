
# MySQL / MariaDB

The MySQL integration allows Plakar Control Plane to back up and restore MySQL
and MariaDB databases. The integration supports multiple protocols.

## Inventory Management

[Managed inventories](../../infrastructure/inventories#managed-inventories) can
discover MySQL databases automatically on AWS (RDS instances and clusters),
Scaleway (managed Database instances), etc. For self-hosted MySQL servers not
covered by managed discovery, you can instead set up a
[self-managed inventory](../../infrastructure/inventories/self-managed) and add
the resource manually.

### Adding MySQL as a resource

When using a self-managed inventory, register the resource with `Database` as
the class. For the endpoint, use the hostname or IP address of the MySQL server.
See [resources documentation](../../resources) for more information on how to
set up resources on a self-managed inventory.

## 1. `mysql` protocol

The `mysql` protocol connects directly to a running MySQL server over the
network and produces a logical, SQL-level dump using `mysqldump`. Restoring
applies the dump to a running MySQL server using the `mysql` client, so a
reachable server is required for both backup and restore.

Every snapshot contains a single `<dbname>.sql` file when one database is
selected, or a combined `all.sql` file covering every database when none is
specified.

> [!NOTE]
>
> On Debian and Ubuntu, `apt install default-mysql-client` installs MariaDB's
> `mysqldump` by default, which is not compatible with MySQL 8 for all-databases
> backups and produces dumps that fail to restore. Verify the installed binary
> is MySQL's own `mysqldump` before relying on this protocol.

> [!NOTE]
>
> The backup user requires `SELECT`, `SHOW VIEW`, `TRIGGER`, and `EVENT`
> privileges on the databases being backed up, plus `PROCESS` on `*.*`. Backing
> up all databases also requires `LOCK TABLES` and `RELOAD` on `*.*`.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph MySQL["MySQL Server"]
    DB["Databases"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["MySQL<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"mysqldump"| DB
  DB --> Source
  Source --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["MySQL<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph MySQL["MySQL Server"]
    DB["Databases"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"mysql"| DB
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following settings are available when configuring both source and
destination apps using the `mysql` protocol.

- **Password**: MySQL password. Overrides the password in the location URI.
  Never appears on the command line; passed via `MYSQL_PWD`.
- **Ssl Mode**: SSL/TLS mode for the connection, passed via `--ssl-mode`. Not
  set by default, letting the server decide.
- **Username**: MySQL username. Overrides the username in the location URI.

### Source configuration

The following extra settings are available when configuring a source app using
the `mysql` protocol.

- **Column Statistics**: Query `information_schema.COLUMN_STATISTICS` for
  histogram data. Enabled by default, matching `mysqldump` 8.0 behavior. Disable
  to pass `--column-statistics=0`, required when the `mysqldump` binary is 8.0
  but the source server is MySQL 5.7 or MariaDB.
- **Database**: Name of the database to back up. If omitted, all non-system
  databases are backed up using `--all-databases`. Overrides the database in the
  location URI.
- **Events**: Include event scheduler events, passing `--events`. Enabled by
  default.
- **Hex Blob**: Dump `BINARY`, `VARBINARY`, `BLOB`, and `BIT` columns using
  hexadecimal notation, passing `--hex-blob`. Useful when the dump may be loaded
  on a system with different character set settings.
- **No Create Info**: Dump only `INSERT` statements, no DDL, passing
  `--no-create-info`. Mutually exclusive with **No Data**.
- **No Data**: Dump only DDL statements, no `INSERT` rows, passing `--no-data`.
  Mutually exclusive with **No Create Info**.
- **No Tablespaces**: Suppress `CREATE LOGFILE GROUP` and `CREATE TABLESPACE`
  statements, passing `--no-tablespaces`. Enabled by default; recommended for
  restoring to managed or cloud MySQL instances that do not support custom
  tablespaces.
- **Routines**: Include stored procedures and functions, passing `--routines`.
  Enabled by default.
- **Set Gtid Purged**: Controls the `SET @@GLOBAL.GTID_PURGED` statement in the
  dump, passed via `--set-gtid-purged`. `AUTO` (default) includes it only when
  GTIDs are enabled on the server. Use `OFF` when restoring to a server that
  already has GTID history.
- **Single Transaction**: Use `--single-transaction` for a consistent InnoDB
  snapshot without locking tables. Enabled by default and strongly recommended
  for production InnoDB databases. MyISAM tables still require table locks even
  with this option.
- **Triggers**: Include triggers. Enabled by default; disable to pass
  `--skip-triggers`.

### Destination configuration

The following extra settings are available when configuring a destination app
using the `mysql` protocol.

- **Create Db**: Issue `CREATE DATABASE IF NOT EXISTS` before restoring a
  single-database dump. Disabled by default.
- **Database**: Target database for restore. If omitted, the database name is
  inferred from the dump filename (e.g. `mydb.sql` -> `mydb`). Not used when
  restoring an `all.sql` dump.
- **Force**: Continue the restore after SQL errors, passing `--force` to
  `mysql`. Disabled by default.

## 2. `mysql+gcsql` protocol

The `mysql+gcsql` protocol targets MySQL databases hosted on Google Cloud SQL.
Plakar Control Plane connects through the Cloud SQL Auth Proxy, which
establishes an encrypted tunnel to the Cloud SQL instance and makes the
connection behave like a normal MySQL server. Backup and restore otherwise work
exactly like the `mysql` protocol, using `mysqldump` and `mysql`.

> [!NOTE]
>
> The Cloud SQL Auth Proxy must already be running and reachable at the
> configured host and port before Plakar Control Plane connects. Since the proxy
> handles encryption, there is no separate SSL mode setting for this protocol.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph GCP["Google Cloud SQL"]
    DB["Databases"]
  end

  subgraph CloudSQLProxy["Cloud SQL Auth Proxy"]
    Proxy["Auth Proxy"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["MySQL<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"mysqldump"| Proxy
  Proxy -->|"encrypted tunnel"| DB
  Source --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["MySQL<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph CloudSQLProxy["Cloud SQL Auth Proxy"]
    Proxy["Auth Proxy"]
  end

  subgraph GCP["Google Cloud SQL"]
    DB["Databases"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"mysql"| Proxy
  Proxy -->|"encrypted tunnel"| DB
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following settings are available when configuring both source and
destination apps using the `mysql+gcsql` protocol.

- **Password**: MySQL password. Overrides the password in the location URI.
  Never appears on the command line; passed via `MYSQL_PWD`.
- **Username**: MySQL username. Overrides the username in the location URI.

### Source configuration

The following extra settings are available when configuring a source app using
the `mysql+gcsql` protocol.

- **Column Statistics**: Query `information_schema.COLUMN_STATISTICS` for
  histogram data. Enabled by default, matching `mysqldump` 8.0 behavior. Disable
  to pass `--column-statistics=0`, required when the `mysqldump` binary is 8.0
  but the source server is MySQL 5.7 or MariaDB.
- **Database**: Name of the database to back up. If omitted, all non-system
  databases are backed up using `--all-databases`. Overrides the database in the
  location URI.
- **Events**: Include event scheduler events, passing `--events`. Enabled by
  default.
- **Hex Blob**: Dump `BINARY`, `VARBINARY`, `BLOB`, and `BIT` columns using
  hexadecimal notation, passing `--hex-blob`. Useful when the dump may be loaded
  on a system with different character set settings.
- **No Create Info**: Dump only `INSERT` statements, no DDL, passing
  `--no-create-info`. Mutually exclusive with **No Data**.
- **No Data**: Dump only DDL statements, no `INSERT` rows, passing `--no-data`.
  Mutually exclusive with **No Create Info**.
- **No Tablespaces**: Suppress `CREATE LOGFILE GROUP` and `CREATE TABLESPACE`
  statements, passing `--no-tablespaces`. Enabled by default; recommended for
  restoring to managed or cloud MySQL instances that do not support custom
  tablespaces.
- **Routines**: Include stored procedures and functions, passing `--routines`.
  Enabled by default.
- **Set Gtid Purged**: Controls the `SET @@GLOBAL.GTID_PURGED` statement in the
  dump, passed via `--set-gtid-purged`. `AUTO` (default) includes it only when
  GTIDs are enabled on the server. Use `OFF` when restoring to a server that
  already has GTID history.
- **Single Transaction**: Use `--single-transaction` for a consistent InnoDB
  snapshot without locking tables. Enabled by default and strongly recommended
  for production InnoDB databases. MyISAM tables still require table locks even
  with this option.
- **Triggers**: Include triggers. Enabled by default; disable to pass
  `--skip-triggers`.

### Destination configuration

The following extra settings are available when configuring a destination app
using the `mysql+gcsql` protocol.

- **Create Db**: Issue `CREATE DATABASE IF NOT EXISTS` before restoring a
  single-database dump. Disabled by default.
- **Database**: Target database for restore. If omitted, the database name is
  inferred from the dump filename (e.g. `mydb.sql` -> `mydb`). Not used when
  restoring an `all.sql` dump.
- **Force**: Continue the restore after SQL errors, passing `--force` to
  `mysql`. Disabled by default.

## 3. `mysql+mariadb` protocol

The `mysql+mariadb` protocol works identically to `mysql`, but invokes
`mariadb-dump` for backup and `mariadb` for restore instead of `mysqldump` and
`mysql`. Use this protocol when targeting a MariaDB server, to avoid the
binary-compatibility issues that can occur when a MySQL-built `mysqldump`
connects to a MariaDB server or vice versa.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph MariaDB["MariaDB Server"]
    DB["Databases"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["MySQL<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"mariadb-dump"| DB
  DB --> Source
  Source --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["MySQL<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph MariaDB["MariaDB Server"]
    DB["Databases"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"mariadb"| DB
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following settings are available when configuring both source and
destination apps using the `mysql+mariadb` protocol.

- **Password**: MariaDB password. Overrides the password in the location URI.
  Never appears on the command line; passed via `MYSQL_PWD`.
- **Ssl Mode**: SSL/TLS mode for the connection, passed via `--ssl-mode`. Not
  set by default, letting the server decide.
- **Username**: MariaDB username. Overrides the username in the location URI.

### Source configuration

The following extra settings are available when configuring a source app using
the `mysql+mariadb` protocol.

- **Database**: Name of the database to back up. If omitted, all non-system
  databases are backed up using `--all-databases`. Overrides the database in the
  location URI.
- **Events**: Include event scheduler events, passing `--events`. Enabled by
  default.
- **Hex Blob**: Dump `BINARY`, `VARBINARY`, `BLOB`, and `BIT` columns using
  hexadecimal notation, passing `--hex-blob`. Useful when the dump may be loaded
  on a system with different character set settings.
- **No Create Info**: Dump only `INSERT` statements, no DDL, passing
  `--no-create-info`. Mutually exclusive with **No Data**.
- **No Data**: Dump only DDL statements, no `INSERT` rows, passing `--no-data`.
  Mutually exclusive with **No Create Info**.
- **No Tablespaces**: Suppress `CREATE LOGFILE GROUP` and `CREATE TABLESPACE`
  statements, passing `--no-tablespaces`. Enabled by default; recommended for
  restoring to managed MariaDB instances.
- **Routines**: Include stored procedures and functions, passing `--routines`.
  Enabled by default.
- **Single Transaction**: Use `--single-transaction` for a consistent InnoDB
  snapshot without locking tables. Enabled by default and strongly recommended
  for production InnoDB databases.
- **Triggers**: Include triggers. Enabled by default; disable to pass
  `--skip-triggers`.

### Destination configuration

The following extra settings are available when configuring a destination app
using the `mysql+mariadb` protocol.

- **Create Db**: Issue `CREATE DATABASE IF NOT EXISTS` before restoring a
  single-database dump. Disabled by default.
- **Database**: Target database for restore. If omitted, the database name is
  inferred from the dump filename (e.g. `mydb.sql` -> `mydb`). Not used when
  restoring an `all.sql` dump.
- **Force**: Continue the restore after SQL errors, passing `--force` to
  `mariadb`. Disabled by default.
- **Ssl Mode**: SSL/TLS mode for the connection, passed via `--ssl-mode`. Not
  set by default, letting the server decide.

