---
title: "SFTP"

subtitle: "Secure, encrypted backups over the SFTP protocol"

description: >
  Back up and restore directories to and from remote servers over SFTP.
  Plakar ensures encrypted, deduplicated, and verifiable snapshots
  across Linux, BSD, and NAS environments.

technology_title: SFTP is universal and security-focused

technology_description: >
  SFTP (SSH File Transfer Protocol) is a widely supported standard for securely transferring files
  across servers, NAS devices, and cloud environments using the SSH protocol.

  While SFTP provides secure transport, it does not provide immutability, deduplication,
  or integrated snapshot management on its own.

  Plakar fills that gap by turning any SFTP-accessible server into a secure backup source,
  a resilient storage backend, or a flexible destination for encrypted, verifiable snapshots.

categories:
  - source connector
  - destination connector
  - storage connector
  - viewer

tags:
  - SFTP
  - Linux
  - BSD
  - NAS
  - Synology
  - QNAP

seo_tags:
  - SFTP backup
  - Linux backup
  - NAS backup
  - secure file transfer
  - immutable snapshots
  - encrypted backups
  - disaster recovery
  - SSH file transfer
  - multi-server backup
  - airgapped storage

technical_documentation_link: /docs/main/integrations/sftp/

stage: stable

date: 2025-07-29

plakar_version: ">=1.0.3"

resource: SFTP

resource_type: file-transfer
---

## Why protecting SFTP matters
SFTP is a standard for secure file transfers across Linux servers, BSD hosts, and NAS devices like Synology and QNAP. However, secure transfer is not the same as a backup strategy.

While SFTP secures the data in transit, it does not protect the data once it arrives to where you want to store it. Standard SFTP setups face several risks:
- **Lack of Versioning**: Files can be overwritten or deleted immediately after upload.
- **No Immutability**: There are no permanent snapshots to revert to if a file is corrupted.
- **Operational Risk**: Manual transfers or custom scripts are error-prone and difficult to audit.

When compliance, uptime, or disaster recovery is critical, simply storing files on SFTP is not enough. You need verifiable, immutable backups that can survive mistakes, misconfigurations, or attacks.

## Security and Compromise
SFTP relies on SSH keys or passwords. If these credentials are leaked or an account is compromised, your data is at risk:
- **Data Loss**: Unauthorized access can be used to delete or overwrite entire directories instantly.
- **Corruption**: Ransomware or rogue scripts can encrypt live data on the server.
- **Synchronization Issues**: Automated sync tools can unintentionally spread corruption from one server to another.

Without independent snapshots, recovery from these events can be impossible. Plakar closes this gap by providing immutable, deduplicated snapshots and end-to-end encryption that remains secure even if the SFTP server itself is compromised.

## How Plakar secures your SFTP workflows
Plakar turns any SFTP-accessible server into a flexible backup system by acting as a bridge between your data and your storage:
- **Source Connector**: Take snapshots of files located on a remote SFTP server and bring them into a secure Plakar Kloset.
- **Storage Connector**: Use an SFTP server as the vault to store your encrypted, deduplicated Plakar backups.
- **Destination Connector**: Restore your snapshots to any SFTP server in your environment.

This flexibility allows you to choose the backup model that fits your needs:
- **Push Backups**: Send snapshots from source servers to a central storage location independently.
- **Pull Backups**: Centrally collect data from multiple remote servers into a single, deduplicated Kloset.

### A Complete Backup Workflow
With Plakar, SFTP becomes a professional backup solution instead of just a file-drop location. You gain several key advantages in one tool:
- **Immutable Versioning**: Every snapshot is a point-in-time version that cannot be altered or deleted.
- **Global Deduplication**: Save significant storage space by only storing unique data chunks across multiple servers.
- **Direct Inspection**: Browse, search, and verify the integrity of your backups via the CLI or UI without having to restore the files first.
- **Portable Retention**: Bundle your backups into the Ptar format for offline storage to meet strict compliance or security requirements.

From creation to recovery, Plakar ensures your SFTP-based infrastructure remains resilient, secure, and verifiable.
