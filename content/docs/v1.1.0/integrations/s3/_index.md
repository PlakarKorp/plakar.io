---
title: S3
summary: Back up and restore S3 buckets with Plakar.
date: "2026-02-06T00:00:00Z"
---

The **S3 integration** enables backup and restoration of S3 buckets through S3-compatible APIs. All bucket contents—including objects, metadata, and folder hierarchies—are captured and stored in a Kloset store with encryption and deduplication.

The S3 integration provides three connectors:

| Connector type               | Description |
| ---------------------------- | ----------- |
| ✅ **Source connector**      | Back up S3 buckets into a Kloset store. |
| ✅ **Storage connector**     | Use S3-compatible storage as a Kloset store backend. |
| ✅ **Destination connector** | Restore bucket contents from a Kloset store back to S3. |

## Installation

The S3 package can be installed using pre-built binaries or compiled from source.

{{< tabs name="Installation Methods" >}}
{{% tab name="Pre-built package" %}}
Pre-compiled packages are available for common platforms and provide the simplest installation method.

**Note:** Pre-built packages require Plakar authentication. See [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the S3 package:
```bash
$ plakar pkg add s3
```

Verify installation:
```bash
$ plakar pkg list
```
{{< /tab >}}

{{% tab name="Building from source" %}}
Source builds are useful when pre-built packages are unavailable or when customization is required.

**Prerequisites:**
* Go toolchain compatible with your **Plakar** version

Build the package:
```bash
$ plakar pkg build s3
```

A package archive will be created in the current directory (e.g., `s3_v1.0.0_darwin_arm64.ptar`).

Install the package:
```bash
$ plakar pkg add ./s3_v1.0.0_darwin_arm64.ptar
```

Verify installation:
```bash
$ plakar pkg list
```
{{< /tab >}}

{{% tab name="Reinstalling or upgrading" %}}
Check if the S3 package is installed:
```bash
$ plakar pkg list
```

To upgrade to the latest available version, remove the existing package and reinstall it:
```bash
$ plakar pkg rm s3
$ plakar pkg add s3
```

Existing configurations (stores, sources, destinations) are preserved during upgrade.
{{< /tab >}}
{{< /tabs >}}

## Source connector

The source connector retrieves objects from S3 buckets and stores them in a Kloset store with encryption and deduplication.

{{< mermaid >}}
flowchart LR

subgraph Source[<b>S3 Bucket</b>]
  fs@{ shape: cloud, label: "Objects" }
end

subgraph Plakar[<b>Plakar</b>]
  Connector@{ shape: rect, label: "<small>Retrieve objects via</small><br><b>S3 API</b>" }
  Transform@{ shape: rect, label: "<small>Encrypt & deduplicate</small>" }

  Connector --> Transform
end

Source --> Connector

Store@{ shape: cyl, label: "Kloset Store" }

Transform --> Store

%% Apply classes
class Source sourceBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

### Configuration

Create an S3 source configuration:

```bash
plakar source add my-s3-bucket \
  location=s3://<S3_ENDPOINT>/<BUCKET_NAME> \
  access_key=<YOUR_ACCESS_KEY_ID> \
  secret_access_key=<YOUR_SECRET_ACCESS_KEY> \
  use_tls=true
```

Back up the bucket to a Kloset store:
```bash
plakar at /var/backups backup "@my-s3-bucket"
```

If you don't want to be prompted for a passphrase interactively (for example, when running automated backups), you can configure the passphrase directly in the store configuration:
```bash
plakar source add my-s3-bucket \
  location=s3://<S3_ENDPOINT>/<BUCKET_NAME> \
  access_key=<YOUR_ACCESS_KEY_ID> \
  secret_access_key=<YOUR_SECRET_ACCESS_KEY> \
  passphrase='<YOUR_ENCRYPTION_PASSPHRASE>' \
  use_tls=true
```

### Configuration options

| Option              | Required | Description |
| ------------------- | -------- | ----------- |
| `location`          | Yes      | S3 endpoint and bucket including region (format: `s3://s3.region.amazonaws.com/bucket`) |
| `access_key`        | Yes      | S3 Access Key ID |
| `secret_access_key` | Yes      | S3 Secret Access Key |
| `passphrase`        | No       | Encryption passphrase (if not set, Plakar will prompt interactively) |
| `use_tls`           | No       | Enable TLS encryption for secure data transfer (recommended: `true` for internet connections) |
| `tls_insecure_no_verify`| No   | Skips TLS certificate verification. It's set to `false` by default (**see warning below**) |

{{% notice style="warning" title="TLS Certificate Verification" expanded="true" %}}
The `tls_insecure_no_verify` parameter disables TLS certificate verification and should **only be used in controlled testing environments**.

When set to `true`, Plakar won't validate TLS certificates when connecting over HTTPS. This makes your connection vulnerable to man-in-the-middle attacks where an attacker could intercept, read, or modify your backup data.
```bash
plakar store add my-internal-s3 \
  location=s3://internal-minio.company.local/backups \
  access_key=<YOUR_ACCESS_KEY_ID> \
  secret_access_key=<YOUR_SECRET_ACCESS_KEY> \
  use_tls=true \
  tls_insecure_no_verify=true
```

**Only use this when:**
- Connecting to internal S3-compatible services with self-signed certificates in a trusted network
- You fully understand the security implications

**Never use this when:**
- Connecting to AWS S3 or any public cloud storage
- Transferring data over the internet or untrusted networks
- Handling production or sensitive data

For production environments, always use valid TLS certificates instead of disabling verification.
{{% /notice %}}

## Storage connector

The storage connector uses S3-compatible storage as the backend for a Kloset store. All Plakar data—snapshots, chunks, metadata—is stored as S3 objects.

{{< mermaid >}}
flowchart LR

subgraph Sources[<b>Any Source</b>]
  fs@{ shape: cloud, label: "Data" }
end

subgraph Plakar[<b>Plakar</b>]
  Transform@{ shape: rect, label: "<small>Encrypt & deduplicate</small>" }
  Connector@{ shape: rect, label: "<small>Store via</small><br><b>S3 API</b>" }

  Transform --> Connector
end

Sources --> Transform

subgraph Storage[<b>S3 Storage</b>]
  Store@{ shape: cyl, label: "Kloset Store" }
end

Connector --> Store

%% Apply classes
class Sources sourceBox
class Plakar brandBox
class Storage,Store storeBox

%% Classes definitions
classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

Create an S3 storage configuration:

```bash
plakar store add my-s3-store \
  location=s3://<S3_ENDPOINT>/<BUCKET_NAME> \
  access_key=<YOUR_ACCESS_KEY_ID> \
  secret_access_key=<YOUR_SECRET_ACCESS_KEY> \
  use_tls=true
```

Initialize the Kloset store:
```bash
plakar at "@my-s3-store" create
```

Back up data from any source:
```bash
plakar at "@my-s3-store" backup /var/www
```

## Destination connector

The destination connector restores objects from a Kloset store back to an S3 bucket.

{{< mermaid >}}
flowchart LR

Store@{ shape: cyl, label: "Kloset Store" }

subgraph Plakar[<b>Plakar</b>]
  Transform@{ shape: rect, label: "<small>Decrypt & reconstruct</small>" }
  Connector@{ shape: rect, label: "<small>Restore via</small><br><b>S3 API</b>" }

  Transform --> Connector
end

Store --> Transform

subgraph Destination[<b>S3 Bucket</b>]
  fs@{ shape: cloud, label: "Objects" }
end

Connector --> Destination

%% Apply classes
class Destination destinationBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef destinationBox fill:#d0fae5,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

### Configuration

Create an S3 destination configuration:

```bash
plakar destination add my-s3-restore \
  location=s3://<S3_ENDPOINT>/<BUCKET_NAME> \
  access_key=<YOUR_ACCESS_KEY_ID> \
  secret_access_key=<YOUR_SECRET_ACCESS_KEY> \
  use_tls=true
```

Restore a snapshot:
```bash
plakar at /var/backups restore -to "@my-s3-restore" <snapshot_id>
```
