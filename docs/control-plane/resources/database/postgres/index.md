
# PostgreSQL

The PostgreSQL integration allows Plakar Control Plane to back up and restore
PostgreSQL databases. The integration supports multiple protocols.

## Inventory Management

[Managed inventories](../../infrastructure/inventories#managed-inventories) can
discover PostgreSQL databases automatically on AWS (RDS instances and clusters),
Scaleway (managed Database instances), etc. For self-hosted PostgreSQL servers
not covered by managed discovery, you can instead set up a
[self-managed inventory](../../infrastructure/inventories/self-managed) and add
the resource manually.

### Adding PostgreSQL as a resource

When using a self-managed inventory, register the resource with `Database` as
the class. For the endpoint, use the hostname or IP address of the PostgreSQL
server. See [resources documentation](../../resources) for more information on
how to set up resources on a self-managed inventory.

## 1. `postgres` protocol

The `postgres` protocol connects directly to a running PostgreSQL server over
the network and produces a logical, SQL-level dump using `pg_dump` and
`pg_dumpall`. Restoring applies the dump to a running PostgreSQL server using
`pg_restore` and `psql`, so a reachable server is required for both backup and
restore.

Every snapshot contains a `00000-globals.sql` file with cluster-wide roles and
tablespaces, plus one `.dump` file per database. When a single database is
selected, only that database and the globals file are backed up; otherwise every
connectable database is dumped individually.

> [!NOTE]
>
> The PostgreSQL user used for backup should be a superuser so that `pg_dumpall`
> can include role passwords. On managed services such as Amazon RDS, where the
> administrative user is a restricted superuser, role passwords cannot be read
> and restored roles will have no password set.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Postgres["PostgreSQL Server"]
    DB["Databases"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["PostgreSQL<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"pg_dump / pg_dumpall"| DB
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
    Destination["PostgreSQL<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Postgres["PostgreSQL Server"]
    DB["Databases"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"pg_restore / psql"| DB
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following settings are available when configuring both source and
destination apps using the `postgres` protocol.

- **Password**: PostgreSQL password. Overrides the password in the location URI.
- **Port**: PostgreSQL server port. Defaults to `5432`. Overrides the port in
  the location URI.
- **Ssl Cert Data**: Inline PEM content of the client SSL certificate.
  Alternative to `ssl_cert`.
- **Ssl Key Data**: Inline PEM content of the client SSL private key.
  Alternative to `ssl_key`.
- **Ssl Mode**: SSL mode for the connection, passed via `PGSSLMODE`. Defaults to
  `prefer`.
- **Ssl Root Cert Data**: Inline PEM content of the root CA certificate.
  Alternative to `ssl_root_cert`.
- **Username**: PostgreSQL username. Overrides the username in the location URI.

### Source configuration

The following extra settings are available when configuring a source app using
the `postgres` protocol.

- **Compress**: Enable `pg_dump` compression. Disabled by default so that
  Plakar's own compression is not degraded.
- **Data Only**: Dump only the data, passing `-a` to `pg_dump`. Mutually
  exclusive with **Schema Only**.
- **Database**: Name of the database to back up. If omitted, all connectable
  databases are backed up individually. Overrides the database in the location
  URI.
- **Exclude Databases**: Comma-separated list of database names to skip during a
  full backup. Has no effect when a single database is selected via **Database**
  or the location URI. Example: `rdsadmin,template1`.
- **Schema Only**: Dump only the schema, passing `-s` to `pg_dump`. Mutually
  exclusive with **Data Only**.

### Destination configuration

The following extra settings are available when configuring a destination app
using the `postgres` protocol.

- **Clean**: Drop objects within the target database before recreating them,
  passing `--clean --if-exists` to `pg_restore`. The database must already
  exist. Mutually exclusive with **Recreate**.
- **Data Only**: Restore only the data, passing `-a` to `pg_restore`. Mutually
  exclusive with **Schema Only**.
- **Database**: Target database for `pg_restore`. If omitted, the database name
  is inferred from the dump filename. Not used with **Recreate**, since the name
  is taken from the archive metadata in that case.
- **Databases**: Comma-separated list of database names to restore. Only `.dump`
  files matching one of these names are restored; all others are skipped.
  Globals (`00000-globals.sql`) are always restored when present, unless **No
  Globals** is enabled. Example: `myapp,myother`.
- **Exit On Error**: Stop the restore on the first error, passing `-e` to
  `pg_restore` and `ON_ERROR_STOP=1` to `psql`.
- **No Globals**: Skip restoring `00000-globals.sql`. By default, globals are
  restored automatically when present.
- **No Owner**: Skip `ALTER OWNER` statements, passing `--no-owner` to
  `pg_restore`. Useful when the roles from the source server do not exist on the
  target server.
- **Recreate**: Drop and recreate the target database from the archive metadata,
  passing `-C --clean --if-exists` to `pg_restore`. The target database name is
  taken from the archive. The `postgres` database is never dropped; it is
  restored with `--clean --if-exists` instead, mirroring `pg_dumpall` behavior.
  Mutually exclusive with **Clean**.
- **Schema Only**: Restore only the schema, passing `-s` to `pg_restore`.
  Mutually exclusive with **Data Only**.

## 2. `postgres+bin` protocol

The `postgres+bin` protocol runs `pg_basebackup` to stream the entire PostgreSQL
data directory (`PGDATA`) from the server's replication interface, producing a
physical, file-level backup of the whole cluster: every database, configuration
file, and the WAL segments required for a consistent recovery. No subpath or
single-database selection is supported; `pg_basebackup` always backs up the
whole cluster.

> [!NOTE]
>
> The PostgreSQL server must have `wal_level = replica` (or higher), a user with
> the `REPLICATION` privilege (or a superuser), and `pg_hba.conf` allowing a
> replication connection from Plakar Control Plane.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Postgres["PostgreSQL Server"]
    PGDATA["PGDATA<br/>(entire data directory)"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["PostgreSQL<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"pg_basebackup (replication stream)"| PGDATA
  PGDATA --> Source
  Source --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Source configuration

The following extra settings are available when configuring a source app using
the `postgres+bin` protocol.

- **Password**: PostgreSQL password. Overrides the password in the location URI.
- **Port**: PostgreSQL server port. Defaults to `5432`. Overrides the port in
  the location URI.
- **Ssl Cert Data**: Inline PEM content of the client SSL certificate.
  Alternative to `ssl_cert`.
- **Ssl Key Data**: Inline PEM content of the client SSL private key.
  Alternative to `ssl_key`.
- **Ssl Mode**: SSL mode for the connection, passed via `PGSSLMODE`. Defaults to
  `prefer`.
- **Ssl Root Cert Data**: Inline PEM content of the root CA certificate.
  Alternative to `ssl_root_cert`.
- **Username**: PostgreSQL replication username. Overrides the username in the
  location URI.

### Restoring a physical backup

There is no dedicated destination app for `postgres+bin`. Since the snapshot
contains plain files, restoring means writing them back to disk with a generic
file-restore destination app. The restored directory is a valid PostgreSQL data
directory that can be started directly, using a PostgreSQL binary of the same
major version that produced the backup.

> [!WARNING]
>
> The target server must be stopped before its data directory is replaced with
> the restored files.

## 3. `postgres+aws` protocol

The `postgres+aws` protocol performs the same logical backup as `postgres`, but
authenticates using a short-lived IAM token instead of a static password. The
token is generated automatically from Plakar Control Plane's AWS credentials
before `pg_dump`, `pg_dumpall`, `pg_restore`, or `psql` run, so no password is
needed or accepted. The backup output is identical to `postgres` and can be
restored with either protocol.

Using this protocol requires:

- [IAM database authentication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Enabling.html)
  enabled on the RDS instance.
- An IAM policy granting `rds-db:connect`, scoped to the RDS resource ID and
  database user, attached to the credentials Plakar Control Plane uses to
  authenticate with AWS. See
  [Managing IAM Roles, Users, and Access Keys on AWS](../../../guides/aws/iam-users-roles-and-access-keys)
  for instructions on creating and attaching IAM policies.
- A PostgreSQL user granted the `rds_iam` role, with no password set, since
  authentication is handled entirely through the IAM token:

  ```sql
  CREATE USER myuser WITH LOGIN;
  GRANT rds_iam TO myuser;
  ```

Since IAM authentication requires an encrypted connection, **Ssl Mode** must be
set to `require` or higher.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph RDS["Amazon RDS"]
    DB["Databases"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["PostgreSQL<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"pg_dump / pg_dumpall (IAM auth)"| DB
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
    Destination["PostgreSQL<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph RDS["Amazon RDS"]
    DB["Databases"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"pg_restore / psql (IAM auth)"| DB
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following settings are available when configuring both source and
destination apps using the `postgres+aws` protocol.

- **Port**: RDS instance port. Defaults to `5432`. Overrides the port in the
  location URI.
- **Region**: Required. AWS region of the RDS instance, e.g. `us-east-1`. Passed
  to `aws rds generate-db-auth-token --region`.
- **Ssl Cert Data**: Inline PEM content of the client SSL certificate.
  Alternative to `ssl_cert`.
- **Ssl Key Data**: Inline PEM content of the client SSL private key.
  Alternative to `ssl_key`.
- **Ssl Mode**: SSL mode for the connection, passed via `PGSSLMODE`. IAM
  authentication requires an encrypted connection. Use `require` or higher.
- **Ssl Root Cert Data**: Inline PEM content of the root CA certificate.
  Alternative to `ssl_root_cert`.
- **Username**: Required. PostgreSQL username to authenticate as. Must be an
  IAM-enabled database user. Overrides the username in the location URI.

### Source configuration

The following extra settings are available when configuring a source app using
the `postgres+aws` protocol.

- **Compress**: Enable `pg_dump` compression. Disabled by default so that
  Plakar's own compression is not degraded.
- **Data Only**: Dump only the data, passing `-a` to `pg_dump`. Mutually
  exclusive with **Schema Only**.
- **Database**: Name of the database to back up. If omitted, all connectable
  databases are backed up individually. Overrides the database in the location
  URI.
- **Exclude Databases**: Comma-separated list of database names to skip during a
  full backup. Defaults to `rdsadmin`, an internal AWS system database that
  cannot be dumped by regular users. Set to an empty string to disable all
  exclusions.
- **Schema Only**: Dump only the schema, passing `-s` to `pg_dump`. Mutually
  exclusive with **Data Only**.

### Destination configuration

The following extra settings are available when configuring a destination app
using the `postgres+aws` protocol.

- **Clean**: Drop objects within the target database before recreating them,
  passing `--clean --if-exists` to `pg_restore`. The database must already
  exist. Mutually exclusive with **Recreate**.
- **Data Only**: Restore only the data, passing `-a` to `pg_restore`. Mutually
  exclusive with **Schema Only**.
- **Database**: Target database for `pg_restore` when restoring a
  single-database dump. If omitted, the database name is inferred from the dump
  filename.
- **Databases**: Comma-separated list of database names to restore. Only `.dump`
  files matching one of these names are restored; all others are skipped.
  Globals (`00000-globals.sql`) are always restored when present, unless **No
  Globals** is enabled. Example: `myapp,myother`.
- **Exit On Error**: Stop the restore on the first error, passing `-e` to
  `pg_restore` and `ON_ERROR_STOP=1` to `psql`.
- **No Globals**: Skip restoring `00000-globals.sql`. By default, globals are
  restored automatically when present.
- **No Owner**: Skip `ALTER OWNER` statements, passing `--no-owner` to
  `pg_restore`.
- **Recreate**: Drop and recreate the target database from the archive metadata,
  passing `-C --clean --if-exists` to `pg_restore`. The target database name is
  taken from the archive. The `postgres` database is never dropped; it is
  restored with `--clean --if-exists` instead, mirroring `pg_dumpall` behavior.
  Mutually exclusive with **Clean**.
- **Schema Only**: Restore only the schema, passing `-s` to `pg_restore`.
  Mutually exclusive with **Data Only**.

