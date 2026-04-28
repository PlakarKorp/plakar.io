---
# Title of the integration (keep it short and descriptive)
title: {Resource} integration

# One-line description for listing/search (focus on value and action)
description: Backup and restore your {resource type} with Plakar — secure, portable, and deduplicated.

# Technical summary of how the integration works under the hood
technology_description: This integration uses the {protocol/API/filesystem access/...} of {resource} to extract and restore structured data into a Kloset store.

# UGO categories — typically 'integrations' for resource plugins
categories:
  - integrations

# Tags for SEO
tags:
  - {resource-name}
  - {resource-name} providers...
  - {resource-name} semantic words...
  # always relevant
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

# Stage of maturity: 'beta', 'stable', 'coming soon', 'deprecated'
stage: beta

# Date of publication or last update (ISO 8601)
date: 2025-07-26

# Minimum version of Plakar this integration is compatible with
plakar_version: {1.0.2 or >=1.0.3}

# Version of the integration itself (used for changelog / tracking)
integration_version: {0.1.0}

# Type of resource targeted
# Values: 'filesystem', 'database', 'object-storage', 'api', 'vm', 'container', etc.
resource_type: {type}

# What the integration provides
# Values: 'source connector', 'destination connector', 'storage connector', 'viewer'
provides:
  - source connector
  - destination connector
  - storage connector
  - viewer

# Template notes:
# - {{< clearfix >}} can be used to fix alignment issues between the two columns
# - Use {{< param "param_name" >}} to reference parameters defined in the header

---

# Integration package: {name of the resource}

## Introduction

This integration allows you to snapshot and restore a {resource type} using Plakar to store it in a Kloset store, while minimizing storage usage and ensuring strong data security.
It includes a Storage Connector that lets you persist snapshots to the {resource type} itself, either from the same kind of resource or from entirely different sources.
A Viewer is also provided to inspect, search, and restore snapshots without requiring full extraction.

**Use cases:**
- ...
- ...

**Target technologies:**

This integration supports the following versions and deployment models of {resource type}:

- **Supported versions**: {resource type version} and above
- **Supported editions**: Community Edition, Cloud Edition, Enterprise Edition...
- **Unsupported variants**: {resource type} variants that are not supported (e.g. "does not support {variant} edition")
- **System compatibility**: Tested on ...

**Requirements:**
- **Plakar version**: {{< param "plakar_version" >}}
- **Integration version**: {{< param "integration_version" >}}
- Optional: Resource access credentials (describe them briefly, e.g. API token, database URI, etc.)
- Optional: Resource version compatibility (e.g. "compatible with PostgreSQL 12+")

## Architecture

```plaintext
                                Viewer (CLI/UI)
                                  ↑
{resource} ← Source Connector → Kloset Store ←→ Storage Connector → {resource}
                                  ↓
                   {resource} ← Destination Connector → Other compatible resources
                                 
```

> Better with a proper diagram image showing the flow.

**Components provided:**
- **Source Connector**: to extract data from the {resource} to back up it
- **Destination Connector**: to restore snapshots to the {resource} or compatibles resources
- **Storage Connector**: to persist data to the {resource}
- **Viewer**: CLI or UI to browse and search snapshots (reads from Kloset Store)

> _Tip: include a diagram showing extraction → snapshot → export/restore flow._

## Installation

This integration is distributed as an **integration package**.  
You can build and install it in a few seconds using Plakar’s built-in tooling.

### How to build the package

Run the following command to fetch and compile the integration:

```bash
plakar pkg build {integration-name}
```

This will generate a portable `.ptar` archive, for example:

```text
/tmp/{integration}_v0.1.0-devel.xxxxxx_linux_amd64.ptar
```

### Install the package

Once built, install it locally with:

```bash
plakar pkg add ./path/to/{integration}_v0.1.0-devel.xxxxxx_linux_amd64.ptar
```

### Verify installation

Check that the integration appears in your available connectors:

```bash
plakar version
```

You should now see `{integration}` listed in the importers, exporters, or klosets:

```text
importers: fs, s3, {integration}, ...
exporters: fs, s3, {integration}, ...
klosets: fs, s3, ptar, {integration}, ...
```

The integration is now ready for use.

## Setup  {resource type}

This integration provides three types of connectors to interact with your {resource type}:
- **Source Connector** to extract data from the resource
- **Destination Connector** to restore data into the resource
- **Storage Connector** to persist snapshots **inside the resource itself**, turning it into a Kloset backend

The configuration is done using `plakar config` commands. Each parameter is set explicitly and separately.

Depending on the type of usage, you can configure {resource} as a source, destination, or storage connector.

### Backup & Restore using the {resource type}

#### Source Connector configuration

To declare a resource as a source to backup it.

> Configure the source connector:
```bash
plakar config source create myresource
plakar config source set myresource type {resource}
plakar config source set myresource uri {resource-uri}
# Optional: set credentials or other specific options
plakar config source set myresource access_key {your-access-key}
plakar config source set myresource secret_access_key {your-secret-key}
```

##### Destination Connector configuration

To declare a resource as a destination to restore data into it.

> Configure the destination connector:
```bash
plakar config destination create myresource
plakar config destination set myresource type {resource}
plakar config destination set myresource uri {resource-uri}
plakar config destination set myresource access_key {your-access-key}
plakar config destination set myresource secret_access_key {your-secret-key}
```

#### Snapshot: make a backup

Provide different examples to make a backup
> To take a snapshot of your configured resource:
```bash
plakar at @mystore backup @myresource
plakar at @mystore backup resource://
```

Plakar connects to the resource and lists all accessible objects in the specified bucket.
Each object is streamed, chunked into smaller blocks, then deduplicated, compressed, and encrypted locally before being written to the Kloset store.

#### Restore a snapshot

To restore all or part of a snapshot:

```bash
plakar at @mystore restore -to @restore-target <snapshot-id>:/optional/path
```

You can restore:
- To the local filesystem
- To a specific resource of the same type or a compatible type (if registered as destination)

Provide different examples with different compatible resources:

```bash
plakar at @mystore restore -to s3://mybucket/restore/ <snapshot-id>
plakar at @mystore restore -to /example <snapshot-id>
plakar at @mystore restore -to @another-compatible-resource <snapshot-id>
```

### Using {resource type} as Storage Connector

#### Configuration

To configure the resource itself as a **Kloset store backend**:

```bash
plakar config store create mystore
plakar config store set mystore type {resource}
plakar config store set mystore location {resource-location-uri}
plakar config store set mystore access_key {your-access-key}
plakar config store set mystore secret_access_key {your-secret-key}
```

This setup enables you to use the resource not just as a data target, but also as the durable storage backend for your snapshots — making the integration self-contained and portable.

#### Kloset creation

> Create a Kloset store to use the resource as a backend:
```bash
plakar at @mystore create
```

#### Kloset inspection: test your Kloset store is functional

> List available snapshots:

```bash
plakar at @mystore ls
```

> Inspect file content without full restore:

```bash
plakar at @mystore cat <snapshot-id>:/path/to/file
```

> Launch the UI viewer:

```bash
plakar at @mystore ui
```

## Integration-specific behaviors

> This section documents behaviors that are specific to how this integration interacts with the {resource type}, especially those that affect consistency, performance, or compatibility.

### Limitations

The following components of the resource are **not included** in the snapshot:

- Cluster-wide configuration (e.g. network rules, node scaling policies)
- User accounts and IAM settings
- Monitoring or telemetry pipelines
- Custom plugin binaries
- Server-side lifecycle rules

Only the following elements are backed up:

- Raw data buckets and their contents
- Bucket-level metadata (e.g. creation time, owner ID)

### Automation and scheduling

> List any specific automation or scheduling features that are available or to take into account for this integration.

### Restore behavior specifics

Recommended practice:
- Restore to a temporary or namespaced destination (e.g. {resource}/restore-preview/)
- Manually validate content before promoting to production

## Troubleshooting

> List here specific logging, debugging, or troubleshooting steps for the integration.

## Appendix

- CLI reference
- Example automation scripts

## FAQ

Create a FAQ section to address common questions or issues users might encounter with this integration.
