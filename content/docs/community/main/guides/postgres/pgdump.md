---
title: "Logical backups with pg_dump"
date: "2026-03-19T00:00:00Z"
weight: 1
summary: "Back up PostgreSQL databases using the Plakar PostgreSQL integration and restore them."
aliases:
  - /docs/main/guides/postgresql/pgdump
---

# Logical backups with pg_dump

The Plakar PostgreSQL integration uses `pg_dump` and `pg_dumpall` to produce logical backups which are portable, version-independent SQL representations of your databases. Logical backups can be restored to a different PostgreSQL major version and allow selective restore of individual databases, namespaces, or tables.

For a deeper understanding of SQL dumps and PostgreSQL backup strategies, refer to the [official PostgreSQL documentation on SQL dumps](https://www.postgresql.org/docs/current/backup-dump.html).

## Requirements

- A running PostgreSQL server.
- A PostgreSQL superuser, or a user with sufficient privileges to run `pg_dump` and `pg_dumpall`.
- The following client tools available in `$PATH`: `pg_dump`, `pg_dumpall`, `pg_restore`, `psql`.

> [!NOTE]+ Managed services (RDS, Cloud SQL, etc.)
> On managed services where the administrative user is a restricted superuser and cannot read `pg_authid`, the integration automatically falls back to `--no-role-passwords`. The dump is otherwise complete, but restored roles will have no password set.

### Install the package

```bash
$ plakar pkg add postgresql
```

## What gets stored in a snapshot

**Single database backup** produces two records:

- `/globals.sql` — roles and tablespaces from `pg_dumpall --globals-only`.
- `/<dbname>.dump` — the database in `pg_dump` custom format (`-Fc`).

**Full cluster backup** produces one record:

- `/all.sql` — all databases, roles, and tablespaces from `pg_dumpall`.

Both backup types also include a `/manifest.json` record written before the dump data, containing cluster-level metadata: server version, roles, tablespaces, databases, schemas, and relation details. See [Snapshot manifest](#snapshot-manifest) below.

## Back up a single database

```bash
$ plakar source add mypg postgres://postgres:secret@db.example.com/myapp
$ plakar at /var/backups backup @mypg
```

## Back up all databases

Omit the database name to back up the entire cluster with `pg_dumpall`:

```bash
$ plakar source add mypg postgres://postgres:secret@db.example.com/
$ plakar at /var/backups backup @mypg
```

## Restore a single database

The target database must already exist:

```bash
$ plakar destination add mypgdst postgres://postgres:secret@db.example.com/myapp
$ plakar at /var/backups restore -to @mypgdst <snapshot_id>
```

To have Plakar create the database automatically, set `create_db=true`:

```bash
$ plakar destination add mypgdst postgres://postgres:secret@db.example.com/myapp \
  create_db=true
$ plakar at /var/backups restore -to @mypgdst <snapshot_id>
```

## Restore all databases

```bash
$ plakar destination add mypgdst postgres://postgres:secret@db.example.com/
$ plakar at /var/backups restore -to @mypgdst <snapshot_id>
```

## List snapshots

```bash
$ plakar at /var/backups ls
```

## Source options

| Parameter | Default | Description |
|---|---|---|
| `location` | — | Connection URI: `postgres://[user[:password]@]host[:port][/database]` |
| `host` | `localhost` | Server hostname. Overrides the URI host. |
| `port` | `5432` | Server port. Overrides the URI port. |
| `username` | — | PostgreSQL username. Overrides the URI user. |
| `password` | — | PostgreSQL password. Overrides the URI password. |
| `database` | — | Database to back up. If omitted, all databases are backed up via `pg_dumpall`. Overrides the URI path. When set, a globals dump (`/globals.sql`) is also produced automatically. |
| `compress` | `false` | Enable `pg_dump` compression. Disabled by default so Plakar's own compression and deduplication are not degraded. |
| `schema_only` | `false` | Dump only the schema (no data). Mutually exclusive with `data_only`. |
| `data_only` | `false` | Dump only the data (no schema). Mutually exclusive with `schema_only`. |
| `pg_bin_dir` | — | Directory containing the PostgreSQL client binaries. When omitted, binaries are resolved via `$PATH`. Useful when multiple PostgreSQL versions are installed. |
| `ssl_mode` | `prefer` | SSL mode: `disable`, `allow`, `prefer`, `require`, `verify-ca`, or `verify-full`. |
| `ssl_cert` | — | Path to the client SSL certificate file (PEM). |
| `ssl_key` | — | Path to the client SSL private key file (PEM). |
| `ssl_root_cert` | — | Path to the root CA certificate used to verify the server (PEM). |

## Destination options

| Parameter | Default | Description |
|---|---|---|
| `location` | — | Connection URI: `postgres://[user[:password]@]host[:port][/database]` |
| `host` | `localhost` | Server hostname. Overrides the URI host. |
| `port` | `5432` | Server port. Overrides the URI port. |
| `username` | — | PostgreSQL username. Overrides the URI user. |
| `password` | — | PostgreSQL password. Overrides the URI password. |
| `database` | — | Target database name. If omitted, inferred from the dump filename (e.g. `myapp.dump` → `myapp`). |
| `create_db` | `false` | When `true`, passes `-C` to `pg_restore` to create the database from the archive metadata. The `-d` parameter then names only the initial connection database (defaults to `postgres`). |
| `restore_globals` | `false` | When `true`, feeds `/globals.sql` to `psql` before restoring the database dump. Useful when restoring to a server where source roles do not exist. Not needed for `pg_dumpall` restores (`all.sql`). |
| `no_owner` | `false` | Pass `--no-owner` to `pg_restore`, skipping `ALTER OWNER` statements. Useful when roles from the source server do not exist on the target. |
| `schema_only` | `false` | Restore only the schema (no data). Mutually exclusive with `data_only`. Not applicable to `pg_dumpall` restores. |
| `data_only` | `false` | Restore only the data (no schema). Mutually exclusive with `schema_only`. Not applicable to `pg_dumpall` restores. |
| `exit_on_error` | `false` | Stop on the first restore error. Applies to both `pg_restore` and `psql`. |
| `pg_bin_dir` | — | Directory containing the PostgreSQL client binaries. When omitted, binaries are resolved via `$PATH`. |
| `ssl_mode` | `prefer` | SSL mode: `disable`, `allow`, `prefer`, `require`, `verify-ca`, or `verify-full`. |
| `ssl_cert` | — | Path to the client SSL certificate file (PEM). |
| `ssl_key` | — | Path to the client SSL private key file (PEM). |
| `ssl_root_cert` | — | Path to the root CA certificate used to verify the server (PEM). |

## Snapshot manifest

Every snapshot includes a `/manifest.json` record written before the dump data. It captures the cluster state at the time of backup.

| Field | Description |
|---|---|
| `cluster_config` | Key server settings: `data_directory`, `timezone`, `max_connections`, `wal_level`, `server_encoding`, `data_checksums`, `block_size`, `wal_block_size`, `shared_preload_libraries`, `lc_collate`, `lc_ctype`, `archive_mode`, `archive_command_set` (boolean only — the command itself is not stored). |
| `roles` | All PostgreSQL roles with their attributes and role memberships. |
| `tablespaces` | All tablespaces with name, owner, filesystem location, and storage options. |
| `databases` | One entry per database: name, owner, encoding, collation, extensions, schemas, and a `relations` array covering tables, views, materialized views, sequences, and partitioned tables. |

Row counts in the manifest are estimates from `pg_class` and `pg_stat_user_tables`, not exact values. Metadata collection is best-effort: if a query fails, the affected field is omitted and the backup continues.

## Considerations

### Compression

Do not enable `compress=true` unless necessary. Plakar deduplicates and compresses data automatically. Pre-compressed dumps produce an incompressible stream that reduces deduplication effectiveness across snapshots.

### Kloset store location

The examples above use `/var/backups` as the Kloset store. Any supported store backend can be used instead. See [Create a Kloset store](../../create-kloset-repository) for details.

## See also

* [PostgreSQL integration on GitHub](https://github.com/PlakarKorp/integration-postgresql/)
