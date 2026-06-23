
# Google Cloud Storage

The **Google Cloud Storage integration** enables backup and restoration of GCS
buckets. All bucket contents including objects, metadata, and prefix hierarchies
are captured and stored in a Kloset store with encryption and deduplication.

The Google Cloud Storage integration provides three connectors:

| Connector type            | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| **Source connector**      | Back up GCS buckets into a Kloset store.                 |
| **Storage connector**     | Use Google Cloud Storage as a Kloset store backend.      |
| **Destination connector** | Restore bucket contents from a Kloset store back to GCS. |

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
$ plakar pkg build gcs
```

A package archive will be created in the current directory (e.g.,
`gcs_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add ./gcs_v1.0.0_darwin_arm64.ptar
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

The integration will authenticate automatically when possible, for example if
the `gcloud` CLI is installed and configured locally. Otherwise, credentials can
be provided explicitly. At least one of the following must be provided when
auto-authentication is not available:

- `credentials_file` - path to a service account JSON credentials file
- `credentials_json` - inline service account credentials JSON
- `no_auth=true` for public buckets or testing

### Configuration options

These options apply to all three connectors (source, storage, destination).

| Option             | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| `credentials_file` | Path to a GCP service account JSON credentials file.                  |
| `credentials_json` | Inline GCP service account credentials JSON.                          |
| `endpoint`         | Custom endpoint, for example for local testing or debug environments. |
| `no_auth`          | Disable authentication. Only for public buckets or testing.           |

> [!WARNING]+
>
> Setting `no_auth=true` disables authentication entirely. Only use this for
> public buckets or local testing environments. Never use it in production.

## Source connector

The source connector retrieves objects from GCS buckets and stores them in a
Kloset store with encryption and deduplication.

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

Register the source and run a backup:

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

## Storage connector

The storage connector uses Google Cloud Storage as the backend for a Kloset
store. All Plakar data — snapshots, chunks, metadata — is stored as objects.

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

Register the store, initialize it, and run a backup:

```bash
$ plakar store add my-gcs-store \
  gcs://bucket_name \
  credentials_file=<PATH_TO_CREDENTIALS_FILE>

$ plakar at "@my-gcs-store" create
$ plakar at "@my-gcs-store" backup /var/www
```

## Destination connector

Restores objects from a Kloset store back to a GCS bucket.

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

Register the destination and restore a snapshot:

```bash
$ plakar destination add my-gcs-restore \
  gcs://bucket_name \
  credentials_file=<PATH_TO_CREDENTIALS_FILE>

$ plakar at /var/backups restore -to "@my-gcs-restore" <snapshot_id>
```

## Notes

- GCS object storage is flat; directory structures are simulated using prefixes.
- Empty directories are not preserved unless they contain objects.
- When the `gcloud` CLI is installed and authenticated, no explicit credentials
  are needed.
- When using a custom endpoint for local testing, combine it with `no_auth=true`
  or explicit credentials as appropriate.

