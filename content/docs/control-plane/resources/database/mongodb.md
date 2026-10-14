---
title: "MongoDB"
date: "2026-09-22T00:00:00Z"
weight: 5
summary: "How to configure a MongoDB resource in Plakar Control Plane."
---

# MongoDB

The MongoDB integration allows Plakar Control Plane to back up and restore the
contents of a MongoDB server. Plakar connects to a running server and drives the
MongoDB command line utilities, so a snapshot is a logical export of the server
rather than a copy of its data files, and a reachable server is required for
both backup and restore. The integration supports two protocols, `mongodb` and
`mongodb+srv`, matching the two MongoDB connection string formats. Both support
backup and restore.

## Running MongoDB tasks on an edge

The MongoDB integration relies on `mongosh`, `mongodump`, and `mongorestore`,
which must be installed on the machine that executes the task. These utilities
are not included in the appliance, so MongoDB tasks run on an
[edge](../../edges) rather than on the Control Plane.

Install the required MongoDB utilities on the edge host, then configure the task
to run on that edge.

## Inventory Management

Currently no
[managed inventory](../../infrastructure/inventories#managed-inventories) has
the capability of discovering MongoDB resources. You need to set up a
[self-managed inventory](../../infrastructure/inventories/self-managed) before
adding a MongoDB resource.

### Adding MongoDB as a resource

When using a self-managed inventory, you must register your resources manually
or import them from a CSV file.

To add a MongoDB server as a resource, use `Database` as the class and leave the
subclass empty. For the endpoint, use the hostname or IP address of the MongoDB
server, or the SRV hostname of the deployment when using the `mongodb+srv`
protocol. See [resources documentation](../../resources) for more information on
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

## Restore behaviour

> [!WARNING]+ Restoring replaces existing data
>
> Each collection in the snapshot is dropped from the target server before it is
> restored. Restoring the `admin` database deletes all existing users and roles
> on the server and replaces them with those from the snapshot.
