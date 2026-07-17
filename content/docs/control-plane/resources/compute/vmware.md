---
title: "VMware Compute"
date: "2026-07-17T00:00:00Z"
weight: 3
summary: "How to configure a VMware compute resource in Plakar Control Plane."
---

# VMware Compute

The VMware integration allows Plakar Control Plane to discover, back up, and
restore virtual machines managed by VMware vSphere. VMware integration supports
multiple protocols.

## 1. `vmware` protocol

The `vmware` protocol transfers virtual machine disk data over HTTPS using the
vSphere API. It supports both backup and restore operations without requiring
any additional infrastructure.

This is the simplest protocol to deploy, but throughput is typically limited to
around **30 MB/s**.

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
  VM -->|"disk data transfer"| Source
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

### Shared configuration

The following settings are available when configuring both source and
destination apps using the `vmware` protocol.

- **vSphere Password**: Required. The password for the vSphere account.
- **vSphere TLS CA Bundle**: The CA certificate bundle used to verify the
  vCenter Server or ESXi TLS certificate.
- **vSphere TLS Skip Verify**: Skip TLS certificate verification when connecting
  to the vCenter Server or ESXi host.
- **vSphere Username**: Required. The username used to authenticate with the
  vCenter Server or ESXi host.

### Source configuration

The following extra settings are available when configuring a source app using
the `vmware` protocol.

- **NSX URL**: The URL of the NSX Manager, if NSX-managed networking resources
  are included for backup.
- **NSX Username**: The username used to authenticate with NSX Manager. If
  omitted, the value of **vSphere Username** is used.
- **NSX Password**: The password used to authenticate with NSX Manager. If
  omitted, the value of **vSphere Password** is used.
- **NSX TLS Skip Verify**: Skip TLS certificate verification when connecting to
  NSX Manager.

### Destination configuration

The following extra settings are available when configuring a destination app
using the `vmware` protocol.

- **Tmp Dir**: The temporary directory used by VDDK and NBDKit during restore
  operations. Defaults to `/home/plakar/tmp`.

> [!NOTE]
>
> Restoring NSX-managed networking resources is not yet supported. Only virtual
> machine disk data is restored.

## 2. `vmware+nbd` protocol

The `vmware+nbd` protocol transfers virtual machine disk data through a
dedicated NBD server running `nbdkit` with the VDDK plugin, connected to over
TLS. It supports both backup and restore operations, and is significantly faster
than the `vmware` protocol, but requires setting up an NBD server first. See
[Setting up an NBD Server for VMware Backups](../../../guides/vmware/nbd-server-setup)
for instructions.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph VMware["VMware vSphere"]
    VCenter["vCenter / ESXi"]
    VM["Virtual Machine"]
  end

  subgraph NBDServer["NBD Server"]
    Nbdkit["nbdkit + VDDK plugin"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["VMware Compute<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"SSH: orchestration"| Nbdkit
  Nbdkit -->|"VDDK API"| VCenter
  VCenter --> VM
  Nbdkit -->|"NBD over TLS: disk bytes"| Source
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

  subgraph NBDServer["NBD Server"]
    Nbdkit["nbdkit + VDDK plugin"]
  end

  subgraph VMware["VMware vSphere"]
    VCenter["vCenter / ESXi"]
    VM["Restored Virtual Machine"]
  end

  Store --> Restore
  Destination --> Restore

  Destination -->|"SSH: orchestration"| Nbdkit
  Destination -->|"NBD over TLS: disk bytes"| Nbdkit
  Nbdkit -->|"VDDK API"| VCenter
  VCenter --> VM
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Shared configuration

The following settings are available when configuring both source and
destination apps using the `vmware+nbd` protocol.

- **Vsphere Username**: Required. The username used to authenticate with the
  vCenter Server or ESXi host.
- **Vsphere Password**: Required. The password for the vSphere account.
- **Vsphere Tls Skip Verify**: Skip TLS certificate verification when connecting
  to the vCenter Server or ESXi host.
- **Vsphere Tls Ca Bundle**: The CA certificate bundle used to verify the
  vCenter Server or ESXi TLS certificate.
- **Nbd Ssh Url**: Required. The SSH URL used to reach the NBD server for
  orchestration, e.g. `ssh://<user>@<host>:<port>`.
- **Nbd Ssh Private Key**: Required. The private key used to authenticate over
  SSH with the NBD server.
- **Nbd Uri**: The TLS NBD URI used for direct disk data transfer, e.g.
  `nbds://<host>`. Defaults to the host of **Nbd Ssh Url** when omitted.
- **Nbd Tls Ca Bundle**: Required. The PEM CA bundle used by the client to
  verify the NBD server's TLS certificate.
- **Nbd Tls Certificates Dir**: The remote directory on the NBD server
  containing the TLS certificate files (`ca-cert.pem`, `server-cert.pem`, and
  `server-key.pem`).
- **Nbd Tls Client Cert**: The PEM client certificate used for mutual TLS
  authentication with the NBD server, if required.
- **Nbd Tls Client Key**: The PEM client private key used for mutual TLS
  authentication with the NBD server, if required.
- **Nbd Tls Server Name**: Overrides the TLS server name used to verify the NBD
  server's certificate.
- **Nbd Tls Skip Verify**: Skip TLS certificate verification for the direct NBD
  connection.
- **Nbd Username**: The username used to authenticate with the NBD server.
  Defaults to **Vsphere Username** when omitted.
- **Nbd Password**: The password used to authenticate with the NBD server.
  Defaults to **Vsphere Password** when omitted.
- **Nbd Listen Address**: The address `nbdkit` binds for TLS NBD. Defaults to
  the host of **Nbd Uri** when omitted.
- **Nbd Remote Runtime Dir**: The remote runtime directory used by `nbdkit` on
  the NBD server.
- **Nbd Vix Library Path**: The path to the VDDK libraries on the NBD server,
  e.g. `/usr/lib/vmware-vix-disklib`.

### Source configuration

The following extra settings are available when configuring a source app using
the `vmware+nbd` protocol.

- **Nbd Verbose**: Enable verbose `nbdkit` logging.
- **NSX URL**: The URL of the NSX Manager, if NSX-managed networking resources
  are included for backup.
- **NSX Username**: The username used to authenticate with NSX Manager. If
  omitted, the value of **Vsphere Username** is used.
- **NSX Password**: The password used to authenticate with NSX Manager. If
  omitted, the value of **Vsphere Password** is used.
- **NSX Skip Verify**: Skip TLS certificate verification when connecting to NSX
  Manager.

### Destination configuration

The following extra settings are available when configuring a destination app
using the `vmware+nbd` protocol.

- **Tmp Dir**: The temporary directory used by `nbdkit` during restore
  operations.

> [!NOTE]
>
> Restoring NSX-managed networking resources is not yet supported. Only virtual
> machine disk data is restored.
