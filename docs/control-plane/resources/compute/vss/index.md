
# Volume Shadow Copy Service (VSS)

The VSS integration allows Plakar Control Plane to back up and restore a
directory on a live Windows host. Plakar connects to the Windows host over SSH,
requests a VSS snapshot of the volume containing the target directory, then
copies the files from the read-only snapshot over SFTP. It is also the base
integration other Windows-specific integrations build on, such as
[Microsoft SQL Server](../../database/mssql) and
[Microsoft Active Directory](../../identity/msad).

## Inventory Management

Currently no
[managed inventory](../../infrastructure/inventories#managed-inventories) has
the capability of discovering Windows resources. You need to set up a
[self-managed inventory](../../infrastructure/inventories/self-managed) before
adding a VSS resource.

### Adding VSS as a resource

When using a self-managed inventory, you must register your resources manually
or import them from a CSV file.

To add a Windows machine as a resource, register it with no class or subclass.
For the endpoint, use the IP address or hostname of the target machine. See
[resources documentation](../../resources) for more information on how to set up
resources on a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Windows["Windows Host"]
    VSS["VSS Snapshot"]
    Files["Filesystem<br/>Root path"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["VSS<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"SSH: requests VSS <br/> snapshot"| VSS
  VSS --> Files
  Files -->|"SFTP: file transfer"| Source
  Source --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["VSS<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Windows["Windows Host"]
    Files["Filesystem<br/>Root path"]
  end

  Store --> Restore
  Destination --> Restore

  Restore -->|"SSH: executes restore <br/> operations"| Destination
  Destination -->|"SFTP: transfers <br/> restored files"| Files
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared configuration

The following settings are available when configuring both source and
destination apps.

- **Port**: The SSH server port. Defaults to `22` if left empty.
- **Root**: Required. The absolute path to the Windows drive and directory which
  should be backed up, e.g. `/C:/Users/Administrator/Documents`.
- **Ssh Private Key**: To authenticate with the remote machine, PCP uses SSH
  key-based authentication. Generate a dedicated SSH keypair for PCP and add the
  public key to the remote machine's authorized keys before configuring this
  field (see
  [Setting up SSH access on the Windows host](#setting-up-ssh-access-on-the-windows-host)
  below), then copy the private key in full, including the header and footer
  lines, into this field:

  ```txt
  -----BEGIN OPENSSH PRIVATE KEY-----
  ...
  -----END OPENSSH PRIVATE KEY-----
  ```

- **Username**: Required. The name of an administrative user account to perform
  the backup or restore with, e.g. `Administrator`.

### Setting up SSH access on the Windows host

The `vss` integration relies on OpenSSH Server being installed, running, and
reachable on the Windows host before it can be used, with a dedicated SSH key
authorized for the administrative account Plakar connects as.

See
[Setting Up OpenSSH Server on Windows](../../guides/windows/windows-openssh-setup)
for step-by-step instructions on installing OpenSSH Server, opening port 22, and
authorizing an SSH key.

