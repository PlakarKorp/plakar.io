---
title: "OneDrive"
date: "2026-03-20T00:00:00Z"
weight: 9
summary:
  "Back up and restore your OneDrive with Plakar, and host Kloset stores in
  OneDrive."
aliases:
  - /docs/v1.1.0/integrations/onedrive/
---

# OneDrive

OneDrive is Microsoft's cloud storage service for storing, sharing and
collaborating on files.

The OneDrive integration backs up OneDrive folders into a Kloset store, restores
snapshots to OneDrive, and hosts Kloset stores in OneDrive. It is part of the
[Rclone integration](../rclone), and reaches OneDrive through a Rclone remote.
See the Rclone integration for the connectors and their options.

**Requirements**

- The Rclone package, installed as described in the
  [Rclone integration](../rclone#installation).
- Rclone installed, with at least one OneDrive remote configured.

**Typical use cases**

- Cold backup of OneDrive folders.
- Long-term archiving and disaster recovery.
- Portable export and vendor escape to other platforms.

## Configuring a OneDrive remote

The connectors reach OneDrive through a Rclone remote. The remote is created
with Rclone and then imported into Plakar as a source, destination or store
configuration.

Install Rclone by following the instructions at
[https://rclone.org/install/](https://rclone.org/install/), then start the
interactive configuration:

```bash
$ rclone config
```

The command prompts for the settings of a new OneDrive remote. For Rclone
v1.72.1, the configuration flow is as follows:

1. Choose `n` to create a new remote.
2. Name the remote (e.g., `mydrive`).
3. Enter the number corresponding to "Microsoft OneDrive" from the list of
   supported storage providers.
4. Leave `client_id` and `client_secret` empty to use Rclone's defaults, or
   provide your own if you have them.
5. Select your region (usually "Microsoft Cloud Global").
6. Enter service principal's tenant ID if applicable, or leave empty.
7. Stay with the current settings, and do not edit advanced config.
8. Choose to open the browser for authentication.
9. Once validated, select the type of connection.
10. Select the drive to use.
11. Validate the remote configuration.

Verify that the remote is configured:

```bash
$ rclone config show mydrive
```

Verify access to your OneDrive files:

```bash
$ rclone ls mydrive:
```

The output lists the files and folders in your OneDrive.

## Example

Import the remote as a source, then back it up:

```bash
$ rclone config show | plakar source import -rclone mydrive

$ plakar at /var/backups backup "@mydrive"
```

See the [Rclone integration](../rclone#example) for restoring to the remote and
hosting a Kloset store in it.

## Limitations and scope

The OneDrive API applies rate limits, and heavy usage may require throttling.
File version history is not preserved. Only the current version of each file is
snapshotted. Shared links and permissions are not preserved in snapshots.

## See also

- [Rclone integration](../rclone)
- [Rclone documentation for OneDrive](https://rclone.org/onedrive/)
