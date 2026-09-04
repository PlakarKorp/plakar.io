
# SFTP

The SFTP integration allows Plakar Control Plane to back up and restore files on
any remote machine reachable over SSH. Plakar connects to the remote machine
over SSH and reads or writes files directly under the configured root path using
SFTP.

## Inventory Management

Currently no
[managed inventory](../../infrastructure/inventories#managed-inventories) has
the capability of discovering SFTP resources. You need to set up a
[self-managed inventory](../../infrastructure/inventories/self-managed) before
adding an SFTP resource.

### Adding SFTP as a resource

When using a self-managed inventory, you must register your resources manually
or import them from a CSV file.

To add an SFTP machine as a resource, use **Services** as the `class` and
**Sftp** as the `subclass`. For the endpoint, use the IP address or hostname of
the target machine. See [resources documentation](../../resources) for more
information on how to set up resources on a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Remote["Remote Machine"]
    Files["Filesystem<br/>Root path"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["SFTP<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"SSH/SFTP connection"| Files
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
    Destination["SFTP<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Remote["Remote Machine"]
    Files["Filesystem<br/>Root path"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"SSH/SFTP connection"| Files
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared configuration

The following settings are available when configuring a source, store, or
destination app.

- **Port**: The TCP/UDP port number the SSH service is listening on. Defaults to
  `22`.
- **Root**: The absolute filesystem path to use as the root for backup
  operations. Defaults to `/`.
- **Ssh Private Key**: SSH private key material (PEM/OpenSSH) to load into
  `ssh-agent` via `ssh-add` (not supported on Windows). Generate a dedicated SSH
  keypair for PCP and add the public key to the remote machine's authorized keys
  before configuring this field, then copy the private key in full, including
  the header and footer lines, into this field:

  ```txt
  -----BEGIN OPENSSH PRIVATE KEY-----
  ...
  -----END OPENSSH PRIVATE KEY-----
  ```

- **Username**: The SFTP username to authenticate as on the remote machine. This
  field cannot be used if the hostname already includes a `user@host` format.

## Store configuration

The following extra settings are available when configuring a store app.

- **Kloset Passphrase**: The passphrase Plakar Control Plane uses to encrypt the
  store. This passphrase is required to access the store and must be kept safe.

## Destination configuration

The following extra settings are available when configuring a destination app.

- **Set Owner**: Sets the owner and group of restored files to match the
  original snapshot. Requires the SSH user configured for PCP to have superuser
  permissions on the remote machine.

## Permissions

The SSH user configured for PCP must have read access to the paths being backed
up. For store or destination use, write access is also required. It is
recommended to create a dedicated user and keypair for Plakar Control Plane
rather than reusing personal credentials.

