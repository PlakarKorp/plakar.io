
# FTP

FTP (File Transfer Protocol) is a standard protocol for transferring files
between a client and a server over TCP/IP. The FTP integration includes two
connectors:

| Connector type            | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| **Source connector**      | Back up a remote directory reachable over FTP into a Kloset store. |
| **Destination connector** | Restore data from a Kloset store to an FTP target.                 |

**Compatibility**

- Connects over plain FTP only. FTPS and SFTP are separate protocols; this
  integration does not negotiate FTPS. See [SFTP / SSH](../sftp) for SSH-based
  transfers.

> [!WARNING]+ Plaintext protocol
>
> This integration connects over plain FTP and does not support FTPS.
> Credentials and data are transmitted unencrypted. Avoid using FTP over
> untrusted networks, or use [SFTP](../sftp) instead when available.

## Installation

The FTP integration is distributed as a Plakar package.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the FTP package:

```bash
$ plakar pkg add ftp
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
$ plakar pkg build ftp
```

A package archive will be created in the current directory (e.g.,
`ftp_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add ./ftp_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## Connectors

The FTP package provides two connectors: a source connector for backing up
remote directories over FTP, and a destination connector for restoring data over
FTP.

### Source connector

The Plakar FTP package provides a source connector to back up remote directories
reachable over FTP.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["FTP Server"]
  FS["/pub/somedirectory"]
end

Plakar["Plakar"]

Via["Retrieve data via<br/>FTP source connector"]

Store["Kloset Store"]

FS --> Via --> Plakar --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Configure

```bash
# Configure a source pointing to the remote FTP directory
$ plakar source add ftp_src ftp://ftp.example.org/pub/somedirectory

# Back up the remote directory to a Kloset store on the filesystem
$ plakar at /var/backups backup "@ftp_src"
```

#### Options

These options can be set when configuring the source connector with
`plakar source add` or `plakar source set`:

| Option     | Purpose                                                                       |
| ---------- | ----------------------------------------------------------------------------- |
| `location` | `ftp://[user[:password]@]host[:port]/path` of the remote directory to back up |
| `username` | The username to authenticate as. Overrides the URI user.                      |
| `password` | The password to authenticate with. Overrides the URI password.                |

### Destination connector

The Plakar FTP package provides a destination connector to restore snapshots to
remote directories reachable over FTP.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Via["Push data via<br/>FTP destination connector"]

subgraph Destination["FTP Server"]
  FS["/upload"]
end

Store --> Plakar --> Via --> FS
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Configure

```bash
# Configure a destination pointing to the remote FTP directory
$ plakar destination add ftp_dst ftp://ftp.example.org/upload

# Restore a snapshot to the remote FTP directory
$ plakar at /var/backups restore -to "@ftp_dst" <snapshot_id>
```

#### Options

These options can be set when configuring the destination connector with
`plakar destination add` or `plakar destination set`:

| Option     | Purpose                                                                          |
| ---------- | -------------------------------------------------------------------------------- |
| `location` | `ftp://[user[:password]@]host[:port]/path` of the remote directory to restore to |
| `username` | The username to authenticate as. Overrides the URI user.                         |
| `password` | The password to authenticate with. Overrides the URI password.                   |

## Limitations and scope

**Snapshot consistency**

Changes during backup (creates, updates, deletes) may result in a snapshot that
reflects different points in time for different files. For highly dynamic paths,
consider quiescing the workload or backing up from a read-only replica.

## See also

- [SFTP / SSH](../sftp)

