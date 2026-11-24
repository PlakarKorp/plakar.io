
# MongoDB

The MongoDB integration allows Plakar Control Plane to back up and restore the
contents of a MongoDB server. Plakar connects to a running server and drives the
MongoDB command line utilities, so a snapshot is a logical export of the server
rather than a copy of its data files, and a reachable server is required for
both backup and restore. The integration supports two protocols, `mongodb` and
`mongodb+srv`, matching the two MongoDB connection string formats. Both support
backup and restore.

## MongoDB user

With a username and password, the source and destination apps authenticate
against the `admin` database by default, so the MongoDB user must be defined
there. The built-in `backup` role covers a backup of every database, and the
built-in `restore` role covers a restore. Set **Auth Database** when the user is
defined in another database.

### Backing up a single database

A backup dumps every database, including `admin`, so the user needs read access
to `admin`. Set **Database** on the source app to back up a single database
instead. The user then only needs the built-in `read` role on that database. A
user defined in that database needs nothing else. A user defined in `admin` also
needs **Auth Database** set to `admin`.

A restore loads whatever the restore point holds, so it restores only that
database.

## Running MongoDB tasks on an edge

The MongoDB integration relies on `mongosh`, `mongodump`, and `mongorestore`,
which must be installed on the machine that executes the task. These utilities
are not included in the appliance, so MongoDB tasks run on an
[edge](../../edges) rather than on the Control Plane.

Install the required MongoDB utilities on the edge hosts of an edge pool, then
assign the MongoDB resources to that pool.

### Running the edge in a container

When the edge runs as a container, build a
[custom edge image](../../edges/installation/custom-image) from the official
MongoDB image. It already includes `mongosh`, `mongodump`, `mongorestore` and
the CA certificates the edge needs to reach the Control Plane over HTTPS:

```dockerfile
FROM mongo:8
COPY --from=ghcr.io/plakarkorp/plakar-edge:<version> /bin/plakar-edge /bin/
ENV PLAKAR_EDGE_EXTRA_TAGS=mongodb
ENTRYPOINT ["/bin/plakar-edge"]
```

Replace `<version>` with the edge version that matches your Control Plane, as
described in
[Choosing the edge version](../../edges/installation/custom-image#choosing-the-edge-version).

Add the resulting edges to an edge pool, and assign the MongoDB resources to
that pool, so their tasks run on an edge that has the client tools. See
[selecting an edge](../../edges/running-tasks#selecting-an-edge).

## Inventory Management

Currently no [managed inventory](../../inventories#managed-inventories) has the
capability of discovering MongoDB resources. You need to set up a
[self-managed inventory](../../inventories/self-managed) before adding a MongoDB
resource.

### Adding MongoDB as a resource

When using a self-managed inventory, you must register your resources manually
or import them from a CSV file.

To add a MongoDB server as a resource, use `Database` as the class and leave the
subclass empty. For the endpoint, use the hostname or IP address of the MongoDB
server, or the SRV hostname of the deployment when using the `mongodb+srv`
protocol. The endpoint is a host name only, without user, database or query
string. See [resources documentation](../../resources) for more information on
how to set up resources on a self-managed inventory.

## 1. `mongodb` protocol

The `mongodb` protocol connects to the server at the host and port given in the
resource endpoint and the app configuration. Use it for self-hosted servers and
for any deployment that is addressed by a fixed hostname or IP address.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph MongoDB["MongoDB Server"]
    DB["Databases"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["MongoDB<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"mongodump"| DB
  DB --> Source
  Source --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["MongoDB<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph MongoDB["MongoDB Server"]
    DB["Databases"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"mongorestore"| DB
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following settings are available when configuring both source and
destination apps using the `mongodb` protocol.

- **Auth Database**: The database that holds the user's credentials.
- **Auth Mechanism**: The authentication mechanism used with the server, such as
  `SCRAM-SHA-256` or `MONGODB-X509`.
- **Password**: The password used to authenticate to MongoDB.
- **Port**: The MongoDB server port. Defaults to `27017`.
- **Tls Ca Cert Data**: The PEM content of a custom CA certificate used to
  verify the server's certificate.
- **Tls Client Cert Data**: The PEM content of a client certificate for mTLS
  authentication.
- **Tls Client Key Data**: The PEM content of the client key for mTLS
  authentication. Must be set together with **Tls Client Cert Data**. Setting
  only one of them is an error.
- **Use Tls**: Use an encrypted TLS/SSL connection. Defaults to `true`.
- **Username**: The username used to authenticate to MongoDB.

### Source configuration

- **Database**: Back up this database instead of the whole server. See
  [Backing up a single database](#backing-up-a-single-database).

## 2. `mongodb+srv` protocol

The `mongodb+srv` protocol resolves the server addresses from DNS SRV records
published for the hostname, rather than connecting to that hostname directly.
The port is also obtained from DNS, and any configured port is ignored. Use it
for deployments that publish their connection details through DNS, such as
MongoDB Atlas clusters. The resource endpoint is the SRV hostname of the
deployment.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph MongoDB["MongoDB Server"]
    DB["Databases"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["MongoDB<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"mongodump"| DB
  DB --> Source
  Source --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["MongoDB<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph MongoDB["MongoDB Server"]
    DB["Databases"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"mongorestore"| DB
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following settings are available when configuring both source and
destination apps using the `mongodb+srv` protocol.

- **Auth Database**: The database that holds the user's credentials.
- **Auth Mechanism**: The authentication mechanism used with the server, such as
  `SCRAM-SHA-256` or `MONGODB-X509`.
- **Password**: The password used to authenticate to MongoDB.
- **Port**: Ignored when using this protocol. The port is obtained from DNS
  along with the server addresses.
- **Tls Ca Cert Data**: The PEM content of a custom CA certificate used to
  verify the server's certificate.
- **Tls Client Cert Data**: The PEM content of a client certificate for mTLS
  authentication.
- **Tls Client Key Data**: The PEM content of the client key for mTLS
  authentication. Must be set together with **Tls Client Cert Data**. Setting
  only one of them is an error.
- **Use Tls**: Use an encrypted TLS/SSL connection. Defaults to `true`.
- **Username**: The username used to authenticate to MongoDB.

### Source configuration

- **Database**: Back up this database instead of the whole server. See
  [Backing up a single database](#backing-up-a-single-database).

## Snapshot contents

Each snapshot holds a single file, `/mongodb-backup.bson`, the archive written
by `mongodump --archive`. It contains every database the user can read, except
`local`, and the users and roles defined in `admin`. With **Database**, it
contains only that database. To restore a single collection from it, see
[Restoring a single collection](/docs/community/main/integrations/mongodb/#restoring-a-single-collection).

## Restore behaviour

> [!WARNING]+ Restoring replaces existing data
>
> Each collection in the snapshot is dropped from the target server before it is
> restored. Restoring the `admin` database deletes all existing users and roles
> on the server and replaces them with those from the snapshot.

