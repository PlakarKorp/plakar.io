
# Scaleway Block Storage

Scaleway block storage resources represent persistent block volumes managed by
Scaleway. Plakar Control Plane backs up block storages by triggering a Scaleway
snapshot export, which saves the volume as a QCOW2 image to a Scaleway Object
Storage bucket, then backs up that image into the Kloset store. Scaleway Block
Storage resources currently support backup only; restoring a block volume is not
available.

A dedicated Scaleway Object Storage bucket is required for this process. We
recommend creating a bucket specifically for this purpose, as it is also used
when backing up other Scaleway resources such as instances.

## Inventory Management

[Managed inventories](../../infrastructure/inventories#managed-inventories) can
discover Scaleway Block Storage volumes automatically once connected to your
Scaleway project. Scaleway Block Storage resources are only discovered by the
[Scaleway inventory](../../infrastructure/inventories/scaleway) and cannot be
setup by a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Scaleway["Scaleway Project"]
    Volume["Block Storage Volume"]
    Snapshot["Snapshot Export<br/>QCOW2 image"]

    subgraph Bucket["Object Storage Bucket<br/>Temporary staging area"]
      Image["Exported QCOW2 image"]
    end
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["Scaleway Block Storage<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"uses Scaleway API"| Volume
  Volume --> Snapshot
  Snapshot --> Image

  Image -->|"read from staging bucket"| Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Source Configuration

The following settings are available when configuring a source app.

- **Access Key**: Required. The access key used to authenticate with Scaleway.
  See the documentation on
  [Managing IAM Policies and API Keys on Scaleway](../../../guides/scaleway/iam-and-api-keys)
  for instructions on how to set up the permissions and generate an access key
  and secret key.
- **Secret Key**: Required. The secret key used to authenticate with Scaleway.
- **Bucket**: Required. The Scaleway Object Storage bucket name, used as a
  temporary staging area when exporting block storage snapshots. This bucket
  must exist before configuring the resource. We recommend using a dedicated
  bucket for Plakar Control Plane operations rather than a general-purpose
  bucket.

## Permissions

Plakar Control Plane requires a set of IAM permissions on your Scaleway project
to access block volumes and the staging Object Storage bucket. These permissions
should be attached to an IAM application that Plakar Control Plane will use to
authenticate. See the documentation on
[Managing IAM Policies and API Keys on Scaleway](../../../guides/scaleway/iam-and-api-keys)
for instructions on how to set up the permissions and generate an access key and
secret key.

| Permission                  | Description                                                                       |
| --------------------------- | --------------------------------------------------------------------------------- |
| `BlockStorageFullAccess`    | Full access to Block Storage                                                      |
| `ObjectStorageBucketsRead`  | Read access to buckets and bucket configuration including lifecycle rules         |
| `ObjectStorageBucketsWrite` | Access to create and edit buckets, bucket configuration including lifecycle rules |
| `ObjectStorageObjectsRead`  | Read access to objects, tags, metadata and storage class                          |
| `ObjectStorageObjectsWrite` | Access to create and edit objects, tags, metadata and storage class               |

