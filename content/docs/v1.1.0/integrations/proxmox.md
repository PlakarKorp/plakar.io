---
title: "Proxmox"
date: "2026-03-30T00:00:00Z"
weight: 11
summary: "Back up and restore Proxmox virtual machines and containers with Plakar."
---

# Proxmox

The Proxmox integration wraps Proxmox's native `vzdump` tool to back up virtual machines and containers into a Kloset store. Plakar handles encryption, deduplication, and snapshot management on top of the archives that `vzdump` produces.

The integration provides two connectors:

| Connector type               | Description |
| ---------------------------- | ----------- |
| **Source connector**      | Back up VMs and containers from a Proxmox node into a Kloset store. |
| **Destination connector** | Restore snapshots from a Kloset store back to a Proxmox node. |

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

{{< tabs >}}
  {{< tab label="Pre-built package" >}}
  
  Pre-compiled packages are available for common platforms and provide the simplest installation method.
  
  > [!NOTE]+ Logging In
  > Pre-built packages require Plakar authentication. See [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.
  
  Install the Proxmox package:
  
  ```bash
  $ plakar pkg add proxmox
  ```

  Verify installation:
  
  ```bash
  $ plakar pkg list
  ```
  
  {{< /tab >}}
  {{< tab label="Building from source" >}}
  
  Source builds are useful when pre-built packages are unavailable or when customization is required.

  **Prerequisites:**
  - Go toolchain compatible with your **Plakar** version
  
  Build the package:
  
  ```bash
  $ plakar pkg build proxmox
  ```
  
  A package archive will be created in the current directory (e.g., `proxmox_v1.1.0-rc.1_darwin_arm64.ptar`).
  
  Install the package:
  
  ```bash
  $ plakar pkg add ./proxmox_v1.0.0_darwin_arm64.ptar
  ```
  
  Verify installation:
  ```bash
  $ plakar pkg list
  ```
  
  {{< /tab >}}
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

subgraph Source["Proxmox Node"]
  Vzdump["vzdump"]
end

Plakar["Plakar"]

Via["Retrieve archive via<br/>SSH"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

Vzdump --> Via --> Plakar --> Transform --> Store
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

Store["Kloset Store"]

Plakar["Plakar"]

Transform["Decrypt & reconstruct"]

Via["Push archive via<br/>SSH"]

subgraph Destination["Proxmox Node"]
  Restore["qmrestore / pct restore"]
end

Store --> Plakar --> Transform --> Via --> Restore
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
