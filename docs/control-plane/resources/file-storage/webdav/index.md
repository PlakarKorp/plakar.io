
# WebDAV

The WebDAV integration allows Plakar Control Plane to back up and restore files
on any WebDAV remote, such as Nextcloud, ownCloud, or a self-hosted WebDAV
server. WebDAV integration supports multiple protocols.

## Inventory Management

Currently no [managed inventory](../../inventories#managed-inventories) has the
capability of discovering WebDAV resources. You need to set up a
[self-managed inventory](../../inventories/self-managed) before adding a WebDAV
resource.

### Adding WebDAV as a resource

Register the resource with no class or subclass. For the endpoint, use the
hostname of the WebDAV server. See [resources documentation](../../resources)
for more information on how to set up resources on a self-managed inventory.

## 1. `dav` protocol

The `dav` protocol connects to a WebDAV remote over unencrypted HTTP. The
**Insecure** option must be enabled to use this protocol.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Remote["WebDAV Remote"]
    Files["Files"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["WebDAV<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"dav connection"| Files
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
    Destination["WebDAV<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Remote["WebDAV Remote"]
    Files["Files"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"dav connection"| Files
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following settings are available when configuring a source or destination
app using the `dav` protocol.

- **Insecure**: Required. Must be enabled to connect over the unencrypted `dav`
  protocol.
- **Password**: Optional password, used only if Username is set.
- **Username**: Optional username.

## 2. `davs` protocol

The `davs` protocol connects to a WebDAV remote over TLS-encrypted HTTPS. This
is the recommended protocol for all remote connections.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Remote["WebDAV Remote"]
    Files["Files"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["WebDAV<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"davs connection over TLS"| Files
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
    Destination["WebDAV<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Remote["WebDAV Remote"]
    Files["Files"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"davs connection over TLS"| Files
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following settings are available when configuring a source or destination
app using the `davs` protocol.

- **Password**: Optional password, used only if Username is set.
- **Username**: Optional username.

## Limitations

WebDAV does not preserve all filesystem metadata, such as Unix permissions and
symlinks. Only file content, directory structure, modification times and basic
attributes are captured. Empty directories are preserved.

A symlink in a snapshot is skipped on restore rather than recreated.

WebDAV cannot tell a symlink on the server from a real directory. If the
destination already contains one, a restore can write through it, outside the
destination root, depending on how the server handles it. Only restore into a
destination whose symlinks you control.

