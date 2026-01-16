---
title: "Filesystem"

subtitle: "Immutable, encrypted backups for local and mounted filesystems"

description: >
  Back up local directories and mounted filesystems to protect against accidental deletion, corruption, and ransomware. Versioned, encrypted, and fully restorable across systems.

technology_title: Your filesystem is familiar and fragile

technology_description: >
  Local filesystems remain the primary place where personal data, system state, and application files live. From laptops and servers to NAS, SAN, and mounted volumes, filesystems are easy to use but easy to lose.

  Accidental deletions, disk failures, malware, and human error can permanently destroy data in seconds.

  Plakar makes filesystems verifiable, immutable backup sources by creating encrypted point-in-time snapshots snapshots that provide a reliable recovery point in case of data loss or corruption.

categories:
- source connector
- destination connector
- viewer
- storage connector

tags:
- Filesystem
- NFS
- SMB
- NAS
- SAN
- NTFS
- EXT4

seo_tags:
  - filesystem backup
  - local backup
  - immutable backup
  - encrypted backups
  - ransomware protection
  - versioned backups
  - disaster recovery
  - NAS backup
  - server backup
  - workstation backup
  - airgapped backup
  - snapshot technology

technical_documentation_link: 

stage: stable

date: 2025-05-13

plakar_version: ">=1.0.0"

resource: Filesystem

resource_type: filesystem
---

## Why protecting your Filesystem matters
Most of us protect our files by simply copying them to an external drive or a USB stick. While having a second copy is a good start, it isn't a real backup strategy. Standard file copying leaves your data vulnerable to a few common problems:
- **Accidental Deletion**: If you delete a file by mistake and your sync tool mirrors that change, the file is gone from both places.
- **Ransomware and Corruption**: If your files are hit by malware or a disk failure, "copying" those files usually just preserves the damaged versions.
- **Human Error**: It is incredibly easy to overwrite a new version of a document with an old one during a manual move.

For your personal photos, system settings, or work projects, you need a way to go back to a specific version of your data that you know is safe and healthy in case of a mishap with your current data.

## Security and Integrity
Local drives are the most common place for data to go missing. Whether it's a hard drive finally giving up or a misspelled command, local data is fragile.

With Plakar, every backup is a fixed snapshot that cannot be changed or overwritten once created. If your files are later deleted, damaged, or encrypted by malware, you can always return to a known-good version. All backups are end-to-end encrypted to protect your data.

Plakar also allows for direct inspection of these backups. You can easily browse, search, or verify that your data is safe via the CLI or UI without needing to perform a full restore first.

## How Plakar secures your Filesystem files
Plakar acts as a bridge for your local data, allowing you to move and protect it seamlessly:
- **Source Connector**: Take snapshots of any directory on your computer, local hard drives, or mounted NAS and SAN volumes.
- **Storage Connector**: Use any local folder or external drive as the "vault" (Kloset store) to hold your encrypted and deduplicated backups.
- **Destination Connector**: Restore your files exactly where they belong, or to an entirely new location, with all original permissions and timestamps intact.

## Common Questions
**1. Does Plakar keep file details?**  

Yes. When you restore a file, Plakar brings back the original permissions, timestamps, and ownership, so your files look and act exactly as they did before.

**2. How does Plakar handle symlinks?**  

Plakar backs up symlinks as they are. It records the link itself rather than the file it points to, which keeps your backups from growing unexpectedly.

**3. Do you store extended attributes?**

Yes, Plakar preserves extended attributes (xattrs) of files and directories.
