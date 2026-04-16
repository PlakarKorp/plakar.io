---
title: "Physical backups with pg_basebackup"
date: "2026-03-19T00:00:00Z"
weight: 2
summary: "Back up a PostgreSQL cluster using the Plakar PostgreSQL integration and restore it."
aliases:
  - /docs/v1.1.0/guides/postgresql/pg_base_backup
---

# Physical backups with pg_basebackup

The Plakar PostgreSQL integration uses `pg_basebackup` to perform physical backups of a PostgreSQL cluster. A physical backup captures the entire data directory (all databases, configuration files, and WAL segments) and stores each file as an individual record in the snapshot.

Physical backups are faster to restore than logical dumps but are version-locked: the backup must be restored with the same PostgreSQL major version that produced it. Selective restore of a single database or table is not possible.

For a deeper understanding of physical backups and base backups, refer to the [official PostgreSQL documentation on pg_basebackup](https://www.postgresql.org/docs/current/app-pgbasebackup.html).

## Requirements

- A running PostgreSQL server with `wal_level = replica` or higher in `postgresql.conf`.
- A PostgreSQL user with the `REPLICATION` privilege, or a superuser.
- `pg_hba.conf` allowing a replication connection from the backup host.
- `pg_basebackup` available in `$PATH`.

### Install the package

```bash
$ plakar pkg add postgresql
```

### pg_hba.conf configuration

Ensure `pg_hba.conf` includes an entry allowing replication connections from the backup host. For example, to allow local replication without a password:

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   replication     all                                     trust
```

Adapt this to your environment and restart PostgreSQL after making changes.

## What gets stored in a snapshot

Each file from the PostgreSQL data directory is stored as an individual record in the snapshot, preserving paths, permissions, and timestamps. A subpath cannot be specified in the URI — `pg_basebackup` always backs up the entire cluster.

A `/manifest.json` record is also written before the backup data, containing cluster-level metadata. See [Snapshot manifest](#snapshot-manifest) below.

## Back up the cluster

```bash
$ plakar source add mypg postgres+bin://replicator:secret@db.example.com
$ plakar at /var/backups backup @mypg
```

## Restore the cluster

There is no dedicated destination connector for physical backups. Because the snapshot contains plain files, restore them to a local directory using the standard filesystem restore:

```bash
$ plakar at /var/backups restore -to ./pgdata <snapshot_id>
```

Then start PostgreSQL against the restored directory:

```bash
$ docker run --rm \
  -v "$PWD/pgdata:/var/lib/postgresql/data" \
  postgres:<version>
```

Replace `<version>` with the same major PostgreSQL version that was running when the backup was taken.

To restore directly to a remote host, use an SFTP destination:

```bash
$ plakar restore -to sftp://user@host/var/lib/postgresql/data <snapshot_id>
# then on the remote host: pg_ctl -D /var/lib/postgresql/data start
```

## List snapshots

```bash
$ plakar at /var/backups ls
```

## Source options

| Parameter | Default | Description |
|---|---|---|
| `location` | — | Connection URI: `postgres+bin://[user[:password]@]host[:port]`. A subpath is not allowed. |
| `host` | `localhost` | Server hostname. Overrides the URI host. |
| `port` | `5432` | Server port. Overrides the URI port. |
| `username` | — | PostgreSQL replication username. Overrides the URI user. |
| `password` | — | PostgreSQL password. Overrides the URI password. |
| `pg_bin_dir` | — | Directory containing the PostgreSQL client binaries (`pg_basebackup`, `psql`). When omitted, binaries are resolved via `$PATH`. Useful when multiple PostgreSQL versions are installed. |
| `ssl_mode` | `prefer` | SSL mode: `disable`, `allow`, `prefer`, `require`, `verify-ca`, or `verify-full`. |
| `ssl_cert` | — | Path to the client SSL certificate file (PEM). |
| `ssl_key` | — | Path to the client SSL private key file (PEM). |
| `ssl_root_cert` | — | Path to the root CA certificate used to verify the server (PEM). |

## Snapshot manifest

Every snapshot includes a `/manifest.json` record written before the backup data. It captures the cluster state at the time of backup, including the same fields as logical backups (server version, roles, tablespaces, databases, and relation details) plus `pg_basebackup_version`.

Metadata collection is best-effort: if a query fails, the affected field is omitted and the backup continues.

## Considerations

### Version compatibility

Physical backups must be restored with the same PostgreSQL major version. For cross-version restores, use a logical backup instead.

### Server must be stopped before restore

Do not restore into a data directory that is in use by a running PostgreSQL instance. Stop the server first, or restore to a fresh directory.

### Read-only mounts

Plakar supports mounting a Kloset store as a read-only FUSE filesystem. PostgreSQL requires read-write access to its data directory, so it cannot run directly from a read-only mount. Always restore to a writable directory first.

### Kloset store location

The examples above use `/var/backups` as the Kloset store. Any supported store backend can be used instead. See [Create a Kloset store](../../create-kloset-repository) for details.

## See also

* [PostgreSQL integration on GitHub](https://github.com/PlakarKorp/integration-postgresql/)
