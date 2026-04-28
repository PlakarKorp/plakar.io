---
title: "FTP"

subtitle: "Backup and restore over the FTP protocol"

description: >
  Back up and restore directories to and from remote FTP servers. Plakar provides encrypted, deduplicated, and verifiable snapshots for FTP-accessible environments.

technology_title: FTP is widely supported across different infrastructure

technology_description: >
  FTP (File Transfer Protocol) is a standard protocol for transferring files across networks, servers, and storage devices. It remains widely deployed in public repositories, network appliances, and various production environments.
  While FTP handles file transfers, it does not provide versioning, deduplication, or integrated snapshot management on its own. Plakar fills that gap by making any FTP-accessible server into a secure backup source,
  a flexible destination, or a recoverable archive with encrypted, verifiable snapshots.

categories:
  - source connector
  - destination connector
  - viewer

tags:
- FTP
- public repositories
- network appliances
- NAS

seo_tags:
- FTP backup
- FTP server backup
- encrypted FTP snapshots
- FTP disaster recovery
- public FTP mirror
- NAS FTP backup
- FTP versioning
- immutable FTP backups

technical_documentation_link:

stage: "stable"

date: 2025-05-13

plakar_version: ">=1.0.0"

resource: FTP

resource_type: file-transfer
---

## Why protecting FTP servers matters
FTP is a standard protocol for file transfers across public repositories, network appliances, and production systems. However, file transfer is not the same as a backup strategy.

While FTP moves files between systems, it does not protect the data once it arrives. Standard FTP setups face several risks:
- **Lack of Versioning**: Files can be overwritten or deleted immediately after upload.
- **No Immutability**: There are no permanent snapshots to revert to if a file is corrupted.
- **Operational Risk**: Manual transfers or custom scripts are error-prone and difficult to audit.

Simply storing files via FTP is not enough when compliance, uptime, or disaster recovery is critical. You need verifiable, immutable backups that can survive mistakes, misconfigurations, or unauthorized access.

## Security and Compromise
If FTP credentials are leaked or an account is compromised, your data is at risk:
- **Data Loss**: Unauthorized access can be used to delete or overwrite entire directories instantly.
- **Corruption**: Malicious actors or faulty scripts can modify live data on the server.
- **Synchronization Issues**: Automated sync tools can unintentionally spread corruption from one server to another.

Without independent snapshots, recovery from these events can be impossible. Plakar closes this gap by providing a system where every snapshot acts as an immutable version that cannot be altered. This ensures your history remains intact even if the FTP server itself is compromised.

Plakar allows for direct inspection of backups, letting you easily browse, search, or verify the integrity of your data via the CLI or UI without needing to perform a full restore first.

## How Plakar secures your FTP workflows
Plakar can integrate with FTP servers as:
- **Source Connector**: Take snapshots of files located on a remote FTP server and bring them into a secure Plakar Kloset.
- **Destination Connector**: Restore your snapshots to any FTP server in your environment.
- **Viewer**: Browse and verify FTP-sourced backups without performing a full restore.

Plakar ensures your FTP-based infrastructure remains resilient, secure, and verifiable from creation to recovery.

**Note**: The FTP integration preserves all metadata exposed by the FTP server. Metadata availability varies between FTP server implementations, with some providing full file attributes and others exposing only basic information.
