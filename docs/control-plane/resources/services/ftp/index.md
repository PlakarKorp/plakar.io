
# FTP

The FTP integration allows Plakar Control Plane to back up and restore files on
any remote server reachable over FTP. Plakar connects to the remote server and
reads or writes files directly under the configured root path.

## Inventory Management

Currently no
[managed inventory](../../infrastructure/inventories#managed-inventories) has
the capability of discovering FTP resources. You need to set up a
[self-managed inventory](../../infrastructure/inventories/self-managed) before
adding an FTP resource.

### Adding FTP as a resource

When using a self-managed inventory, you must register your resources manually
or import them from a CSV file.

To add an FTP server as a resource, use **Services** as the `class` and **FTP**
as the `subclass`. For the endpoint, use the IP address or hostname of the
target machine. See [resources documentation](../../resources) for more
information on how to set up resources on a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Remote["FTP Server"]
    Files["Filesystem<br/>Root path"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["FTP<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"FTP connection"| Files
  Files -->|"read files"| Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["FTP<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Remote["FTP Server"]
    Files["Filesystem<br/>Root path"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"FTP connection"| Files
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared configuration

The following settings are available when configuring a source or destination
app.

- **Password**: FTP password. Not set by default.
- **Port**: The TCP/UDP port number the FTP service is listening on. Defaults to
  `21`.
- **Root**: The absolute filesystem path to use as the root for backup
  operations. Defaults to `/`.
- **Username**: FTP username. Defaults to `anonymous`.

