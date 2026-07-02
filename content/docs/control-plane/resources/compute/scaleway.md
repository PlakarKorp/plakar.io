---
title: "Scaleway Compute"
date: "2026-05-19T00:00:00Z"
weight: 1
summary: "How to configure a Scaleway compute resource in Plakar Control Plane."
aliases:
  - /control-plane-docs/resources/compute/scaleway/
---

# Scaleway Compute

Scaleway compute resources represent virtual machine instances managed by
Scaleway. Plakar Control Plane backs up instances by exporting the instance and
all attached block volumes as QCOW2 images to a Scaleway Object Storage bucket.
Plakar Control Plane then backs up those images into the Kloset store.

During restore, Plakar Control Plane uploads the QCOW2 images back to the
bucket, uses them to restore the instance snapshot, and recreates and attaches
the block volumes to the instance.

A dedicated Scaleway Object Storage bucket is required for this process. We
recommend using the same dedicated bucket used for other Scaleway resources such
as block storage.

## Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Scaleway["Scaleway Project"]
    Instance["Compute Instance"]
    Volumes["Attached Block Volumes"]

    Bucket["Object Storage Bucket<br/>Staging area"]
    Images["Exported QCOW2 images"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["Scaleway Compute<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"exports instance <br> and volumes"| Instance
  Instance --> Volumes
  Instance -->|"QCOW2 export"| Images
  Volumes -->|"QCOW2 export"| Images

  Images --> Bucket
  Bucket -->|"read exported images"| Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["Scaleway Compute<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Scaleway["Scaleway Project"]
    Bucket["Object Storage Bucket<br/>Staging area"]
    Images["Uploaded QCOW2 images"]
    Instance["Restored Compute Instance"]
    Volumes["Recreated Block Volumes"]
  end

  Store --> Restore
  Destination --> Restore

  Restore -->|"uploads QCOW2 images"| Bucket
  Bucket --> Images

  Images -->|"restore instance snapshot"| Instance
  Images -->|"recreate volumes"| Volumes
  Volumes -->|"attach"| Instance
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Configuration

Scaleway compute resources can be configured using a source or destination app.

### Integration

Set to the Scaleway integration. Must be selected manually.

### Protocol

The Scaleway integration supports three protocols. Select `scaleway-instance`
for compute resources. The `scaleway-block` protocol is used for block storage
resources and `scaleway-secret` for the Scaleway secrets manager.

### Access Key and Secret Key

The access key and secret key used to authenticate with Scaleway. See the
documentation on
[Managing IAM Policies and API Keys on Scaleway](../../../guides/scaleway/iam-and-api-keys)
for instructions on how to set up the permissions and generate an access key and
secret key.

### Hostname

Optional. Hint Plakar Control Plane how to reach the resource in case the
hostname is ambiguous. Plakar Control Plane suggests hostnames discovered from
the inventory. Select the hostname corresponding to the UUID of the instance,
for example `136336b9-7de6-4b4a-b196-86f814c99848`.

### Bucket

The Scaleway Object Storage bucket name. Used as a staging area when exporting
instance and block volume snapshots. This bucket must exist before configuring
the resource. We recommend using a dedicated bucket for Plakar Control Plane
operations rather than a general-purpose bucket.

## Additional configuration

### Source

**Environment**

Optional. The SLA environment covering this source, for example production,
staging, or development. See the
[policies documentation](../../../operations/policies) for more details.

**Data Class**

Optional. The SLA data class covering this source, for example critical,
database, or PII. See the [policies documentation](../../../operations/policies)
for more details.

## Permissions

Plakar Control Plane requires a set of IAM permissions on your Scaleway project
to access instances, block volumes, and the staging Object Storage bucket. These
permissions should be attached to an IAM application that Plakar Control Plane
will use to authenticate. See the documentation on
[Managing IAM Policies and API Keys on Scaleway](../../../guides/scaleway/iam-and-api-keys)
for instructions on how to set up the permissions and generate an access key and
secret key.

| Permission                  | Description                                                                       |
| --------------------------- | --------------------------------------------------------------------------------- |
| `InstancesFullAccess`       | Full access to Instances                                                          |
| `BlockStorageFullAccess`    | Full access to Block Storage                                                      |
| `ObjectStorageBucketsRead`  | Read access to buckets and bucket configuration including lifecycle rules         |
| `ObjectStorageBucketsWrite` | Access to create and edit buckets, bucket configuration including lifecycle rules |
| `ObjectStorageObjectsRead`  | Read access to objects, tags, metadata and storage class                          |
| `ObjectStorageObjectsWrite` | Access to create and edit objects, tags, metadata and storage class               |
