---
title: Backblaze B2

subtitle:
  Encrypted, deduplicated backups on cost-effective S3-compatible cloud storage

description: >
  Protect your data with Plakar on Backblaze B2 Cloud Storage. Immutable,
  encrypted snapshots stored on one of the most cost-effective S3-compatible
  object storage platforms available, with free egress and enterprise-grade
  security.

technology_title:
  Backblaze B2 is S3-compatible, but that doesn't make it bulletproof

technology_description: >
  Backblaze B2 is one of the most cost-effective S3-compatible object storage
  platforms available, trusted by over 100,000 organizations for application
  storage, media archives, and backup. Its S3-compatible API makes it a natural
  fit for Plakar, giving you a durable, affordable backend for encrypted and
  deduplicated Kloset stores. Whether you are moving away from AWS S3 to reduce
  costs or looking for a reliable offsite backup destination, Backblaze B2 pairs
  directly with Plakar's S3 integration without any additional configuration.

categories:
  - source connector
  - destination connector
  - storage connector

tags:
  - Object Storage
  - S3
  - Backblaze
  - Backblaze B2

seo_tags:
  - Backblaze B2 backup
  - B2 cloud storage backup
  - S3-compatible backup
  - affordable cloud backup
  - immutable backup storage
  - encrypted backup
  - deduplication
  - disaster recovery
  - ransomware protection

technical_documentation_link: /docs/community/main/integrations/s3/

stage: stable

date: 2026-07-03

resource: S3

resource_type: object-storage

image: img/integrations/backblaze.png
---

## Why Backblaze B2 is a natural fit for backup storage

Backblaze B2 was designed from the ground up as a storage platform for backup
and archive workloads. Combined with Plakar, it provides a complete backup
solution with strong cost and security properties:

- **Predictable, low costs**: B2 is significantly cheaper than AWS S3 or Google
  Cloud Storage, with no egress fees when used with supported partners. For
  large backup repositories, the cost difference is substantial.
- **S3-compatible API**: B2 speaks the S3 protocol natively, meaning Plakar's S3
  integration works out of the box with no special configuration.
- **Object Lock and immutability**: B2 supports Object Lock, providing
  write-once, read-many (WORM) storage that prevents backups from being modified
  or deleted — even by a compromised account.
- **Built-in replication**: B2 supports cross-region replication without egress
  fees, making it straightforward to maintain geographically distributed backup
  copies.

## What happens when backup storage credentials are compromised

B2 access is controlled by API keys with fine-grained permission scoping.
Despite this, credentials embedded in scripts or shared across services remain a
risk:

- **Total loss**: An attacker with a writable API key can delete or overwrite
  entire buckets through the S3-compatible API.
- **Ransomware**: Malicious actors can overwrite backup data with encrypted
  content, making it inaccessible without paying a ransom.
- **No recovery path**: Without an independent layer of protection, there is
  nothing to restore from if backup data is tampered with.

Plakar mitigates these risks by adding end-to-end encryption and immutable
snapshots on top of B2. Even if B2 credentials are compromised, Plakar's
encryption ensures backup data cannot be read or silently tampered with.

## How Plakar works with Backblaze B2

Backblaze B2 is supported through Plakar's S3 integration. All three connector
types are available:

- **Source Connector**: Take snapshots of a B2 bucket and store them in an
  independent Kloset Store.
- **Storage Connector**: Use a B2 bucket as the backend for a Kloset Store,
  storing encrypted and deduplicated snapshots from any source.
- **Destination Connector**: Restore verified snapshots back to a B2 bucket,
  whether the original or a different one entirely.
