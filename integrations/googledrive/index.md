
## Why protecting Google Drive matters

Google Drive is central to everyday work and collaboration, but synchronization
is not a backup solution. Actions taken in Google Drive are synced to all
connected devices almost instantly. This leaves it vulnerable to:

- **Accidental Deletion**: Files removed by a user are quickly removed across
  all devices and shared workspaces.
- **Overwrites and Corruption**: Bad edits or corrupted files replace healthy
  versions across the entire environment.
- **Ransomware**: Malware-encrypted files are synchronized back to Google Drive,
  overwriting clean data.

Native retention and recovery options are limited in scope and duration. For
business‑critical or compliance‑sensitive data, an independent and immutable
backup history is essential.

## Google Drive Shared Responsibility Model

Google drive operates under a
[shared responsibility model](https://services.google.com/fh/files/misc/google_workspace_data_protection_guide_en_dec2020.pdf)
where Google secures the infrastructure, you're responsible for protecting your
data. Plakar ensures you meet your side with independent, verifiable backups.

To learn more about the general idea about the shared responsibility model you
can check the docs on
[Why you should backup your SaaS](../../../docs/community/main/explanations/why-should-i-backup-my-saas).

## Security and compromise

Access to Google Drive is tied to user accounts, credentials, and connected
applications. If any of these are compromised:

- Mass data loss can occur within minutes
- Malicious changes are synchronized automatically
- Recovery windows may be limited or unavailable

Plakar mitigates these risks by creating immutable snapshots of your data that
cannot be altered or deleted. Backups are encrypted end‑to‑end, with keys that
you own, ensuring privacy and control even if the Google account itself is
compromised.

## How Plakar secures your Google Drive workflows

Plakar integrates with Google Drive as a flexible bridge for your data:

- **Source Connector**: Take snapshots of your Google Drive files and store them
  in a secure Kloset Store.
- **Storage Connector**: Use Google Drive as a vault to store encrypted and
  deduplicated Plakar backups from other sources.
- **Destination Connector**: Restore verified snapshots directly back into
  Google Drive when needed.

Plakar uses deduplication to minimize storage space and bandwidth usage while
preserving full snapshot history.

