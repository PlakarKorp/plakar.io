---
title: Rclone

subtitle: One integration for the cloud storage services rclone supports

description: >
  Back up and restore cloud storage services such as Google Drive, Dropbox,
  OneDrive and Proton Drive with Plakar, using rclone to reach them. Create
  immutable, encrypted, and verifiable backups of your cloud files.

technology_title: Rclone reaches your cloud storage, Plakar protects it

technology_description: >
  Rclone is an open source tool that connects to a wide range of cloud storage
  services through a single interface. Plakar uses rclone to reach those
  services, so the same integration backs up Google Drive, Dropbox, OneDrive,
  iCloud Drive, OpenDrive, Proton Drive and other providers rclone supports.
  Plakar creates encrypted, deduplicated, and versioned snapshots of that data,
  stored wherever you choose, easily restorable and fully under your control.

categories:
  - source
  - destination
  - storage

seo_tags:
  - Rclone
  - Rclone backup
  - cloud storage
  - Google Drive backup
  - Dropbox backup
  - OneDrive backup
  - backup
  - disaster recovery
  - encryption
  - deduplication
  - versioning
  - immutable storage

links: []

related:
  - googledrive
  - onedrive
  - dropbox

edition:
  - community

stage: stable

author:
  - type: official
    name: Plakar

date: 2026-03-23

resource: Rclone

image: img/integrations/rclone.png
---

## Why protecting cloud storage matters

Cloud storage services keep files available across devices, but synchronization
is not a backup. A change made in one place reaches every connected device
within moments. This leaves your files vulnerable to:

- **Accidental deletion**: files removed by a user disappear from every device.
- **Overwrites and corruption**: bad edits replace healthy versions everywhere.
- **Ransomware**: files encrypted by malware are synchronized back to the
  service, overwriting clean data.

The retention and recovery options of these services are limited in scope and
duration. An independent backup history keeps your files recoverable when they
are not.

## One integration, many providers

Rclone handles the connection to each provider. Plakar handles the backup. Once
rclone is configured for a provider, Plakar backs it up the same way, whichever
service it is. Adding another provider is a matter of configuring it in rclone.

Each provider has its own guide covering its rclone configuration:
[Google Drive](/docs/community/main/integrations/googledrive/),
[Dropbox](/docs/community/main/integrations/dropbox/),
[OneDrive](/docs/community/main/integrations/onedrive/),
[iCloud Drive](/docs/community/main/integrations/iclouddrive/),
[OpenDrive](/docs/community/main/integrations/opendrive/) and
[Proton Drive](/docs/community/main/integrations/protondrive/).

## How Plakar secures your cloud storage

Plakar integrates with rclone as a flexible bridge for your data:

- **Source Connector**: take snapshots of files stored with a provider and keep
  them in a secure Kloset Store.
- **Storage Connector**: use a provider as a vault to store encrypted and
  deduplicated Plakar backups from other sources.
- **Destination Connector**: restore verified snapshots back to a provider when
  needed.

Backups are encrypted end to end, with keys that you own, so your data stays
private even if the cloud account itself is compromised. Deduplication keeps
storage and bandwidth usage low while preserving the full snapshot history.
