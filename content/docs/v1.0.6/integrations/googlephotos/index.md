---
title: Google Photos integration documentation
description: Import and export your Google Photos library with Plakar using Rclone. Encrypted, deduplicated, and portable backups.
technology_description: This integration uses Rclone’s official Google Photos remote to extract and restore data into a Kloset store.
categories: integrations
tags:
  - google photos
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
stage: test
date: 2025-07-26
plakar_version: ">=1.0.3"
integration_version: 0.1.0
resource_type: object-storage
provides:
  - source connector
  - destination connector
  - viewer
---

# Integration Package: Google Photos

## Introduction

This integration allows you to snapshot and restore Google Photos data using Plakar to store it in a Kloset store, while minimizing storage usage and ensuring strong data security.
It includes connectors that let you import and export snapshots to Google Photos itself, either from Google Photos or from other sources.
A Viewer is also provided to inspect, search, and restore snapshots without requiring full extraction.

**Use cases:**

* Cold backup of Google Photos library
* Long-term archiving and disaster recovery
* Portable export and vendor escape to other platforms

**Target technologies:**

* Supported versions: All Google Photos accounts supported by Rclone
* Supported editions: Personal and Business Google Photos
* System compatibility: macOS, Linux, Windows via Rclone

**Requirements:**

* Plakar version: >=1.0.3
* Integration version: 0.1.0
* Google Photos API credentials configured in Rclone

## Architecture

```
                                Viewer (CLI/UI)
                                  ↑
Google Photos ← Source Connector → Kloset Store
                                  ↓
                  Google Photos ← Destination Connector → Other compatible resources
```

**Components provided:**

* Source Connector: extract data from Google Photos
* Destination Connector: restore snapshots to Google Photos
* Viewer: browse and search snapshots in UI/CLI

## Installation

### Prerequisites 

This integration is distributed as an Rclone-powered connector.
You only need Plakar and Rclone installed.

Install Rclone: [https://rclone.org/install/](https://rclone.org/install/)
Configure your Google Photos remote: [https://rclone.org/googlephotos/](https://rclone.org/googlephotos/)

```bash
rclone config
```

After you can install it in a few seconds using Plakar’s built-in tooling.

**Install the package:**

Run the following command to install the integration:

```bash
plakar pkg add rclone
```

This will generate a portable .ptar archive and install it in your Plakar environment.

**Verify installation:**

Check that the integration appears in your available connectors:

```bash
plakar pkg
```

You should now see the rclone.

## Configuration

Once Rclone is configured, import it into Plakar.

### Source Connector

To import your rclone config as a source connector (to make backups), run:

```bash
rclone config show mygooglephotos | plakar source import
```

### Destination Connector

To import your rclone config as a destination connector (to restore backups), run:

```bash
rclone config show mygooglephotos | plakar destination import
```

> Replace `mygooglephotos` with your Rclone remote name.

## Usage

For the following examples, we will use `@mygooglephotos` as the Rclone remote name configured in Plakar.

First over all, we need to create a Kloset store to hold our snapshots:

```bash
plakar at ./backup create
```

A folder named `backup` will be created in the current directory, which will hold the snapshots.

### Snapshot

To back up your Google Photos data in the recently created Kloset store, use the following command:

```bash
plakar at ./backup backup @mygooglephotos
```

The last line of the output will show the snapshot ID, which you can use to inspect or restore later.

### Inspection

With Plakar, you can inspect your snapshots without extracting them.
You can list or display the contents of the Kloset store:

```bash
plakar at ./backup ls
plakar at ./backup cat <snapshot-id>:/path/to/file
plakar at ./backup ui
```

### Restore

To restore a snapshot back to Google Photos, use the following command:

```bash
plakar at ./backup restore -to @mygooglephotos <snapshot-id>
```

This will restore the snapshot to your Google Photos account, making it available in the same structure as it was when backed up.

## Integration-specific behaviors

### Limitations

* Google Photos API has rate limits, heavy usage may require throttling
* Only the latest version of files are snapshotted
* Shared links and permissions are not preserved in snapshots
* Cannot be used as a Kloset storage backend

## Appendix

* [Rclone Google Photos Docs](https://rclone.org/googlephotos/)
* [Plakar CLI Reference](/docs/main)