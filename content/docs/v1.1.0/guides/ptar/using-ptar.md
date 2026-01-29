---
title: Using Ptar Files
description: >
  Learn how to restore, extract, and verify data from Ptar archives
last_reviewed: "2026-01-14"
last_reviewed_version: "v1.0.6"
weight: 3
---

Once you have a Ptar file, you can use it like any other Kloset Store. This guide explains how to access, inspect, verify, and restore data from Ptar archives.

Ptar files are read-only and are accessed using the standard `plakar at` command.
```bash
plakar at backup.ptar <command>
```

## Accessing Ptar Files
When using `plakar at`, the Ptar file behaves like a read-only Kloset Store.

## Listing Contents
### List All Snapshots
To view all snapshots contained in a Ptar file:
```bash
$ plakar at backup.ptar ls
2026-01-15T09:52:24Z   eb66133a   7.9 MiB        0s /home/user/Pictures
2026-01-15T09:52:24Z   df42124a   7.0 KiB        0s /home/user/Documents
```

### List Files in a Snapshot
To view the contents of a specific snapshot, pass the snapshot ID to `ls`:

```bash
$ plakar at backup.ptar ls df42124a
2026-01-14T20:21:03Z drwxrwxr-x user user  4.0 KiB Obsidian
2026-01-14T03:31:56Z -rw-r--r-- user user     28 B notes.txt
2026-01-14T03:31:56Z -rw-r--r-- user user     28 B photo.jpg
[...]
2026-01-14T03:31:56Z -rw-r--r-- user user     36 B presentation.pptx
2026-01-14T03:31:56Z -rw-r--r-- user user     40 B project_proposal.docx
2026-01-14T03:31:56Z drwxr-xr-x user user  4.0 KiB recipes
2026-01-14T03:31:56Z -rw-r--r-- user user     29 B resume.pdf
```

## Verifying Integrity
You can use the `check` command to verify the integrity of a Ptar file. This checks if all snapshots and their contents are cryptographically valid and uncorrupted.
```bash
$ plakar at backup.ptar check
info: eb66133a: ✓ /home/user/Pictures
info: eb66133a: ✓ /home/user/Pictures/Screenshots
info: eb66133a: ✓ /home/user/Pictures/Screenshots/Screenshot from 2025-12-20 18-09-27.png
info: check: verification of eb66133a:/home/user/Pictures completed successfully
[...]
info: df42124a: ✓ /home/user/Documents
info: df42124a: ✓ /home/user/Documents/notes.txt
info: df42124a: ✓ /home/user/Documents/recipes/ingredients.csv
info: check: verification of df42124a:/home/user/Documents completed successfully
```

## Restoring from Ptar
You can restore the contents of a snapshot from a Ptar archive into a directory or another configured Kloset Store.

A snapshot ID should be specified for the snapshot you want to restore. If no snapshot ID is provided, the first snapshot in the archive is used.
```bash
# Restore to a local directory
plakar at backup.ptar restore -to $HOME/restored-backups <snapshot-id>

# Restore to a configured store (alias)
plakar at backup.ptar restore -to @new-location <snapshot-id>
```
Example:
```bash
plakar at backup.ptar restore -to $HOME/restored-backups df42124a
info: df42124a: OK ✓ /home/user/Documents/notes.txt
info: df42124a: OK ✓ /home/user/Documents/project_proposal.docx
info: df42124a: OK ✓ /home/user/Documents/recipes/breakfast.txt
[...]
info: df42124a: OK ✓ /home/user/Documents/recipes/dinner.txt
info: df42124a: OK ✓ /home/user/Documents/recipes/ingredients.csv
info: df42124a: OK ✓ /home/user/Documents/recipes/desserts.txt
info: df42124a: OK ✓ /home/user/Documents/resume.pdf
info: restore: restoration of df42124a:/home/user/Documents at /home/user/restored-backups completed successfully
```

## Inspecting Ptar Files
To show all the metadata of a Ptar file you can run the `info` command:
```bash
$ plakar at backup.ptar info
repository passphrase: 
Version: v1.0.0
Timestamp: 2026-01-15 12:52:21.803998345 +0300 EAT
RepositoryID: 9c84f91e-9b66-4d5c-8e9d-f5a72cef1bbb
Packfile:
 - MaxSize: 16 EiB (18446744073709551615 bytes)
Chunking:
 - Algorithm: FASTCDC
 - MinSize: 64 KiB (65536 bytes)
 - NormalSize: 1.0 MiB (1048576 bytes)
 - MaxSize: 4.0 MiB (4194304 bytes)
Hashing:
 - Algorithm: BLAKE3
 - Bits: 256
Compression:
 - Algorithm: LZ4
 - Level: 131072
Encryption:
 - SubkeyAlgorithm: AES256-KW
 - DataAlgorithm: AES256-GCM-SIV
 - ChunkSize: 65536
 - Canary: 181c4c4a0562fb66cfb057f8ea81b15f396f3edc846af358ea85532124ce84ba127eac5e46f678e22e8b54e7f75973408c24cd9c1d47571ca19f47c19dc98198d8a2aaf99871bacdcdbc02f5ce0d11e16f93eec109a146643b97d0b647f8c19ce5dedd37
 - KDF: ARGON2ID
   - Salt: 9c7c1e9b4aa8f53a4bd58291b64c3dd5
   - SaltSize: 16
   - KeyLen: 32
   - Time: 4
   - Memory: 262144
   - Thread: 1
Snapshots: 2
Storage size: 7.9 MiB (8261514 bytes)
Logical size: 7.9 MiB (8331502 bytes)
```
