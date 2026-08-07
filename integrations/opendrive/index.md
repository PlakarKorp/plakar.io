
## Why protecting OpenDrive matters

OpenDrive excels at synchronizing files and making them accessible across
devices. But this doesn't count as a backup strategy. Your files are still
vulnerable to:

- **Accidental Deletion**: Deleted files are synced instantly and may be
  permanently removed once retention limits are reached.
- **Overwrites and Corruption**: Bad edits or corrupted files replace healthy
  versions across all devices.
- **Ransomware**: Encrypted files created by malware are synced back to
  OpenDrive, overwriting clean data.

For important personal data, shared folders, or business assets, you need an
independent history of your files that cannot be altered by mistakes, malware,
or account issues.

## Security and compromise

OpenDrive access is tied to user credentials and connected devices. If those are
lost, misused, or compromised:

- Mass data loss can happen in minutes
- Malicious changes are synchronized automatically
- Recovery windows may be limited or unavailable

Plakar protects against these scenarios by creating encrypted snapshots that
cannot be modified. Encryption keys are owned by you, ensuring that your backups
remain private and secure even if the OpenDrive account itself is compromised.

Plakar also allows direct inspection of your backups. You can browse, search,
and verify snapshot contents through the CLI or UI without performing a full
restore.

## How Plakar secures your OpenDrive workflows

Plakar integrates with OpenDrive as a flexible bridge for your data:

- **Source Connector**: Take snapshots of your OpenDrive files and store them in
  a secure Plakar Kloset.
- **Storage Connector**: Use OpenDrive as a vault to store encrypted and
  deduplicated Plakar backups from other sources.
- **Destination Connector**: Restore verified snapshots back into OpenDrive when
  needed.

Plakar uses deduplication to minimize storage usage and bandwidth while
preserving full snapshot history. This approach ensures your OpenDrive data
remains resilient, verifiable, and easily recoverable.

