---
title: "VMware Compute"
date: "2026-07-17T00:00:00Z"
weight: 2
summary: "How to configure a VMware compute resource in Plakar Control Plane."
aliases:
  - /docs/control-plane/guides/vmware/
  - /docs/control-plane/guides/vmware/nbd-server-setup/
---

# VMware Compute

The VMware integration allows Plakar Control Plane to back up and restore
virtual machines managed by VMware vSphere. Plakar connects to vCenter through
the vSphere API to drive each operation, and transfers virtual machine disks
directly from vSphere without requiring any additional infrastructure.

## Inventory Management

Virtual machines are discovered by the
[VMware inventory](../../infrastructure/inventories/vmware), which connects to a
vCenter Server and loads its compute instances each time it synchronizes.
Resources in a VMware inventory are managed by the inventory and cannot be
created or deleted manually.

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
  VM -->|"Disk data: nbd or nfchttp"| Source
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

A source app transfers disks in one of two modes, and the mode decides the
format the disks are stored in.

| Mode      | Disk format           | Transfer                           |
| --------- | --------------------- | ---------------------------------- |
| `nbd`     | Raw disk contents     | Streamed over the ESXi NFC socket. |
| `nfchttp` | Stream-optimized VMDK | Downloaded over vCenter HTTP NFC.  |

`nbd` is the default. It replaces the former `vmware+nbd` protocol, and no
longer needs a separate NBD server. `nfchttp` produces the stream-optimized VMDK
files earlier versions of the integration produced.

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

- **Transport Mode**: How disks are transferred and stored, either `nbd` or
  `nfchttp`. Defaults to `nbd`. See [Transport modes](#transport-modes).
- **NSX URL**: The NSX manager endpoint address.
- **NSX Username**: The username used to authenticate with the NSX manager.
  Defaults to **vSphere Username** when omitted.
- **NSX Password**: The password for the NSX account. Defaults to **vSphere
  Password** when omitted.
- **NSX Skip Verify**: Skip TLS certificate verification when connecting to the
  NSX manager. Defaults to `false`.

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
- **Tmp Dir**: The temporary directory used by VDDK and NBDKit during restore
  operations. Defaults to `/home/plakar/tmp`.
