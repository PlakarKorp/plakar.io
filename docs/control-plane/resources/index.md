

# Resources

Resources are the individual systems, services, or storage targets that Plakar
Control Plane manages as part of a backup workflow. Examples of resources
include S3 buckets, EC2 instances, PostgreSQL databases, virtual machines, and
filesystems.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TB
  subgraph Inventories
    Managed["Managed inventory\n(AWS, Scaleway, ...)"]
    SelfManaged["Self-managed inventory"]
  end

  subgraph Resources
    R["Resource\nclass / subclass"]
  end

  subgraph Apps
    Source["Source\n(Back up content from here)"]
    Store["Store\n(Store backups here)"]
    Destination["Destination\n(Restore here)"]
  end

  Managed -->|"auto-discover"| R
  SelfManaged -->|"manually added"| R
  R --> Source & Store & Destination
{{< /mermaid >}}
<!-- prettier-ignore-end -->

All resources discovered across all inventories are available under
**Infrastructure -> Resources**. From here a resource can be assigned to either
a [source](../apps/sources) or a [destination](../apps/destinations) app. You
can also filter resources by inventories or by resource class.

![](./images/view-resources.png)

## Resource settings

Resource settings can be updated from the **Settings** tab under each resource.
For managed inventories, most settings are read-only since the resource is
managed by the inventory. For self-managed inventories, all settings can be
modified. Backup coverage can be modified for any resource regardless of
inventory type.

Backup coverage tracks how many of your resources are protected by backups. If a
resource does not need to be backed up (for example, a test database), you can
exclude it from coverage using the **Exclude from backup coverage**. Excluded
resources are omitted from protection status and coverage reporting.

![](./images/resource-settings.png)

## Resource classification

Each resource is assigned a `class` and `subclass` that describe what kind of
infrastructure it is.

The `class` describes the general category the resource belongs to, while the
`subclass` identifies the specific implementation or provider. Plakar Control
Plane uses this classification to determine which integrations are compatible
with a resource.

## Supported resources

The following pages document the supported resource types and the configuration
required to use each one as a source, store, or destination.






## [Block Storage](https://www.plakar.io/docs/control-plane/resources/block-storage/index.md)

- [Scaleway Block Storage](https://www.plakar.io/docs/control-plane/resources/block-storage/scaleway/index.md): How to configure a Scaleway block storage resource in Plakar Control Plane.
- [Kubernetes PVC](https://www.plakar.io/docs/control-plane/resources/block-storage/pvc/index.md): How to configure a Kubernetes PersistentVolumeClaim resource in Plakar Control Plane.


## [Compute](https://www.plakar.io/docs/control-plane/resources/compute/index.md)

- [Scaleway Compute](https://www.plakar.io/docs/control-plane/resources/compute/scaleway/index.md): How to configure a Scaleway compute resource in Plakar Control Plane.
- [VMware Compute](https://www.plakar.io/docs/control-plane/resources/compute/vmware/index.md): How to configure a VMware compute resource in Plakar Control Plane.
- [Windows VSS](https://www.plakar.io/docs/control-plane/resources/compute/vss/index.md): How to configure a Volume Shadow Copy Service (VSS) resource in Plakar Control Plane.
- [OVHcloud Compute](https://www.plakar.io/docs/control-plane/resources/compute/ovhcloud/index.md): How to configure an OVHcloud Compute resource in Plakar Control Plane.


## [Database](https://www.plakar.io/docs/control-plane/resources/database/index.md)

- [Microsoft SQL Server](https://www.plakar.io/docs/control-plane/resources/database/mssql/index.md): How to configure a Microsoft SQL Server resource in Plakar Control Plane.
- [MySQL](https://www.plakar.io/docs/control-plane/resources/database/mysql/index.md): How to configure a MySQL resource in Plakar Control Plane.
- [PostgreSQL](https://www.plakar.io/docs/control-plane/resources/database/postgres/index.md): How to configure a PostgreSQL resource in Plakar Control Plane.
- [etcd](https://www.plakar.io/docs/control-plane/resources/database/etcd/index.md): How to configure an etcd resource in Plakar Control Plane.


## [File Storage](https://www.plakar.io/docs/control-plane/resources/file-storage/index.md)

- [SFTP](https://www.plakar.io/docs/control-plane/resources/file-storage/sftp/index.md): How to configure SFTP resource in Plakar Control Plane.
- [FTP](https://www.plakar.io/docs/control-plane/resources/file-storage/ftp/index.md): How to configure an FTP resource in Plakar Control Plane.
- [WebDAV](https://www.plakar.io/docs/control-plane/resources/file-storage/webdav/index.md): How to configure a WebDAV resource in Plakar Control Plane.


## [Hypervisor](https://www.plakar.io/docs/control-plane/resources/hypervisor/index.md)

- [Proxmox](https://www.plakar.io/docs/control-plane/resources/hypervisor/proxmox/index.md): How to configure a Proxmox resource in Plakar Control Plane.


## [Identity](https://www.plakar.io/docs/control-plane/resources/identity/index.md)

- [Microsoft Active Directory](https://www.plakar.io/docs/control-plane/resources/identity/msad/index.md): How to configure a Microsoft Active Directory resource in Plakar Control Plane.


## [Object Storage](https://www.plakar.io/docs/control-plane/resources/object-storage/index.md)

- [S3](https://www.plakar.io/docs/control-plane/resources/object-storage/s3/index.md): How to configure an S3 resource in Plakar Control Plane.
- [Azure Blob Storage](https://www.plakar.io/docs/control-plane/resources/object-storage/azblob/index.md): How to configure an Azure Blob Storage resource in Plakar Control Plane.
- [Google Cloud Storage](https://www.plakar.io/docs/control-plane/resources/object-storage/gcs/index.md): How to configure a Google Cloud Storage resource in Plakar Control Plane.


## [Security](https://www.plakar.io/docs/control-plane/resources/security/index.md)

- [Scaleway Secret Manager](https://www.plakar.io/docs/control-plane/resources/security/scaleway-sm/index.md): How to configure a Scaleway Secret Manager resource in Plakar Control Plane.
- [HashiCorp Vault](https://www.plakar.io/docs/control-plane/resources/security/vault/index.md): How to configure a HashiCorp Vault resource in Plakar Control Plane.


## [Service](https://www.plakar.io/docs/control-plane/resources/service/index.md)

- [IMAP](https://www.plakar.io/docs/control-plane/resources/service/imap/index.md): How to configure an IMAP resource in Plakar Control Plane.
- [Plakar Control Plane](https://www.plakar.io/docs/control-plane/resources/service/pcp/index.md): How to configure a Plakar Control Plane (PCP) resource in Plakar Control Plane.



