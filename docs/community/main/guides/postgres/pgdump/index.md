
# Logical backups with pg_dump

This guide shows how to back up and restore PostgreSQL databases using the
`postgres://` connector. Logical backups produce portable, SQL-level snapshots
via `pg_dump` and `pg_dumpall` that can be restored to a different PostgreSQL
major version and allow selective restore of individual databases, schemas, or
tables.

For full reference on connectors, all options, snapshot layout, and AWS IAM
authentication, see the
[PostgreSQL integration reference](../../integrations/postgres/).

## Before you begin

- A running PostgreSQL server.
- A PostgreSQL superuser, or a user with sufficient privileges to run `pg_dump`
  and `pg_dumpall`.
- The following client tools available in `$PATH`: `pg_dump`, `pg_dumpall`,
  `pg_restore`, `psql`.

> [!NOTE]+ Managed services (RDS, Cloud SQL, etc.)
>
> On managed services where the administrative user is a restricted superuser,
> the integration automatically falls back to `--no-role-passwords`. The dump is
> otherwise complete, but restored roles will have no password set.

Install the PostgreSQL package:

```bash
$ plakar pkg add postgresql
```

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

## List snapshots

```bash
$ plakar at /var/backups ls
```

## Restore a single database

The target database must already exist:

```bash
$ plakar destination add mypgdst postgres://postgres:secret@db.example.com/myapp
$ plakar at /var/backups restore -to @mypgdst <snapshot_id>
```

To have Plakar create the database automatically:

```bash
$ plakar destination add mypgdst postgres://postgres:secret@db.example.com/myapp \
  recreate=true
$ plakar at /var/backups restore -to @mypgdst <snapshot_id>
```

## Restore all databases

```bash
$ plakar destination add mypgdst postgres://postgres:secret@db.example.com/
$ plakar at /var/backups restore -to @mypgdst <snapshot_id>
```

## Considerations

### Compression

Do not enable `compress=true` unless necessary. Plakar deduplicates and
compresses data automatically. Pre-compressed dumps produce an incompressible
stream that reduces deduplication effectiveness across snapshots.

### Kloset store

The examples above use `/var/backups` as the Kloset store. Any supported store
backend can be used instead. See
[Create a Kloset store](../../create-kloset-repository) for details.

## See also

- [PostgreSQL integration reference](../../integrations/postgres/)
- [PostgreSQL integration GitHub](https://github.com/PlakarKorp/integrations/tree/main/postgresql)
- [PostgreSQL documentation on SQL dumps](https://www.postgresql.org/docs/current/backup-dump.html)

