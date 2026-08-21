
# Azure Blob Storage

The **Azure Blob Storage integration** enables backup and restoration of Azure
Blob Storage containers. All container contents including blobs, metadata, and
prefix hierarchies are captured and stored in a Kloset store with encryption and
deduplication.

The Azure Blob Storage integration provides three connectors:

| Connector type            | Description                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| **Source connector**      | Back up Azure Blob containers into a Kloset store.                         |
| **Storage connector**     | Use Azure Blob Storage as a Kloset store backend.                          |
| **Destination connector** | Restore container contents from a Kloset store back to Azure Blob Storage. |

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
$ plakar pkg list
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
$ plakar pkg add ./azblob_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg list
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## Configuration

### Authentication

Authentication can be provided in multiple ways depending on your environment.
At least one of the following must be provided:

- `connection_string` (recommended)
- `account_name` + `account_key`
- `no_auth=true` with a valid `endpoint`

### Configuration options

These options apply to all three connectors (source, storage, destination).

| Option              | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| `account_name`      | Azure Storage account name.                                                  |
| `account_key`       | Azure Storage account key.                                                   |
| `connection_string` | Azure Storage connection string. Takes precedence over account name and key. |
| `endpoint`          | Custom endpoint, for example Azurite or a non-standard Azure environment.    |
| `no_auth`           | Disable authentication. Only for public containers or testing.               |

> [!WARNING]+
>
> No Auth Setting `no_auth=true` disables authentication entirely. Only use this
> for public containers or local emulator setups such as Azurite. Never use it
> in production.

## Source connector

The source connector retrieves blobs from Azure Blob Storage containers and
stores them in a Kloset store with encryption and deduplication.

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

Register the source and run a backup:

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

## Storage connector

The storage connector uses Azure Blob Storage as the backend for a Kloset store.
All Plakar data — snapshots, chunks, metadata — is stored as blobs.

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

Register the store, initialize it, and run a backup:

```bash
$ plakar store add my-az-store \
  azblob://container_name \
  connection_string=<YOUR_CONN_STRING>

$ plakar at "@my-az-store" create
$ plakar at "@my-az-store" backup /var/www
```

## Destination connector

Restores blobs from a Kloset store back to an Azure Blob Storage container.

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

Register the destination and restore a snapshot:

```bash
$ plakar destination add my-az-restore \
  azblob://container_name \
  connection_string=<YOUR_CONN_STRING>

$ plakar at /var/backups restore -to "@my-az-restore"
```

## Notes

- Azure Blob Storage uses containers instead of buckets.
- Blob storage is flat; directory structures are simulated using prefixes.
- Empty directories are not preserved unless they contain blobs.
- When using Azurite, provide either a connection string or
  `account_name=devstoreaccount1` with a local endpoint.

