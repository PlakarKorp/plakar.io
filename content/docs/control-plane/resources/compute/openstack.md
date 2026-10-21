---
title: "OpenStack Compute"
date: "2026-10-21T00:00:00Z"
weight: 4
summary:
  "How to configure an OpenStack Nova server resource in Plakar Control Plane."
---

# OpenStack Compute

OpenStack Compute resources represent Nova servers, backed up and restored
through the `openstack-instance` protocol of the OpenStack integration. A backup
holds the server's flavor and networks, its root disk, and every Cinder volume
attached to it. A restore recreates the disks as new Cinder volumes, so the
original disks are never modified.

## Inventory Management

[Managed inventories](../../inventories#managed-inventories) can discover Nova
servers automatically once the
[OpenStack inventory](../../inventories/managed/openstack) is connected to a
project. OpenStack Compute resources are only discovered by the
[OpenStack inventory](../../inventories/managed/openstack) and cannot be set up
by a self-managed inventory.

## Backup and restore

A backup snapshots the root disk and each attached volume, and copies them
through Glance without stopping the server. The disks are captured one after
another rather than at the same instant, so they can reflect slightly different
points in time. Every disk must fit within the Glance image size limit of the
cloud. The limit is 1 TiB by default but it can be raised by the operator of the
cloud.

Servers that boot from a volume are not supported. Their root disk is a Cinder
volume rather than a Nova disk, and the backup refuses them.

A restore onto an existing server creates a new Cinder volume for every
backed-up disk, including the root disk, and attaches them to that server. No
server is created, and the disks already attached to the server are left as they
are.

> [!NOTE]
>
> Restoring onto an existing server is currently the only restore mode available
> in Plakar Control Plane. This is a limitation of the Plakar Control Plane
> interface only, and support for creating a new server is planned for an
> upcoming release. The OpenStack integration itself can already create a new
> server from a backup, with the flavor, networks and security groups of the
> backed-up server, and reattach each restored volume to it. Until the interface
> supports it, this restore mode is available through the
> [Community integration](/docs/community/main/integrations/openstack/).

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph OpenStack["OpenStack Project"]
    Server["Nova server"]
    Volumes["Attached Cinder volumes"]
    Images["Glance images"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["OpenStack Compute<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"uses OpenStack APIs"| Server
  Server --> Volumes
  Server -->|"root disk snapshot"| Images
  Volumes -->|"volume snapshots"| Images
  Images -->|"read disks"| Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["OpenStack Compute<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph OpenStack["OpenStack Project"]
    Images["Temporary Glance images"]
    Volumes["New Cinder volumes"]
    Server["Existing Nova server"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"upload disks"| Images
  Images -->|"create volume<br/>from each disk"| Volumes
  Volumes -->|"attach"| Server
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared configuration

The following settings are available when configuring both source and
destination apps.

- **Openstack Auth Url**: Required. The Keystone v3 endpoint, for example
  `https://keystone.example.com:5000/v3`.
- **Openstack Region**: Required. A single region. For a source app, the region
  the server runs in. For a destination app, the region the server is restored
  to.
- **Openstack Application Credential Id** and **Openstack Application Credential
  Secret**: The application credential to authenticate with. Both are required
  together, and they take precedence over a username and password.
- **Openstack Username** and **Openstack Password**: The credentials of an
  OpenStack user, used when no application credential is set.
- **Openstack Project Id**: The project to authenticate to with a username and
  password. Takes precedence over the project name.
- **Openstack Project Name**: The project to authenticate to when no project ID
  is set.
- **Openstack Domain Name**: The domain of the user, and of the project when it
  is given by name. Defaults to `Default`.

## Permissions

_TODO_
