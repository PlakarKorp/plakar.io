
# Proxmox

The Proxmox integration allows Plakar Control Plane to back up and restore the
virtual machines and containers running on a Proxmox VE node. Rather than
reading disks directly, it drives Proxmox's own `vzdump` tool to produce a
backup archive, then ingests that archive into a Kloset store with encryption
and deduplication applied. Restores push an archive back to a node and hand it
to the native Proxmox restore tools, `qmrestore` for virtual machines and
`pct restore` for containers.

Because the integration relies on the tooling shipped with Proxmox, the
consistency of a backup is determined by `vzdump` and the backup mode it runs
with. See the
[Proxmox backup documentation](https://pve.proxmox.com/wiki/Backup_and_Restore)
for details.

## Inventory Management

Currently no
[managed inventory](../../infrastructure/inventories#managed-inventories) has
the capability of discovering Proxmox resources. You must configure a
[self-managed inventory](../../infrastructure/inventories/self-managed) before
adding a Proxmox resource.

### Adding Proxmox as a resource

When using a self-managed inventory, register the resource with `Hypervisor` as
the class and `Proxmox` as the subclass. For the endpoint, use the hostname or
IP address of the Proxmox node. See [resources documentation](../../resources)
for more information on how to set up resources on a self-managed inventory.

A single resource represents one Proxmox node. Which workloads on that node are
backed up is decided by the source app configuration, not by the resource
itself.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Proxmox["Proxmox node"]
    Vzdump["vzdump"]
    Workloads["Virtual machines & containers"]
    Dump["Dump directory"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["Proxmox<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"SSH: run vzdump"| Vzdump
  Vzdump --> Workloads
  Vzdump -->|"write archive"| Dump
  Dump -->|"archive transfer"| Source
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
    Destination["Proxmox<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Proxmox["Proxmox node"]
    Dump["Dump directory"]
    Tools["qmrestore / pct restore"]
    VM["Restored virtual machine or container"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"archive transfer"| Dump
  Destination -->|"SSH: run restore"| Tools
  Dump --> Tools
  Tools --> VM
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared configuration

The following settings are available when configuring both source and
destination apps.

- **Mode**: Required. The execution mode for Proxmox operations. In local mode
  the operation runs directly on the Proxmox node alongside `vzdump`. In remote
  mode it runs on a separate machine and connects to the node over SSH, so a
  single deployment can back up an entire fleet of hypervisors. The `Conn`
  settings below only apply in remote mode.
- **Conn Method**: The SSH connection method used when **Mode** is remote. It
  selects which of the credentials below is used to authenticate.
- **Conn Username**: The Proxmox SSH username used in remote mode.
- **Conn Password**: The password used when **Conn Method** is set to password
  authentication.
- **Conn Identity File**: The path to the private key used when **Conn Method**
  is set to identity authentication.
- **Dump Dir**: The directory on the node used to create and read `vzdump`
  archives. Defaults to `/var/lib/vz/dump`. This directory needs enough free
  space to hold the archive of the largest workload being backed up or restored.
- **Backup Mode**: The `vzdump` backup behaviour, which determines how running
  workloads are handled while the archive is created. Defaults to `snapshot`.
- **Backup Compression**: The compression used by `vzdump` when writing the
  archive. Defaults to `0`.
- **Cleanup**: Deletes the temporary `vzdump` files from the dump directory
  after an operation completes. Leaving it disabled keeps the archive on the
  node, which consumes space but avoids regenerating it.
- **Node**: The Proxmox node name. Optional, and only needed to target a
  specific node in a cluster.

## Source configuration

The following extra settings are available when configuring a source app. They
select which workloads are backed up.

- **VMID**: Backs up a single virtual machine or container by ID.
- **Pool**: Backs up every virtual machine and container belonging to the given
  pool.
- **All**: Backs up everything on the node. This is not recommended, since the
  set of workloads is then implicit and grows silently as the node changes.

## Destination configuration

The following extra settings are available when configuring a destination app.

- **Newid**: The VMID the workload is restored as. Use it to restore alongside
  an existing machine rather than over it.
- **Storage**: The Proxmox storage the restored disks are written to.
- **Pool**: The pool the restored workload is assigned to.
- **Force VM Restore**: Stops a running virtual machine or container before the
  restore when necessary. Without it, a restore that targets a running workload
  cannot proceed.
- **Start On Restore**: Starts the virtual machine or container once the restore
  completes successfully.

