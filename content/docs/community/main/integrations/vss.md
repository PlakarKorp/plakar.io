---
title: "Windows VSS"
date: "2026-09-10T00:00:00Z"
weight: 25
summary:
  "Back up and restore live Windows systems through Volume Shadow Copy Service."
---

# Windows VSS

The VSS integration backs up a drive or directory on a live Windows host. Plakar
connects over SSH, requests a Volume Shadow Copy of the target volume, then
reads the files from that read-only copy over SFTP. This enables you to have
consistent backups while your Windows system keeps running.

The integration includes two connectors:

| Connector type            | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| **Source connector**      | Back up a drive or directory on a live Windows host.          |
| **Destination connector** | Restore snapshots from a Kloset store back to a Windows host. |

**Requirements**

- A Windows host with OpenSSH Server installed, running, and reachable.
- An administrative user account on the Windows host to run the backup as.
- An SSH key authorized for that account.

**Typical use cases**

- Backing up a Windows drive in a consistent state without taking the system
  offline.
- Protecting data managed by VSS-aware applications such as SQL Server and
  Active Directory.
- Restoring a Windows file tree to the original host or to a replacement
  machine.

## Installation

The VSS integration is distributed as a pre-built package only. Unlike most
Community integrations, it has no public source repository, so
`plakar pkg build` cannot produce it. It remains free to install with a Plakar
account. See
[source availability](../../guides/managing-packages/#source-availability) for
how this differs from the other integrations.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the VSS package:

```bash
$ plakar pkg add vss
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
| `location`            | Yes      | An SFTP-style URL to the Windows host, drive, and path. Must begin with `vss://`.                                                                                            |
| `username`            | Yes      | The name of an administrative user account to perform the operation with.                                                                                                    |
| `port`                | No       | The SSH server port. Defaults to `22`.                                                                                                                                       |
| `root`                | No       | The absolute path to the Windows drive and directory or file to back up. Defaults to the entire `C:` drive.                                                                  |
| `identity`            | No       | Path to the SSH private key file used for authentication. If it is not set and an ssh-agent is running, the keys held by the agent are used. Otherwise authentication fails. |
| `ssh_auth_sock`       | No       | Path to the socket of a running ssh-agent.                                                                                                                                   |
| `ssh_private_key`     | No       | SSH private key material in PEM or OpenSSH format, loaded into the ssh-agent with `ssh-add`.                                                                                 |
| `ssh_private_key_ttl` | No       | Lifetime for keys added to the ssh-agent with `ssh-add`, for example `5s`, `1m`, or `1h`.                                                                                    |

## Source connector

The source connector requests a shadow copy of the volume holding the target
path, then reads the files from that snapshot over SFTP and stores them in a
Kloset store with encryption and deduplication.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["Windows Host"]
  VSS["VSS Snapshot"]
  FS["D:/"]
end

Plakar["Plakar"]

Via["Request snapshot over SSH<br/>and read files over SFTP"]

Store["Kloset Store"]

FS --> VSS --> Via --> Plakar --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Configure

```bash
# Configure the D: drive on a Windows machine as a backup source
$ plakar source add mywindowsbox location=vss://Administrator@192.168.1.42/D:/

# Back up the source to a Kloset store
$ plakar at /var/backups backup "@mywindowsbox"
```

## Destination connector

The destination connector reconstructs files from a snapshot and writes them
back to the Windows host over SFTP.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Via["Push files over<br/>SFTP"]

subgraph Destination["Windows Host"]
  FS["D:/"]
end

Store --> Plakar --> Via --> FS
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Configure

```bash
# Configure a backup destination corresponding to the backup source
$ plakar destination add mywindowsbox location=vss://Administrator@192.168.1.42/D:/

# Restore a snapshot to the D: drive
$ plakar at /var/backups restore -to "@mywindowsbox" <snapshot_id>
```

## See also

- [Setting Up OpenSSH Server on Windows](/docs/control-plane/guides/windows/windows-openssh-setup)
- [Windows VSS in Plakar Control Plane](/docs/control-plane/resources/compute/vss)
- [Managing packages](../../guides/managing-packages)
