---
title: "SMB / CIFS"
date: "2026-09-21T00:00:00Z"
weight: 28
summary: "Back up and restore SMB shares with Plakar."
---

# SMB / CIFS

SMB (Server Message Block), also known as CIFS, is the file-sharing protocol
used by Windows networks and by NAS appliances and Samba servers on Unix. It is
the standard way to share folders, called shares, across a LAN.

The **SMB integration** walks a share over SMB2/3 and captures its files,
directories, and symlinks into a Kloset store with encryption and deduplication.
Plakar speaks the protocol directly over TCP, so no kernel mount, no system
`smbclient`, and no root privileges are required. Authentication uses NTLMv2.

The SMB integration provides two connectors:

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

## Configuration

### Addressing a share

An SMB location identifies the server and the share to mount:

```bash
smb://[<user>[:<password>]@]<host>[:<port>]/<share>[/<subpath>]
```

The first path segment is the share to mount. Anything deeper narrows the walk
to a subtree of that share, which the `root` option also does. Credentials can
be supplied in the URL userinfo or as separate options.

### Configuration options

These options apply to both connectors.

| Option     | Required | Description                                                                      |
| ---------- | -------- | -------------------------------------------------------------------------------- |
| `location` | Yes      | SMB target. See [Addressing a share](#addressing-a-share) above.                 |
| `root`     | No       | Path to walk or restore to, relative to the share. Defaults to the whole share.  |
| `port`     | No       | SMB TCP port. Defaults to `445`.                                                 |
| `username` | No       | NTLM user name, if not given in the URL userinfo. Anonymous access uses `Guest`. |
| `password` | No       | NTLM password, if not given in the URL userinfo.                                 |
| `domain`   | No       | NTLM authentication domain or workgroup.                                         |

## Source connector

The source connector walks the share, or a subtree of it, and stores the files,
directories, and symlinks it finds in a Kloset store with encryption and
deduplication. Each entry is captured with its size and modification time.

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

Register the source and run a backup:

```bash
$ plakar source add my-smb-share \
  location=smb://nas.example.com/documents \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups backup "@my-smb-share"
```

To back up a subtree rather than the whole share, extend the location with the
path inside the share:

```bash
$ plakar source add my-smb-projects \
  location=smb://nas.example.com/documents/projects \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>
```

A location can also be passed directly to `backup`, with credentials in the URL
or as options:

```bash
$ plakar at /var/backups backup smb://alice:secret@nas.example.com/documents

$ plakar at /var/backups backup \
  -o username=alice -o password=secret \
  smb://nas.example.com/documents/projects
```

## Destination connector

Restores a snapshot from a Kloset store back to an SMB share, recreating the
directory hierarchy, file contents, and symlinks.

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

Register the destination and restore a snapshot:

```bash
$ plakar destination add my-smb-restore \
  location=smb://nas.example.com/restore \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups restore -to "@my-smb-restore" <snapshot_id>
```

## Limitations

**Authentication**

Authentication is NTLMv2. Kerberos is not supported.

**File metadata**

SMB has no native Unix ownership or permission model. Backed-up files carry a
mode synthesized from their DOS attributes, meaning the directory and read-only
flags. User and group IDs, inode numbers, and link counts are not available.

On restore, file contents, directories, and symlinks are recreated, and
modification times are preserved on a best-effort basis. Unix permission bits
and ownership are not restored.

**Unsupported file types**

Device nodes, sockets, and FIFOs have no SMB representation. Restoring a
snapshot that contains them reports an error for each such entry.
