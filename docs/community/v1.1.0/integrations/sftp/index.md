
# SFTP / SSH

The SFTP integration backs up and restores directories on remote servers over
SFTP, the file transfer protocol that runs over SSH. It can also host a Kloset
store on an SFTP server.

The integration includes three connectors:

| Connector type            | Description                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| **Source connector**      | Back up a remote directory reachable over SFTP into a Kloset store. |
| **Destination connector** | Restore data from a Kloset store to an SFTP target.                 |
| **Store connector**       | Host a Kloset store on any SFTP-accessible server.                  |

The connectors can be combined with each other and with other Plakar connectors.

**Requirements**

- An SFTP/SSH server with appropriate read and write permissions.

## Installation

The SFTP integration is distributed as a Plakar package.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the SFTP package:

```bash
$ plakar pkg add sftp
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
$ plakar pkg build sftp
```

A package archive will be created in the current directory (e.g.,
`sftp_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add -allow-unsigned ./sftp_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## SSH access

Plakar connects to the server over SSH. The username, port and identity file are
best set in the SSH configuration (`~/.ssh/config`) under a host alias, which
Plakar then references in its URLs.

### Host aliases

A host alias in `~/.ssh/config` keeps Plakar commands short and independent of
the actual host details:

```bash
Host sftp-prod
  HostName host.example.com
  User sftpuser
  Port 22
  IdentityFile ~/.ssh/id_ed25519_plakar
```

Test the alias:

```bash
$ sftp sftp-prod
```

Then reference it in Plakar URLs:

```bash
$ plakar store add sftp_store sftp://sftp-prod/backups
$ plakar source add sftp_src sftp://sftp-prod/srv/data
$ plakar destination add sftp_dst sftp://sftp-prod/srv/restore
```

### Key-based authentication

Unattended jobs must not prompt for passwords, so SSH authentication must be
key-based and passwordless:

```bash
$ ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_plakar -C plakar@backup
$ ssh-copy-id -i ~/.ssh/id_ed25519_plakar.pub sftpuser@host.example.com
$ sftp -i ~/.ssh/id_ed25519_plakar sftpuser@host.example.com
```

If the private key is encrypted, load it into an SSH agent:

```bash
$ eval "$(ssh-agent -s)"
$ ssh-add ~/.ssh/id_ed25519_plakar
```

The key can also be set on the connector itself. `identity` points to a private
key file. `ssh_private_key` passes the key material directly, and Plakar loads
it into the SSH agent for the duration set by `ssh_private_key_ttl`.
`ssh_auth_sock` selects the agent socket to use.

### Host keys

The server's host key is verified before connecting, against
`~/.ssh/known_hosts` or against the entry given in `host_key`. In production,
keep verification enabled and manage `~/.ssh/known_hosts` normally.
`insecure_ignore_host_key=true` disables verification and should only be used in
isolated test environments.

## Configuration

The SFTP connectors read from and write to a directory on the server, addressed
by an `sftp://` URL. The same URL format is used whether the directory is backed
up, restored to, or used to host a Kloset store.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["SFTP Server"]
  FS["/srv/data"]
end

Plakar["Plakar"]

Via["Retrieve data via<br/>SFTP source connector"]

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

Via["Push data via<br/>SFTP destination connector"]

subgraph Destination["SFTP Server"]
  FS["/srv/data"]
end

Store --> Plakar --> Via --> FS
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Store flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Source["Source data"]

Source --> Plakar["Plakar"]

Via["Store snapshot via<br/>SFTP storage connector"]

subgraph Store["SFTP Server"]
  Kloset["Kloset Store"]
end

Plakar --> Via --> Kloset
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to the source, destination and store connectors.

| Option                     | Required | Description                                                                                                                      |
| -------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `location`                 | Yes      | `sftp://[user@]host[:port][/path]`. The remote directory to back up, the remote directory to restore to, or the store directory. |
| `username`                 | No       | SSH username. Cannot be set when `location` already includes `user@`.                                                            |
| `port`                     | No       | SSH port. Defaults to `22`.                                                                                                      |
| `root`                     | No       | Absolute path on the server. Defaults to `/`.                                                                                    |
| `identity`                 | No       | Path to the SSH private key file.                                                                                                |
| `ssh_private_key`          | No       | SSH private key material in PEM or OpenSSH format, loaded into the SSH agent.                                                    |
| `ssh_private_key_ttl`      | No       | How long the key loaded from `ssh_private_key` stays in the agent, for example `5s`, `1m` or `1h`. Defaults to `5s`.             |
| `ssh_auth_sock`            | No       | Path to the SSH agent socket.                                                                                                    |
| `host_key`                 | No       | Host key entry used to verify the server, for example `example.com ssh-rsa AAAAB3NzaC1yc2E...`.                                  |
| `insecure_ignore_host_key` | No       | Disable host key verification. Defaults to `false`. Use only for testing.                                                        |

`ssh_private_key`, `ssh_private_key_ttl` and `ssh_auth_sock` are not supported
on Windows.

> [!WARNING]+ Host Key Verification
>
> Setting `insecure_ignore_host_key=true` disables host key verification, so
> Plakar connects to any server that answers at the configured address,
> including one impersonating it. That server can then read and alter all data
> transferred, including backed-up files and Kloset store contents. Only use
> this in disposable test environments. Never use it with production servers,
> servers reached over the internet, or any production data.

### Destination configuration

The following extra options are available to the destination connector.

| Option             | Required | Description                                                                                                                           |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `set_owner`        | No       | Set the owner and group of restored files. Requires superuser permissions on the server. Defaults to `false`.                         |
| `skip_permissions` | No       | Skip restoring permission bits, including the setuid, setgid and sticky bits, on restored files and directories. Defaults to `false`. |

### Example

Create a Kloset store on an SFTP server and use it:

```bash
# Configure the Kloset store
$ plakar store add sftp_store sftp://sftp-prod/backups

# Initialize the Kloset store
$ plakar at "@sftp_store" create

# List snapshots in the Kloset store
$ plakar at "@sftp_store" ls

# Verify integrity of the Kloset store
$ plakar at "@sftp_store" check

# Backup a local folder to the Kloset store
$ plakar at "@sftp_store" backup /etc

# Backup a source configured in Plakar to the Kloset store
$ plakar at "@sftp_store" backup "@my_source"
```

Back up a remote directory:

```bash
# Configure a source pointing to the remote SFTP directory
$ plakar source add sftp_src sftp://sftp-prod/srv/data

# Back up the remote directory to the Kloset store on the filesystem
$ plakar at /var/backups backup "@sftp_src"

# Or back up the remote directory to the Kloset store on SFTP created above
$ plakar at "@sftp_store" backup "@sftp_src"
```

Restore a snapshot to a remote directory:

```bash
# Configure a destination pointing to the remote SFTP directory
$ plakar destination add sftp_dst sftp://sftp-prod/srv/restore

# Restore a snapshot from a filesystem-hosted Kloset store to the remote SFTP directory
$ plakar at /var/backups restore -to "@sftp_dst" <snapshot_id>

# Or restore a snapshot from the Kloset store on SFTP created above to the remote SFTP directory
$ plakar at "@sftp_store" restore -to "@sftp_dst" <snapshot_id>
```

Snapshots can be moved between two SFTP-hosted stores by defining both stores
and synchronizing them with `plakar at "@store1" sync to "@store2"`.

## Limitations and scope

Files that change during a backup can leave the snapshot reflecting different
points in time for different files. For highly dynamic paths, quiesce the
workload or back up from a read-only replica.

## Troubleshooting

- **SSH works but SFTP fails**: the SFTP subsystem must be enabled on the
  server.
- **Path not found on a chrooted account**: the path in `location` is relative
  to the chroot, not to the server's filesystem root.

## See also

- [Plakar Architecture (Kloset Engine)](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)
- [OpenSSH / SFTP Documentation](https://man.openbsd.org/sftp.1)

