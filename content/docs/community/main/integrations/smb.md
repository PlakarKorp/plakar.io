---
title: "SMB / CIFS"
date: "2026-09-21T00:00:00Z"
weight: 28
summary: "Back up and restore SMB shares with Plakar."
---

# SMB / CIFS

The SMB integration backs up the files, directories and symlinks of an SMB share
into a Kloset store and restores snapshots back to an SMB share. SMB (Server
Message Block), also known as CIFS, is the file-sharing protocol used by Windows
networks and by NAS appliances and Samba servers on Unix. It is the standard way
to share folders, called shares, across a LAN.

The integration includes two connectors:

| Connector type            | Description                                                 |
| ------------------------- | ----------------------------------------------------------- |
| **Source connector**      | Back up files hosted on an SMB share into a Kloset store.   |
| **Destination connector** | Restore snapshots from a Kloset store back to an SMB share. |

## Installation

The SMB package can be installed using pre-built binaries or compiled from
source.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the SMB package:

```bash
$ plakar pkg add smb
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
$ plakar pkg build smb
```

A package archive will be created in the current directory (e.g.,
`smb_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add ./smb_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## How the integration accesses a share

Plakar speaks SMB2/3 directly over TCP. No kernel mount, no system `smbclient`
and no root privileges are required on the host running Plakar.

Authentication uses NTLMv2. Credentials can be supplied in the URL userinfo or
with the `username`, `password` and `domain` options. Anonymous access uses the
`Guest` account.

## Addressing a share

An SMB location identifies the server and the share to mount:

```bash
smb://[<user>[:<password>]@]<host>[:<port>]/<share>[/<subpath>]
```

The first path segment is the share to mount. Anything deeper narrows the walk
to a subtree of that share, which the `root` option also does.

## Configuration

The source connector walks the share, or a subtree of it, and stores the files,
directories and symlinks it finds in a Kloset store with encryption and
deduplication. Each entry is captured with its size and modification time.

The destination connector restores a snapshot back to an SMB share, recreating
the directory hierarchy, file contents and symlinks.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["SMB Share"]
  FS["Files"]
end

subgraph Plakar["Plakar"]
  Connector["Walk share via<br/>SMB2/3"]
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
  Connector["Write files via<br/>SMB2/3"]
  Transform --> Connector
end

Store --> Transform

subgraph Destination["SMB Share"]
  FS["Files"]
end

Connector --> Destination
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to both source and destination connectors.

| Option     | Required | Description                                                                      |
| ---------- | -------- | -------------------------------------------------------------------------------- |
| `location` | Yes      | SMB target. See [Addressing a share](#addressing-a-share).                       |
| `root`     | No       | Path to walk or restore to, relative to the share. Defaults to the whole share.  |
| `port`     | No       | SMB TCP port. Defaults to `445`.                                                 |
| `username` | No       | NTLM user name, if not given in the URL userinfo. Anonymous access uses `Guest`. |
| `password` | No       | NTLM password, if not given in the URL userinfo.                                 |
| `domain`   | No       | NTLM authentication domain or workgroup.                                         |

### Example

Back up a share:

```bash
$ plakar source add my-smb-share \
  location=smb://nas.example.com/documents \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups backup "@my-smb-share"
```

Back up a subtree rather than the whole share by extending the location with the
path inside the share:

```bash
$ plakar source add my-smb-projects \
  location=smb://nas.example.com/documents/projects \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>
```

Pass a location directly to `backup`, with credentials in the URL or as options:

```bash
$ plakar at /var/backups backup smb://alice:secret@nas.example.com/documents

$ plakar at /var/backups backup \
  -o username=alice -o password=secret \
  smb://nas.example.com/documents/projects
```

Restore a snapshot to a share:

```bash
$ plakar destination add my-smb-restore \
  location=smb://nas.example.com/restore \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups restore -to "@my-smb-restore" <snapshot_id>
```

## Limitations and scope

Authentication is NTLMv2. Kerberos is not supported.

SMB has no native Unix ownership or permission model. Backed-up files carry a
mode synthesized from their DOS attributes, meaning the directory and read-only
flags. User and group IDs, inode numbers and link counts are not available.

On restore, file contents, directories and symlinks are recreated, and
modification times are preserved on a best-effort basis. Unix permission bits
and ownership are not restored.

Device nodes, sockets and FIFOs have no SMB representation. Restoring a snapshot
that contains them reports an error for each such entry.
