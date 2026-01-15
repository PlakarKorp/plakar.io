---
title: What is Ptar?
description: >
  Understanding the ptar file format and when to use it.
last_reviewed: "2026-01-14"
last_reviewed_version: "v1.0.6"
weight: 1
---

Ptar (Portable Tar) is **plakar's** portable archive file format that bundles one or more Kloset Stores and filesystem data into a single, self-contained `.ptar` file. Think of it as a "powerful tar file" that includes all of plakar's advanced features: deduplication, compression, encryption, versioning, and tamper-evidence while remaining completely portable.

## Quick Example
```bash
# Create a portable archive from your documents
plakar ptar -o documents.ptar /home/user/Documents

# Access it anywhere
plakar at documents.ptar ls
```

## How Ptar Works

A `.ptar` file is a complete, standalone package that contains:

- **Repository metadata**: Information about the Kloset Store structure
- **Snapshots**: All snapshot metadata and history
- **Data chunks**: Deduplicated blocks of actual file content

## When you create a ptar file, plakar:

1. Reads data from one or more sources (Kloset Stores or filesystem paths)
2. Deduplicates the data at the block level
3. Compresses the deduplicated blocks
4. Encrypts the compressed data (unless `-plaintext` is specified)
5. Packages everything into a single `.ptar` file

## When to Use Ptar
Ideal use cases are:
- **Offsite backups**: Create encrypted archives to store in remote locations
- **System migrations**: Package your data for moving to a new system
- **Long-term archival**: Self-contained format that includes all metadata
- **Sharing backups**: Transfer backups without needing plakar infrastructure
- **Compliance storage**: Tamper-evident archives with cryptographic verification

## Ptar vs. Traditional Archives

| Feature              | Ptar                         | Traditional tar/zip        |
|----------------------|------------------------------|----------------------------|
| Deduplication        | ✓ Block-level                | ✗ None                     |
| Compression          | ✓ Automatic (LZ4)            | ✓ Optional                 |
| Encryption           | ✓ Built-in (AES256)          | ✗ Requires separate tools |
| Versioning           | ✓ Multiple snapshots         | ✗ Single version           |
| Tamper detection     | ✓ Cryptographic verification | ✗ None                     |

## File Format Details
### Encryption
By default, Ptar files are encrypted using a key derived from your passphrase:
- Passphrase can be provided via `PLAKAR_PASSPHRASE` environment variable
- Or prompted interactively during creation/extraction
- Use `-plaintext` flag to disable encryption (not recommended)

### Compression
All data in `ptar` files is automatically compressed using efficient algorithms (currently LZ4) optimized for data backup.

### Deduplication
Ptar maintains plakar's block-level deduplication:
- **Algorithm**: FASTCDC (Fast Content-Defined Chunking)
- **Chunk sizes**: 64 KiB minimum, 1 MiB normal, 4 MiB maximum
- **Efficiency**: Identical data blocks are stored only once
- **Cross-source**: Works even when combining multiple Kloset Stores
- **Size reduction**: Significantly reduces file size for similar content

### Security
Ptar files are designed with security in mind:
- **Encryption**: Data is encrypted within the archive using AES256-GCM-SIV
- **Tamper-evident**: Cryptographic verification (BLAKE3 hashes) detects modifications
- **Passphrase-protected**: Only those with the passphrase can access the archive
- **Key derivation**: ARGON2ID provides strong protection against brute-force attacks

{{% notice style="warning" title="Passphrase Safety" expanded="true" %}}
Store your passphrase securely! If you lose it, the `.ptar` file cannot be decrypted.
{{% /notice %}}

When you run `plakar at backup.ptar check`, **plakar** verifies the cryptographic integrity of every chunk, detecting any tampering or corruption.
