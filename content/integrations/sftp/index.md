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

## 🧠 Why protecting SFTP-based workflows matters

SFTP is the backbone of secure file transfers across Linux servers 🐧, BSD hosts 🏴, and NAS devices 💾 like Synology and QNAP.
But secure transfer is not backup:
- Files can be overwritten or deleted immediately after upload
- No versioning or immutable snapshots exist for recovery
- Manual transfers or scripts are error‑prone and hard to audit

When compliance, uptime, or disaster recovery is critical, simply storing files on SFTP is not enough.
You need verifiable, immutable backups that can survive mistakes, misconfigurations, or attacks.

## 🔓 What happens when SFTP access credentials get compromised?

SFTP relies on SSH keys or passwords to control access. If a key is leaked, misused, or an account is compromised:
- Attackers can delete or overwrite files instantly
- 🦠 Ransomware or rogue scripts can encrypt or destroy live data
- Automated sync or replication can spread corruption across servers

Without independent, immutable snapshots, recovery can be impossible.

Plakar closes this gap by:
- 🔒 Immutable, deduplicated snapshots outside normal SFTP access
- 🔐 End‑to‑end encryption, even if the SFTP server is compromised
- 📦 Portable backups that support offline or air‑gapped storage

Your snapshots stay safe, verifiable, and recoverable even if the server isn’t.

## 🛡️ How Plakar secures your SFTP workflows

Plakar turns any SFTP‑accessible server into a flexible backup system:
- Source Connector: Snapshot files from the SFTP server into a secure Kloset store
- Storage Connector: Store encrypted, deduplicated backups on an SFTP server
- Destination Connector: Restore snapshots to SFTP, anywhere in your environment

With Push and Pull backup models, you can:
- Push snapshots from each source server independently
- Pull data centrally from multiple servers into a single Kloset
- Scale to multi‑server environments without complicated scripts

Snapshots remain immutable, portable, and browsable via CLI or UI, without rehydration.

## 🧰 Everything in one tool: backup, verify, restore, browse

With Plakar, SFTP becomes a complete backup workflow instead of just a file drop:
- ✅ Immutable, versioned snapshots
- 🔐 End‑to‑end encryption with SSH transport
- 🧠 Global deduplication to save space across multiple servers
- 🔎 Browse and verify backups directly without restoring
- 📦 Optional offline or air‑gapped retention for compliance

From snapshot creation to inspection to recovery, Plakar protects your SFTP‑based infrastructure, all in one tool.