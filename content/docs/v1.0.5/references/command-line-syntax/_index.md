---
date: "2025-09-04T06:20:40Z"
title: Command line syntax
last_reviewed: "2026-02-03"
last_reviewed_version: "v1.1.0"
summary: "This guide explains the basics of the Plakar command line syntax: how to specify stores, sources, destinations, argument order, and how to get help."
weight: 2
aliases:
  - /docs/v1.0.5/guides/plakar-command-line-syntax
---
*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

Plakar exposes several types of commands, depending on the resources they operate on (stores, sources, and/or destinations).

## General Syntax

```bash
plakar [at <store>] <command> [options] [arguments]
```

| Component | Required | Description |
|-----------|----------|-------------|
| `at <store>` | No | Specifies target Kloset Store; defaults to `~/.plakar` if omitted |
| `<command>` | Yes | The operation to perform |
| `[options]` | No | Command-specific flags (must precede arguments) |
| `[arguments]` | Varies | Paths, snapshot IDs, or other command inputs |

## Store Specification

### Syntax

```bash
plakar at <store-location> <command> [options] [arguments]
```

### Location Types

| Type | Syntax | Example |
|------|--------|---------|
| Filesystem path | `/path/to/store` | `plakar at /backup/kloset ls` |
| Alias | `@alias-name` | `plakar at @s3-backup ls` |
| SFTP | `sftp://host/path` | `plakar at sftp://server/backup ls` |
| S3 | `s3://bucket/path` | `plakar at s3://mybucket/store ls` |
| Default | (omit `at`) | `plakar ls` (uses `~/.plakar`) |

### Store Aliases

Aliases are configured with `plakar store add`:

```bash
plakar store add <alias> <location> [key=value ...]
```

**Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `<alias>` | Yes | Name for the alias (used with `@`) |
| `<location>` | Yes | Store location (path or URI) |
| `key=value` | No | Protocol-specific parameters |

**Common Parameters:**

| Key | Used For | Example |
|-----|----------|---------|
| `passphrase` | Encrypted stores | `passphrase='secret'` |
| `access_key` | S3 stores | `access_key=AKIAIOSFODNN7EXAMPLE` |
| `secret_access_key` | S3 stores | `secret_access_key=wJalrXUtnFEMI` |
| `use_tls` | S3/SFTP | `use_tls=false` |

**Example:**
```bash
plakar store add backup s3://mybucket/store \
  access_key=minioadmin \
  secret_access_key=minioadmin \
  use_tls=false
```

## Source Specification

Sources are locations to back up from.

### Syntax

```bash
plakar at <store> backup [options] <source>
```

### Location Types

| Type | Syntax | Example |
|------|--------|---------|
| Filesystem path | `/path` or `./path` | `plakar backup /home/user/docs` |
| Alias | `@alias-name` | `plakar backup @myfiles` |
| SFTP | `sftp://host/path` | `plakar backup sftp://server/data` |
| S3 | `s3://bucket/path` | `plakar backup s3://bucket/folder` |

### Source Aliases

Aliases are configured with `plakar source add`:

```bash
plakar source add <alias> <location> [key=value ...]
```

**Example:**
```bash
plakar source add mybucket s3://localhost:9000/data \
  access_key=minioadmin \
  secret_access_key=minioadmin \
  use_tls=false
```

## Destination Specification

Destinations are locations to restore to.

### Syntax

```
plakar at <store> restore -to <destination> <snapshot-id>
```

### Location Types

| Type | Syntax | Example |
|------|--------|---------|
| Filesystem path | `/path` or `./path` | `plakar restore -to /restore/dir abc123` |
| Alias | `@alias-name` | `plakar restore -to @target abc123` |
| SFTP | `sftp://host/path` | `plakar restore -to sftp://server/restore abc123` |
| S3 | `s3://bucket/path` | `plakar restore -to s3://bucket/restore abc123` |

### Destination Aliases

Aliases are configured with `plakar destination add`:

```bash
plakar destination add <alias> <location> [key=value ...]
```

**Example:**
```bash
plakar destination add target s3://localhost:9000/restore \
  access_key=minioadmin \
  secret_access_key=minioadmin \
  use_tls=false
```

## Argument Order

Order matters in plakar commands. Options must precede arguments.

**Pattern:**
```bash
plakar [at <store>] <command> [options] <arguments>
```

**Examples:**

| Status | Command |
|--------|---------|
| *Correct* | `plakar at /store backup -check /path` |
| *Incorrect* | `plakar at /store backup /path -check` |

## Common Commands

### Store Operations

| Command | Syntax | Description |
|---------|--------|-------------|
| `create` | `plakar at <store> create` | Initialize new Kloset Store |
| `ls` | `plakar at <store> ls [snapshot-id]` | List snapshots or snapshot contents |
| `check` | `plakar at <store> check [snapshot-id]` | Verify integrity |
| `info` | `plakar at <store> info` | Display store metadata |

### Backup Operations

| Command | Syntax | Description |
|---------|--------|-------------|
| `backup` | `plakar at <store> backup [options] <source>` | Create snapshot |
| `push` | `plakar at <store> push [options] <source>` | Scheduled backup (same as backup) |

### Restore Operations

| Command | Syntax | Description |
|---------|--------|-------------|
| `restore` | `plakar at <store> restore -to <dest> <snapshot-id>` | Restore snapshot |
| `cat` | `plakar at <store> cat <snapshot-id>:<path>` | Output file contents |

### Configuration

| Command | Syntax | Description |
|---------|--------|-------------|
| `store add` | `plakar store add <alias> <location> [params]` | Add store alias |
| `source add` | `plakar source add <alias> <location> [params]` | Add source alias |
| `destination add` | `plakar destination add <alias> <location> [params]` | Add destination alias |

## Help System

### Quick Help

Display command usage:
```bash
plakar <command> -h
plakar <command> --help
```

**Output:**
```bash
Usage: <command> [OPTIONS] arguments

OPTIONS:
  ...
```

### Manual Pages

Display detailed documentation:
```bash
plakar help <command>
```

**Output includes:**
- Full command description
- All options with explanations
- Examples
- Related commands (SEE ALSO section)

**Example:**
```bash
# View backup command manual
plakar help backup

# View related source configuration manual
plakar help source
```

## Special Syntax

### Snapshot References

| Syntax | Description |
|--------|-------------|
| `snapshot-id` | Full snapshot ID (e.g., `eb66133a`) |
| `snapshot-id:path` | File within snapshot (e.g., `eb66133a:/etc/config`) |

### Alias References

All aliases use `@` prefix:

| Type | Syntax |
|------|--------|
| Store alias | `@store-name` |
| Source alias | `@source-name` |
| Destination alias | `@dest-name` |
