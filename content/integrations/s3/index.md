---
title: "S3"

subtitle: "Resilient, encrypted backups for AWS S3 and S3-compatible environments"

description: >
  Protect your object storage against accidental deletion, ransomware, and cloud misconfigurations. Plakar provides immutable, encrypted snapshots for S3, restorable across any provider or environment.
  
technology_title: S3 is the industry standard, but it isn't bulletproof

technology_description: >
  S3-compatible storage is the backbone of the modern web, powering everything from media assets and log archives to mission-critical databases and AI training sets. While S3 offers high durability, it remains vulnerable to logical failures: accidental overwrites, compromised credentials, or misconfigured lifecycle policies. Plakar transforms S3 into a truly resilient backup ecosystem, adding a layer of 
  cryptographic integrity, global deduplication, an independent immutability that standard object storage lacks.

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

seo_tags:
  - AWS S3
  - S3 backup
  - ransomware protection
  - object storage security
  - immutable snapshots
  - data integrity
  - disaster recovery
  - cloud migration
  - cross-cloud backup
  - deduplication
  - encrypted storage
  
technical_documentation_link:

stage: stable

date: 2025-05-13

plakar_version: ">=1.0.3"

resource: S3

resource_type: object-storage
---

## Why protecting S3 data matters
S3 is often treated as the backup, but object storage durability is not the same as data protection. While S3 provides excellent infrastructure resilience, it remains logically vulnerable to:

- **Silent Corruption**: Data can degrade over time without detection, and standard object storage lacks built-in integrity validation across your entire dataset.
- **Accidental Deletion**: Misconfigured lifecycle policies can automatically delete critical objects. Human errors like bulk delete operations happen instantly and affect thousands of objects.
- **Versioning Gaps**: Versioning is optional and easy to misconfigure. Even when enabled, it doesn't protect against lifecycle policy deletions or deliberate version purging.
- **Replication Risks**: S3 replication is a double-edged sword. It spreads corruption, accidental deletions, and malicious changes just as quickly as legitimate data.

For production data, assets, logs, and compliance records, S3 needs an independent safety net beyond buckets and replication.

## What happens when S3 credentials are compromised?
S3 access is controlled by API keys and IAM policies. These credentials are frequently shared across services, embedded in scripts, or stored in configuration files, creating significant exposure.

If credentials are leaked or permissions are too broad:
- **Total Loss**: Attackers can delete or overwrite entire buckets through the API. Automated scripts can wipe thousands of objects in seconds.
- **Ransomware Encryption**: Malicious actors can encrypt all bucket contents, making your data inaccessible without paying a ransom.
- **Damage Propagation**: Replication and sync jobs immediately propagate malicious changes across regions and accounts, amplifying the impact.
- **Version Manipulation**: Even with versioning enabled, attackers can delete object versions, configure aggressive lifecycle policies, or simply wait until retention windows expire.
- **No Recovery Path**: Without an independent backup, there is no way to "undo" deletions or modifications in standard object storage.

Plakar mitigates these risks by creating immutable snapshots stored outside the live S3 namespace. With end-to-end encryption and support for offline or air-gapped retention, your backups remain secure even if your cloud credentials are compromised.

## How Plakar secures your S3 workflows
Plakar integrates with S3 as a flexible bridge, enabling secure data movement in multiple directions:
- **Source Connector**: Take snapshots of one or multiple S3 buckets. Plakar encrypts and deduplicates the content before saving it to a trusted Kloset Store, creating an independent backup layer.
- **Storage Connector**: Use S3-compatible storage (AWS S3, MinIO, Ceph, Wasabi) as your Kloset backend. Store encrypted, deduplicated, and versioned snapshots from any source like databases, file systems, containers, or other cloud services.
- **Destination Connector**: Restore verified snapshots back into S3, whether to your original bucket, a different region, or an entirely separate account.

This enables multiple backup strategies:
- Pull data from production buckets into isolated backup storage
- Push encrypted snapshots to low-cost or off-cloud object storage
- Separate backup credentials from production IAM roles for improved security

Plakar also allows direct inspection of backups. You can browse, search, or verify the integrity of your S3 data via the CLI or UI without performing a full restore first.

Instead of relying solely on S3 configuration and access controls, Plakar provides cryptographic guarantees and operational control over your data all the way from snapshot creation to integrity verification to recovery.
