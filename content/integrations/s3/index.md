---
# Title used to describe the integration in the listing page
title: "AWS S3"

# Concise benefit-driven subtitle (used as subheading in hero section)
subtitle: "Resilient, encrypted backups for your AWS S3 environment"

# SEO friendly description used in integration hero section
description: >
  Back up your AWS S3 workloads with Plakar to protect against data loss,
  corruption, and ransomware. Immutable, encrypted, and restorable
  even across regions, offline, or in hybrid cloud environments.

# Just after the hero, if not set or blank, "Amazon S3 is everywhere and often underprotected" will be used
technology_title: AWS S3 is everywhere and often underprotected

# SEO friendly answer to: Amazon S3 is everywhere and often underprotected
technology_description: >
  AWS S3 powers modern cloud workloads from web apps to analytics and enterprise backups.
  Its storage classes, including S3 Glacier for cold storage, offer scalable and cost-efficient data management.
  Yet misconfigured buckets, limited versioning, and lack of air‑gapped backups leave data exposed.
  Plakar secures S3 with immutable, encrypted, deduplicated snapshots that remain verifiable and restorable even if the cloud account is compromised.

# What the integration provides
categories:
  - source connector
  - destination connector
  - storage connector
  - viewer

# Tags used for filtering on the Plakar site
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

# Tags used for SEO and search on the Plakar site
seo_tags:
  - Amazon S3
  - AWS S3 backup
  - AWS object storage
  - S3 Glacier
  - cloud object storage
  - multi-cloud backup
  - backup
  - disaster recovery
  - encryption
  - deduplication
  - versioning
  - immutable storage
  - compliance
  - long-term archiving
  - airgapped backup
  - snapshot technology
  - portable format

# Link to the technical documentation of the integration
technical_documentation_link: docs/main/integrations/s3/

# Stage of maturity
stage: stable

# Publication or last updated date (ISO 8601)
date: 2025-05-13

# Plakar version compatibility
plakar_version: ">=1.0.3"

# Name of the resource
resource: AWS S3

# Type of resource integrated
resource_type: object-storage
---

## 🧠 Why protecting Amazon S3 matters
Amazon S3 powers countless workloads from web applications to enterprise backups yet S3 buckets are often misconfigured, exposed, or unprotected. Even with features like versioning and S3 Glacier, organizations still face risks from accidental deletions, misconfigurations, or compromised IAM credentials.

## 🔓 What happens when Amazon S3 is compromised?
- Public or misconfigured buckets can expose sensitive data.
- Malicious users with access can delete buckets or lifecycle-managed archives.
- Cross-region or multi-account disaster recovery becomes complex without automation.

## 🛡️ How Plakar secures your Amazon S3 workflows
Plakar integrates with Amazon S3 as:
- A **source connector** to snapshot S3 buckets into encrypted, deduplicated backups
- A **restore destination** to rehydrate verified snapshots directly into S3
- A **storage backend** to host Plakar Kloset stores, leveraging S3 or S3 Glacier for cold storage

**Plakar provides end‑to‑end encryption, global deduplication, versioning, and snapshot browsing ensuring your S3 data remains secure, portable, and instantly recoverable across environments.**

## 🧰 Everything in one tool: backup, verify, restore, browse
Plakar unifies **backup**, **verification**, **restore**, and browsing into a single workflow, making AWS S3 not just a storage destination but a fully secured archival solution.
