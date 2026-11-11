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
Server while the database engine keeps running, and restores it to a Windows
host. It is built on top of the [VSS integration](../vss) and shares its
parameters and behaviour.

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

The Microsoft SQL Server integration is distributed as a pre-built package only.
Unlike most Community integrations, it has no public source repository, so
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

### Host key verification

The MSSQL integration verifies the Windows host against the `known_hosts` file
of the account running `plakar`. The host key must be verified and recorded in
that file before running a backup. See
[SSH host key verification](/docs/control-plane/guides/windows/windows-openssh-setup/#community-integrations-ssh-host-key-verification)
documentation for more information.

## How a backup works

Plakar connects over SSH and requests a Volume Shadow Copy of the volume holding
the SQL Server installation directory. It then reads the files from that
read-only copy over SFTP and stores them in a Kloset store with encryption and
deduplication. SQL Server keeps running during the backup.

## How a restore works

A restore reconstructs the installation directory from a snapshot and writes it
back to the Windows host over SFTP.

SQL Server must be shut down before restoring, since its services hold the
destination files open while they run. Stop every SQL Server service on the
Windows host first. Any service left running keeps file handles open and the
restore fails with an access denied error. See
[destination configuration](/docs/control-plane/resources/database/mssql#destination-configuration)
for the full list of services and how to confirm they are stopped.

## Configuration

Both connectors use the `mssql` protocol. The `location` points at a Windows
host, drive, and path. The default path covers the whole installation, and a
subdirectory targets a single instance.

#### Backup flow

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

#### Restore flow

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

### Shared configuration

The same options apply to the source and destination connectors.

| Option                | Required | Description                                                                                                                                                                  |
| --------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `location`            | Yes      | An SFTP-style URL to the Windows host, drive, and path. Must begin with `mssql://`.                                                                                          |
| `username`            | Yes      | The name of an administrative user account to perform the operation with.                                                                                                    |
| `port`                | No       | The SSH server port. Defaults to `22`.                                                                                                                                       |
| `root`                | No       | The absolute path to the Windows drive and directory to back up. Defaults to `/C:/Program Files/Microsoft SQL Server`. Use a subdirectory to target a single instance.       |
| `identity`            | No       | Path to the SSH private key file used for authentication. If it is not set and an ssh-agent is running, the keys held by the agent are used. Otherwise authentication fails. |
| `ssh_auth_sock`       | No       | Path to the socket of a running ssh-agent.                                                                                                                                   |
| `ssh_private_key`     | No       | SSH private key material in PEM or OpenSSH format, loaded into the ssh-agent with `ssh-add`.                                                                                 |
| `ssh_private_key_ttl` | No       | Lifetime for keys added to the ssh-agent with `ssh-add`, for example `5s`, `1m`, or `1h`.                                                                                    |

### Example

Back up a SQL Server installation:

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

Restore a snapshot, after stopping the SQL Server services:

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
