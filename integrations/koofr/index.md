
## Why protecting Koofr matters

Koofr provides privacy-focused cloud storage with multi-cloud integration, but these features are not a backup solution. Actions taken in Koofr can affect your files instantly. This leaves it vulnerable to:

- **Accidental Deletion**: Files removed by a user are permanently deleted from your storage.
- **Overwrites and Corruption**: Bad edits or corrupted files replace healthy versions.
- **Ransomware**: Malware-encrypted files can overwrite clean data in your Koofr storage.

Native retention and recovery options are limited in scope and duration. For business-critical or compliance-sensitive data, an independent and immutable backup history is essential.

## Security and compromise

Access to Koofr is tied to user credentials and connected applications. If any of these are compromised:

- Mass data loss can occur within minutes
- Malicious changes can affect all your files
- Recovery windows may be limited or unavailable

Plakar mitigates these risks by creating immutable snapshots of your data that cannot be altered or deleted. Backups are encrypted end-to-end, with keys that you own, ensuring privacy and control even if your Koofr account itself is compromised.

## How Plakar secures your Koofr workflows

Plakar integrates with Koofr as a flexible bridge for your data:

- **Source Connector**: Take snapshots of your Koofr files and store them in a secure Kloset Store.
- **Storage Connector**: Use Koofr as a vault to store encrypted and deduplicated Plakar backups from other sources.
- **Destination Connector**: Restore verified snapshots directly back into Koofr when needed.

Plakar uses deduplication to minimize storage space and bandwidth usage while preserving full snapshot history. Plakar also allows for direct inspection of backups, letting you browse, search, and verify file content via the CLI or UI without needing to restore to Koofr first.

