---
title: Scaleway integration package
description: Backup and restore your Scaleway Object Storage buckets with Plakar; secure, portable, and deduplicated.
technology_description: This integration uses the S3-compatible API of Scaleway Object Storage to extract and restore bucket contents into a Kloset store.
categories:
- integrations
tags:
- scaleway
- s3-compatible
- object storage
- cloud backup
- disaster recovery
- encryption
- deduplication
- immutable storage
- snapshot
stage: stable
date: 2025-08-04
plakar_version: 1.0.2 or later
integration_version: 1.0.0
resource_type: object-storage
provides:
- source-connector
- destination-connector
- storage-connector
- viewer
---
This documentation assumes Plakar v1.0.2 is installed.

If you are running a newer version, the commands differ slightly as some of the **configuration commands have changed in v1.0.3**. Check the Changelog of v1.0.3 to adapt the commands accordingly.

## Introduction

Plakar’s built-in **Scaleway Object Storage integration** includes three connectors:

* **Storage connector**: to host a Kloset store in a Scaleway Object Storage bucket.
* **Source connector**: to back up any Scaleway Object Storage bucket into an existing Kloset store.
* **Destination connector**: to restore from any Kloset store into a Scaleway Object Storage bucket.

**Use-cases for this integration**

* **Host a Kloset store in a Scaleway bucket**, and use it to back up your local filesystem, remote servers, databases, or any other data source supported by Plakar.
* **Back up a Scaleway bucket** to any Kloset store for example, a store on the local filesystem, on a remote SFTP server, or even in another Scaleway bucket.
* **Restore a snapshot from a Kloset store into a Scaleway bucket** (e.g., to recover data or migrate data into Scaleway Object Storage).

**Compatibility**

- This integration is built-in in Plakar and available in all versions. No extra package installation is needed.
- All regions of Scaleway Object Storage (e.g. `nl-ams`, `fr-par`) are supported via their S3-compatible endpoints.

## Installation

To interact with Scaleway Object Storage, Plakar uses the S3-compatible API that Scaleway provides. This support is available natively in Plakar.

No additional packages or plugins are required.

> The `s3` connectors are built-in, and are always available in your Plakar installation

```bash
plakar version
plakar/v1.0.2

importers: fs, ftp, s3, sftp   # <-- `s3` is listed here
exporters: fs, ftp, s3, sftp   # <-- And here
klosets:  fs, http, https, ptar, s3, sftp, sqlite   # <-- And here
```
## Configure IAM permissions in Scaleway

Scaleway supports fine-grained access control using IAM policies and bucket policies. You can assign least-privilege access to users or service accounts using one of the following methods:

### Option 1: Using CLI and API

This is the most common and scriptable method. You can:

* **Create a dedicated IAM user or application** via the Scaleway CLI or API (or console) and generate an API key for it. Assign the minimal **Object Storage** permission set required (for example, use a read-only permission set if you only need to back up, or full access if you also need to restore or host backups).
* **Define a bucket policy** in JSON format to restrict access to a specific bucket and actions.
* **Apply the bucket policy** using the AWS CLI (configured to use Scaleway’s S3 endpoint) so that the IAM user/application is limited to that bucket.

**policy.json:**

```json
{
  "Version": "2023-04-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "SCW": "user_id:<USER_ID>"
      },
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["myscw-bucket", "myscw-bucket/*"]
    }
  ]
}
```

Apply the bucket policy to `myscw-bucket`:

```bash
aws s3api put-bucket-policy --bucket myscw-bucket --policy file://policy.json \
  --endpoint-url https://s3.nl-ams.scw.cloud
```

### Option 2: Using the Scaleway Console (Web UI)

If you prefer a graphical interface, you can:

* **Create a new IAM User or Application** in the Scaleway console under the Identity & Access Management section. Generate an API key and attach a policy with the appropriate Object Storage permissions.
* **Attach a bucket policy** to your Object Storage bucket via the console.
* **Review and manage access** through the Scaleway console.

**Permissions to grant:**

* **Read-only access**: `s3:ListBucket`, `s3:GetObject`
* **Read-write access**: `s3:ListBucket`, `s3:GetObject`, `s3:PutObject`, optionally `s3:CreateBucket`

## Storage connector

The **storage connector** allows you to host a Kloset store in a Scaleway Object Storage bucket.

This is useful if you want to use Scaleway’s durable cloud storage as the backend for storing Plakar snapshots.

> Host a Kloset store in a Scaleway bucket

### Configuration

Use the commands plakar `config repository create <name>` and `plakar config repository set <name> <option> <value>` to configure a Scaleway bucket as a Kloset store (repository).

> Configure Plakar to use Scaleway to host a Kloset store

```bash
plakar config repository create scw_store
plakar config repository set scw_store location s3://s3.nl-ams.scw.cloud/myscw-bucket
plakar config repository set scw_store access_key <SCW_ACCESS_KEY_ID>
plakar config repository set scw_store secret_access_key <SCW_SECRET_KEY>
plakar config repository set scw_store use_tls false  # Only if using non-TLS endpoint
```

**Options:**

| Option              | Description                                       |
| ------------------- | ------------------------------------------------- |
| `location`          | `s3://<hostname>/<bucket>` with Scaleway endpoint |
| `access_key`        | Scaleway API key Access Key ID                    |
| `secret_access_key` | Scaleway API key Secret Access Key                |
| `use_tls`           | Default `true`                                    |
| `storage_class`     | `STANDARD`                                        |


Once configured, you can refer to this repository in Plakar commands using the syntax `plakar at @scw_store`.

## Use your Kloset store hosted on Scaleway
Once the repository is configured, you can use the Kloset store hosted in Scaleway like any other Plakar Kloset store.
> Use the Kloset store hosted in Scaleway like any other Kloset store

```bash
# Initialize a new Kloset store in the Scaleway bucket
plakar at @scw_store create

# List all snapshots in the Kloset store
plakar at @scw_store ls

# Back up a local folder to the Kloset store
plakar at @scw_store backup /etc

# Back up any other source connector to this Kloset store
plakar at @scw_store backup @myconnector

# Restore a file from a snapshot in the Kloset store
plakar at @scw_store restore <snapshot_id>:/path/to/file

# Launch the web UI to browse the Kloset store
plakar at @scw_store ui
```

## Source connector

The source connector allows you to create a snapshot of a Scaleway Object Storage bucket and store it in a Kloset repository.

The target Kloset store for the backup can be hosted on any backend supported by Plakar (filesystem, SFTP, another S3 service, etc.), including another Scaleway bucket.

> Back up a Scaleway bucket to a Kloset store

### Configuration

Use the commands `plakar config remote create <name>` and `plakar config remote set <name> <option> <value>` to configure a Scaleway bucket as a source for backups.

> Configure the source connector to back up a Scaleway bucket

```bash
plakar config remote create scw_src
plakar config remote set scw_src location s3://s3.nl-ams.scw.cloud/myscw-bucket
plakar config remote set scw_src access_key <SCW_ACCESS_KEY_ID>
plakar config remote set scw_src secret_access_key <SCW_SECRET_KEY>
plakar config remote set scw_src use_tls false  # Only if using non-TLS endpoint
```

### Configuration options
The configuration options for the source connector are the same as those of the storage connector. See the Storage connector section for details on each option.

## Back up a Scaleway bucket
To back up a Scaleway Object Storage bucket into a Kloset store, use the syntax: `plakar at <store> backup @scw_src`.

Create a local Kloset store on the filesystem, and back up a configured Scaleway bucket into it

```bash
# Initialize a new Kloset store on the local filesystem
plakar at ./my-store create

# Run the backup, assuming @scw_src is configured as above
plakar at ./my-store backup @scw_src

# (Alternatively, if you configured a named repository for the destination, e.g. @mystore)
plakar at @mystore backup @scw_src
```

## Destination connector

The destination connector allows you to restore data from a Kloset store into a Scaleway Object Storage bucket.

The Kloset store containing the snapshot can be located anywhere (local disk, SFTP server, cloud bucket, etc.), including another Scaleway bucket or any S3-compatible storage.

> Restore a snapshot to a Scaleway bucket

### Configuration

Use `plakar config remote create <name>` and `plakar config remote set <name> <option> <value>` to configure a Scaleway bucket as a destination for restores.

> Configure the destination connector to restore into a Scaleway bucket

```bash
plakar config remote create scw_dst
plakar config remote set scw_dst location s3://s3.nl-ams.scw.cloud/myscw-bucket
plakar config remote set scw_dst access_key <SCW_ACCESS_KEY_ID>
plakar config remote set scw_dst secret_access_key <SCW_SECRET_KEY>
# Only if connecting to a non-TLS endpoint (not applicable for Scaleway’s cloud service)
plakar config remote set scw_dst use_tls false
```


## Restore

To restore a snapshot from a Kloset store into a Scaleway bucket, use `plakar at <store> restore -to @scw_dst <snapshot-id>`.

Restore a snapshot from a Kloset store into a Scaleway bucketTo restore a snapshot from a Kloset store into a Scaleway bucket, use `plakar at <store> restore -to @scw_dst <snapshot-id>`.

> Restore a snapshot from a Kloset store into a Scaleway bucket

```bash
plakar at ./my-store restore -to @scw_dst <snapshot-id>
plakar at @mystore restore -to @scw_dst <snapshot-id>
```


## Limitations & considerations

* Use **rich syntax** (`@<name>`) to reference connectors.
* Bucket configuration (IAM policies, lifecycle rules, SSE) is not backed up.
* No point-in-time consistency guarantee; quiesce writes during backup for consistency.


## Troubleshooting

* **403/401**: Check API keys, TLS settings, and IAM/bucket policy permissions.
* View current config: `plakar config`

## FAQ

* **Multiple object versions?** Only latest object version is backed up.
* **Cross-provider restore?** Yes, to any S3-compatible service.
* **Export to .ptar**:

```bash
plakar ptar -o ./export.ptar -k @scw_store
```

* **Restore from .ptar**:

```bash
plakar at ./export.ptar restore -to @scw_dst
```