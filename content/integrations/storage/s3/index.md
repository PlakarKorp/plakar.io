---
title: S3
subtitle: How to back up data to S3 using Plakar S3 Connector
description: The Plakar S3 storage connector enables creation of a plakar Kloset repository on any S3-compatible object storage buckets.
categories:
  - storage connectors
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
stage: stable
date: 2025-05-13
---

## What is Plakar S3 Connector
Plakar is an open-source backup and restore platform that creates browsable, immutable snapshots of your data with full context without requiring restoration.

The S3 Storage Connector enables you to leverage any S3-compatible object storage as your backup repository, transforming cloud storage into an active, queryable resource you can browse and verify without costly restore operations. Storage Connectors (like S3) provide the underlying storage infrastructure, while Integrations handle data sources and application workflows.

The connector works with AWS S3, MinIO, Scaleway, Backblaze B2, and CleverCloud. All data is encrypted end-to-end through Kloset before reaching S3, with TLS encryption protecting data in transit.

## Start backing up to S3 in 3 steps

### Install Plakar
Compile and install Plakar from source using the Go toolchain. Currently supports macOS, OpenBSD, and Linux systems with straightforward build instructions.

### Configure your S3 repository
Set up your S3-compatible storage endpoint (AWS S3, MinIO, or other S3-compatible services) as a Plakar repository. This includes configuring authentication credentials, specifying the bucket location, and initializing the repository for secure, deduplicated backup storage.

### Backup your data
Execute backup operations by specifying the directories or files you want to protect. Plakar automatically handles compression, deduplication, and encryption (configured during repository creation), with synchronization capabilities to replicate backups to your S3 repository.

## What sets Plakar apart

### Browsable Backups Without Restoring

Access and examine backup contents without needing to restore them first. Query and inspect snapshots instantly, allowing you to browse, search, and analyze backup data immediately.

### Kloset Immutable Storage Engine

Each backup becomes a self-contained, unchangeable data package that includes everything needed, structure, metadata, context, and integrity verification. Similar to how containers package applications with dependencies, Kloset creates portable data units that can be moved anywhere while maintaining the same structure.

### Unmatched Deduplication & Compression

Create more backup versions without increasing storage costs through advanced deduplication and compression technology. Handle massive datasets while using minimal memory resources.

### Built for Scale and Performance

Process over one million files in under three minutes. Multiple data sources can use a single repository simultaneously without conflicts. Built-in monitoring detects and alerts on unusual activity.

## How to backup to S3 Providers

Plakar's S3 connector integrates seamlessly with multiple cloud storage providers, providing you with the flexibility to choose the solution that best suits your needs and budget. Whether you prefer major cloud platforms or specialized storage services, we've got you covered.

### AWS S3

The industry-leading cloud storage service from Amazon Web Services. Ideal for enterprises and applications that require global availability and extensive integration. View [AWS S3 setup guide](/integrations/storage/s3/aws-s3/).

### MinIO

Self-hosted, high-performance object storage that's 100% compatible with Amazon S3 APIs. Ideal for on-premises deployments and hybrid cloud strategies. View [MinIO setup guide](/integrations/storage/s3/minio/).

### Scaleway

European cloud provider offering competitive pricing and GDPR-compliant storage. Great choice for European businesses and cost-conscious users. View [Scaleway setup guide](/integrations/storage/s3/scaleway/).

### Backblaze
Affordable cloud storage with straightforward pricing and no hidden fees. Excellent for backup scenarios where cost efficiency is paramount. View [Backblaze setup guide](/integrations/storage/s3/backblaze/)

### CleverCloud
French cloud platform with simple, transparent pricing and excellent developer experience. Perfect for European startups and privacy-focused organizations. View [CleverCloud setup guide](/integrations/storage/s3/clevercloud/)

If your provider isn't listed here, join our Discord and we'll assist you in configuring it and updating this guide.

## Security Considerations

Using S3 storage introduces some security considerations you should be aware of. Your S3 credentials are powerful; if someone gains access to your access key, they can potentially access or modify your backups. Keep your configuration files secure by setting appropriate permissions (such as `chmod 600`) and regularly rotating your keys.

Bucket misconfiguration is another common issue. Accidentally making your bucket public could expose your data to the internet. Always set up proper bucket policies and use the principle of least privilege when configuring access permissions.

## Getting Help

If you run into issues with the S3 storage connector, there are several ways to get help:
- Join our [Discord](https://discord.gg/uuegtnF2Q5) where we're active and can help you configure tricky S3 providers. 
- Check the [GitHub Issues](https://github.com/PlakarKorp/plakar/issues) for known bugs and feature requests. 
- Read the complete [documentation](https://docs.plakar.io) for comprehensive guides and examples.

If your S3 provider isn't listed in our examples, hop on Discord and we'll help you get it working. The community is friendly, and we're always happy to expand our provider support based on your feedbacks.
