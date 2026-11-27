---
title: "Proton Drive"
date: "2026-03-20T00:00:00Z"
weight: 11
summary:
  "Back up and restore your Proton Drive with Plakar, and host Kloset stores in
  Proton Drive."
aliases:
  - /docs/v1.1.0/integrations/protondrive/
---

# Proton Drive

The Proton Drive integration backs up Proton Drive folders into a Kloset store,
restores snapshots to Proton Drive, and hosts Kloset stores in Proton Drive. It
is part of the [Rclone integration](../rclone), and reaches Proton Drive through
a Rclone remote. See the Rclone integration for the connectors and their
options.

**Requirements**

- The Rclone package, installed as described in the
  [Rclone integration](../rclone#installation).
- Rclone installed, with at least one Proton Drive remote configured.

**Typical use cases**

- Cold backup of Proton Drive folders.
- Long-term archiving and disaster recovery.
- Portable export and vendor escape to other platforms.

## Configuring a Proton Drive remote

The connectors reach Proton Drive through a Rclone remote. The remote is created
with Rclone and then imported into Plakar as a source, destination or store
configuration.

Install Rclone by following the instructions at
[https://rclone.org/install/](https://rclone.org/install/), then start the
interactive configuration:

```bash
$ rclone config
```

The command prompts for the settings of a new Proton Drive remote. For Rclone
v1.72.1, the configuration flow is as follows:

1. Choose `n` to create a new remote.
2. Name the remote (e.g., `mydrive`).
3. Enter your credentials.
4. Validate the remote configuration.

Verify that the remote is configured:

```bash
$ rclone config show mydrive
```

Verify access to your Proton Drive files:

```bash
$ rclone ls mydrive:
```

The output lists the files and folders in your Proton Drive.

## Example

Import the remote as a source, then back it up:

```bash
$ rclone config show | plakar source import -rclone mydrive

$ plakar at /var/backups backup "@mydrive"
```

See the [Rclone integration](../rclone#example) for restoring to the remote and
hosting a Kloset store in it.

## Limitations and scope

The Proton Drive API applies rate limits, and heavy usage may require
throttling. At the time of writing, Proton Drive support is in beta in Rclone
and write operations are not supported. Backing up from Proton Drive works, but
restoring to it or hosting Kloset stores on it is not possible until the issue
is resolved.

## See also

- [Rclone integration](../rclone)
- [Rclone documentation for Proton Drive](https://rclone.org/protondrive/)
