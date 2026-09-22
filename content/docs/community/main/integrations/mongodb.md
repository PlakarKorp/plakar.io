---
title: "MongoDB"
date: "2026-09-22T00:00:00Z"
weight: 30
summary: "Back up and restore MongoDB databases with Plakar."
---

# MongoDB

The **MongoDB integration** exports the contents of a MongoDB server into a
Kloset store with encryption and deduplication, and restores them back to a
server. It drives the MongoDB command line utilities rather than reading the
data files directly, so a backup is a logical dump of a running server.

The MongoDB integration provides two connectors:

| Connector type            | Description                                       |
| ------------------------- | ------------------------------------------------- |
| **Source connector**      | Back up a MongoDB server into a Kloset store.     |
| **Destination connector** | Restore data from a Kloset store back to MongoDB. |

**Requirements**

- `mongosh`, `mongodump`, and `mongorestore` available in `$PATH`.

## Installation

The MongoDB package can be installed using pre-built binaries or compiled from
source.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the MongoDB package:

```bash
$ plakar pkg add mongodb
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< tab label="Building from source" >}}

Source builds are useful when pre-built packages are unavailable or when
customization is required.

**Prerequisites:**

- Go toolchain compatible with your **Plakar** version

Build the package:

```bash
$ plakar pkg build mongodb
```

A package archive will be created in the current directory (e.g.,
`mongodb_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add -allow-unsigned ./mongodb_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## Configuration

These options apply to both connectors.

| Option     | Required | Description                                              |
| ---------- | -------- | -------------------------------------------------------- |
| `location` | Yes      | URL of the MongoDB server. Must begin with `mongodb://`. |
| `port`     | No       | The MongoDB server port. Defaults to `27017`.            |
| `username` | No       | Username for authentication to MongoDB.                  |
| `password` | No       | Password for authentication to MongoDB.                  |
| `use_tls`  | No       | Use an encrypted TLS/SSL connection. Defaults to `true`. |

## Source connector

The source connector dumps the contents of the MongoDB server with `mongodump`
and stores the result in a Kloset store with encryption and deduplication.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["MongoDB Server"]
  FS["Databases"]
end

subgraph Plakar["Plakar"]
  Connector["Export via<br/>mongodump"]
  Transform["Encrypt & deduplicate"]
  Connector --> Transform
end

Source --> Connector

Store["Kloset Store"]
Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

Register the source and run a backup:

```bash
$ plakar source add my-mongodb \
  location=mongodb://<MONGODB_HOST> \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups backup "@my-mongodb"
```

## Destination connector

Restores data from a Kloset store back to a MongoDB server with `mongorestore`.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

subgraph Plakar["Plakar"]
  Transform["Decrypt & reconstruct"]
  Connector["Import via<br/>mongorestore"]
  Transform --> Connector
end

Store --> Transform

subgraph Destination["MongoDB Server"]
  FS["Databases"]
end

Connector --> Destination
{{< /mermaid >}}
<!-- prettier-ignore-end -->

Register the destination and restore a snapshot:

```bash
$ plakar destination add my-mongodb-restore \
  location=mongodb://<MONGODB_HOST> \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups restore -to "@my-mongodb-restore" <snapshot_id>
```
