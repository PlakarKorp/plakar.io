---
title: AWS S3 Integration documentation
description: Use AWS S3 as a storage connector for your Kloset repositories and Plakar backups.
technology_description: This integration connects your Kloset repository to an AWS S3 bucket, enabling remote storage, retrieval, and backup using the Plakar CLI.
categories: 
- integrations
tags:
- aws
- s3
- storage
stage: "beta"
date: 2025-07-28
---

## Introduction

> **Requirements**
> - **Plakar version:** 1.0.3 or later 
> - **Integration version:** 1.0.0 
> - **Access rights:** 
> - IAM user with:
    - `s3:GetObject`, `s3:ListBucket` permissions for
    - **Source Connector** `s3:PutObject` permission for **Destination** and **Storage Connectors**

The AWS S3 integration lets you snapshot and restore your Amazon S3 buckets using Plakar’s Kloset store. It minimizes storage usage through deduplication and strong encryption.

You can persist snapshots directly to S3 with the Storage Connector and use Plakar's Integrated Viewer to inspect and restore snapshots without needing a full extraction.

## Architecture


The integration connects Plakar with Amazon S3 in the following ways:

- **Source Connector**: Plakar reads data from an S3 bucket and snapshots it into a Kloset repository.
- **Destination Connector**: Plakar restores snapshots from the Kloset back into your S3 bucket.
- **Storage Connector**: You can use S3 itself as the physical backend to store the Kloset repository.
- **Viewer**: Snapshots stored in S3 can be browsed and selectively restored using the Integrated Viewer.

## Installation
Plakar requires no additional packages to interact with AWS S3. The S3-compatible connectors are bundled by default starting from version 1.0.3.

### Configure IAM Permissions in AWS

> Minimum Read-Only Access (for Source Connector):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::mybucket",
        "arn:aws:s3:::mybucket/*"
      ]
    }
  ]
}
```

> Read & Write Access (for Destination or Storage Connector):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::mybucket",
        "arn:aws:s3:::mybucket/*"
      ]
    }
  ]
}
```
To enable Plakar to interact with your Amazon S3 bucket, create an IAM user or role with the appropriate permissions.

You can assign policies using the AWS Console, CLI, or Infrastructure as Code tools (e.g., Terraform or CloudFormation).

## Configuration

### Source Connector

> TLS is enabled by default for AWS. Only disable `use_tls` if you're using a local testing S3-compatible endpoint.

```bash
plakar config s3_src create s3_src
plakar config s3_src set s3_src type s3
plakar config s3_src set s3_src uri s3://your-source-bucket-name
plakar config s3_src set s3_src access_key YOUR_AWS_ACCESS_KEY_ID
plakar config s3_src set s3_src secret_access_key YOUR_AWS_SECRET_ACCESS_KEY
plakar config s3_src set s3_src use_tls true
```

This declares your Amazon S3 bucket as a source connector. It allows Plakar to read data from the specified bucket useful for backing up existing S3 content into Plakar.

### Destination Connector

> You’ll need `s3:PutObject` permissions for this.

```bash
plakar config s3_dest create s3_dest
plakar config s3_dest set s3_dest type s3
plakar config s3_dest set s3_dest uri s3://your-destination-bucket
plakar config s3_dest set s3_dest access_key YOUR_AWS_ACCESS_KEY_ID
plakar config s3_dest set s3_dest secret_access_key YOUR_AWS_SECRET_ACCESS_KEY
plakar config s3_dest set s3_dest use_tls true
```

This enables restoring snapshots directly into an S3 bucket, using the destination connector.

### Storage Connector

> Make sure this bucket is not used for other tools or manual uploads, as Plakar manages structure and consistency internally.

```bash
plakar config s3_store create s3_store
plakar config s3_store set s3_store type s3
plakar config s3_store set s3_store location s3://your-kloset-bucket-name
plakar config s3_store set s3_store access_key YOUR_AWS_ACCESS_KEY_ID
plakar config s3_store set s3_store secret_access_key YOUR_AWS_SECRET_ACCESS_KEY
plakar config s3_store set s3_store use_tls true
```

This sets up your S3 bucket as the Kloset backend the long-term storage location for all your Plakar-managed snapshot data.

## Usage

### Snapshot: Make a Backup

```
plakar at @s3_store backup @s3_src
```

> This command triggers a snapshot of the contents of the configured S3 source bucket.

Create a snapshot from the AWS S3 Source Connector and store it in the Kloset Store bucket.

Plakar uses a Source Connector to:

- List all objects in the bucket using the S3 API,
- Stream their content securely,
- Break them into content-addressed chunks,
- Deduplicate, compress, and encrypt chunks on the fly,
- Write them immutably to the Kloset backend (s3_store).

The resulting snapshot includes:

- The object hierarchy (keys and prefixes) reconstructed as a virtual filesystem,
- Full metadata (timestamps, size, content type, etc.),
- A manifest pointing to all stored chunks verifiable, immutable, and self-describing.

> Snapshotting is stateless. Plakar reuses unchanged chunks and only stores new or modified data — thanks to global deduplication.

### Inspection

```
plakar at @s3_store ls
```
List available snapshots in your S3-based Kloset store:

```
plakar at @s3_store cat <snapshot-id>:/path/to/file
```
Preview the content of a file in a snapshot:

```bash
plakar at @s3_store ui
```
Open the web-based snapshot viewer:

The UI and CLI let you explore your snapshots as if they were regular file systems including nested folders, metadata, and file previews.

### Restore


```
plakar at @s3_store restore -to @s3_dest <snapshot-id>
```
Restore a snapshot directly into another S3 bucket:

```
plakar at @s3_store restore -to ./restore <snapshot-id>
```
Restore to your local filesystem:


Plakar allows flexible restores:

- Back into other AWS S3 buckets (same region or cross-region),
- Into MinIO or any S3-compatible store,
- Or directly into local disk as files and folders.

### Use AWS S3 as a Storage Backend (Kloset)

```bash
plakar at s3://your-bucket-name/plakar-kloset create
```
To initialize a new Plakar store directly in an S3 bucket:

```bash
plakar config s3_store create s3_store
plakar config s3_store set s3_store type s3
plakar config s3_store set s3_store location s3://your-bucket-name/plakar-kloset
plakar config s3_store set s3_store use_tls true
```
Then declare an alias:

```bash
plakar at @s3_store ls
plakar at @s3_store backup /etc
plakar at @s3_store restore -to ./restored <snapshot-id>
```
Once set up, use the store like any other:


Plakar treats your AWS S3 bucket as a passive, durable backend. It requires no server-side agents just access to the bucket.

This allows you to:
- Use AWS S3 for long-term, immutable backup storage,
- Keep the system self-contained (source, destination, and Kloset in AWS),
- Leverage S3 durability (11 nines) and lifecycle management (e.g., Glacier tiering).

## AWS S3 Integration-Specific Behaviors

Plakar uses the official S3 API to interact with AWS S3 buckets for source, destination, and storage roles. While the integration is highly compatible, some AWS-specific behaviors and limitations are important to note.

### Snapshot Scope & Limitations

Plakar focuses on capturing verifiable user data and object metadata. However, it does not preserve certain S3 features that live outside the object storage layer.

**Not included in the snapshot:**

- Bucket policies and IAM permissions:
Plakar does not capture IAM roles, bucket policies, or permission grants. These are AWS-side configurations and must be manually restored or reassigned.
- S3 Lifecycle rules:
Lifecycle configurations, such as automatic object expiration, tier transitions (e.g., S3 → Glacier), or deletion after a period are not included in the snapshot. If such rules exist, they must be reapplied after a restore.
- Server-Side Encryption (SSE) settings:
While Plakar encrypts all data independently, any SSE configuration (SSE-S3, SSE-KMS, SSE-C) used at the bucket or object level is not preserved. You must reapply encryption settings after restore if needed.
- Event notifications and triggers:
S3 bucket events (e.g., trigger a Lambda on upload) are not included in the snapshot metadata.

### What Is Captured

Despite the above limitations, Plakar captures and preserves the core of your data:
- All bucket objects:
Every object in the source bucket regardless of size, prefix, or storage class is fully backed up and stored in your Plakar Kloset.
- Essential object metadata:
Plakar extracts standard metadata to support accurate restores:
- Object key (name/path)
- Last modified timestamp
- Content length
- Content type (MIME)
- ETag (checksum)
- User-defined metadata (`x-amz-meta-*` headers)
- Data consistency at snapshot time:
Objects are streamed directly and atomically from S3, ensuring that you capture the exact state at the moment of backup.

### Behavior with S3-Specific Features

- Versioned buckets:
Plakar does not currently support capturing multiple versions of an object. It will back up only the most recent version unless otherwise specified.

- Object Lock & Compliance Mode:
Plakar can read locked objects but cannot overwrite or delete them. Restoring data to Object Lock–enabled buckets may result in permission errors unless handled manually.

- Storage classes:
Plakar can read from all standard storage classes (STANDARD, INTELLIGENT_TIERING, etc.). However, objects in Glacier or Deep Archive must be restored via S3 first (they cannot be accessed directly).

- Signed URLs / Pre-Signed Access:
Plakar uses access keys to interact with S3 directly. Signed URLs or temporary credentials (e.g., STS) are not currently supported.

### AWS Account & Region Awareness

```bash
plakar config aws_src set aws_src uri s3://mybucket
plakar config aws_src set aws_src region us-west-2
```
> If you use VPC Endpoints or PrivateLink, make sure the S3 bucket is reachable from the host running Plakar.

Plakar is region-agnostic, but when using region-specific endpoints (e.g., `s3.us-west-2.amazonaws.com`), ensure that your configuration matches:


## Compatibility with S3-Standard Storage Classes

The integration supports backing up objects from the following S3 storage classes:
- Standard
- Intelligent-Tiering
- Standard-IA
- One Zone-IA

Objects in Glacier, Glacier Deep Archive, or Reduced Redundancy Storage are not reliably backed up unless first restored to Standard or IA class. These should be excluded or transitioned before snapshotting.

## Appendix

Additional references and resources for working with Plakar and Amazon S3:

- [Plakar CLI Reference](https://www.plakar.io/docs/main/)
- [Plakar Architecture: Kloset Engine](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)
- [Amazon S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS IAM Policy Reference](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)

## Frequently Asked Questions

**Does Plakar support S3 Glacier or Deep Archive?**
Not directly. Objects in Glacier or Deep Archive must be restored to Standard or IA before snapshotting.
Plakar does not automatically trigger retrieval requests for archived objects.

**Can I browse S3 snapshots without restoring them?**
Yes. Plakar provides an Integrated Viewer:

**Does Plakar support server-side encryption (SSE-S3 or SSE-KMS)?**
*Plakar encrypts all snapshots independently.*
While you can store snapshots in buckets with SSE enabled, Plakar does not preserve SSE settings in the backup or automatically reapply them on restore.