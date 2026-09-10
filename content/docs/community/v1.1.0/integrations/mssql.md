---
title: "Microsoft SQL Server"
date: "2026-09-10T00:00:00Z"
weight: 26
summary:
  "Back up and restore a Microsoft SQL Server installation on a live Windows
  host."
---

# Microsoft SQL Server

The MSSQL integration backs up the `Program Files` folder used by Microsoft SQL
Server while the database engine keeps running. It is built on top of the
[VSS integration](../vss) and shares its parameters and behaviour. Plakar
connects over SSH, requests a Volume Shadow Copy of the volume holding the SQL
Server installation directory, then reads the files from that read-only copy
over SFTP.

Restoring requires SQL Server to be shut down first, since its services hold the
destination files open while they run.

The integration includes two connectors:

| Connector type            | Description                                                            |
| ------------------------- | ---------------------------------------------------------------------- |
| **Source connector**      | Back up a running SQL Server installation into a Kloset store.         |
| **Destination connector** | Restore a SQL Server installation to a host with the services stopped. |

**Requirements**

- A Windows host running Microsoft SQL Server, with OpenSSH Server installed,
  running, and reachable.
- An administrative user account on the Windows host to run the backup as.
- An SSH key authorized for that account.

**Typical use cases**

- Backing up a SQL Server installation without taking the database engine
  offline.
- Recovering an installation onto the original host or a replacement machine.
- Backing up the data directory of a single instance rather than the whole
  installation.

## Installation

The MSSQL integration is distributed as a pre-built package only. Unlike most
Community integrations, it has no public source repository, so
`plakar pkg build` cannot produce it. It remains free to install with a Plakar
account. See
[source availability](../../guides/managing-packages#source-availability) for
how this differs from the other integrations.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the MSSQL package:

```bash
$ plakar pkg add mssql
```

Verify installation:

```bash
$ plakar pkg show
```

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages).

## Setting up SSH access on the Windows host

The connectors reach the Windows host over SSH, so OpenSSH Server must be
running with a dedicated key authorized for the administrative account Plakar
connects as. See
[Setting Up OpenSSH Server on Windows](/docs/control-plane/guides/windows/windows-openssh-setup)
for the full procedure.

## Configuration options

The same options apply to the source and destination connectors.

| Option                | Required | Description                                                                                                                                                                  |
| --------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `location`            | Yes      | An SFTP-style URL to the Windows host, drive, and path. Must begin with `mssql://`.                                                             |
| `username`            | Yes      | The name of an administrative user account to perform the operation with.                                                                                                    |
| `port`                | No       | The SSH server port. Defaults to `22`.                                                                                                                                       |
| `root`                | No       | The absolute path to the Windows drive and directory to back up. Defaults to `/C:/Program Files/Microsoft SQL Server`. Use a subdirectory to target a single instance.       |
| `identity`            | No       | Path to the SSH private key file used for authentication. If it is not set and an ssh-agent is running, the keys held by the agent are used. Otherwise authentication fails. |
| `ssh_auth_sock`       | No       | Path to the socket of a running ssh-agent.                                                                                                                                   |
| `ssh_private_key`     | No       | SSH private key material in PEM or OpenSSH format, loaded into the ssh-agent with `ssh-add`.                                                                                 |
| `ssh_private_key_ttl` | No       | Lifetime for keys added to the ssh-agent with `ssh-add`, for example `5s`, `1m`, or `1h`.                                                                                    |

## Source connector

The source connector requests a shadow copy of the volume holding the SQL Server
installation, then reads the files from that snapshot over SFTP and stores them
in a Kloset store with encryption and deduplication.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["Windows Host"]
  VSS["VSS Snapshot"]
  FS["Microsoft SQL Server<br/>Program Files"]
end

Plakar["Plakar"]

Via["Request snapshot over SSH<br/>and read files over SFTP"]

Store["Kloset Store"]

FS --> VSS --> Via --> Plakar --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Configure

```bash
# Configure a SQL Server installation as a backup source
$ plakar source add sqlserver location="mssql://Administrator@192.168.1.42/C:/Program Files/Microsoft SQL Server"

# Back up the source to a Kloset store
$ plakar at /var/backups backup "@sqlserver"
```

To back up the data directory of a specific instance, point the location at the
corresponding subdirectory:

```bash
$ plakar source add sqlserver location="mssql://Administrator@192.168.1.42/C:/Program Files/Microsoft SQL Server/MSSQL17.MSSQLSERVER/"
```

## Destination connector

The destination connector reconstructs the installation directory from a
snapshot and writes it back to the Windows host over SFTP.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Via["Push files over<br/>SFTP"]

subgraph Destination["Windows Host"]
  FS["Microsoft SQL Server<br/>Program Files"]
end

Store --> Plakar --> Via --> FS
{{< /mermaid >}}
<!-- prettier-ignore-end -->

Stop every SQL Server service on the Windows host before restoring. Any service
left running keeps file handles open and the restore fails with an access denied
error. See
[destination configuration](/docs/control-plane/resources/database/mssql#destination-configuration)
for the full list of services and how to confirm they are stopped.

### Configure

```bash
# Configure a destination corresponding to the backup source
$ plakar destination add sqlserver location="mssql://Administrator@192.168.1.42/C:/Program Files/Microsoft SQL Server"

# Restore a snapshot to the Windows host
$ plakar at /var/backups restore -to "@sqlserver" <snapshot_id>
```

## See also

- [Windows VSS integration](../vss)
- [Setting Up OpenSSH Server on Windows](/docs/control-plane/guides/windows/windows-openssh-setup)
- [Microsoft SQL Server in Plakar Control Plane](/docs/control-plane/resources/database/mssql)
- [Managing packages](../../guides/managing-packages)
