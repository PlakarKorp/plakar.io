---
title: Oracle Database

seo_title: Oracle Database Backup with RMAN to Object Storage

subtitle: Oracle Database backup with RMAN

description: >
  Oracle Database backup with RMAN into encrypted, deduplicated snapshots on
  object storage or SFTP. Restore the whole CDB on the same server or a new one.

technology_image: img/integrations/technology/oracle.svg

technology_title:
  An Oracle backup in the recovery area goes down with the server

technology_description: >
  RMAN writes its backup sets and archived logs to the fast recovery area, often
  on the same storage as the datafiles. By default it keeps a single backup of
  each file. When the volume or the server is lost, the backups are lost with
  it.

  Sending RMAN backups to object storage usually goes through a media manager
  library, and RMAN's own encryption and stronger compression levels are
  separately licensed database options.

  Plakar runs RMAN on the server and keeps each backup as an encrypted snapshot
  on a store you choose. A snapshot holds everything its restore needs, so you
  rebuild the database on a new server from that snapshot alone.

categories:
  - source
  - destination

seo_tags:
  - Oracle backup
  - Oracle Database backup
  - RMAN backup
  - RMAN backup to S3
  - Oracle backup to object storage
  - restore Oracle database to new server
  - Oracle backup encryption

links:
  - type: community
    url: /docs/community/main/integrations/oracle/
  - type: control-plane
    url: /docs/control-plane/resources/database/oracle/

related:
  - postgres
  - mysql
  - mssql
  - s3

edition:
  - community
  - control-plane

stage: beta

binary: true

author:
  - type: official
    name: Plakar

date: 2026-11-19

resource: Oracle

image: img/integrations/oracle.svg
---

## What the Oracle Database integration does {kicker="Overview"}

{{< columns ratio="7:5" sticky="right" >}}

{{< column >}}

The Oracle integration backs up an Oracle container database (CDB), with every
pluggable database (PDB) in it, by running RMAN on the database server, and
stores the backup as an encrypted, deduplicated Plakar snapshot. It restores the
whole CDB with RMAN, on the server it came from or on a new one, recovered to
the SCN at which the backup ended. Plakar runs next to the database and sends
the snapshot to any store you choose: S3-compatible object storage, an SFTP
server or another disk.

Each run is an online RMAN backup. The datafiles, the archived logs that make
them consistent, the control file and the spfile all land in the same snapshot,
with a small `.METADATA.json` that records where they came from.

RMAN connects to the local instance as SYSDBA through operating system
authentication, so no database password appears in the Plakar configuration.

{{< /column >}}

{{< column >}}

```console {title="db-server"}
$ plakar pkg add -devel oracle
$ plakar source add orcl oracle:// sid=ORCL \
    backup_dir=/var/lib/plakar/rman
$ plakar at "@offsite" backup "@orcl"
$ plakar at "@offsite" ls
$
```

{{< /column >}}

{{< /columns >}}

## Why use Plakar for Oracle backup {kicker="Why Plakar"}

{{< cards cols="2" style="ruled" >}}

{{< card label="DEVICE TYPE DISK" >}}

### RMAN to object storage without a media manager

Plakar allocates an RMAN disk channel, reads the backup pieces into a snapshot
and ships them to the store. No SBT library goes into the Oracle home, and the
same backup lands on object storage, an SFTP server or a NAS.

{{< /card >}}

{{< card label="BACKUP ARCHIVELOG FROM SCN" >}}

### Every Oracle snapshot restores on its own

A snapshot carries every archived log written since its backup started, the
control file and the spfile. Its restore needs no recovery catalog, no earlier
backup and no log left on the source server.

{{< /card >}}

{{< card label="client-side encryption" >}}

### Oracle backups encrypted before they leave the server

Plakar encrypts and compresses the backup pieces itself, with the store's
passphrase. RMAN encryption and RMAN compression stay off, and the store only
ever receives encrypted chunks.

{{< /card >}}

{{< card label="FILESPERSET 1" >}}

### Full RMAN backups that deduplicate

Each piece holds a single datafile, so unchanged data lines up from one run to
the next. Every snapshot is a full backup you can restore alone, and the store
keeps the chunks that changed.

{{< /card >}}

{{< /cards >}}

## Oracle backup and recovery scenarios {kicker="Recovery scenarios"}

{{< cards cols="2" style="accent" >}}

{{< card label="DROP USER app CASCADE;" >}}

### An AI agent drops a production Oracle schema

An ops agent asked to remove "unused schemas" runs `DROP USER app CASCADE` on
the production PDB with the DBA's credentials. Flashback Database helps only if
`ALTER DATABASE FLASHBACK ON` ran beforehand, its retention target defaults to
one day (`DB_FLASHBACK_RETENTION_TARGET=1440`), and it rewinds the whole
database, the agent's useful changes included. With a `plakar backup` taken
before the session, and the store and its passphrase never in the agent's
context, restore that snapshot on a second server and bring the `app` schema
back with Data Pump. Production keeps every other change.

{{< /card >}}

{{< card label="REDUNDANCY 1" >}}

### A corruption found after the only RMAN backup rotated

RMAN's default retention policy, `REDUNDANCY 1`, keeps one backup of each
datafile. A bad batch job corrupted invoice rows on Monday and nobody noticed
until Friday, after newer backups had replaced the Monday one. Plakar keeps a
history of snapshots under your own retention, deduplicated, and the snapshot
from Sunday night rebuilds the database as it was before the batch.

{{< /card >}}

{{< card label="db_recovery_file_dest" >}}

### The Oracle server and its recovery area are lost

The fast recovery area sits on the same array as the datafiles. A storage
failure or a lost virtual machine takes the database and every RMAN backup at
once. The latest Plakar snapshot lives on another store and holds the control
file, the spfile and the archived logs, so a new server with the same Oracle
release rebuilds the CDB from it.

{{< /card >}}

{{< card label="DELETE NOPROMPT BACKUP;" >}}

### Ransomware runs as the oracle user

An attacker who gets the `oracle` account can run RMAN and delete every backup
the control file knows about. Plakar runs as its own user and writes to a store
on another host. `plakar sync` keeps a second copy elsewhere, and Object Lock on
the bucket keeps it from deletion when the storage supports it.

{{< /card >}}

{{< /cards >}}

## How to back up Oracle with RMAN to S3-compatible object storage {kicker="RMAN to object storage"}

{{< columns ratio="5:7" sticky="right" >}}

{{< column >}}

The Plakar CLI is free and open source, and the Oracle integration is a
pre-built package. Everything below runs on the database server, as a user in
the `dba` and `oinstall` groups.

{{< steps >}}

{{< step >}}

**Install the integrations.** Log in to Plakar, then add the Oracle package from
the development tree and the S3 package for the store.

{{< /step >}}

{{< step >}}

**Share a staging directory with the database.** RMAN's server process writes
the backup pieces as the database user. A setgid directory owned by group
`oinstall` lets both sides reach them. Plakar removes the pieces once they are
in the snapshot.

{{< /step >}}

{{< step >}}

**Create the store.** Point it at a bucket on any S3-compatible service. Plakar
asks for the passphrase that encrypts every snapshot.

{{< /step >}}

{{< step >}}

**Add the CDB and back it up.** `sid` names the container database. Schedule the
same `backup` command with cron or a systemd timer.

{{< /step >}}

{{< /steps >}}

The [Oracle CLI documentation](/docs/community/main/integrations/oracle/) lists
every option of the integration.

{{< /column >}}

{{< column >}}

```console {title="db-server"}
$ plakar login
$ plakar pkg add -devel oracle
$ plakar pkg add s3

$ sudo install -d -o plakar -g oinstall -m 2770 \
    /var/lib/plakar/rman

$ plakar store add offsite \
    s3://s3.example.com/oracle-backups \
    access_key=... secret_access_key=...
$ plakar at "@offsite" create

$ plakar source add orcl oracle:// sid=ORCL \
    oracle_home=/u01/app/oracle/product/dbhome_1 \
    backup_dir=/var/lib/plakar/rman
$ plakar at "@offsite" backup "@orcl"
$ plakar at "@offsite" check
```

{{< /column >}}

{{< /columns >}}

## How to restore an Oracle database to a new server {kicker="New server"}

{{< columns ratio="5:7" sticky="right" >}}

{{< column >}}

A Plakar snapshot rebuilds the whole CDB on a server that has never seen it.
RMAN restores the spfile and the control file from the snapshot, then the
datafiles, applies the archived logs up to the snapshot's SCN and opens the
database with `RESETLOGS`. The restored database keeps the DBID of the source.

{{< steps >}}

{{< step >}}

**Prepare the server.** Install the same Oracle release on a platform with the
same byte order, set up the same `ORACLE_SID`, and create the audit, diagnostic,
datafile and control file directories that the spfile names.

{{< /step >}}

{{< step >}}

**Set up Plakar.** Install the Oracle and S3 packages, add a user in the `dba`
and `oinstall` groups, and create the shared staging directory.

{{< /step >}}

{{< step >}}

**Pick the snapshot.** Connect the same store, list the snapshots and read the
`.METADATA.json` of the one you want: it shows the SID, the DBID, the release
and the SCN it recovers to.

{{< /step >}}

{{< step >}}

**Restore.** Add the CDB as a destination and run `plakar restore`. RMAN
rebuilds the database and opens every PDB.

{{< /step >}}

{{< step >}}

**Check the result.** Query `v$database` and `v$pdbs`, then point the
applications at the new server.

{{< /step >}}

{{< /steps >}}

{{< /column >}}

{{< column >}}

```console {title="new-db-server"}
$ plakar store add offsite \
    s3://s3.example.com/oracle-backups \
    access_key=... secret_access_key=...
$ plakar at "@offsite" ls
$ plakar at "@offsite" cat 7f3c21ab:/.METADATA.json

$ plakar destination add orcl oracle:// sid=ORCL \
    backup_dir=/var/lib/plakar/rman
$ plakar at "@offsite" restore -to "@orcl" 7f3c21ab
```

```sql {title="sqlplus / as sysdba"}
SELECT name, dbid, open_mode FROM v$database;
SELECT name, open_mode FROM v$pdbs;
```

{{< /column >}}

{{< /columns >}}

## What an Oracle backup snapshot contains {kicker="Inside a snapshot"}

{{< columns ratio="5:7" >}}

{{< column >}}

A snapshot is one RMAN backup of the whole CDB, stored as the backup pieces RMAN
wrote. Each datafile has a piece of its own. The archived logs, the control file
and the spfile follow, and `.METADATA.json` records the source and the recovery
target.

The metadata gives the SCN the restore recovers to, the incarnation it belongs
to, the database name, unique name and DBID, the release and platform, the
spfile location and the number of encrypted tablespaces. The `tag` is unique to
the snapshot, and the restore takes its datafiles from that backup only.

Snapshots of a database are grouped under its `db_unique_name` and DBID, so the
history carries on after a restore to a new server.

{{< /column >}}

{{< column >}}

```tree
/
├── .METADATA.json
├── 2u3b9d1a_94_1
├── 2v3b9d1c_95_1
├── 303b9d2f_96_1
├── 313b9d3h_97_1
├── 323b9d3k_98_1
├── 333b9d3m_99_1
├── controlfile_343b9d3p_100_1
└── spfile_353b9d3q_101_1
```

```json {title="plakar cat 7f3c21ab:/.METADATA.json"}
{
  "format_version": 1,
  "scn": 48211907,
  "resetlogs_scn": 1920977,
  "resetlogs_time": "2026-03-02 09:14:27",
  "cdb": "ORCL",
  "dbid": 1694183711,
  "db_name": "ORCL",
  "db_unique_name": "ORCL",
  "version": "23.0.0.0.0",
  "platform": "Linux x86 64-bit",
  "spfile": "/u01/app/oracle/product/dbhome_1/dbs/spfileORCL.ora",
  "cluster": false,
  "instances": ["ORCL"],
  "encrypted_tablespaces": 0,
  "tag": "PLAKAR_K7Q2M4XWZ3B6N5R2T7Y4P3D"
}
```

{{< /column >}}

{{< /columns >}}

## How Plakar runs RMAN on a production Oracle database {kicker="Under the hood"}

{{< cards cols="3" style="boxed" >}}

{{< card label="online backup" >}}

### The Oracle database stays open during the backup

RMAN backs up the open CDB while the PDBs serve traffic. Once the datafiles are
done, Plakar archives the current redo log, so the redo written during the
backup is stored in the same snapshot.

{{< /card >}}

{{< card label="TAG PLAKAR_…" >}}

### Plakar runs alongside your own RMAN jobs

Plakar backs up every archived log since its start SCN, even the ones your own
jobs already backed up, and tags its backup with a unique name. A restore never
depends on a backup set that another job may have deleted.

{{< /card >}}

{{< card label="RMAN-06059" >}}

### An Oracle backup that cannot restore fails loudly

When an archived log of the backup window is missing, RMAN or Plakar stops the
backup with an error that names the gap. A snapshot is recorded only when its
redo is complete.

{{< /card >}}

{{< card label="SET UNTIL SCN" >}}

### The Oracle restore stops at the snapshot's SCN

Recovery applies the snapshot's redo up to its SCN and goes no further. A
`DROP TABLE` run after the backup is not replayed, and commits made before it
are all there.

{{< /card >}}

{{< card label="DBID check" >}}

### The Oracle restore checks the DBID of its target

Before it touches the instance, Plakar compares the SID and the DBID of the
mounted database with the snapshot's, and refuses to overwrite another database.
Each RMAN step runs in one block, and a failed recovery leaves the database
closed.

{{< /card >}}

{{< card label="RESET DATABASE TO INCARNATION" >}}

### Older Oracle snapshots after a restore

Each restore opens a new incarnation. Plakar records the incarnation in every
snapshot, so you can still go back to a snapshot taken before an earlier
restore.

{{< /card >}}

{{< /cards >}}

## Oracle backup tools compared: Plakar, backup suites and RMAN scripts {kicker="Comparison"}

Oracle backups usually take one of two other forms: an enterprise backup suite
that plugs into RMAN as a media manager, or an RMAN script that writes to a
local disk or an NFS share. Plakar drives RMAN like the script and keeps an
encrypted, off-server history like the suites.

|                                            | Plakar                                                                                                                        | Enterprise backup suites with an RMAN plug-in | An RMAN script to a local disk or NFS share       |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------- |
| Native RMAN backup                         | ✓ RMAN disk channel driven by Plakar                                                                                          | ✓ RMAN channels through the suite's library   | ✓ Your RMAN script                                |
| Nothing added to the Oracle home           | ✓ No SBT library                                                                                                              | ✗ An SBT library per Oracle home              | ✓                                                 |
| Encryption without RMAN encryption         | ✓ Client-side, before the data leaves the server                                                                              | ◐ Depends on the product                      | ✗ RMAN encryption, a separately licensed option   |
| History beyond one backup                  | ✓ Deduplicated snapshots under your retention                                                                                 | ✓ The suite's retention                       | ◐ As many backups as the disk holds               |
| Each restore point restores on its own     | ✓ Archived logs, control file and spfile in every snapshot                                                                    | ◐ Depends on the product                      | ◐ Depends on the script and the logs left on disk |
| Copy off the database server               | ✓ Object storage, SFTP or another disk                                                                                        | ✓ The suite's storage                         | ◐ An NFS share, often in the same site            |
| Fleet-wide scheduling                      | ✓ Plakar Control Plane policies                                                                                               | ✓ A central console                           | ✗ A cron job per server                           |
| Oracle and the rest of the stack, one tool | ✓ The same CLI and store for [PostgreSQL](/integrations/postgres/), [MySQL](/integrations/mysql/) and [S3](/integrations/s3/) | ✓ Usually, with one plug-in per technology    | ✗ Oracle only                                     |

## Oracle backups across a fleet with Plakar Control Plane {kicker="Control Plane"}

{{< columns ratio="5:7" sticky="left" >}}

{{< column >}}

When Oracle databases run on many servers, Plakar Control Plane takes over the
scheduling and gives one view of what is protected. The Oracle integration is
available there as a database resource, with the options of the CLI.

[See how Plakar Control Plane works](/solutions/control-plane/), read the
[Control Plane Oracle documentation](/docs/control-plane/resources/database/oracle/),
or [contact us](/contact/) to plan a deployment.

{{< /column >}}

{{< column >}}

{{< steps >}}

{{< step >}}

**Run an edge on the database server.** RMAN reaches the local instance, so the
task runs where the database runs.

{{< /step >}}

{{< step >}}

**Register the servers.** Self-hosted Oracle servers go into a self-managed
inventory as resources of class `Database`.

{{< /step >}}

{{< step >}}

**Attach a source.** Choose `oracle`, with the SID and the staging directory of
each server.

{{< /step >}}

{{< step >}}

**Let a policy schedule it.** A policy sets the frequency, the retention and the
target store, and every matching database is backed up on that schedule.

{{< /step >}}

{{< /steps >}}

{{< /column >}}

{{< /columns >}}

## Oracle Database backup FAQ {kicker="FAQ"}

{{< columns ratio="1:1" >}}

{{< column >}}

### What does a Plakar Oracle backup contain?

The whole container database: the RMAN backup pieces of every datafile of the
root and of every PDB, the archived logs written during the backup, the control
file, the spfile and a `.METADATA.json` with the SCN the restore recovers to.

### Does the Oracle database stay online during the backup?

Yes. RMAN takes an online backup of the open CDB, and the archived logs in the
snapshot make the datafiles consistent at restore time.

### How are Oracle backups encrypted with Plakar?

On the database server, before anything leaves it, with the passphrase of the
Plakar store. RMAN backup encryption stays off. Oracle lists RMAN encryption of
backups to disk as part of the Oracle Advanced Security option.

### Where does RMAN write during a Plakar backup?

To a staging directory under `backup_dir`, created for each run with mode
`0770`. Plakar reads the pieces into the snapshot and removes the directory when
the backup ends.

### Which Oracle privileges does Plakar need?

None stored in Plakar. RMAN connects as SYSDBA with operating system
authentication, so the user that runs Plakar belongs to the `dba` and `oinstall`
groups.

### Can Plakar run alongside my existing RMAN backup jobs?

Yes. Plakar uses its own tag, backs up every archived log it needs even when
your jobs already did, and restores only from its own backup.

### How do I back up Oracle to S3-compatible object storage?

Create a Plakar store on the bucket with `plakar store add`, add the CDB as a
source with `oracle:// sid=ORCL`, and run `plakar backup`. RMAN writes to disk
and Plakar uploads encrypted chunks.

{{< /column >}}

{{< column >}}

### What happens when an Oracle backup fails?

The Plakar backup fails and reports the RMAN error, for example a staging
directory the database cannot write to or a missing archived log. The database
keeps running, and the earlier snapshots stay as they were.

### Where can I restore an Oracle backup?

On the server it came from, or on a new server that runs the same Oracle
release, on a platform with the same byte order, under the same `ORACLE_SID`.

### Which point in time does a restore bring back?

The SCN at which the backup ended. RMAN recovers the datafiles to that SCN and
opens the database with `RESETLOGS`, so later changes are not replayed.

### How do I get one Oracle table or schema back?

Restore the snapshot on a second server with the same release and SID, then
export the table or schema with Data Pump and import it into production.

### How do I check an Oracle snapshot before restoring it?

`plakar check` verifies that the snapshot is intact, and
`plakar cat <snapshot_id>:/.METADATA.json` shows its database, release and
recovery SCN.

### How does Plakar keep full Oracle backups small?

The integration writes one datafile per backup piece, and Plakar stores only the
chunks that changed since earlier snapshots. Each snapshot is still a full
backup.

### What is the RMAN default retention policy?

`REDUNDANCY 1`: RMAN keeps one backup of each datafile and control file. Plakar
snapshots have a retention of their own, set with `plakar prune` or a Control
Plane policy.

{{< /column >}}

{{< /columns >}}
