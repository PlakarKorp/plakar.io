
# MongoDB

The MongoDB integration allows Plakar Control Plane to back up and restore the
contents of a MongoDB server. Plakar connects to a running server and drives the
MongoDB command line utilities, so a snapshot is a logical export of the server
rather than a copy of its data files, and a reachable server is required for
both backup and restore.

## Running MongoDB tasks on an edge

The MongoDB integration relies on `mongosh`, `mongodump`, and `mongorestore`,
which must be installed on the machine that executes the task. These utilities
are not included in the appliance, so MongoDB tasks run on an
[edge](../../infrastructure/edges) rather than on the Control Plane.

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
server. See [resources documentation](../../resources) for more information on
how to set up resources on a self-managed inventory.

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

## Shared configuration

The following settings are available when configuring both source and
destination apps.

- **Password**: Required. The password used to authenticate to MongoDB.
- **Port**: The MongoDB server port. Defaults to `27017`.
- **Use Tls**: Use an encrypted TLS/SSL connection.
- **Username**: Required. The username used to authenticate to MongoDB.

