---
title: "Proxmox VE"
date: "2026-07-17T00:00:00Z"
weight: 2
summary: "How to install Plakar Control Plane on Proxmox VE"
---

# Proxmox VE Installation

Plakar Control Plane can be deployed on Proxmox VE by creating a virtual machine
manually and booting it from the Plakar Control Plane ISO image. The official
ISO image can be downloaded from the
[Plakar Control Plane Downloads Page](https://www.plakar.io/download).

## Uploading the ISO

Before creating the virtual machine, the ISO needs to be added to a storage
location on your Proxmox node so it can be attached as installation media.

In the Proxmox web interface, select the storage you want to hold the ISO from
the left-hand tree, then open its **ISO Images** section. From here you can
either upload the file directly from your computer, or provide a publicly
accessible URL and have Proxmox download it for you. Either way, you can
optionally supply a checksum and select the hashing algorithm used, so Proxmox
verifies the file's integrity once it's added.

![Uploading ISO image to Proxmox VE](../images/uploading-iso-to-proxmox.png)

> [!NOTE]+
>
> Prefer a shared storage location if your Proxmox node is part of a cluster. An
> ISO or disk kept on node-local storage won't be reachable if the virtual
> machine ever needs to run on a different node.

## Creating the Virtual Machine

Click **Create VM** in the top-right of the Proxmox interface to open the
creation wizard.

### General

Give the virtual machine a name. The VM ID can be left at its pre-assigned value
unless you need a specific one for your environment.

![](../images/proxmox-ve-1.png)

### OS

Set **Use CD/DVD disc image file (iso)**, choose the storage where you uploaded
the ISO, and select the Plakar Control Plane image from the list. For **Guest
OS**, set the type to **Linux** and the version to **7.x - 2.6 Kernel**.

![](../images/proxmox-ve-2.png)

### System

Set **BIOS** to **OVMF (UEFI)** and check **Add EFI Disk**, selecting any
storage available to hold it. Leave the EFI disk format on the default (qcow2).

![](../images/proxmox-ve-3.png)

> [!WARNING]+
>
> Leave **Pre-Enroll keys** unchecked. This option enrolls Microsoft's default
> Secure Boot keys, and the appliance will fail to boot if it's enabled.

Everything else on this tab can be left at its default.

### Disks

Set the disk size to **1 TB**. This is the recommended size for a production
deployment. The disk stores the database, logs, and all Plakar state, separate
from wherever you configure backups themselves to be stored. For evaluation or
testing, a smaller disk is fine. Leave the format (qcow2) and storage selection
on default, or pick a specific storage if your node has more than one available.

![](../images/proxmox-ve-4.png)

### CPU

Set **Cores** to **4** and **Sockets** to **1**. This is the recommended sizing
for production use. Leave **Type** on its default (`x86-64-v2-AES`). For
evaluation or testing, a smaller number of cores is fine.

![](../images/proxmox-ve-5.png)

### Memory

Set memory to **16384 MiB** (16 GB), the recommended amount for production use.
For evaluation or testing, a smaller memory size is fine.

![](../images/proxmox-ve-6.png)

### Network

Select the network bridge the appliance should attach to. Leave the model on
**VirtIO**.

![](../images/proxmox-ve-7.png)

> [!NOTE]+
>
> The appliance expects to receive its network configuration automatically, so a
> DHCP server needs to be reachable on the selected bridge.

### Confirm

Review the summary of your selections, then click **Finish** to create the
virtual machine.

![](../images/proxmox-ve-8.png)

## Start the appliance and complete enrollment

Power on the virtual machine. Once the appliance has booted and is reachable on
the network, open it from a browser using its assigned IP address.

```txt
http://<ASSIGNED-IP>
```

For production environments, restrict access to trusted IP ranges, private
networking, a VPN, or a reverse proxy or load balancer with TLS.

For first-time installations, you will be guided through the enrollment process
to:

- Register the instance with Plakar services for licensing and billing
- Create the initial administrator account

See the [enrollment](../../enrollment) documentation for more details.
