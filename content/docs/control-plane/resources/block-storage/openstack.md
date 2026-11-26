---
title: "OpenStack Block Storage"
date: "2026-10-21T00:00:00Z"
weight: 3
summary:
  "How to configure an OpenStack Cinder volume resource in Plakar Control Plane."
---

# OpenStack Block Storage

OpenStack Block Storage resources represent Cinder volumes, backed up and
restored through the `openstack-block` protocol of the OpenStack integration.
Plakar Control Plane backs up a volume by snapshotting it and reading its disk,
and restores a backup into a new Cinder volume. The original volume is never
modified by a restore.

## Inventory Management

[Managed inventories](../../inventories#managed-inventories) can discover Cinder
volumes automatically once the
[OpenStack inventory](../../inventories/managed/openstack) is connected to a
project. The inventory discovers volumes in every region the credentials can
reach. The [OVHcloud inventory](../../inventories/managed/ovhcloud) also
discovers the volumes of OVHcloud Public Cloud projects, which run on OpenStack,
and you back them up with the same apps. OpenStack Block Storage resources
cannot be set up by a self-managed inventory.

## Backup and restore

A backup snapshots the volume and reads its disk from a temporary volume created
from the snapshot, without detaching the original. A volume in use is backed up
crash-consistent. The disk is read through an attachment or through Glance, as
described in [transfer modes](#transfer-modes).

A restore creates a new, detached volume with the size, volume type,
availability zone and metadata of the original. Existing volumes are never
overwritten. The volume type and availability zone must exist in the region the
volume is restored to.

> [!WARNING]+ Encrypted volumes
>
> Cinder ties encryption to the volume type, and a restore uses the volume type
> with the same name as the original. If that name refers to an unencrypted type
> in the target cloud, the volume is restored unencrypted.
>
> The keys of encrypted volumes are held by Barbican, the OpenStack key manager,
> and are not part of the backup. Keep a copy of them outside the cloud. A
> restored encrypted volume cannot be decrypted by a cloud that does not have
> the matching keys.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph OpenStack["OpenStack Project"]
    Volume["Cinder volume"]
    Snapshot["Cinder snapshot"]
    Temp["Temporary volume"]
    Image["Glance image"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["OpenStack Block Storage<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"uses OpenStack APIs"| Volume
  Volume --> Snapshot
  Snapshot --> Temp
  Temp -->|"attach"| Backup
  Temp -->|"glance"| Image
  Image -->|"read disk"| Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["OpenStack Block Storage<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph OpenStack["OpenStack Project"]
    Image["Temporary Glance image"]
    Volume["New Cinder volume<br/>(detached)"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"attach"| Volume
  Restore -->|"glance: upload disk"| Image
  Image --> Volume
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Transfer modes

A disk moves between Cinder and Plakar Control Plane in one of two ways:

- **Attachment**: the volume is attached to the machine running the job, which
  must be a Nova server in the same cloud, project and region, and read or
  written there as a block device. Nothing goes through Glance.
- **Glance**: the disk is copied through a temporary Glance image. The volume
  must fit within the Glance image size limit of the cloud. The limit is 1 TiB
  by default but it can be raised by the operator of the cloud.

The **Openstack Transfer** option sets which one is used. `auto`, the default,
uses attachment when the job can, and Glance otherwise or when the attachment
fails. `attach` uses attachment only, and the job fails when it is not possible.
`glance` always uses Glance.

A backup taken through an attachment stores the disk raw, and a backup taken
through Glance stores it as qcow2. Only a raw disk can be restored through an
attachment. A qcow2 disk is restored through Glance, and a destination app set
to `attach` fails on it.

## Running OpenStack tasks on an edge

To use attachment, tasks must run on an [edge](../../../edges) whose hosts are
Nova servers in the same cloud, project and region as the volumes. The user
running the edge must be root or in the `disk` group, so it can read and write
block devices. Then assign the OpenStack resources to that pool, so their tasks
run on those edges. See
[selecting an edge](../../../edges/running-tasks#selecting-an-edge).

## Shared configuration

The following settings are available when configuring both source and
destination apps.

- **Openstack Auth Url**: Required. The Keystone v3 endpoint, for example
  `https://keystone.example.com:5000/v3`. For OVHcloud Public Cloud, use
  `https://auth.cloud.ovh.net/v3`.
- **Openstack Region**: Required. A single region. For a source app, the region
  the volume lives in. For a destination app, the region the volume is restored
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
- **Openstack Transfer**: How the disk moves between Cinder and Plakar Control
  Plane, one of `auto`, `attach` or `glance`. Defaults to `auto`. See
  [transfer modes](#transfer-modes).

## Permissions

Backing up and restoring volumes creates and deletes snapshots, images and
volumes in the project, so the credentials need the `reader` and `member` roles
on it. See
[Managing Users and Application Credentials](../../../guides/openstack/users-and-application-credentials)
for how to create a user and an application credential with those roles.

Role names depend on how the OpenStack cloud is configured. The `reader` and
`member` roles are default Keystone roles, but some providers define their own.
Consult the documentation of the provider for the equivalent roles.
