---
title: "NFS"
date: "2026-09-21T00:00:00Z"
weight: 5
summary: "How to configure an NFS resource in Plakar Control Plane."
---

# NFS

The NFS integration allows Plakar Control Plane to back up and restore files
hosted on an NFS export. Exports are served by NAS appliances and Unix file
servers. Plakar speaks NFSv3 directly to the server, mounts the configured
export, and reads or writes files under the configured root path. Authorization
uses AUTH_UNIX, meaning the numeric user and group IDs presented to the server.

## Inventory Management

Currently no
[managed inventory](../../infrastructure/inventories#managed-inventories) has
the capability of discovering NFS resources. You need to set up a
[self-managed inventory](../../infrastructure/inventories/self-managed) before
adding an NFS resource.

### Adding NFS as a resource

When using a self-managed inventory, you must register your resources manually
or import them from a CSV file.

To add an NFS server as a resource, register it with no class or subclass. For
the endpoint, use the IP address or hostname of the target machine. See
[resources documentation](../../resources) for more information on how to set up
resources on a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Remote["NFS Server"]
    Files["Export<br/>Root path"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["NFS<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"NFSv3 connection"| Files
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
    Destination["NFS<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Remote["NFS Server"]
    Files["Export<br/>Root path"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"NFSv3 connection"| Files
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared configuration

The following settings are available when configuring a source or destination
app.

- **Export**: The server export to mount, for example `/exports/data`. Takes
  precedence over the export named in the location.
- **Gid**: Numeric group ID presented to the server as the AUTH_UNIX credential.
  Defaults to `0`.
- **Port**: The NFS and MOUNT service port. By default the service is resolved
  through the server's portmapper.
- **Root**: Path relative to the mounted export. For a source app it is the path
  to walk, and for a destination app it is the path files are restored to.
  Defaults to `/`, the whole export.
- **Uid**: Numeric user ID presented to the server as the AUTH_UNIX credential.
  Defaults to `0`.
