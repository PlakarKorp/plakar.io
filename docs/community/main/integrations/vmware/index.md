
# VMware

The VMware integration backs up virtual machines managed by a vCenter Server and
restores them to vSphere. Each source targets a single virtual machine, and each
backup captures its disks along with the configuration needed to recreate it.

The integration includes two connectors:

| Connector type            | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| **Source connector**      | Back up a virtual machine from vSphere into a Kloset store.    |
| **Destination connector** | Restore a virtual machine from a Kloset store back to vSphere. |

Both connectors support two protocols. They capture the same data and differ
only in how disk data is transferred:

| Protocol     | Transfer path                                                    |
| ------------ | ---------------------------------------------------------------- |
| `vmware`     | Disk data over HTTPS through the vSphere API.                    |
| `vmware+nbd` | Disk data over TLS from a dedicated NBD server running `nbdkit`. |

**Requirements**

- A vCenter Server reachable from the machine running Plakar.
- vSphere credentials for that vCenter Server.
- For `vmware+nbd`, an NBD server reachable over SSH and TLS. See
  [Setting up an NBD Server for VMware Backups](/docs/control-plane/guides/vmware/nbd-server-setup).

## Installation

The VMware integration is distributed as a pre-built package only. Unlike most
Community integrations, it has no public source repository, so
`plakar pkg build` cannot produce it. It remains free to install with a Plakar
account. See
[source availability](../../guides/managing-packages/#source-availability) for
how this differs from the other integrations.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the VMware package:

```bash
$ plakar pkg add vmware
```

Verify installation:

```bash
$ plakar pkg show
```

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages).

## Identifying a virtual machine

The `location` of a source or destination selects the virtual machine by its
vCenter instance UUID, for example `vmware://<instance-uuid>`. The vCenter
Server and the datacenter containing the virtual machine are set separately with
`vsphere_server` and `vsphere_datacenter`.

The vSphere Client does not display the instance UUID. The UUID in the URL of a
virtual machine page belongs to the vCenter Server, not to the virtual machine,
and the UUID reported inside the guest operating system is a different
identifier. Retrieve the instance UUID with a vSphere API tool such as
[`govc`](https://github.com/vmware/govmomi/tree/main/govc), where it is exposed
as the `config.instanceUuid` property of the virtual machine.

## How a backup works

A backup starts by taking a temporary vSphere snapshot of the virtual machine.
Plakar reads the disks from that snapshot, so the virtual machine keeps running
during the backup. Alongside the disks, it stores the configuration needed to
recreate the virtual machine. The snapshot is removed once the backup completes.

## How a restore works

The `location` of a destination determines whether a restore overwrites an
existing virtual machine or creates a new one:

- **In place**, with `vmware://<instance-uuid>`. Plakar replaces the disks of
  the virtual machine with that instance UUID with the disks from the snapshot.
  The snapshot must have been taken from that same virtual machine. A running
  virtual machine is shut down before the swap and started again afterwards. The
  disks it had before the restore are deleted.
- **As a new virtual machine**, with `vmware://spawn`. Plakar creates a virtual
  machine from the configuration and disks stored in the snapshot, under the
  original name, adding a suffix if that name is already in use. The new virtual
  machine is left powered off.

Both modes work with either protocol, using `vmware+nbd://` in place of
`vmware://`.

### Network adapters

A virtual machine restored as new is attached to networks in the target
environment according to `network_adapter_restore_mode`:

- `preserve` maps each network of the original virtual machine to a compatible
  network of the same name in the target environment. The restore fails if any
  of them is missing. This is the default.
- `disconnected` attaches every adapter to the port group set in
  `network_recovery_port_group` and leaves it disconnected. The virtual machine
  can then be started without reaching any network, for example to inspect it
  after a ransomware incident.
- `remove` creates the virtual machine without network adapters.

## 1. `vmware` protocol

The `vmware` protocol transfers disk data over HTTPS through the vSphere API. It
requires only network access to vCenter. Throughput is typically limited to
around 30 MB/s.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["vSphere"]
  VM["Virtual Machine"]
  Snap["Temporary snapshot"]
  VM --> Snap
end

Via["vSphere API<br/>over HTTPS"]

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Snap --> Via --> Plakar --> Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Transform["Decrypt & reconstruct"]

Via["vSphere API<br/>over HTTPS"]

subgraph Destination["vSphere"]
  VM["Existing or new<br/>Virtual Machine"]
end

Store --> Plakar --> Transform --> Via --> VM
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to both source and destination connectors using the
`vmware` protocol.

| Option                    | Required | Description                                                                                           |
| ------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `location`                | Yes      | `vmware://<instance-uuid>`, or `vmware://spawn` for a destination restoring as a new virtual machine. |
| `vsphere_server`          | Yes      | Hostname or IP address of the vCenter Server.                                                         |
| `vsphere_datacenter`      | Yes      | Name of the vSphere datacenter containing the virtual machine.                                        |
| `vsphere_username`        | Yes      | vSphere account username.                                                                             |
| `vsphere_password`        | Yes      | vSphere account password.                                                                             |
| `vsphere_tls_ca_bundle`   | No       | PEM CA certificate used to verify the vCenter TLS certificate.                                        |
| `vsphere_tls_skip_verify` | No       | Skip vCenter TLS certificate verification. Defaults to `false`.                                       |

> [!WARNING]+ TLS Certificate Verification
>
> Setting `vsphere_tls_skip_verify=true` disables verification of the vCenter
> Server certificate, leaving the connection open to man-in-the-middle attacks.
> An attacker in that position can capture the vSphere credentials and read or
> alter virtual machine disks in transit. `nsx_skip_verify=true` does the same
> for the NSX Manager. Prefer setting `vsphere_tls_ca_bundle` for self-signed
> certificates. Never skip verification in production.

### Source configuration

When `nsx_url` is set, the backup also captures the NSX network state of the
virtual machine from the NSX Manager. NSX capture is only available with the
`vmware` protocol.

| Option            | Required | Description                                                 |
| ----------------- | -------- | ----------------------------------------------------------- |
| `nsx_url`         | No       | NSX Manager endpoint.                                       |
| `nsx_username`    | No       | NSX account username. Defaults to `vsphere_username`.       |
| `nsx_password`    | No       | NSX account password. Defaults to `vsphere_password`.       |
| `nsx_skip_verify` | No       | Skip NSX TLS certificate verification. Defaults to `false`. |

### Destination configuration

The following extra options are available to destination connectors using the
`vmware` protocol.

| Option                         | Required    | Description                                                                                                |
| ------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `network_adapter_restore_mode` | No          | `preserve`, `disconnected` or `remove`. See [Network adapters](#network-adapters). Defaults to `preserve`. |
| `network_recovery_port_group`  | Conditional | Port group used by `network_adapter_restore_mode=disconnected`. Required in that mode.                     |
| `tmp_dir`                      | No          | Local directory used to stage disk data during the restore.                                                |

### Example

Back up a virtual machine:

```bash
$ plakar source add myvm vmware://421b9d3a-8c2e-4f1a-9b7d-3e5f6a7b8c9d \
  vsphere_server=vcenter.example.com \
  vsphere_datacenter=Datacenter \
  vsphere_username=<username> \
  vsphere_password=<password>

$ plakar at /var/backups backup "@myvm"
```

Restore a snapshot as a new virtual machine with its network adapters
disconnected:

```bash
$ plakar destination add myvm-restore vmware://spawn \
  vsphere_server=vcenter.example.com \
  vsphere_datacenter=Datacenter \
  vsphere_username=<username> \
  vsphere_password=<password> \
  network_adapter_restore_mode=disconnected \
  network_recovery_port_group=quarantine

$ plakar at /var/backups restore -to "@myvm-restore" <snapshot_id>
```

## 2. `vmware+nbd` protocol

The `vmware+nbd` protocol transfers disk data through an NBD server running
`nbdkit` with the VMware VDDK plugin. It is used when the throughput of the
`vmware` protocol is not sufficient, and requires an NBD server set up
beforehand, as described in
[Setting up an NBD Server for VMware Backups](/docs/control-plane/guides/vmware/nbd-server-setup).

Plakar reaches the NBD server over SSH to manage `nbdkit`, and over TLS to
transfer disk data.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["vSphere"]
  VM["Virtual Machine"]
  Snap["Temporary snapshot"]
  VM --> Snap
end

subgraph NBDServer["NBD Server"]
  Nbdkit["nbdkit + VDDK"]
end

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Plakar -->|"SSH"| Nbdkit
Snap -->|"VDDK"| Nbdkit
Nbdkit -->|"NBD over TLS"| Plakar
Plakar --> Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Transform["Decrypt & reconstruct"]

subgraph NBDServer["NBD Server"]
  Nbdkit["nbdkit + VDDK"]
end

subgraph Destination["vSphere"]
  VM["Existing or new<br/>Virtual Machine"]
end

Store --> Plakar --> Transform
Transform -->|"SSH"| Nbdkit
Transform -->|"NBD over TLS"| Nbdkit
Nbdkit -->|"VDDK"| VM
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to both source and destination connectors using the
`vmware+nbd` protocol.

| Option                    | Required | Description                                                                                                                                             |
| ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `location`                | Yes      | `vmware+nbd://<instance-uuid>`, or `vmware+nbd://spawn` for a destination restoring as a new virtual machine.                                           |
| `vsphere_server`          | Yes      | Hostname or IP address of the vCenter Server.                                                                                                           |
| `vsphere_datacenter`      | Yes      | Name of the vSphere datacenter containing the virtual machine.                                                                                          |
| `vsphere_username`        | Yes      | vSphere account username.                                                                                                                               |
| `vsphere_password`        | Yes      | vSphere account password.                                                                                                                               |
| `vsphere_tls_ca_bundle`   | No       | PEM CA certificate used to verify the vCenter TLS certificate.                                                                                          |
| `vsphere_tls_skip_verify` | No       | Skip vCenter TLS certificate verification. Defaults to `false`.                                                                                         |
| `nbd_ssh_url`             | Yes      | SSH URL of the NBD server, for example `ssh://<user>@<host>:<port>`. This account runs `nbdkit` on the NBD server.                                      |
| `nbd_ssh_private_key`     | Yes      | SSH private key used to authenticate to the NBD server.                                                                                                 |
| `nbd_tls_ca_bundle`       | Yes      | PEM CA bundle used to verify the TLS certificate of the NBD server.                                                                                     |
| `nbd_url`                 | No       | TLS NBD URI, for example `nbds://[<user>:<password>@]<host>:<port>`. Defaults to the host of `nbd_ssh_url`. Credentials default to the vSphere account. |
| `nbd_tls_skip_verify`     | No       | Skip TLS certificate verification of the NBD server.                                                                                                    |

> [!WARNING]+ TLS Certificate Verification
>
> Setting `vsphere_tls_skip_verify=true` or `nbd_tls_skip_verify=true` disables
> certificate verification for the vCenter Server or the NBD server, leaving the
> connection open to man-in-the-middle attacks. An attacker in that position can
> capture the vSphere credentials and read or alter virtual machine disks in
> transit. Prefer setting `vsphere_tls_ca_bundle` and `nbd_tls_ca_bundle` for
> self-signed certificates. Never skip verification in production.

### Source configuration

The following extra options are available to source connectors using the
`vmware+nbd` protocol.

| Option        | Required | Description                      |
| ------------- | -------- | -------------------------------- |
| `nbd_verbose` | No       | Enable verbose `nbdkit` logging. |

### Destination configuration

The following extra options are available to destination connectors using the
`vmware+nbd` protocol.

| Option                         | Required    | Description                                                                                                |
| ------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `network_adapter_restore_mode` | No          | `preserve`, `disconnected` or `remove`. See [Network adapters](#network-adapters). Defaults to `preserve`. |
| `network_recovery_port_group`  | Conditional | Port group used by `network_adapter_restore_mode=disconnected`. Required in that mode.                     |
| `tmp_dir`                      | No          | Local directory used to stage disk data during the restore.                                                |

### Example

Back up a virtual machine:

```bash
$ plakar source add myvm-nbd vmware+nbd://421b9d3a-8c2e-4f1a-9b7d-3e5f6a7b8c9d \
  vsphere_server=vcenter.example.com \
  vsphere_datacenter=Datacenter \
  vsphere_username=<username> \
  vsphere_password=<password> \
  nbd_ssh_url=ssh://plakar@nbd.example.com \
  nbd_ssh_private_key="$(cat ~/.ssh/nbd_ed25519)" \
  nbd_tls_ca_bundle="$(cat ca-cert.pem)"

$ plakar at /var/backups backup "@myvm-nbd"
```

Restore a snapshot in place onto the virtual machine it was taken from:

```bash
$ plakar destination add myvm-nbd vmware+nbd://421b9d3a-8c2e-4f1a-9b7d-3e5f6a7b8c9d \
  vsphere_server=vcenter.example.com \
  vsphere_datacenter=Datacenter \
  vsphere_username=<username> \
  vsphere_password=<password> \
  nbd_ssh_url=ssh://plakar@nbd.example.com \
  nbd_ssh_private_key="$(cat ~/.ssh/nbd_ed25519)" \
  nbd_tls_ca_bundle="$(cat ca-cert.pem)"

$ plakar at /var/backups restore -to "@myvm-nbd" <snapshot_id>
```

## See also

- [Setting up an NBD Server for VMware Backups](/docs/control-plane/guides/vmware/nbd-server-setup)
- [VMware in Plakar Control Plane](/docs/control-plane/resources/compute/vmware)
- [Managing packages](../../guides/managing-packages)

