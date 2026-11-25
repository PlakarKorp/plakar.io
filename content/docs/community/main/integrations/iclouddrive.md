---
title: "iCloud Drive"
date: "2026-03-20T00:00:00Z"
weight: 6
summary:
  "Back up and restore your iCloud Drive with Plakar, and host Kloset stores in
  iCloud Drive."
aliases:
  - /docs/main/integrations/iclouddrive/
---

# iCloud Drive

iCloud Drive is Apple's cloud storage service.

The iCloud Drive integration backs up iCloud Drive folders into a Kloset store,
restores snapshots to iCloud Drive, and hosts Kloset stores in iCloud Drive. It
is part of the [Rclone integration](../rclone), and reaches iCloud Drive through
a Rclone remote. See the Rclone integration for the connectors and their
options.

**Requirements**

- The Rclone package, installed as described in the
  [Rclone integration](../rclone#installation).
- Rclone installed, with at least one iCloud Drive remote configured.

**Typical use cases**

- Cold backup of iCloud Drive folders.
- Long-term archiving and disaster recovery.
- Portable export and vendor escape to other platforms.

## Configuring an iCloud Drive remote

> [!WARNING] iCloud Drive login
>
> Due to current limitations in Rclone, logging in to iCloud Drive is not
> possible at the time of writing. The steps below are provided for reference
> and future compatibility.

The connectors reach iCloud Drive through a Rclone remote. The remote is created
with Rclone and then imported into Plakar as a source, destination or store
configuration.

Install Rclone by following the instructions at
[https://rclone.org/install/](https://rclone.org/install/), then start the
interactive configuration:

```bash
$ rclone config
```

The command prompts for the settings of a new iCloud Drive remote. For Rclone
v1.72.1, the configuration flow is as follows:

1. Choose `n` to create a new remote.
2. Name the remote (e.g., `mydrive`).
3. Enter the number corresponding to "iCloud Drive" from the list of supported
   storage providers.
4. Enter your Apple ID.
5. Enter your password.
6. Validate the remote configuration.

Verify that the remote is configured:

```bash
$ rclone config show mydrive
```

Verify access to your iCloud Drive files:

```bash
$ rclone ls mydrive:
```

The output lists the files and folders in your iCloud Drive.

## Example

Import the remote as a source, then back it up:

```bash
$ rclone config show | plakar source import -rclone mydrive

$ plakar at /var/backups backup "@mydrive"
```

See the [Rclone integration](../rclone#example) for restoring to the remote and
hosting a Kloset store in it.

## Limitations and scope

At the time of writing and according to this
[GitHub issue](https://github.com/rclone/rclone/issues/8587#issuecomment-3240025307),
it is currently impossible to log in to iCloud Drive using Rclone.

## See also

- [Rclone integration](../rclone)
- [Rclone documentation for iCloud Drive](https://rclone.org/iclouddrive/)
