---
title: "Koofr"
date: "2026-03-20T00:00:00Z"
weight: 7
summary:
  "Back up and restore your Koofr with Plakar, and host Kloset stores in Koofr."
aliases:
  - /docs/v1.1.0/integrations/koofr/
---

# Koofr

The Koofr integration backs up Koofr folders into a Kloset store, restores
snapshots to Koofr, and hosts Kloset stores in Koofr. It is part of the
[Rclone integration](../rclone), and reaches Koofr through a Rclone remote. See
the Rclone integration for the connectors and their options.

**Requirements**

- The Rclone package, installed as described in the
  [Rclone integration](../rclone#installation).
- Rclone installed, with at least one Koofr remote configured.

**Typical use cases**

- Cold backup of Koofr folders.
- Long-term archiving and disaster recovery.
- Portable export and vendor escape to other platforms.

## Configuring a Koofr remote

The connectors reach Koofr through a Rclone remote. The remote is created with
Rclone and then imported into Plakar as a source, destination or store
configuration.

Install Rclone by following the instructions at
[https://rclone.org/install/](https://rclone.org/install/), then start the
interactive configuration:

```bash
$ rclone config
```

The command prompts for the settings of a new Koofr remote. For Rclone v1.72.1,
the configuration flow is as follows:

1. Choose `n` to create a new remote.
2. Name the remote (e.g., `mydrive`).
3. Enter the number corresponding to "Koofr" from the list of supported storage
   providers.
4. Enter your email and your app password. If you don't have an **app
   password**, generate one in your
   [Koofr account settings](https://app.koofr.net/app/admin/preferences/password).
5. Confirm the settings.

Verify that the remote is configured:

```bash
$ rclone config show mydrive
```

Verify access to your Koofr files:

```bash
$ rclone ls mydrive:
```

The output lists the files and folders in your Koofr.

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
- [Rclone documentation for Koofr](https://rclone.org/koofr/)
