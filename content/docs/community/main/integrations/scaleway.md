---
title: "Scaleway"
date: "2026-09-29T00:00:00Z"
weight: 32
summary:
  "Back up and restore Scaleway instances, block volumes and Secret Manager
  secrets with Plakar."
---

# Scaleway

The Scaleway integration backs up Scaleway Instances, Block Storage volumes and
Secret Manager secrets, and restores them to Scaleway. Restores add to what
exists in Scaleway rather than overwriting it: disks come back as new volumes,
and secret versions come back as new revisions.

The integration includes two connectors:

| Connector type            | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| **Source connector**      | Back up an instance, a block volume or secrets into a Kloset store.             |
| **Destination connector** | Restore an instance, a block volume or secrets from a Kloset store to Scaleway. |

Both connectors support three protocols:

| Protocol            | What it backs up                                     |
| ------------------- | ---------------------------------------------------- |
| `scaleway-instance` | An instance and all the block volumes it uses.       |
| `scaleway-block`    | A single Block Storage volume.                       |
| `scaleway-secret`   | Every Secret Manager secret in a project and region. |

**Requirements**

- A Scaleway project, and an API access key and secret key with the permissions
  listed in [Permissions](#permissions).
- For `scaleway-instance` and `scaleway-block`, a Scaleway Object Storage
  bucket, created beforehand.

## Installation

The Scaleway integration is distributed as a pre-built package only. Unlike most
Community integrations, it has no public source repository, so
`plakar pkg build` cannot produce it. It remains free to install with a Plakar
account. See
[source availability](../../guides/managing-packages/#source-availability) for
how this differs from the other integrations.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the Scaleway package:

```bash
$ plakar pkg add scaleway
```

Verify installation:

```bash
$ plakar pkg show
```

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages).

## How instance and volume backups work

Scaleway exposes the contents of a volume by exporting a snapshot of it as a
QCOW2 image to Object Storage. Plakar triggers that export into the bucket set
with `bucket`, reads the images from there, and stores them in the Kloset store
with encryption and deduplication. The bucket is used as a staging area. A
dedicated bucket keeps these images separate from other data.

## Permissions

The API key used by Plakar must belong to an IAM application with the
permissions below on the project. Each protocol only needs the permissions
listed for it. See
[Managing IAM Policies and API Keys on Scaleway](/docs/control-plane/guides/scaleway/iam-and-api-keys)
for how to create the application, its policy and its keys.

| Permission                   | Protocols                             | Description                                                                        |
| ---------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| `InstancesFullAccess`        | `scaleway-instance`                   | Full access to Instances.                                                          |
| `BlockStorageFullAccess`     | `scaleway-instance`, `scaleway-block` | Full access to Block Storage.                                                      |
| `ObjectStorageBucketsRead`   | `scaleway-instance`, `scaleway-block` | Read access to buckets and bucket configuration including lifecycle rules.         |
| `ObjectStorageBucketsWrite`  | `scaleway-instance`, `scaleway-block` | Access to create and edit buckets, bucket configuration including lifecycle rules. |
| `ObjectStorageObjectsRead`   | `scaleway-instance`, `scaleway-block` | Read access to objects, tags, metadata and storage class.                          |
| `ObjectStorageObjectsWrite`  | `scaleway-instance`, `scaleway-block` | Access to create and edit objects, tags, metadata and storage class.               |
| `SecretManagerReadOnly`      | `scaleway-secret`                     | Read access to secret metadata.                                                    |
| `SecretManagerSecretAccess`  | `scaleway-secret`                     | Read access to secret values.                                                      |
| `SecretManagerSecretCreate`  | `scaleway-secret`                     | Create new secrets.                                                                |
| `SecretManagerSecretWrite`   | `scaleway-secret`                     | Write new secret versions.                                                         |
| `SecretManagerSecretRestore` | `scaleway-secret`                     | Recover secrets or versions on restore.                                            |

## 1. `scaleway-instance` protocol

The `scaleway-instance` protocol backs up an instance together with every block
volume attached to it. The source `location` selects the instance by its server
ID.

A destination restores an instance in one of two ways, depending on its
`location`:

- **Onto an existing instance**, with `scaleway-instance://<server-id>`. Each
  disk in the snapshot, including the original boot disk, becomes a new block
  volume attached to that instance. The instance keeps its own boot volume.
- **As a new instance**, with `scaleway-instance://spawn`. Plakar creates an
  instance from the snapshot, reusing the name, type and boot layout of the
  backed-up instance where available, and starts it.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Scaleway["Scaleway Project"]
  Instance["Instance and<br/>attached volumes"]
  Bucket["Object Storage bucket<br/>QCOW2 images"]
  Instance -->|"snapshot export"| Bucket
end

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Bucket --> Plakar --> Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Transform["Decrypt & reconstruct"]

subgraph Scaleway["Scaleway Project"]
  Bucket["Object Storage bucket<br/>QCOW2 images"]
  Volumes["New volumes"]
  Instance["Existing or new<br/>instance"]
  Bucket --> Volumes --> Instance
end

Store --> Plakar --> Transform --> Bucket
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to both source and destination connectors using the
`scaleway-instance` protocol.

| Option       | Required | Description                                                                    |
| ------------ | -------- | ------------------------------------------------------------------------------ |
| `access_key` | Yes      | Scaleway API access key.                                                       |
| `secret_key` | Yes      | Scaleway API secret key.                                                       |
| `project_id` | Yes      | ID of the Scaleway project, as a UUID.                                         |
| `bucket`     | Yes      | Name of the Object Storage bucket used as a staging area.                      |
| `zone`       | No       | Scaleway zone of the instance, for example `fr-par-1`. Defaults to `fr-par-1`. |

### Source configuration

| Option     | Required | Description                                                 |
| ---------- | -------- | ----------------------------------------------------------- |
| `location` | Yes      | `scaleway-instance://<server-id>`, the instance to back up. |

### Destination configuration

| Option     | Required | Description                                                                                                                                      |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `location` | Yes      | `scaleway-instance://<server-id>` to attach the restored disks to an existing instance, or `scaleway-instance://spawn` to create a new instance. |

### Example

Back up an instance:

```bash
$ plakar source add myinstance scaleway-instance://<server-id> \
  access_key=<access_key> \
  secret_key=<secret_key> \
  project_id=<project_id> \
  bucket=plakar-temp \
  zone=fr-par-1

$ plakar at /var/backups backup "@myinstance"
```

Restore a snapshot as a new instance:

```bash
$ plakar destination add myinstance-restore scaleway-instance://spawn \
  access_key=<access_key> \
  secret_key=<secret_key> \
  project_id=<project_id> \
  bucket=plakar-temp \
  zone=fr-par-1

$ plakar at /var/backups restore -to "@myinstance-restore" <snapshot_id>
```

## 2. `scaleway-block` protocol

The `scaleway-block` protocol backs up a single Block Storage volume, selected
by its ID in the source `location`.

A destination always creates a new volume from the snapshot. Its `location`
decides what happens to that volume:

- `scaleway-block://` leaves the new volume detached.
- `scaleway-block://<instance-id>` attaches the new volume to that instance.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Scaleway["Scaleway Project"]
  Volume["Block volume"]
  Bucket["Object Storage bucket<br/>QCOW2 image"]
  Volume -->|"snapshot export"| Bucket
end

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Bucket --> Plakar --> Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Transform["Decrypt & reconstruct"]

subgraph Scaleway["Scaleway Project"]
  Bucket["Object Storage bucket<br/>QCOW2 image"]
  Volume["New volume<br/>detached or attached"]
  Bucket --> Volume
end

Store --> Plakar --> Transform --> Bucket
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to both source and destination connectors using the
`scaleway-block` protocol.

| Option       | Required | Description                                               |
| ------------ | -------- | --------------------------------------------------------- |
| `access_key` | Yes      | Scaleway API access key.                                  |
| `secret_key` | Yes      | Scaleway API secret key.                                  |
| `project_id` | Yes      | ID of the Scaleway project.                               |
| `bucket`     | Yes      | Name of the Object Storage bucket used as a staging area. |

### Source configuration

| Option     | Required | Description                                            |
| ---------- | -------- | ------------------------------------------------------ |
| `location` | Yes      | `scaleway-block://<volume-id>`, the volume to back up. |
| `zone`     | No       | Zone of the volume. Defaults to `fr-par-1`.            |

### Destination configuration

| Option     | Required | Description                                                                                                                        |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `location` | Yes      | `scaleway-block://` to create a detached volume, or `scaleway-block://<instance-id>` to create a volume attached to that instance. |
| `zone`     | No       | Zone where the volume is created. Defaults to `fr-par-1`.                                                                          |

### Example

Back up a volume:

```bash
$ plakar source add myvolume scaleway-block://<volume-id> \
  access_key=<access_key> \
  secret_key=<secret_key> \
  project_id=<project_id> \
  bucket=plakar-temp \
  zone=fr-par-1

$ plakar at /var/backups backup "@myvolume"
```

Restore a snapshot as a new volume attached to an instance:

```bash
$ plakar destination add myvolume-restore scaleway-block://<instance-id> \
  access_key=<access_key> \
  secret_key=<secret_key> \
  project_id=<project_id> \
  bucket=plakar-temp \
  zone=fr-par-1

$ plakar at /var/backups restore -to "@myvolume-restore" <snapshot_id>
```

## 3. `scaleway-secret` protocol

The `scaleway-secret` protocol backs up every Secret Manager secret in a project
and region, with all of its versions. The status of each version, enabled or
disabled, is kept.

A restore writes the secrets into the project and region set on the destination,
which can differ from the ones they were backed up from. A secret with the same
name and path in the target project is reused, and a missing one is created.
Every backed-up version is then added as a new revision, with its enabled or
disabled status. Existing versions are left untouched, so restoring the same
snapshot twice adds its versions twice.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Scaleway["Scaleway Project"]
  Secrets["Secret Manager<br/>secrets and versions"]
end

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Secrets -->|"Secret Manager API"| Plakar --> Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Transform["Decrypt & reconstruct"]

subgraph Scaleway["Target Scaleway Project"]
  Secrets["Secrets with<br/>new revisions"]
end

Store --> Plakar --> Transform -->|"Secret Manager API"| Secrets
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to both source and destination connectors using the
`scaleway-secret` protocol.

| Option       | Required | Description                                                                                                                              |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `location`   | Yes      | Always `scaleway-secret://`.                                                                                                             |
| `access_key` | Yes      | Scaleway API access key.                                                                                                                 |
| `secret_key` | Yes      | Scaleway API secret key.                                                                                                                 |
| `project_id` | Yes      | ID of the Scaleway project, as a UUID. For a source, the project to back up. For a destination, the project to restore the secrets into. |
| `region`     | No       | Region of the secrets. Defaults to `fr-par`.                                                                                             |

### Example

Back up the secrets of a project:

```bash
$ plakar source add mysecrets scaleway-secret:// \
  access_key=<access_key> \
  secret_key=<secret_key> \
  project_id=<project_id> \
  region=fr-par

$ plakar at /var/backups backup "@mysecrets"
```

Restore them into another project:

```bash
$ plakar destination add mysecrets-restore scaleway-secret:// \
  access_key=<access_key> \
  secret_key=<secret_key> \
  project_id=<target_project_id> \
  region=fr-par

$ plakar at /var/backups restore -to "@mysecrets-restore" <snapshot_id>
```

## See also

- [Managing IAM Policies and API Keys on Scaleway](/docs/control-plane/guides/scaleway/iam-and-api-keys)
- [Scaleway Compute in Plakar Control Plane](/docs/control-plane/resources/compute/scaleway)
- [Scaleway Block Storage in Plakar Control Plane](/docs/control-plane/resources/block-storage/scaleway)
- [Scaleway Secret Manager in Plakar Control Plane](/docs/control-plane/resources/security/scaleway-sm)
- [Managing packages](../../guides/managing-packages)
