
# NFS

The NFS integration backs up the files and directories of an NFS export into a
Kloset store and restores snapshots back to an NFS export. NFS (Network File
System) is a distributed file system protocol that lets a client access files on
a remote server as if they were local. It is common in datacenter and enterprise
environments for shared storage, home directories and appliance exports on NAS
devices.

The integration includes two connectors:

| Connector type            | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| **Source connector**      | Back up files hosted on an NFS export into a Kloset store.   |
| **Destination connector** | Restore snapshots from a Kloset store back to an NFS export. |

## Installation

The NFS package can be installed using pre-built binaries or compiled from
source.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the NFS package:

```bash
$ plakar pkg add nfs
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
$ plakar pkg build nfs
```

A package archive will be created in the current directory (e.g.,
`nfs_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add ./nfs_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## How the integration accesses an export

Plakar speaks NFSv3 directly over ONC-RPC. No kernel mount is involved, so
neither root privileges nor mount capability are required on the host running
Plakar.

Authorization uses AUTH_UNIX, meaning a numeric user and group ID presented to
the server. These are set with the `uid` and `gid` options. The export must
permit the presented credentials, for example through an
`*(rw,no_root_squash)`-style export or a matching uid on the server.

## Addressing an export

An NFS location identifies the server and the export to mount:

```bash
nfs://<host>[:<port>]/<export>[/<subpath>]
```

The path is the server-side export to mount. A deeper subpath narrows the walk
to a subtree of that export, which the `root` option also does.

## Configuration

The source connector walks the export, or a subtree of it, and stores the files
and directories it finds in a Kloset store with encryption and deduplication.
Each entry is captured with its size, mode, ownership and modification time.

The destination connector restores a snapshot back to an NFS export, recreating
the directory hierarchy and file contents.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["NFS Export"]
  FS["Files"]
end

subgraph Plakar["Plakar"]
  Connector["Walk export via<br/>NFSv3"]
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
  Connector["Write files via<br/>NFSv3"]
  Transform --> Connector
end

Store --> Transform

subgraph Destination["NFS Export"]
  FS["Files"]
end

Connector --> Destination
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to both source and destination connectors.

| Option     | Required | Description                                                                                                   |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `location` | Yes      | NFS target. See [Addressing an export](#addressing-an-export).                                                |
| `root`     | No       | Path to walk or restore to, relative to the mounted export. Defaults to the whole export.                     |
| `port`     | No       | NFS and MOUNT service port. By default the service is resolved through the server's portmapper on port `111`. |
| `uid`      | No       | Numeric user ID presented to the server as the AUTH_UNIX identity. Defaults to `0`.                           |
| `gid`      | No       | Numeric group ID presented to the server as the AUTH_UNIX identity. Defaults to `0`.                          |

### Example

Back up an export:

```bash
$ plakar source add my-nfs-export \
  location=nfs://nas.example.com/exports/data

$ plakar at /var/backups backup "@my-nfs-export"
```

Back up a subtree rather than the whole export by extending the location with
the path inside the export. The `uid` and `gid` presented to the server decide
what the walk is allowed to read:

```bash
$ plakar source add my-nfs-home \
  location=nfs://nas.example.com/exports/home/alice \
  uid=1000 gid=1000
```

Pass a location directly to `backup`:

```bash
$ plakar at /var/backups backup nfs://nas.example.com/exports/data

$ plakar at /var/backups backup \
  -o uid=1000 -o gid=1000 \
  nfs://nas.example.com/exports/home/alice
```

Restore a snapshot to an export:

```bash
$ plakar destination add my-nfs-restore \
  location=nfs://nas.example.com/exports/restore

$ plakar at /var/backups restore -to "@my-nfs-restore" <snapshot_id>
```

## Limitations and scope

Only NFSv3 is supported. NFSv4, Kerberos (`sec=krb5`) and NFS over UDP are not.

Only regular files and directories are reconstructed on restore. Symlinks,
device nodes, sockets and FIFOs are reported as errors.

File modes are applied when each entry is created. Ownership and timestamps are
not restored.

