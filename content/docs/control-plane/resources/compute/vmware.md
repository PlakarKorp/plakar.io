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

## 1. `vmware` protocal

The `vmware` protocol transfers virtual machine disk data over HTTPS using the
vSphere API. It supports both backup and restore operations without requiring
any additional infrastructure.

This is the simplest protocol to deploy, but throughput is typically limited to
around **30 MB/s**.

### Shared configuration

The following settings are available when configuring both source and
destination apps using the `vmware` protocal.

- **vSphere Password**: Required. The password for the vSphere account.
- **vSphere TLS CA Bundle**: The CA certificate bundle used to verify the
  vCenter Server or ESXi TLS certificate.
- **vSphere TLS Skip Verify**: Skip TLS certificate verification when connecting
  to the vCenter Server or ESXi host.
- **vSphere Username**: Required. The username used to authenticate with the
  vCenter Server or ESXi host.

### Source configuration

The following extra settings are available when configuring a source app using
the `vmware` protocal.

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
using the `vmware` protocal.

- **Tmp Dir**: The temporary directory used by VDDK and NBDKit during restore
  operations. Defaults to `/home/plakar/tmp`.
