---
title: What is Ptar?
description: >
  Understanding the ptar file format and when to use it.
last_reviewed: "2026-01-14"
last_reviewed_version: "v1.0.6"
weight: 1
---

Ptar (Portable Tar) is **plakar's** portable archive file format that bundles data from any supported source such as Kloset Stores, the local filesystem or any Plakar plugins added into a single, self-contained `.ptar` file. Think of it as a "powerful tar file" that includes all of plakar's advanced features: deduplication, compression, encryption, versioning, and tamper-evidence while remaining completely portable.

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

## When you create a Ptar file, plakar:

1. Reads data from one or more sources (Kloset Stores or filesystem paths)
2. Deduplicates the data at the block level
3. Compresses the deduplicated blocks
4. Encrypts the compressed data (unless `-plaintext` is specified)
5. Packages everything into a single `.ptar` file

## Supported Sources

One of the most powerful features of Ptar is its ability to ingest data from multiple, diverse locations simultaneously. Supported sources include:

- **Local Filesystem**: Standard absolute or relative paths (e.g., `/etc` or `./data`).
- **Remote Protocols**: Any integration supported by plakar plugins, such as `sftp://`, `s3://`, or `ipfs://`.
- **Kloset Stores**: You can use the `-k` flag to import existing Kloset stores into a portable archive.
- **Aliases**: While currently being refined in v1.0.6, plakar aims to support repository aliases (e.g., `@s3-backup`) as direct sources.

{{% notice style="info" title="Note on Aliases" expanded="true" %}}
In version v1.0.6 and before there is a known issue [Issue #1882](https://github.com/PlakarKorp/plakar/issues/1882) regarding the resolution of aliases (e.g., `@myalias`) during Ptar archive creation. It is recommended to use direct paths or URI strings until the fix is released.
{{% /notice %}}

## When to Use Ptar
Ideal use cases are:
- **Offsite backups**: Create encrypted archives to store in remote locations
- **System migrations**: Package your data for moving to a new system
- **Long-term archival**: Self-contained format that includes all metadata
- **Sharing backups**: Transfer backups as a single portable file
- **Compliance storage**: Tamper-evident archives with cryptographic verification

## Ptar vs. Traditional Archives

| Feature              | Ptar                         | Traditional tar/zip        |
|----------------------|------------------------------|----------------------------|
| Deduplication        | ✓ Block-level                | ✗ None                     |
| Compression          | ✓ Automatic (LZ4)            | ✓ Optional                 |
| Encryption           | ✓ Built-in (AES256)          | ✗ Requires separate tools |
| Versioning           | ✓ Multiple snapshots         | ✗ Single version           |
| Tamper detection     | ✓ Cryptographic verification | ✗ None                     |

## File Format & Technical Details

Because a `.ptar` file is a single-file implementation of a Kloset Store, it inherits all the performance and security characteristics of the **plakar** ecosystem.

- **Storage Logic**: For detailed information on how data is deduplicated, compressed, and secured, please refer to the [Kloset Store Documentation](../../quickstart/concepts.md).
- **Integrity**: Running `plakar at backup.ptar check` verifies the cryptographic integrity of every chunk.

## Further Reading
For a deeper dive into the philosophy and technical design of the format, check out the following posts on the plakar blog:

- [It doesn't make sense to wrap modern data in a 1979 format, introducing .ptar](https://www.plakar.io/posts/2025-06-27/it-doesnt-make-sense-to-wrap-modern-data-in-a-1979-format-introducing-.ptar/)
- [Technical deep dive into .ptar: replacing .tgz for petabyte-scale S3 archives](https://www.plakar.io/posts/2025-06-30/technical-deep-dive-into-.ptar-replacing-.tgz-for-petabyte-scale-s3-archives/)
- [Kloset Store & Ptar design documentation](https://github.com/PlakarKorp/kloset/blob/main/encryption/README.md)

{{% notice style="warning" title="Passphrase Safety" expanded="true" %}}
By default, Ptar files are encrypted. Store your passphrase securely! If you lose it, the `.ptar` file cannot be decrypted.
{{% /notice %}}
