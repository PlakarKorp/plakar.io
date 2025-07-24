---
title: MinIO Integration Documentation
description: Back up and restore S3-compatible object storage using Plakar with a local or remote MinIO server.
technology_description: This integration uses MinIO’s S3-compatible API to store and retrieve encrypted snapshot data from a Kloset repository.
categories: 
- integrations
tags:
- minio
- s3
- object-storage
- plakar
stage: "stable"
date: 2025-07-22
---

# MinIO integration

This document describes how to use MinIO with Plakar as part of a complete integration package. This includes:

- Extracting data from a resource using a **Source Connector**
- Persisting snapshots to MinIO using a **Storage Connector**
- Restoring data to a resource using a **Destination Connector**
- Inspecting and managing snapshots using the **Integration Viewer**

---

## Overview

- **Storage Target:** MinIO (S3-compatible)
- **Integration Type:** Full Integration Package
- **Use Cases:** Immutable backups, disaster recovery, secure restore pipelines
- **Components Included:**
  - Source Connector
  - Storage Connector
  - Destination Connector
  - Viewer
  - Snapshot Engine (Kloset)

---

## Prerequisites

- Plakar `v1.0.2` or later installed
- A running MinIO instance (local or remote)
- Basic understanding of S3-compatible APIs and snapshot concepts

---

## Supported MinIO Topologies

| Topology | Fault Tolerance | Recommended Use Case |
|----------|------------------|-----------------------|
| SNSD (Single Node Single Drive) | Low       | Single-node local testing or dev environments |
| SNMD (Single Node Multi Drive)  | Moderate  | Local dev/testing with redundancy across disks |
| MNMD (Multi Node Multi Drive)   | High      | Production-grade, highly available deployments |

<sub><strong>Note:</strong> These terms follow MinIO’s standard topology naming convention. Refer to the [MinIO Topologies Guide](https://min.io/docs/minio/linux/operations/concepts.html) for full reference.</sub>



## MinIO Setup

```bash
minio server ~/minio --console-address :9001
```
### 1. Start MinIO
- Console: http://localhost:9001
- API: http://localhost:9000

```
Username: minioadmin
Password: minioadmin
```
### 2. Create a bucket
Login using default credentials:
Create a bucket (e.g., `mybackups`).

---

plakar config repository
---

| **Description** | Configure and initialize a remote Plakar repository (e.g. MinIO) |
|-----------------|------------------------------------------------------------------|
| **Usage**       | `plakar config repository [COMMAND] <name> [OPTIONS]`           |
| **Aliases**     | `plakar repository`                                              |
## Description
The `plakar config repository` command is used to configure and initialize remote Plakar repositories, including S3-compatible services like MinIO.

You can define a named configuration profile, set access credentials, define the remote bucket location, and create the repository to store your Plakar snapshots. This enables Plakar to sync and restore backups directly from your remote object storage.

## Options

| Option                                      | Default | Description                                                                 |
|---------------------------------------------|---------|-----------------------------------------------------------------------------|
| `repository create <name>`                  | –       | Initializes a named Plakar repository configuration                         |
| `repository set <name> location`            | –       | Sets the S3-compatible URL to your MinIO bucket                             |
| `repository set <name> access_key`          | –       | Access key for MinIO                                                        |
| `repository set <name> secret_access_key`   | –       | Secret key for MinIO                                                        |
| `repository set <name> use_tls`             | `true`  | Enables or disables TLS (set to `false` for local HTTP use)                 |
| `plakar at @<name> create`                  | –       | Initializes a Plakar repository at the specified remote location            |

## Configuration
```
plakar config repository create minio-s3
plakar config repository set minio-s3 location s3://localhost:9000/mybackups
plakar config repository set minio-s3 access_key minioadmin
plakar config repository set minio-s3 secret_access_key minioadmin
plakar config repository set minio-s3 use_tls false
```
**Choose the Resource** you want to configure with the integration and use the Storage Connector to link the repository to the S3-compatible storage backend.

## Integration Commands

| Section     | Details                                                                 |
|-------------|-------------------------------------------------------------------------|
| **Description** | Perform snapshot operations on an S3-backed Kloset repository using the Plakar CLI |
| **Usage**       | `plakar at @<repository-name> <COMMAND> [OPTIONS]`                   |
| **Alias**       | `plakar @`                                                          |
### Description

The `plakar at` command group is used to interact with a configured remote repository. Once an S3-compatible repository (such as MinIO) is defined, these commands allow you to perform snapshot operations — including backup, restore, listing, and launching the viewer interface.

This enables direct backup and recovery workflows on object storage as if it were a local Plakar environment.

### Commands

| Command   | Description                                               |
|-----------|-----------------------------------------------------------|
| `create`  | create a new Kloset repository on the S3 destination  |
| `backup`  | take a snapshot of a local resource                       |
| `ls`      | list available snapshots in the remote repository         |
| `restore` | restore specific files or full snapshots to a target      |
| `ui`      | launch the web-based viewer to explore stored snapshots   |

## Integration workflow
```bash
plakar at @minio-s3 create
```
### Initialize remote repository

> ⚠️ You’ll be prompted to enter a passphrase for the repository. This secures all stored snapshots.

Prepare the remote repository for snapshot operations by creating a Kloset on your S3 bucket:


```bash
plakar at @minio-s3 backup /var/backups
```
### Use the Source Connector to capture a snapshot

Back up a directory or file and store it as a snapshot:

```bash
plakar at @minio-s3 ls
```
### Use the Storage Connector to persist the snapshot to MinIO

Confirm that the snapshot has been successfully persisted to the remote Kloset repository:


```bash
plakar at @minio-s3 ui
```
### Use the Integration Viewer to inspect the snapshot

> Open your browser and navigate to: `http://localhost:24077`

Visualize and browse the contents of your remote repository using the Integration Viewer:


```bash
plakar at @minio-s3 restore <snapshot_id>:path/to/file.txt
```
### Use the Destination Connector to restore data
Restore a single file from a specific snapshot:

```bash
plakar at @minio-s3 restore <snapshot_id>
```
Restore the entire snapshot:


## Component Glossary

**Kloset** 
The immutable (tamper-evident) data-storage engine that splits data into deduplicated, compressed, encrypted chunks, addresses them by content hash, and retains them in a write-once form.

**Kloset Store** 
A data store managed by Kloset that holds all chunks and metadata for each snapshot, providing local organization, indexing, and fast access.

**Storage Connector** 
A pluggable component that enables a Kloset store to be persisted to a specific storage medium such as Amazon S3, a local filesystem, or a database.

**Source Connector** 
A pluggable component that extracts data from a resource (filesystem, VM, database, etc.) into the Kloset snapshot pipeline.

**Destination Connector** 
A pluggable component that applies Kloset snapshots back to a target resource (filesystem, database, cloud) to restore data and metadata.

**Viewer** 
An interface (CLI or GUI) for listing, previewing and diffing Kloset snapshots without performing a full restore.

**Integration Package** 
A turnkey package that accesses a resource (e.g. a hypervisor, VM, server, database, filesystem, object storage…), uses Kloset to take snapshots of that resource, and provides all the tooling needed to back up, restore, and visualize both the live environment and its snapshots.


## Further Reading

- [Plakar CLI Reference](https://docs.plakar.io/en/commands/plakar/index.html)
- [Understanding Snapshots](https://docs.plakar.io/en/concepts/index.html)
- [Kloset Engine Overview](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)