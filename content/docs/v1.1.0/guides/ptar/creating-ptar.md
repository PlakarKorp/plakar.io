---
title: Creating Ptar Files
description: >
  Learn how to create ptar archives from Kloset Stores and filesystem paths.
last_reviewed: "2026-01-14"
last_reviewed_version: "v1.0.6"
weight: 2
---

The `plakar ptar` command creates portable `.ptar` archives from one or more data sources. You can include existing Kloset Stores, filesystem paths, or both when creating a single archive.

## Basic Syntax

```bash
plakar ptar [options] -o output.ptar [sources]
```

### Required
- `-o output.ptar` - Destination file path
- At least one source:
  - `-k location` to include a Kloset Store
  - `path ...` to include a filesystem paths

### Common options
- `-plaintext` - Disable encryption (not recommended)
- `-overwrite` - Allow overwriting existing Ptar files

## Creating from Filesystem Paths
The simplest way to create a Ptar archive is directly from filesystem directories:

```bash
# Single directory
plakar ptar -o documents.ptar /home/user/Documents

# Multiple paths
plakar ptar -o important.ptar \
    /home/user/Documents \
    /home/user/Pictures
```
This creates a new Ptar archive without needing an existing Kloset Store.

## Creating from a Kloset Store
### Export a Single Kloset Store

Export an existing Kloset Store to a portable Ptar file:

```bash
# Export local Kloset Store
plakar ptar -o backup.ptar -k $HOME/backups

# Export configured store (using alias)
plakar ptar -o backup.ptar -k @s3-backups
```

### Export Multiple Kloset Stores
Combine multiple Kloset Stores into a single Ptar archive:
```bash
plakar ptar -o combined.ptar \
    -k $HOME/backups \
    -k @s3-backups \
    -k @proton-drive-backups
```
This creates a single deduplicated archive containing all snapshots from all specified stores.

## Combining Sources

You can mix Kloset Stores and filesystem paths in a single archive:

```bash
plakar ptar -o comprehensive.ptar \
    -k $HOME/backups \
    /home/user/NewDocuments \
    /home/user/RecentPhotos
```
This is useful for creating archives that include both historical snapshots and fresh filesystem data.

## Encryption and Passphrases
### Interactive Prompt (Default)
If no passphrase is provided, you'll be prompted to enter one:
```bash
$ plakar ptar -o backup.ptar -k $HOME/backups
Enter passphrase: 
Confirm passphrase:
```

### Environment Variable
Set the passphrase via environment variable to avoid prompts, useful for automated scripts:

```bash
export PLAKAR_PASSPHRASE="your-secure-passphrase"
plakar ptar -o backup.ptar -k $HOME/backups
```

### Using a Different Passphrase
Each Ptar file can have its own passphrase, independent of the source Kloset Stores:
```bash
$ plakar ptar -o offsite.ptar -k $HOME/backups
source repository passphrase: # passphrase for source store
repository passphrase: # new passphrase for Ptar file
repository passphrase (confirm): # confirm new passphrase
```

## Plaintext Archives
To create an unencrypted archive (not recommended for sensitive data):
```bash
plakar ptar -plaintext -o unencrypted.ptar -k $HOME/backups
```
{{% notice style="note" title="Encryption Best Practices" expanded="true" %}}
Always use encryption unless you have a specific reason not to. Plaintext archives offer no protection if intercepted or accessed by unauthorized parties.
{{% /notice %}}

### Overwriting Existing Files
By default `plakar ptar` prevents overwriting existing Ptar files:

```bash
$ plakar ptar -o existing.ptar -k $HOME/backups
plakar: ptar archive existing.ptar already exists, use -overwrite to overwrite it
```

Explicitly allow overwriting:
```bash
plakar ptar -overwrite -o existing.ptar -k $HOME/backups
```
