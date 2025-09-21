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
plakar_version: '>=1.0.4'
integration_version: '1.0.4'
resource_type: filesystem
provides:
  - source connector
  - destination connector
  - storage connector
---

## Introduction

> **Requirements**
> - Plakar version: '>=1.0.4'
>  - Integration version: '1.0.4'
>  - SFTP/SSH server accessible with read/write permissions

This integration enables **backing up, restoring, and storing** remote directories using Plakar’s SFTP connector over SSH. SFTP is supported natively, requiring only that the target system has SSH and SFTP access enabled.

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
This integration is no longer bundled natively with Plakar. Starting from version 1.0.4, the SFTP connector must be manually installed.

***Install SFTP Support:***
```bash
# First login on plakar to get access to the pre-compile package repository
plakar login -email <Your Email Address>
# Confirm the login by clicking the link sent to your email
plakar pkg add sftp
```

Check that SFTP is listed in your available connectors by running the command ```plakar pkg list```.

You should see `sftp` listed under installed packages, for example:

```bash
% plakar pkg list
sftp@v1.0.4
```

This verifies integration is now ready for use.

## Configuration

No special installation is required to use SFTP with Plakar.

### Using direct SFTP URLs

```bash
# Create a Kloset store on the local SFTP server
plakar at sftp://sftpuser@localhost/uploads create

# Backup data into the SFTP store
plakar at sftp://sftpuser@localhost/uploads backup /home/<user>/Documents
```
Direct URLs are the simplest way to use SFTP with Plakar:

Direct URLs are fully self‑contained and require no prior configuration, ideal for ad‑hoc or one‑off operations.

### Configure a named remote

```bash
plakar source add mysftp sftp://local-sftp/uploads
```
Named remotes let you simplify and reuse SFTP URLs in Plakar commands without typing the full connection string each time.
This allows using `sftp://local-sftp` instead of the full `sftp://sftpuser@localhost.`

### Configure an SSH host alias

> (required) create an SSH host alias
```bash
Host local-sftp
    HostName localhost # <--- Creates the alias used in the Plakar URL
    User sftpuser # <--- Specifies the SFTP account
    IdentityFile ~/.ssh/id_ed25519_plakar # <--- Enables passwordless SSH for reliable backups
```

> Test the alias
```bash
# If it logs in without a password, the alias works
sftp local-sftp
```

Since `local-sftp` is not a real hostname, you must define it in your `~/.ssh/config`:


### Ensure passwordless SSH access

```bash
#  Must connect without a password for Plakar.
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_plakar
sftp -i ~/.ssh/id_ed25519_plakar sftpuser@localhost
```
Plakar relies on unattended SSH sessions for SFTP operations. To avoid interruptions or failed backups, configure passwordless login with an SSH key:

> Test passwordless login with
```
sftp -i ~/.ssh/id_ed25519_plakar sftpuser@localhost
```
The command should log in directly without prompting for a password, this verifies that
Plakar can reliably perform backups and restores over SFTP.

## 5. Setup backup model with SFTP Integration




## 6. Integration-specific behaviors
### 6.1 Limitations

**The following are not included in SFTP snapshot backups:**
- System-wide configuration (e.g., SSH server settings, firewall rules)
- User accounts and permissions on the remote host
- Active processes or running services
- Monitoring or telemetry configurations
- Any server-side scripts or binaries outside the backed-up directories

**Only the following are backed up:**
- Files and directories accessible via the configured SFTP path
- File metadata such as timestamps, permissions, and sizes


### 6.2 Restore behavior specifics

**Recommended best practices for restoring SFTP snapshots:**
- Always restore to a temporary or namespaced directory (e.g., `sftp://myserver/restore-preview/`) to avoid overwriting live data directly
- Verify restored data integrity and completeness before promoting it to production paths
- Use Plakar’s verification commands or checksum tools to validate snapshot correctness
- Consider restoring snapshots to local filesystem first for inspection before pushing to remote servers

## 7. Troubleshooting

**Credential / SSH errors**
If you see `Permission denied` or `Connection refused`:
- Verify SSH key, username, and remote host configuration.

**Host key issues**
**Host key verification failed**, Add the host to `~/.ssh/known_hosts` or set `insecure_ignore_host_key=true`.

**Permission denied on paths**
Ensure the SFTP user has read/write access to the source or destination directories.

## 8. Backup Strategy
- Schedule daily or weekly snapshots with cron or timers.
- Keep multiple snapshots for rollback and auditing.
- Store backups on a separate SFTP store or local FS for safety.
- Periodically verify snapshots with `plakar ls` or `plakar verify`.

## 9. Appendix
[Plakar CLI Reference](https://www.plakar.io/docs/main/)
[Plakar Architecture (Kloset Engine)](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)
[OpenSSH / SFTP Documentation](https://man.openbsd.org/sftp.1)

## Frequently Asked Questions

**How do I configure username, port, or identity file?**
Use your SSH config (**~/.ssh/config**) to set **HostName**, **User**, **Port**, and **IdentityFile** for your SFTP host.

**How can I avoid SSH passphrase prompts?**
Use an **ssh-agent** to cache your passphrase; Plakar will connect via **$SSH_AUTH_SOCK** if available.

**Can I disable host key checks?**
Yes, set **insecure_ignore_host_key=true** on your remote.
