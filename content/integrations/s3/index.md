---
title: S3
subtitle: Protect your S3 buckets from rogue deletion, ransomware, and silent corruption.
description: Back up, restore, or replicate your object storage buckets from any S3-compatible service.
technology_description: S3 is a scalable object storage service commonly used for data archiving, backup, analytics, and cloud-native applications. It is accessible via a RESTful API and widely supported across public cloud providers and self-hosted solutions.
categories: 
  - integration
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
stage:
  - stable
date: 2025-05-13
---

# S3 Integration

## Overview

The **Plakar S3 integration** enables seamless backup and restoration of **S3-compatible object storage buckets** to and from a [Kloset repository](http://localhost:1313/posts/2025-04-29/kloset-the-immutable-data-store/).

> **Why back up your S3 buckets?**
>
> S3 providers *do not* back up your data by default. This makes your data vulnerable to accidental deletion, ransomware, and silent corruption.
>
> Plakar lets you implement a reliable [3-2-1 backup strategy](https://docs.plakar.io/en/quickstart/probabilities/index.html) with minimal effort.

## Configuration

The S3 integration requires to set up a remote configuration to provide the necessary credentials and endpoint information for your S3-compatible provider.

### Setting Up a Remote

You can configure a remote called `mys3` to connect to your S3-compatible provider:

```bash
$ plakar config remote create mys3
# For AWS S3 (see below for other providers):
$ plakar config remote set mys3 location s3://s3.<region>.amazonaws.com/<bucket>

$ plakar config remote set mys3 access_key <ACCESS_KEY>
$ plakar config remote set mys3 secret_access_key <SECRET_KEY>
```

To refer to this remote in Plakar commands, use the syntax `@mys3`, for example `plakar backup @mys3`.

#### Remote Configuration Options

- **`location`**: Full S3 URL. Format: `s3://<endpoint>/<bucket>/<optional_path>`. **See the provider-specific section below for examples.**
- **`access_key`**: Your provider's access key.
- **`secret_access_key`**: Your provider's secret key.
- `use_tls`: Enables TLS (default: true).

### Provider-Specific Examples

The S3 integration expects the location to be in the format `s3://<endpoint>/<bucket>/<optional_path>`.
While some providers display the `s3://` URL in their web UI, most do not, and you will need to construct it manually.

> ℹ️ If your provider isn’t listed here, join our [Discord](https://discord.gg/uuegtnF2Q5) — we’ll help you configure it and update this guide.

#### [AWS S3](https://aws.amazon.com/s3/)

```bash
$ plakar config repository set mys3 location s3://s3.<region>.amazonaws.com/<bucket>
# Example
$ plakar config repository set mys3 location s3://s3.us-east-1.amazonaws.com/mybucket
```

#### [MinIO](https://min.io/)

```bash
$ plakar config repository set mys3 location s3://<minio-host>:<port>/<bucket>
# Example
$ plakar config repository set mys3 location s3://localhost:9000/mybucket

# If you are running MinIO locally, you may need to set the following configuration to disable TLS verification:
$ plakar config repository set mys3 use_tls false
```
When running MinIO locally without TLS, explicitly disable `use_tls`.

#### [Scaleway](https://www.scaleway.com/en/object-storage/)

```bash
$ plakar config repository set mys3 location s3://s3.<region>.scw.cloud/<bucket>
# Example
$ plakar config repository set mys3 location s3://s3.fr-par.scw.cloud/mybucket
```

#### [Backblaze](https://www.backblaze.com/cloud-storage)

```bash
$ plakar config repository set mys3 location s3://<minio-host>:<port>/<bucket>
# Example
$ plakar config repository set mys3 location s3://localhost:9000/mybucket
```

#### [CleverCloud](https://www.clever-cloud.com/developers/doc/addons/cellar/)

```bash
$ plakar config repository set mys3 location s3://cellar-c2.services.clever-cloud.com/<bucket>
# Example
$ plakar config repository set mys3 location s3://cellar-c2.services.clever-cloud.com/mybucket
```

## Example Usage

Once configured, you can back up or restore your S3 bucket using standard Plakar commands.

To create the Kloset repository at `/var/backups` and back up the S3 bucket previously configured as `mys3`, run the following command:

```bash
$ plakar at /var/backups create
$ plakar at /var/backups backup @mys3
```

To restore the data from the same Kloset repository to the S3 bucket, use the following commands:

```bash
# List available backups
$ plakar at /var/backups ls

# Restore a specific file
$ plakar at /var/backups restore -to @mys3 fc1b1e94:path/to/file.docx

# Restore the full backup
$ plakar at /var/backups restore -to @mys3 fc1b1e94
```

See the [QuickStart guide](https://docs.plakar.io/en/quickstart/index.html) for more examples.

## Questions, Feedback, and Support

Found a bug? [Open an issue on GitHub](https://github.com/PlakarKorp/plakar/issues/new?title=Bug%20report%20on%20S3%20integration&body=Please%20provide%20a%20detailed%20description%20of%20the%20issue.%0A%0A**Plakar%20version**)

Join our [Discord community](https://discord.gg/uuegtnF2Q5) for real-time help and discussions.

## Q&A

**Do you support other S3-compatible providers?**

Yes! Plakar supports any S3-compatible provider. If the provider is not listed in this page, please join our [Discord](https://discord.gg/uuegtnF2Q5) for help configuring it. We will update this page with the configuration details.

**When versioning is enabled, do you back up all versions of the files?**

No, only the latest version of the objects is backed up.