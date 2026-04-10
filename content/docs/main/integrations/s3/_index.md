---
title: S3
summary: Back up and restore S3 buckets with Plakar.
date: "2026-02-06T00:00:00Z"
aliases:
  - /docs/main/guides/how-to-backup-a-s3-bucket
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
{{< /tabs >}}

To list, upgrade, or remove the package, see [managing packages guide](../../guides/managing-packages/).

## Configuration

### Addressing styles

S3-compatible services use one of two addressing styles for buckets.

**Path-style** (default) — the bucket name is part of the URL path:
```
s3://<S3_ENDPOINT>/<BUCKET_NAME>
```

**Virtual-hosted-style** — the bucket name is part of the hostname. Required by some services that do not support path-style access (such as AWS S3 in certain regions):
```
s3://<BUCKET_NAME>.<S3_ENDPOINT>
```

Set `virtual_host=true` when using virtual-hosted-style addressing.

### Configuration options

These options apply to all three connectors (source, storage, destination).

| Option                   | Required | Description |
| ------------------------ | -------- | ----------- |
| `location`               | Yes      | S3 endpoint and bucket. See [Addressing styles](#addressing-styles) above. |
| `access_key`             | Yes      | S3 Access Key ID. |
| `secret_access_key`      | Yes      | S3 Secret Access Key. |
| `passphrase`             | No       | Encryption passphrase. If not set, Plakar will prompt interactively. Source connector only. |
| `use_tls`                | No       | Enable TLS. Recommended for all internet-facing connections. |
| `virtual_host`           | No       | Use virtual-hosted-style addressing. Defaults to `false`. |
| `tls_insecure_no_verify` | No       | Skip TLS certificate verification. Defaults to `false`. See warning below. |

{{% notice style="warning" title="TLS Certificate Verification" expanded="true" %}}
Setting `tls_insecure_no_verify=true` disables TLS certificate verification, leaving your connection open to man-in-the-middle attacks. Only use this in controlled environments with self-signed certificates on trusted networks. Never use it with AWS S3, public cloud storage, or any production data.
{{% /notice %}}

---

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

classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px
class Source sourceBox
class Plakar brandBox
class Store storeBox
linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

Register the source and run a backup:

```bash
plakar source add my-s3-bucket \
  location=s3://<S3_ENDPOINT>/<BUCKET_NAME> \
  access_key=<YOUR_ACCESS_KEY_ID> \
  secret_access_key=<YOUR_SECRET_ACCESS_KEY> \
  use_tls=true

plakar at /var/backups backup "@my-s3-bucket"
```

---

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

classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px
class Sources sourceBox
class Plakar brandBox
class Storage,Store storeBox
linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

Register the store, initialize it, and run a backup:

```bash
plakar store add my-s3-store \
  location=s3://<S3_ENDPOINT>/<BUCKET_NAME> \
  access_key=<YOUR_ACCESS_KEY_ID> \
  secret_access_key=<YOUR_SECRET_ACCESS_KEY> \
  use_tls=true

plakar at "@my-s3-store" create
plakar at "@my-s3-store" backup /var/www
```

---

## Destination connector

Restores objects from a Kloset store back to an S3 bucket.

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

classDef destinationBox fill:#d0fae5,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px
class Destination destinationBox
class Plakar brandBox
class Store storeBox
linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

Register the destination and restore a snapshot:

```bash
plakar destination add my-s3-restore \
  location=s3://<S3_ENDPOINT>/<BUCKET_NAME> \
  access_key=<YOUR_ACCESS_KEY_ID> \
  secret_access_key=<YOUR_SECRET_ACCESS_KEY> \
  use_tls=true

plakar at /var/backups restore -to "@my-s3-restore" <snapshot_id>
```
