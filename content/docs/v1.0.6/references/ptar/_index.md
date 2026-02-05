---
date: "2026-02-03T00:00:00Z"
title: Plakar Ptar
last_reviewed: "2026-02-03"
last_reviewed_version: "v1.1.0"
summary: "Command reference for creating and accessing Ptar archives: syntax, options, and examples for plakar ptar and related commands."
weight: 1
---
*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

## plakar ptar

Creates portable `.ptar` archives from data sources.

### Syntax

```bash
plakar ptar [options] -o output.ptar [sources]
```

### Required Arguments

| Argument | Description |
|----------|-------------|
| `-o path` | Output file path for the `.ptar` archive |
| sources | At least one: `-k location` for Kloset Store or filesystem path |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-k location` | string | - | Include a Kloset Store (path or alias) |
| `-plaintext` | flag | false | Disable encryption |
| `-overwrite` | flag | false | Allow overwriting existing files |

### Source Types

| Source Type | Syntax | Example |
|-------------|--------|---------|
| Filesystem path | `/path` or `./path` | `/home/user/Documents` |
| Kloset Store (path) | `-k /path` | `-k $HOME/backups` |
| Kloset Store (alias) | `-k @alias` | `-k @s3-backups` |
| Remote protocols | Plugin-dependent | `sftp://`, `s3://`, `ipfs://` |

### Examples

```bash
# Single directory
plakar ptar -o documents.ptar /home/user/Documents

# Multiple paths
plakar ptar -o important.ptar /home/user/Documents /home/user/Pictures

# From Kloset Store
plakar ptar -o backup.ptar -k $HOME/backups

# From multiple stores
plakar ptar -o combined.ptar -k $HOME/backups -k @s3-backups

# Mixed sources
plakar ptar -o comprehensive.ptar -k $HOME/backups /home/user/NewDocs

# Plaintext archive
plakar ptar -plaintext -o unencrypted.ptar -k $HOME/backups

# Overwrite existing
plakar ptar -overwrite -o existing.ptar -k $HOME/backups
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PLAKAR_PASSPHRASE` | Passphrase for archive encryption (avoids interactive prompt) |

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error (file exists without `-overwrite`, invalid source, etc.) |

## plakar at ... (Ptar Operations)

Access Ptar files as read-only Kloset Stores.

### Syntax

```bash
plakar at archive.ptar <command>
```

### Supported Commands

| Command | Description |
|---------|-------------|
| `ls [snapshot-id]` | List snapshots or files in a snapshot |
| `check` | Verify cryptographic integrity |
| `restore -to destination [snapshot-id]` | Restore snapshot contents |
| `info` | Display archive metadata |

## plakar at ... ls

List snapshots or snapshot contents.

### Syntax

```bash
plakar at archive.ptar ls [snapshot-id]
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| snapshot-id | No | If omitted, lists all snapshots; if provided, lists files in that snapshot |

### Examples

```bash
# List all snapshots
plakar at backup.ptar ls

# List files in specific snapshot
plakar at backup.ptar ls df42124a
```

### Output Format

**Snapshots:**
```
<timestamp> <snapshot-id> <size> <duration> <path>
```

**Files:**
```
<timestamp> <permissions> <user> <group> <size> <filename>
```

## plakar at ... check

Verify archive integrity.

### Syntax

```bash
plakar at archive.ptar check
```

### Examples

```bash
plakar at backup.ptar check
```

### Output

```
info: <snapshot-id>: ✓ <path>
```

## plakar at ... restore

Restore snapshot contents to filesystem or Kloset Store.

### Syntax

```bash
plakar at archive.ptar restore -to destination [snapshot-id]
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `-to path` | Yes | Destination directory or Kloset Store alias (e.g., `@alias`) |
| snapshot-id | No | Snapshot to restore; defaults to first snapshot if omitted |

### Examples

```bash
# Restore to local directory
plakar at backup.ptar restore -to $HOME/restored-backups df42124a

# Restore to configured store
plakar at backup.ptar restore -to @new-location df42124a

# Restore first snapshot (no ID specified)
plakar at backup.ptar restore -to $HOME/restored
```

## plakar at ... info

Display archive metadata.

### Syntax

```bash
plakar at archive.ptar info
```

### Examples

```bash
plakar at backup.ptar info
```

## Passphrase Handling

### Interactive Mode

If `PLAKAR_PASSPHRASE` is not set, prompts appear:

**Creating archive:**
```bash
repository passphrase:
repository passphrase (confirm):
```

**Accessing archive:**
```bash
repository passphrase:
```

**Different source/destination:**
```bash
source repository passphrase:
repository passphrase:
repository passphrase (confirm):
```

### Non-interactive Mode

Set `PLAKAR_PASSPHRASE` environment variable to avoid prompts:

```bash
export PLAKAR_PASSPHRASE="your-secure-passphrase"
plakar ptar -o backup.ptar -k $HOME/backups
```

## File Format Properties

| Property | Value |
|----------|-------|
| Read-only | Yes (archives cannot be modified after creation) |
| Self-contained | Yes (includes all metadata and data) |
| Portable | Yes (single file can be moved/copied freely) |
| Encrypted by default | Yes (unless `-plaintext` specified) |
| Tamper-evident | Yes (cryptographic verification via `check`) |

## Further Reading
For a deeper dive into the philosophy and technical design of the format, check out the following posts on the Plakar blog:

- [It doesn't make sense to wrap modern data in a 1979 format, introducing .ptar](https://www.plakar.io/posts/2025-06-27/it-doesnt-make-sense-to-wrap-modern-data-in-a-1979-format-introducing-.ptar/)
- [Technical deep dive into .ptar: replacing .tgz for petabyte-scale S3 archives](https://www.plakar.io/posts/2025-06-30/technical-deep-dive-into-.ptar-replacing-.tgz-for-petabyte-scale-s3-archives/)
- [Kloset Store & Ptar design documentation](https://github.com/PlakarKorp/kloset/blob/main/encryption/README.md)
