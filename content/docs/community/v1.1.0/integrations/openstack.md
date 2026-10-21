---
title: "OpenStack"
date: "2026-10-21T00:00:00Z"
weight: 33
summary:
  "Back up and restore OpenStack Nova servers and Cinder volumes with Plakar."
---

# OpenStack

The OpenStack integration backs up Nova servers and Cinder volumes, and restores
them to OpenStack. Restores add to what exists in the cloud rather than
overwriting it: disks come back as new Cinder volumes, and the original server
or volume is never modified.

The integration includes two connectors:

| Connector type            | Description                                                             |
| ------------------------- | ----------------------------------------------------------------------- |
| **Source connector**      | Back up a server or a volume into a Kloset store.                       |
| **Destination connector** | Restore a server or a volume from a Kloset store to an OpenStack cloud. |

Both connectors support two protocols:

| Protocol             | What it backs up                                                     |
| -------------------- | -------------------------------------------------------------------- |
| `openstack-block`    | A single Cinder volume.                                              |
| `openstack-instance` | A Nova server, its root disk and every Cinder volume attached to it. |

**Requirements**

- An OpenStack cloud with a Keystone v3 endpoint reachable from the machine
  running Plakar.
- An application credential, or a username and password, with the rights listed
  in [permissions](#permissions).

## Installation

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the OpenStack package:

```bash
$ plakar pkg add openstack
```

Verify installation:

```bash
$ plakar pkg show
```

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages).

## How backups work

OpenStack exposes the content of a disk through Glance, so every disk a backup
reads is first snapshotted and copied to a temporary Glance image. The temporary
snapshots, volumes and images are deleted once the disk has been read. Disks are
read while they are in use, so a backup is crash-consistent.

Because every disk passes through Glance, it must fit within the Glance image
size limit of the cloud. The limit is 1 TiB by default and can be raised by the
operator of the cloud. Every backup copies the whole disk, so its duration grows
with the size of the disk.

## Authentication

Both protocols authenticate against Keystone, the OpenStack identity service,
with one of two methods:

- **Application credential** (recommended): a credential created for a single
  project with a restricted set of roles. It is bound to that project, so no
  project needs to be set. It can be revoked without affecting the user account
  it was created from.
- **Username and password**: the credentials of an OpenStack user, together with
  the project to work in, identified by its ID or name.

When both are set, the application credential takes precedence.

## Permissions

Both protocols create and delete snapshots, images and volumes in the project,
so the credential needs the `reader` and `member` roles on it. This applies to
the project the server or volume belongs to for a backup, and to the target
project for a restore. See
[Managing Users and Application Credentials](/docs/control-plane/guides/openstack/users-and-application-credentials)
for how to create a user and an application credential with those roles.

Role names depend on how the OpenStack cloud is configured. The `reader` and
`member` roles are default Keystone roles, but some providers define their own.
Consult the documentation of the provider for the equivalent roles.

## 1. `openstack-instance` protocol

The `openstack-instance` protocol backs up a Nova server: its flavor and
networks, its root disk, and every Cinder volume attached to it. The source
`location` selects the server by its ID. The disks are captured one after
another rather than at the same instant, so they can reflect slightly different
points in time.

Servers that boot from a volume are not supported. Their root disk is a Cinder
volume rather than a Nova disk, and the backup refuses them.

A destination restores a server in one of two ways, depending on its `location`:

- **As a new server**, with `openstack-instance://` or
  `openstack-instance://spawn`. Plakar creates a server with the flavor,
  networks and security groups of the backed-up server, and recreates and
  reattaches each volume to its original device when it was recorded.
- **Onto an existing server**, with `openstack-instance://<server-id>`. Every
  backed-up disk, including the root disk, becomes a new Cinder volume attached
  to that server. No server is created.

When restoring as a new server, the flavor and networks are looked up by ID,
then by name if the ID does not exist in the target cloud, for example when
restoring to another project or region. The restore fails if neither matches.
Security groups are attached by name.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph OpenStack["OpenStack Project"]
  Server["Server and<br/>attached volumes"]
  Images["Temporary<br/>Glance images"]
  Server -->|"snapshot"| Images
end

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Images --> Plakar --> Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Transform["Decrypt & reconstruct"]

subgraph OpenStack["OpenStack Project"]
  Images["Temporary<br/>Glance images"]
  Volumes["New volumes"]
  Server["Existing or new<br/>server"]
  Images --> Volumes --> Server
end

Store --> Plakar --> Transform --> Images
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to both source and destination connectors using the
`openstack-instance` protocol.

| Option                                    | Required | Description                                                                                                  |
| ----------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `openstack_auth_url`                      | Yes      | Keystone v3 endpoint, for example `https://keystone.example.com:5000/v3`.                                    |
| `openstack_region`                        | Yes      | A single region. For a source, the region the server runs in. For a destination, the region to restore into. |
| `openstack_application_credential_id`     | No       | Application credential ID. Requires `openstack_application_credential_secret`.                               |
| `openstack_application_credential_secret` | No       | Application credential secret. Requires `openstack_application_credential_id`.                               |
| `openstack_username`                      | No       | Username, for password authentication.                                                                       |
| `openstack_password`                      | No       | Password, for password authentication.                                                                       |
| `openstack_project_id`                    | No       | Project ID, for password authentication. Takes precedence over `openstack_project_name`.                     |
| `openstack_project_name`                  | No       | Project name, for password authentication. Required when `openstack_project_id` is not set.                  |
| `openstack_domain_name`                   | No       | Domain of the user, and of the project when it is given by name. Defaults to `Default`.                      |

Either the application credential or `openstack_username` and
`openstack_password` must be set.

### Source configuration

The following extra options are available on the store connector.

| Option     | Required | Description                                                |
| ---------- | -------- | ---------------------------------------------------------- |
| `location` | Yes      | `openstack-instance://<server-id>`, the server to back up. |

### Destination configuration

The following extra options are available on the destination connector.

| Option     | Required | Description                                                                                                                                                               |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `location` | Yes      | `openstack-instance://` or `openstack-instance://spawn` to create a new server, or `openstack-instance://<server-id>` to attach the restored disks to an existing server. |

### Example

Back up a server:

```bash
$ plakar source add myserver openstack-instance://<server-id> \
  openstack_auth_url=https://keystone.example.com:5000/v3 \
  openstack_application_credential_id=<id> \
  openstack_application_credential_secret=<secret> \
  openstack_region=RegionOne

$ plakar at /var/backups backup "@myserver"
```

Restore a snapshot as a new server:

```bash
$ plakar destination add myserver-restore openstack-instance://spawn \
  openstack_auth_url=https://keystone.example.com:5000/v3 \
  openstack_application_credential_id=<id> \
  openstack_application_credential_secret=<secret> \
  openstack_region=RegionOne

$ plakar at /var/backups restore -to "@myserver-restore" <snapshot_id>
```

## 2. `openstack-block` protocol

The `openstack-block` protocol backs up a single Cinder volume, selected by its
ID in the source `location`.

A destination always restores into a new, detached volume. The new volume takes
the size, volume type, availability zone, description, metadata and name of the
original. The volume type and availability zone must exist in the region the
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
flowchart LR

subgraph OpenStack["OpenStack Project"]
  Volume["Cinder volume"]
  Image["Temporary<br/>Glance image"]
  Volume -->|"snapshot"| Image
end

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Image --> Plakar --> Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Transform["Decrypt & reconstruct"]

subgraph OpenStack["OpenStack Project"]
  Image["Temporary<br/>Glance image"]
  Volume["New detached<br/>volume"]
  Image --> Volume
end

Store --> Plakar --> Transform --> Image
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to both source and destination connectors using the
`openstack-block` protocol.

| Option                                    | Required | Description                                                                                                   |
| ----------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `openstack_auth_url`                      | Yes      | Keystone v3 endpoint, for example `https://keystone.example.com:5000/v3`.                                     |
| `openstack_region`                        | Yes      | A single region. For a source, the region the volume lives in. For a destination, the region to restore into. |
| `openstack_application_credential_id`     | No       | Application credential ID. Requires `openstack_application_credential_secret`.                                |
| `openstack_application_credential_secret` | No       | Application credential secret. Requires `openstack_application_credential_id`.                                |
| `openstack_username`                      | No       | Username, for password authentication.                                                                        |
| `openstack_password`                      | No       | Password, for password authentication.                                                                        |
| `openstack_project_id`                    | No       | Project ID, for password authentication. Takes precedence over `openstack_project_name`.                      |
| `openstack_project_name`                  | No       | Project name, for password authentication. Required when `openstack_project_id` is not set.                   |
| `openstack_domain_name`                   | No       | Domain of the user, and of the project when it is given by name. Defaults to `Default`.                       |

Either the application credential or `openstack_username` and
`openstack_password` must be set.

### Source configuration

The following extra options are available on the source connector.

| Option     | Required | Description                                             |
| ---------- | -------- | ------------------------------------------------------- |
| `location` | Yes      | `openstack-block://<volume-id>`, the volume to back up. |

### Destination configuration

The following extra options are available on the destination connector.

| Option     | Required | Description                                                                              |
| ---------- | -------- | ---------------------------------------------------------------------------------------- |
| `location` | Yes      | `openstack-block://` or `openstack-block://spawn`, both creating a new, detached volume. |

### Example

Back up a volume:

```bash
$ plakar source add myvolume openstack-block://<volume-id> \
  openstack_auth_url=https://keystone.example.com:5000/v3 \
  openstack_application_credential_id=<id> \
  openstack_application_credential_secret=<secret> \
  openstack_region=RegionOne

$ plakar at /var/backups backup "@myvolume"
```

Restore a snapshot as a new volume:

```bash
$ plakar destination add myvolume-restore openstack-block:// \
  openstack_auth_url=https://keystone.example.com:5000/v3 \
  openstack_application_credential_id=<id> \
  openstack_application_credential_secret=<secret> \
  openstack_region=RegionOne

$ plakar at /var/backups restore -to "@myvolume-restore" <snapshot_id>
```

## See also

- [Managing Users and Application Credentials on OpenStack](/docs/control-plane/guides/openstack/users-and-application-credentials)
- [OpenStack inventory in Plakar Control Plane](/docs/control-plane/inventories/managed/openstack)
- [OpenStack Compute in Plakar Control Plane](/docs/control-plane/resources/compute/openstack)
- [OpenStack Block Storage in Plakar Control Plane](/docs/control-plane/resources/block-storage/openstack)
- [Managing packages](../../guides/managing-packages)
