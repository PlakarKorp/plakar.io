---
title: "Oracle Database"
date: "2026-11-23T00:00:00Z"
weight: 41
summary: "Back up and restore an Oracle container database with RMAN."
---

# Oracle Database

The Oracle integration backs up and restores a whole Oracle container database
(CDB), every PDB included, with RMAN. The database stays open during a backup. A
snapshot holds the datafiles, the archived logs that make them consistent, the
control file and the spfile, so it rebuilds the database on the server it was
taken from or on a new one.

The integration includes two connectors:

| Connector type            | Description                                        |
| ------------------------- | -------------------------------------------------- |
| **Source connector**      | Back up an open Oracle CDB into a Kloset store.    |
| **Destination connector** | Restore a CDB from a snapshot, replacing it whole. |

**Requirements**

- A single-instance Oracle database. RAC is not supported.
- `plakar` running on the database server, as an OS user in the OSDBA (`dba`)
  and Oracle inventory (`oinstall`) groups.
- A staging directory shared with the OS user of the database, with free space
  for a full backup of the CDB.

## Installation

The Oracle integration is distributed as a pre-built package only. Unlike most
Community integrations, it has no public source repository, so
`plakar pkg build` cannot produce it. It remains free to install with a Plakar
account. See
[source availability](../../guides/managing-packages#source-availability) for
how this differs from the other integrations.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the Oracle package:

```bash
$ plakar pkg add oracle
```

Verify installation:

```bash
$ plakar pkg show
```

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages).

## Connecting to the database

RMAN connects only to the local instance, never through the listener, so
`plakar` runs on the database server. RMAN connects as SYSDBA with OS
authentication, as the OS user running `plakar`. That user must be in the OSDBA
group (`dba`). The OSBACKUPDBA group (`backupdba`) alone is refused. It must
also be in the Oracle inventory group (`oinstall`), which owns the Oracle home
and files RMAN reads there.

## Staging directory

The database server process writes and reads the backup pieces, as the OS user
of the database, usually `oracle`. Each backup and each restore stages them in a
new directory under `backup_dir`, unencrypted, and removes it when it ends. That
directory has mode `0770`, so only the user running `plakar` and the group of
the directory reach it. It holds the full backup of the CDB at once, so
`backup_dir` needs that much free space.

Unless `plakar` runs as the database user, point `backup_dir` at a directory
whose group the database user belongs to:

```sh
$ install -d -o plakar -g oinstall -m 2770 /var/lib/plakar/rman
```

The setgid bit makes each staging directory inherit the `oinstall` group. A
default ACL that grants the database user `rwx` on `backup_dir` works too.

## How a backup works

A backup takes every datafile, including those unchanged since the last backup,
and every archived log written while it runs, including logs your own RMAN jobs
have already backed up. Each snapshot therefore restores on its own, without any
other backup. A restore uses only the backup pieces in its snapshot.

Run one backup or restore of a database at a time.

## How a restore works

A restore rebuilds the whole CDB from a snapshot. It aborts the instance first,
so every PDB is down until the restore completes. It overwrites everything,
including the spfile, the control file and the online redo logs. RMAN recovers
the database to the end of the backup and opens it with `RESETLOGS`.

The destination instance must have the same `ORACLE_SID` as the source. The
restore is refused when the instance has another database mounted, with a
different DBID from the snapshot. A database that is shut down cannot be
checked. Before restoring onto a server whose database is down, make sure that
database is the one the snapshot was taken from, or that there is none.

A new server needs:

- the same Oracle release, on a platform of the same byte order
- the same `ORACLE_SID`, with the user running `plakar` in its OSDBA and Oracle
  inventory groups
- the directories the spfile names, such as the audit, diagnostic, datafile and
  control file locations

## Configuration

Both connectors use the `oracle` protocol.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Server["Database server"]
  CDB["Oracle CDB"]
  Staging["Staging directory"]
  Plakar["Plakar"]
end

Store["Kloset Store"]

CDB -->|"RMAN backup"| Staging --> Plakar --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

subgraph Server["Database server"]
  Plakar["Plakar"]
  Staging["Staging directory"]
  CDB["Oracle CDB"]
end

Store --> Plakar --> Staging -->|"RMAN restore & recover"| CDB
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The same options apply to the source and destination connectors.

| Option        | Required | Description                                                                                                          |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `location`    | Yes      | `oracle://` followed by the host. RMAN ignores the host and connects to the local instance.                          |
| `sid`         | Yes      | The `ORACLE_SID` of the container database.                                                                          |
| `oracle_home` | No       | The `ORACLE_HOME` RMAN runs with. Defaults to the one in the environment.                                            |
| `rman_path`   | No       | The path to the `rman` command. Defaults to `bin/rman` in `oracle_home` when it is set, `rman` in `$PATH` otherwise. |
| `backup_dir`  | No       | The directory backups and restores stage the RMAN backup pieces in. Defaults to the system temporary directory.      |

### Example

Back up a container database:

```bash
# Configure the database as a backup source
$ plakar source add orcl location=oracle://localhost sid=ORCLCDB oracle_home=/opt/oracle/product/19c/dbhome_1 backup_dir=/var/lib/plakar/rman

# Back up the source to a Kloset store
$ plakar at /var/backups backup "@orcl"
```

Restore a snapshot:

```bash
# Configure a destination with the same ORACLE_SID
$ plakar destination add orcl location=oracle://localhost sid=ORCLCDB oracle_home=/opt/oracle/product/19c/dbhome_1 backup_dir=/var/lib/plakar/rman

# Restore the snapshot, replacing the whole CDB
$ plakar at /var/backups restore -to "@orcl" <snapshot_id>
```

## Limitations

- RAC is not supported. A backup of a RAC database fails.
- A snapshot taken while the spfile was in ASM cannot be restored.
- RMAN never backs up the Transparent Data Encryption (TDE) keystore, and a
  restore of encrypted tablespaces needs it. A backup warns when the database
  has encrypted tablespaces. Back up the keystore separately.
- A snapshot holds every PDB of its CDB. When the PDBs of one CDB belong to
  different tenants, back the CDB up to a store that only people allowed to see
  every PDB can read.

## See also

- [Oracle Database in Plakar Control Plane](/docs/control-plane/resources/database/oracle)
- [Managing packages](../../guides/managing-packages)
