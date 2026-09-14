---
title: "Microsoft Active Directory"
date: "2026-09-11T00:00:00Z"
weight: 27
summary:
  "Back up and restore Windows System State of Active Directory Domain
  Controllers with Plakar."
---

# Microsoft Active Directory

The Microsoft Active Directory integration captures Windows **System State**
backups of Active Directory Domain Controllers and stores them in a Kloset
store. A System State backup contains the Active Directory database and the rest
of the state Windows needs to reconstruct a Domain Controller, which makes it
the basis for recovering a domain when replication cannot.

The integration provides two connectors:

| Connector type            | Description                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------- |
| **Source connector**      | Create a System State backup on a Domain Controller and store it in a Kloset store. |
| **Destination connector** | Restore a System State backup from a Kloset store to a Domain Controller.           |

**Requirements**

- Windows Server running the Active Directory Domain Services role.
- OpenSSH Server installed, running, and reachable on the Domain Controller.
- A dedicated NTFS volume of at least 20 GB, 40 GB or more recommended.
- An administrative account on the Windows host, with an SSH key authorized for
  it.

## How it works

The integration is built on Plakar's VSS integration and shares most of its
parameters and behaviour. Plakar connects to the Windows host over SSH, triggers
a System State backup onto the dedicated NTFS volume, then takes a VSS snapshot
of that volume and transfers the resulting files over SFTP into the Kloset
store.

Restoring works in the same direction. Plakar writes the System State backup
back to the NTFS volume, and Windows Server Backup then recovers the Domain
Controller from it while the server runs in Directory Services Restore Mode.
Plakar restores the backup files, it does not itself rebuild Active Directory.

A domain that still has a healthy Domain Controller does not need this backup. A
failed Domain Controller is normally rebuilt by replicating Active Directory
from one that is still running, which is why at least two Domain Controllers
kept in sync is the usual arrangement. The System State backup matters when no
healthy Domain Controller is left, or when one has to be rebuilt from scratch.

## Installation

The Microsoft Active Directory integration is distributed as a Plakar package.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the MS AD package:

```bash
$ plakar pkg add msad
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< tab label="Building from source" >}}

Source builds are useful when pre-built packages are unavailable or when
customization is required.

**Prerequisites:**

- Go toolchain compatible with your **Plakar** version

Build the package:

```bash
$ plakar pkg build msad
```

A package archive will be created in the current directory (e.g.
`msad_v1.1.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add ./msad_v1.1.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see the
[managing packages guide](../../guides/managing-packages/).

## Preparing the Windows host

### The backup volume

System State backups are written to a dedicated NTFS volume before Plakar
transfers them, so one has to exist on the Domain Controller before the
integration is used. The volume needs at least 20 GB, and 40 GB or more is
recommended.

The following creates such a volume at drive letter `D:` from an unused physical
disk:

```powershell
PS C:\Users\plakar> Get-PhysicalDisk

Number FriendlyName SerialNumber MediaType   CanPool OperationalStatus HealthStatus Usage           Size
------ ------------ ------------ ---------   ------- ----------------- ------------ -----           ----
0      SYSTEM                    Unspecified False   OK                Healthy      Auto-Select 93.13 GB
1      Backups                   Unspecified True    OK                Healthy      Auto-Select 37.25 GB

PS C:\Users\plakar> Get-Disk -Number 1 | New-Volume -FileSystem NTFS -DriveLetter D -FriendlyName Backups
```

### SSH access

Plakar reaches the Windows host over SSH and moves data with SFTP, so OpenSSH
Server has to be enabled and started before the integration can be used. See
Microsoft's
[OpenSSH overview](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh-overview).

Authorize a dedicated SSH key for the account Plakar connects as, rather than
reusing an existing one. See Microsoft's
[OpenSSH key management](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement).

## Configuration

| Parameter             | Required | Description                                                                                                                          |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `location`            | Yes      | SFTP-style URL to the Windows server, optionally including the drive letter holding System State backups. Must begin with `msad://`. |
| `username`            | Yes      | Administrative account used to perform the backup.                                                                                   |
| `port`                | No       | SSH server port. Defaults to `22`.                                                                                                   |
| `root`                | No       | Letter of the Windows drive holding System State backups. Taken from `location` when unset.                                          |
| `identity`            | No       | Path to the SSH private key. When unset, keys held by a running `ssh-agent` are used, and authentication fails without one.          |
| `ssh_auth_sock`       | No       | Path to the socket of a running `ssh-agent`.                                                                                         |
| `ssh_private_key`     | No       | SSH private key material in PEM or OpenSSH format, loaded into `ssh-agent` with `ssh-add`.                                           |
| `ssh_private_key_ttl` | No       | Lifetime of keys added to the agent, for example `5s`, `1m`, `1h`.                                                                   |

## Examples

Confirm SSH access to the Windows host first, since the integration depends on
it:

```bash
$ eval `ssh-agent`
$ ssh-add
$ ssh Administrator@192.168.1.42
```

Configure the source and back it up:

```bash
$ plakar source set adserver location="msad://Administrator@192.168.1.42/D:/"
$ plakar backup @adserver
```

Configure the matching destination and restore a snapshot to the `D:` drive,
which should be empty:

```bash
$ plakar destination set adserver location="msad://Administrator@192.168.1.42/D:/"
$ plakar restore -to @adserver <snapid>
```

## Recovering a Domain Controller

Restoring the snapshot puts the System State backup back on the NTFS volume. It
does not bring Active Directory back by itself. The Domain Controller is
recovered from those files by Windows Server Backup, running on a server booted
into Directory Services Restore Mode, and the choice between an authoritative
and a non-authoritative restore determines whether the recovered objects
overwrite the copies held by other Domain Controllers.

The full procedure, including preparing the replacement host, the two recovery
modes, and verifying the restored Domain Controller, is documented in
[Microsoft Active Directory](/docs/control-plane/resources/identity/msad/#restoring-a-domain-controller).
