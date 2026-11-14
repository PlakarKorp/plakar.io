---
title: PostgreSQL

subtitle:
  Logical and physical PostgreSQL backups, encrypted and kept off the database
  server

description: >
  Back up self-hosted or managed PostgreSQL with pg_dump or pg_basebackup into
  encrypted snapshots. Restore a database, or one table with pg_restore.

technology_title:
  Point-in-time recovery only exists if WAL archiving ran beforehand

technology_description: >
  Streaming replication keeps standbys in sync within milliseconds, so a dropped
  table or a bad UPDATE reaches every replica before anyone notices.
  Point-in-time recovery needs WAL archiving set up and monitored in advance.

  Plakar drives the tools PostgreSQL already ships, pg_dump, pg_dumpall and
  pg_basebackup, and keeps each run as an encrypted, deduplicated snapshot with
  a manifest of roles, databases and relations.

categories:
  - source
  - destination

seo_tags:
  - PostgreSQL backup
  - pg_dump backup
  - pg_basebackup backup
  - restore single table pg_restore
  - managed PostgreSQL backup
  - cloud PostgreSQL backup
  - PostgreSQL upgrade restore
  - encrypted PostgreSQL backup

links:
  - type: community
    url: /docs/community/main/integrations/postgres/
  - type: control-plane
    url: /docs/control-plane/resources/database/postgres/
  - type: custom
    label: "Blog: Researching a PostgreSQL viewer for Plakar"
    url: /posts/2026-01-11/researching-a-postgresql-viewer-for-plakar/
    icon: ri/article-line

related:
  - mysql
  - mongodb
  - mssql
  - etcd

edition:
  - community
  - control-plane

stage: stable

author:
  - type: official
    name: Plakar

date: 2026-04-02

resource: PostgreSQL

image: img/integrations/postgres.png
---

## What the PostgreSQL integration does

The PostgreSQL integration backs up any PostgreSQL server reachable over the
network into encrypted Plakar snapshots, whether you run it yourself or use a
managed service from a cloud provider. It takes logical dumps with `pg_dump` or
a physical copy of the cluster with `pg_basebackup`, and restores a whole
server, one database, or dump files you load with `pg_restore`. Plakar runs on
any machine that has the PostgreSQL client tools.

Three protocols cover the common setups. `postgres://` works with any server,
self-hosted or managed: it runs `pg_dumpall --globals-only` for roles and
tablespaces, then one `pg_dump` per database. `postgres+bin://` streams a
physical base backup of the whole cluster with `pg_basebackup`.
`postgres+aws://` is a variant of `postgres://` for RDS and Aurora that
authenticates with an IAM token instead of a stored password.

Every snapshot also holds a `manifest.json` with the server settings, roles, and
for each relation its columns, indexes, row estimate and last vacuum. A logical
snapshot restores to a running server through the destination connector, either
whole or one database at a time with `databases=myapp`. For a single table,
restore the `.dump` file to disk and run `pg_restore -t`. A physical snapshot
restores to disk as a data directory that starts with the same major version.

## PostgreSQL recovery scenarios

### A coding agent drops the `orders` table

An agent working on a schema cleanup has the production `DATABASE_URL` in its
environment and runs `DROP TABLE orders CASCADE`. Every PostgreSQL standby
replays the drop from the WAL. Take a `plakar backup` before the session starts,
and keep the store and its passphrase out of the agent's environment. Load that
snapshot into an empty `myapp_restore` database with `no_globals=true`, and
recreate `orders` in production from it with `pg_dump -t orders myapp_restore`
piped into `psql`. Every other table keeps the agent's changes.

### A `DELETE` without `WHERE` found the next morning

Without WAL archiving, PostgreSQL has no point-in-time recovery, and the
replicas hold the same empty table. Restore yesterday's dump to disk with
`plakar restore -to /tmp/pg <snapshot>`, then load only the affected table into
a scratch database with `pg_restore -t invoices`.

### Silent corruption noticed weeks later

A faulty extension or a storage fault damages PostgreSQL data, and every recent
backup carries the damage. Plakar stores dumps uncompressed by default and
deduplicates them, keeping only what changed between two daily dumps. Several
months of history cost a fraction of their full size. Compare the
`manifest.json` of two snapshots with `plakar diff` to see when row estimates
changed, then restore the last good one.

### Leaving a managed PostgreSQL service or upgrading a major version

The automated backups of a managed PostgreSQL service stay in the provider's
account and restore to that provider. A Plakar snapshot holds standard `pg_dump`
files in a store you choose, so a database backed up from one cloud provider
restores on another, or on a self-hosted server. A dump taken on PostgreSQL 15
restores on 16. Set `no_owner=true` when the roles on the target differ.

### Rebuilding a lost primary

When the data directory is gone, a `postgres+bin://` snapshot restores to disk
as a complete `PGDATA`: every database, the configuration files kept in the data
directory, and the WAL needed to start. Start it with `pg_ctl -D` on a server
running the same major version.

## Example with the open-source Plakar CLI

The Plakar CLI is free and open source. Declare the database as a source and a
restore target as a destination once, then run backups from cron or a CI job.

```bash
$ plakar source add mypg postgres://postgres:secret@db.example.com/myapp \
    exclude_table_data=public.audit_log
$ plakar at /var/backups backup "@mypg"

$ plakar destination add pgside \
    postgres://postgres:secret@db.example.com/myapp_restore no_globals=true
$ plakar at /var/backups restore -to "@pgside" <snapshot_id>
```

The [PostgreSQL CLI documentation](/docs/community/main/integrations/postgres/)
covers every option, IAM authentication on RDS and the physical restore.

## PostgreSQL backups across a fleet with Plakar Control Plane

With dozens of databases spread over several clouds, Plakar Control Plane
replaces per-host CLI configuration. Managed inventories discover the managed
PostgreSQL databases of each cloud account you connect. Self-hosted servers are
added to a self-managed inventory. Backups run on an edge installed close to the
databases, with the PostgreSQL client tools.

Policies set how many backups each database needs per period, how long they are
kept and which store receives them. Every database whose environment and data
class match a policy is scheduled automatically, so a database created next week
is covered as soon as it is discovered, with no task to write.

[See how Plakar Control Plane works](/solutions/control-plane/), read the
[Control Plane PostgreSQL documentation](/docs/control-plane/resources/database/postgres/),
or [contact us](/contact/) to plan a deployment.

## PostgreSQL backup FAQ

### Do I need WAL archiving to back up PostgreSQL with Plakar?

No. Logical and physical snapshots are complete on their own. Each one is a
restore point at the time of the backup.

### Which user should run the backup?

A superuser, so that `pg_dumpall` includes role passwords. On managed services,
where the administrator is a restricted superuser, Plakar backs up roles without
their passwords. `postgres+bin://` needs a user with the `REPLICATION`
privilege.

### How do I restore one table?

Restore the snapshot to a local directory, then run `pg_restore -t <table>` on
the database's `.dump` file. With `format=directory`, mount the snapshot with
`plakar mount` and run `pg_restore -Fd` on the database directory.

### Does it work with managed PostgreSQL services?

Yes. `postgres://` connects to any managed service that accepts a PostgreSQL
user over the network. On RDS and Aurora, `postgres+aws://` can also use an IAM
role instead of a password.

### Can I restore to a different server or version?

Yes, for logical snapshots. The destination connector restores to any reachable
server, and `no_owner=true` skips ownership when roles differ. Physical
snapshots need the same major version.
