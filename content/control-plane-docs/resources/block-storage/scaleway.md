---
title: "Scaleway Block Storage"
date: "2026-05-19T00:00:00Z"
weight: 1
summary: "How to configure a Scaleway block storage resource in Plakar Control Plane."
---

# Scaleway Block Storage

Scaleway block storage resources represent persistent block volumes managed by
Scaleway. Plakar Control Plane backs up block storages by triggering a Scaleway snapshot export, which saves the volume as a QCOW2 image to a Scaleway Object Storage bucket. Plakar Control Plane then backs up that image into the Kloset store.

A dedicated Scaleway Object Storage bucket is required for this process. Plakar Control Plane uses this bucket as a temporary staging area when exporting block volume snapshots. We recommend creating a bucket specifically for this purpose, as it is also used when backing up other Scaleway resources such as instances.

## Configuration

Scaleway block storage resources can only be configured as a source connector.

### Integration

Automatically set to the Scaleway integration for any resource with `class` Block Storage managed by a Scaleway inventory.

### Access Key and Secret Key

The access key and secret key used to authenticate with Scaleway. See the
documentation on [Managing IAM Policies and API Keys on Scaleway](../../../guides/scaleway/iam-and-api-keys) for instructions on how to set up the permissions and generate an access key and secret key.

### Endpoint

Optional. Hint Plakar Control Plane how to reach the resource in case the endpoint is ambiguous. Plakar Control Plane suggests endpoints discovered from the inventory, for example the block storage UUID `3dcd8901-d213-4ca4-89c5-85ba55a60ff7`.

### Bucket

The Scaleway Object Storage bucket name. Used as a temporary staging area when exporting block storage snapshots. This bucket must exist before configuring the resource. We recommend using a dedicated bucket for Plakar Control Plane operations rather than a general-purpose bucket.

### Project ID

The Scaleway project ID that the block storage belongs to.

### Zone

The Scaleway zone where the block volume storage. Suggested automatically from the inventory e.g. `fr-par-1` .

## Additional configuration

### Source

**Environment**

Optional. The SLA environment covering this source, for example production, staging, or development. See the [policies documentation](../../../operations/policies) for more details.

**Data Class**

Optional. The SLA data class covering this source, for example critical, database, or PII. See the [policies documentation](../../../operations/policies) for more details.

## Permissions

Plakar Control Plane requires a set of IAM permissions on your Scaleway project to access block volumes and the staging Object Storage bucket. These permissions should be attached to an IAM application that Plakar Control Plane will use to authenticate. See the documentation on [Managing IAM Policies and API Keys on Scaleway](../../../guides/scaleway/iam-and-api-keys) for instructions on how to set up the permissions and generate an access key and secret key.

| Permission                  | Description                                                                       |
| --------------------------- | --------------------------------------------------------------------------------- |
| `BlockStorageFullAccess`    | Full access to Block Storage                                                      |
| `ObjectStorageBucketsRead`  | Read access to buckets and bucket configuration including lifecycle rules         |
| `ObjectStorageBucketsWrite` | Access to create and edit buckets, bucket configuration including lifecycle rules |
| `ObjectStorageObjectsRead`  | Read access to objects, tags, metadata and storage class                          |
| `ObjectStorageObjectsWrite` | Access to create and edit objects, tags, metadata and storage class               |
