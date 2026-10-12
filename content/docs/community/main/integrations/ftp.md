---
title: "FTP"
date: "2026-09-02T00:00:00Z"
weight: 23
summary:
  "Back up remote directories over FTP, and restore snapshots to FTP
  destinations."
---

# FTP

FTP (File Transfer Protocol) is a standard protocol for transferring files
between a client and a server over TCP/IP. The FTP integration includes two
connectors:

| Connector type            | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| **Source connector**      | Back up a remote directory reachable over FTP into a Kloset store. |
| **Destination connector** | Restore data from a Kloset store to an FTP target.                 |

## Transport security

The connector encrypts the connection with FTPS by default. The `tls` option
selects how TLS is negotiated:

| Value      | Behaviour                                                                              |
| ---------- | -------------------------------------------------------------------------------------- |
| `explicit` | Default. Connects on the FTP port and upgrades the connection with `AUTH TLS`.         |
| `implicit` | Starts TLS as soon as the connection opens. Servers usually expect this on port `990`. |
| `none`     | Plain FTP. Credentials and data are sent unencrypted.                                  |

With TLS enabled, the connector requires TLS 1.2 or later and verifies the
server certificate against the system's trusted certificate authorities and the
server hostname. Setting `tls_insecure_no_verify=true` skips this verification,
for example for a server using a self-signed certificate.

Plain FTP must be requested explicitly. The connector refuses `tls=none` unless
`tls_insecure_no_verify=true` is also set to acknowledge that credentials and
data travel unencrypted.

> [!WARNING]+ Plain FTP requires opt-in
>
> Before v1.1.3, the FTP package connected over plain FTP only. Sources and
> destinations configured before v1.1.3 now attempt FTPS and fail to connect to
> servers that do not support it. To keep using plain FTP, set both options on
> the existing configuration:
>
> ```bash
> $ plakar source set ftp_src tls=none tls_insecure_no_verify=true
> $ plakar destination set ftp_dst tls=none tls_insecure_no_verify=true
> ```
>
> Avoid plain FTP over untrusted networks. Use [SFTP](../sftp) instead when the
> server supports it.

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
$ plakar pkg add -allow-unsigned ./ftp_v1.0.0_darwin_arm64.ptar
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

| Option                   | Purpose                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `location`               | `ftp://[user[:password]@]host[:port]/path` of the remote directory to back up                         |
| `username`               | The username to authenticate as. Overrides the URI user.                                              |
| `password`               | The password to authenticate with. Overrides the URI password.                                        |
| `tls`                    | TLS mode: `explicit` (default), `implicit`, or `none`. See [transport security](#transport-security). |
| `tls_insecure_no_verify` | Set to `true` to skip server certificate verification. Required with `tls=none`.                      |

### Destination connector

The Plakar FTP package provides a destination connector to restore snapshots to
remote directories reachable over FTP.

Restored files are written only inside the destination directory. A snapshot
entry whose path would resolve outside it, for example through `..` components,
is reported as failed and skipped.

Restore sets the permissions of each restored file and directory, including the
setuid, setgid, and sticky bits, using the `SITE CHMOD` command. The destination
directory itself keeps its existing permissions. File ownership is not restored.

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

| Option                   | Purpose                                                                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `location`               | `ftp://[user[:password]@]host[:port]/path` of the remote directory to restore to                                                         |
| `username`               | The username to authenticate as. Overrides the URI user.                                                                                 |
| `password`               | The password to authenticate with. Overrides the URI password.                                                                           |
| `tls`                    | TLS mode: `explicit` (default), `implicit`, or `none`. See [transport security](#transport-security).                                    |
| `tls_insecure_no_verify` | Set to `true` to skip server certificate verification. Required with `tls=none`.                                                         |
| `skip_permissions`       | Set to `true` to restore without setting file and directory permissions. Defaults to `false`. See [limitations](#limitations-and-scope). |

## Limitations and scope

**Snapshot consistency**

Changes during backup (creates, updates, deletes) may result in a snapshot that
reflects different points in time for different files. For highly dynamic paths,
consider quiescing the workload or backing up from a read-only replica.

**Permissions on servers without `SITE CHMOD`**

`SITE CHMOD` is a common extension rather than part of the core FTP standard
(RFC 959). On a server that lacks or refuses it, such as most Windows servers,
every restored file and directory is reported as failed, even though the files
are written. Earlier versions of the FTP package did not set permissions, so
restores to such servers start reporting failures after upgrading to v1.1.3. Set
`skip_permissions=true` on the destination to restore without setting
permissions.

## See also

- [SFTP / SSH](../sftp)
