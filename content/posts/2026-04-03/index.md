---
title: "Backing up PostgreSQL with Plakar"
summary: "We built a PostgreSQL integration for Plakar that covers both logical backups (pg_dump / pg_dumpall) and physical backups (pg_basebackup), making database backups as straightforward as any other Plakar backup: no scripts, no glue code."
slug: "backing-up-postgresql-with-plakar"
date: 2026-04-03T12:00:00+0200
authors:
  - "jcastets"
tags:
  - integration
  - postgresql
  - database
category: "technology"
---

**TL;DR:**

> We built a PostgreSQL integration for Plakar that covers both logical backups (`pg_dump` / `pg_dumpall`) and physical backups (`pg_basebackup`), making database backups as straightforward as any other Plakar backup: no scripts, no glue code.

---

If there is one feature request that comes up more than any other in the Plakar community, it is database backups.

And that makes sense. Databases hold the data that matters most. They are the hardest thing to lose and often the hardest thing to restore correctly.

For a while, a workaround existed. Plakar has a `stdin` integration that can ingest anything piped into it, so it was already possible to back up a PostgreSQL database by doing something like:

```sh
$ pg_dump mydb | plakar backup stdin://dump.sql
```

It works.

But it is manual, error-prone, and requires writing and maintaining shell scripts or cron jobs. That is exactly what Plakar is supposed to save you from.

The goal of this integration is simple: **backing up a PostgreSQL database should be as easy as backing up anything else with Plakar.**

---

## Backup strategies for PostgreSQL

A PostgreSQL server hosts a **cluster** made up of multiple databases, each containing schemas, tables, views, sequences, extensions, roles, and tablespaces. Backing up a cluster properly means capturing all of that, not just the raw table data.

PostgreSQL has two fundamentally different backup approaches, and choosing between them involves real tradeoffs.

### Logical backups

Logical backups use `pg_dump` (for a single database) or `pg_dumpall` (for an entire cluster) to produce SQL or custom-format dumps. They work at the SQL level: they reconstruct the structure and data of your databases as a series of statements.

**Pros:**
- **Portable across versions.** You can restore a logical backup onto a different PostgreSQL major version.
- **Selective restore.** With `pg_dump`'s custom format, you can restore individual tables or schemas without restoring the entire database.
- **Works with managed services.** Amazon RDS, Google Cloud SQL, Supabase, and similar managed platforms do not expose the underlying data directory, so logical backups are often the only option.
- **No server downtime required.** `pg_dump` runs against a live server and uses PostgreSQL's MVCC to produce a consistent snapshot.

**Cons:**
- **Restore requires a running PostgreSQL server.** You cannot simply copy the output and start it. You need a working server instance to load the dump into.
- **Slow on large databases.** Dumping and restoring large datasets involves a lot of SQL processing. A physical backup of the same data will typically be faster to both create and restore.

### Physical backups

Physical backups use `pg_basebackup` to copy the raw data directory from the server's replication interface. They operate at the file system level, streaming the actual pages PostgreSQL writes to disk.

**Pros:**
- **Fast and complete.** A physical backup captures everything in one shot: all databases, configuration files, WAL segments. There is no SQL processing overhead.
- **Directly startable.** The restored directory can be handed to a PostgreSQL binary and started immediately, with no import step.
- **Consistent under load.** `pg_basebackup` uses the replication protocol, which guarantees a crash-consistent snapshot even on a busy server.

**Cons:**
- **Version-locked.** A physical backup must be restored with the same major PostgreSQL version.
- **No selective restore.** You restore the entire cluster. There is no straightforward way to extract a single table or schema from a physical backup without starting the server and doing a logical export afterward.
- **Requires replication privileges.** The backup user must have the `REPLICATION` privilege (or be a superuser), and the server must be configured with `wal_level = replica` or higher.
- **Not available on most managed services.** Providers do not expose the replication interface for direct `pg_basebackup` use.

### Which one to use?

Use **logical backups** when portability matters: cross-version migrations, managed cloud databases, or when you need to restore individual objects rather than a whole cluster.

Use **physical backups** when speed and recoverability matter: large self-hosted clusters, disaster recovery setups, or environments where restore time is critical.

Both strategies are available through this integration, using two different URI schemes.

---

## Installing the PostgreSQL integration

The integration is **only available for plakar v1.1.0-beta.7 and above**.

First, install plakar:

```sh
$ go install github.com/PlakarKorp/plakar@v1.1.0-beta.7
```

Then install the integration:

```sh
$ plakar pkg add postgresql
```

Or build it yourself from the [source repository](https://github.com/PlakarKorp/integration-postgresql):

```sh
$ plakar pkg build postgresql
postgresql_v1.1.0-beta.2_darwin_arm64.ptar
$ plakar pkg add ./postgresql_v1.1.0-beta.2_darwin_arm64.ptar
```

The machine running Plakar also needs the standard PostgreSQL client tools in `$PATH`.
On Debian/Ubuntu: `apt install postgresql-client`.
On macOS via Homebrew: `brew install postgresql`.

---

## Logical backups (`postgres://`)

The `postgres://` URI scheme triggers logical backups using `pg_dump` or `pg_dumpall`.

### Backing up a single database

Point the URI at a specific database and Plakar does the rest:

```sh
$ plakar source add mypg \
  postgres://postgres:secret@db.example.com/myapp
$ plakar at /var/backups backup @mypg
```

Three records are stored in the snapshot:
- `/manifest.json`: cluster metadata captured at backup time (more on this [below](#the-manifest))
- `/globals.sql`: roles and tablespaces from the whole cluster (`pg_dumpall --globals-only`)
- `/myapp.dump`: the database itself in `pg_dump` custom format

### Backing up all databases

Omit the database name from the URI to back up everything:

```sh
$ plakar source add mypg postgres://postgres:secret@db.example.com/
$ plakar backup @mypg
```

This runs `pg_dumpall` and stores two records: `/manifest.json` and `/all.sql`, which contains all databases, roles, and tablespaces.

---

## Physical backups (`postgres+bin://`)

The `postgres+bin://` URI scheme triggers a physical backup using `pg_basebackup`.

The server must have `wal_level = replica` or higher in `postgresql.conf`, and the backup user must have the `REPLICATION` privilege (or be a superuser).

```sh
$ plakar source add mypg postgres+bin://replicator:secret@db.example.com
$ plakar backup @mypg
```

The entire data directory is streamed file by file into the snapshot, preserving paths, permissions, and timestamps. A `/manifest.json` record is also written alongside the backup data (more on this [below](#the-manifest)).

---

## Restore

### Logical backups

Logical restores go through the `postgres://` exporter:

```sh
# Restore a single database (created automatically if it doesn't exist)
$ plakar destination add mypgdst postgres://postgres:secret@db.example.com/myapp \
  create_db=true
$ plakar restore -to @mypgdst <snapid>

# Restore all databases to a fresh server
$ plakar destination add mypgdst postgres://postgres:secret@db.example.com/
$ plakar restore -to @mypgdst <snapid>

# Restore, skipping ownership changes (when roles differ on the target)
$ plakar destination add mypgdst postgres://postgres:secret@db.example.com/myapp \
  no_owner=true
$ plakar restore -to @mypgdst <snapid>
```

### Physical backups

There is no dedicated PostgreSQL exporter for physical restores. The snapshot contains plain files, so any file-restore connector works. The simplest option is restoring directly to a local directory:

```sh
$ plakar restore -to ./restored <snapid>
$ docker run --rm -v "$PWD/restored/data:/var/lib/postgresql/data" postgres:17
```

The data directory must not be in use by a running PostgreSQL instance before restoration begins.

---

## The manifest

Backing up the data is one thing. Knowing *what* is in the backup, without having to restore it first, is another.

Every snapshot written by this integration includes a `/manifest.json` record written **before** the backup data begins. Its purpose is to capture the full state of the cluster as structured metadata at the time the backup was taken.

This covers server version, host, cluster system identifier, whether the backup was taken from a hot standby, server configuration parameters, all roles and their memberships, tablespaces, and for every database: its schemas, extensions, tables, views, sequences, columns, indexes, and constraints.

```json
{
  "version": 2,
  "server_version": "PostgreSQL 17.2",
  "host": "db.example.com",
  "cluster_system_identifier": "7489123456789012345",
  "in_recovery": false,
  "cluster_config": {
    "wal_level": "replica",
    "max_connections": 100,
    "data_checksums": true,
    "archive_mode": "on",
    "archive_command_set": true
  },
  "roles": [...],
  "tablespaces": [...],
  "databases": [
    {
      "name": "myapp",
      "schemas": [...],
      "relations": [
        {
          "schema": "public",
          "name": "users",
          "kind": "r",
          "row_estimate": 42381,
          "live_row_estimate": 41903,
          "has_primary_key": true,
          "columns": ["id", "email", "created_at"],
          "indexes": ["users_pkey", "users_email_idx"]
        }
      ]
    }
  ]
}
```

### Why this matters

Right now, the manifest already lets you inspect the structure of a backup without restoring it, or track how a schema evolved between two snapshots.

But this is just the beginning.

The plan is for the Plakar UI to consume this manifest and give you a rich view of what is inside each snapshot: browse databases, drill into schemas and tables, see column types, get a picture of the data that was captured, all without touching the actual dump or spinning up a PostgreSQL server.

---

## Documentation and options

Both connectors already support many options for backup and restore. They are all documented in the [PlakarKorp/integration-postgresql repository](https://github.com/PlakarKorp/integration-postgresql/).

---

## What comes next

Plakar is moving fast and keeps delivering new features.

One of the things coming down the road is point-in-time recovery support.
Once that lands, this integration will be able to take advantage of it: physical backups paired with WAL archiving will allow restoring a cluster to any transaction, not just the moment the backup was taken.
This is the kind of capability that used to require dedicated tooling and a fair amount of operational knowledge to set up.
With Plakar, the goal is to make it as simple as everything else.

---

## Call for testers

This integration is new and I would love to get feedback from people running it against real databases.

If you want to give it a try on your existing PostgreSQL setup and share what you find, come join us on Discord. Whether it works perfectly or something breaks, I want to hear about it!
