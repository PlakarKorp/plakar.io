---
title: "OpenDrive"
date: "2026-03-20T00:00:00Z"
weight: 10
summary:
  "Back up and restore OpenDrive data with Plakar, and host Kloset stores in
  OpenDrive."
aliases:
  - /docs/main/integrations/opendrive/
---

# OpenDrive

The OpenDrive integration backs up OpenDrive folders into a Kloset store,
restores snapshots to OpenDrive, and hosts Kloset stores in OpenDrive. It is
part of the [Rclone integration](../rclone), and reaches OpenDrive through a
Rclone remote. See the Rclone integration for the connectors and their options.

**Requirements**

- The Rclone package, installed as described in the
  [Rclone integration](../rclone#installation).
- Rclone installed, with at least one OpenDrive remote configured.

**Typical use cases**

- Cold backup of OpenDrive folders.
- Long-term archiving and disaster recovery.
- Portable export and vendor escape to other platforms.

## Configuring an OpenDrive remote

The connectors reach OpenDrive through a Rclone remote. The remote is created
with Rclone and then imported into Plakar as a source, destination or store
configuration.

Install Rclone by following the instructions at
[https://rclone.org/install/](https://rclone.org/install/), then start the
interactive configuration:

```bash
$ rclone config
```

The command prompts for the settings of a new OpenDrive remote. For Rclone
v1.72.1, the configuration flow is as follows:

1. Choose `n` to create a new remote.
2. Name the remote (e.g., `mydrive`).
3. Enter your username (your OpenDrive email).
4. Enter your password.
5. Confirm the settings.

Verify that the remote is configured:

```bash
$ rclone config show mydrive
```

Verify access to your OpenDrive files:

```bash
$ rclone ls mydrive:
```

The output lists the files and folders in your OpenDrive.

## Example

Import the remote as a source, then back it up:

```bash
$ rclone config show | plakar source import -rclone mydrive

$ plakar at /var/backups backup "@mydrive"
```

See the [Rclone integration](../rclone#example) for restoring to the remote and
hosting a Kloset store in it.

## See also

- [Rclone integration](../rclone)
- [Rclone documentation for OpenDrive](https://rclone.org/opendrive/)
