---
title: "TAR"
date: "2026-06-18T00:00:00Z"
weight: 22
summary: "Import TAR archives into a Kloset store with Plakar."
---

# TAR

The **TAR integration** enables importing TAR archives into a Kloset store. File
contents, directory structure, and metadata are preserved during import, making
it useful for ingesting legacy backups and exported application data into Plakar
for versioned tracking and deduplication.

Both uncompressed `.tar` and gzip-compressed `.tar.gz` / `.tgz` archives are
supported.

The TAR integration provides one connector:

| Connector type       | Description                               |
| -------------------- | ----------------------------------------- |
| **Source connector** | Import a TAR archive into a Kloset store. |

## Installation

The TAR integration is built into Plakar and requires no additional package
installation.

## Configuration

| Option     | Description                             |
| ---------- | --------------------------------------- |
| `location` | Required. Path to the TAR archive file. |

## Source connector

The source connector streams a TAR archive into a Kloset store, capturing file
contents, directory structure, and metadata with encryption and deduplication.

The archive format is specified via the URI scheme:

- `tar://` — uncompressed TAR archive
- `tgz://` — gzip-compressed TAR archive

```bash
# Import an uncompressed archive
$ plakar at /var/backups backup tar:///home/user/backup.tar

# Import a gzip-compressed archive
$ plakar at /var/backups backup tgz:///home/user/backup.tar.gz
```
