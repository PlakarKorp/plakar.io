---
title: "Proxmox"

subtitle: "Encrypted, deduplicated backups for virtual machines and containers"

description: >
  Protect your Proxmox clusters against data loss, ransomware, and misconfiguration.
  Plakar wraps native Proxmox backups into encrypted, deduplicated snapshots that are
  portable, verifiable, and restorable across clusters or storage backends.

technology_title: Proxmox backups are solid, but not complete

technology_description: >
  Proxmox Virtual Environment is a battle-tested open-source platform for running
  virtual machines and containers at scale. Its built-in backup tool, vzdump, handles
  the basics well. But native Proxmox backups are still tied to a single cluster,
  lack cross-environment portability, and offer no independent integrity guarantees.

  Plakar extends vzdump rather than replacing it, adding deduplication, encryption,
  and snapshot management on top of the backup archives Proxmox already knows how to produce.

categories:
  - source connector
  - destination connector

tags:
  - Proxmox
  - Virtual Machines
  - Containers
  - KVM
  - LXC
  - vzdump
  - Virtualization

seo_tags:
  - Proxmox backup
  - VM backup
  - container backup
  - vzdump integration
  - ransomware protection
  - immutable snapshots
  - disaster recovery
  - encrypted VM backup
  - cross-cluster restore
  - deduplication
  - hypervisor backup

technical_documentation_link: /docs/main/integrations/proxmox/

stage: beta

date: 2026-03-16

plakar_version: ">=1.1.0-beta"

resource: Proxmox

resource_type: virtualization
---

## Why protecting Proxmox data matters

Proxmox includes strong built-in backup capabilities, but backup archives stored on the same cluster or storage backend as your workloads are not truly independent. A single failure, misconfiguration, or attack can affect both your live machines and the backups protecting them.

Common risks in Proxmox environments:

- **Single-cluster exposure**: Backups stored locally or on cluster-attached storage share the same failure domain as the machines they protect.
- **No cross-environment portability**: Native Proxmox backups are tightly coupled to the cluster that created them, making restoration to a different environment difficult.
- **Storage misconfiguration**: Aggressive retention policies or accidental deletions can wipe backup archives before they are needed.
- **No integrity verification**: Without cryptographic validation, there is no reliable way to confirm a backup is intact until you attempt a restore.

For production workloads, compliance requirements, or multi-cluster environments, Proxmox needs an independent safety net beyond what vzdump provides on its own.

## What happens when a Proxmox cluster is compromised?

Proxmox exposes a web UI and REST API that are typically accessible over the network. If an attacker gains access to a node or the management interface:

- **Total Loss**: Virtual machines and containers can be deleted or overwritten through the API. Backup archives stored on the same infrastructure are equally exposed.
- **Ransomware Encryption**: Malicious actors can encrypt live machine disks and backup archives simultaneously, leaving no clean copy to recover from.
- **No Recovery Path**: Without an independent, immutable backup stored outside the cluster, there is no way to recover deleted or encrypted workloads.

Plakar mitigates these risks by storing snapshots in an isolated Kloset, encrypted end-to-end, and independent of the Proxmox cluster itself. Even if the cluster is fully compromised, your backups remain intact.

## How Plakar secures your Proxmox workflows

Plakar integrates with Proxmox by wrapping its native vzdump tool. When a backup runs, vzdump generates the archive as it normally would, and Plakar ingests it into a snapshot. The result is a standard Proxmox backup with additional guarantees layered on top.

- **Source Connector**: Back up individual VMs, containers, pools, or entire hypervisors into a secure Plakar Kloset, encrypted and deduplicated automatically.
- **Destination Connector**: Restore verified snapshots back to any Proxmox node, whether the same cluster or a different one, using the native restore tools Proxmox already understands.

Plakar supports both local and remote operation:

- **Local mode**: Plakar runs directly on the Proxmox node alongside vzdump.
- **Remote mode**: Plakar runs on a separate backup server and connects to one or more Proxmox nodes over SSH, enabling a single instance to manage backups across an entire fleet of hypervisors.

This enables backup strategies that go beyond what Proxmox offers natively:

- Store encrypted VM snapshots on object storage such as S3, Scaleway, OVH, or Exoscale.
- Deduplicate across machines that share a common base image, storing shared data only once.
- Inspect backups at a granular level via the CLI or UI without performing a full restore.
- Restore individual VMs from a snapshot that contains multiple machines.
- Archive snapshots to cold storage or export them as portable ptar archives.
