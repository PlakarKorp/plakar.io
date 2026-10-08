---
title: "VMware"
date: "2026-09-28T00:00:00Z"
weight: 31
summary: "Back up and restore VMware vSphere virtual machines with Plakar."
---

# VMware

The VMware integration backs up virtual machines managed by a vCenter Server and
restores them to vSphere. Each source targets a single virtual machine, and each
backup captures its disks along with the configuration needed to recreate it.

The integration includes two connectors:

| Connector type            | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| **Source connector**      | Back up a virtual machine from vSphere into a Kloset store.    |
| **Destination connector** | Restore a virtual machine from a Kloset store back to vSphere. |

**Requirements**

- A vCenter Server reachable from the machine running Plakar.
- vSphere credentials for that vCenter Server.

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
as the `config.instanceUuid` property of the virtual machine. For a virtual
machine named `myvm` in the `Datacenter` datacenter:

```bash
$ export GOVC_URL=vcenter.example.com
$ export GOVC_USERNAME=<username>
$ export GOVC_PASSWORD=<password>
$ govc object.collect -s /Datacenter/vm/myvm config.instanceUuid
421b9d3a-8c2e-4f1a-9b7d-3e5f6a7b8c9d
```

A virtual machine inside a folder is addressed by its full inventory path, such
as `/Datacenter/vm/production/myvm`.

## How a backup works

A backup starts by taking a temporary vSphere snapshot of the virtual machine.
Plakar reads the disks from that snapshot, so the virtual machine keeps running
during the backup. Alongside the disks, it stores the configuration needed to
recreate the virtual machine. The snapshot is removed once the backup completes.

### Transport modes

A backup transfers disks in one of two modes, set with `transport_mode`, and the
mode decides the format the disks are stored in.

| Mode      | Disk format           | Transfer                           |
| --------- | --------------------- | ---------------------------------- |
| `nbd`     | Raw disk contents     | Streamed over the ESXi NFC socket. |
| `nfchttp` | Stream-optimized VMDK | Downloaded over vCenter HTTP NFC.  |

`nbd` is the default. It replaces the former `vmware+nbd` protocol, and no
longer needs a separate NBD server. `nfchttp` produces the stream-optimized VMDK
files earlier versions of the integration produced.

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

## Data flow

### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["vSphere"]
  VM["Virtual Machine"]
  Snap["Temporary snapshot"]
  VM --> Snap
end

Via["NFC<br/>disk transfer"]

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Snap --> Via --> Plakar --> Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Restore flow

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

## Configuration

### Shared configuration

The following options apply to both source and destination connectors.

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
virtual machine from the NSX Manager.

| Option            | Required | Description                                                                     |
| ----------------- | -------- | ------------------------------------------------------------------------------- |
| `transport_mode`  | No       | `nbd` or `nfchttp`. See [Transport modes](#transport-modes). Defaults to `nbd`. |
| `nsx_url`         | No       | NSX Manager endpoint.                                                           |
| `nsx_username`    | No       | NSX account username. Defaults to `vsphere_username`.                           |
| `nsx_password`    | No       | NSX account password. Defaults to `vsphere_password`.                           |
| `nsx_skip_verify` | No       | Skip NSX TLS certificate verification. Defaults to `false`.                     |

### Destination configuration

| Option                         | Required    | Description                                                                                                |
| ------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `network_adapter_restore_mode` | No          | `preserve`, `disconnected` or `remove`. See [Network adapters](#network-adapters). Defaults to `preserve`. |
| `network_recovery_port_group`  | Conditional | Port group used by `network_adapter_restore_mode=disconnected`. Required in that mode.                     |
| `tmp_dir`                      | No          | Local directory used to stage disk data during the restore. Defaults to `/home/plakar/tmp`.                |

## Examples

Back up a virtual machine as raw disks, the default:

```bash
$ plakar source add myvm vmware://421b9d3a-8c2e-4f1a-9b7d-3e5f6a7b8c9d \
  vsphere_server=vcenter.example.com \
  vsphere_datacenter=Datacenter \
  vsphere_username=<username> \
  vsphere_password=<password>

$ plakar at /var/backups backup "@myvm"
```

Back up the same virtual machine as stream-optimized VMDK instead:

```bash
$ plakar source add myvm-vmdk vmware://421b9d3a-8c2e-4f1a-9b7d-3e5f6a7b8c9d \
  vsphere_server=vcenter.example.com \
  vsphere_datacenter=Datacenter \
  vsphere_username=<username> \
  vsphere_password=<password> \
  transport_mode=nfchttp
```

Restore a snapshot in place onto the virtual machine it was taken from:

```bash
$ plakar destination add myvm-inplace vmware://421b9d3a-8c2e-4f1a-9b7d-3e5f6a7b8c9d \
  vsphere_server=vcenter.example.com \
  vsphere_datacenter=Datacenter \
  vsphere_username=<username> \
  vsphere_password=<password>

$ plakar at /var/backups restore -to "@myvm-inplace" <snapshot_id>
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

## See also

- [VMware in Plakar Control Plane](/docs/control-plane/resources/compute/vmware)
- [Managing packages](../../guides/managing-packages)
