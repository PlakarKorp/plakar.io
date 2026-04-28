---
title: Proxmox
summary: Back up and restore Proxmox virtual machines and containers with Plakar.
date: "2026-03-30T00:00:00Z"
---

The Proxmox integration wraps Proxmox's native `vzdump` tool to back up virtual machines and containers into a Kloset store. Plakar handles encryption, deduplication, and snapshot management on top of the archives that `vzdump` produces.

The integration provides two connectors:

| Connector type               | Description |
| ---------------------------- | ----------- |
| ✅ **Source connector**      | Back up VMs and containers from a Proxmox node into a Kloset store. |
| ✅ **Destination connector** | Restore snapshots from a Kloset store back to a Proxmox node. |

**Requirements**

- Proxmox VE with `vzdump` available on the node.
- SSH access to the Proxmox node with appropriate permissions (remote mode).
- Plakar v1.1.0-beta or later.

**Typical use cases**

- Encrypted, deduplicated backups of Proxmox VMs and containers.
- Cross-cluster VM migration and restore.
- Long-term archiving to object storage (S3, Scaleway, OVH, Exoscale).
- Centralized backup of multiple hypervisors from a single Plakar instance.

## Installation

The Proxmox integration is distributed as a Plakar package.

{{< tabs name="Installation Methods" >}}
{{% tab name="Pre-built package" %}}
Plakar provides pre-compiled packages for common platforms. This is the simplest installation method and is suitable for most users.

**Note:** Installing pre-built packages requires authentication with Plakar. See [Login to Plakar to unlock features](../../guides/what-is-plakar-login/).

Install the Proxmox package:

```bash
$ plakar pkg add proxmox
```

Verify the installation:

```bash
$ plakar pkg list
```
{{% /tab %}}

{{% tab name="Building from source" %}}
Building from source is useful if you cannot use pre-built packages.

**Prerequisites**

- A working Go toolchain compatible with your version of Plakar.

Build the Proxmox package:

```bash
$ plakar pkg build proxmox
```

On success, a package archive is generated in the current directory, for example `proxmox_v1.1.0-rc.1_darwin_arm64.ptar`.

Install the generated package:

```bash
$ plakar pkg add ./proxmox_v1.1.0-rc.1_darwin_arm64.ptar
```

Verify the installation:

```bash
$ plakar pkg list
```
{{% /tab %}}
{{< /tabs >}}

To list, upgrade, or remove the package, see [managing packages guide](../../guides/managing-packages/).

## Operating modes

The Proxmox integration supports two operating modes.

**Local mode** — Plakar runs directly on the Proxmox node alongside `vzdump`:

```
Proxmox node
 ├ vzdump
 └ plakar
```

**Remote mode** — Plakar runs on a separate machine and connects to the Proxmox node over SSH:

```
Backup server
     │
     │ SSH
     ▼
Proxmox node
     └ vzdump
```

Remote mode allows a single Plakar instance to back up multiple hypervisors. The operating mode is set via the `mode` option when configuring a source or destination.

## Source connector

The source connector invokes `vzdump` on the Proxmox node, collects the resulting archive, and ingests it into a Kloset store with encryption and deduplication.

{{< mermaid >}}
flowchart LR

subgraph Source[<b>Proxmox Node</b>]
  vzdump@{ shape: rect, label: "vzdump" }
end

subgraph Plakar[<b>Plakar</b>]
  Connector@{ shape: rect, label: "<small>Retrieve archive via</small><br><b>SSH</b>" }
  Transform@{ shape: rect, label: "<small>Encrypt & deduplicate</small>" }
  Connector --> Transform
end

Source --> Connector
Store@{ shape: cyl, label: "Kloset Store" }
Transform --> Store

classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px
class Source sourceBox
class Plakar brandBox
class Store storeBox
linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

### Configure

Register a Proxmox source:

```bash
$ plakar source add myProxmox proxmox+backup://10.0.0.10 \
  mode=remote \
  conn_username=root \
  conn_identity_file=/path/to/key \
  conn_method=identity
```

### Back up workloads

Back up a single virtual machine by ID:

```bash
$ plakar backup -o vmid=101 @myProxmox
```

Back up all machines in a pool:

```bash
$ plakar backup -o pool=prod @myProxmox
```

Back up the entire hypervisor:

```bash
$ plakar backup -o all @myProxmox
```

### Options

| Option                | Required | Description |
| --------------------- | -------- | ----------- |
| `location`            | Yes      | Proxmox node address. Format: `proxmox+backup://<host>` |
| `mode`                | Yes      | Operating mode. `local` or `remote`. |
| `conn_username`       | Yes (remote) | SSH username on the Proxmox node. |
| `conn_identity_file`  | No       | Path to the SSH private key. Required when `conn_method=identity`. |
| `conn_method`         | No       | Authentication method. `identity` for key-based auth. |

## Destination connector

The destination connector uploads a `vzdump` archive from a Plakar snapshot to a Proxmox node and restores it using native Proxmox tools: `qmrestore` for virtual machines and `pct restore` for containers.

{{< mermaid >}}
flowchart LR

Store@{ shape: cyl, label: "Kloset Store" }

subgraph Plakar[<b>Plakar</b>]
  Transform@{ shape: rect, label: "<small>Decrypt & reconstruct</small>" }
  Connector@{ shape: rect, label: "<small>Push archive via</small><br><b>SSH</b>" }
  Transform --> Connector
end

Store --> Transform

subgraph Destination[<b>Proxmox Node</b>]
  restore@{ shape: rect, label: "qmrestore / pct restore" }
end

Connector --> Destination

classDef destinationBox fill:#d0fae5,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px
class Destination destinationBox
class Plakar brandBox
class Store storeBox
linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

### Configure

Register a Proxmox destination:

```bash
$ plakar destination add myProxmox \
  proxmox+backup://10.0.0.10 \
  mode=remote \
  conn_username=root \
  conn_identity_file=/path/to/key \
  conn_method=identity
```

### Restore workloads

Restore all machines in a snapshot:

```bash
$ plakar restore -to @myProxmox <snapshot_id>
```

Restore a single VM from a snapshot containing multiple machines:

```bash
$ plakar restore -to @myProxmox <snapshot_id>:/backup/qemu/101_myvm
```

### Options

| Option                | Required | Description |
| --------------------- | -------- | ----------- |
| `location`            | Yes      | Proxmox node address. Format: `proxmox+backup://<host>` |
| `mode`                | Yes      | Operating mode. `local` or `remote`. |
| `conn_username`       | Yes (remote) | SSH username on the Proxmox node. |
| `conn_identity_file`  | No       | Path to the SSH private key. Required when `conn_method=identity`. |
| `conn_method`         | No       | Authentication method. `identity` for key-based auth. |

## Limitations and scope

**What is captured during backup**

- Virtual machine and container disk images, as produced by `vzdump`.
- Proxmox configuration associated with each backed-up workload.

**Snapshot consistency**

Plakar relies on `vzdump` for snapshot consistency. For live machines, `vzdump` uses QEMU guest agent or suspend-resume to produce a consistent backup. Refer to the [Proxmox vzdump documentation](https://pve.proxmox.com/wiki/Backup_and_Restore) for details on consistency modes.

## See also

- [Proxmox VE Backup and Restore](https://pve.proxmox.com/wiki/Backup_and_Restore)
- [Backing up Proxmox with Plakar: a third-party integration built in a few days](/posts/2026-03-16/backing-up-proxmox-with-plakar-a-third-party-integration-built-in-a-few-days/)
