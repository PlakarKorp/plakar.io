
# Scaleway Compute

Scaleway Compute resources represent virtual machine instances managed by
Scaleway, backed up and restored through the `scaleway-instance` protocol of the
Scaleway integration. Plakar Control Plane backs up an instance by exporting it
and all its attached block volumes as QCOW2 images to a Scaleway Object Storage
bucket, then backs up those images into the Kloset store.

During restore, Plakar Control Plane uploads the QCOW2 images back to the
bucket, then creates a new block volume from each one, including the source
instance's boot disk, and attaches them to the destination instance. Restoring
does not create a new instance. The destination app must point at an existing
Scaleway Compute instance, and restored disks are added to it as additional
attached volumes rather than replacing its own boot volume.

A dedicated Scaleway Object Storage bucket is required for this process. We
recommend using the same dedicated bucket used for other Scaleway resources such
as block storage.

## Inventory Management

[Managed inventories](../../infrastructure/inventories#managed-inventories) can
discover Scaleway Compute instances automatically once connected to your
Scaleway project. Scaleway Compute resources are only discovered by the
[Scaleway inventory](../../infrastructure/inventories/scaleway) and cannot be
setup by a self-managed inventory.

#### Backup flow

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

#### Restore flow

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
    Instance["Existing Compute Instance"]
    Volumes["New Block Volumes"]
  end

  Store --> Restore
  Destination --> Restore

  Restore -->|"uploads QCOW2 images"| Bucket
  Bucket --> Images

  Images -->|"creates volume <br/> from each disk"| Volumes
  Volumes -->|"attach"| Instance
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared Configuration

The following settings are available when configuring both source and
destination apps.

- **Access Key**: Required. The access key used to authenticate with Scaleway.
  See the documentation on
  [Managing IAM Policies and API Keys on Scaleway](../../../guides/scaleway/iam-and-api-keys)
  for instructions on how to set up the permissions and generate an access key
  and secret key.
- **Secret Key**: Required. The secret key used to authenticate with Scaleway.
- **Bucket**: Required. The Scaleway Object Storage bucket name, used as a
  staging area when exporting and restoring instance and block volume images.
  This bucket must exist before configuring the resource. We recommend using a
  dedicated bucket for Plakar Control Plane operations rather than a
  general-purpose bucket.

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

