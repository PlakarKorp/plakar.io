---
title: "PostgreSQL"
date: "2026-09-01T00:00:00Z"
weight: 3
summary: "How to configure a PostgreSQL resource in Plakar Control Plane."
---

# PostgreSQL

The PostgreSQL integration allows Plakar Control Plane to back up and restore
PostgreSQL databases. The integration supports multiple protocols.

## Running PostgreSQL tasks on an edge

The PostgreSQL integration relies on the PostgreSQL client tools, which must be
installed on the machine that executes the task. These tools are not included in
the appliance, so PostgreSQL tasks run on an [edge](../../edges) rather than on
the Control Plane.

Install the tools on the edge hosts of an edge pool, then assign the resources
to that pool. They are usually provided by the `postgresql-client` package and
must be in the `$PATH` of the process running the task. The `postgres` and
`postgres+aws` protocols back up with `pg_dump` and `pg_dumpall` and restore
with `pg_restore` and `psql`. The `postgres+bin` protocol backs up with
`pg_basebackup`.

### Running the edge in a container

When the edge runs as a container, build a
[custom edge image](../../edges/installation/custom-image) from the official
PostgreSQL image. It includes `pg_dump`, `pg_dumpall`, `pg_restore`, `psql` and
`pg_basebackup`, but not the CA certificates the edge needs to reach the Control
Plane over HTTPS, so the image must install them:

```dockerfile
FROM postgres:17
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY --from=ghcr.io/plakarkorp/plakar-edge:<version> /bin/plakar-edge /bin/
ENV PLAKAR_EDGE_EXTRA_TAGS=postgresql,postgresql-17
ENTRYPOINT ["/bin/plakar-edge"]
```

Use the Debian-based tags of the image. The `-alpine` tags do not meet the
[base image requirements](../../edges/installation/custom-image#base-image-requirements).

Choose a tag at least as recent as the newest PostgreSQL server the edge backs
up, since `pg_dump` and `pg_basebackup` cannot back up a server of a newer major
version. Replace `<version>` with the edge version that matches your Control
Plane, as described in
[Choosing the edge version](../../edges/installation/custom-image#choosing-the-edge-version).

Add the resulting edges to an edge pool, and assign the PostgreSQL resources to
that pool, so their tasks run on an edge that has the client tools. See
[selecting an edge](../../edges/running-tasks#selecting-an-edge).

The [directory dump format](#dump-formats) also needs FUSE on the edge. Add
`fuse3` to the packages the image installs, and run the container with access to
`/dev/fuse`, the `SYS_ADMIN` capability, and an AppArmor profile that allows
mounts:

```bash
docker run --device /dev/fuse --cap-add SYS_ADMIN \
  --security-opt apparmor:unconfined ...
```

The `postgres+aws` protocol generates its IAM token with the AWS credentials
available to the edge. The edge picks them up from the standard AWS sources:
environment variables such as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`,
the shared credentials file, or the IAM role of the instance or container it
runs on. Provide them to every edge that runs `postgres+aws` tasks. See
[`postgres+aws` protocol](#3-postgresaws-protocol).

## Inventory Management

[Managed inventories](../../inventories#managed-inventories) can discover
PostgreSQL databases automatically on AWS (RDS instances and clusters), Scaleway
(managed Database instances), etc. For self-hosted PostgreSQL servers not
covered by managed discovery, you can instead set up a
[self-managed inventory](../../inventories/self-managed) and add the resource
manually.

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

A backup of all databases connects to the `postgres` database to list them, so
the backup user needs `CONNECT` on it. Some managed services, such as Clever
Cloud, do not grant it. Back up a single database there.

Database names that start with a dash, or contain `=` or whitespace, are refused
and the backup or restore fails. To back up the rest of a cluster that contains
one, list it in **Exclude Databases**.

> [!WARNING]
>
> A `\!` meta-command in `00000-globals.sql` runs as a shell command on the edge
> that runs the restore, even with **Exit On Error**. This applies to both the
> `postgres` and `postgres+aws` protocols. To restore a snapshot you do not
> trust, enable **No Globals** and create the roles and tablespaces on the
> target yourself.

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

### Dump formats

**Format** selects how each database is dumped, with the `postgres` and
`postgres+aws` protocols. The default, `custom`, dumps each database with a
single `pg_dump -Fc` process into one `.dump` file.

`directory` dumps each database with `pg_dump -Fd`, which writes one file per
table and dumps several tables in parallel. On large databases this shortens
backups considerably. Each file is streamed into the snapshot as it is written,
so the dump uses no disk on the edge. **Parallel Dumps** sets the number of
parallel jobs per database. Each job is a separate connection running a `COPY`
on the server. It defaults to 4, or to the task's **Concurrency** when that is
lower. A single table is always dumped by one job, so the largest table bounds
how fast a database can be dumped.

The directory format only works on Linux edges with `/dev/fuse` and
`fusermount3` (package `fuse3`). The backup fails when they are missing. See
[Running the edge in a container](#running-the-edge-in-a-container).

Directory-format snapshots cannot be restored with a PostgreSQL destination app
yet. To restore one, mount the snapshot with
[`plakar mount`](/docs/community/v1.1.0/references/commands/plakar-mount/) on a
machine with access to the store, and run `pg_restore -Fd` on the database
directory, such as `00001-myapp`.

To speed up the backup of a large database:

1. Upgrade the PostgreSQL integration from the
   [Integrations](../../integrations) page, so that its source app offers
   **Format** and **Parallel Dumps**.
2. Make sure the edges of the resource's pool have FUSE, as described above.
3. In the source app, set **Format** to `directory`.
4. Set **Parallel Dumps** to the number of connections the server can serve
   alongside its regular load, such as `16`.

### Excluding tables

**Exclude Tables** and **Exclude Table Data** leave large tables out of a
logical backup. Both take a comma-separated list of `pg_dump` table patterns and
apply them to every database dumped. **Exclude Tables** leaves out the table
entirely, definition and rows. **Exclude Table Data** keeps the definition and
leaves out the rows, so the table is restored empty.

A pattern without a schema only matches tables on the `search_path`. Use
`*.audit_log` to match a table in every schema. Excluding a partitioned table
does not exclude its partitions, which must be listed too. Both lists are
recorded in the snapshot's `manifest.json`.

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
- **Exclude Table Data**: Comma-separated `pg_dump --exclude-table-data`
  patterns. Matching tables are restored empty. See
  [Excluding tables](#excluding-tables).
- **Exclude Tables**: Comma-separated `pg_dump --exclude-table` patterns.
  Matching tables are left out, definition and rows. See
  [Excluding tables](#excluding-tables).
- **Format**: Dump format, `custom` or `directory`. Defaults to `custom`. See
  [Dump formats](#dump-formats).
- **Parallel Dumps**: Number of parallel `pg_dump` jobs per database. Requires
  **Format** set to `directory`. Defaults to 4, or to the task's **Concurrency**
  when lower.
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
  restored automatically when present. Enable it when the snapshot is not
  trusted.
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
> replication connection from the edge that runs the task.

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
token is generated automatically from the AWS credentials available to the edge
that runs the task, before `pg_dump`, `pg_dumpall`, `pg_restore`, or `psql` run,
so no password is needed or accepted. The backup output is identical to
`postgres` and can be restored with either protocol.

Using this protocol requires:

- [IAM database authentication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Enabling.html)
  enabled on the RDS instance.
- An IAM policy granting `rds-db:connect`, scoped to the RDS resource ID and
  database user, attached to the AWS credentials the edge uses. See
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
- **Region**: Required. AWS region of the RDS instance, e.g. `us-east-1`. Used
  to generate the IAM token.
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
- **Exclude Table Data**: Comma-separated `pg_dump --exclude-table-data`
  patterns. Matching tables are restored empty. See
  [Excluding tables](#excluding-tables).
- **Exclude Tables**: Comma-separated `pg_dump --exclude-table` patterns.
  Matching tables are left out, definition and rows. See
  [Excluding tables](#excluding-tables).
- **Format**: Dump format, `custom` or `directory`. Defaults to `custom`. See
  [Dump formats](#dump-formats).
- **Parallel Dumps**: Number of parallel `pg_dump` jobs per database. Requires
  **Format** set to `directory`. Defaults to 4, or to the task's **Concurrency**
  when lower.
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
  restored automatically when present. Enable it when the snapshot is not
  trusted.
- **No Owner**: Skip `ALTER OWNER` statements, passing `--no-owner` to
  `pg_restore`.
- **Recreate**: Drop and recreate the target database from the archive metadata,
  passing `-C --clean --if-exists` to `pg_restore`. The target database name is
  taken from the archive. The `postgres` database is never dropped; it is
  restored with `--clean --if-exists` instead, mirroring `pg_dumpall` behavior.
  Mutually exclusive with **Clean**.
- **Schema Only**: Restore only the schema, passing `-s` to `pg_restore`.
  Mutually exclusive with **Data Only**.
