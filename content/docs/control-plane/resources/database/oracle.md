---
title: "Oracle Database"
date: "2026-11-23T00:00:00Z"
weight: 6
summary: "How to configure an Oracle Database resource in Plakar Control Plane."
---

# Oracle Database

The Oracle integration allows Plakar Control Plane to back up and restore a
whole Oracle container database (CDB), every PDB included, with RMAN. The
database stays open during a backup. A snapshot holds the datafiles, the
archived logs that make them consistent, the control file and the spfile, so it
rebuilds the database on the server it was taken from or on a new one.

## Running Oracle tasks on an edge

RMAN connects only to the local instance, never through the listener. Oracle
tasks therefore run on an [edge](../../edges) installed on the database server
itself.

Enroll the edge of each database server in an edge pool of its own, and assign
the Oracle resource of that server to it. PCP runs a task on any edge of the
pool, so a pool shared by several servers sends tasks to edges that cannot reach
the database. See
[selecting an edge](../../edges/running-tasks#selecting-an-edge).

RMAN connects as SYSDBA with OS authentication, as the OS user the edge runs as.
That user must be in the OSDBA group (`dba`). The OSBACKUPDBA group
(`backupdba`) alone is refused. It must also be in the Oracle inventory group
(`oinstall`), which owns the Oracle home and files RMAN reads there.

## Inventory Management

Currently no [managed inventory](../../inventories#managed-inventories) can
discover Oracle databases. You need to set up a
[self-managed inventory](../../inventories/self-managed) before adding an Oracle
resource.

### Adding Oracle as a resource

When using a self-managed inventory, register the resource with `Database` as
the class and the hostname of the database server as the endpoint. RMAN does not
use the endpoint to connect. See [resources documentation](../../resources) for
how to set up resources on a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR
  subgraph Server["Database server"]
    CDB["Oracle CDB"]
    Edge["Edge<br/>runs RMAN"]
    Staging["Staging directory"]
  end

  Store["Kloset Store"]

  CDB -->|"RMAN backup"| Staging
  Staging --> Edge
  Edge -->|"Encrypt & deduplicate"| Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR
  Store["Kloset Store"]

  subgraph Server["Database server"]
    Edge["Edge<br/>runs RMAN"]
    Staging["Staging directory"]
    CDB["Oracle CDB"]
  end

  Store --> Edge
  Edge --> Staging
  Staging -->|"RMAN restore & recover"| CDB
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared configuration

The following settings are available when configuring both source and
destination apps.

- **Sid**: Required. The `ORACLE_SID` of the container database.
- **Oracle Home**: The `ORACLE_HOME` RMAN runs with. Defaults to the one in the
  environment of the edge.
- **Rman Path**: The path to the `rman` command. Defaults to `bin/rman` in
  **Oracle Home** when it is set, and to `rman` in the `$PATH` of the edge
  otherwise.
- **Backup Dir**: The directory backups and restores stage the RMAN backup
  pieces in. Defaults to the system temporary directory.
- **Nfs Mount**: Linux only. An NFS share mounted on the database server, used
  instead of **Backup Dir**. See
  [Staging on an NFS share](#staging-on-an-nfs-share).

### Staging directory

The database server process writes and reads the backup pieces, as the OS user
of the database, usually `oracle`. Each backup and each restore stages them in a
new directory under **Backup Dir**, unencrypted, and removes it when the task
ends. That directory has mode `0770`, so only the edge user and the group of the
directory reach it. It holds the full backup of the CDB at once, so **Backup
Dir** needs that much free space.

Unless the edge runs as the database user, point **Backup Dir** at a directory
whose group the database user belongs to:

```sh
install -d -o <edge-user> -g oinstall -m 2770 /var/lib/plakar-edge/rman
```

The setgid bit makes each staging directory inherit the `oinstall` group. A
default ACL that grants the database user `rwx` on **Backup Dir** works too.

### Staging on an NFS share

On Linux, **Nfs Mount** stages the backup pieces on an NFS share mounted on the
database server, instead of **Backup Dir**. The share needs room for a full
backup of the CDB and holds the pieces unencrypted, so export it to the database
server only.

Mount the share over NFSv3 with the `hard` option, since a `soft` mount can lose
writes. For example, in `/etc/fstab`:

```txt
nas:/export/rman  /mnt/plakar-rman  nfs  vers=3,proto=tcp,hard,rsize=1048576,wsize=1048576,timeo=600,_netdev,nofail  0 0
```

Create `plakar/` on the share with the same group setup as **Backup Dir**:

```sh
install -d -o <edge-user> -g oinstall -m 2770 /mnt/plakar-rman/plakar
```

The edge user, the database user and the `oinstall` group need the same numeric
IDs on the NAS as on the database server. Each server writes under its own
`plakar/<hostname>/` directory, so several servers can share one export.

Oracle's Direct NFS client (dNFS) and direct I/O work on the share. dNFS is off
until the Oracle binary is relinked with `make -f ins_rdbms.mk dnfs_on`, in
`$ORACLE_HOME/rdbms/lib`. With dNFS, the export needs the `insecure` option.

## Backing up a database

A backup takes every datafile, including those unchanged since the last backup,
and every archived log written while it runs, including logs your own RMAN jobs
have already backed up. Each snapshot therefore restores on its own, without any
other backup. A restore uses only the backup pieces in its snapshot.

Schedule the tasks of a database so that only one backup or restore runs at a
time.

## Restoring a database

A restore rebuilds the whole CDB from a snapshot. It aborts the instance first,
so every PDB is down until the restore completes. It overwrites everything,
including the spfile, the control file and the online redo logs. RMAN recovers
the database to the end of the backup and opens it with `RESETLOGS`.

The destination instance must have the same `ORACLE_SID` as the source. PCP
refuses the restore when the instance has another database mounted, with a
different DBID from the snapshot. A database that is shut down cannot be
checked. Before restoring onto a server whose database is down, make sure that
database is the one the snapshot was taken from, or that there is none.

A new server needs:

- the same Oracle release, on a platform of the same byte order
- the same `ORACLE_SID`, with the edge user in its OSDBA and Oracle inventory
  groups
- the directories the spfile names, such as the audit, diagnostic, datafile and
  control file locations

## Limitations

- RAC is not supported. A backup of a RAC database fails.
- A snapshot taken while the spfile was in ASM cannot be restored.
- RMAN never backs up the Transparent Data Encryption (TDE) keystore, and a
  restore of encrypted tablespaces needs it. A backup warns when the database
  has encrypted tablespaces. Back up the keystore separately.
- A snapshot holds every PDB of its CDB. When the PDBs of one CDB belong to
  different tenants, back the CDB up to a store that only people allowed to see
  every PDB can read.
