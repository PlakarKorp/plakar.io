
# MongoDB

The MongoDB integration exports the contents of a MongoDB server into a Kloset
store with encryption and deduplication, and restores them back to a server. It
drives the MongoDB command line utilities rather than reading the data files
directly, so a backup is a logical dump of a running server.

The integration includes two connectors:

| Connector type            | Description                                       |
| ------------------------- | ------------------------------------------------- |
| **Source connector**      | Back up a MongoDB server into a Kloset store.     |
| **Destination connector** | Restore data from a Kloset store back to MongoDB. |

Each protocol matches one of the two MongoDB connection string formats:

| Protocol      | Description                                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| `mongodb`     | Connect to a server addressed by a fixed host name or IP address.                     |
| `mongodb+srv` | Resolve the server addresses from DNS SRV records, as used by MongoDB Atlas clusters. |

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

## Server connection

Both protocols drive the MongoDB command line utilities. A backup dumps the
contents of the server with `mongodump` and stores the result in a Kloset store
with encryption and deduplication. A restore loads the data back into a server
with `mongorestore`.

The following options apply to both protocols, for both source and destination
connectors.

| Option                 | Required | Description                                                                                                                                           |
| ---------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `location`             | Yes      | URL of the MongoDB server. Must begin with `mongodb://` or `mongodb+srv://`.                                                                          |
| `port`                 | No       | The MongoDB server port. Overrides a port given in `location`. Defaults to `27017`. Ignored when using `mongodb+srv`.                                 |
| `username`             | No       | Username for authentication to MongoDB.                                                                                                               |
| `password`             | No       | Password for authentication to MongoDB.                                                                                                               |
| `auth_mechanism`       | No       | Authentication mechanism to use with the server, such as `SCRAM-SHA-256` or `MONGODB-X509`.                                                           |
| `use_tls`              | No       | Use an encrypted TLS/SSL connection. Defaults to `true`. The certificate options below apply only when TLS is enabled.                                |
| `tls_ca_cert`          | No       | Path to a custom CA certificate used to verify the server's certificate.                                                                              |
| `tls_ca_cert_data`     | No       | Inline PEM content of a custom CA certificate. Alternative to `tls_ca_cert`.                                                                          |
| `tls_client_cert`      | No       | Path to a PEM file containing a client certificate and key for mTLS authentication.                                                                   |
| `tls_client_cert_data` | No       | Inline PEM content of a client certificate for mTLS authentication. Alternative to `tls_client_cert`.                                                 |
| `tls_client_key_data`  | No       | Inline PEM content of the client key for mTLS authentication. Must be set together with `tls_client_cert_data`. Setting only one of them is an error. |

> [!TIP]+ Inline certificates
>
> The `tls_ca_cert` and `tls_client_cert` options expect files on the machine
> running Plakar. The `_data` variants embed the PEM content directly in the
> configuration, which is useful when the certificates are not stored as files
> on that machine. Set either a path or its `_data` variant, not both. Setting
> both is rejected as ambiguous.

## 1. `mongodb` protocol

The `mongodb` protocol connects to the server at the host and port given in the
configuration. Use it for self-hosted servers and for any deployment addressed
by a fixed host name or IP address.

#### Backup flow

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

#### Restore flow

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

### Example

Register the source and run a backup:

```bash
$ plakar source add my-mongodb \
  location=mongodb://<MONGODB_HOST> \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups backup "@my-mongodb"
```

Register the destination and restore a snapshot:

```bash
$ plakar destination add my-mongodb-restore \
  location=mongodb://<MONGODB_HOST> \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups restore -to "@my-mongodb-restore" <snapshot_id>
```

## 2. `mongodb+srv` protocol

The `mongodb+srv` protocol resolves the server addresses from DNS SRV records
published for the host name, rather than connecting to that host name directly.
The port is also obtained from DNS, and any configured port is ignored. Use it
for deployments that publish their connection details through DNS, such as
MongoDB Atlas clusters.

#### Backup flow

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

#### Restore flow

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

### Example

Register the source and run a backup:

```bash
$ plakar source add my-atlas \
  location=mongodb+srv://<SRV_HOSTNAME> \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups backup "@my-atlas"
```

Register the destination and restore a snapshot:

```bash
$ plakar destination add my-atlas-restore \
  location=mongodb+srv://<SRV_HOSTNAME> \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups restore -to "@my-atlas-restore" <snapshot_id>
```

## Restore behaviour

> [!WARNING]+ Restoring replaces existing data
>
> Each collection in the snapshot is dropped from the target server before it is
> restored. Restoring the `admin` database deletes all existing users and roles
> on the server and replaces them with those from the snapshot.

