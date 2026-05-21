---
title: "Resources"
date: "2026-05-19T00:00:00Z"
weight: 4
summary: ""
---

# Resources

Resources are the individual systems, services, or storage targets that Plakar Control Plane manages as part of a backup workflow. Examples of resources include S3 buckets, EC2 instances, PostgreSQL databases, virtual machines, and filesystems.

## Resource classification

Each resource is assigned a `class` and `subclass` that describe what kind of infrastructure it is.

The class describes the general category the resource belongs to, while the subclass identifies the specific implementation or provider. Plakar Control Plane uses this classification to determine which integrations are compatible with a resource.

* [Analytics]()
* [Block Storage]() - [PVC]()
* [Compute]()
* [Database]() - [PostgreSQL](), [MySQL](), [MongoDB](), [Redis]()
* [File Storage]()
* [Hypervisor]() - [Proxmox]()
* [Identity]()
* [Messaging]()
* [Network]()
* [Object Storage](./object-storage) - [GCS](), [S3](), [Azure Blob]()
* [Observability]()
* [Registry]()
* [Security]()
* [Service]() - [FTP](), [IMAP](), [SFTP]()
