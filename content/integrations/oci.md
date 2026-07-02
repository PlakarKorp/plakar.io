---
title: OCI Registry

subtitle:
  Store encrypted, deduplicated backups in any OCI-compliant container registry

description: >
  Use your existing container registry infrastructure to store Plakar backups.
  Plakar encodes repository data as native OCI artifacts, giving you immutable,
  encrypted snapshots with registry-native replication and access controls.

technology_title: Your OCI container registry can do more than store images

technology_description: >
  OCI registries are already the backbone of modern software distribution,
  trusted to store and replicate container images, Helm charts, and signed
  artifacts across cloud regions and air-gapped environments. Plakar extends
  this infrastructure to backup storage, encoding repository data as native OCI
  artifacts. This means your backups benefit from the same immutability
  guarantees, geo-replication, and access controls already in place for your
  container workloads with no additional storage infrastructure to manage.

categories:
  - storage connector

tags:
  - Object Storage
  - OCI
  - Docker
  - Containers
  - AWS ECR
  - Google Artifact Registry
  - Azure Container Registry
  - GitHub Container Registry
  - Harbor

seo_tags:
  - OCI registry backup
  - container registry backup
  - immutable backup storage
  - OCI artifact storage
  - air-gapped backup
  - encrypted backup
  - deduplication
  - disaster recovery
  - cloud-native backup

technical_documentation_link: /docs/community/main/integrations/oci/

stage: beta

date: 2026-06-18

resource: OCI

resource_type: object-storage

image: img/integrations/oci.png
---

## Why using an OCI registry for backup storage makes sense

Modern infrastructure teams already operate OCI registries as critical,
highly-available systems. Extending that infrastructure to backup storage
eliminates operational overhead while inheriting properties that are difficult
to replicate elsewhere:

- **Immutability**: Many registries support content-addressable, immutable
  layers by default. Once written, backup data cannot be silently overwritten.
- **Built-in replication**: Registry geo-replication and mirroring distribute
  backup data across regions without additional configuration.
- **Unified access control**: Existing IAM roles, robot accounts, and token
  policies apply to backup storage without new credential systems.
- **Air-gapped friendly**: Registries communicate over standard HTTPS and are
  already permitted in most firewalled and air-gapped environments.

## What happens when backup storage is coupled to your primary infrastructure

Storing backups in the same system they are meant to protect defeats the purpose
of having a backup. OCI registries offer a natural separation point:

- **Isolated namespaces**: Backup data lives in a dedicated repository, separate
  from container images and application artifacts.
- **Independent credentials**: Registry robot accounts can be scoped to backup
  repositories only, limiting blast radius if credentials are compromised.
- **Cross-provider portability**: Any OCI-compliant registry works, so backups
  can be stored with a different cloud provider than your primary workloads.

## How Plakar uses OCI registries as a backup backend

Plakar encodes all repository data that is snapshots, packfiles, indexes, and
metadata as native OCI artifacts and pushes them to any compliant registry:

- **Storage Connector**: Initialize a Kloset store directly in an OCI registry
  and back up any source (file systems, databases, containers, or cloud storage)
  into it.

Backed by Plakar's encryption and deduplication pipeline, every snapshot stored
in the registry is encrypted end-to-end and deduplicated globally before being
written. The registry never sees plaintext data.

Compatible registries include Docker Hub, Amazon ECR, Google Artifact Registry,
Azure Container Registry, GitHub Container Registry, and self-hosted
implementations such as Harbor.
