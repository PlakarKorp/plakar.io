---
title: "Physical backups with pg_basebackup"
date: "2026-03-19T00:00:00Z"
weight: 2
summary:
  "Back up a PostgreSQL cluster using the Plakar PostgreSQL integration and
  restore it."
aliases:
  - /docs/main/guides/postgres/pg-base-backup/
  - /docs/main/guides/postgresql/pg_base_backup
---

# Physical backups with pg_basebackup

This guide shows how to back up and restore a PostgreSQL cluster using the
`postgres+bin://` connector. Physical backups capture the entire data directory
via `pg_basebackup` and are faster to restore than logical dumps. They are
version-locked (the backup must be restored with the same PostgreSQL major
version) and do not support selective restore of individual databases or tables.

For full reference on all options and snapshot layout see the
[PostgreSQL integration reference](../../integrations/postgres/).

## Before you begin

- A running PostgreSQL server with `wal_level = replica` or higher in
  `postgresql.conf`.
- A PostgreSQL user with the `REPLICATION` privilege, or a superuser.
- `pg_hba.conf` allowing a replication connection from the backup host.
- `pg_basebackup` available in `$PATH`.

Install the PostgreSQL package:

```bash
$ plakar pkg add postgresql
```

### Configure pg_hba.conf

Ensure `pg_hba.conf` includes an entry allowing replication connections from the
backup host. For example, to allow local replication without a password:

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   replication     all                                     trust
```

Restart PostgreSQL after making changes.

## Back up the cluster

```bash
$ plakar source add mypg postgres+bin://replicator:secret@db.example.com
$ plakar at /var/backups backup @mypg
```

## List snapshots

```bash
$ plakar at /var/backups ls
```

## Restore the cluster

There is no dedicated destination connector for physical backups. Restore the
files to a local directory using the standard filesystem restore, then start
PostgreSQL against it:

```bash
$ plakar at /var/backups restore -to ./pgdata <snapshot_id>
$ docker run --rm \
  -v "$PWD/pgdata:/var/lib/postgresql/data" \
  postgres:<version>
```

Replace `<version>` with the same major PostgreSQL version that was running when
the backup was taken.

To restore directly to a remote host via SFTP:

```bash
$ plakar at /var/backups restore -to sftp://user@host/var/lib/postgresql/data <snapshot_id>
# then on the remote host:
$ pg_ctl -D /var/lib/postgresql/data start
```

## Considerations

### Version compatibility

Physical backups must be restored with the same PostgreSQL major version. For
cross-version restores, use a [logical backup](./pgdump) instead.

### Stop the server before restoring

Do not restore into a data directory that is in use by a running PostgreSQL
instance. Stop the server first, or restore to a fresh directory.

### Kloset store

The examples above use `/var/backups` as the Kloset store. Any supported store
backend can be used instead. See
[Create a Kloset store](../../create-kloset-repository) for details.

## See also

- [PostgreSQL integration reference](../../integrations/postgres/)
- [PostgreSQL integration GitHub](https://github.com/PlakarKorp/integrations/tree/main/postgresql)
- [PostgreSQL documentation on pg_basebackup](https://www.postgresql.org/docs/current/app-pgbasebackup.html)
