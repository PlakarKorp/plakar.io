
# FTP

The FTP integration backs up directories from an FTP server and restores
snapshots to an FTP server. It supports plain FTP and FTPS (FTP with TLS), with
FTPS enabled by default. SFTP (SSH File Transfer Protocol) is a different
protocol handled by the [SFTP integration](../sftp).

The integration includes two connectors:

| Connector type            | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| **Source connector**      | Back up a remote directory reachable over FTP into a Kloset store. |
| **Destination connector** | Restore data from a Kloset store to an FTP target.                 |

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

## Transport security

The connector encrypts the connection with FTPS by default. The `tls` option
selects how TLS is negotiated:

| Value      | Behaviour                                                                                                                              |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `explicit` | Default. Connects on the FTP port and upgrades the connection with `AUTH TLS`.                                                         |
| `implicit` | Starts TLS as soon as the connection opens. Servers usually expect this on port `990`, which must be set with `port` or in `location`. |
| `none`     | Plain FTP. Credentials and data are sent unencrypted.                                                                                  |

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

## Configuration

Both connectors address a directory on the FTP server with an `ftp://` URL.
Credentials can be given in the URL or as separate options.

#### Backup flow

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

#### Restore flow

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

### Shared configuration

The following options apply to both source and destination connectors. They are
set with `plakar source add` or `plakar destination add`, and changed with
`plakar source set` or `plakar destination set`.

| Option                   | Required | Description                                                                                                         |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `location`               | Yes      | `ftp://[user[:password]@]host[:port]/path`. The remote directory to back up, or the remote directory to restore to. |
| `username`               | No       | The username to authenticate as. Ignored when `location` includes a user.                                           |
| `password`               | No       | The password to authenticate with. Ignored when `location` includes a password.                                     |
| `port`                   | No       | FTP server port, used when `location` has no port. Defaults to `21`.                                                |
| `root`                   | No       | Absolute path of the remote directory. Overrides the path in `location`. Defaults to `/` when neither is set.       |
| `tls`                    | No       | TLS mode: `explicit`, `implicit` or `none`. Defaults to `explicit`. See [Transport security](#transport-security).  |
| `tls_insecure_no_verify` | No       | Set to `true` to skip server certificate verification. Required with `tls=none`. Defaults to `false`.               |

### Destination configuration

The following option is available to the destination connector, in addition to
those in [Shared configuration](#shared-configuration).

| Option             | Required | Description                                                                                                                       |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `skip_permissions` | No       | Restore without setting file and directory permissions. Defaults to `false`. See [Limitations and scope](#limitations-and-scope). |

### Restore behaviour

Restore sets the permissions of each restored file and directory, including the
setuid, setgid, and sticky bits, using the `SITE CHMOD` command. The destination
directory itself keeps its existing permissions. File ownership is not restored.

Restored files are written only inside the destination directory. A snapshot
entry whose path would resolve outside it, for example through `..` components,
is reported as failed and skipped.

### Example

Back up a remote directory:

```bash
# Configure a source pointing to the remote FTP directory
$ plakar source add ftp_src ftp://ftp.example.org/pub/somedirectory

# Back up the remote directory to a Kloset store on the filesystem
$ plakar at /var/backups backup "@ftp_src"
```

Restore a snapshot to a remote directory:

```bash
# Configure a destination pointing to the remote FTP directory
$ plakar destination add ftp_dst ftp://ftp.example.org/upload

# Restore a snapshot to the remote FTP directory
$ plakar at /var/backups restore -to "@ftp_dst" <snapshot_id>
```

## Limitations and scope

Files that are created, updated or deleted during a backup can leave the
snapshot reflecting different points in time for different files. For highly
dynamic paths, quiesce the workload or back up from a read-only replica.

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

