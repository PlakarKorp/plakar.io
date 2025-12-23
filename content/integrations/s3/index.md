---
title: S3
subtitle: Protect your S3 buckets from rogue deletion, ransomware, and silent corruption
description: Backup and restore your object storage buckets to and from any S3-compatible service, and host your Kloset repository on S3.
categories:
  - source connector
  - destination connector
  - storage connector
  - viewer
tags:
  - S3
  - Object Storage
  - AWS
  - Google Cloud Storage
  - MinIO
  - Ceph
  - Scality
  - Wasabi
  - Scaleway
  - Blackblaze
  - OVH
  - Infomaniak
stage: stable
date: 2025-05-13
---

## 🧠 Why protecting S3 data matters

S3 is often treated as the backup, but object storage is not immune to failure or abuse:
* Objects can be overwritten or deleted instantly
* Versioning is optional and easy to misconfigure
* Replication spreads corruption just as fast as good data
* Lifecycle policies can silently delete critical objects

In practice, S3 is highly durable but logically fragile.

Human error, compromised credentials, buggy applications, or ransomware can destroy or encrypt entire buckets in seconds.

When S3 stores production data, logs, or compliance-critical assets, you need independent, immutable snapshots and not just another bucket.

## 🔓 What happens when S3 credentials are compromised?

S3 access is controlled by API keys and IAM policies.

If credentials are leaked or permissions are too broad:
*	Attackers can delete or overwrite objects at scale
*	🦠 Ransomware can encrypt entire buckets via the API
*	Replication and sync jobs propagate damage instantly
*	Recovery depends entirely on prior configuration choices

Even with versioning enabled, attackers can delete versions, expire objects, or wait until retention windows pass.

Plakar mitigates these risks by:
*	🔒 Creating immutable snapshots outside the live S3 namespace
*	🔐 Encrypting data end-to-end
*	📦 Allowing offline or air-gapped retention independent of cloud access

Your backups remain safe even if your cloud account is not.

## 🛡️ How Plakar secures your S3 workflows

Plakar integrates with S3 as a first-class backup component:
*	Source Connector: Snapshot existing S3 buckets into a secure Kloset store
*	Storage Connector: Use S3 as encrypted, deduplicated backup storage
*	Destination Connector: Restore snapshots back into S3, anywhere

This enables multiple backup strategies:
*	Pull data from production buckets into isolated backup storage
*	Push encrypted snapshots into low-cost or off-cloud object storage
*	Separate backup credentials from production IAM roles

Plakar works with AWS S3 and S3-compatible platforms such as MinIO, Ceph, and Wasabi.

## 🧰 Beyond buckets: real backups for object storage

With Plakar, S3 becomes part of a complete backup strategy:
*	✅ Immutable, versioned snapshots independent of S3 state
*	🔐 End-to-end encryption with zero-knowledge guarantees
*	🧠 Global deduplication across buckets and environments
*	🔎 Browse, verify, and audit backups without restoring
*	📦 Support for offline, cold, or air-gapped storage

Instead of trusting configuration alone, Plakar gives you cryptographic guarantees and operational control over your S3 data, from snapshot creation to verification to recovery.



# S3 Integration

## Capabilities

- **Source Connector**: Seamlessly back up S3-compatible buckets to a [Kloset repository](/posts/2025-04-29/kloset-the-immutable-data-store/).
- **Destination Connector**: Restore data from a Kloset repository back into your S3 bucket.
- **Storage Connector**: Host your Kloset repository directly on any S3-compatible object storage.
- **Viewer**: Use the Integration Viewer to browse and visualize snapshots stored in S3.