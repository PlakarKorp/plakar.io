---
title: Filesystem
subtitle: Protect your local files and folders with immutable, encrypted, verifiable backups
description: Back up and restore directories from local or mounted filesystems, with full integrity and metadata preservation.
technology_description: A filesystem stores and organizes files on devices like hard drives or mounted NAS volumes.
categories: 
- integration
tags:
- Filesystem
- Local Backup
- NFS
- Samba
- NAS
- SAN
- NTFS
- ext4
stage: stable
date: 2025-05-13
---

# Filesystem Integration

## Overview

The **Plakar Filesystem integration** enables seamless backup and restoration of filesystems to and from a **Kloset repository**.

This integration is designed to protect the data on your local hard drives, mounted NAS volumes, and SANs.

## Configuration

The Filesystem integration does not require any special configuration.

## Example Usage

To create the Kloset repository at `/var/backups` and back up the path `/etc` from your filesystem, you can use the following commands:

```bash
$ plakar at /var/backups create
$ plakar at /var/backups backup /etc
```

To restore data from the same Kloset repository to the current directory, use the following commands:

```bash
# List available backups
$ plakar at /var/backups ls

# Restore a specific file
$ plakar at /var/backups restore fc1b1e94:path/to/file.docx

# Restore the full backup
$ plakar at /var/backups restore fc1b1e94
```

See the [QuickStart guide](https://docs.plakar.io/en/quickstart/index.html) for more examples.

## Questions, Feedback, and Support

Found a bug? [Open an issue on GitHub](https://github.com/PlakarKorp/plakar/issues/new?title=Bug%20report%20on%20Filesystem%20integration&body=Please%20provide%20a%20detailed%20description%20of%20the%20issue.%0A%0A**Plakar%20version**)

Join our [Discord community](https://discord.gg/uuegtnF2Q5) for real-time help and discussions.

## Q&A

**Do you store file metadata?**

Yes, the Filesystem integration preserves file metadata, including permissions, timestamps, and ownership.
This ensures that the restored files retain their original attributes.

**Do you follow symlinks?**

Symlinks are backed up as symlinks, but their targets are not followed by default.

Following symlinks could be a security risk, as it may lead to backing up sensitive files outside the intended directory.

**Do you store extended attributes?**

Yes, the Filesystem integration preserves extended attributes (xattrs) of files and directories.