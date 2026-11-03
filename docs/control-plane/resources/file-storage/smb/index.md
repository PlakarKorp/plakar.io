
# SMB

The SMB integration allows Plakar Control Plane to back up and restore files
hosted on an SMB share, also known as CIFS. Shares are served by Windows file
servers, NAS appliances, and Samba hosts. Plakar speaks SMB2/3 directly to the
server, mounts the configured share, and reads or writes files under the
configured root path. Authentication uses NTLMv2.

## Prerequisites

The SMB server must support message signing. Since version 1.1.4 of the
integration, Plakar refuses to connect to a server without it, so that backup
and restore traffic cannot be altered in transit.

## Inventory Management

Currently no [managed inventory](../../inventories#managed-inventories) has the
capability of discovering SMB resources. You need to set up a
[self-managed inventory](../../inventories/self-managed) before adding an SMB
resource.

### Adding SMB as a resource

When using a self-managed inventory, you must register your resources manually
or import them from a CSV file.

To add an SMB server as a resource, register it with no class or subclass. For
the endpoint, use the IP address or hostname of the target machine. See
[resources documentation](../../resources) for more information on how to set up
resources on a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Remote["SMB Server"]
    Files["Share<br/>Root path"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["SMB<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"SMB2/3 connection"| Files
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
    Destination["SMB<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Remote["SMB Server"]
    Files["Share<br/>Root path"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"SMB2/3 connection"| Files
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared configuration

The following settings are available when configuring a source or destination
app.

- **Domain**: NTLM authentication domain or workgroup.
- **Password**: SMB password. Cannot be used if the location already includes
  `user:password@host`.
- **Port**: The TCP port the SMB service is listening on. Defaults to `445`.
- **Root**: Path relative to the share root. For a source app it is the path to
  walk, and for a destination app it is the path files are restored to. Defaults
  to `/`, the whole share.
- **Share**: The SMB share, or tree, to mount, for example `data`. Takes
  precedence over the share named in the location.
- **Username**: SMB username. Cannot be used if the location already includes
  `user@host`.

## Limitations

Authentication is NTLMv2 only. Kerberos is not supported.

SMB has no Unix ownership or permissions. A restore recreates files, directories
and symlinks, with their modification times where the server allows it, but not
their owner, group or permission bits. Device nodes, sockets and FIFOs cannot be
restored to an SMB share.

A restore refuses any entry that would be written outside the destination root.
A symlink that already exists in the destination is still followed by the
server, though, so only restore into a destination whose symlinks you control.

