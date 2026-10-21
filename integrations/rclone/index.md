
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

