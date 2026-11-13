
# Google Cloud Storage

The Google Cloud Storage integration backs up and restores GCS buckets, and can
host a Kloset store in a bucket. A backup captures the bucket contents,
including objects, metadata and prefix hierarchies, and stores them in a Kloset
store with encryption and deduplication.

The integration includes three connectors:

| Connector type            | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| **Source connector**      | Back up GCS buckets into a Kloset store.                 |
| **Destination connector** | Restore bucket contents from a Kloset store back to GCS. |
| **Store connector**       | Use Google Cloud Storage as a Kloset store backend.      |

**Requirements**

- A GCS bucket, or a custom endpoint for local testing.
- Credentials for that bucket, unless they are detected automatically. See
  [Authentication](#authentication).

## Installation

The Google Cloud Storage package can be installed using pre-built binaries or
compiled from source.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the Google Cloud Storage package:

```bash
$ plakar pkg add gcs
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
$ plakar pkg build gcs
```

A package archive will be created in the current directory (e.g.,
`gcs_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add -allow-unsigned ./gcs_v1.0.0_darwin_arm64.ptar
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

The integration authenticates automatically when possible. For example, when the
`gcloud` CLI is installed and authenticated locally, no explicit credentials are
needed. When automatic authentication is not available, provide one of the
following:

- `credentials_file`, the path to a service account JSON credentials file.
- `credentials_json`, inline service account credentials JSON.
- `no_auth=true`, for public buckets or testing.

When using a custom endpoint for local testing, combine it with `no_auth=true`
or explicit credentials as appropriate.

> [!WARNING]+ No Auth
>
> Setting `no_auth=true` disables authentication entirely. Only use this for
> public buckets or local testing environments. Never use it in production.

## Configuration

All three connectors use the `gcs://` protocol. The source connector retrieves
objects from a bucket through the GCS API. The destination connector writes them
back to a bucket. The store connector keeps all Kloset store data, including
snapshots, chunks and metadata, as objects in a bucket.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["GCS Bucket"]
  FS["Objects"]
end

subgraph Plakar["Plakar"]
  Connector["Retrieve objects via<br/>GCS API"]
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
  Connector["Restore via<br/>GCS API"]
  Transform --> Connector
end

Store --> Transform

subgraph Destination["GCS Bucket"]
  FS["Objects"]
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
  Connector["Store via<br/>GCS API"]
  Transform --> Connector
end

Sources --> Transform

subgraph Storage["GCS Bucket"]
  Store["Kloset Store"]
end

Connector --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to the source, destination and store connectors.

| Option             | Required    | Description                                                           |
| ------------------ | ----------- | --------------------------------------------------------------------- |
| `location`         | Yes         | `gcs://<bucket_name>`.                                                |
| `credentials_file` | Conditional | Path to a GCP service account JSON credentials file.                  |
| `credentials_json` | Conditional | Inline GCP service account credentials JSON.                          |
| `endpoint`         | No          | Custom endpoint, for example for local testing or debug environments. |
| `no_auth`          | No          | Disable authentication. Only for public buckets or testing.           |

Credentials are required only when automatic authentication is not available.
See [Authentication](#authentication).

### Example

Back up a bucket:

```bash
$ plakar source add my-gcs-bucket \
  gcs://bucket_name \
  credentials_file=<PATH_TO_CREDENTIALS_FILE>

$ plakar at /var/backups backup "@my-gcs-bucket"
```

To back up a specific prefix within a bucket:

```bash
$ plakar at /var/backups backup "@my-gcs-bucket:path"
```

Restore a snapshot to a bucket:

```bash
$ plakar destination add my-gcs-restore \
  gcs://bucket_name \
  credentials_file=<PATH_TO_CREDENTIALS_FILE>

$ plakar at /var/backups restore -to "@my-gcs-restore" <snapshot_id>
```

Host a Kloset store in a bucket, initialize it and run a backup:

```bash
$ plakar store add my-gcs-store \
  gcs://bucket_name \
  credentials_file=<PATH_TO_CREDENTIALS_FILE>

$ plakar at "@my-gcs-store" create
$ plakar at "@my-gcs-store" backup /var/www
```

## Limitations and scope

GCS object storage is flat, and directory structures are simulated using
prefixes. Empty directories are not preserved unless they contain objects.

## See also

- [Creating a Kloset Store](../../guides/create-kloset-repository)
- [Managing packages](../../guides/managing-packages)

