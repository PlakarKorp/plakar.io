---
title: "Google Drive"
date: "2026-03-20T00:00:00Z"
weight: 8
summary:
  "Back up and restore your Google Drive with Plakar, and host Kloset stores in
  Google Drive."
aliases:
  - /docs/main/integrations/googledrive/
---

# Google Drive

Google Drive is Google's cloud storage service for storing, sharing and
collaborating on files.

The Google Drive integration backs up Google Drive folders into a Kloset store,
restores snapshots to Google Drive, and hosts Kloset stores in Google Drive. It
is part of the [Rclone integration](../rclone), and reaches Google Drive through
a Rclone remote. See the Rclone integration for the connectors and their
options.

**Requirements**

- The Rclone package, installed as described in the
  [Rclone integration](../rclone#installation).
- Rclone installed, with at least one Google Drive remote configured.

**Typical use cases**

- Cold backup of Google Drive folders.
- Long-term archiving and disaster recovery.
- Portable export and vendor escape to other platforms.

## Configuring a Google Drive remote

The connectors reach Google Drive through a Rclone remote. The remote is created
with Rclone and then imported into Plakar as a source, destination or store
configuration.

Install Rclone by following the instructions at
[https://rclone.org/install/](https://rclone.org/install/), then start the
interactive configuration:

```bash
$ rclone config
```

The command prompts for the settings of a new Google Drive remote. For Rclone
v1.72.1, the configuration flow is as follows:

1. Choose `n` to create a new remote.
2. Name the remote (e.g., `mydrive`).
3. Enter the number corresponding to "Google Drive" from the list of supported
   storage providers.
4. Leave `client_id` and `client_secret` empty to use Rclone's defaults, or
   provide your own if you have them.
5. Select the number corresponding to "Full access all files, excluding
   Application Data Folder.", or to "Read-only access to file metadata and file
   contents." if you only need read access.
6. Leave the service account file empty unless you have one.
7. When prompted about advanced config, choose to edit it and set
   `root_folder_id` to a specific subfolder (recommended, see note below). This
   keeps all Plakar data in one place and avoids cluttering the root of your
   drive. If you don't want to use a subfolder, skip to step 8 and stay with the
   current settings.
8. Choose to open the browser for authentication.
9. Set whether to use a shared drive or not depending on your needs.
10. Validate the remote configuration.

> [!NOTE]+ Using a subfolder (recommended)
>
> Restricting Rclone to a dedicated subfolder keeps your Google Drive organised
> and makes it easy to identify Plakar data at a glance.
>
> 1. Create a folder in the Google Drive web UI.
> 2. Open the folder. The URL will contain the folder ID, e.g.
>    `https://drive.google.com/drive/folders/<FOLDER_ID>`.
> 3. When prompted at step 7, choose to edit advanced config and set
>    `root_folder_id` to that ID.
>
> Rclone will then treat that folder as its root, and all Plakar data will be
> written there instead of at the top level of your drive.

Verify that the remote is configured:

```bash
$ rclone config show mydrive
```

Verify access to your Google Drive files:

```bash
$ rclone ls mydrive:
```

The output lists the files and folders in your Google Drive.

## Example

Import the remote as a source, then back it up:

```bash
$ rclone config show | plakar source import -rclone mydrive

$ plakar at /var/backups backup "@mydrive"
```

See the [Rclone integration](../rclone#example) for restoring to the remote and
hosting a Kloset store in it.

## Limitations and scope

The Google Drive API applies rate limits, and heavy usage may require
throttling. File version history is not preserved. Only the current version of
each file is snapshotted. Shared links and permissions are not preserved in
snapshots.

## See also

- [Rclone integration](../rclone)
- [Rclone documentation for Google Drive](https://rclone.org/drive/)
