
# VMware Compute

VMware Compute resources represent virtual machines managed by VMware vSphere,
backed up and restored through the `vmware` protocol of the VMware integration.
Plakar connects to vCenter through the vSphere API to drive each operation, and
transfers virtual machine disks directly from vSphere without requiring any
additional infrastructure.

## Inventory Management

Virtual machines are discovered by the
[VMware inventory](../../inventories/managed/vmware), which connects to a
vCenter Server and loads its compute instances each time it synchronizes.
Resources in a VMware inventory are managed by the inventory and cannot be
created or deleted manually.

## Backup and restore

A backup takes a temporary vSphere snapshot of the virtual machine and reads its
disks from that snapshot, so the virtual machine keeps running during the
backup. Alongside the disks, it stores the configuration needed to recreate the
virtual machine. The snapshot is removed once the backup completes.

A restore replaces the disks of the virtual machine the destination app points
at with the disks from the restore point, which must have been taken from that
same virtual machine. A running virtual machine is shut down before the swap and
started again afterwards. The disks it had before the restore are deleted.

> [!NOTE]
>
> Restoring onto the existing virtual machine is currently the only restore mode
> available in Plakar Control Plane. This is a limitation of the Plakar Control
> Plane interface only. The VMware integration itself can already restore a
> backup as a new virtual machine. Until the interface supports it, this restore
> mode is available through the
> [community integration](/docs/community/main/integrations/vmware/#how-a-restore-works).

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph VMware["VMware vSphere"]
    VCenter["vCenter / ESXi"]
    VM["Virtual Machine"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["VMware Compute<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"vSphere API over HTTPS"| VCenter
  VCenter --> VM
  VM -->|"Disk data: hotadd, nbd or nfchttp"| Source
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
    Destination["VMware Compute<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph VMware["VMware vSphere"]
    VCenter["vCenter / ESXi"]
    VM["Restored Virtual Machine"]
  end

  Store --> Restore
  Destination --> Restore

  Restore -->|"disk data transfer"| Destination
  Destination -->|"vSphere API over HTTPS"| VCenter
  VCenter --> VM
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Transport modes

A source app transfers disks in one of three modes, and the mode decides the
format the disks are stored in.

| Mode      | Disk format           | Transfer                                                |
| --------- | --------------------- | ------------------------------------------------------- |
| `hotadd`  | Raw disk contents     | Attached to the machine running the job and read there. |
| `nbd`     | Raw disk contents     | Streamed over the ESXi NFC socket.                      |
| `nfchttp` | Stream-optimized VMDK | Downloaded over vCenter HTTP NFC.                       |

The default, `auto`, uses `hotadd` when the task runs on an edge set up as
described in
[Running VMware tasks on an edge](#running-vmware-tasks-on-an-edge), and `nbd`
otherwise. Selecting `hotadd` makes the backup fail instead of falling back to
`nbd`. Restores use `hotadd` under the same conditions, and `nbd` otherwise.

## Running VMware tasks on an edge

`nbd` and `nfchttp` work wherever a VMware task runs. To use `hotadd`, tasks
must run on an [edge](../../../edges) that can attach the disks of the virtual
machines to itself and read them as local block devices. This keeps disk data
off the network.

Set up the edge hosts of an edge pool as follows:

- Each edge runs in a virtual machine managed by the same vCenter Server.
- The user running the edge is in the `disk` group, so it can read block
  devices.
- That virtual machine has a SCSI controller with empty slots. Hot-add attaches
  the disks being transferred to these slots, so add empty slots to it before
  using `hotadd`.
- The vSphere account has the `VirtualMachine.Config.AddRemoveDevice` privilege
  on that virtual machine.

Then assign the VMware resources to that pool, so their tasks run on those
edges. See [selecting an edge](../../../edges/running-tasks#selecting-an-edge).

An edge cannot back up its own virtual machine over `hotadd`. With `auto`, that
backup uses `nbd`.

## Shared configuration

The following settings are available when configuring both source and
destination apps.

- **vSphere Server**: Required. The hostname or IP address of the vCenter Server
  or ESXi host.
- **vSphere Datacenter**: Required. The vSphere datacenter that holds the
  virtual machine.
- **vSphere Username**: Required. The username used to authenticate with the
  vCenter Server or ESXi host.
- **vSphere Password**: Required. The password for the vSphere account.
- **vSphere TLS CA Bundle**: The CA certificate bundle used to verify the
  vCenter Server or ESXi TLS certificate.
- **vSphere TLS Skip Verify**: Skip TLS certificate verification when connecting
  to the vCenter Server or ESXi host. Defaults to `false`.

> [!WARNING]+ TLS Certificate Verification
>
> Enabling **vSphere TLS Skip Verify** disables verification of the vCenter
> Server or ESXi certificate, leaving the connection open to man-in-the-middle
> attacks. An attacker in that position can capture the vSphere credentials and
> read or alter virtual machine disks in transit. Prefer setting **vSphere TLS
> CA Bundle** for self-signed certificates. The same applies to **NSX Skip
> Verify** for the NSX manager. Never skip verification in production.

## Source configuration

The following extra settings are available when configuring a source app.

- **Transport Mode**: How disks are transferred and stored, one of `auto`,
  `hotadd`, `nbd` or `nfchttp`. Defaults to `auto`. See
  [Transport modes](#transport-modes).
- **NSX URL**: The NSX manager endpoint address.
- **NSX Username**: The username used to authenticate with the NSX manager.
  Defaults to **vSphere Username** when omitted.
- **NSX Password**: The password for the NSX account. Defaults to **vSphere
  Password** when omitted.
- **NSX Skip Verify**: Skip TLS certificate verification when connecting to the
  NSX manager. Defaults to **vSphere TLS Skip Verify** when omitted.

> [!NOTE]
>
> NSX configuration is backed up only when **NSX URL** is set. Plakar Control
> Plane does not restore NSX configurations.

## Destination configuration

The following extra settings are available when configuring a destination app.

- **Network Adapter Restore Mode**: How network adapters on the restored virtual
  machine are handled. One of `preserve`, `disconnected` or `remove`. Defaults
  to `preserve`.
- **Network Recovery Port Group**: A compatible recovery or quarantine port
  group. Required when Network Adapter Restore Mode is `disconnected`.

> [!NOTE]
>
> **Network Adapter Restore Mode** and **Network Recovery Port Group** only
> apply to a restore as a new virtual machine. They are not used by a restore
> onto the existing virtual machine.

