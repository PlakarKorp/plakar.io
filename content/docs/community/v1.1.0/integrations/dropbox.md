---
title: "Dropbox"
date: "2026-03-20T00:00:00Z"
weight: 5
summary:
  "Back up and restore your Dropbox with Plakar, and host Kloset stores in
  Dropbox."
aliases:
  - /docs/v1.1.0/integrations/dropbox/
---

# Dropbox

The Dropbox integration backs up Dropbox folders into a Kloset store, restores
snapshots to Dropbox, and hosts Kloset stores in Dropbox. It is part of the
[Rclone integration](../rclone), and reaches Dropbox through a Rclone remote.
See the Rclone integration for the connectors and their options.

**Requirements**

- The Rclone package, installed as described in the
  [Rclone integration](../rclone#installation).
- Rclone installed, with at least one Dropbox remote configured.

**Typical use cases**

- Cold backup of Dropbox folders.
- Long-term archiving and disaster recovery.
- Portable export and vendor escape to other platforms.

## Configuring a Dropbox remote

The connectors reach Dropbox through a Rclone remote. The remote is created with
Rclone and then imported into Plakar as a source, destination or store
configuration.

Install Rclone by following the instructions at
[https://rclone.org/install/](https://rclone.org/install/), then start the
interactive configuration:

```bash
$ rclone config
```

The command prompts for the settings of a new Dropbox remote. For Rclone
`v1.72.1`, the configuration flow is as follows:

1. Choose `n` to create a new remote.
2. Name the remote (e.g., `mydrive`).
3. Enter the number corresponding to "Dropbox" from the list of supported
   storage providers.
4. Leave `client_id` and `client_secret` empty to use Rclone's defaults, or
   provide your own if you have them.
5. Choose to open the browser for authentication.
6. Confirm the settings.

Verify that the remote is configured:

```bash
$ rclone config show mydrive
```

Verify access to your Dropbox files:

```bash
$ rclone ls mydrive:
```

The output lists the files and folders in your Dropbox.

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
- [Rclone documentation for Dropbox](https://rclone.org/dropbox/)
