---
title: "WebDAV"
date: "2026-06-18T00:00:00Z"
weight: 20
summary: "Back up and restore WebDAV remotes with Plakar."
---

# WebDAV

The WebDAV integration backs up and restores WebDAV remotes. Any
WebDAV-compatible service can be used as a source or destination, including
Nextcloud, ownCloud and self-hosted WebDAV servers.

The integration includes two connectors:

| Connector type            | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| **Source connector**      | Back up a WebDAV remote into a Kloset store.               |
| **Destination connector** | Restore a snapshot from a Kloset store to a WebDAV remote. |

Both connectors support two protocols. They differ in whether the connection is
encrypted:

| Protocol  | Transport                                                          |
| --------- | ------------------------------------------------------------------ |
| `davs://` | TLS-encrypted WebDAV. Recommended for all remote connections.      |
| `dav://`  | Unencrypted WebDAV. Requires `insecure=true` to be explicitly set. |

> [!WARNING]+
>
> Only use `dav://` on trusted local networks. For any connection over the
> internet, use `davs://` to protect credentials and data in transit.

## Installation

The WebDAV package can be installed using pre-built binaries or compiled from
source.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the WebDAV package:

```bash
$ plakar pkg add webdav
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
$ plakar pkg build webdav
```

A package archive will be created in the current directory (e.g.,
`webdav_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add -allow-unsigned ./webdav_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## Configuration

The source connector retrieves files from a WebDAV remote and stores them in a
Kloset store with encryption and deduplication. The destination connector
restores files from a Kloset store back to a WebDAV remote. Both connectors
authenticate with HTTP basic authentication when a username is set.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["WebDAV Remote"]
  FS["Files"]
end

subgraph Plakar["Plakar"]
  Connector["Retrieve files via<br/>WebDAV"]
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
  Connector["Restore via<br/>WebDAV"]
  Transform --> Connector
end

Store --> Transform

subgraph Destination["WebDAV Remote"]
  FS["Files"]
end

Connector --> Destination
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to both source and destination connectors.

| Option     | Required    | Description                                                        |
| ---------- | ----------- | ------------------------------------------------------------------ |
| `location` | Yes         | `davs://<webdav-host>/path` or `dav://<webdav-host>/path`.         |
| `username` | No          | Username for basic authentication.                                 |
| `password` | No          | Password for basic authentication. Only used if `username` is set. |
| `insecure` | Conditional | Set to `true` to allow the unencrypted `dav://` protocol.          |

### Example

Back up a WebDAV remote:

```bash
$ plakar source add my-webdav \
  davs://<webdav-host>/path/to/files \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups backup "@my-webdav"
```

Back up a specific path:

```bash
$ plakar at /var/backups backup "@my-webdav:subpath"
```

Back up a Nextcloud account:

```bash
$ plakar source add nextcloud \
  davs://<nextcloud-url>/remote.php/dav/files/<your-user> \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups backup "@nextcloud"
```

Restore a snapshot to a WebDAV remote:

```bash
$ plakar destination add my-webdav-restore \
  davs://<webdav-host>/path/to/files \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups restore -to "@my-webdav-restore" <snapshot_id>
```

## Limitations and scope

WebDAV does not preserve all filesystem metadata, such as Unix permissions and
symlinks. Only file content, directory structure, modification times and basic
attributes are captured. Empty directories are preserved.

When using `dav://`, the `insecure=true` option must be explicitly set.
