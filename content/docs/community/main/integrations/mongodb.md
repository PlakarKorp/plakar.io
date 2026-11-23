---
title: "MongoDB"
date: "2026-09-22T00:00:00Z"
weight: 30
summary: "Back up and restore MongoDB databases with Plakar."
---

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

- `mongosh`, `mongodump`, and `mongorestore` available in `$PATH` on the machine
  running Plakar. `mongosh` checks that the server answers before a backup or a
  restore, `mongodump` runs the backup and `mongorestore` the restore.
- A MongoDB user. The built-in `backup` role covers a backup of every database,
  and the built-in `restore` role covers a restore. See
  [Authentication](#authentication) for where the user is defined.

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
| `location`             | Yes      | `mongodb://host`, `mongodb://host:port` or `mongodb+srv://host`. Host name and port only: user, database and query string are rejected.               |
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
| `auth_database`        | No       | Database that holds the user's credentials. See [Authentication](#authentication).                                                                    |
| `database`             | No       | Source only. Back up this database instead of the whole server. See [Backing up a single database](#backing-up-a-single-database).                    |

> [!TIP]+ Inline certificates
>
> The `tls_ca_cert` and `tls_client_cert` options expect files on the machine
> running Plakar. The `_data` variants embed the PEM content directly in the
> configuration, which is useful when the certificates are not stored as files
> on that machine. Set either a path or its `_data` variant, not both. Setting
> both is rejected as ambiguous.

### Authentication

The MongoDB tools authenticate the user against a database:

- With `username` and `password`, they use SCRAM and look the user up in
  `database` when it is set, and in `admin` otherwise.
- With an external mechanism such as `MONGODB-X509`, they look the user up in
  `$external`. With `MONGODB-X509`, the client certificate identifies the user,
  and no username or password is needed.

Set `auth_database` when the user is defined in another database, such as a user
created in `admin` that backs up a single database.

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

## Backing up a single database

By default, a backup dumps every database, including `admin`, so the user needs
read access to `admin`. Set `database` on the source to back up a single
database instead. The user then only needs the built-in `read` role on that
database.

A user created in that database needs nothing else. A user created in `admin`
also needs `auth_database=admin`, otherwise authentication fails.

```bash
$ plakar source add shop \
  location=mongodb://db.example.com \
  database=shop \
  username=shop_reader \
  password=<YOUR_PASSWORD>
```

A restore loads whatever the snapshot holds, so this snapshot restores only the
`shop` database.

## Snapshot contents

A backup runs `mongodump --archive` against the server and streams its output
into the snapshot, without writing a temporary file on the machine running
Plakar. Each snapshot holds a single file, `/mongodb-backup.bson`, a standard
`mongodump` archive. It contains every database the user can read, except
`local`, with the index definitions, and the users and roles defined in `admin`.
With `database`, it contains only that database.

## Restoring a single collection

The destination connector restores the whole archive. To restore one collection,
stream the archive from the snapshot into `mongorestore` and select the
collection with `--nsInclude`. `--nsFrom` and `--nsTo` load it under a new name,
next to the original:

```bash
$ plakar at /var/backups cat <snapshot_id>:/mongodb-backup.bson | \
    mongorestore --uri="mongodb://<MONGODB_HOST>" \
    --username=<YOUR_USERNAME> \
    --archive \
    --nsInclude='shop.orders' \
    --nsFrom='shop.orders' --nsTo='shop.orders_restored'
```

To keep the archive as a file, restore the snapshot to a directory with
`plakar at /var/backups restore -to /tmp/mongo-restore <snapshot_id>`, then run
`mongorestore --archive=/tmp/mongo-restore/mongodb-backup.bson`.

## Restore behaviour

> [!WARNING]+ Restoring replaces existing data
>
> Each collection in the snapshot is dropped from the target server before it is
> restored. Restoring the `admin` database deletes all existing users and roles
> on the server and replaces them with those from the snapshot.
