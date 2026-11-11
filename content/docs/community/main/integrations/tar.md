---
title: "TAR"
date: "2026-06-18T00:00:00Z"
weight: 21
summary: "Import TAR archives into a Kloset store with Plakar."
---

# TAR

The TAR integration imports TAR archives into a Kloset store. File contents,
directory structure and metadata are preserved during import, with encryption
and deduplication applied. This is useful for ingesting legacy backups and
exported application data into Plakar for versioned tracking and deduplication.

The TAR integration is built into Plakar and requires no additional package
installation.

The integration includes one connector:

| Connector type       | Description                               |
| -------------------- | ----------------------------------------- |
| **Source connector** | Import a TAR archive into a Kloset store. |

Both uncompressed and gzip-compressed archives are supported. The archive format
is selected by the URI scheme:

| Protocol | Archive format                                  |
| -------- | ----------------------------------------------- |
| `tar`    | Uncompressed TAR archive (`.tar`)               |
| `tgz`    | Gzip-compressed TAR archive (`.tar.gz`, `.tgz`) |

## Configuration

| Option     | Required | Description                   |
| ---------- | -------- | ----------------------------- |
| `location` | Yes      | Path to the TAR archive file. |

### Example

```bash
# Import an uncompressed archive
$ plakar at /var/backups backup tar:///home/user/backup.tar

# Import a gzip-compressed archive
$ plakar at /var/backups backup tgz:///home/user/backup.tar.gz
```

## Backing up command output

A command that generates a single output stream can be piped directly into
Plakar using the [STDIO integration](../stdio):

```bash
$ some-command | plakar at /var/backups backup stdin:///output.txt
```

A command that produces multiple files can instead generate a TAR archive, which
is then ingested with the TAR integration:

```bash
$ some-command --output-format=tar | plakar at /var/backups backup tar://
```
