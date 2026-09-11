---
title: Impossible Cloud

subtitle: Encrypted, immutable backups on Europe's sovereign S3-compatible cloud

description: >
  Protect your data with Plakar on Impossible Cloud. Immutable, encrypted
  snapshots stored on fully S3-compatible object storage built under European
  data jurisdiction, with no egress fees, no API charges, and enterprise-grade
  compliance.

technology_title:
  Impossible Cloud is S3-compatible, but that doesn't make it bulletproof

technology_description: >
  Impossible Cloud is a Hamburg-based, S3-compatible object storage platform
  built for regulated industries that need European data jurisdiction, ISO
  27001/SOC 2 certified data centers, and predictable pricing with no egress or
  API fees. Its S3-compatible API makes it a natural fit for Plakar, giving you
  a durable, sovereign backend for encrypted and deduplicated Kloset stores.
  Whether you are consolidating backup storage under GDPR-first infrastructure
  or looking for a cost-effective alternative to AWS S3, Impossible Cloud pairs
  directly with Plakar's S3 integration without any additional configuration.

categories:
  - source
  - destination
  - storage

seo_tags:
  - Impossible Cloud backup
  - S3-compatible backup
  - European cloud storage
  - GDPR backup
  - sovereign cloud storage
  - immutable backup storage
  - encrypted backup
  - deduplication
  - ransomware protection
  - disaster recovery

links:
  - type: community
    url: /docs/community/main/integrations/s3/
  - type: control-plane
    url: /docs/control-plane/resources/object-storage/s3/
  - type: custom
    label: "Blog: Why you need a real backup strategy"
    url: /posts/2025-02-10/s3-is-not-a-backup-why-you-need-a-real-backup-strategy/
    icon: ri/article-line

edition:
  - community
  - control-plane

stage: stable

author:
  - type: official
    name: Plakar

date: 2026-09-11

resource: S3

image: img/integrations/impossible-cloud.jpeg
---

## Why Impossible Cloud is a natural fit for backup storage

Impossible Cloud was built as S3-compatible object storage for regulated
industries, combining European data sovereignty with cost and security
properties that suit it well as a Kloset backend:

- **European data jurisdiction**: Impossible Cloud operates under a single
  European legal framework, including GDPR, with ISO 27001, SOC 2, and PCI DSS
  certified data centers across Europe and the United States. Deployments can be
  restricted to European regions for organizations that require it.
- **Predictable, no-surprise pricing**: There are no egress fees, no API call
  charges, and no minimum retention commitment. For large backup repositories
  that are restored infrequently, this keeps recovery costs predictable.
- **S3-compatible API**: Impossible Cloud speaks the S3 protocol natively,
  meaning Plakar's S3 integration works out of the box with no special
  configuration.
- **Object Lock and immutability**: Impossible Cloud supports WORM-compliant
  Object Lock, preventing backups from being modified or deleted for a
  configured retention period, even by a compromised account.
- **Erasure-coded durability**: Data is distributed across multiple nodes using
  erasure coding rather than simple replication, giving Impossible Cloud's
  storage a designed durability of 99.999999999% ("11 nines").

## What happens when backup storage credentials are compromised

Impossible Cloud access is controlled by API keys with role-based access control
and multi-factor authentication. Despite this, credentials embedded in scripts
or shared across services remain a risk:

- **Total loss**: An attacker with a writable API key can delete or overwrite
  entire buckets through the S3-compatible API.
- **Ransomware**: Malicious actors can overwrite backup data with encrypted
  content, making it inaccessible without paying a ransom.
- **No recovery path**: Without an independent layer of protection, there is
  nothing to restore from if backup data is tampered with.

Plakar mitigates these risks by adding end-to-end encryption and immutable
snapshots on top of Impossible Cloud. Even if account credentials are
compromised, Plakar's encryption ensures backup data cannot be read or silently
tampered with, independent of any Object Lock policy configured on the bucket
itself.

## How Plakar works with Impossible Cloud

Impossible Cloud is supported through Plakar's S3 integration. All three
connector types are available:

- **Source Connector**: Take snapshots of an Impossible Cloud bucket and store
  them in an independent Kloset Store.
- **Storage Connector**: Use an Impossible Cloud bucket as the backend for a
  Kloset Store, storing encrypted and deduplicated snapshots from any source
  such as databases, file systems, or other cloud services.
- **Destination Connector**: Restore verified snapshots back to Impossible
  Cloud, whether to the original bucket, a different region, or a separate
  account.

Because Impossible Cloud does not charge for egress or API calls, restoring data
from a Kloset Store hosted there, or verifying it directly via the CLI or UI,
does not add unpredictable traffic costs on top of storage.
