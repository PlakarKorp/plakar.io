---
# Title of the integration (keep it short and descriptive)
title: S3 integration package

# One-line description for listing/search (focus on value and action)
description: Backup and restore your object storage with Plakar secure, portable, and deduplicated.

# Technical summary of how the integration works under the hood
technology_description: >
  This integration uses the AWS S3 API to extract, snapshot, and restore
  bucket data into a Plakar Kloset store, supporting both standard and
  Glacier storage classes.

# UGO categories — typically 'integrations' for resource plugins
categories:
  - integrations

# Tags for SEO
tags:
  - s3
  - amazon s3
  - aws s3
  - cloud object storage
  - s3 glacier
  - backup
  - disaster recovery
  - encryption
  - deduplication
  - versioning
  - immutable storage
  - compliance
  - long-term archiving
  - airgapped backup
  - snapshot technology
  - portable format

# Stage of maturity: 'beta', 'stable', 'coming soon', 'deprecated'
stage: stable

# Date of publication or last update (ISO 8601)
date: 2025-07-26

# Minimum version of Plakar this integration is compatible with
plakar_version: ">=1.0.3"

# Version of the integration itself (used for changelog / tracking)
integration_version: 0.1.0

# Type of resource targeted
resource_type: object-storage

# What the integration provides
provides:
  - source connector
  - destination connector
  - storage connector
  - viewer
---
> **Requirements**
> - Plakar version: "1.0.2 or >=1.0.3"
> - Integration version: "0.1.0"
> - AWS access key and secret key (or an IAM role for EC2/EKS)
> - S3 bucket with proper permissions for list, read, and write operations

## Introduction

This integration allows you to **snapshot** and **restore** object storage using Plakar to store data in a **Kloset store**, while minimizing storage usage and ensuring strong encryption.

It includes a **Storage Connector** that persist snapshots directly in S3, supporting both standard and Glacier storage classes.

**A Viewer** is also provided to **browse**, **search**, and **restore** snapshots without needing full extraction.

**Use cases**
- Secure, deduplicated backups of S3 buckets for disaster recovery
- Hybrid or multi-cloud backup strategies leveraging S3 or S3 Glacier
- Cost‑optimized long‑term archival with immutable snapshotsAir‑gapped or cross‑account S3 backups for compliance

**Target technologies**
This integration supports the following S3 deployments:
- Supported versions: S3 API v2006-03-01 and all compatible cloud providers
- Supported editions: AWS S3 Standard, Intelligent‑Tiering, Glacier, Glacier Deep Archive
- Unsupported variants: LocalStack S3 < 1.5 and other experimental S3‑like APIs
- System compatibility: Tested on Linux, macOS, and Kubernetes with S3‑compatible endpoints


## Architecture
```
                               Viewer (CLI/UI)
                                   ↑
        S3 ← Source Connector → Kloset Store ←→ Storage Connector → S3
                                   ↓
                     S3 ← Destination Connector → Other S3-compatible resources
```

**This integration provides a full snapshot lifecycle:**
- Extract S3 data as encrypted, deduplicated snapshots
- Store snapshots in a Kloset store, locally or in S3/Glacier
- Browse and verify with the Viewer (CLI or UI)
- Restore to S3 or other S3‑compatible resources when needed

**Components provided**
- **Source Connector:** Extracts data from S3 buckets for backup into a Plakar Kloset store
- **Destination Connector:** Restores snapshots into S3 or other compatible object storage
- **Storage Connector:** Persists Kloset stores in S3 or S3 Glacier for cost‑efficient, secure backups
- **Viewer:** CLI or UI to browse, search, and verify snapshots without full extraction

## Installation

To interact with AWS S3, Plakar uses the native S3 API provided by Amazon.
No additional packages, plugins, or drivers are required.

The S3 connectors are built‑in and available in all Plakar installations.

```bash=
plakar version
plakar/v1.0.3

importers: fs, ftp, s3, sftp   # <-- `s3` is listed here
exporters: fs, ftp, s3, sftp   # <-- And here
klosets: fs, http, https, ptar, s3, sftp, sqlite  # <-- And here
```

This confirms that S3 is fully supported for importing, exporting, and storing Kloset snapshots out of the box.

## Configuring IAM Policies for S3
Plakar can interact with S3 as a **Source Connector**, **Destination Connector**, or **Storage Connector**.

To ensure secure and functional integration, create an IAM policy with the required permissions for your use case.

### Minimal IAM Policy for Source Connector
To snapshot existing S3 buckets into a Plakar Kloset store (`read‑only`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:GetObjectVersion"
      ],
      "Resource": [
        "arn:aws:s3:::my-source-bucket",
        "arn:aws:s3:::my-source-bucket/*"
      ]
    }
  ]
}
```
### IAM Policy for Storage Connector
To persist Plakar Kloset stores directly in S3 (`read/write` + versioning):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetBucketVersioning",
        "s3:PutBucketVersioning"
      ],
      "Resource": [
        "arn:aws:s3:::my-plakar-kloset",
        "arn:aws:s3:::my-plakar-kloset/*"
      ]
    }
  ]
}
```

### IAM Policy for Destination Connector
To restore snapshots to S3 buckets or S3‑compatible destinations (write‑focused):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::my-restore-bucket",
        "arn:aws:s3:::my-restore-bucket/*"
      ]
    }
  ]
}
```
> Use a separate restore bucket or ensure write permissions do not risk overwriting the source Kloset store.

## Setup S3

**This integration provides three types of connectors to interact with S3:**

- **Source Connector:** Extract data from S3 buckets for backup
- **Destination Connector:** Restore snapshots into S3 buckets or S3‑compatible resources
- **Storage Connector:** Persist Plakar snapshots directly inside S3, turning it into a Kloset backend

The configuration is managed using `plakar config` commands, where each parameter is set explicitly.

Depending on your workflow, you can configure S3 as a **source**, **destination**, or **storage connector**.

### Backup & Restore using S3
**Source Connector Configuration**
To back up an S3 bucket as a snapshot:

```bash=
plakar config source create mys3
plakar config source set mys3 type s3
plakar config source set mys3 uri s3://my-source-bucket/
# Optional: set credentials
plakar config source set mys3 access_key <your-access-key>
plakar config source set mys3 secret_access_key <your-secret-key>
```

This enables Plakar to list and read objects from your S3 bucket

### Destination Connector Configuration
**To restore snapshots into an S3 bucket:**
```bash=
plakar config destination create mys3-dest
plakar config destination set mys3-dest type s3
plakar config destination set mys3-dest uri s3://my-restore-bucket/
plakar config destination set mys3-dest access_key <your-access-key>
plakar config destination set mys3-dest secret_access_key <your-secret-key>
```
This allows verified snapshots to be rehydrated directly to S3 or any S3-compatible destination.

### Snapshot: Make a Backup
**Take a snapshot of your configured S3 resource:**

```bash=
# Backup S3 bucket into a local or remote Kloset store
plakar at @mystore backup @mys3

# Backup directly from an S3 URI
plakar at @mystore backup s3://my-source-bucket/
```

Plakar connects to the **bucket**, **streams and chunks objects**, then **deduplicates**, **compresses**, and **encrypts** the data locally before writing to the **Kloset store**.

### Restore a Snapshot
**Restore all or part of a snapshot:**

```bash=
# Restore snapshot to another S3 bucket
plakar at @mystore restore -to s3://my-restore-bucket/ <snapshot-id>

# Restore snapshot to a local folder
plakar at @mystore restore -to /path/to/local/restore <snapshot-id>

# Restore snapshot to another registered S3-compatible resource
plakar at @mystore restore -to @another-s3-compatible <snapshot-id>
```

## Using S3 as a Storage Connector
### Configuration
**Use S3 as the backend for your Kloset store:**

```bash=
plakar config store create mystore
plakar config store set mystore type s3
plakar config store set mystore location s3://my-plakar-kloset/
plakar config store set mystore access_key <your-access-key>
plakar config store set mystore secret_access_key <your-secret-key>
```
This enables you to store snapshots directly in S3, optionally with Glacier tiers for cold storage.

### Kloset Creation and Inspection
**Create a Kloset store:**

```
plakar at @mystore create
```

Verify your Kloset store and snapshots:

```bash=
# List available snapshots
plakar at @mystore ls

# Inspect a file without full restore
plakar at @mystore cat <snapshot-id>:/path/to/file

# Launch the UI viewer
plakar at @mystore ui
```

**The setup makes S3 a complete backup ecosystem:**
It can act as your source of truth, durable storage backend, and restore destination while Plakar handles deduplication, encryption, and versioning automatically.

## Integration-specific behaviors
This section documents behaviors specific to how Plakar interacts with S3, affecting consistency, performance, and compatibility.

### Limitations
**The following S3 components are not included in the snapshot:**
- Bucket configuration beyond basic metadata (e.g., CORS rules, replication settings)
- IAM users, roles, or access policies
- Lifecycle rules or storage class transitions
- CloudWatch metrics or monitoring pipelines
- AWS-specific features like EventBridge notifications or Lambda triggers

**Plakar snapshots include only:**
- Raw objects in the S3 buckets
- Bucket-level metadata (name, creation date, owner ID)

> Note: Deduplication and encryption are applied at the object‑chunk level, so bucket size or object count does not affect snapshot correctness.

### Automation and scheduling
- Plakar can be automated via cron jobs, systemd timers, or CI/CD pipelines
- S3 lifecycle rules can complement Plakar snapshots for long‑term archival (e.g., moving cold data to Glacier)
- No built‑in AWS scheduling is used; Plakar’s snapshot schedule is client‑driven

### Restore behavior specifics
Restores can target local filesystems, S3 buckets, or S3‑compatible destinations

**Recommended practice:**

- Restore to a temporary or namespaced bucket, e.g., `s3://mybucket/restore-preview/`
- Verify snapshot integrity with plakar at `@mystore verify <snapshot-id>`
- Promote restored content to the production bucket after validation

> Tip: If restoring to Glacier or Deep Archive, allow time for object retrieval delays before use.

## Troubleshooting
- Check IAM permissions if you see `AccessDenied` or `403 errors`.
Ensure `s3:ListBucket`, `s3:GetObject`, and `s3:PutObject` are granted.
- Inspect Kloset store if backups or restores fail:

## Appendix

- **Plakar CLI Reference**
    - [Plakar CLI Documentation](https://plakar.io/docs/main/commands/)

- **Plakar Architecture (Kloset Engine)**
    - [Learn how the Kloset Engine works](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)

- **AWS S3 Documentation**
    - [Amazon S3 Developer Guide
](https://docs.aws.amazon.com/)

## FAQ
**Q1: Can I back up multiple S3 buckets at once?**
Yes. Create separate source connectors for each bucket and snapshot them individually.

**Q2: Does Plakar support S3 Glacier or Deep Archive?**
Yes. Snapshots stored in S3 can be lifecycle‑managed to Glacier or Deep Archive, but restores will take longer.

**Q3: Are bucket policies, IAM users, or lifecycle rules backed up?**
No. Only bucket objects and basic metadata (name, owner, creation date) are included.

**Q4: Can I restore snapshots to a different AWS account or region?**
Yes. Configure a destination connector pointing to the new bucket or account.