
# Updating Proxmox VM ISO image for Plakar Control Plane

Plakar Control Plane is distributed on Proxmox as a virtual appliance, deployed
by creating a VM and booting it from the Plakar Control Plane appliance ISO.

Most Plakar Control Plane updates can be installed directly from the settings
page without touching the VM. However, in rare cases, the underlying appliance
ISO also needs to be updated. This usually happens when infrastructure-level
changes are required.

## Deployment layout

The appliance ISO is immutable and runs entirely in RAM. Its contents do not
persist across reboots. Persistent Plakar Control Plane data and configuration
are stored on the VM's disk (`scsi0`).

Because the appliance is separated from its persistent data, updating the
appliance does not require replacing the VM or its disk. Swapping the mounted
ISO and restarting the existing VM is enough. The new ISO boots using the same
persistent disk.

## Updating the appliance

The update process consists of:

1. Uploading the new ISO
2. Stopping the VM
3. Swapping the mounted ISO
4. Starting the VM
5. Verifying the update

{{< steps >}}

{{< step >}}

### Upload the new ISO

Download the newer Plakar Control Plane appliance ISO from the
[downloads](/download) page and upload it to the **ISO Images** section of the
same Proxmox storage used for the current ISO. Refer to
[Uploading the ISO](../../../intro/installation/virtual-machines/proxmox#uploading-the-iso)
in the Proxmox installation guide for details.

{{< /step >}}

{{< step >}}

### Stop the VM

Stop the currently running Plakar Control Plane VM.

```bash
qm stop <vmid>
```

{{< /step >}}

{{< step >}}

### Swap the mounted ISO

Point `ide2` to the newly uploaded ISO.

```bash
qm set <vmid> -ide2 <storage>:iso/<new-iso-filename>,media=cdrom
```

Confirm the change:

```bash
qm config <vmid>
```

> [!NOTE]+
>
> This only replaces the appliance ISO. The VM's persistent disk (`scsi0`), EFI
> disk (`efidisk0`), and cloud-init drive (`ide3`), if present, are untouched.

{{< /step >}}

{{< step >}}

### Start the VM

Start the VM.

```bash
qm start <vmid>
```

The appliance boots from the new ISO and uses the existing persistent disk.
inventories, schedules, policies, configuration, and other Plakar Control Plane
data will remain intact.

{{< /step >}}

{{< step >}}

### Verify

Once the VM is reachable on the network, open Plakar Control Plane in a browser
as usual and confirm that the appliance is running the new version and that
existing data is present.

{{< /step >}}

{{< /steps >}}

