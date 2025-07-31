---
title: SFTP integration package
description: Securely back up and restore remote directories over SFTP with Plakar — encrypted, verifiable, and portable.
technology_description: This integration leverages the SFTP protocol over SSH to securely transfer and verify remote directories into a Plakar Kloset for backup and restoration.
categories:
  - integrations
tags:
  - sftp
  - ssh
  - secure file transfer
  - remote directories
  - backup
  - disaster recovery
  - encryption
  - deduplication
  - versioning
  - immutable storage
  - compliance
  - long-term archiving
  - airgapped backup
  - snapshot technology
  - portable format
stage: beta
date: 2025-07-30
plakar_version: {1.0.2 or >=1.0.3}
integration_version: "0.1.0"
resource_type: filesystem
provides:
  - source connector
  - destination connector
  - storage connector
---

## Introduction

> **Requirements**
>  - Plakar version: "1.0.2 or >=1.0.3"
>  - Integration version: "0.1.0"
>  - SFTP/SSH server accessible with read/write permissions

This integration enables **backing up, restoring, and storing** remote directories using Plakar’s built-in SFTP connector over SSH. SFTP is supported natively, requiring only that the target system has SSH and SFTP access enabled.

Snapshots are stored in a Kloset store with full deduplication, encryption, and immutability, whether hosted locally or on an SFTP-accessible remote server. All data transfers are encrypted end-to-end, and Plakar automatically verifies each snapshot to ensure data integrity.

**Use cases:**
- Secure, encrypted backups of remote Linux, BSD, or application servers
- Hosting Kloset stores on remote SFTP servers for offsite or air‑gapped backup
- Disaster recovery and rapid restoration of server directories over SSH
- Automated compliance backups of sensitive or regulated data
- Centralized archiving of distributed infrastructure into a single Plakar Kloset

**Target technologies:**
- Supported versions: Any system with OpenSSH 7.0+ or equivalent SFTP implementation
  - System compatibility: Compatible with on-premise, cloud-hosted, or hybrid Linux servers.
 - Unsupported variants:
    - Legacy SSH servers below 7.0
    - Proprietary or vendor-specific SFTP implementations that do not follow standard SSH protocol

## Architecture

**Components provided:**

- **Source Connector**: Extracts files and directories from remote servers over SFTP for secure, verifiable backups into a Kloset store.
- **Destination Connector**: Restores Plakar snapshots to the original SFTP server or any compatible SSH-accessible resource.
- **Storage Connector**: Supports hosting Kloset stores on SFTP servers, enabling offsite, encrypted, and air‑gapped snapshot storage.
- **Viewer**: Accessible via the Plakar CLI or UI, allowing users to browse, search, and verify snapshots stored on SFTP-hosted Kloset stores.

## Installation
This integration is bundled natively with Plakar. No additional package installation is required.

***Verify SFTP Support:***
Confirm that SFTP is listed in your available connectors by running the command ```plakar version```.

You should see `sftp` listed under **importers**, **exporters**, and **klosets**, for example:
```bash
plakar/v1.0.2

importers: fs, ftp, s3, sftp # <--- SFTP LISTED
exporters: fs, ftp, s3, sftp # <--- SFTP LISTED
klosets: fs, http, https, ptar, s3, sftp, sqlite # <--- SFTP LISTED
```

This verifies integration is now ready for use.

## Configuration

No special installation is required to use SFTP with Plakar.

### Using direct SFTP URLs

Direct URLs are fully self‑contained and require no prior configuration, ideal for ad‑hoc or one‑off operations.

```bash
# Create a Kloset store on the local SFTP server
plakar at sftp://sftpuser@localhost/uploads create

# example direct url backup
plakar at sftp://sftpuser@localhost/uploads backup /home/<user>/Documents
```

### Confirm passwordless SSH access

Plakar relies on unattended SSH sessions for SFTP operations. To avoid interruptions or failed backups, configure passwordless login with an SSH key:
```bash
#  Must connect without a password for Plakar.
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_plakar
sftp -i ~/.ssh/id_ed25519_plakar sftpuser@localhost
```

Test passwordless login with:
```
sftp -i ~/.ssh/id_ed25519_plakar sftpuser@localhost
```
The command should log in directly without prompting for a password, this verifies that Plakar can reliably perform backups and restores over SFTP.

### Configure a named remote

Named remotes let you simplify and reuse SFTP URLs in Plakar commands without typing the full connection string each time.

This allows using `sftp://local-sftp` instead of the full `sftp://sftpuser@localhost.`

```bash
plakar config remote create mysftp

# Point 'mysftp' to your SFTP server via an SSH host alias
plakar config remote set mysftp location sftp://local-sftp/uploads
```

### Configure an SSH host alias

Since `local-sftp` is not a real hostname, you must define it in your `~/.ssh/config`:
```bash
Host local-sftp
    HostName localhost # <--- Creates the alias used in the Plakar URL
    User sftpuser # <--- Specifies the SFTP account
    IdentityFile ~/.ssh/id_ed25519_plakar # <--- Enables passwordless SSH for reliable backups
```

Test the alias for connection:
```bash
# If it logs in without a password, the alias works
sftp local-sftp
```

## Backup & Restore using the SFTP protocol

### Make a backup (Snapshot)

You can back up:
- A local directory to a remote SFTP store
- A remote directory over SFTP into a store
- Between two SFTP remotes using source + destination

### Create a Kloset store on your SFTP server:

```bash=
plakar at sftp://sftpuser@localhost/uploads create
```

### Back up a local path into the SFTP store:

```bash=
plakar at sftp://sftpuser@localhost/uploads backup /etc
```

### Back up a remote SFTP path into the same store:

```bash=
plakar at sftp://sftpuser@localhost/uploads backup sftp://sftpuser@localhost/etc
```

### Using a named remote (optional, for cleaner commands):

```bash=
plakar config remote create mysftp
plakar config remote set mysftp location sftp://local-sftp/uploads

plakar at @mysftp create
plakar at @mysftp backup /etc
```

### Restore from Snapshot

**You can restore to:**
- The local filesystem
- Another remote location via SFTP
- Any other destination connector (like MinIO, S3, or a mounted FS)

```bash=
# Restore locally
plakar at @mysftp restore -to ./restored <snapshot-id>

# Restore to another SFTP path
plakar at @mysftp restore -to sftp://sftpuser@localhost/restore <snapshot-id>

# Restore to another compatible backend
plakar at @mysftp restore -to s3://mybucket/restore/ <snapshot-id>
```
> While SFTP doesn't support `plakar config source` or `destination`,
you can still perform backups and restores by referencing SFTP directly as a source or destination URL.

### Kloset Inspection

```bash=
# List snapshots in the SFTP store
plakar at @mysftp ls

# View a file from a snapshot
plakar at @mysftp cat <snapshot-id>:/etc/ssh/sshd_config

# Open the UI viewer
plakar at @mysftp ui
```

## Integration-specific behaviors
### Limitations

**The following are not included in SFTP snapshot backups:**
- System-wide configuration (e.g., SSH server settings, firewall rules)
- User accounts and permissions on the remote host
- Active processes or running services
- Monitoring or telemetry configurations
- Any server-side scripts or binaries outside the backed-up directories

**Only the following are backed up:**
- Files and directories accessible via the configured SFTP path
- File metadata such as timestamps, permissions, and sizes


### Restore behavior specifics

**Recommended best practices for restoring SFTP snapshots:**
- Always restore to a temporary or namespaced directory (e.g., `sftp://myserver/restore-preview/`) to avoid overwriting live data directly
- Verify restored data integrity and completeness before promoting it to production paths
- Use Plakar’s verification commands or checksum tools to validate snapshot correctness
- Consider restoring snapshots to local filesystem first for inspection before pushing to remote servers

## Troubleshooting

**Credential / SSH errors**
If you see `Permission denied` or `Connection refused`:
- Verify SSH key, username, and remote host configuration.

**Host key issues**
**Host key verification failed**, Add the host to `~/.ssh/known_hosts` or set `insecure_ignore_host_key=true`.

**Permission denied on paths**
Ensure the SFTP user has read/write access to the source or destination directories.

## Backup Strategy
- Schedule daily or weekly snapshots with cron or timers.
- Keep multiple snapshots for rollback and auditing.
- Store backups on a separate SFTP store or local FS for safety.
- Periodically verify snapshots with `plakar ls` or `plakar verify`.

## Appendix
- [Plakar CLI Reference](https://www.plakar.io/docs/main/)
- [Plakar Architecture (Kloset Engine)](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)
- [OpenSSH / SFTP Documentation](https://man.openbsd.org/sftp.1)

## Frequently Asked Questions

**How do I configure username, port, or identity file?**
Use your SSH config (**~/.ssh/config**) to set **HostName**, **User**, **Port**, and **IdentityFile** for your SFTP host.

**How can I avoid SSH passphrase prompts?**
Use an **ssh-agent** to cache your passphrase; Plakar will connect via **$SSH_AUTH_SOCK** if available.

**Can I disable host key checks?**
Yes, set **insecure_ignore_host_key=true** on your remote.