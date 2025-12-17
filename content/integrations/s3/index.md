---

title: S3
subtitle: Protect your S3 buckets from rogue deletion, ransomware, and silent corruption
description: Backup and restore your object storage buckets to and from any S3-compatible service, and host your Kloset repository on S3.
categories:
  - source connector
  - destination connector
  - storage connector
  - viewer
tags:
  - S3
  - Object Storage
  - AWS
  - Google Cloud Storage
  - MinIO
  - Ceph
  - Scality
  - Wasabi
  - Scaleway
  - Blackblaze
  - OVH
  - Infomaniak
stage: stable
date: 2025-05-13
---


- source connector
- destination connector
- storage connector
- viewer tags:
- S3
- Object Storage
- AWS
- Google Cloud Storage
- MinIO
- Ceph
- Scality
- Wasabi
- Scaleway
- Blackblaze
- OVH
- Infomaniak

---

# S3 Integration

## Capabilities

- **Source Connector**: Seamlessly back up S3-compatible buckets to a [Kloset repository](/posts/2025-04-29/kloset-the-immutable-data-store/).
- **Destination Connector**: Restore data from a Kloset repository back into your S3 bucket.
- **Storage Connector**: Host your Kloset repository directly on any S3-compatible object storage.
- **Viewer**: Use the Integration Viewer to browse and visualize snapshots stored in S3.

## Overview

The **Plakar S3 integration** enables immutable, encrypted, verifiable backups and restores of any S3-compatible object storage buckets. Whether you’re using AWS S3, Google Cloud Storage, MinIO, Ceph, or another provider, Plakar delivers a unified interface and military-grade security.

## Configuration

Configure a named remote to connect to your S3-compatible provider:

```bash
$ plakar config remote create mys3
$ plakar config remote set mys3 location s3://<endpoint>/<bucket>/<optional_path>
$ plakar config remote set mys3 access_key <ACCESS_KEY>
$ plakar config remote set mys3 secret_access_key <SECRET_KEY>
# Optional: disable TLS verification
$ plakar config remote set mys3 use_tls false
```

Supported options:

- `location`: Full S3 URL, e.g. `s3://s3.<region>.amazonaws.com/mybucket`.
- `access_key` / `secret_access_key`: Your provider’s credentials.
- `use_tls`: Enable or disable TLS (default: true).
- `tls_insecure_no_verify`: Disables certificate verification (default: false).

### Provider Examples

```bash
$ plakar config remote set mys3 location s3://s3.us-east-1.amazonaws.com/mybucket
```

```bash
$ plakar config remote set mys3 location s3://localhost:9000/mybucket
$ plakar config remote set mys3 use_tls false
```

```bash
$ plakar config remote set mys3 location s3://s3.fr-par.scw.cloud/mybucket
```

```bash
$ plakar config remote set mys3 location s3://s3.eu-central-003.backblazeb2.com/mybucket
```

```bash
$ plakar config remote set mys3 location s3://cellar-c2.services.clever-cloud.com/mybucket
```

```bash
$ plakar config remote set mys3 location s3://s3.swiss-backup04.infomaniak.com/mybucket
```
If your provider isn’t listed, join our [Discord community](https://discord.gg/uuegtnF2Q5) for assistance.

## Example Usage

1. **Create** a Kloset repository on your S3 bucket:

```bash
$ plakar at @mys3 create
```

2. **Back up** a local directory (e.g., `/etc`):

```bash
$ plakar at @mys3 backup /etc
```

3. **List** available snapshots:

```bash
$ plakar at @mys3 ls
```

4. **Restore** data back to your S3 bucket:

```bash
# Restore a single file
$ plakar at @mys3 restore fc1b1e94:path/to/file.txt

# Restore the full backup
$ plakar at @mys3 restore fc1b1e94
```

5. **Browse** snapshots via the UI:

```bash
$ plakar at @mys3 ui
```

See the [QuickStart guide](https://docs.plakar.io/en/quickstart/index.html) for further examples.

## Questions, Feedback, and Support

- Found a bug? [Open an issue on GitHub](https://github.com/PlakarKorp/plakar/issues/new?title=Bug%20report%20on%20S3%20integration\&body=Please%20provide%20a%20detailed%20description%20of%20the%20issue.%0A%0A**Plakar%20version**)
- Join our [Discord community](https://discord.gg/uuegtnF2Q5) for real-time help.

## Q&A

**Do you support all S3-compatible providers?**\
Yes. If your provider isn’t listed above, reach out on Discord and we’ll help you configure it.

**When versioning is enabled, do you back up all object versions?**\
No, Plakar backs up only the latest version of each object to avoid redundant storage.

**Can I replicate between buckets?**\
Use Plakar CLI to push snapshots from one bucket to another by configuring multiple remotes and using `plakar at` commands.
