---
title: "RouterOS"
date: "2026-10-26T00:00:00Z"
weight: 35
summary:
  "Back up and restore MikroTik RouterOS device configurations with Plakar."
---

# RouterOS

The RouterOS integration backs up the configuration of a MikroTik RouterOS
device and restores it to a device. It reaches the device over SSH, so no agent
has to be installed on it.

The integration includes two connectors:

| Connector type            | Description                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| **Source connector**      | Back up the configuration of a RouterOS device into a Kloset store. |
| **Destination connector** | Restore a text export from a Kloset store to a RouterOS device.     |

Each protocol covers a different form of the configuration:

| Protocol          | Backup | Restore | What it holds                                             |
| ----------------- | ------ | ------- | --------------------------------------------------------- |
| `routeros+export` | Yes    | No      | A text export of the configuration, as a `.rsc` script.   |
| `routeros+backup` | Yes    | No      | A system backup of the device, as a `.backup` file.       |
| `routeros`        | No     | Yes     | Restores a text export, backed up with `routeros+export`. |

Restoring a system backup is not supported yet.

**Requirements**

- A RouterOS device with SSH enabled, reachable from the machine running Plakar.
- A RouterOS user allowed to connect over SSH, run the export or backup
  commands, and read and write files on the device.

## Installation

The RouterOS integration is distributed as a Plakar package.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the RouterOS package:

```bash
$ plakar pkg add routeros
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
$ plakar pkg build routeros
```

A package archive will be created in the current directory (e.g.,
`routeros_v1.1.0-alpha.3_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add -allow-unsigned ./routeros_v1.1.0-alpha.3_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages).

## How backups and restores work

A backup asks the device to write its configuration to a file, either a text
export with `/export` or a system backup with `/system backup save`. Plakar then
downloads the file over SFTP, stores it in the Kloset store, and deletes it from
the device.

The two forms serve different purposes. A text export is a readable `.rsc`
script of the commands that rebuild the configuration, which can be reviewed,
compared between snapshots, and applied to another device. A system backup is a
binary copy of the device configuration, meant to bring back the same device.

A restore uploads the text export to the device and runs `/import` on it. With
`dry_run=true`, the device checks the script without applying it, which is a way
to validate a restore before running it for real.

## Authentication

The connectors authenticate over SSH with the first of the following that is
set, and only that one:

- a password, from the `password` option or the location
- the private key set with `private_key`, unlocked with `private_key_passphrase`
  if it has one
- the SSH agent, when the `SSH_AUTH_SOCK` environment variable is set

Without any of them, the connector refuses to start. The user is taken from the
location, such as `admin@192.168.88.1`, or from the `user` option.

The host key of the device is verified before any credential is sent. It is
checked against `host_key` when set, and otherwise against `~/.ssh/known_hosts`.
A device whose key is in neither is refused.

> [!WARNING]+ Ignoring the host key
>
> `insecure_ignore_host_key=true` accepts any host key. Anyone on the network
> path can then impersonate the device and collect the credentials sent to it.
> Prefer adding the device's key with `host_key`.

## Configuration

### Shared configuration

The following options apply to both source and destination connectors.

| Option                     | Required | Description                                                                                               |
| -------------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `location`                 | Yes      | The device, as `<protocol>://[<user>@]<host>[:<port>]`. The port defaults to `22`.                        |
| `user`                     | No       | The SSH user, when it is not given in the location.                                                       |
| `password`                 | No       | The SSH password.                                                                                         |
| `private_key`              | No       | Path to the SSH private key.                                                                              |
| `private_key_passphrase`   | No       | The passphrase that unlocks `private_key`.                                                                |
| `host_key`                 | No       | The device host key, as a public key or a `known_hosts` line. Takes precedence over `~/.ssh/known_hosts`. |
| `insecure_ignore_host_key` | No       | Accept any host key. Defaults to `false`. See the warning in [Authentication](#authentication).           |

### Source configuration

The source `location` uses `routeros+export://` for a text export, or
`routeros+backup://` for a system backup.

### Destination configuration

The destination `location` uses `routeros://`. The following option is only
available to the destination connector.

| Option    | Required | Description                                                                   |
| --------- | -------- | ----------------------------------------------------------------------------- |
| `dry_run` | No       | Check the text export on the device without applying it. Defaults to `false`. |

### Example

Back up a text export of the configuration:

```bash
$ plakar at /var/backups backup routeros+export://admin@192.168.88.1
```

Back up a system backup of the device:

```bash
$ plakar at /var/backups backup routeros+backup://admin@192.168.88.1
```

Check a text export against the device without applying it:

```bash
$ plakar at /var/backups restore -to routeros://admin@192.168.88.1 -o dry_run=true <snapshot_id>
```

Restore it for real:

```bash
$ plakar at /var/backups restore -to routeros://admin@192.168.88.1 <snapshot_id>
```

## See also

- [SFTP integration](../sftp)
- [RouterOS documentation](https://help.mikrotik.com/docs/spaces/ROS/overview)
- [Managing packages](../../guides/managing-packages)
