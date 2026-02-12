---
title: "Physical backups with pg_basebackup"
description: >
    How to perform physical backups of a PostgreSQL cluster using pg_basebackup, and store them with Plakar.
last_reviewed: "2026-02-11"
last_reviewed_version: "v1.1.0"
weight: 2
aliases:
  - /docs/v1.0.6/guides/postgresql/pg_base_backup
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

# Overview

`pg_basebackup` is the standard PostgreSQL utility used to perform **physical backups** of a PostgreSQL cluster.  
Unlike SQL dumps, a physical backup captures the entire data directory, allowing you to restore a PostgreSQL instance exactly as it was at backup time, including configuration files and internal state.

For a deeper understanding of physical backups, replication, and base backups, refer to the [official PostgreSQL documentation on pg_basebackup](https://www.postgresql.org/docs/current/app-pgbasebackup.html).

## Requirements

This guide assumes that you have:

- A running PostgreSQL server configured to allow base backups.
- A PostgreSQL role with `REPLICATION` privileges.
- The environment variables `PGHOST`, `PGPORT`, `PGUSER`, and `PGPASSWORD` set to connect to your PostgreSQL server.
- `pg_basebackup` available on the system where the backup is performed.

### pg_hba.conf configuration

Since `pg_basebackup` requires replication connections, ensure that your `pg_hba.conf` file includes an entry allowing the backup user to connect for replication. For example:

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   replication     all                                     trust
```

This entry allows local replication connections without a password and should only be used in trusted environments.

Adapt the configuration to your needs and restart PostgreSQL after making changes.

## Performing the backup

### Directory-based backup

`pg_basebackup` expects a directory where the database will be copied. This directory can be stored with Plakar, like any other directory.

Run the following commands:

```bash
export PGUSER=xxx
export PGPORT=5432
export PGHOST=xxx
export PGPASSWORD=xxx

pg_basebackup -D ./database
plakar at /var/backups backup ./database
rm -rf ./database
```

This sequence of commands:
* Exports the necessary environment variables to connect to the PostgreSQL server.
* Runs `pg_basebackup`, storing the backup in a local directory named `./database`.
* Uses Plakar to back up the `./database` directory into the Kloset store at `/var/backups`.
* Removes the local backup directory to free up space.

With this method, WAL files are fetched as needed during the base backup process.

## Tar-based backup

Storing the backup to an intermediate directory can be a problem, as it requires enough space to store the backup.

Alternatively, `pg_basebackup` can create a tarball. This tarball can be used with the `tar` source importer of Plakar.

```bash
export PGUSER=xxx
export PGPORT=5432
export PGHOST=xxx
export PGPASSWORD=xxx

pg_basebackup -D - -F tar -X fetch | plakar at /var/backups backup -no-progress tar:///dev/stdin
```

*While no intermediate directory is created, this method may be slower as it requires serializing the data into a tarball stream.*

## Restoring a physical backup

To restore a physical backup created with `pg_basebackup`, use the `plakar restore` command to extract the backup to a local directory.

```bash
 plakar at /var/backups restore -to ./mydb 3bcb4fd8
 ```

This command restores the snapshot with ID `3bcb4fd8` from the Kloset store located at `/var/backups` to a local directory named `./mydb`.

*This command is not PostgreSQL-specific. It works for any data stored in Plakar.*

## Running PostgreSQL with Docker from a physical backup

With a physical backup, you can easily run a PostgreSQL instance using Docker, provided the PostgreSQL version matches the one used to create the backup.

```bash
docker run --rm -ti --name pg -v ./mydb:/var/lib/postgresql/data postgres
```

This command starts a PostgreSQL container using the official `postgres` image, mounting the restored backup directory `./mydb` as the data directory for PostgreSQL.

Replace `postgres` with `postgres:<version>` to specify the desired PostgreSQL version.

To connect to the running PostgreSQL instance, use:

```bash
docker exec -ti pg psql -U postgres -c '\l'
```

## Considerations

### Physical vs logical backups
	
SQL dumps (`pg_dump`, `pg_dumpall`) are logical backups, portable across PostgreSQL versions and architectures.

`pg_basebackup` produces physical backups, which are faster to restore but must be used with a compatible PostgreSQL version and system layout.

Choose the method that best fits your recovery and portability requirements.

### Read-only mounts

Plakar supports a FUSE filesystem that allows mounting a Kloset store as a read-only filesystem.

PostgreSQL requires read-write access to its data directory, even for read-only operations. Therefore, it is not possible to run PostgreSQL directly from a read-only mount of a Kloset store.

### Kloset store location

In the examples above, we used `/var/backups` as the Kloset store location.

It is possible to use other store locations, for example to store the snapshots in a cloud storage bucket. Check the guide [Create a Kloset store](../../create-kloset-repository) for more information on setting up Kloset stores.
