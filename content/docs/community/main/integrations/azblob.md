---
title: "Azure Blob Storage"
date: "2026-06-18T00:00:00Z"
weight: 17
summary: "Back up and restore Azure Blob Storage containers with Plakar."
aliases:
  - /docs/main/integrations/azblob/
---

# Azure Blob Storage

The Azure Blob Storage integration backs up and restores Azure Blob Storage
containers, and can host a Kloset store in a container. A backup captures the
container contents, including blobs, metadata and prefix hierarchies, and stores
them in a Kloset store with encryption and deduplication.

The integration includes three connectors:

| Connector type            | Description                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| **Source connector**      | Back up Azure Blob containers into a Kloset store.                         |
| **Destination connector** | Restore container contents from a Kloset store back to Azure Blob Storage. |
| **Store connector**       | Use Azure Blob Storage as a Kloset store backend.                          |

**Requirements**

- An Azure Storage account, or a local emulator such as Azurite.
- Credentials for that account. See [Authentication](#authentication).

## Installation

The Azure Blob Storage package can be installed using pre-built binaries or
compiled from source.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the Azure Blob Storage package:

```bash
$ plakar pkg add azblob
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
$ plakar pkg build azblob
```

A package archive will be created in the current directory (e.g.,
`azblob_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add -allow-unsigned ./azblob_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## Authentication

Every connector must be given credentials in one of the following forms:

- `connection_string`. This is the recommended form. It takes precedence over
  `account_name` and `account_key`.
- `account_name` and `account_key`.
- `no_auth=true` with a valid `endpoint`.

> [!WARNING]+ No Auth
>
> Setting `no_auth=true` disables authentication entirely. Only use this for
> public containers or local emulator setups such as Azurite. Never use it in
> production.

## Configuration

All three connectors use the `azblob://` protocol. The source connector
retrieves blobs from a container through the Azure Blob API. The destination
connector writes them back to a container. The store connector keeps all Kloset
store data, including snapshots, chunks and metadata, as blobs in a container.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["Azure Blob Container"]
  FS["Blobs"]
end

subgraph Plakar["Plakar"]
  Connector["Retrieve blobs via<br/>Azure Blob API"]
  Transform["Encrypt & deduplicate"]
  Connector --> Transform
end

Source --> Connector

Store["Kloset Store"]
Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

subgraph Plakar["Plakar"]
  Transform["Decrypt & reconstruct"]
  Connector["Restore via<br/>Azure Blob API"]
  Transform --> Connector
end

Store --> Transform

subgraph Destination["Azure Blob Container"]
  FS["Blobs"]
end

Connector --> Destination
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Store flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Sources["Any Source"]
  FS["Data"]
end

subgraph Plakar["Plakar"]
  Transform["Encrypt & deduplicate"]
  Connector["Store via<br/>Azure Blob API"]
  Transform --> Connector
end

Sources --> Transform

subgraph Storage["Azure Blob Container"]
  Store["Kloset Store"]
end

Connector --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to the source, destination and store connectors.

| Option              | Required    | Description                                                                                        |
| ------------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `location`          | Yes         | `azblob://<container_name>`.                                                                       |
| `connection_string` | Conditional | Azure Storage connection string. Takes precedence over account name and key.                       |
| `account_name`      | Conditional | Azure Storage account name. Used with `account_key`.                                               |
| `account_key`       | Conditional | Azure Storage account key. Used with `account_name`.                                               |
| `endpoint`          | Conditional | Custom endpoint, for example Azurite or a non-standard Azure environment. Required with `no_auth`. |
| `no_auth`           | No          | Disable authentication. Only for public containers or testing.                                     |

### Example

Back up a container:

```bash
$ plakar source add my-az-container \
  azblob://container_name \
  connection_string=<YOUR_CONN_STRING>

$ plakar at /var/backups backup "@my-az-container"
```

To back up a specific prefix within a container:

```bash
$ plakar at /var/backups backup "@my-az-container:path"
```

Restore a snapshot to a container:

```bash
$ plakar destination add my-az-restore \
  azblob://container_name \
  connection_string=<YOUR_CONN_STRING>

$ plakar at /var/backups restore -to "@my-az-restore"
```

Host a Kloset store in a container, initialize it and run a backup:

```bash
$ plakar store add my-az-store \
  azblob://container_name \
  connection_string=<YOUR_CONN_STRING>

$ plakar at "@my-az-store" create
$ plakar at "@my-az-store" backup /var/www
```

## Limitations and scope

Azure Blob Storage uses containers instead of buckets. Blob storage is flat, and
directory structures are simulated using prefixes. Empty directories are not
preserved unless they contain blobs.

When using Azurite, provide either a connection string or
`account_name=devstoreaccount1` with a local endpoint.

## See also

- [Creating a Kloset Store](../../guides/create-kloset-repository)
- [Managing packages](../../guides/managing-packages)
