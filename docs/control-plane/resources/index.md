

# Resources

Resources are the individual systems, services, or storage targets that Plakar Control Plane manages as part of a backup workflow. Examples of resources include S3 buckets, EC2 instances, PostgreSQL databases, virtual machines, and filesystems.

## Resource classification

Each resource is assigned a `class` and `subclass` that describe what kind of infrastructure it is.

The class describes the general category the resource belongs to, while the subclass identifies the specific implementation or provider. Plakar Control Plane uses this classification to determine which integrations are compatible with a resource.

- [Analytics]()
- [Block Storage](./block-storage) - [Scaleway Block Storage](./block-storage/scaleway), [PVC]()
- [Compute](./compute) - [Scaleway Compute](./compute/scaleway)
- [Database]() - [PostgreSQL](), [MySQL](), [MongoDB](), [Redis]()
- [File Storage]()
- [Hypervisor]() - [Proxmox]()
- [Identity]()
- [Messaging]()
- [Network]()
- [Object Storage](./object-storage) - [GCS](), [S3](./object-storage/s3), [Azure Blob]()
- [Observability]()
- [Registry]()
- [Security]()
- [Service]() - [FTP](), [IMAP](), [SFTP]()





## [Object Storage](https://plakar.io/docs/control-plane/resources/object-storage/index.md)

- [S3](https://plakar.io/docs/control-plane/resources/object-storage/s3/index.md): How to configure an S3 resource in Plakar Control Plane.


## [Block Storage](https://plakar.io/docs/control-plane/resources/block-storage/index.md)

- [Scaleway Block Storage](https://plakar.io/docs/control-plane/resources/block-storage/scaleway/index.md): How to configure a Scaleway block storage resource in Plakar Control Plane.


## [Compute](https://plakar.io/docs/control-plane/resources/compute/index.md)

- [Scaleway Compute](https://plakar.io/docs/control-plane/resources/compute/scaleway/index.md): How to configure a Scaleway compute resource in Plakar Control Plane.



